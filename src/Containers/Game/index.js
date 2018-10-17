import React, { Component } from 'react';
import './style.css';
import { Redirect } from 'react-router-dom'
import Table from '../../Components/Table/index'
import Info from '../../Components/Info/index'
import axios from 'axios'
import Modal from 'react-modal'

class Game extends Component {
    constructor() {
        super()
        this.state = {
            data: [[0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,0,0,0,0]
            ],
            finishGame: false,
            modalReset: false,
            server: '192.168.0.104'
        }

        this.clickColumn = this.clickColumn.bind(this)
        this.finishGame = this.finishGame.bind(this)
        this.loadField = this.loadField.bind(this)
        this.sendReset = this.sendReset.bind(this)
        this.whoMoves = this.whoMoves.bind(this)
    }


    sendReset() {
        axios.post(`http://${this.state.server}:5000/game/reset`, {
            reset: true
            })
            .then((response) => {

            })
    }

    whoMoves(playerNum, currentPlayer) {
        let state;
        if (currentPlayer === playerNum) {
            state = true
        } else {
            state = false
        }
        return state
    }

    loadField() {
        axios.get(`http://${this.state.server}:5000/game/status`)
            .then((response) => {
                this.setState({
                    data: response.data.field,
                    currentPlayer: this.whoMoves(this.props.location.state.playerNum, response.data.currentPlayer)
                })
                console.log(response.data)
                if (response.data.gameState.finishGame === true) {
                    console.log(response.data.gameState)
                    let field = [...this.state.data],
                        cells = [];
                    if (response.data.gameState.winner == 1) {
                        cells = response.data.gameState.lastCells[0]
                    } else {
                        cells = response.data.gameState.lastCells[1]
                    }
                    for (let k = 0; k < 4; k++) {
                        field[cells[k].i][cells[k].j] = 3
                    }
                    this.setState({
                        data: field
                    })
                    this.timerFinish = setInterval(this.finishGame, 7000)
                    clearInterval(this.timerReload)
                    axios.post(`http://${this.state.server}:5000/game/finishgame`, {
                        closeGame: true
                    })
                        .then((res) => {
                            console.log(res.data)
                        })
                }
            })
            .catch((error) => {
                alert(JSON.stringify(error))
            })
    }


    clickColumn(i) {
        axios.post(`http://${this.state.server}:5000/game/move`,
            {
                column: i,
                player: this.props.location.state.playerNum
            })
            .then((response) => {
                console.log(response.data.data)
                this.setState({
                    data: response.data.data,
                    currentPlayer: this.whoMoves(this.props.location.state.playerNum, response.data.currentPlayer)
                })
                console.log(response.data.currentPlayer)
            })
            .catch((error) => {
                console.log('error')
            })
    }


    finishGame() {
        this.setState({
            finishGame: true
        })
    }



    componentDidMount() {
        this.timerReload = setInterval(() => {this.loadField()}, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.timerReload)
        clearInterval(this.timerFinish)
    }


    render() {
        if (this.state.finishGame === true) {
            return <Redirect to='/game/finishgame'/>
        }
        const state = this.props.location.state;
        if (!state || !state.fromStartScreen) {
            return <Redirect to='/'/>
        }
        return (
            <div className="game">
                <Info playerNum={this.props.location.state.playerNum}
                      reset={this.reset}
                      sendName={this.props.location.state.playerName}
                      opponentName={this.props.location.state.playerVsName}
                      currentPlayer={this.state.currentPlayer}/>
                <Table data = {this.state.data} clickColumn={this.clickColumn} />
                <Modal isOpen={this.state.modalReset}>
                    <h1>Your want reset game?</h1>
                    <button onClick={this.noReset}>Yes</button>
                    <button onClick={this.noReset}>No</button>
                </Modal>
            </div>
        );
    }
}

export default Game;