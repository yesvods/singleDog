export default
class SingleDog {
  constructor({x, y, v}){
    this.x = x;
    this.y = y;
    this.v = v;
    this.img = new Image();
    this.img.src = require('images/doge.png');
    this.width = 50;
    this.height = 53;
  }
  draw(ctx){
    ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, this.x, this.y, this.width, this.height);
  }
  hit(x, y){
    if(x>this.x && x<this.x+this.width && y>this.y && y<this.y+this.height) return true;
    return false;
  }
}