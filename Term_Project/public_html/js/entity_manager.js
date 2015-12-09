//Entity manager

var enemies = [];
var bullets = [];
var explosions = [];

var lastFire = Date.now();
var wave = 0;

var score = 0;
var scoreEl = document.getElementById('score');

// Speed in pixels per second
var playerSpeed = 200;
var bulletSpeed = 500;
var enemySpeed = 150; //Base value (max is up to 2x base)
var fireSpeed = 200; //Limits players rate of fire

EntityManager = function (){
    this.player = null;
    this.entities = [];
}


EntityManager.prototype.Spawn= function (entityType,pos,dir){
    var newEntity;
    
    if (entityType="enemy"){
        newEntity = new Enemy();

    }
    
    newEntity.Spawn(pos,dir);
    this.entities.push(newEntity);
    
}


EntityManager.prototype.UpdateEntities= function (elapsed){
    // Update all the enemies
    for(var i=0; i<this.entities.length; i++) {
        
        //If update returns true, clear this object
        if(this.entities[i].UpdateSelf(elapsed)){
         
            this.entities.splice(i,1);
            i--;
        }
    }
    
}

EntityManager.prototype.getEntityList= function (collideType){
    var checkList = [];
    
    //Create list of entities with a different collide type
    //and that give damage
    for(var i=0; i<this.entities.length; i++) {
        if(this.entities[i].collideType!==collideType &&
           this.entities[i].givesDamage>0){
            checkList.push(this.entities[i]);
        }
    }
    
    return checkList;
}


var player = {
     pos: [0, 0],
                sprite: new Sprite('img/testspritesheet.png',
                                       [90, 155], //location x,y
                                       [103, 70], //size w,h   
                                       8, //speed
                                       [0, 1, 2], //frames
                                       'horizontal',  //direction
                                       false, //run once
                                       [40,5], //hit box size w,h
                                       [5,30]) //hit box offset x,y
};

myGame=bootstrap(); //perform bootstrap and get first level as current


function init() {
   
    /*
    //Link reset to play again button
    document.getElementById('play-again').addEventListener('click', function() {
        myGame.Reset();
    });
    */
    
    myGame.Reset();
    main();
}

function main(){
    myGame.Main();
    requestAnimFrame(main);
}

function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);

    // Update all the bullets
    for(var i=0; i<bullets.length; i++) {
        var bullet = bullets[i];

	//Calculate bullet positions based on type of movement

	var bulletDist = bulletSpeed * dt; //distance traveled (simple)
        bullet.sprite.update(dt);
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

    //ctx.fillStyle = ctx.createPattern(resources.get(myGame.curBG), 'repeat');
    ctx.fillStyle = myGame.curBG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render the player if the game isn't over
    if(!myGame.isGameOver) {
        renderEntity(player);
    }

    renderEntities(bullets);
    renderEntities(enemies);
    renderEntities(explosions);
    renderEntities(entityManager.entities);
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
    //No more taps allowed to submit high score
    $('#submit-hiscore').off("tap");
    postHighScore(score);
    
}

;
