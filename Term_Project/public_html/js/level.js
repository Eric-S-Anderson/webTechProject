

AbstractLevel = function (){
    this.levelNum = 0;
    this.nextLevel = null;
    console.log(this.levelNum);
    
    this.LevelLogic = function(){};
}


AbstractLevel.prototype.UpdateLevel=function(level,levelTime){
    
    //If current level, process level logic
    if(level==this.levelNum){
        this.LevelLogic();
    }
    else{ //Not this level, so check the next
        this.nextLevel.prototype.UpdateLevel(level,levelTime);
    }
    
}



//LEVEL ONE
function _levelOne(){
    this.prototype = new AbstractLevel();
    
    
    
    this.prototype.LevelLogic = function() {   
    console.log('lvl 1 processing');
    
    //Add enemies in waves
        if (Math.floor(gameTime / 8 ) >= wave)
        { //Every x seconds add a wave
            wave++;

           for(var i=0;i<wave;i++){ //Wave size matches wave number

              enemies.push({
                    pos: [canvas.width + (Math.random() * 500),  //Stagger x position
                        Math.random() * (canvas.height - 118)], //Draw within y bounds
                    sprite: new Sprite('img/tank.png', [0, 118], [118, 118], 8, [0, 1]),
                    speed: enemySpeed * (Math.random() + 1)
              });

            }//end for
        }//end if

        //End the level
        if(Math.floor(gameTime / 25) >=1)
            {
                myGame.NextLevel();
            }
        
    }//end level logic

    
}//end level

//LEVEL TWO
function _levelTwo(){
    this.prototype = new AbstractLevel();
    
    
    this.prototype.LevelLogic = function() {  
    console.log('lvl2 processing');
        
    //Add enemies in waves
        if (Math.floor(gameTime / 2 ) >= wave)
        { //Every 5 seconds add a wave
            wave++;

           for(var i=0;i<wave;i++){ //Wave size matches wave number

              enemies.push({
                    pos: [canvas.width + (Math.random() * 500),  //Stagger x position
                        Math.random() * (canvas.height - 118)], //Draw within y bounds
                    sprite: new Sprite('img/tank.png', [0, 118], [118, 118], 8, [0, 1]),
                    speed: enemySpeed * (Math.random() + 1)
              });

            }//end for
        }//end if

    }//end level logic

    
}//end level