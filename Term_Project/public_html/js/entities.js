var Entity = function () {
    //superclass for all game entities
    this.pos = [0, 0];                  //array containing x and y coords of object as int
    this.size = [0, 0];                 //array containing x length and y length of object as int
    this.speed = 0;                     //speed of object
    this.dir = 0;                       //direction of object in radians
    this.fireSpeed = 0;                 //if objects spawns a projectile, how fast can it spawn them
    this.lastFire = null;         //last time object spawned a projectile
    this.triggersLvlEnd = false;        //if this object is destroyed does the level end
    this.triggersGameEnd = false;       //if this object is destroyed does game end (player and final boss)
    this.destroySpawn = null;   //Entity to spawn when this entity is destroyed
    this.sprite = new Sprite();         //Sprite object related to this entity
    this.soundIndex = 0;                //index of related sound
    this.health = 0;                    //object's health
    this.givesDamage = 0;               //amount of damage caused upon collision with this object
    this.takesDamage = false;           //can this object receive damage upon collision
    this.collideType = 0;               //type of collision object
    this.age = new Date();              //how long this object has been alive
    this.scoreValue = 0;                //the value to the player of destroying this object
};

Entity.prototype.Destroy = function () {
    //Spawns destroySpawn (e.g. explosion) via EntityManager.Spawn(), 
    //increments GameState.score by scoreValue, 
    //checks game end var and if true calls GameState.GameOver, 
    //checks level end var and if true then calls GameState.NextLevel
    
    entityManager.Spawn(this.destroySpawn);
    GameState.score += this.scoreValue;
    if (this.triggersGameEnd){
        GameState.GameOver();
    }
    if (this.triggersLvlEnd){
        GameState.NextLevel();
    }
};

Entity.prototype.Clear = function () {
    //deletes this object (no animations, or sounds)
    //Splice performed in entityManager upon true update self
    
};

Entity.prototype.Fire = function () {
    //if date.now()- fireSpeed is greater than lastFire 
    //then spawn bullet via entitymanager, 
    //and update lastFire with date.now()
    
    if (Date.now() - this.fireSpeed > this.lastFire){
        //spawn bullet
        EntityManager.Spawn(new Bullet());
        //reset lastFire tracker
        this.lastFire = Date.now();
    }
    
};

Entity.prototype.CheckOffscreen = function () {
    //checks if object is offscreen, returns a bool
    
    if(this.pos[0] + this.sprite.size[0] < 0) {
        //object is offscreen
        return true;
    }else{
        //object is not offscreen
        return false;
    }
};

Entity.prototype.UpdateSprite = function (elapsed) {
    //updates sprite animation frame as follows: 
    //requests sprite be updated to current frame via sprite.Update(elapsed), 
    //saves current context (Domhandler.ctx), 
    //translates context to entity position, 
    //renders sprite via sprite.Render(ctx), 
    //restores context

    this.sprite.update(elapsed);
    
};

Entity.prototype.UpdateSelf = function (elapsed) {
    //adds elapsed to age, calls AILogic() to perform any AI changes needed, 
    //moves via move(), checks for offscreen via CheckOffscreen()
    // if true then handles based on offscreenType, 
    // update sprite via UpdateSprite(elapsed), 
    // if takesDamage var is true then check for collision via Collisions.ExecuteCollision(this), 
    // check health to determine if<0 and 
    // if so calls Destroy() and returns 'true' to calling function 
    // which will be EntityManager.UpdateEntities()
                
    this.age += elapsed;
    this.AILogic(elapsed);
    
    if (this.CheckOffscreen()){
        return true; //tell entityManager to clear
    }
    
    this.UpdateSprite(elapsed);
    //if (this.takesDamage){
    //    Collisions.ExecuteCollision(this);
    //}
    if (this.health <= 0){
        this.Destroy();
        return true;
    }
    
};

Entity.prototype.Spawn = function (position, direction) {
    //spawns object at pos heading dir, 
    //instantiates new Sprite() and assigns to sprite var, 
    //calls sample.startSound(soundIndex) to start sound
    
    this.pos = position;
    this.dir = direction;
};

Entity.prototype.AILogic = function () {
    //executes logic based on age and/or elapsed etc, called by UpdateSelf()
    
    
};


function PlayerAvatar(){
    //player constructor
    
    Entity.call(this);
    
};

PlayerAvatar.prototype = Object.create(Entity.prototype);
PlayerAvatar.prototype.constructor = PlayerAvatar;

PlayerAvatar.prototype.Spawn = function (position, direction){
    //spawn player avatar
    
    this.pos = position;
    this.dir = direction;
    this.health = 100;
    this.fireSpeed = 0.2;
    this.takesDamage = true;
    this.givesDamage = 5;
    this.triggersGameEnd = true;
    this.soundIndex = 0;
    this.sprite = new Sprite();
    this.collideType = 1; //enemy
};

PlayerAvatar.prototype.UpdateSelf = function (elapsed){
    //interpret controls
    
    
    
};

PlayerAvatar.prototype.MoveX = function (amount){
    //amount to move in X dir
    
    this.pos[0] += amount;
};

PlayerAvatar.prototype.MoveY = function (amount){
    //amount to move in Y dir
    
    this.pos[1] += amount;
};


function Bullet(){
    //bullet constructor
    
    Entity.call(this);
    
};

Bullet.prototype = Object.create(Entity.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.Spawn = function (position, direction){
    //spawn bullet
    
    this.pos = position;
    this.dir = direction;
    this.speed = 50;
    this.givesDamage = 20;
    this.destroySpawn = new Sprite();
    this.soundIndex = 0;
    this.sprite = new Sprite();
};

Bullet.prototype.UpdateSelf = function (elapsed){

    
};


function Explosion(){
    //explosion constructor
    
    Entity.call(this);
    
};

Explosion.prototype = Object.create(Entity.prototype);
Explosion.prototype.constructor = Explosion;

Explosion.prototype.Spawn = function (position, direction){
    //spawn explosion
    
    this.pos = position;
    this.dir = direction;
    this.soundIndex = 0;
    this.sprite = new Sprite();
};

Explosion.prototype.UpdateSelf = function (elapsed){

    
};


function Enemy(){
    //enemy constructor

    Entity.call(this);
    
};

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.Spawn = function (position, direction){
    //spawn enemy
    
    this.pos = position;
    this.dir = direction;
    this.speed = 150 * (Math.random() + 1);
    this.health = 25;
    this.takesDamage = true;
    this.scoreValue = 50;
    this.givesDamage = 15;
    this.destroySpawn = new Explosion();
    this.soundIndex = 0;
    this.sprite = new Sprite('img/tank.png', [0, 118], [118, 118], 8, [0, 1]);

    
};

Enemy.prototype.AILogic = function (elapsed){
    this.pos[0] -= this.speed * elapsed;
    console.log(this.speed);
}




