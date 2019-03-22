var jewel = (function() { 

var canvas = document.getElementById("mycanvas"),        ctx = canvas.getContext("2d");
 
    canvas.width = canvas.height = 200;
 
    // draw two blue circles
    ctx.fillStyle = "blue";    ctx.beginPath();    ctx.arc(50, 50, 25, 0, Math.PI * 2, true);    ctx.arc(150, 50, 25, 0, Math.PI * 2, true);    ctx.fill();
 
    // draw a red triangle    
	ctx.fillStyle = "red";    ctx.beginPath();    ctx.moveTo(100, 75);    ctx.lineTo(75, 125);    ctx.lineTo(125, 125);    ctx.fill();
 
    // draw a green semi-circle    
	ctx.strokeStyle = "green";    ctx.beginPath();    ctx.scale(1, 0.5);    ctx.arc(100, 300, 75, Math.PI, 0, true);    ctx.closePath();    ctx.stroke(); 
	// save highscore data 
	localStorage.setItem("highscore", "152400");
 
// data can later be retrieved, even on other pages 
var highscore = localStorage.getItem("highscore");
 
//alert(highscore); // alerts the highscore if we need it to do the thing
	


var scriptQueue = [],        
numResourcesLoaded = 0,        
numResources = 0,        
executeRunning = false;

  function executeScriptQueue() {  
 var next = scriptQueue[0],            
first, script;       
 if (next && next.loaded) {            
executeRunning = true;            
// remove the first element in the queue            
scriptQueue.shift();            
first = document.getElementsByTagName("script")[0];            
script = document.createElement("script");            
script.onload = function() {                
if (next.callback) {                    
next.callback();                
}                // try to execute more scripts
        executeScriptQueue();            
};            
script.src = next.src;            
first.parentNode.insertBefore(script, first);        
} else {            
executeRunning = false;        
}    
  
}

function load(src, callback) {     
var image, queueEntry;        
numResources++;
 
// add this resource to the execution queue        
queueEntry = {            
src: src,            
callback: callback,           
 loaded: false       
 };        
scriptQueue.push(queueEntry);
 
image = new Image();        
image.onload = image.onerror = function() {            
numResourcesLoaded++;  
}        
queueEntry.loaded = true;            
if (!executeRunning) {                
executeScriptQueue();            
}       
 };       
 image.src = src;    

function setup() {   }

    return {      
  load: load,       
 setup: setup    
};
 })();