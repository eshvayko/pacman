class Pacman {
    constructor(x, y, direction=2) { // 0 - right, 1 - bottom, 2 - left, 3 - top,
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.key = direction;
    }

    setKey(key) {
        this.key = key;
    }

    draw() {
        cx.save()
        cx.translate(this.x*scale+scale/2, this.y*scale+scale/2);
        cx.rotate(this.direction*90*Math.PI/180);
        cx.drawImage(pacmanSprite, (Math.floor(Date.now() / 25) % 7)*20, 0, 20, 20, -actorSize/2, -actorSize/2, actorSize, actorSize);
        cx.restore();
    }

    eat(y, x) {
        map[y][x] = 1;
        score++;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore456890795349507', highScore);
        }
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

    checkFood() {
        let params = {
            0: [this.y, Math.ceil(this.x), Math.ceil(this.x) !== Math.ceil(this.x+0.5)],
            1: [Math.ceil(this.y), this.x, Math.ceil(this.y) !== Math.ceil(this.y+0.5)],
            2: [this.y, Math.floor(this.x), Math.floor(this.x) !== Math.floor(this.x-0.5)],
            3: [Math.floor(this.y), this.x, Math.floor(this.y) !== Math.floor(this.y-0.5)],
        };
        let curr = params[this.direction];
        if (map[curr[0]][curr[1]] === 2 && curr[2]) this.eat(curr[0], curr[1]);
    }

    roundPosBefTurn(add) {
        let params = {
            1: { axis: 'x', sign: 1, ceilDir: 0 },
            3: { axis: 'x', sign: -1, ceilDir: 0 },
            0: { axis: 'y', sign: 1, ceilDir: 1 },
            2: { axis: 'y', sign: -1, ceilDir: 1 }
        };
        let cfg = params[this.key];

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
        if (Math.abs(this.direction - this.key) !== 2) this.roundPosBefTurn(add);
        let lastDir = this.direction;
        this.direction = this.key;
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

    update(time) {
        let add = pacmanSpeed*time/1000;
        if (this.direction !== this.key) this.tryToMoveKey(add)
        let lastX = this.x, lastY = this.y;
        this.move(add)
        if (this.isCollideWithWall(this.x, this.y)) {
            this.x = lastX; this.y = lastY;
            this.moveToWall();
        }
        this.checkFood();
        for (let ghost of ghosts) {
            if (this.isCollideWithGhost(ghost)) {
                lives--;
                status = "death";
                break;
            }
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
                if (map[Math.floor(y)][Math.floor(x)] % 4 === 0 || map[Math.floor(y)][Math.ceil(x)] % 4 === 0) return true;
                break;
            }
        }
        return false;
    }

    isCollideWithGhost(ghost) {
        return (ghost.x*scale+scale >= this.x*scale)
            && (ghost.x*scale <= this.x*scale+scale)
            && (ghost.y*scale+scale >= this.y*scale)
            && (ghost.y*scale <= this.y*scale+scale);
    }
}