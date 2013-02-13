function load_image(){
    var canvas = document.getElementById("pacman");
    var ctx = canvas.getContext("2d");
    var image = new Image();
    image.src = "pacman10-hp-sprite.png"
    image.onload = function(){
        ctx.drawImage(image, 322, 2, 464, 136, 0, 0, 464, 136);
        ctx.drawImage(image, 83, 23, 13, 14, 35, 5, 13, 14);
        ctx.drawImage(image, 83, 83, 14, 14, 200, 5, 14, 14);
    };
}
