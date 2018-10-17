var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var cors = require('cors')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}))
app.use(cors())

const field = [[0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0]
];

let currentPlayer = 1;

let gameState = {
    finishGame: false,
    winner: currentPlayer
}
const games = [],
      buildGame = {};

let resetState = {};


function clearBulidGame() {
    buildGame.player1name = null;
    buildGame.player1IP = null;
    buildGame.player1num = null;
    buildGame.player2name = null;
    buildGame.player2IP = null;
    buildGame.player2num = null;
    buildGame.startGame = false;
}

app.post('/startscreen', function (req, res) {     // Хранение игроков
    if ((buildGame.player1name === undefined)||(buildGame.player1name === null)) {
            buildGame.player1name = req.body.playerName;
            buildGame.player1IP = req.connection.remoteAddress;
            buildGame.player1num = 1;
            buildGame.player2name = null;
            buildGame.player2IP = null;
            buildGame.player2num = 2;
            buildGame.startGame = false;
        res.send(
            {
                waiting: true,
                playerNum: 1,
                index: games.length-1
            }
        )
    } else {
        buildGame.player2name = req.body.playerName
        buildGame.player2IP = req.connection.remoteAddress
        buildGame.startGame = true
        res.send({
            waiting: true,
            playerNum: 2
        })
    }
    console.log(buildGame)
})


function checkNumPlayer(playerIP) {
    if (playerIP == buildGame.player1IP) {
        return 1
    } else if (playerIP == buildGame.player2IP) {
        return 2
    } else {
        return 0
    }
}

app.get('/waiting', function (req, res) {
    if (((buildGame.player1name)||(buildGame.player2name))&&(buildGame.startGame === true)) {
        games.push(buildGame)
        if (checkNumPlayer(req.connection.remoteAddress) == 1) {
            res.send({
                startGame: true,
                playerVsName: buildGame.player2name,
                index: games.length-1
            })
        } else {
            res.send({
                startGame: true,
                playerVsName: buildGame.player1name,
                index: games.length-1
            })
        }
    } else {
        res.send({
            startGame: false
        })
    }
    console.log(games)
})

                          // Обновление поля
app.get('/game/status', function (req, res) {
    res.send({field, currentPlayer, gameState})
})

function clearField() {
    for (let i = 0; i<field.length; i++) {
        for (let j=0; j<field[0].length; j++) {
            field[i][j] = 0
        }
    }
}

app.post('/game/reset', function (req, res) {

})

app.post('/game/move', function (req, res) {     // Ход игрока
    let column = req.body.column;
    let nowPlayer = req.body.player;
    let lastIndex = field[column].lastIndexOf(0);
    if ((lastIndex !== -1) && (nowPlayer == currentPlayer)) {
        field[column][lastIndex] = (currentPlayer === 1) ? 1 : 2;
        gameState = checkField();
        currentPlayer = (currentPlayer === 1) ? 2 : 1;
    }
    let data = [...field]
    res.send({
        data,
        gameState,
        currentPlayer
    });
    console.log(gameState);
})

let stateFinish = 0;
app.post('/game/finishgame', function (req, res) {
    if (req.body.closeGame === true) {
        stateFinish += 1;
        if (stateFinish === 2) {
            clearField()
            gameState.finishGame = false
            clearBulidGame()
            stateFinish = 0
        }
    }
    console.log(buildGame)
    res.send({
        clearState: true
    })
})




app.listen(5000, ()=> {
    console.log('Server was started')
});

function lightningLastCells(i, j, playerNum, lastCells) {
    if (playerNum == 1) {
        lastCells[0].push({
            i: i,
            j: j
        });
        if (lastCells[0].length === 5) {
            lastCells[0].splice(0,1)
        }
    }
    if (playerNum == 2) {
        lastCells[1].push({
            i: i,
            j: j
        })
        if (lastCells[1].length === 5) {
            lastCells[1].splice(0,1)
        }
    }
}

function checkField() {
    let player1 = 0,
        player2 = 0,
        fields = field,
        sum = [],
        checkDraw = 0,
        lastCells = [[],[]];

    checkDraw:
        for (let i=0; i<fields.length; i++){
            for (let j=0; j<fields.length; j++) {
                if (fields[i][j] === 0) {
                    checkDraw += 1
                }
            }
        }
    if (checkDraw === 0) {
        return 'Nichya'
    }

    horizontal:
        for (let i=0; i<fields.length; i++) {
            player1 = 0
            player2 = 0
            for (let j=0; j<fields[0].length; j++) {
                if (fields[i][j] == 1) {
                    player1 += 1
                    player2 = 0
                    lightningLastCells(i, j, 1, lastCells)
                    if (player1 === 4) {
                        return {
                            finishGame: true,
                            winner: currentPlayer,
                            lastCells: lastCells
                        }
                        break horizontal
                    }
                }
                else if (fields[i][j] == 2) {
                    player2 += 1
                    player1 = 0
                    lightningLastCells(i, j, 2, lastCells)
                    if (player2 === 4) {
                        return {
                            finishGame: true,
                            winner: currentPlayer,
                            lastCells: lastCells
                        }
                        break horizontal
                    }
                }
                else {
                    player1 = 0
                    player2 = 0
                    sum = []
                }
            }
        }
    vertical:
        for (let i=0;i<fields[0].length;i++){
            player1 = 0
            player2 = 0
            for (let j=0;j<fields.length;j++){
                if (fields[j][i] == 1){
                    player1 += 1
                    player2 = 0
                    lightningLastCells(i, j, 1, lastCells)
                    if (player1 === 4) {
                        return {
                            finishGame: true,
                            winner: currentPlayer,
                            lastCells: lastCells
                        }
                        break vertical
                    }
                }
                else if (fields[j][i] == 2){
                    player2 += 1
                    player1 = 0
                    lightningLastCells(i, j, 2, lastCells)
                    if (player2 === 4) {
                        return {
                            finishGame: true,
                            winner: currentPlayer,
                            lastCells: lastCells
                        }
                        break vertical
                    }
                }
                else {
                    player1 = 0
                    player2 = 0
                }
            }
        }
    diagonalToLeft:
        for (let i=0; i < fields.length-3 ; i++){

            for (let j=0; j < fields[0].length - 3; j++) {
                player1 = 0
                player2 = 0
                for (let k=0; k < 4; k++) {
                    if (fields[i+k][j+k] == 1) {
                        player1 += 1
                        player2 = 0
                        lightningLastCells(i+k, j+k, 1, lastCells)
                        if (player1 === 4) {
                            return {
                                finishGame: true,
                                winner: currentPlayer,
                                lastCells: lastCells
                            }
                            break diagonalToLeft
                        }
                    }
                    else if (fields[i+k][j+k] == 2) {
                        player2 += 1
                        player1 = 0
                        lightningLastCells(i+k, j+k, 2, lastCells)
                        if (player2 === 4) {
                            return {
                                finishGame: true,
                                winner: currentPlayer,
                                lastCells: lastCells
                            }
                            break diagonalToLeft
                        }
                    }
                    else {
                        player1 = 0
                        player2 = 0
                    }
                }
            }
        }
    diagonalToRight:
        for (let i = fields.length - 4; i < fields.length; i++) {
            for (let j = 0; j <= fields[0].length - 4; j++) {
                player1 = 0
                player2 = 0
                for (let k = 0; k < 4; k++) {
                    if (fields[i - k][j + k] == 1) {
                        player1 += 1
                        player2 = 0
                        lightningLastCells(i-k, j+k, 1, lastCells)
                        if (player1 === 4) {
                            return {
                                finishGame: true,
                                winner: currentPlayer,
                                lastCells: lastCells
                            }
                            break diagonalToRight
                        }
                    }
                    else if (fields[i - k][j + k] == 2) {
                        player2 += 1
                        player1 = 0
                        lightningLastCells(i-k, j+k, 2, lastCells)
                        if (player2 === 4) {
                            return {
                                finishGame: true,
                                winner: currentPlayer,
                                lastCells: lastCells
                            }
                            break diagonalToRight
                        }
                    }
                    else {
                        player1 = 0
                        player2 = 0
                    }
                }
            }
        }
    return {
        finishGame: false
    }
}

