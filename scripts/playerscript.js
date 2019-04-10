var playerscript = (function() {
    'use strict';
    
var Player;// = this.add.sprite(200, 200, "soldier");

function onLoad() {
    Player = new component(30, 30, "#00CC00", 225, 225,"images/char/char.png");
    //_root.load.image("soldier", "images/char/char.png");
    _root.start();
}
//its the root, not actually a var!!
var _root = {
    canvas : document.createElement("canvas"),
    start : function() {
        //var playerSprite = this.add.sprite(200, 200, 1, "soldier");
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(onEnterframe, 20);
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            _root.keys = (_root.keys || []);
            _root.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            _root.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {

    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;    
   //this.img = getElementById("soldier");
    this.update = function() {
        ctx = _root.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = color;//("images/char/char.png");
       // ctx.createPattern(type,"no repeat");
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();    
    }
    this.newPos = function() {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }
}

function onEnterframe() {
    _root.clear();
    Player.moveAngle = 0;
    Player.speed = 0;
    //set to arrow keys for now, but can be adapted to wasd by changing the key number.
    if (_root.keys && _root.keys[37]) {Player.moveAngle = -1.2; }
    if (_root.keys && _root.keys[39]) {Player.moveAngle = 1.2; }
    if (_root.keys && _root.keys[38]) {Player.speed= 1.5; }
    if (_root.keys && _root.keys[40]) {Player.speed= -1.5; }
    Player.newPos();
    Player.update();
}
    })();