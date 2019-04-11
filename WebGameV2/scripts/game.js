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
    //var camera = game.cameras.main;

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
        this.load.spritesheet('enemy2', 'images/enemy2.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('enemy3', 'images/enemy3.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('enemy4', 'images/enemy4.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image('item', 'images/item.png');
        this.load.image('tiles', 'images/tilemap2.png');
        this.load.tilemapTiledJSON('level1', 'maps/foollv.json');
        this.load.audio("music","audio/01 game-game_0.ogg");
    }

    function create() {
        var music = this.sound.add("music", 'loop: true');
        music.play();
        
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
            this.speed = Phaser.Math.GetSpeed(800, 1);
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
            if(Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y)>450)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }
    });

        
        var collectable = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize:
        function item (scene)
        {
            //SPRITES NEEDED
            Phaser.GameObjects.Image.call(this, scene, 32, 32, 'item');
        },
        create: function (x, y)
        {
            this.setPosition(x, y);
            this.setActive(true);
            this.setVisible(true);
        },
        update: function (time, delta)
        {
            if(Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y)<20)
            {
                //ADDD EFFECTS HERE
                 console.log("Collected!");
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
            this.speed = Phaser.Math.GetSpeed(65, 1);
        },
        summon: function (x, y)
        {
            this.setPosition(x, y);
            this.setActive(true);
            this.setVisible(true);
        },
        update: function (time, delta)
        {
            this.target = player;
            targetPosX = player.x;
            targetPosY = player.y;
            console.log('Player spotted at - X: ' + player.x + ' Y: ' + player.y);
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
        items = this.add.group({
        classType: collectable,
        maxSize: 20,
        runChildUpdate: true
    });
    speed = Phaser.Math.GetSpeed(300, 1);
            var map = this.make.tilemap({ key: 'level1' })
            var tileset = map.addTilesetImage("thefool2", "tiles");
            var belowLayer = map.createDynamicLayer("ground", tileset, 0, 0);
            var worldLayer = map.createDynamicLayer("walls", tileset, 0, 0);
        worldLayer.setCollisionBetween(4, 15);
        this.physics.world.setBounds(0, 0, 3200, 3200)
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
        }
        });
        this.input.keyboard.on('keydown_Q', function (event) {
            //SUMMON A MONSTER. LETS HAVE MULTIPLE OFFSCREEN SPAWN POINTS
                  var monster = monsters.get();

        if (monster)
        {
            var valueX = Phaser.Math.Between(-150, 150);
            var valueY = Phaser.Math.Between(-150, 150);
            monster.summon(player.x + valueX, player.y + valueY);
        }
        });
        this.input.keyboard.on('keydown_W', function (event) {
            player.body.setVelocityY(-65);
            player.setAccelerationY(-65);
            playerStats.speed= playerStats.movespeed;
        });
        this.input.keyboard.on('keydown_S', function (event) {
            player.body.setVelocityY(65);
            player.setAccelerationY(65);
            playerStats.speed= -playerStats.movespeed;
        });
        this.input.keyboard.on('keydown_A', function (event) {
            player.body.setVelocityX(-65);
            player.setAccelerationX(-65);
            playerStats.moveAngle = playerStats.turnspeed;
        });
        this.input.keyboard.on('keydown_D', function (event) {
            player.body.setVelocityX(65);
            player.setAccelerationX(65);
             playerStats.moveAngle = -playerStats.turnspeed;
        });
        //apparently this line is important to make motion seem more natural.
        player.body.velocity.normalize().scale(speed);
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
        this.physics.add.collider(player, worldLayer);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(player); 
        //spawn items
        for(var i = 0; i<20; i++){
             var item = items.get();
        if (item)
        {
            var valueX = Phaser.Math.Between(0, 200);
            var valueY = Phaser.Math.Between(0, 200);
            item.create(16*valueX,16*valueY);
            console.log(valueX,valueY);
        }
        }
        
    }

    function update(time, delta) {
        //player.rotation = game.physics.arcade.angleToPointer(player);
        //playerStats.onEnterframe();
      //player.translate(playerStats.x, playerStats.y);
        //player.rotate(playerStats.angle);  
       
   }
