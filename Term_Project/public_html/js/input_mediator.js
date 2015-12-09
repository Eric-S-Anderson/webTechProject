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
        var x = player.pos[0] + player.sprite.size[0] / 2;  //Originate from squirrel
        var y = player.pos[1] + player.sprite.size[1] / 4;
        
        bullets.push({ pos: [x, y],
                       dir: 'forward',
                       sprite: new Sprite('img/nutSprite.png', [0, 0], [15, 15], 16 ,
                                        [0,1,2,3,4,5,6,7], 'horizontal', false) });
        
        sample.startSound(0);  //Play shoot sound
        
        lastFire = Date.now();
        tapped=0;  //Tap touch event has been handled
    }
}