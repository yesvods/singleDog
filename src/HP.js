export default
class HP {
  constructor(){
    this.left = 80;
    this.img = new Image();
    this.img.src = require('./images/heart.png');
  }
  reduce(hurter){
    let harm;
    switch(hurter){
      case 'sd': harm = 5;
        break;
      case 'pair': harm = 20;
        break;
      default:
        harm = 5;
    }
    
    let left = this.left - harm;
    this.left = left < 0 ? 0 : left;
  }
  bonus(){
    let left = this.left + 4;
    this.left = left > 100? 100: left;
  }
}