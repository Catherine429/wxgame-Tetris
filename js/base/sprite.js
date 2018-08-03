export default class Sprite {

  constructor(imgSrc, width=0, height=0, x=0, y=0) {
    let img = new Image();
    img.src = imgSrc;
    this.img = img;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

  }

/**
 * 画到上屏
 */
  drawToCanvas(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  
}