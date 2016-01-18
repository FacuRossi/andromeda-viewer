'use strict'

/*
 * Entrypoint into the app on the client side
 *
 */

var viewerInfo = require('./js/viewerInfo.js')
var AvatarName = require('./js/avatarName.js')
var session = require('./js/session.js')

function displayLoginError (message) {
  var messageDisplay = document.getElementById('loginErrorMessage')
  messageDisplay.textContent = message.toString()
  messageDisplay.style.display = 'block'
}

// Show the name of the Viewer
document.title = viewerInfo.name
document.getElementById('loginViewerName').textContent = viewerInfo.name

var button = document.getElementById('loginButton')

// Login
button.addEventListener('click', function (event) {
  var loginName = document.getElementById('loginName').value
  var password = document.getElementById('loginPassword').value

  if (loginName.length === 0 || password.length === 0) {
    displayLoginError('Please insert a name and a password')
    return
  }

  button.disabled = true
  button.value = 'Connecting ...'

  var userName = new AvatarName(loginName)

  session.login(userName.first, userName.last, password, function (err, sinfo) {
    if (err) {
      // Displays the error message from the server
      console.error(err)
      button.disabled = false
      button.value = 'Login'
      displayLoginError(err.message)
    } else {
      // start everything
      var display = require('./js/components/main.jsx')
      display()
    }
  })
})

button.disabled = false