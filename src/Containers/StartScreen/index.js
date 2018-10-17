import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'
import axios from 'axios'
import Modal from 'react-modal'
import 'font-awesome/css/font-awesome.min.css'


class StartScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            playerName: '',
            server: '192.168.0.104',
            inputState: false
        }
        this.setPlayerName = this.setPlayerName.bind(this)
        this.sendName = this.sendName.bind(this)
        this.checkPlayerName = this.checkPlayerName.bind(this)
        this.changeWaiting = this.changeWaiting.bind(this)
        this.waitingGame = this.waitingGame.bind(this)
    }



    setPlayerName(event) {
        this.setState({
            playerName: event.target.value
        })
    }


    sendName() {
        if (this.state.playerName !== '') {
            axios.post(`http://${this.state.server}:5000/startscreen`,
                {
                    playerName: this.state.playerName
                })
                .then((res) => {
                    this.setState({
                        waiting: res.data.waiting,
                        inputState: true,
                        playerNum: res.data.playerNum
                    })
                })
                .catch((error) => {
                    console.log('false')
                })
        } else {
            alert('Enter player name')
        }
    }

    checkPlayerName() {
        if ((this.state.playerName !== '')&&(this.state.waiting === false)) {
            return '/game'
        } else {
            return '/'
        }
    }

    changeWaiting() {
        this.setState({
            waiting: false
        })
    }

    waitingGame() {
        axios.get(`http://${this.state.server}:5000/waiting`)
            .then((res) => {
                if (res.data.startGame === true) {
                    this.setState({
                        waiting: false,
                        playerVsName: res.data.playerVsName
                    })
                }
            })
    }

    componentDidMount() {
        this.timerWaiting = setInterval(() => {
            if (this.state.waiting === true) {
                this.waitingGame()
            }
        }, 3000)
    }

    componentWillUnmount() {
        clearInterval(this.timerWaiting)
    }

    render() {
        return(
            <div className='startScreen'>
                <h2>4 In a Row</h2>
                <input type="text" placeholder='Enter your name' disabled={this.state.inputState} value={this.state.playerName} onChange={this.setPlayerName}/>
                <br/>
                <br/>
                {(this.state.inputState === false) && <div className='lookPlayer' onClick={this.sendName}>
                    Look for a player 2
                </div>}
                {((this.state.inputState === true)&&(this.state.waiting !== false)) &&
                <div>Wait player 2 <i className="fa fa-spinner fa-spin" aria-hidden="true"></i></div>}
                <br/>
                {(this.state.waiting === false) &&
                <div>
                    <p>Player was found <i className="fa fa-check-circle" aria-hidden="true"></i></p>
                    <p>{this.state.playerVsName}</p>
                    <Link to={{
                        pathname: `${this.checkPlayerName()}`,
                        state: {
                            fromStartScreen: true,
                            playerName: this.state.playerName,
                            playerNum: this.state.playerNum,
                            playerVsName: this.state.playerVsName
                        }}} className='link'> Go to game! </Link>
                </div>}

            </div>
        )
    }

}

export default StartScreen