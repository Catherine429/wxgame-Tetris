import Databus from '../databus.js'
import Block from '../player/block.js'

let databus = new Databus();

const SPEED = 1;

const LEFT_SRC = 'images/left.png';
const RIGHT_SRC = 'images/right.png';
const CLOCKWISE_SRC = 'images/clockwise.png';
const ANTICLOCK_SRC = 'images/anticlockwise.png';
const BTN_WIDTH = 60;
const BTN_HEIGHT = 60;


const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

let blockImg = new Image();
blockImg.src = 'images/block.jpg';

export default class TableBlock {

  constructor() {

    this.leftImg = new Image();
    this.leftImg.src = LEFT_SRC;

    this.rightImg = new Image();
    this.rightImg.src = RIGHT_SRC;

    this.clockwiseImg = new Image();
    this.clockwiseImg.src = CLOCKWISE_SRC;

    this.anticlockImg = new Image();
    this.anticlockImg.src = ANTICLOCK_SRC;
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
        !this.reachBorder('left') && this.move(0, -SPEED);

      } else if (clickPos === 'right') {
        !this.reachBorder('right') && this.move(0, SPEED);
      } else if (clickPos === 'turnRight') {
        this.turn();
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
    if (x > screenWidth / 2 - BTN_WIDTH - 20 && x < screenWidth / 2 - 20 && y > screenHeight - 130 && y < screenHeight - 130 + BTN_HEIGHT) {
      return 'left';
    } else if (x > screenWidth / 2 + 20 && x < screenWidth / 2 + 20 + BTN_WIDTH && y > screenHeight - 130 && y < screenHeight - 130 + BTN_HEIGHT) {
      return 'right';
    } else if (x > 20 && x < 20 + BTN_WIDTH && y && y > screenHeight - 130 && y < screenHeight - 130 + BTN_HEIGHT)  {
      return 'turnRight';
    } else if (x > screenWidth - 20 - BTN_WIDTH && x < screenWidth - 20 && y > screenHeight - 130 && y < screenHeight - 130 + BTN_HEIGHT) {
      return 'turnLeft';
    }
  }

  /**
   * 创建activeBlock ==> 将对应的方格变为1
   */
  generateActiveBlock() {

      let blockShape = databus.blockShape;
      let random = Math.floor(Math.random() * 4);
      this.nowType = random+1;
      let pos_random = Math.floor(Math.random() * (this.tableBlock[0].length-3));
      //深拷贝
      this.activeBlock = JSON.parse(JSON.stringify(blockShape[random]));
      //this.activeMatrix = this.deepCopy2VisionArr(this.matrixShape[this.nowType]);
      for (let i in this.activeBlock) {
        this.activeBlock[i].y += pos_random;
        let x = this.activeBlock[i].x;
        let y = this.activeBlock[i].y;
        this.tableBlock[x][y] = 1;
    }
      if(!this.move(1, 0)) {
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

    ctx.drawImage(this.leftImg, screenWidth / 2 - BTN_WIDTH - 50, screenHeight - 130, BTN_WIDTH, BTN_HEIGHT);
    ctx.drawImage(this.rightImg, screenWidth / 2 + 50, screenHeight - 130, BTN_WIDTH, BTN_HEIGHT);
    ctx.drawImage(this.anticlockImg, 20, screenHeight - 130, BTN_WIDTH, BTN_HEIGHT);
    ctx.drawImage(this.clockwiseImg, screenWidth - 20 - BTN_WIDTH, screenHeight - 130, BTN_WIDTH, BTN_HEIGHT);
    for (let i = 0; i < this.tableBlock.length; i++) {
      for (let j = 0; j < this.tableBlock[i].length; j++) {

        if (this.tableBlock[i][j] == 1) {
          ctx.drawImage(blockImg, 0, 0, 260, 260, j * 20, i * 20 - 20, 20, 20);
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

    if (this.reachBottom() || !this.move(SPEED, 0)) {
      //如果触底了，则产生下一个activeBlock
      this.generateActiveBlock();
    }
    
  }

  /**
   * 旋转
   */
  turn() {
    //旋转之后是否碰撞标志
    let flag = true;
    let {minX, minY} = this.getXYPos();
    let {w, h} = this.getWidthHeight();
    let nextTable = this.deepCopy2VisionArr(this.tableBlock);
    let next = { '1': {}, '2': {}, '3': {}, '4': {} };
    let count = 1;

    for (let i = minX; i < minX + h; ++i) {
      for (let j = minY; j < minY + w; ++j) {
        nextTable[i][j] = 0;
      }
    }

    for (let i = minX; i < minX + h; ++i) {
      for (let j = minY; j < minY + w; ++j) {
        nextTable[minY - j + 1 + minX][i - minX + minY] = this.tableBlock[i][j];
        console.log('nextTable---', nextTable[minY - j + 1 + minX][i - minX + minY]);
        if ((nextTable[minY - j + 1 + minX][i - minX + minY] + this.tableBlock[minY - j + 1 + minX][i - minX + minY]) > 1 && !(minY - j + 1 + minX >= minX && minY - j + 1 + minX < minX + h) &&
          !(i - minX + minY >= minY && i - minX + minY < minY + w)) {
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
  getWidthHeight() {
    let {minX, minY, maxX, maxY} = this.getXYPos();
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
  getXYPos() {
    let xArr = [],
        yArr = [];
    for (let i in this.activeBlock) {
      xArr.push(this.activeBlock[i].x);
      yArr.push(this.activeBlock[i].y);
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
  move(downSpeed, oriSpeed) {
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

    if(flag === true) {
      this.activeBlock = next;
      this.tableBlock = nextTable;
    }

    return flag;
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