import Databus from '../databus.js'
import Sprite from '../base/sprite.js'

const BLOCK_IMG = 'images/block.jpg';
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

let databus = new Databus();
let blockNum = Math.floor(screenWidth / 20);

export default class Block{
  constructor() {
    this.img = new Image();
    this.img.src = BLOCK_IMG;

    databus.blocks.push(this);
  }

  drawToCanvas(ctx, x, y) {
    ctx.drawImage(this.img, 0, 0, 260, 260, y*20, x*20-20, 20, 20);
  }
}