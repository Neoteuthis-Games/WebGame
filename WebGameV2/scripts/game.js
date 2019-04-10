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
//    var GameState = function(game) {};

    function preload() {
        this.load.spritesheet('soldier', 'images/idle-rifle-tileset.png', {
            frameWidth: 313,
            frameHeight: 207
        });
        this.load.image('tiles', 'images/tilemap2.png');
        this.load.tilemapTiledJSON('level1', 'maps/foollv.json');
    }

    function create() {
        this.physics.world.setBounds(0, 0, 800, 600)
        var player = this.physics.add.sprite(400, 300, 'soldier');
        player.setOrigin(0.5, 0.5).setDisplaySize(32,32).setCollideWorldBounds(true).setDrag(5, 1000);

        moveKeys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.input.keyboard.on('keydown_W', function (event) {
            player.setAccelerationY(-800);
        });
        this.input.keyboard.on('keydown_S', function (event) {
            player.setAccelerationY(800);
        });
        this.input.keyboard.on('keydown_A', function (event) {
            player.setAccelerationX(-800);
        });
        this.input.keyboard.on('keydown_D', function (event) {
            player.setAccelerationX(800);
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
    var map = this.make.tilemap({ key: 'level1' })
    //this.level1 = this.game.add.tilemap('level1'); 
   // this.level1.addTilesetImage('tiles', 'mapTiles'); 
   // this.bgLayer = this.level1.createLayer('ground');
   // this.wallsLayer = this.level1.createLayer('walls');
   // this.level1.setCollisionByExclusion([1,2,3,16], true, this.wallsLayer);
    var tileset = map.addTilesetImage("thefool2", "tiles");
  // Parameters: layer name (or index) from Tiled, tileset, x, y
 var belowLayer = map.createStaticLayer("Ground", tileset, 0, 0);
  var worldLayer = map.createStaticLayer("Walls", tileset, 0, 0);
    }

    function update() {
   // this.game.physics.arcade.collide(this.player, this.wallsLayer);
    }