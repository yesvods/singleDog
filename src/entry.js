import SingleDog from './SingleDog';
import Pair from './Pair';
import Pa from './Pa';
import HP from './HP';

let cv = document.querySelector('#cv');

let WIDTH = cv.width = document.documentElement.clientWidth>414?414:document.documentElement.clientWidth; 
let HEIGHT = cv.height = document.documentElement.clientHeight>736?736:document.documentElement.clientHeight;
let ctx = cv.getContext('2d');
let pair1 = new Pair({x: 40, y: 50, v: 50});
class Stage {
  constructor(){
    this.probability = 1;
    this.pairArr = [pair1];
    this.sdArr = [];
    this.paArr = [];
    this.bgImg = new Image();
    this.heartImg = new Image();
    this.startImg = new Image();
    this.bgImg.src = require('./images/bg_mini.jpg');
    this.heartImg.src = require('./images/heart.png');
    this.startImg.src = require('./images/start.png');
  }
  init(content){
    this.HP = new HP();
    this.probability = 1;
    this.pairArr = [pair1];
    this.sdArr = [];
    this.started = false;
    this.content = content;
    
  }
}

//initial stage
let stage = new Stage();
stage.init();

let renderInit = () => {
  //render bg
  ctx.drawImage(stage.bgImg, 0, 0, 640, HEIGHT*2, 0, 0, WIDTH, HEIGHT);
  ctx.drawImage(stage.startImg, (WIDTH-200)/2, HEIGHT-320);

  if(stage.content){
    ctx.fillStyle = '#FF0707';
    ctx.font = "bold 30px Courier New";
    ctx.fillText('坚持暴击'+stage.content+'年', (WIDTH-200)/2, (HEIGHT-400))
    ctx.fillText('不服来战！', (WIDTH-200)/2, (HEIGHT-350));
    let title = '坚持暴击单身狗'+stage.content+'年，不服来战！';
    document.title = title;
  }
}

let renderGame = () => {
  ctx.drawImage(stage.bgImg, 0, 0, 640, HEIGHT*2, 0, 0, WIDTH, HEIGHT);
  ctx.drawImage(stage.HP.img, 20, 20, 20, 20);
  ctx.lineCap = 'round';
  ctx.fillStyle = '#FF0707';
  ctx.fillRect(60, 28, (WIDTH-100)*stage.HP.left/100, 5);

  //render pair
  stage.pairArr.forEach((pair, index)=>{
    pair.draw(ctx);
    pair.y += pair.v/60;
    if(pair.y>HEIGHT) {
      stage.pairArr.splice(index, 1);
      stage.HP.reduce('pair');
    }
  })
  //render singleDog
  stage.sdArr.forEach((sd, index)=>{
    sd.draw(ctx);
    sd.y += sd.v/60;
    if(sd.y>HEIGHT) {
      stage.sdArr.splice(index, 1);
      stage.HP.reduce('sd');
    }
  })
  //generate pairs
  if((Math.random()*100)<stage.probability){
    let x = Math.random()*(WIDTH-100)+30;
    let pair = new Pair({x: x, y: 50, v: (parseInt(Math.random()*100)+50)*stage.probability});
    stage.pairArr.push(pair);
  }
  //if hp == 0 game over
  if(stage.HP.left<=0 && stage.started==true){
    let cost = parseInt(((Date.now()-stage.startTime)/1000))
    stage.init(cost);
  }
}

function runTime(){ 
  if(!stage.started){
    renderInit();
  }else{
    renderGame();
  }
}

let hitDetect = (sx, sy, dx, dy, w, h) => {
  if(sx>dx && sx<dx+w && sy>dy && sy<dy+h) return true;
  return false;
}

//game logic
let startLogic = (x, y) => {
  //hit start btn
  if(hitDetect(x, y, (WIDTH-200)/2, (HEIGHT-320), 200, 100)){
    stage.startTime = Date.now();
    stage.started = true;
  }

}

let gameLogic = (x, y) => {
  //hit pair and sd
  stage.sdArr.forEach((sd, index)=>{
    if(sd.hit(x, y)){
      stage.sdArr.splice(index, 1);
      stage.HP.bonus();
      //add game difficulty
      stage.probability+=0.05;
    }
    
  })  
  stage.pairArr.forEach((pair, index)=>{
    if(pair.hit(x, y)){
      let sd1 = new SingleDog({x: (pair.x-25)<0?0:(pair.x-25), y: pair.y, v: pair.v+parseInt(Math.random(100))});
      let sd2 = new SingleDog({x: (pair.x+25)<0?0:(pair.x+25), y: pair.y, v: pair.v+parseInt(Math.random(100))});
      stage.pairArr.splice(index, 1);
      stage.sdArr.push(sd1);
      stage.sdArr.push(sd2);
    }
  })
}

cv.addEventListener('touchstart', function(e){
  let x = e.targetTouches[0].clientX;
  let y = e.targetTouches[0].clientY;
  if(!stage.started){
    startLogic(x, y);
  }else{
    gameLogic(x, y);
  }
})

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


// usage:
// instead of setInterval(render, 16) ....

(function animloop(){
  requestAnimFrame(animloop);

  runTime();
})();