function bootstrap(){

//Web audio
sample = new PlaySounds(context,
                               [
                                'sounds/shoot.mp3',  //sound 0
                                'sounds/explosion1.mp3', //sound 1
                                'sounds/explosion2.mp3', //sound 2
                                'sounds/game_over.mp3', //sound 3
                                'sounds/background.mp3' //sound 4
                                ]
                       );
    
// Cross browser requestAnimationFrame
 requestAnimFrame = (function () {
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);  
        };
})();

// Create the canvas and add to document
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 500;
document.body.appendChild(canvas);
    
//Instantiate levels
var levelTwo=new _levelTwo;  
    levelTwo.prototype.levelNum=2;
    console.log(levelTwo.prototype);
    
var levelOne=new _levelOne;  
    levelOne.prototype.levelNum=1;
    levelOne.prototype.nextLevel=levelTwo; 
    console.log(levelOne.prototype);


//Instantiate gamestate
var myGame=new GameState;
myGame.firstLevel=levelOne; //Start of level COR
myGame.level=1; //Current level
    
return myGame;
    
}