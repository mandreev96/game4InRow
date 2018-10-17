import React from 'react'
import { Route, HashRouter } from 'react-router-dom'
import Game from './Containers/Game/index'
import StartScreen from './Containers/StartScreen/index'
import FinishGame from './Containers/FinishGame/index'
import './App.css'

class App extends React.Component {

    render() {
        return(
            <HashRouter>
                <div>
                    <Route path='/' exact component={StartScreen}/>
                    <Route path='/game' exact component={Game} />
                    <Route path='/game/finishgame' component={FinishGame}/>
                </div>
            </HashRouter>
        )
    }
}

export default App