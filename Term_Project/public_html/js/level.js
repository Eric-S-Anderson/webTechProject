

AbstractLevel = function (terrainPattern){
    this.levelNum = 0;
    this.nextLevel = null;
    this.terrainPattern = terrainPattern;
    console.log(this.levelNum);
    
    this.LevelLogic = function(){};
}


AbstractLevel.prototype.UpdateLevel=function(level,levelTime){

    //If current level, process level logic
    if(level==this.levelNum){
    
        //Perform level logic
        this.LevelLogic(levelTime);
    }
    else{ //Not this level, so check the next
        this.nextLevel.prototype.UpdateLevel(level,levelTime);
    }
    
}

AbstractLevel.prototype.SetLevelNum=function(level){
    this.levelNum=level;
}

AbstractLevel.prototype.SetNextLevel=function(nextLevel){
    this.nextLevel=nextLevel;
}

AbstractLevel.prototype.GetTerrain=function(level){
        //If current level, return terrain
    if(level==this.levelNum){
        return this.terrainPattern;
    }
    else{ //Not this level, so check the next
       return this.nextLevel.prototype.GetTerrain(level);
    }
}


//CONCRETE LEVELS BELOW


//LEVEL ONE
function _levelOne(){
    this.prototype = new AbstractLevel('img/tiles.png');
    

    this.prototype.LevelLogic = function(levelTime) {   
    console.log('lvl 1 processing');

   
        
        
    //Add enemies in waves
        if (Math.floor(levelTime / 6 ) >= wave)
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
        if(Math.floor(levelTime / 18) >=1)
            {
                myGame.NextLevel();
            }
        
    }//end level logic

    
}//end level

//LEVEL TWO
function _levelTwo(){
    this.prototype = new AbstractLevel('img/Background-3.jpg');
    
    
    this.prototype.LevelLogic = function(levelTime) {  
    console.log('lvl2 processing');
        
    //Add enemies in waves
        if (Math.floor(levelTime / 2 ) >= wave)
        { //Every 5 seconds add a wave
            wave++;

           for(var i=0;i<wave;i++){ //Wave size matches wave number

              enemies.push({
                    pos: [canvas.width + (Math.random() * 500),  //Stagger x position
                        Math.random() * (canvas.height - 118)], //Draw within y bounds
                    sprite: new Sprite('img/ship.png', [250, 100], [99, 105], 8, [0, 1]),
                    speed: enemySpeed * (Math.random() + 1)
              });

            }//end for
        }//end if

    }//end level logic

    
}//end level