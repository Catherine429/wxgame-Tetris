
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const IMAGE_SRC = 'images/Common.png'

let atlas = new Image();
atlas.src = IMAGE_SRC;

export default class GameInfo {

  //也可以沒有构造函数，用的是默认的构造函数，java学的都忘哪去了！！！

  renderGameScore(ctx, score) {
    ctx.fillStyle = '#ffffff';
    ctx.font = "20px Arial";

    ctx.fillText(score, 10, screenHeight - 30);
  }

  renderGameOver(ctx, score) {

    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300);

    ctx.fillStyle = '#ffffff';
    ctx.font = "20px Arial";

    ctx.fillText(
      '游戏结束',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 50
    );

    ctx.fillText(
      '得分 ' + score,
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 130
    );

    ctx.drawImage(
      atlas,
      20, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 180,
      120, 40);

    ctx.fillText(
      '重新开始',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 205
    )
  }


  /**
   * 这个按钮是一个图片，所以我们要判断是否电点击到这上面就无法根据点击事件来说。
   * 所以我们要给这个图片一个区域坐标，当点击点的坐标在这个区域之内，就可以认为点击上了该图片按钮。
   */

  isInBtnArea(x, y) {
    return (x > screenWidth / 2 - 60 && x < screenWidth / 2 + 60 && y > screenHeight / 2 - 100 + 180 && y < screenHeight / 2 - 100 + 180 + 40);
  }
}