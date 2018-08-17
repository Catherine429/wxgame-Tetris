import Databus from '../databus.js'
import Block from '../player/block.js'

let databus = new Databus();

let SPEED = 1;

const LEFT_SRC = 'images/left.png';
const RIGHT_SRC = 'images/right.png';
const DOWN_SRC = 'images/down.png';
const TURN_SRC = 'images/turn.png';
const SIDEBAR_SRC = 'images/sidebar.png';
const PAUSE_SRC = 'images/pause.png';
const PLAY_SRC = 'images/play.png';
const BTN_WIDTH = 55;
const BTN_HEIGHT = 50;
const TRUN_BTN = 50;
const SMALL_BTN = 40;

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

let blockImg = new Image();
blockImg.src = 'images/block.png';

//提前设置好第一个方格
let next_random = Math.floor(Math.random() * 4);
let nextBlock = [];
nextBlock.push(JSON.parse(JSON.stringify(databus.blockShape[next_random])));

export default class TableBlock {

  constructor() {

    this.leftImg = new Image();
    this.leftImg.src = LEFT_SRC;

    this.rightImg = new Image();
    this.rightImg.src = RIGHT_SRC;

    this.downImg = new Image();
    this.downImg.src = DOWN_SRC;

    this.turnImg = new Image();
    this.turnImg.src = TURN_SRC;

    this.sideImg = new Image();
    this.sideImg.src = SIDEBAR_SRC;

    this.pauseImg = new Image();
    this.pauseImg.src = PAUSE_SRC;

    this.playImg = new Image();
    this.playImg.src = PLAY_SRC;
  }

  reset() {

    this.hasTouchHandler = true;
    this.tableBlock = databus.tableBlock;
    this.matrixShape = databus.matrixShape;

    //目前已定位置的方块儿的最高点
    this.topest = this.tableBlock.length;
    this.activeBlock = {};

    this.bindTouchHandler = this.touchStartHandler.bind(this);

    this.initEvent();
  }

  /**
   * 移动事件
   */
  touchStartHandler(e) {

    if (this.hasTouchHandler) {
      let x = e.touches[0].clientX;
      let y = e.touches[0].clientY;

      let clickPos = this.isClickOnBtn(x, y);

      //如果左右移动不会产生碰撞
      if (clickPos === 'left') {
        let {flag, next, nextTable} = this.canMove(0, -SPEED);
        !this.reachBorder('left') && flag && this.move(next, nextTable);
      } else if (clickPos === 'right') {
        let { flag, next, nextTable } = this.canMove(0, SPEED);
        !this.reachBorder('right') && flag && this.move(next, nextTable);
      } else if (clickPos === 'down') {
        let { maxX } = this.getXYPos(this.activeBlock);
        console.log(maxX);
        console.log(this.tableBlock.length);
        if(maxX + 2 < this.tableBlock.length-1) {
          SPEED = 2;
        }
        for(let i=1; i<SPEED; i++) {
          let {flag} = this.canMove(i, 0);
          if(flag == false) {
            SPEED = 1;
            break;
          }
        }
      } else if (clickPos === 'turn') {
        this.turn();
      } else if(clickPos === 'pause') {
        databus.pause = !databus.pause;
      }
    }
    
  }



  /**
   * 事件控制。点击界面上的左右按钮控制activeBlock移动
   */
  initEvent() {
    canvas.addEventListener('touchstart', this.bindTouchHandler);
  }

  /**
   * 判断点击是否在按钮区域
   */
  isClickOnBtn(x, y) {
    if (x > screenWidth - 20 - 3 * BTN_HEIGHT && x < screenWidth - 20 - 3 * BTN_HEIGHT + BTN_WIDTH && y > screenHeight - 130 && y < screenHeight - 130 + BTN_HEIGHT) {
      return 'left';
    } else if (x > screenWidth - 20 - BTN_WIDTH && x < screenWidth - 20 && y > screenHeight - 130 && y < screenHeight - 130 + BTN_HEIGHT) {
      return 'right';
    } else if (x > screenWidth - 20 - 2 * BTN_HEIGHT && x < screenWidth - 20 - BTN_HEIGHT && y > screenHeight - 130 + BTN_WIDTH && y < screenHeight - 130 + 2 * BTN_WIDTH) {
      return 'down';
    } else if (x > 20 && x < 20 + TRUN_BTN && y && y > screenHeight - 130 && y < screenHeight - 130 + TRUN_BTN)  {
      return 'turn';
    } else if (x > screenWidth - 20 - BTN_WIDTH - SMALL_BTN && screenWidth - 20 - BTN_WIDTH && y > screenHeight - 125 && y < screenHeight - 125 + SMALL_BTN) {
      return 'pause';
    }
  }

  /**
   * 创建activeBlock ==> 将对应的方格变为1
   */
  generateActiveBlock() {

    let blockShape = databus.blockShape;
    //当前块等于下一个块
    this.activeBlock = nextBlock.pop();
    //重新生成下一个块
    let nextRandom = Math.floor(Math.random() * 4);
    nextBlock.push(JSON.parse(JSON.stringify(blockShape[nextRandom])));
    let pos_random = Math.floor(Math.random() * (this.tableBlock[0].length-3));
    for (let i in this.activeBlock) {
      this.activeBlock[i].y += pos_random;
      let x = this.activeBlock[i].x;
      let y = this.activeBlock[i].y;
      this.tableBlock[x][y] = 1;
    }
    let { flag } = this.canMove(1, 0);
    //如果生成块的时候直接移动不了，那就说明到顶了
    if(!flag) {
      console.log('game over')
      databus.gameover = true;
    } else {
      databus.score += 4;
    }
  }

  /**
   * 对整个背景网格做渲染，为1的渲染，为0的不管
   */
  render(ctx) {

    ctx.drawImage(this.rightImg, screenWidth - 20 - BTN_WIDTH, screenHeight - 130, BTN_WIDTH, BTN_HEIGHT);
    ctx.drawImage(this.leftImg, screenWidth - 20 - 3 * BTN_HEIGHT, screenHeight - 130, BTN_WIDTH, BTN_HEIGHT);
    ctx.drawImage(this.downImg, screenWidth - 20 - 2 * BTN_HEIGHT, screenHeight - 130 + BTN_WIDTH, BTN_HEIGHT, BTN_WIDTH);
    ctx.drawImage(this.turnImg, 20, screenHeight - 130, TRUN_BTN, TRUN_BTN);
    ctx.drawImage(this.sideImg, screenWidth - 90, 10, 90, screenHeight - 200);

    if(databus.pause) {
      ctx.drawImage(this.playImg, screenWidth - 20 - BTN_WIDTH - SMALL_BTN, screenHeight - 125, SMALL_BTN, SMALL_BTN);
    } else if(!databus.pause) {
      ctx.drawImage(this.pauseImg, screenWidth - 20 - BTN_WIDTH - SMALL_BTN, screenHeight - 125, SMALL_BTN, SMALL_BTN);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = "20px Arial";
    ctx.fillText(
      '下一个',
      screenWidth - 75,
      200
    );
    ctx.fillText(
      '得分:',
      screenWidth - 70,
      260
    );
    ctx.fillText(
      '消行:',
      screenWidth - 70,
      340
    );
    ctx.fillStyle = '#1afa29';
    ctx.fillText(
      databus.score,
      screenWidth - 60,
      290
    );
    ctx.fillText(
      databus.clearLine,
      screenWidth - 60,
      370
    );
    let next = nextBlock[0];
    let { w, h } = this.getWidthHeight(next);

    for (let i in next) {
      ctx.drawImage(blockImg, screenWidth - 45 - (w*20)/2 + next[i].y * 20, 150 - (h * 20) + next[i].x * 20, 20, 20);
    }
    for (let i = 0; i < this.tableBlock.length; i++) {
      for (let j = 0; j < this.tableBlock[i].length; j++) {
        if (this.tableBlock[i][j] == 1) {
          ctx.drawImage(blockImg, 0, 0, 200, 200, j * 20, i * 20 - 20, 20, 20);
        }
      }
    }
  }

  /**
   * 每过一帧，自动向下移一格
   * 判断是否可移。如果不可移，则此次activeBlock移动结束，创建新的activeBlock。
   */
  update() {
    this.getClearLine();
    //主要为了防止到底了，而引起的调用this.canMove方法抛异常
    let {flag, next, nextTable} = this.reachBottom() || this.canMove(SPEED, 0);
    if (this.reachBottom() || !flag || this.move(next, nextTable)) {
      if(SPEED == 2) {
        SPEED = 1;
        this.update();
      } else {
        //如果触底了，则产生下一个activeBlock
        this.generateActiveBlock();
      }
    }
    
    SPEED = 1;
  }

  /**
   * 旋转
   */
  turn() {
    //旋转之后是否碰撞标志
    let flag = true;
    let {minX, minY} = this.getXYPos(this.activeBlock);
    let {w, h} = this.getWidthHeight(this.activeBlock);
    let nextTable = this.deepCopy2VisionArr(this.tableBlock);
    let _type = this.createMatrix(this.tableBlock[0].length, this.tableBlock.length);
    for (let i = 0; i < _type.length; i++) {
      for (let j = 0; j < _type[i].length; j++) {
        _type[i][j] = 0;
      }
    }
    let next = { '1': {}, '2': {}, '3': {}, '4': {} };
    let count = 1;

    for (let i = minX; i < minX + h; ++i) {
      for (let j = minY; j < minY + w; ++j) {
        nextTable[i][j] = 0;
        _type[i][j] = 1;
      }
    }

    for (let i = minX; i < minX + h; ++i) {
      for (let j = minY; j < minY + w; ++j) {
        nextTable[minY - j + 1 + minX][i - minX + minY] = this.tableBlock[i][j];
        console.log('nextTable---', nextTable[minY - j + 1 + minX][i - minX + minY]);
        if ((nextTable[minY - j + 1 + minX][i - minX + minY] + this.tableBlock[minY - j + 1 + minX][i - minX + minY] > 1 && _type[minY - j + 1 + minX][i - minX + minY] !== 1)) {
          flag = false;
          break;
        }
        if (nextTable[minY - j + 1 + minX][i - minX + minY] == 1) {
          if(count == 5) {
            flag = false;
            break;
          }
          next[count + ''].x = minY - j + 1 + minX;
          next[count + ''].y = i - minX + minY;
          count++;
        }
      }
      if(!flag) {
        break;
      }
    }

    if(flag) {
      console.log('get in here')
      this.activeBlock = next;
      this.tableBlock = nextTable;
    }
    console.log('next----', nextTable);
  }

  /**
   * 创建一个矩阵
   */
  createMatrix(w, h) {
    let arr = new Array(h);
    for(let i=0; i<arr.length; i++) {
      arr[i] = new Array(w);
    }
    return arr;
  }

  /**
   * 获取当前activeBlock的宽，高
   */
  getWidthHeight(block) {
    let {minX, minY, maxX, maxY} = this.getXYPos(block);
    let h = maxX - minX + 1,
        w = maxY - minY + 1;
    return {w, h};
  }

  /**
   * 对二维数组进行深拷贝
   */
  deepCopy2VisionArr(arr) {
    let copy = arr.slice();
    for(let i=0; i<arr.length; i++) {
      copy[i] = arr[i].slice();
    }
    return copy;
  }

  /**
   * 获取最大或最小的x,y坐标
   */
  getXYPos(block) {
    let xArr = [],
        yArr = [];
    for (let i in block) {
      xArr.push(block[i].x);
      yArr.push(block[i].y);
    }
    let minX = Math.min(...xArr);
    let minY = Math.min(...yArr);
    let maxX = Math.max(...xArr);
    let maxY = Math.max(...yArr);
    return {minX, minY, maxX, maxY};
  }

  /**
   * 判断是否触底
   */
  reachBottom() {

    let xArr = [];
    for (let i in this.activeBlock) {
      xArr.push(this.activeBlock[i].x);
    }
    let maxX = Math.max(...xArr);
    let minX = Math.min(...xArr);

    let flag = maxX * 20 + 20 >= screenHeight - 150 || maxX >= (this.tableBlock.length - 1);
    this.topest = flag ? (this.topest < minX ? this.topest : minX) : this.topest;

    return flag;
  }

  /**
   * 判断是否触碰到了左右边界
   */ 
  reachBorder(direction) {
    let yArr = [];
    for (let i in this.activeBlock) {
      yArr.push(this.activeBlock[i].y);
    }

    let maxY = Math.max(...yArr);
    let minY = Math.min(...yArr);

    return direction === 'left' ? minY <= 0 : (maxY * 20 >= screenWidth-20 || maxY >= this.tableBlock[0].length - 1);

  }

  /**
   * 检测碰撞
   * @params: 竖向速度，横向速度
   */
  canMove(downSpeed, oriSpeed) {
    let flag = true;
    let next = { '1': {}, '2': {}, '3': {}, '4': {} };
    let xArr = [];
    for (let i in this.activeBlock) {
      xArr.push(this.activeBlock[i].x);
    }

//为了实现该二维数组的深拷贝
    let nextTable = this.tableBlock.concat();
    for (let i = 0; i < nextTable.length; i++) {
      nextTable[i] = this.tableBlock[i].concat();
    }

    for(let i in this.activeBlock) {
      next[i].x = this.activeBlock[i].x + downSpeed;
      next[i].y = this.activeBlock[i].y + oriSpeed;

      nextTable[this.activeBlock[i].x][this.activeBlock[i].y] = 0;
    }

    for(let i in next) {
      let x = next[i].x;
      let y = next[i].y;

      nextTable[x][y] += 1;

      if (nextTable[x][y] > 1) {
        flag = false;
        let minX = Math.min(...xArr);
        this.topest = this.topest < minX ? this.topest : minX;
        break;
      }
    }

    return {flag, next, nextTable};

    // if(flag === true) {
    //   this.activeBlock = next;
    //   this.tableBlock = nextTable;
    // }

    // return flag;
  }

  /**
   * 进行移动
   */
  move(next, nextTable) {
    this.activeBlock = next;
    this.tableBlock = nextTable;
  }

  /**
   * 获取所要清掉的行数
   */
  getClearLine() {
    for (let i = 0; i < this.tableBlock.length; i++) {
      let sum = 0;
      for(let j=0; j<this.tableBlock[i].length; j++) {
        sum += this.tableBlock[i][j];
      }

      if(sum === this.tableBlock[i].length) {
        console.log('clear line----', i);
        this.clearLine(i);
      }
    }
  }

  /**
   * 清行
   */
  clearLine(line) {
    console.log(this.tableBlock)
    for(let i=line-1; i>=this.topest; i--) {
      for(let j=0; j<this.tableBlock[i].length; j++) {
        this.tableBlock[i+1][j] = this.tableBlock[i][j];
      }
    }
    databus.score += this.tableBlock[0].length;
    databus.clearLine += 1;
    console.log(this.tableBlock)
  }

  /**
   * @desc 旋转
   */


  // canMove() {

  //   //是否能移动的标志
  //   let flag = true;

  //   console.log(this.tableBlock);

  //   //坑！！！别忘了这个是对象！！这里是把引用赋给tempTableBlock了，他们指向的是同一个对象！！改变了这个就改变了那个！！要深拷贝，不能浅拷贝！！
  //   let tempTableBlock = new Array(this.tableBlock.length);

  //   for (let i = 0; i < tempTableBlock.length; i++) {
  //     tempTableBlock[i] = new Array(this.tableBlock[i].length);
  //   }

  //   for (let i = 0; i < this.tableBlock.length; i++) {
  //     for (let j = 0; j < this.tableBlock[i].length; j++) {
  //       console.log(tempTableBlock[i][j])
  //       tempTableBlock[i][j] = this.tableBlock[i][j];
  //     }
  //   }

  //   let tempActiveBlock = {};

  //   for(let i in this.activeBlock) {
  //     tempActiveBlock[i] = this.activeBlock[i];
  //   }

  //   console.log(tempTableBlock);
  //   console.log(this.tableBlock);

  //   //假设能移动
  //   let temp = { '1': {}, '2': {}, '3': {}, '4': {} };
  //   console.log(this.tableBlock);
  //   for (let i in tempActiveBlock) {
  //     temp[i].x = tempActiveBlock[i].x + 1;
  //     temp[i].y = tempActiveBlock[i].y;

  //     console.log(this.tableBlock);

  //     tempTableBlock[0][1] = 2;
  //     tempTableBlock[temp[i].x - 1][temp[i].y] = 0;

  //     console.log(tempTableBlock);
  //     console.log(this.tableBlock);
  //   }

  //   for (let i in temp) {
  //     let x = temp[i].x;
  //     let y = temp[i].y;

  //     tempTableBlock[x][y] += 1;

  //     console.log(tempTableBlock);
  //     console.log(this.tableBlock);
  //     if (tempTableBlock[x][y] > 1) {
  //       tempTableBlock[x][y]--;
  //       console.log(this.tableBlock)
  //       flag = false;
  //       break;
  //     }
  //   }

  //   if(flag) {
  //     this.tableBlock = tempTableBlock;
  //     this.activeBlock = temp;
  //   } else {
  //     console.log(this.tableBlock)
  //     for (let i in this.activeBlock) {
  //       let x = this.activeBlock[i].x;
  //       let y = this.activeBlock[i].y;

  //       this.tableBlock[x][y] = 1;
  //     }
  //   }


  //   if(!flag) {
  //     console.log(this.activeBlock)
  //     console.log(this.tableBlock)
  //   }

  //   return flag; 
  // }
}