import crypto from 'crypto'

import { viewerName, viewerVersion, viewerPlatform } from '../viewerInfo'
import AvatarName from '../avatarName'

import { getLocalChatHistory, loadIMChats } from './chatMessageActions'
import { getAllFriendsDisplayNames } from './friendsActions'
import { fetchSeedCapabilities } from './llsd'
import connectCircuit from './connectCircuit'

// Actions for the session of an avatar

// Logon the user. It will post using fetch to the server.
export function login (firstName, lastName, password, grid) {
  return async (dispatch, getState, extra) => {
    if (getState().session.get('loggedIn')) throw new Error('There is already an avatar logged in!')

    const hash = crypto.createHash('md5')
    hash.update(password, 'ascii')
    const finalPassword = '$1$' + hash.digest('hex')

    const loginData = {
      grid,
      first: firstName,
      last: lastName,
      passwd: finalPassword,
      start: 'last',
      channel: viewerName,
      version: viewerVersion,
      platform: viewerPlatform,
      // mac will be added on the server side
      options: [
        'buddy-list'
      ],
      agree_to_tos: 'true',
      read_critical: 'true'
    }

    const circuit = import('../network/circuit')

    const response = await window.fetch('/hoodie/andromeda-viewer/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const body = await response.json()

    if (body.login !== 'true') throw body

    // Set the active circuit
    extra.circuit = connectToSim(body, await circuit)
    dispatch(connectCircuit()) // Connect message parsing with circuit.

    const avatarName = new AvatarName({first: body.first_name, last: body.last_name})
    const avatarIdentifier = `${avatarName.getFullName()}@${grid.name}`
    const localChatHistory = await dispatch(getLocalChatHistory(avatarIdentifier))

    dispatch({
      type: 'didLogin',
      name: avatarName,
      avatarIdentifier,
      grid,
      uuid: body.agent_id,
      buddyList: body['buddy-list'],
      sessionInfo: body,
      localChatHistory
    })

    dispatch(loadIMChats())
    dispatch(fetchSeedCapabilities(body['seed_capability']))
      .then(() => dispatch(getAllFriendsDisplayNames()))

    extra.circuit.on('KickUser', msg => dispatch(getKicked(msg)))

    return body
  }
}

// Placeholder for the logout process
export function logout () {
  return (dispatch, getState, {circuit}) => {
    const session = getState().session
    if (!session.get('loggedIn')) {
      throw new Error("You aren't logged in!")
    }

    circuit.send('LogoutRequest', {
      AgentData: [
        {
          AgentID: session.get('agentId'),
          SessionID: session.get('sessionId')
        }
      ]
    }, true)

    dispatch({
      type: 'StartLogout'
    })

    circuit.once('LogoutReply', msg => {
      dispatch({
        type: 'DidLogout'
      })

      circuit.close()
    })
  }
}

// Login to a sim. Is called on the login process and sim-change
function connectToSim (sessionInfo, circuit) {
  const Circuit = circuit.default
  const circuitCode = sessionInfo.circuit_code
  const activeCircuit = new Circuit(sessionInfo.sim_ip, sessionInfo.sim_port, circuitCode)

  activeCircuit.send('UseCircuitCode', {
    CircuitCode: [
      {
        Code: circuitCode,
        SessionID: sessionInfo.session_id,
        ID: sessionInfo.agent_id
      }
    ]
  }, true)

  activeCircuit.send('CompleteAgentMovement', {
    AgentData: [
      {
        AgentID: sessionInfo.agent_id,
        SessionID: sessionInfo.session_id,
        CircuitCode: circuitCode
      }
    ]
  }, true)

  activeCircuit.send('AgentUpdate', {
    AgentData: [
      {
        AgentID: sessionInfo.agent_id,
        SessionID: sessionInfo.session_id,
        BodyRotation: [0, 0, 0],
        HeadRotation: [0, 0, 0],
        State: 0,
        CameraCenter: [0, 0, 0],
        CameraAtAxis: [0, 0, 0],
        CameraLeftAxis: [0, 0, 0],
        CameraUpAxis: [0, 0, 0],
        Far: 0,
        ControlFlags: 0,
        Flags: 0
      }
    ]
  }, true)

  activeCircuit.send('UUIDNameRequest', {
    UUIDNameBlock: [
      {
        ID: sessionInfo.agent_id
      }
    ]
  }, true)

  setTimeout(function () {
    activeCircuit.send('RequestRegionInfo', {
      AgentData: [
        {
          AgentID: sessionInfo.agent_id,
          SessionID: sessionInfo.session_id
        }
      ]
    }, true)
  }, 100)

  return activeCircuit
}

function getKicked (msg) {
  return (dispatch, getState, {circuit}) => {
    const session = getState().session
    const agentId = session.get('agentId')
    const sessionId = session.get('sessionId')
    const msgAgentId = msg.getValue('UserInfo', 0, 'AgentID')
    const msgSessionId = msg.getValue('UserInfo', 0, 'SessionID')

    if (agentId === msgAgentId && sessionId === msgSessionId) {
      circuit.close()
      dispatch({
        type: 'UserWasKicked',
        reason: msg.getStringValue('UserInfo', 0, 'Reason')
      })
    }
  }
}