import React from 'react'
import './style.css'
import Column from './Column/index'

class Table extends React.Component {
    showColumns(data) {
        return data.map((el, index) => (
            <Column data={el} key={index} onPress={this.props.clickColumn} i={index} />
        ))
    }
    render() {
        return (
            <div className='table'>
                {this.showColumns(this.props.data)}
            </div>
        )
    }
}

export default Table