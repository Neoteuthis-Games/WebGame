        var config = {
        type: Phaser.WEBGL,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 0
                },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };


    var game = new Phaser.Game(config);
    var GameState = function(game) {};
    var playerStats;
    var player;
    var lasers;

class character{
constructor(type, sprite, width,height, x, y, movespeed, turnspeed) {
    this.type = type;
    this.sprite = sprite;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.movespeed = movespeed;
    this.turnspeed = turnspeed;
    this.x = x;
    this.y = y; 
}
//    onEnterframe(){
//       this.moveAngle = 0;
//       this.speed = 0
//       this.angle += this.moveAngle * Math.PI / 180;
//       playerStats.x += playerStats.speed * Math.sin(this.angle);
//       playerStats.y -= playerStats.speed * Math.cos(this.angle);
//    }
}

    function preload() {
        this.load.spritesheet('soldier', 'images/idle-rifle-tileset.png', {
            frameWidth: 313,
            frameHeight: 207
        });
         this.load.spritesheet('laser', 'images/beams.png', {
            frameWidth: 70,
            frameHeight: 100
        });
        this.load.image('tiles', 'images/tilemap2.png');
        this.load.tilemapTiledJSON('level1', 'maps/foollv.json');
    }

    function create() {


            var map = this.make.tilemap({ key: 'level1' })
            var tileset = map.addTilesetImage("thefool2", "tiles");
            var belowLayer = map.createStaticLayer("ground", tileset, 0, 0);
            var worldLayer = map.createStaticLayer("walls", tileset, 0, 0);
        worldLayer.setCollisionBetween(4, 15);
        this.physics.world.setBounds(0, 0, 800, 600)
        //player
       var player = this.physics.add.sprite(400, 300, 'soldier');
       let playerStats = new character('player', 'soldier',32,32, 0, 0, 5, 6.5);
        player.setOrigin(0.5, 0.5).setDisplaySize(32,32).setCollideWorldBounds(true).setDrag(20000, 200000);
        moveKeys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D,
        });
//key.isDown is much smoother than onKeydown
        this.input.keyboard.on('keydown_W', function (event) {
            player.setAccelerationY(-65);
            playerStats.speed= playerStats.movespeed;
        });
        this.input.keyboard.on('keydown_S', function (event) {
            player.setAccelerationY(65);
            playerStats.speed= -playerStats.movespeed;
        });
        this.input.keyboard.on('keydown_A', function (event) {
            player.setAccelerationX(-65);
            playerStats.moveAngle = playerStats.turnspeed;
        });
        this.input.keyboard.on('keydown_D', function (event) {
            player.setAccelerationX(65);
             playerStats.moveAngle = -playerStats.turnspeed;
        });

        this.input.keyboard.on('keyup_W', function (event) {
            if (moveKeys['down'].isUp)
                player.setAccelerationY(0);
        });
        this.input.keyboard.on('keyup_S', function (event) {
            if (moveKeys['up'].isUp)
                player.setAccelerationY(0);
        });
        this.input.keyboard.on('keyup_A', function (event) {
            if (moveKeys['right'].isUp)
                player.setAccelerationX(0);
        });
        this.input.keyboard.on('keyup_D', function (event) {
            if (moveKeys['left'].isUp)
                player.setAccelerationX(0);
        });

    }

    function update() {
        //playerStats.onEnterframe();
     // player.translate(playerStats.x, playerStats.y);
       // player.rotate(playerStats.angle);  
       
   }
//function resetLaser(laser) {
//	// Destroy the laser
//	laser.kill();
//}
//   
//function fireLaser() {
//	// Get the first laser that's inactive, by passing 'false' as a parameter
//	var laser = lasers.getFirstExists(false);
//	if (laser) {
//		// If we have a laser, set it to the starting position
//		laser.reset(player.x, player.y - 20);
//		// Give it a velocity of -500 so it starts shooting
//		laser.body.velocity.y = -500;
//	}
