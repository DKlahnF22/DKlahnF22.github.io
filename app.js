const gameState = {};
gameState.player;
var bullets;
var fire;
var cursors;
var text;
var MSpeed = 1;
var XP = 0;
var lastFired = 0;
var PBDelay = 1500;
var diff = 0;
function preload(){
  this.load.image('spaceship', 'assets/images/spaceship.jpg');
  this.load.image('shoe', 'assets/images/shoe.png');
  this.load.image('PBullet', 'assets/images/PBullet.png');
  this.load.image('enemy', 'assets/images/contact-photo.jpg');
}

function create(){
  var Enemy = new Phaser.Class({
    Extends: Phaser.Physics.Arcade.Image,
    initialize:
    function Enemy()
    {
      Phaser.Physics.Aracde.Image.call(this, 0, 0, 'enemy');
      this.setDamping(false);
      this.setDrag(0);
      this.setMaxVelocity(400);
      this.setScale(.15);
      this.setAcceleration(50);
    }
  });
  //start of bullet stuff
  var Bullet = new Phaser.Class({

        Extends: Phaser.Physics.Arcade.Image,

        initialize:
        //defines the bullet
        function Bullet (scene)
        {
            Phaser.Physics.Arcade.Image.call(this, scene, 0, 0, 'PBullet');
          this.setScale(0.25);

            this.setBlendMode(1);
            this.setDepth(1);

            this.speed = 1000;
            this.lifespan = 1000;

            this._temp = new Phaser.Math.Vector2();
        },
        //tells the bullet where to be fired from
        fire: function (ship)
        {
            this.lifespan = 1000;

            this.setActive(true);
            this.setVisible(true);
            // this.setRotation(ship.rotation);
            this.setAngle(gameState.player.body.rotation);
            this.setPosition(gameState.player.x, gameState.player.y);
            this.body.reset(gameState.player.x, gameState.player.y);
                var angle = Phaser.Math.DegToRad(gameState.player.body.rotation);
            this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);

            this.body.velocity.x *= 2;
            this.body.velocity.y *= 2;
        },
  

        update: function (time, delta)
        {
            this.lifespan -= delta;

            if (this.lifespan <= 0)
            {
                this.setActive(false);
                this.setVisible(false);
                this.body.stop();
            }
        }
    });
  // end of bullet stuff
  //start of player stuff
    gameState.player = this.physics.add.image(400, 300, 'spaceship');

    gameState.player.setDamping(true);
    gameState.player.setDrag(.97);
    gameState.player.setMaxVelocity(200 * MSpeed);
  // end of player stuff
    gameState.cursors = this.input.keyboard.createCursorKeys();
    fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
    //text1 = this.add.text(10, 25, '', { font: '16px Courier', fill: '#00ff00' });
    //text2 = this.add.text(10, 40, '', { font: '16px Courier', fill: '#00ff00' });
    //text3 = this.add.text(10, 55, '', { font: '16px Courier', fill: '#00ff00' });
    //text4 = this.add.text(10, 70, '', { font: '16px Courier', fill: '#00ff00' });
    //text5 = this.add.text(10, 85, '', { font: '16px Courier', fill: '#00ff00' });
  gameState.bullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 30,
        runChildUpdate: true
    });
  gameState.enemies = this.physics.add.group({
    classType: Enemy,
    maxSize: 4 + diff,
    runChildUpdate: true
  });
}

function update(time){
    // start of movement stuff
  if (gameState.cursors.up.isDown)
    {
        this.physics.velocityFromRotation(gameState.player.rotation, 200, gameState.player.body.acceleration);
    }
    else if(gameState.cursors.down.isDown){
      this.physics.velocityFromRotation(gameState.player.rotation, -50, gameState.player.body.acceleration);
    }
    else
    {
        gameState.player.setAcceleration(0);
    }
    if (gameState.cursors.left.isDown)
    {
        gameState.player.setAngularVelocity(-300);
    }else if (gameState.cursors.right.isDown){
      gameState.player.setAngularVelocity(300);
    }else{
      gameState.player.setAngularVelocity(0);
    }
  // fix with if else statment because code is dumb 
    
    //end of movement stuff
  //start of enemy rotation
		//const rotation = Phaser.Math.Angle.Between(x, y, tx, ty)
  //gameState.vec = new Phaser.Math.Vector2(gameState.player.x - gameState.enemy1.x, gameState.player.y - gameState.enemy1.y)
  gameState.rotation = Phaser.Math.Angle.Between(gameState.enemy1.x, gameState.enemy1.y, gameState.player.x, gameState.player.y);
		gameState.enemy1.setAngle(Phaser.Math.RadToDeg(gameState.rotation));
  //end of enemy rotation
    //start of XP stuff
    //if(XP == ){
      
      
    //}
    //end of XP stuff
    //start of damage stuff (taking damage, dealing damage, damage modifiers)
    if (gameState.cursors.space.isDown){
      PBullet(time);
    }
  //FINISH THIS (GAME WILL NOT WORK OTHERWISE, FINISH XP TOO)

    text.setText('Speed: ' + gameState.player.body.speed);
    //text1.setText('Rotation: ' + gameState.rotation);
    //text2.setText('Player X:' + gameState.player.x);
    //text3.setText('Player Y:' + gameState.player.y);
    //text4.setText('Enemy X:' + gameState.enemy1.x);
    //text5.setText('Enemy Y:' + gameState.enemy1.y);
  
  this.physics.world.wrap(gameState.player, 5);

}

const config = {
    type: Phaser.AUTO,
    width: 1350,
    height: 570,
    backgroundColor: "b9eaff",
    physics: {
        default: 'arcade',
        arcade: {
            fps: 60,
            gravity: {y: 0},
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);
//start of functions
function PBullet(time){
  if (fire.isDown && time > lastFired)
    {
        var bullet = gameState.bullets.get();

        if (bullet)
        {
            bullet.fire(gameState.player);

            lastFired = time + 100;
        }
    }
}
//start of enemy spawning
      function Spawn (diff){
        num = 4 + diff;
        for(let i=0;i<num;i++){
          gameState.enemy1 = this.physics.add.image(800,500, 'enemy');
          this.setDamping(false);
          this.setDrag(0);
          this.setMaxVelocity(400);
          this.setScale(.15);
          this.setAngle(0);
          this.setAcceleration(100);
        }
      }
  //end of enemy spawning