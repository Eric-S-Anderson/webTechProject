//App.js main javascript function

myGame=bootstrap(); //perform bootstrap and get first level as current

// The main game loop
var lastTime;

function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;  //elapsed time in seconds

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};


function init() {
    terrainPattern = ctx.createPattern(resources.get('img/tiles.png'), 'repeat');

    //Link reset to play again button
    document.getElementById('play-again').addEventListener('click', function() {
        myGame.Reset();
    });
    
    myGame.Reset();
    lastTime = Date.now();
    
    main();
}


function loadGraphics() {

//Array of images to load
resources.load([
    'img/sprites.png',
    'img/tiles.png',
    'img/smoke.png',
    'img/player.png',
    'img/tank.png',
    'img/testspritesheet.png'
]);

//Callback init after loading
resources.onReady(init);

}

// Game state

/* OLD PLAYER
var player = {
    pos: [0, 0],
                sprite: new Sprite('img/player.png',
                                       [0, 0], //location x,y
                                       [103, 176], //size w,h   
                                       8, //speed
                                       [0, 1, 2], //frames
                                       'horizontal',  //direction
                                       false, //run once
                                       [16,8], //hit box size w,h
                                       [47,84]) //hit box offset x,y
};
*/
var player = {
     pos: [0, 0],
                sprite: new Sprite('img/testspritesheet.png',
                                       [90, 155], //location x,y
                                       [103, 70], //size w,h   
                                       8, //speed
                                       [0, 1, 2], //frames
                                       'horizontal',  //direction
                                       false, //run once
                                       [16,8], //hit box size w,h
                                       [47,84]) //hit box offset x,y
};



var enemies = [];
var bullets = [];
var explosions = [];

var lastFire = Date.now();
var wave = 0;
var gameTime = 0;  //Game time in seconds
var terrainPattern;

var score = 0;
var scoreEl = document.getElementById('score');

// Speed in pixels per second
var playerSpeed = 200;
var bulletSpeed = 500;
var enemySpeed = 150; //Base value (max is up to 2x base)
var fireSpeed = 200; //Limits players rate of fire

// Update game objects
function update(dt) {
    gameTime += dt;

    handleInput(dt);
    updateEntities(dt);
    
    //Adding Gamestate class
    myGame.Update(gameTime);
    
    checkCollisions();

    scoreEl.innerHTML = score;
};

//Handle touch events
var diffX, diffY, startX, offsetX, startY, offsetY, movedX, movedY, tapped;
var el = $("body");

//Touch start (register location)
el[0].addEventListener('touchstart', function(e) {
  e.preventDefault();
  offsetX = ($(window).width()-el.outerWidth(true))/2;
  startX = e.targetTouches[0].pageX - offsetX;
  offsetY = ($(window).height()-el.outerHeight(true))/2;
  startY = e.targetTouches[0].pageY - offsetY;
}, false);

//Touch move (save x,y difference)
el[0].addEventListener("touchmove",   function(e) {
    e.preventDefault();
    diffX = (e.changedTouches[0].pageX - offsetX) - startX - movedX; 
    diffY = (e.changedTouches[0].pageY - offsetY) - startY - movedY;
    }
    , false);

//Touch end (reset x,y difference)
el[0].addEventListener("touchend", function(e) {
  e.preventDefault();
  diffX = 0;
  diffY = 0;
  startX = 0;
  startY = 0;
  movedX = 0;
  movedY = 0;
}, false);

//Tap event (shoot or restart)
$("body").on("tap",function(){
    
       if (myGame.isGameOver){
           //reset() //removed since play again button performs this function
       }else{
           tapped=1;
       }
});

//Handle input (keyboard and touch)
function handleInput(dt) {
    var toMove;
    
    if(input.isDown('DOWN') || input.isDown('s') || diffY-movedY>0 ) {
        if (startY!=0){ //If a touch event
            if(Math.abs(diffY-movedY)<playerSpeed*dt){ //And diff is smaller than a std move
                toMove=Math.abs(diffY-movedY); //Only move diff
            }else{ //If diff is larger than a std move
                toMove=playerSpeed*dt; //Then move std amt
            }
        }else{ //Not a touch event
            toMove=playerSpeed*dt; //So move std amt
        }
        player.pos[1] += toMove;
        
        if(startY !=0){movedY+=toMove;} //if touchevent adjust moved dist
 
    }

    if(input.isDown('UP') || input.isDown('w') || diffY-movedY<0 ) {
        if (startY!=0){ //If a touch event
            if(Math.abs(diffY-movedY)<playerSpeed*dt){ //And diff is smaller than a std move
                toMove=Math.abs(diffY-movedY); //Only move diff
            }else{ //If diff is larger than a std move
                toMove=playerSpeed*dt; //Then move std amt
            }
        }else{ //Not a touch event
            toMove=playerSpeed*dt; //So move std amt
        }
        player.pos[1] -= toMove;

        if(startY !=0){movedY-=toMove;} //if touchevent adjust moved dist
    }

    if(input.isDown('LEFT') || input.isDown('a') || diffX-movedX<0) {
        if (startX!=0){ //If a touch event
            if(Math.abs(diffX-movedX)<playerSpeed*dt){ //And diff is smaller than a std move
                toMove=Math.abs(diffX-movedX); //Only move diff
            }else{ //If diff is larger than a std move
                toMove=playerSpeed*dt; //Then move std amt
            }
        }else{ //Not a touch event
            toMove=playerSpeed*dt; //So move std amt
        }
        
        player.pos[0] -= toMove;//Move

        if(startX !=0){movedX-=toMove;} //if touchevent adjust moved dist
    }

    if(input.isDown('RIGHT') || input.isDown('d') || diffX-movedX>0) {
        if (startX!=0){ //If a touch event
            if(Math.abs(diffX-movedX)<playerSpeed*dt){ //And diff is smaller than a std move
                toMove=Math.abs(diffX-movedX); //Only move diff
            }else{ //If diff is larger than a std move
                toMove=playerSpeed*dt; //Then move std amt
            }
        }else{ //Not a touch event
            toMove=playerSpeed*dt; //So move std amt
        }
        player.pos[0] += toMove;

        if(startX !=0){movedX+=toMove;} //if touchevent adjust moved dist
    }

    if( (input.isDown('SPACE') || tapped==1) &&
       !myGame.isGameOver &&
       Date.now() - lastFire > fireSpeed) {  //Limit rate of fire
        var x = player.pos[0] + player.sprite.size[0] / 2;  //Originate from center of player
        var y = player.pos[1] + player.sprite.size[1] / 2;
        
        bullets.push({ pos: [x, y],
                       dir: 'forward',
                       sprite: new Sprite('img/sprites.png', [0, 39], [18, 8]) });
        bullets.push({ pos: [x, y],
                       dir: 'up',
                       sprite: new Sprite('img/sprites.png', [0, 39], [18, 8]) });
        bullets.push({ pos: [x, y],
                       dir: 'down',
                       sprite: new Sprite('img/sprites.png', [0, 39], [18, 8]) });

        sample.startSound(0);  //Play shoot sound
        
        lastFire = Date.now();
        tapped=0;  //Tap touch event has been handled
    }
}

function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);

    // Update all the bullets
    for(var i=0; i<bullets.length; i++) {
        var bullet = bullets[i];

	//Calculate bullet positions based on type of movement

	var bulletDist = bulletSpeed * dt; //distance traveled

	if (bullet.dir=='up') {  //Move up at 22 degrees (0.38 rads)
		bullet.pos[0] += bulletDist * Math.cos(0.38); //x dist
		bullet.pos[1] -= bulletDist * Math.sin(0.38); //y dist
	} else if (bullet.dir=='down') {  //Move down at 22 degrees (0.38 rads)
		bullet.pos[0] += bulletDist * Math.cos(0.38); //x dist
		bullet.pos[1] += bulletDist * Math.sin(0.38); //y dist
	} else { //Move forward
		bullet.pos[0] += bulletDist; //x dist (forward)
	}
	
        // Remove the bullet if it goes offscreen
        if(bullet.pos[1] < 0 || bullet.pos[1] > canvas.height ||
           bullet.pos[0] > canvas.width) {
            bullets.splice(i, 1);
            i--;
        }
    }

    // Update all the enemies
    for(var i=0; i<enemies.length; i++) {
        enemies[i].pos[0] -= enemies[i].speed * dt;
        enemies[i].sprite.update(dt);

        // Remove if offscreen
        if(enemies[i].pos[0] + enemies[i].sprite.size[0] < 0) {
            enemies.splice(i, 1);
            i--;
        }
    }

    // Update all the explosions
    for(var i=0; i<explosions.length; i++) {
        explosions[i].sprite.update(dt);

        // Remove if animation is done
        if(explosions[i].sprite.done) {
            explosions.splice(i, 1);
            i--;
        }
    }
}

// Collisions

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}

function checkCollisions() {
    checkPlayerBounds();
    
    // Run collision detection for all enemies and bullets
    for(var i=0; i<enemies.length; i++) {
        var pos = enemies[i].pos;
        var size = enemies[i].sprite.size;

        for(var j=0; j<bullets.length; j++) {
            var pos2 = bullets[j].pos;
            var size2 = bullets[j].sprite.size;

            if(boxCollides(pos, size, pos2, size2)) {
                // Remove the enemy
                enemies.splice(i, 1);
                i--;

                // Add score
                score += 100;

                // Add an explosion
                explosions.push({
                    pos: pos,
                    sprite: new Sprite('img/smoke.png',
                                       [0, 0], //location x,y
                                       [96, 94], //size w,h
                                       
                                       16, //speed
                                       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], //frames
                                       null,  //direction
                                       true) //run once
                });
                
                //Play an explosion sound : sound buffer index 1 or 2
                sample.startSound(Math.ceil(Math.random()+0.5)); //random 1 or 2

                // Remove the bullet and stop this iteration
                bullets.splice(j, 1);
                break;
            }
        }

        //Check for player collision
        //First calculate hit box position
        var playerBoxPos = [0,0];
        playerBoxPos[0] = player.pos[0]+player.sprite.boxOffset[0];
        playerBoxPos[1] = player.pos[1]+player.sprite.boxOffset[1];
        
        
        if(boxCollides(pos, size, playerBoxPos, player.sprite.boxSize)
          && !myGame.isGameOver) {

            //Play game over sound
            sample.startSound(3);
            sample.stopSound(bgMusic); //Stop background music
 
           myGame.GameOver();
        }
    }
}

function checkPlayerBounds() {
    //Check player position in canvas
    if(player.pos[0] < 0) { //x position
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if(player.pos[1] < 0) { //y position
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }
}

// Draw everything
function render() {
    ctx.fillStyle = terrainPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render the player if the game isn't over
    if(!myGame.isGameOver) {
        renderEntity(player);
    }

    renderEntities(bullets);
    renderEntities(enemies);
    renderEntities(explosions);
};

function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }    
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}

//Submit score
function attemptSubmit(){
    postHighScore(score);
}

;
