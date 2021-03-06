import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 15em;
  background-color: rgb(110, 110, 110);
  margin: 1em;
  padding: 1em;
  padding-top: 0px;
  border-radius: .5em;
  box-shadow: 0.2em 0.2em 0.4em 0.1em black;
`

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const SignInButton = styled.button`
  width: 5em;
  border: 0px;
  border-radius: 1em;
  padding: 5px;
  white-space: nowrap;
  font-size: 130%;
  box-shadow: 2px 2px 5px black;
`

const Separator = styled.div`
  margin-left: 0.6em;
  margin-right: 0.6em;
`

export default function SignIn ({ showSignInPopup }) {
  return <Container>
    <h3>New to this viewer?</h3>
    <ButtonRow>
      <SignInButton onClick={() => { showSignInPopup() }}>Sign In</SignInButton>
      <Separator>or</Separator>
      <SignInButton onClick={() => { showSignInPopup('signUp') }}>Sign Up</SignInButton>
    </ButtonRow>
  </Container>
}
