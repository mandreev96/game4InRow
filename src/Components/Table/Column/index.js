import React from 'react'
import './style.css'
import Cell from "../Cell";

class Column extends React.Component {
    constructor(){
        super()
        this.onClick = this.onClick.bind(this)
        this.searchLastCell = this.searchLastCell.bind(this)
    }

    showCells(data) {
        return data.map((el, index) => (
            <Cell data={el} key={index} last={this.searchLastCell(index)}/>
        ))
    }

    onClick() {
        this.props.onPress(this.props.i)
        this.searchLastCell()
    }

    searchLastCell(el) {
        let mass = this.props.data,
            lastIndex = mass.lastIndexOf(0);
        if (el == lastIndex) {
            return true
        }
    }


    render() {
        return(
            <div className='column' onClick={this.onClick}>
                {this.showCells(this.props.data)}
                </div>
        )
    }
}

export default Column