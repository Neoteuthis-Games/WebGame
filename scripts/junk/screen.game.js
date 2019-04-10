class SceneMain extends Phaser.Scene {
    constructor() {
        super({
            key: "game-screen"
        });
    }

    game;["game-screen"] = (function () {
    var firstRun = true,
        paused;

    function startGame() {
        SceneMain.js
        var board = jewel.board,
            display = jewel.display;
        board.initialize(function () {
            display.initialize(function () {
                display.redraw(board.getBoard(), function () {
                    // do nothing for now
                });
            });
        });
    }

    function pauseGame() {
        if (paused) {
            return; // do nothing if already paused
        }
        var dom = jewel.dom,
            overlay = dom.$("#game-screen .pause-overlay")[0];
        overlay.style.display = "block";
        paused = true;
    }

    function exitGame() {
        pauseGame();
        var confirmed = window.confirm("Do you want to return to the main menu?");
        resumeGame();
        if (confirmed) {
            jewel.showScreen("main-menu");
        }
    }

    function resumeGame() {
        var dom = jewel.dom,
            overlay = dom.$("#game-screen .pause-overlay")[0];
        overlay.style.display = "none";
        paused = false;
    }

    function setup() {
        var dom = jewel.dom;
        dom.bind("footer button.exit", "click", exitGame);
        dom.bind("footer button.pause", "click", pauseGame);
        dom.bind(".pause-overlay", "click", resumeGame);
    }

    function run() {
        if (firstRun) {
            setup();
            firstRun = false;
        }
        startGame();
    }
    preload() {
        //  this.load.spritesheet("sprWater", "images/sprWater.png", {
        ///      frameWidth: 16,
        //     frameHeight: 16
        //  });
        this.load.image("sprSand", "images/sprSand.png");
        this.load.image("sprGrass", "images/sprGrass.png");
        this.load.image("soldier", "images/char/char.png");
    }

    create() {
        //this.anims.create({
        // key: "sprWater",
        //frames: this.anims.generateFrameNumbers("sprWater"),
        // frameRate: 5,
        // repeat: -1
        //   });
        var player = this.add.sprite(200, 200, 1, "soldier");
        this.chunkSize = 16;
        this.tileSize = 16;
        this.cameraSpeed = 10;

        this.cameras.main.setZoom(2);

        this.followPoint = new Phaser.Math.Vector2(
            this.cameras.main.worldView.x + (this.cameras.main.worldView.width * 0.5),
            this.cameras.main.worldView.y + (this.cameras.main.worldView.height * 0.5)
        );

        this.chunks = [];

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    getChunk(x, y) {
        var chunk = null;
        for (var i = 0; i < this.chunks.length; i++) {
            if (this.chunks[i].x == x && this.chunks[i].y == y) {
                chunk = this.chunks[i];
            }
        }
        return chunk;
    }

    update() {
        var snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.x / (this.chunkSize * this.tileSize));

        var snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.y / (this.chunkSize * this.tileSize));

        snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;

        snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;
        for (var x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
            for (var y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
                var existingChunk = this.getChunk(x, y);

                if (existingChunk == null) {
                    var newChunk = new Chunk(this, x, y);
                    this.chunks.push(newChunk);
                }
            }
        }
        for (var i = 0; i < this.chunks.length; i++) {
            var chunk = this.chunks[i];

            if (Phaser.Math.Distance.Between(
                snappedChunkX,
                snappedChunkY,
                chunk.x,
                chunk.y
            ) < 3) {
                if (chunk !== null) {
                    chunk.load();
                }
            } else {
                if (chunk !== null) {
                    chunk.unload();
                }
            }
        }

        if (this.keyW.isDown) {
            this.followPoint.y -= this.cameraSpeed;
        }
        if (this.keyS.isDown) {
            this.followPoint.y += this.cameraSpeed;
        }
        if (this.keyA.isDown) {
            this.followPoint.x -= this.cameraSpeed;
        }
        if (this.keyD.isDown) {
            this.followPoint.x += this.cameraSpeed;
        }
        this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
    }
}
  












    