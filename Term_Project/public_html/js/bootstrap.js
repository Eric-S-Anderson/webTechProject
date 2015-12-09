function bootstrap(){

LoadAudio();


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

//Remove the click facebook score since we will use tap events
document.getElementById('submit-hiscore').removeEventListener('click', attemptSubmit);
    
//Instantiate entitymanager
entityManager = new EntityManager;
    
//Instantiate gamestate
var myGame=new GameState;
myGame.firstLevel=LevelCOR(); //Start of level COR
myGame.level=1; //Current level
    
return myGame;
    

    
}

function LevelCOR(){
    
    //Instantiate levels and config COR
var levelTwo=new _levelTwo;  
    levelTwo.prototype.SetLevelNum(2);
    console.log(levelTwo.prototype);
    
var levelOne=new _levelOne;  
    levelOne.prototype.SetLevelNum(1);
    levelOne.prototype.SetNextLevel(levelTwo);   
    console.log(levelOne.prototype);
    
    return levelOne;
}


function LoadAudio(){
    
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
    
}

function loadGraphics() {

    //Array of images to load
    resources.load([
        'img/nutSprite.png',
        'img/tiles.png',
        'img/smoke.png',
        'img/player.png',
        'img/tank.png',
        'img/testspritesheet.png',
        'img/ship.png',
        'img/level-up1.jpg',
        'img/Background-3.jpg'
    ]);

    //Callback init after loading
    resources.onReady(init);

}