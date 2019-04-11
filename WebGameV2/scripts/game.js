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
    var player;
    var lasers;
    var firespeed = 100;
    var cooldown = 0;
    var lastFired = 0;



    function preload() {
        this.load.spritesheet('soldier', 'images/idle-rifle-tileset.png', {
            frameWidth: 313,
            frameHeight: 207
        });
         this.load.spritesheet('laser', 'images/beams.png', {
            frameWidth: 70,
            frameHeight: 100
        });
        this.load.spritesheet('enemy1', 'images/enemy1.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image('tiles', 'images/tilemap2.png');
        this.load.tilemapTiledJSON('level1', 'maps/foollv.json');
    }

    function create() {
        
var character = new Phaser.Class({
        //Extends: Phaser.GameObjects.Image,
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
},
    onEnterframe: function(){
       this.moveAngle = 0;
       this.speed = 0
       this.angle += this.moveAngle * Math.PI / 180;
       playerStats.x += playerStats.speed * Math.sin(this.angle);
       playerStats.y -= playerStats.speed * Math.cos(this.angle);
    }
});
        
var laser = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize:
        function laser (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'laser');
            this.speed = Phaser.Math.GetSpeed(400, 1);
        },
        fire: function (x, y)
        {
            this.setPosition(x, y);
            this.setRotation(30);
            this.setActive(true);
            this.setVisible(true);
        },
        update: function (time, delta)
        {
            this.x += this.speed * delta;
            if (this.y < -50 || this.x >= 850)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }
    });

        var monster = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize:
        function monster (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'enemy1');
            this.speed = Phaser.Math.GetSpeed(400, 1);
        },
        summon: function (x, y)
        {
            this.setPosition(x, y);
            this.setActive(true);
            this.setVisible(true);
        },
        update: function (time, delta)
        {
            this.x += this.speed * Phaser.Math.Between(-20,20);
            this.y += this.speed * Phaser.Math.Between(-20,20);
        }
    });
        
    lasers = this.add.group({
        classType: laser,
        maxSize: 10,
        runChildUpdate: true
    });

        monsters = this.add.group({
        classType: monster,
        maxSize: 20,
        runChildUpdate: true
    });
        
    speed = Phaser.Math.GetSpeed(300, 1);
            var map = this.make.tilemap({ key: 'level1' })
            var tileset = map.addTilesetImage("thefool2", "tiles");
            var belowLayer = map.createStaticLayer("ground", tileset, 0, 0);
            var worldLayer = map.createStaticLayer("walls", tileset, 0, 0);
        worldLayer.setCollisionBetween(4, 15);
        this.physics.world.setBounds(0, 0, 800, 600)
        //player
       var player = this.physics.add.sprite(400, 300, 'soldier');
        player.body.allowRotation = false;
       let playerStats = new character('player', 'soldier',32,32, 0, 0, 5, 6.5);
        player.setOrigin(0.5, 0.5).setDisplaySize(32,32).setCollideWorldBounds(true).setDrag(20000, 200000);
        moveKeys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D,
        });
//key.isDown is much smoother than onKeydown
        this.input.keyboard.on('keydown_SPACE', function (event) {
                  var laser = lasers.get();

        if (laser)
        {
            laser.fire(player.x, player.y);
            lastFired = time + 50;
        }
        });
        this.input.keyboard.on('keydown_Q', function (event) {
                  var monster = monsters.get();

        if (monster)
        {
            monster.summon(player.x + 100, player.y + 100);
        }
        });
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

    function update(time, delta) {
        //player.rotation = game.physics.arcade.angleToPointer(player);
        //playerStats.onEnterframe();
      //player.translate(playerStats.x, playerStats.y);
        //player.rotate(playerStats.angle);  
       
   }
