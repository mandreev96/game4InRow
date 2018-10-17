import React from 'react'
import './style.css'

class Info extends React.Component {
    constructor() {
        super()
        this.state = {
            color: '',
            opponentName: ''
        }
        this.choiceColor = this.choiceColor.bind(this)
    }


    choiceColor(player) {
        if (player === 1) {
            this.setState({
                color: 'red'
            })
        } else {
            this.setState({
                color: 'blue'
            })
        }
    }


    componentDidMount() {
        this.choiceColor(this.props.playerNum)
    }


    render() {
        return(
            <div className='info'>
                <div>You play against {this.props.opponentName}</div>
                <div>Your color is <span>{this.state.color}</span></div>
                {(this.props.currentPlayer === true) ?
                    <div>You move!</div> :
                    <div>{this.props.opponentName} is moving...</div>}
                <div className='reset' onClick={this.props.reset}>Reset</div>
            </div>
        )
    }

}

export default Info