function Coords(x, y){
    this.x = x;
    this.y = y;
}

function GameState(){
    this.coords = new Coords(190, 503);
    this.lives = 3;
    this.gameover = false;
    this.score = 0;
    this.highscore = 0;
    this.level = 1;
    this.time = 100;
    this.vehicleCoords = new Array(new Coords(0, 0), new Coords(1, 1), new Coords(2, 2), new Coords(3, 3));
    this.logCoords = new Array(new Coords(0, 0), new Coords(1, 1), new Coords(2, 2), new Coords(3, 3));
    this.vehicleSpeeds = new Array(0, 1, 2, 3);
    this.logSpeeds = new Array(0, 1, 2, 3);
}

function start_game(){
    var canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    gameState = new GameState();
    spriteSheet = new Image();
    spriteSheet.src = "assets/frogger_sprites.png";
    spriteSheet.onload = function(){
        drawBackground();
        drawFooter();
        drawFrogger();
    }
}

function drawFrogger(){
    ctx.drawImage(spriteSheet, 12, 369, 23, 17, gameState.coords.x, gameState.coords.y, 23, 17);
}

function drawFooter(){
    drawLives();
    ctx.font = "bold 15pt arial";
    ctx.fillStyle = "green"
    ctx.fillText("Level ", 50, 545);
    drawLevel();
    ctx.font = "bold 10pt arial";
    ctx.fillText("Score: ", 0, 560);
    ctx.fillText("Highscore: ", 70, 560);
    drawScore();
}

function drawScore(){
    ctx.font = "bold 10pt arial";
    ctx.fillStyle = "green";
    ctx.fillText(gameState.score, 45, 560);
    ctx.fillText(gameState.highscore, 143, 560);
}

function drawLevel(){
    ctx.font = "bold 15pt arial";
    ctx.fillStyle = "green";
    ctx.fillText(gameState.level, 107, 545);
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
