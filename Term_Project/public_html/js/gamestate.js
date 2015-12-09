GameState = function(){
    this.isGameOver = false;
    this.level = 0;
    this.firstLevel = null;
    this.curBG = null;
    this.now = 0;
    this.lastTime = 0;
    this.elapsed = 0;
    this.levelTime = 0;
}

GameState.prototype.Main = function(){

    this.ProcessTime();
    this.Update();
    render();

    this.lastTime = this.now;
    
}

GameState.prototype.ProcessTime = function(){
    this.now = Date.now();
    this.elapsed = (this.now - this.lastTime) / 1000.0;  //elapsed time in seconds
}


GameState.prototype.NextLevel = function(){
    //level increment
    this.level++;
    this.levelTime=0;
    
    //Level Up Sprite
    explosions.push({
        pos: [(canvas.width / 2)-400,(canvas.height / 2)-70],
        sprite: new Sprite('img/level-up1.jpg',
                           [250, 0], //location x,y
                           [800, 140], //size w,h
                           1, //speed
                           [0], //frames
                           null,  //direction
                           true) //run once
    });
    
    //clear enemies
    enemies=[]; 
    wave = 0;
    
    //Update background
    this.curBG=
        ctx.createPattern(resources.get(this.firstLevel.prototype.GetTerrain(this.level)), 'repeat');
}

GameState.prototype.Update = function(){
    this.levelTime = this.levelTime+this.elapsed;
    handleInput(this.elapsed);
    updateEntities(this.elapsed);
    entityManager.UpdateEntities(this.elapsed);

    if(!this.isGameOver){
        this.firstLevel.prototype.UpdateLevel(this.level,this.levelTime);
    }
    
    checkCollisions();
    scoreEl.innerHTML = score;
}

// Reset game to original state
GameState.prototype.Reset = function() {
    //Hide overlay
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    
    //Stop processing play again/high score tap events
    $('#play-again').off("tap");
    $('#submit-hiscore').off("tap");
    
    //Start processing shoot tap events
    $("body").on("tap",function(){ tapped=1; });
        
    //Reset facebook score submission
    document.getElementById('submit-hiscore').innerHTML='Post your score to Facebook';
    //Link facebook score submit to submit score button
    document.getElementById('submit-hiscore').addEventListener('click', attemptSubmit);
    
    this.level=1;
    this.curBG=
        ctx.createPattern(resources.get(this.firstLevel.prototype.GetTerrain(this.level)), 'repeat');
    this.levelTime = 0;
    wave = 0;
    score = 0;
    enemies = [];
    bullets = [];

    player.pos = [50, canvas.height / 2];
    bgMusic = sample.startSound(4);
    this.isGameOver = false;
    this.lastTime=Date.now();
}


// Game over
GameState.prototype.GameOver = function () {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    
    //Stop processing shoot tap events
    $("body").off("tap");
    
    //Start processing play again/high score tap events
    $('#play-again').on("tap",init);
    $('#submit-hiscore').on("tap",attemptSubmit);
    
    this.isGameOver = true;
    
}