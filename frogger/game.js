function Coords(x, y){
    this.x = x;
    this.y = y;
}

function GameState(){
    this.coords = new Coords(187, 503);
    this.width = 23;
    this.height = 17;
    this.lastDirection = "up";
    this.deathTimer = -1;
    this.onLog = -1;
    this.lives = 5;
    this.won = [false, false, false, false, false];
    this.score = 0;
    this.highscore = 0;
    this.currentRow = 0;
    this.highestRow = 0;
    this.level = 1;
    this.time = 800;
    this.vehicles = new Array(generateCar(1, 50), generateCar(2), generateCar(3), generateCar(4), generateCar(5), generateCar(6));
    this.logs = new Array(generateLog(1), generateLog(2), generateLog(3), generateLog(4), generateLog(5), generateLog(6));
    this.hasLives = function (){
        return (this.lives > 0);
    };
    this.carCollides = function (){
        if(this.coords.y < 505 && this.coords.y > 270){            
            for(var i=0; i<this.vehicles.length; i++){
                if(collide(this.coords.x, this.coords.y, this.width, this.height,
                    this.vehicles[i].coords.x, this.vehicles[i].coords.y, this.vehicles[i].width, this.vehicles[i].height)){
                    return true;
                }
            }
        }
        return false;
    };
    this.waterCollides = function (){
        return (this.coords.y > 105 && this.coords.y < 270);
    };
    this.logCollides = function (){
        if(this.coords.y < 270){
            for(var i=0; i<this.logs.length; i++){
                if(collide(this.coords.x, this.coords.y, this.width, this.height,
                    this.logs[i].coords.x, this.logs[i].coords.y, this.logs[i].width, this.logs[i].height)){
                    this.onLog = i;
                    return i;
                }
            }
        }
        this.onLog = -1;
        return -1;
    };
}

function Log(x, y, type, row, dir, speed){
    this.coords = new Coords(x, y);
    this.row = row;
    this.speed = speed;
    this.dir = dir;
    this.type = type;
    this.width = this.type==1 ? 178 : this.type==2 ? 117 : 85;
    this.height = 21;
    this.render = function(){
        switch(this.type){
            case 1:
                ctx.drawImage(spriteSheet, 7, 165, 178, 21, this.coords.x, this.coords.y, 178, 21);
                break;
            case 2:
                ctx.drawImage(spriteSheet, 7, 198, 117, 21, this.coords.x, this.coords.y, 117, 21);
                break;
            case 3:
                ctx.drawImage(spriteSheet, 7, 230, 85, 21, this.coords.x, this.coords.y, 85, 21);
                break;
        }
    }
    this.update = function(){
        this.coords.x = this.coords.x - (this.dir * this.speed);
    }
    this.offScreen = function(){
        return ((this.coords.x + this.width) < 0 || (this.coords.x > 399))
    }
}

function Car(x, y, type, row, dir, speed){
    this.coords = new Coords(x, y);
    this.row = row;
    this.speed = speed;
    this.dir = dir;
    this.type = type;
    this.width = this.type==1 ? 28 : this.type==2 ? 28 : this.type==3 ? 24 : this.type==4 ? 46 : 24;
    this.height = this.type==1 ? 19 : this.type==2 ? 24 : this.type==3 ? 26 : this.type==4 ? 18 : 21;
    this.render = function(){
        switch(this.type){
            case 1:
                ctx.drawImage(spriteSheet, 10, 267, 28, 19, this.coords.x, this.coords.y, 28, 19);
                break;
            case 2:
                ctx.drawImage(spriteSheet, 46, 265, 28, 24, this.coords.x, this.coords.y, 28, 24);
                break;
            case 3:
                ctx.drawImage(spriteSheet, 82, 264, 24, 26, this.coords.x, this.coords.y, 24, 26);
                break;
            case 4:
                ctx.drawImage(spriteSheet, 106, 302, 46, 18, this.coords.x, this.coords.y, 46, 18);
                break;
            case 5:
                ctx.drawImage(spriteSheet, 11, 301, 24, 21, this.coords.x, this.coords.y, 24, 21);
                break;
        }
    }
    this.update = function(){
        this.coords.x = this.coords.x - (this.dir * this.speed);
    }
    this.offScreen = function(){
        return ((this.coords.x + this.width) < 0 || (this.coords.x > 399))
    }
}

function start_game(){
    var canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    gameState = new GameState();
    spriteSheet = new Image();
    spriteSheet.src = "assets/frogger_sprites.png";
    $(document).keydown(function(e) {
        var key = e.which;
        if(key==38 || key==40 || key==37 || key==39){
            e.preventDefault();
        }
    });
    $(document).keydown(function(e) {
        if (gameState.hasLives() && gameState.deathTimer == -1){
            if (e.keyCode == 38){ 
                console.log("up");
                goUp();
            } else if (e.keyCode == 40){
                console.log("down");
                goDown();
            } else if (e.keyCode == 37){
                console.log("left");
                goLeft();
            } else if (e.keyCode == 39){
                console.log("right");
                goRight();
            } else if (e.keyCode == 82){
                gameState = new GameState();
                console.log("New game!");
            }
        } else if (e.keyCode == 82){
            gameState = new GameState();
            console.log("New game!");
        }
    });
    spriteSheet.onload = function(){
        drawBackground();
        drawFooter();
        drawFrogger();
        drawLogs();
        drawCars();
        setInterval(gameLoop, 60);
    }
}

function gameLoop(){
    if(gameState.hasLives()){
        drawBackground();
        drawFooter();
        drawTime();
        drawLogs();
        drawCars();
        drawFrogger();
    }else{
        drawBackground();
        drawLogs();
        drawCars();
        failureScreen();
        drawFooter();
        drawLives();
    }
}

function failureScreen(){
    ctx.font = "bold 30pt arial";
    ctx.fillStyle = "FF0000";
    ctx.strokeStyle = "000000";
    ctx.fillText("You Lose!", 100, 300);
    ctx.strokeText("You Lose!", 100, 300);
    ctx.fillText("Press r to restart", 50, 340);
    ctx.strokeText("Press r to restart", 50, 340);
}

function goUp(){
    if(validMove(gameState.coords.x, gameState.coords.y - 30)){
        gameState.coords.y -= 30;
        gameState.currentRow++;
    }
    if(gameState.currentRow > gameState.highestRow){
        gameState.highestRow++;
        gameState.score += 10;
    }
    gameState.lastDirection = "up";
}

function goDown(){
    if(validMove(gameState.coords.x, gameState.coords.y + 30)){
        gameState.coords.y += 30;
        gameState.currentRow--;
    }
    gameState.lastDirection = "down";
}

function goLeft(){
    if(validMove(gameState.coords.x - 30, gameState.coords.y)){
        gameState.coords.x -= 30;
    }
    gameState.lastDirection = "left";
}

function goRight(){
    if(validMove(gameState.coords.x + 30, gameState.coords.y)){
        gameState.coords.x += 30;
    }
    gameState.lastDirection = "right";
}

function validMove (x, y){
    if (y > 90 && y < 510 && x > 0 && x < 369){
        return true;
    } else if (y > 60 && y < 100 && ((x > 5 && x < 40 && !gameState.won[0]) || 
                (x > 92 && x < 128 && !gameState.won[1]) || (x > 178 && x < 214 && !gameState.won[2]) ||
                (x > 263 && x < 299 && !gameState.won[3]) || (x > 347 && x < 383 && !gameState.won[4]))){
        return true;
    }
    return false;
}

function generateCar(row, x){
    switch (row){
        case 1:
            return new Car( x==null ? 390 : x, 322, 4, 1, 1, 2)
            break;
        case 2:
            return new Car( x==null ? 390 : x, 350, 3, 2, 1, 2)
            break;
        case 3:
            return new Car( x==null ? -5 : x, 380, 2, 3, -1, 2)
            break;
        case 4:
            return new Car( x==null ? 390 : x, 412, 1, 4, 1, 2)
            break;
        case 5:
            return new Car( x==null ? -5 : x, 440, 5, 5, -1, 2)
            break;
        case 6:
            return new Car( x==null ? 390 : x, 468, 3, 6, 1, 2)
            break;
    }
}

function generateLog(row, x){
    switch (row){
        case 1:
            return new Log( x==null ? 390 : x, 115, 1, 1, 2, 1)
            break;
        case 2:
            return new Log( x==null ? -30 : x, 145, 2, 2, 2, -1)
            break;
        case 3:
            return new Log( x==null ? 390 : x, 173, 3, 3, 2, 1)
            break;
        case 4:
            return new Log( x==null ? -30 : x, 200, 1, 4, 2, -1)
            break;
        case 5:
            return new Log( x==null ? 390 : x, 228, 3, 5, 2, 1)
            break;
        case 6:
            return new Log( x==null ? -30 : x, 255, 2, 6, 2, -1)
            break;
    }
}

function drawLogs(){
    for(var i=0; i<gameState.logs.length; i++){
        gameState.logs[i].update();
        if(gameState.logs[i].offScreen()){
            gameState.logs[i] = generateLog(gameState.logs[i].row);
        }
        gameState.logs[i].render();
    }
}

function drawCars(){
    for(var i=0; i<gameState.vehicles.length; i++){
        gameState.vehicles[i].update();
        if(gameState.vehicles[i].offScreen()){
            gameState.vehicles[i] = generateCar(gameState.vehicles[i].row);
        }
        gameState.vehicles[i].render();
    }
}

function drawFrogger(){
    gameState.onLog = gameState.logCollides();
    if (gameState.deathTimer > 0) {
        ctx.drawImage(spriteSheet, 251, 222, 18, 24, gameState.coords.x, gameState.coords.y, 18, 24);
        gameState.deathTimer--;
    } else if (gameState.deathTimer == 0){
        gameState.currentRow = 0;
        gameState.highestRow = 0;
        gameState.coords.x = 187;
        gameState.coords.y = 503;
        gameState.deathTimer = -1;
    } else if (gameState.waterCollides() && gameState.onLog == -1){
        console.log("waterCollided");
        die();
    } else if (gameState.carCollides()){
        console.log("carCollided");
        die();
    } else {
        if(gameState.onLog >= 0){
            console.log("on a log yo");
            var tempCoordsx = gameState.coords.x - (gameState.logs[gameState.onLog].dir * gameState.logs[gameState.onLog].speed);
            var tempCoordsy = gameState.coords.y;
            if(validMove(tempCoordsx, tempCoordsy)){
                gameState.coords.x = tempCoordsx;
            }
        }
        if(gameState.lastDirection == "up"){
            gameState.width = 23;
            gameState.height = 17;
            ctx.drawImage(spriteSheet, 12, 369, 23, 17, gameState.coords.x, gameState.coords.y, 23, 17);
        } else if (gameState.lastDirection == "down"){
            gameState.width = 23;
            gameState.height = 17;
            ctx.drawImage(spriteSheet, 80, 369, 23, 17, gameState.coords.x, gameState.coords.y, 23, 17);
        } else if (gameState.lastDirection == "left"){
            gameState.width = 18;
            gameState.height = 23;
            ctx.drawImage(spriteSheet, 82, 335, 18, 23, gameState.coords.x, gameState.coords.y-3, 18, 23);
        } else if (gameState.lastDirection == "right"){
            gameState.width = 17;
            gameState.height = 23;
            ctx.drawImage(spriteSheet, 13, 334, 17, 23, gameState.coords.x, gameState.coords.y-3, 17, 23);
        } 
    }
}

function die(){
    gameState.lives--;
    gameState.deathTimer = 30;
}

function drawTime(){
    if(gameState.time == 0){
        die();
    } else {
        ctx.fillStyle = "#00EE00";
        ctx.fillRect(190, 540, gameState.time/6, 10);
        gameState.time--;
    }
}

function drawFooter(){
    drawLives();
    ctx.font = "bold 15pt arial";
    ctx.fillStyle = "#00EE00";
    ctx.fillText("Level ", 70, 545);
    drawLevel();
    ctx.font = "bold 10pt arial";
    ctx.fillText("Score: ", 0, 560);
    ctx.fillText("Highscore: ", 70, 560);
    drawScore();
}

function drawScore(){
    ctx.font = "bold 10pt arial";
    ctx.fillStyle = "#00EE00";
    ctx.fillText(gameState.score, 45, 560);
    ctx.fillText(gameState.highscore, 143, 560);
}

function drawLevel(){
    ctx.font = "bold 15pt arial";
    ctx.fillStyle = "#00EE00";
    ctx.fillText(gameState.level, 127, 545);
}

function drawLives(){
    var x = 0;
    var y = 532;
    for(var i = 0; i<gameState.lives; i++){
        ctx.drawImage(spriteSheet, 13, 334, 17, 23, x, y, 11, 15);
        x += 14;
    }
}
function drawBackground(){
    ctx.fillStyle = "#191970";
    ctx.fillRect(0, 0, 399, 283);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 283, 399, 283);
    ctx.drawImage(spriteSheet, 0, 0, 399, 113, 0, 0, 399, 113);
    ctx.drawImage(spriteSheet, 0, 119, 399, 34, 0, 283, 399, 34);
    ctx.drawImage(spriteSheet, 0, 119, 399, 34, 0, 495, 399, 34);  
}

function collide (x1, y1, w1, h1, x2, y2, w2, h2){
    var topright = new Coords(x1+w1, y1);
    var bottomright = new Coords(x1+w1, y1+h1);
    var topleft = new Coords(x1, y1);
    var bottomleft = new Coords(x1, y1+h1);
    return (((topright.x <= x2+w2 && topright.x >= x2) && (topright.y <= y2+h2 && topright.y >= y2)) ||
            ((bottomright.x <= x2+w2 && bottomright.x >= x2) && (bottomright.y <= y2+h2 && bottomright.y >= y2)) ||
            ((topleft.x <= x2+w2 && topleft.x >= x2) && (topleft.y <= y2+h2 && topleft.y >= y2)) ||
            ((bottomleft.x <= x2+w2 && bottomleft.x >= x2) && (bottomleft.y <= y2+h2 && bottomleft.y >= y2)))
}
