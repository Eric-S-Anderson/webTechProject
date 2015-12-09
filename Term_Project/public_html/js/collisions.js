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


function executeCollisions(checkEntity){
    var checkAgainst = entityManager.getEntityList(checkEntity.collideType);
    
    // Run collision detection
    for(var i=0; i<checkAgainst.length; i++) {
        var pos = checkAgainst[i].pos;
        var size = checkAgainst[i].sprite.size;

            if(boxCollides(pos, size, checkEntity.pos, checkEntity.sprite.size)) {
                //Apply damage to me
                checkEntity.health -= checkAgainst[i].givesDamage;
            }
    }
    
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