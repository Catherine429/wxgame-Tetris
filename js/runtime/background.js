import Sprite from '../base/sprite.js'

const IMG_SRC = 'images/bg.jpg';
const BORDER_SRC = 'images/border.jpg';
const IMG_WIDTH = 800;
const IMG_HEIGHT = 750;

export default class Background extends Sprite{
  
  constructor() {
    super(IMG_SRC, IMG_WIDTH, IMG_HEIGHT, -200, 0);
  }
}