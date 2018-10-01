import React from 'react'
import styled from 'styled-components'

import chatBubble from '../icons/chat_bubble.svg'

const Outer = styled.div`
  padding: 1em;
`

const ListTitle = styled.div`
  font-size: 120%;
  border-bottom: 1px solid grey;
`

const List = styled.ul`
  list-style: none;
  padding-left: 1em;
  max-width: 15cm;
  margin-left: auto;
  margin-right: auto;
`

const ListItem = styled.li`
  display: flex;
  flex-direction: row;
  padding: 0.2em;
  border-radius: 0.2em;

  &:nth-child(even) {
    background-color: rgb(173, 173, 173);
  }
`

const NameCell = styled.div`
  flex: auto;
`

const ListItemLink = styled.a`
  flex: 20px 0 0;
`

function GroupRow ({ group }) {
  const name = group.get('name')

  return <ListItem>
    <NameCell>{name}</NameCell>
    <ListItemLink
      href='#startChat'
      onClick={event => {
        event.preventDefault()
        console.log('start chat of group ' + name)
      }}>
      <img src={chatBubble} height='20' width='20' alt={`Start new chat with ${name}`} />
    </ListItemLink>
  </ListItem>
}

export default function GroupsList ({ groups }) {
  return <Outer>
    <ListTitle>Groups</ListTitle>
    <List>
      {groups.map(group => <GroupRow
        key={group.get('id')}
        group={group}
      />)}
    </List>
  </Outer>
}