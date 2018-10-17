import React from 'react'
import './style.css'

class Cell extends React.Component {
    constructor() {
        super()
        this.colors = this.colors.bind(this)
    }

    colors(data) {
        if (data == 1) {
            return 'red cell'
        }
        else if (data == 2 ){
            return 'blue cell'
        }
        else if (this.props.last == true) {
            return 'cell hover'
        }
        else if (data == 3) {
            return 'cell winner'
        }
        else {
            return 'cell'
        }
    }

    render() {
        return(
            <div className={this.colors(this.props.data)} ></div>
        )
    }
}

export default Cell