const mapStart = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
    [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
    [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0],
    [0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0],
    [0,2,2,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,2,2,0],
    [0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0],
    [5,5,5,5,5,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,5,5,5,5,5],
    [5,5,5,5,5,0,2,0,0,1,1,1,1,1,1,1,1,1,1,0,0,2,0,5,5,5,5,5],
    [5,5,5,5,5,0,2,0,0,1,0,0,0,4,4,0,0,0,1,0,0,2,0,5,5,5,5,5],
    [0,0,0,0,0,0,2,0,0,1,0,5,5,5,5,5,5,0,1,0,0,2,0,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,1,0,5,5,5,5,5,5,0,1,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,0,2,0,0,1,0,5,5,5,5,5,5,0,1,0,0,2,0,0,0,0,0,0],
    [5,5,5,5,5,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,5,5,5,5,5],
    [5,5,5,5,5,0,2,0,0,1,1,1,1,1,1,1,1,1,1,0,0,2,0,5,5,5,5,5],
    [5,5,5,5,5,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,5,5,5,5,5],
    [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
    [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
    [0,2,2,2,0,0,2,2,2,2,2,2,2,1,3,2,2,2,2,2,2,2,0,0,2,2,2,0],
    [0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0],
    [0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0],
    [0,2,2,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,2,2,0],
    [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0],
    [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];
let map;

let scale = initAndCountScale(window.innerWidth, window.innerHeight, mapStart[0].length, mapStart.length);
let status = "playing";
let running = "yes";

let lives = 3;
let score = 0;
let highScore = localStorage.getItem('highScore456890795349507') === null ? 0 : localStorage.getItem('highScore456890795349507'); // ну чтоб вдруг никто не изменил
let pacmanSpeed = 7;
let ghostSpeed = 7;
let pacmanSprite = document.querySelector('#pacman');
let ghostSpite = document.querySelector('#ghost');
let actorSize = scale*1.4;

let ghostSpriteLocs = {
    "red": {x: 0, y: 0},
    "orange": {x: 176, y: 0},
    "pink": {x: 0, y: 121},
    "blue": {x: 176, y: 121}
};

let infoCanvas = document.querySelector('#info');
let info2Canvas = document.querySelector('#info2');
let canvas = document.querySelector("canvas#game");
let cx = canvas.getContext("2d");

let infoCanvasContext = infoCanvas.getContext("2d");
let info2CanvasContext = info2Canvas.getContext("2d");

let wallSize = scale/3;
let pinkWallHeight = wallSize / 2;
let foodSize = scale / 5;
let wallInsideSize = wallSize / 4;

let pacman, ghosts = [];

function initAndCountScale(screenWidth, screenHeight, mapWidth, mapHeight) { // React...
    let dom = document.querySelector('#canvases')
    let canvas = document.createElement('canvas')
    let infoCanvas = document.createElement('canvas')
    let infoCanvas2 = document.createElement('canvas')
    let scale = Math.round(screenHeight * 0.8 / mapHeight);
    document.querySelector("#startInfo").style = `font-size: ${scale/1.5}px`
    dom.style.width = scale * mapWidth + "px";
    canvas.id = "game";
    canvas.width = scale * mapWidth;
    canvas.height = scale * mapHeight;
    infoCanvas.id = 'info';
    infoCanvas2.id = "info2"
    infoCanvas2.width = scale * mapWidth; infoCanvas2.height = scale * 3;
    infoCanvas.width = scale * mapWidth; infoCanvas.height = scale * 2;
    dom.appendChild(infoCanvas);
    dom.appendChild(canvas);
    dom.appendChild(infoCanvas2);
    return scale;
}

function wallAboutToUnit(about, unit, x, y, map, color) {
    let borderSize = (about - unit) / 2;
    if (y > 0 && map[y-1][x] === 0) { // стена сверху
        fillRect(x*scale+borderSize, y*scale, unit, unit + borderSize, color)
    }
    if (y < map.length-1 && map[y+1][x] === 0) { // стена снизу
        fillRect(x*scale+borderSize, y*scale+borderSize, unit, unit + borderSize, color)
    }
    if (x > 0 && map[y][x-1] === 0) { // стена слева
        fillRect(x*scale, y*scale+borderSize, unit + borderSize, unit, color)
    }
    if (x < map[0].length-1 && map[y][x+1] === 0) { // стена справа
        fillRect(x*scale+borderSize, y*scale+borderSize, unit + borderSize, unit, color)
    }
    if (!(y > 0 && map[y-1][x] === 0) && !(y < map.length-1 && map[y+1][x] === 0) && !(x > 0 && map[y][x-1] === 0) && !(x < map[0].length-1 && map[y][x+1] === 0)) {
        fillRect(x*scale+borderSize, y*scale+borderSize, unit, unit, color)
    }
}

function drawWall(x, y, map) {
    wallAboutToUnit(scale, wallSize, x, y, map, status === "won" && Math.floor(Date.now()/200) % 2 === 0 ? "white" : "#2020d7")
    wallAboutToUnit(scale, wallInsideSize, x, y, map, "black")
}

function fillSquares(about, unit, y, color) {
    let borderSize = (about - unit) / 2;
    for (let x = 0; x < map[0].length; x++) { // заполнение квалратиков внутри стен
        if (map[y][x] === 0) {
            if (x < map[0].length - 1 && y > 0 && map[y][x + 1] === 0 && map[y - 1][x + 1] === 0 && map[y - 1][x] === 0) {
                fillRect(x * scale + about - borderSize-1, y * scale - borderSize-1, borderSize * 2+2, borderSize * 2+2, color)
            }
        }
    }
}

function drawFood(x, y) {
    let space = (scale-foodSize) / 2
    fillRect(x*scale+space, y*scale+space, foodSize, foodSize, '#FFAAA5')
}

function drawScore() {
    infoCanvasContext.clearRect(0, 0, infoCanvas.width, infoCanvas.height);
    infoCanvasContext.font = `${scale/1.1}px Emulogic`;
    infoCanvasContext.fillStyle = "white";
    infoCanvasContext.fillText("1UP", scale*6, scale)
    infoCanvasContext.fillText(`${score}0`, scale*6, scale*2)
    infoCanvasContext.textAlign = "center";
    infoCanvasContext.fillText("High Score", scale*14, scale)
    infoCanvasContext.fillText(`${highScore}0`, scale*14, scale*2)
}

function drawLives() {
    info2CanvasContext.clearRect(0, 0, info2Canvas.width, info2Canvas.height);
    for (let i = 0; i < lives-1; i++) {
        info2CanvasContext.save()
        info2CanvasContext.translate(scale * (1.2*(i+1)+2), scale*1.2)
        info2CanvasContext.rotate(Math.PI)
        info2CanvasContext.drawImage(pacmanSprite, 40, 0, 20, 20, 0, 0, scale*1.2, scale*1.2)
        info2CanvasContext.restore();
    }
}

function drawInfo() {
    drawScore();
    drawLives();
}

function drawMap() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            switch (map[y][x]) {
                case 0: {
                    drawWall(x, y, map);
                    break;
                }
                case 2: {
                    drawFood(x, y);
                    break;
                }
                case 4: { // рисование розовой палки для дома привидений
                    let space = (scale - pinkWallHeight) / 2
                    fillRect(x * scale - (scale-wallSize)/2, y * scale + space, scale+(scale-wallSize), pinkWallHeight, '#fbbbd5');
                }
            }
        }
        fillSquares(scale, wallSize, y, "#2020d7");
        fillSquares(scale, wallInsideSize, y, "black")
    }
}

function createGhosts() {
    ghosts = [
        new Ghost("red", 13.5, 11, 2, "attack", Math.floor(Math.random()*2)+9),
        new Ghost("pink", 13.5, 14, 3, "in house 0", Math.floor(Math.random()*2)+9),
        new Ghost("blue", 11.5, 14, 3, "in house 5000", Math.floor(Math.random()*2)+9),
        new Ghost("orange", 15.5, 14, 3, "in house 10000", Math.floor(Math.random()*2)+9)
    ];
}

function keyHandler(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') pacman.setKey(0);
    else if (e.key === 'ArrowDown' || e.key === 's') pacman.setKey(1);
    else if (e.key === 'ArrowLeft' || e.key === 'a') pacman.setKey(2);
    else if (e.key === 'ArrowUp' || e.key === 'w') pacman.setKey(3);
}

function escapeHandler(e) {
    if (e.key === 'Escape') {
        if (running === "yes") running = "pausing";
        else if (running === "pausing") {
            running = "yes";
            animation(frame);
        }
    }
}

async function restart() {
    drawScore(); // при победе он нарисует последнее очко
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (status === 'death') runMap();
    else if (status === 'won') startGame();
}

async function gameOver() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    cx.font = `${scale}px Emulogic`;
    cx.fillStyle = "red";
    cx.fillText("GAME OVER", scale*9.5, scale*18)
}

function animation(frame) {
    window.addEventListener('keydown', keyHandler)
    let lastTime = null;
    function update(time) {
        if (lastTime !== null) {
            let elapsedTime = Math.min(time - lastTime, 50); // когда ты сворачииваешь окно пакман не улетает на гаити (а эта функция вызввается каждую секунду)
            if (frame(elapsedTime) === false) {
                window.removeEventListener('keydown', keyHandler);
                return;
            }
        }
        lastTime = time;
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

let frame = (elapsedTime) => {
    cx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawInfo();
    pacman.update(elapsedTime);
    ghosts.forEach(g => g.update(elapsedTime))

    if (!findFood()) status = "won";
    else if (lives <= 0) status = "lost";
    if (running === 'pausing') return false;
    if (status === 'death' || status === 'won') {restart(); return false}
    if (status === 'lost') {gameOver(); return false}
}

window.addEventListener('keydown', escapeHandler)

function runMap() {
    status = "playing";
    createGhosts();
    pacman = new Pacman(map[map.findIndex(n => n.includes(3))].indexOf(3)-0.5, map.findIndex(n => n.includes(3)));
    animation(frame);
}

function startGame() {
    map = copyMass(mapStart);
    runMap();
}

function startAfterSpace(e) {
    if (e.key === " ") {
        document.querySelector("#startInfo").remove();
        startGame();
        window.removeEventListener('keydown', startAfterSpace);
    }
}

window.addEventListener('keydown', startAfterSpace)