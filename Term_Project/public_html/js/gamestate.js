GameState = function(){
    this.isGameOver = false;
    this.level = 0;
    this.firstLevel = null;
}

GameState.prototype.NextLevel = function(){
    //level increment
    this.level++;
}

GameState.prototype.Update = function(curTime){
    if(!this.isGameOver){
        this.firstLevel.prototype.UpdateLevel(this.level,curTime);
    }
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
    this.isGameOver = false;
    gameTime = 0;
    wave = 0;
    score = 0;
    enemies = [];
    bullets = [];

    player.pos = [50, canvas.height / 2];
    bgMusic = sample.startSound(4);
}


// Game over
GameState.prototype.GameOver = function () {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    //document.getElementById('submit-score').style.display = 'block';
    this.isGameOver = true;
}