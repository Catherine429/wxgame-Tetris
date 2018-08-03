import Background from '../js/runtime/background.js'
import Databus from '../js/databus.js'
import BlockController from '../js/player/index.js'
import GameInfo from '../js/runtime/gameinfo.js'

let context = canvas.getContext('2d'),
    databus = new Databus();

export default class Main {
  
  constructor() {

    this.aniId = 0;

    this.reset();
  }

  reset() {

    console.log(databus)
    databus.reset();
    console.log(databus.tableBlock)
    canvas.removeEventListener('touchstart', this.touchHandler.bind(this));

    this.bg = new Background();

    this.blockController = new BlockController();
    this.blockController.reset();
    console.log(this.blockController.tableBlock)
    console.log(this.blockController.activeBlock)
    this.blockController.generateActiveBlock();
    console.log(this.blockController.activeBlock)

    this.gameInfo = new GameInfo();

    this.bindLoop = this.loop.bind(this);

    this.hasTouchHandler = false;

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    window.requestAnimationFrame(this.bindLoop, canvas);
  }

  /**
   * 点击重新开始事件
   */
  touchHandler(e) {

    e.preventDefault();

    if (this.hasTouchHandler) {
      let x = e.touches[0].clientX;
      let y = e.touches[0].clientY;

      if (this.gameInfo.isInBtnArea(x, y)) {
        this.reset();

        console.log('restart');
      }
    }
  }

  render() {
    this.bg.drawToCanvas(context);

    this.gameInfo.renderGameScore(context, databus.score);

    this.blockController.render(context);

    if (databus.gameover) {
      this.gameInfo.renderGameOver(context, databus.score);

      this.blockController.hasTouchHandler = false;

      this.hasTouchHandler = true;
      this.bindTouchHandler = this.touchHandler.bind(this)
      canvas.addEventListener('touchstart', this.bindTouchHandler);
    }
  }

  update() {
    if (databus.gameover) 
      return;
    

    if(databus.frame % 20 === 0)
      this.blockController.update();


  }

/**
 * 帧循环
 */
  loop() {

    databus.frame++;

    this.update();
    this.render();

    this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
  }
}