function Coords(x, y){
    this.x = x;
    this.y = y;
}

function GameState(){
    this.coords = new Coords(187, 503);
    this.lives = 5;
    this.gameover = false;
    this.score = 0;
    this.highscore = 0;
    this.level = 1;
    this.time = 100;
    this.vehicleCoords = new Array(new Coords(60, 325), new Coords(200, 355), new Coords(2, 2), new Coords(3, 3), new Coords(4, 4));
    this.logCoords = new Array(new Coords(0, 0), new Coords(1, 1), new Coords(50, 170), new Coords(3, 3), new Coords(4, 4));
    this.vehicleSpeeds = new Array(0, 1, 2, 3);
    this.logSpeeds = new Array(0, 1, 2, 3);
}

function start_game(){
    var canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    gameState = new GameState();
    spriteSheet = new Image();
    spriteSheet.src = "assets/frogger_sprites.png";
    $(document).keydown(function(e) {
            if (e.keyCode == 38){ 
                console.log("up") 
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
    }
}

function goUp(){
    gameState.coords.y -= 30;
    console.log(gameState.coords);
}

function goDown(){
    gameState.coords.y += 30;
    console.log(gameState.coords);
}

function goLeft(){
    gameState.coords.x -= 42;
    console.log(gameState.coords);
}

function goRight(){
    gameState.coords.x += 42;
    console.log(gameState.coords);
}

function has_lives(){
    return (gameState.lives > 0)
}

function drawLogs(){
    ctx.drawImage(spriteSheet, 7, 165, 178, 22, gameState.logCoords[2].x, gameState.logCoords[2].y, 178, 22);
}

function drawCars(){
    ctx.drawImage(spriteSheet, 106, 302, 46, 18, gameState.vehicleCoords[0].x, gameState.vehicleCoords[0].y, 46, 18);
    ctx.drawImage(spriteSheet, 46, 265, 28, 24, gameState.vehicleCoords[1].x, gameState.vehicleCoords[1].y, 28, 24);
}

function drawFrogger(){
    ctx.drawImage(spriteSheet, 12, 369, 23, 17, gameState.coords.x, gameState.coords.y, 23, 17);
}

function drawFooter(){
    drawLives();
    ctx.font = "bold 15pt arial";
    ctx.fillStyle = "#00EE00"
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
