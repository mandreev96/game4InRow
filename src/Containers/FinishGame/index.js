import React from 'react'
import {Link} from 'react-router-dom'

class FinishGame extends React.Component{

    render() {
        return(
            <div className='finishGame'>
                <p><span>{this.props.winner}</span> your are winner!</p>
                <p><Link to={{pathname: '/'}}>Go to start page</Link></p>
            </div>
        )
    }
}

export default FinishGame