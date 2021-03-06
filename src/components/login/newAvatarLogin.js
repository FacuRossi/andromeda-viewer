import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgb(110, 110, 110);
  margin: 1em;
  padding: 1em;
  border-radius: .5em;
  box-shadow: 0.2em 0.2em 0.4em 0.1em black;

  & > span, & > div {
    margin-top: .7em;
  }

  @supports (display: grid) {
    display: grid;
    grid-template-areas:
      "title title title"
      "name name-input name-input"
      "password password-input password-input"
      "grid grid-select grid-select"
      "new-grid new-grid new-grid"
      ". save login";
    grid-gap: .5em;
    text-align: left;

    & > span, & > div {
      margin-top: 0em;
    }
  }

  &.not-selected {
    cursor: pointer;
    background-color: rgb(95, 95, 95);
    box-shadow: 0.1em 0.1em 0.3em 0px black;
  }

  & input:invalid {
    outline: 1px solid red;
  }
`

const Title = styled.h3`
  grid-area: title;
  margin: .3em;
  text-align: center;
  white-space: nowrap;
`

const ActiveText = styled.span`
  grid-area: password / password / password-input-end / password-input-end;
  text-align: center;
  color: rgba(255, 255, 255, .7);
`

const Name = styled.span`
  grid-area: name;
`

const NameInput = styled.input`
  grid-area: name-input;
`

const Password = styled.span`
  grid-area: password;
`

const PasswordInput = styled.input`
  grid-area: password-input;
`

const Grid = styled.span`
  grid-area: grid;
`

const GridSelect = styled.select`
  grid-area: grid-select;
`

const SaveNew = styled.div`
  grid-area: save;
`

const LoginButton = styled.button`
  grid-area: login;
`

const NewGridLine = styled.fieldset`
  grid-area: new-grid;
  display: ${props => props.show ? 'flex' : 'none'};
  flex-direction: row;
  text-align: center;

  & > div {
    flex: auto;
  }

  @media (max-width: 450px) {
    flex-direction: column;
    
    & > div {
      display: flex;
      justify-content: space-between;
    }
  }
`

export default class NewAvatarLogin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      password: '',
      grid: 'Second Life',
      save: false,
      newGridName: '',
      newGridURL: '',
      valid: {
        name: false,
        password: false,
        grid: false, // is not used
        newGridName: false,
        newGridURL: false
      }
    }

    this._boundName = this._inInputChange.bind(this, 'name')
    this._boundPassword = this._inInputChange.bind(this, 'password')
    this._boundGridChange = this._inInputChange.bind(this, 'grid')
    this._boundSaveChange = this._saveChange.bind(this)

    this._boundNewGridName = this._inInputChange.bind(this, 'newGridName')
    this._boundNewGridURL = this._inInputChange.bind(this, 'newGridURL')

    this._boundLogin = this._onLogin.bind(this)
    this._boundKeyUp = this._onKeyUp.bind(this)
  }

  componentDidMount () {
    this.setState({
      save: this.props.isSignedIn
    })
  }

  componentWillReceiveProps (nextProps) {
    if (
      this.props.isSignedIn !== nextProps.isSignedIn &&
      this.state.name.length === 0 &&
      this.state.password.length === 0
    ) {
      this.setState({
        save: nextProps.isSignedIn
      })
    }
  }

  _inInputChange (key, event) {
    this.setState({
      [key]: event.target.value
    })

    const valid = event.target.validity.valid

    if (this.state.valid[key] !== valid) {
      const newValidState = Object.assign({}, this.state.valid, {
        [key]: valid
      })

      // setState collects all changes and applies it after this function call ends
      this.setState({
        valid: newValidState
      })
    }
  }

  _saveChange (event) {
    this.setState({
      save: event.target.checked
    })
  }

  _onLogin (event) {
    if (event && event.preventDefault) {
      event.preventDefault()
    }

    const name = this.state.name
    const password = this.state.password
    const grid = this.state.grid !== ''
      ? this.state.grid
      : {
        name: this.state.newGridName,
        url: this.state.newGridURL
      }
    const save = this.state.save && this.props.isSignedIn

    this.props.onLogin(name, password, grid, save)
  }

  _onKeyUp (event) {
    if (event.keyCode === 13) {
      this._onLogin(event)
    }
  }

  render () {
    if (!this.props.isSelected) {
      const onSetActive = event => {
        event.preventDefault()
        this.props.onSelect('new')
      }

      return <Container onClick={onSetActive} className='not-selected'>
        <Title>Add avatar or login anonymously</Title>

        <ActiveText>click to add</ActiveText>
      </Container>
    }

    const grids = this.props.grids.map(grid => {
      const name = grid.get('name')
      return <option key={name} value={name}>
        {name}
      </option>
    })

    const isNewGrid = this.state.grid === ''

    const gridIsValid = !isNewGrid ||
      (this.state.valid.newGridName && this.state.valid.newGridURL)

    const isValid = this.state.valid.name &&
      this.state.valid.password &&
      gridIsValid

    return <Container>
      <Title>
        {this.props.isSignedIn ? 'Add avatar or ' : ''}
        login anonymously
      </Title>

      <Name>Avatar:</Name>
      <NameInput
        type='text'
        onChange={this._boundName}
        onKeyUp={this._boundKeyUp}
        disabled={this.props.isLoggingIn}
        minLength='1'
        required
        autoFocus
      />

      <Password>Password:</Password>
      <PasswordInput
        type='password'
        value={this.state.password}
        onChange={this._boundPassword}
        onKeyUp={this._boundKeyUp}
        disabled={this.props.isLoggingIn}
        minLength='2'
        required
      />

      <Grid>Grid:</Grid>
      <GridSelect value={this.state.grid} onChange={this._boundGridChange}>
        {grids}
        <option value=''>+ Add new Grid</option>
      </GridSelect>

      <NewGridLine show={isNewGrid}>
        <legend>Add a new Grid</legend>

        <div>
          Name
          <input
            type='text'
            value={this.state.newGridName}
            onChange={this._boundNewGridName}
            onKeyUp={this._boundKeyUp}
            minLength='1'
            required={isNewGrid}
          />
        </div>
        <div>
          URL
          <input
            type='url'
            placeholder='https://example.com/login'
            value={this.state.newGridURL}
            onChange={this._boundNewGridURL}
            onKeyUp={this._boundKeyUp}
            required={isNewGrid}
          />
        </div>
      </NewGridLine>

      <SaveNew title="Save and sync this avatar and it's chats">
        <input
          id='saveNewAvatarButton'
          type='checkbox'
          onChange={this._boundSaveChange}
          checked={this.state.save}
          disabled={!this.props.isSignedIn || this.props.isLoggingIn}
        />
        <label htmlFor='saveNewAvatarButton'>Save / Add</label>
      </SaveNew>
      <LoginButton
        onClick={this._boundLogin}
        disabled={this.props.isLoggingIn || !isValid}
      >
        {this.props.isLoggingIn === this.state.name ? 'Connecting ...' : 'Login'}
      </LoginButton>
    </Container>
  }
}
