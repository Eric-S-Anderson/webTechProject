GameState = function(){
    this.isGameOver = false;
    this.level = 0;
    this.firstLevel = null;
    this.curBG = null;
    this.now = 0;
    this.lastTime = 0;
    this.elapsed = 0;
    this.levelTime = 0;
    this.gameTime = 0;
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
    //this.levelTime += this.elapsed;
}


GameState.prototype.NextLevel = function(){
    //level increment
    this.level++;
    this.levelTime=0;
    this.curBG=
        ctx.createPattern(resources.get(this.firstLevel.prototype.GetTerrain(this.level)), 'repeat');
}

GameState.prototype.Update = function(){
    this.levelTime = this.levelTime+this.elapsed;
    handleInput(this.elapsed);
    updateEntities(this.elapsed);
    //console.log(this.gameTime);
    if(!this.isGameOver){
        this.firstLevel.prototype.UpdateLevel(this.level,this.levelTime);
    }
    
    checkCollisions();
    scoreEl.innerHTML = score;
}

// Reset game to original state
GameState.prototype.Reset = function() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    
    //Reset facebook score submission
    document.getElementById('submit-hiscore').innerHTML='Post your score to Facebook';
    //Link facebook score submit to submit score button
    document.getElementById('submit-hiscore').addEventListener('click', attemptSubmit);
    
    this.level=1;
    this.curBG=
        ctx.createPattern(resources.get(this.firstLevel.prototype.GetTerrain(this.level)), 'repeat');
    this.isGameOver = false;
    this.gameTime = 0;
    wave = 0;
    score = 0;
    enemies = [];
    bullets = [];

    player.pos = [50, canvas.height / 2];
    bgMusic = sample.startSound(4);
    
    this.lastTime=Date.now();
}


// Game over
GameState.prototype.GameOver = function () {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    //document.getElementById('submit-score').style.display = 'block';
    this.isGameOver = true;
}