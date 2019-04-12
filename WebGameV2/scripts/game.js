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
var GameState = function (game) {};
var player;
var lasers;
var firespeed = 100;
var cooldown = 0;
var playerhp = 100;
var playerpower = 1;
var score = 0;
var lives = 3;
var highscore = 0;
//var boots = false;
var currentpower = "none";
//var wideshot = false;
//var powershot = false;
//var homingshot = false;
var monster1Max = 20;
var monster2Max = 20;
var monster3Max = 20;
var Contents = ["Points", "Health", "WideShot", "PowerShot", "HomingShot", "Boots"];
var playerangle = 0;

function preload() {
    this.load.spritesheet('soldier', 'images/idle-rifle-tileset.png', {
        frameWidth: 313,
        frameHeight: 207
    });
//    this.load.spritesheet('laser', 'images/beams.png', {
//        frameWidth: 70,
//        frameHeight: 100
//    });
    this.load.image('laser', 'images/laserball.png');
    this.load.image('powerlaser', 'images/laserpower.png');
    this.load.image('multilaser', 'images/lasermulti.png');
    this.load.image('hominglaser', 'images/laserhome.png');
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
    this.load.audio("music", "audio/01 game-game_0.ogg");
}

function create() {
    var music = this.sound.add("music", 'loop: true');
    music.play();

    var character = new Phaser.Class({
        //Extends: Phaser.GameObjects.Image,
        constructor(type, sprite, width, height, x, y, movespeed, turnspeed) {
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
        onEnterframe: function () {
            this.moveAngle = 0;
            this.speed = 0
            this.angle += this.moveAngle * Math.PI / 180;
            playerStats.x += playerStats.speed * Math.sin(this.angle);
            playerStats.y -= playerStats.speed * Math.cos(this.angle);
        }
    });
    //laser
    var laser = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize: function laser(scene) {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'laser');
            this.speed = Phaser.Math.GetSpeed(800, 1);
            var myangle = -90;
        },
        fire: function (x, y) {
            this.setPosition(x, y);
            this.setRotation(playerangle + 30);
            this.setActive(true);
            this.setVisible(true);
            myangle = playerangle;
        },
        update: function (time, delta) {
            switch (myangle) {
                case 0:
                    this.y -= this.speed * delta;
                    break;
                case -90:
                    this.x += this.speed * delta;
                    break;
                case 90:
                    this.x -= this.speed * delta;
                    break;
                case 180:
                    this.y += this.speed * delta;
                    break;
                default:
                    this.x += this.speed * delta;
                    break;
            }
            //this.x += this.speed * delta;
            if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) > 450) {
                this.setActive(false);
                this.setVisible(false);
            }
        }
    });

var powerlaser = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize: function laser(scene) {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'powerlaser');
            this.speed = Phaser.Math.GetSpeed(1000, 1);
            var myangle = -90;
        },
        fire: function (x, y) {
            this.setPosition(x, y);
            this.setRotation(playerangle + 30);
            this.setActive(true);
            this.setVisible(true);
            myangle = playerangle;
        },
        update: function (time, delta) {
            switch (myangle) {
                case 0:
                    this.y -= this.speed * delta;
                    break;
                case -90:
                    this.x += this.speed * delta;
                    break;
                case 90:
                    this.x -= this.speed * delta;
                    break;
                case 180:
                    this.y += this.speed * delta;
                    break;
                default:
                    this.x += this.speed * delta;
                    break;
            }
            //this.x += this.speed * delta;
            if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) > 450) {
                this.setActive(false);
                this.setVisible(false);
            }
        }
    });
    
    var hominglaser = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize: function laser(scene) {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'hominglaser');
            this.speed = Phaser.Math.GetSpeed(20, 1);
            var myangle = -90;
        },
        fire: function (x, y) {
            this.setPosition(x, y);
            this.setRotation(playerangle + 30);
            this.setActive(true);
            this.setVisible(true);
            myangle = playerangle;
        },
        update: function (time, delta) {
            switch (myangle) {
                case 0:
                    this.y -= this.speed * delta;
                    break;
                case -90:
                    this.x += this.speed * delta;
                    break;
                case 90:
                    this.x -= this.speed * delta;
                    break;
                case 180:
                    this.y += this.speed * delta;
                    break;
                default:
                    this.x += this.speed * delta;
                    break;
            }
            //this.x += this.speed * delta;
            if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) > 450) {
                this.setActive(false);
                this.setVisible(false);
            }
        }
    });
    
    var multilaser = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize: function laser(scene) {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'multilaser');
            this.speed = Phaser.Math.GetSpeed(800, 1);
            var myangle = -90;
        },
        fire: function (x, y) {
            this.setPosition(x, y);
            this.setRotation(playerangle + 30);
            this.setActive(true);
            this.setVisible(true);
            myangle = playerangle;
        },
        update: function (time, delta) {
             var random = Phaser.Math.Between(-2, 2);
            switch (myangle) {
                case 0:
                    this.y -= this.speed * delta * random;
                    break;
                case -90:
                    this.x += this.speed * delta* random;
                    break;
                case 90:
                    this.x -= this.speed * delta* random;
                    break;
                case 180:
                    this.y += this.speed * delta* random;
                    break;
                default:
                    this.x += this.speed * delta* random;
                    break;
            }
            //this.x += this.speed * delta;
            if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) > 450) {
                this.setActive(false);
                this.setVisible(false);
            }
        }
    });
    
    var collectable = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize: function item(scene) {
            Phaser.GameObjects.Image.call(this, scene, 64, 64, 'item');
            var myContents;
        },
        create: function (x, y) {
            this.setPosition(x, y);
            this.setActive(true);
            this.setVisible(true);
        },
        update: function (time, delta) {
            if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) < 20) {
                //ADDD EFFECTS HERE
                var random = Math.floor(Math.random() * 6);
                //let myContents = ChestContents.random;
                let myContents = Contents[random];
                console.log("Collected " + myContents);
                this.setActive(false);
                this.setVisible(false);
                this.Activate(myContents);
            }
        },
        Activate: function (myContents) {
            //var Contents = ["Points","Health","WideShot","PowerShot","HomingShot","Boots"];
            switch (myContents) {
                case "Points":
                    score += 1000;
                    break;
                case "Health":
                    playerhp += 50;
                    break;
                case "WideShot":
                    currentpower = "wideshot"
                    break;
                case "PowerShot":
                    currentpower = "powershot"
                    break;
                case "HomingShot":
                    currentpower = "homingshot"
                    break;
                case "Boots":
                    console.log("AUSTINS BOOTS");
                    currentpower = "none";
                    break;
                default:
                    break;
            }
        }
    });
    //wiggles and bounces
    var monster = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize: function monster(scene) {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'enemy1');
            this.speed = Phaser.Math.GetSpeed(65, 1);
        },
        summon: function (x, y) {
            this.setPosition(x, y);
            this.setActive(true);
            this.setVisible(true);
        },
        update: function (time, delta) {
            this.target = player;
            targetPosX = player.x;
            targetPosY = player.y;
            //console.log('Player spotted at - X: ' + player.x + ' Y: ' + player.y);
            this.x += this.speed * Phaser.Math.Between(-20, 20);
            this.y += this.speed * Phaser.Math.Between(-20, 20);
            if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) < 20) {
                //ADDD EFFECTS HERE
                playerhp--;
                player.x -= (this.x - player.x) * 1.5;
                player.y -= (this.y - player.y) * 1.5;
            }

        }
    });

    //follows and hurts
    var monster2 = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize: function monster(scene) {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'enemy3');
            this.speed = Phaser.Math.GetSpeed(85, 10);
        },
        summon: function (x, y) {
            this.setPosition(x, y);
            this.setActive(true);
            this.setVisible(true);
        },
        update: function (time, delta) {
            this.target = player;
            targetPosX = player.x;
            targetPosY = player.y;
            distanceToPlayerX = targetPosX - this.x;
            distanceToPlayerY = targetPosY - this.y;
            distanceToPlayer = Math.sqrt(distanceToPlayerX * distanceToPlayerX + distanceToPlayerY * distanceToPlayerY);
            console.log('Distance to player: ' + distanceToPlayer);
            if (distanceToPlayer < 30) {
                console.log('player in range');
            }
            this.x += distanceToPlayerX * this.speed;
            this.y += distanceToPlayerY * this.speed;
            if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) < 20) {
                //ADDD EFFECTS HERE
                playerhp -= 2;
                player.x -= (this.x - player.x);
                player.y -= (this.y - player.y);
            }
        }
    });
    //swarms and homes
    //we should spawn these around where their first point is to get a swarming bees type behaviour
    var monster3 = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize: function monster(scene) {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'enemy4');
            //getspeed is distance over time
            this.speed = Phaser.Math.GetSpeed(65, 10);
        },
        summon: function (x, y) {
            this.setPosition(x, y);
            this.setActive(true);
            this.setVisible(true);
            // nextPointX = Phaser.Math.Between(0, 3200);
            // nextPointY = Phaser.Math.Between(0, 3200);
        },
        update: function (time, delta) {
            //this.x += this.speed * Phaser.Math.Between(-20,20);
            //this.y += this.speed * Phaser.Math.Between(-20,20);
            //find player
            targetPosX = player.x;
            targetPosY = player.y;
            distanceToPlayerX = targetPosX - this.x;
            distanceToPlayerY = targetPosY - this.y;
            distanceToPlayer = Math.sqrt(distanceToPlayerX * distanceToPlayerX + distanceToPlayerY * distanceToPlayerY);
            console.log('Distance to player: ' + distanceToPlayer);
            //i like the chaotic swarm of putting it on update, might be more efficient to add wiggle and have the swarm follow a point though....
            nextPointX = Phaser.Math.Between(0, 3200);
            nextPointY = Phaser.Math.Between(0, 3200);
            distanceToPointX = nextPointX - this.x;
            distanceToPointY = nextPointY - this.y;
            distanceToPoint = Math.sqrt(distanceToPointX * distanceToPointX + distanceToPointY * distanceToPointY);
            if (distanceToPoint < 20) {
                nextPointX = Phaser.Math.Between(0, 3200);
                nextPointY = Phaser.Math.Between(0, 3200);
            }
            //console.log(distanceToPointX, distanceToPointY);
            if (distanceToPlayer >= 70) {
                this.x += distanceToPointX * this.speed;
                this.y += distanceToPointY * this.speed;
            } else
            if (distanceToPlayer < 120) {
                console.log('player in range');
                this.x += distanceToPlayerX * this.speed;
                this.y += distanceToPlayerY * this.speed;
            }

            if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) < 20) {
                //ADDD EFFECTS HERE
                playerhp -= 5;
                player.x -= (this.x - player.x);
                player.y -= (this.y - player.y);
            }
        }
    });

    lasers = this.add.group({
        classType: laser,
        maxSize: 10,
        runChildUpdate: true
    });

    
     plasers = this.add.group({
        classType: powerlaser,
        maxSize: 20,
        runChildUpdate: true
    });
     mlasers = this.add.group({
        classType: multilaser,
        maxSize: 20,
        runChildUpdate: true
    });
     hlasers = this.add.group({
        classType: hominglaser,
        maxSize: 5,
        runChildUpdate: true
    });
    
    monsters = this.add.group({
        classType: monster,
        maxSize: 20,
        runChildUpdate: true
    });

    monsters2 = this.add.group({
        classType: monster2,
        maxSize: 20,
        runChildUpdate: true
    });
    monsters3 = this.add.group({
        classType: monster3,
        maxSize: 10,
        runChildUpdate: true
    });
    items = this.add.group({
        classType: collectable,
        maxSize: 20,
        runChildUpdate: true
    });
    speed = Phaser.Math.GetSpeed(300, 1);
    var map = this.make.tilemap({
        key: 'level1'
    })
    var tileset = map.addTilesetImage("thefool2", "tiles");
    var belowLayer = map.createDynamicLayer("ground", tileset, 0, 0);
    var worldLayer = map.createDynamicLayer("walls", tileset, 0, 0);
    worldLayer.setCollisionBetween(4, 15);
    this.physics.world.setBounds(0, 0, 3200, 3200)
    //player
    var player = this.physics.add.sprite(400, 300, 'soldier');
    player.body.allowRotation = false;

    let playerStats = new character('player', 'soldier', 32, 32, 0, 0, 5, 6.5);
    player.setOrigin(0.5, 0.5).setDisplaySize(32, 32).setCollideWorldBounds(true).setDrag(20000, 200000);
    moveKeys = this.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.W,
        'down': Phaser.Input.Keyboard.KeyCodes.S,
        'left': Phaser.Input.Keyboard.KeyCodes.A,
        'right': Phaser.Input.Keyboard.KeyCodes.D,
    });

    for (var i = 0; i < monster1Max; i++) {
        var monster = monsters.get();

        if (monster) {
            if(i < 4){
            var valueX = Phaser.Math.Between(-250, 250);
            var valueY = Phaser.Math.Between(-250, 250);
            monster.summon(player.x + valueX, player.y + valueY);
            }else {
                var valueX = Phaser.Math.Between(0, 3200);
            var valueY = Phaser.Math.Between(0, 3200);
            monster.summon(valueX, valueY);
            }
        }
    }

    for (var j = 0; j < monster2Max; j++) {
                      var monster2 = monsters2.get();
    
            if (monster2)
            {
                  var valueX = Phaser.Math.Between(0, 3200);
            var valueY = Phaser.Math.Between(0, 3200);
            monster2.summon(valueX, valueY);
            }
    }
    
    for (var k = 0; k < monster3Max; k++ ) {
                              var monster3 = monsters3.get();
    
            if (monster3)
            {
                   var valueX = Phaser.Math.Between(0, 3200);
            var valueY = Phaser.Math.Between(0, 3200);
            monster3.summon(valueX, valueY);
            }
    }
    //        this.input.keyboard.on('keydown_Q', function (event) {
    //            //SUMMON A MONSTER. LETS HAVE MULTIPLE OFFSCREEN SPAWN POINTS
    //                  var monster = monsters.get();
    //
    //        if (monster)
    //        {
    //            var valueX = Phaser.Math.Between(-150, 150);
    //            var valueY = Phaser.Math.Between(-150, 150);
    //            monster.summon(player.x + valueX, player.y + valueY);
    //        }
    //        });
    //        this.input.keyboard.on('keydown_E', function (event) {
    //            //SUMMON A MONSTER. LETS HAVE MULTIPLE OFFSCREEN SPAWN POINTS
    //                  var monster2 = monsters2.get();
    //
    //        if (monster2)
    //        {
    //            var valueX = Phaser.Math.Between(-150, 150);
    //            var valueY = Phaser.Math.Between(-150, 150);
    //            monster2.summon(player.x + valueX, player.y + valueY);
    //        }
    //        });
    //        this.input.keyboard.on('keydown_R', function (event) {
    //            //SUMMON A MONSTER. LETS HAVE MULTIPLE OFFSCREEN SPAWN POINTS
//                      var monster3 = monsters3.get();
//    
//            if (monster3)
//            {
//                var valueX = Phaser.Math.Between(-150, 150);
//                var valueY = Phaser.Math.Between(-150, 150);
//                monster3.summon(player.x + valueX, player.y + valueY);
//            }
    //        });
    //key.isDown is much smoother than onKeydown
    this.input.keyboard.on('keydown_SPACE', function (event) {
        if(currentpower== "wideshot"){
            var mlaser = mlasers.get();

            if (mlaser) {
                mlaser.fire(player.x, player.y);
            }
        } else
        if(currentpower== "powershot"){
            var plaser = plasers.get();

            if (plaser) {
                plaser.fire(player.x, player.y);
            }
        } else
            if(currentpower== "homingshot"){
            var hlaser = hlasers.get();

            if (hlaser) {
                hlaser.fire(player.x, player.y);
            }
        } else {
        var laser = lasers.get();

        if (laser) {
            laser.fire(player.x, player.y);
        }
        }
    });
    this.input.keyboard.on('keydown_W', function (event) {
        player.body.setVelocityY(-65);
        player.setAccelerationY(-65);
        playerStats.speed = playerStats.movespeed;
        playerangle = 0;
        // player.rotation = playerangle* (180 / 3.14);
    });
    this.input.keyboard.on('keydown_S', function (event) {
        player.body.setVelocityY(65);
        player.setAccelerationY(65);
        playerStats.speed = -playerStats.movespeed;
        playerangle = 180;
        // player.rotation = playerangle* (180 / 3.14);
    });
    this.input.keyboard.on('keydown_A', function (event) {
        player.body.setVelocityX(-65);
        player.setAccelerationX(-65);
        playerStats.moveAngle = playerStats.turnspeed;
        playerangle = 90;
        // player.rotation = playerangle * (180 / 3.14);
    });
    this.input.keyboard.on('keydown_D', function (event) {
        player.body.setVelocityX(65);
        player.setAccelerationX(65);
        playerStats.moveAngle = -playerStats.turnspeed;
        playerangle = -90;
        //player.rotation = playerangle* (180 / 3.14);
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
    this.physics.add.collider(monsters2, worldLayer);
    this.physics.add.collider(monsters2, monsters2);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);
    //spawn items
    for (var i = 0; i < 20; i++) {
        var item = items.get();
        if (item) {
            var valueX = Phaser.Math.Between(0, 200);
            var valueY = Phaser.Math.Between(0, 200);
            item.create(16 * valueX, 16 * valueY);
            console.log(valueX, valueY);
        }
    }
    player.rotation = playerangle;
}

function update(time, delta) {
if(playerhp <= 0) {
        playerhp == 0;
        console.log("Oh no, you suck!");
    }
    //player.rotation = game.physics.arcade.angleToPointer(player);
    //playerStats.onEnterframe();
    //player.translate(playerStats.x, playerStats.y);
    //player.rotate(playerStats.angle);  

}