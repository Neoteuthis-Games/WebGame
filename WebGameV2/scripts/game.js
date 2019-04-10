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
            var map = this.make.tilemap({ key: 'level1' })
    var tileset = map.addTilesetImage("thefool2", "tiles");
 var belowLayer = map.createStaticLayer("ground", tileset, 0, 0);
  var worldLayer = map.createStaticLayer("walls", tileset, 0, 0);
        worldLayer.setCollisionBetween(4, 15);
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

    }

    function update() {
   // this.game.physics.arcade.collide(this.player, this.wallsLayer);
    }