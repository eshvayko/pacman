class Ghost {
    constructor(color, x, y, direction, state, visible) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.nextDirection = direction;
        this.state = state; // в домике туда-сюда или хадьба по карте
        this.visible = visible; // раддиус видимости пакмана для привижегия
    }

    move(add) {
        this.checkTeleportPos()
        switch (this.direction) {
            case 0: {
                this.x = roundWithSigns(this.x+add, 5);
                break;
            } case 1: {
                this.y = roundWithSigns(this.y+add, 5);
                break;
            } case 2: {
                this.x = roundWithSigns(this.x-add, 5);
                break
            } case 3: {
                this.y = roundWithSigns(this.y-add, 5);
                break;
            }
        }
    }

    checkTeleportPos() {
        if (this.x <= -1*(actorSize/scale) && this.y === 14) {
            this.x = map[0].length;
        } else if (this.x >= map[0].length-1+(actorSize / scale) && this.y === 14) {
            this.x = -1*(actorSize/scale);
        }
    }

    draw() {
        let {x, y} = ghostSpriteLocs[this.color];
        cx.drawImage(ghostSpite, x, y, 124, 116,
                                this.x*scale+scale/2-actorSize/2, this.y*scale+scale/2-actorSize/2, actorSize, actorSize)
    }

    calculateDirection(elapsedTime) {
        if (this.state === "random") {
            if (countDist(this.x, this.y, pacman.x, pacman.y) < this.visible) this.state = "attack";
            let random = Math.random(); // ваще на рандом
            if (this.direction % 2 === 0) {
                if (random < 0.25) this.nextDirection = 1;
                else if (random < 0.5) this.nextDirection = 3;
            } else {
                if (random < 0.25) this.nextDirection = 0;
                else if (random < 0.5) this.nextDirection = 2;
            }
        } else if (this.state.includes("in house")) {
            let state = this.state.split(" ");
            let time = Number(state[state.length-1]);
            if (time > 0) {
                time -= elapsedTime;
                state.pop()
                state.push(time);
                this.state = state.join(" ");
                let lastX = this.x, lastY = this.y;
                this.move(1*elapsedTime/1000)
                if (this.isCollideWithWall(this.x, this.y)) {this.x = lastX; this.y = lastY; this.nextDirection = this.nextDirection === 1 ? 3 : 1}
            } else {
                if (this.y === 11) {this.state = "attack"; return;}
                let add = 1*elapsedTime/1000;
                if (this.x+add < 13.5 && this.direction !== 2) {this.nextDirection = 0}
                else if (this.x-add > 13.5 && this.direction !== 0) {this.nextDirection = 2}
                else {this.nextDirection = 3; this.x = 13.5}
            }
        } else if (this.state === "attack") {
            if (countDist(this.x, this.y, pacman.x, pacman.y) > this.visible) this.state = "random";
            let route, dot;
            if (this.color !== "pink") {
                dot = {x: pacman.x, y: pacman.y};
            } else if (this.color === "pink") {
                let adds = [[4,0], [0,4], [-4, 0], [0, -4]];
                let curr = adds[pacman.direction]
                dot = {x: pacman.x+curr[0], y: pacman.y+curr[1]};
            }
            route = this.findRoute(this.x, this.y, dot.x, dot.y)

            if (route.length === 0) {this.state = "random"; return;} // там просто когда я
            let nextPoint = !route[1] ? route[0] : route[1];
            if (nextPoint.x > Math.round(this.x) || (nextPoint.x === 0 && Math.round(this.x) === map[0].length-1)) this.nextDirection = 0;
            else if (nextPoint.x < Math.round(this.x)) this.nextDirection = 2;
            else if (nextPoint.y > Math.round(this.y)) this.nextDirection = 1;
            else if (nextPoint.y < Math.round(this.y)) this.nextDirection = 3;
        }
    }

    findRoute(x1, y1, x2, y2) {
        const startX = Math.round(x1);
        const startY = Math.round(y1);
        const targetX = Math.round(x2);
        const targetY = Math.round(y2);

        const queue = [[startX, startY, []]];
        const visited = new Set();
        visited.add(`${startX},${startY}`);

        const directions = [
            [1, 0],  // вправо
            [0, 1],  // вниз
            [-1, 0], // влево
            [0, -1]  // вверх
        ];

        let count = 10000;
        while (queue.length > 0 && count > 0) {
            count--;
            const [x, y, path] = queue.shift();
            const newPath = [...path, {x, y}];

            if (x === targetX && y === targetY) {
                return newPath;
            }
            const allowedDirections = [];

            for (let i = 0; i < directions.length; i++) {
                let dx = directions[i][0];
                let dy = directions[i][1];
                let nx = x + dx;
                let ny = y + dy;

                if (nx < 0 && ny === 14) nx = map[0].length - 1;
                else if (nx >= map[0].length && ny === 14) nx = 0;

                if (ny < 0 || ny >= map.length) continue;

                if (map[ny][nx] % 4 === 0) continue;
                if (path.length === 0) {
                    const oppositeDirection = (this.direction + 2) % 4;
                    const [oppDx, oppDy] = directions[oppositeDirection];
                    if (dx === oppDx && dy === oppDy) continue;
                }
                allowedDirections.push([dx, dy]);
            }
            if (path.length === 0) {
                const [currDx, currDy] = directions[this.direction];
                allowedDirections.sort((a,b) =>
                    (a[0] === currDx && a[1] === currDy) ? -1 : (b[0] === currDx && b[1] === currDy) ? -1 : 0);
            }

            for (const [dx, dy] of allowedDirections) {
                let nx = x + dx;
                let ny = y + dy;

                if (nx < 0 && ny === 14) nx = map[0].length - 1;
                else if (nx >= map[0].length && ny === 14) nx = 0;

                const key = `${nx},${ny}`;
                if (!visited.has(key)) {
                    visited.add(key);
                    queue.push([nx, ny, newPath]);
                }
            }
        }
        return [];
    }

    roundPosBefTurn(add) {
        let params = {
            1: { axis: 'x', sign: 1, ceilDir: 0 },
            3: { axis: 'x', sign: -1, ceilDir: 0 },
            0: { axis: 'y', sign: 1, ceilDir: 1 },
            2: { axis: 'y', sign: -1, ceilDir: 1 }
        };
        let cfg = params[this.nextDirection];

        let { axis, sign, ceilDir } = cfg;
        let useCeil = this.direction === ceilDir;
        let roundFunc = useCeil ? Math.ceil : Math.floor;
        let current = this[axis];
        let rounded = roundFunc(current);
        let diff = useCeil ? rounded - current : current - rounded;

        let checkX = axis === 'x' ? rounded : this.x + sign;
        let checkY = axis === 'x' ? this.y + sign : rounded;

        if (add > diff && map[checkY][checkX] % 4 !== 0) {
            this[axis] = rounded;
        }
    }

    tryToMoveKey(add) {
        if (this.x < 1 || this.x > map[0].length-1) return;
        if (Math.abs(this.direction - this.nextDirection) !== 2) this.roundPosBefTurn(add);
        let lastDir = this.direction;
        this.direction = this.nextDirection;
        let lastX = this.x, lastY = this.y;
        this.move(add)
        if (this.isCollideWithWall(this.x, this.y)) {
            this.x = lastX; this.y = lastY;
            this.direction = lastDir;
        }
    }

    moveToWall() {
        switch (this.direction) {
            case 0: {
                this.x = Math.ceil(this.x)
                break;
            }
            case 1: {
                this.y = Math.ceil(this.y)
                break;
            }
            case 2: {
                this.x = Math.floor(this.x)
                break;
            }
            case 3: {
                this.y = Math.floor(this.y);
                break;
            }
        }
    }

    isInTunnel() {
        return this.y === 14 && (this.x <= 6 || this.x >= map.length - 9);
    }

    update(time) {
        if (this.isInTunnel()) ghostSpeed = 3;
        let add = ghostSpeed*time/1000; ghostSpeed = baseGhostSpeed;
        this.calculateDirection(time);
        if (this.direction !== this.nextDirection) this.tryToMoveKey(add)
        let lastX = this.x, lastY = this.y;
        this.move(add)
        if (this.isCollideWithWall(this.x, this.y)) {
            this.x = lastX; this.y = lastY;
            this.moveToWall();
        }
        this.x = roundWithSigns(this.x, 5);
        this.y = roundWithSigns(this.y, 5); // на всякий пожарный
        this.draw();
    }

    isCollideWithWall(x, y) {
        switch (this.direction) {
            case 0: {
                if (map[Math.ceil(y)][Math.ceil(x)] % 4 === 0 || map[Math.floor(y)][Math.ceil(x)] % 4 === 0) return true;
                break;
            } case 1: {
                if (map[Math.ceil(y)][Math.floor(x)] % 4 === 0 || map[Math.ceil(y)][Math.ceil(x)] % 4 === 0) return true;
                break;
            } case 2: {
                if (map[Math.ceil(y)][Math.floor(x)] % 4 === 0 || map[Math.floor(y)][Math.floor(x)] % 4 === 0) return true;
                break;
            } case 3: {
                if (map[Math.floor(y)][Math.floor(x)] === 0 || map[Math.floor(y)][Math.ceil(x)] === 0) return true; // чтобы привидения смогли выйти из дома
                break;
            }
        }
        return false;
    }
}