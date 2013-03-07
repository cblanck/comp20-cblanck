function Coords(x, y){
    this.x = x;
    this.y = y;
}

function GameState(){
    this.coords = new Coords(187, 503);
    this.lastDirection = "up";
    this.onLog = -1;
    this.lives = 5;
    this.gameover = false;
    this.score = 0;
    this.highscore = 0;
    this.level = 1;
    this.time = 100;
    this.vehicles = new Array(generateCar(1), generateCar(2), generateCar(3), generateCar(4), generateCar(5), generateCar(6));
    this.logs = new Array(generateLog(1), generateLog(2), generateLog(3), generateLog(4), generateLog(5), generateLog(6));
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
    this.width = this.type==1 ? 28 : this.type==2 ? 28 : this.type==3 ? 24 : 46;
    this.height = this.type==1 ? 19 : this.type==2 ? 24 : this.type==3 ? 26 : 18;
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
            if (e.keyCode == 38){ 
                console.log("up");
                goUp();
            } else if (e.keyCode == 40){
                console.log("down");
                goDown();
            }  else if (e.keyCode == 37){
                console.log("left");
                goLeft();
            }  else if (e.keyCode == 39){
                console.log("right");
                goRight();
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
    if(has_lives()){
        drawBackground();
        drawFooter();
        drawLogs();
        drawCars();
        drawFrogger();
    }else{
        failureScreen();
    }
}

function goUp(){
    gameState.coords.y -= 30;
    gameState.lastDirection = "up";
    console.log(gameState.coords);
}

function goDown(){
    gameState.coords.y += 30;
    gameState.lastDirection = "down";
    console.log(gameState.coords);
}

function goLeft(){
    gameState.coords.x -= 42;
    gameState.lastDirection = "left";
    console.log(gameState.coords);
}

function goRight(){
    gameState.coords.x += 42;
    gameState.lastDirection = "right";
    console.log(gameState.coords);
}

function has_lives(){
    return (gameState.lives > 0);
}

function generateCar(row){
    switch (row){
        case 1:
            return new Car(20, 40, 4, 1, 1, 1)
            break;
        case 2:
            return new Car(30, 50, 3, 2, 1, 1)
            break;
        case 3:
            return new Car(40, 60, 2, 3, -1, 1)
            break;
        case 4:
            return new Car(50, 70, 1, 4, 1, 1)
            break;
        case 5:
            return new Car(60, 80, 2, 5, -1, 1)
            break;
        case 6:
            return new Car(70, 90, 3, 6, 1, 1)
            break;
    }
}

function generateLog(row){
    switch (row){
        case 1:
            //return new Log(x, y, type, dir, speed)
            break;
        case 2:
            //return new Log(x, y, type, dir, speed)
            break;
        case 3:
            //return new Log(x, y, type, dir, speed)
            break;
        case 4:
            //return new Log(x, y, type, dir, speed)
            break;
        case 5:
            //return new Log(x, y, type, dir, speed)
            break;
        case 6:
            //return new Log(x, y, type, dir, speed)
            break;
    }
}

function drawLogs(){
    
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
    if(gameState.lastDirection == "up"){
        ctx.drawImage(spriteSheet, 12, 369, 23, 17, gameState.coords.x, gameState.coords.y, 23, 17);
    } else if (gameState.lastDirection == "down"){
        ctx.drawImage(spriteSheet, 80, 369, 23, 17, gameState.coords.x, gameState.coords.y, 23, 17);
    } else if (gameState.lastDirection == "left"){
        ctx.drawImage(spriteSheet, 82, 335, 18, 23, gameState.coords.x, gameState.coords.y-3, 18, 23);
    } else if (gameState.lastDirection == "right"){
        ctx.drawImage(spriteSheet, 13, 334, 17, 23, gameState.coords.x, gameState.coords.y-3, 17, 23);
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
