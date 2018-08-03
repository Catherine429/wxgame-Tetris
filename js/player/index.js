import Databus from '../databus.js'
import Block from '../player/block.js'

let databus = new Databus();

const SPEED = 1;

const LEFT_SRC = 'images/left.png';
const RIGHT_SRC = 'images/right.png'
const BTN_WIDTH = 60;
const BTN_HEIGHT = 60;


const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

export default class TableBlock {

  constructor() {

    this.leftImg = new Image();
    this.leftImg.src = LEFT_SRC;

    this.rightImg = new Image();
    this.rightImg.src = RIGHT_SRC;
    
  }

  reset() {

    this.hasTouchHandler = true;
    this.tableBlock = databus.tableBlock;
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
      }
    }
    
  }



  /**
   * 事件控制。键盘控制activeBlock移动
   */
  initEvent() {
    canvas.addEventListener('touchstart', this.bindTouchHandler);
  }

  /**
   * 判断点击是否在按钮区域
   */
  isClickOnBtn(x, y) {
    if (x > screenWidth / 2 - BTN_WIDTH - 20 && x < screenWidth / 2 - 20 && y > screenHeight - 130 && y < screenHeight - 130 + BTN_HEIGHT) {
      return 'left'
    } else if (x > screenWidth / 2 + 20 && x < screenWidth / 2 + 20 + BTN_WIDTH && y > screenHeight - 130 && y < screenHeight - 130 + BTN_HEIGHT) {
      return 'right'
    }
  }

  /**
   * 创建activeBlock ==> 将对应的方格变为1
   */
  generateActiveBlock() {

      let blockShape = databus.blockShape;
      let random = Math.floor(Math.random() * 4);

      this.activeBlock = blockShape[random];

      for (let i in this.activeBlock) {
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

    ctx.drawImage(this.leftImg, screenWidth / 2 - BTN_WIDTH - 20, screenHeight - 130, BTN_WIDTH, BTN_HEIGHT);
    ctx.drawImage(this.rightImg, screenWidth / 2 + 20, screenHeight - 130, BTN_WIDTH, BTN_HEIGHT);

    for (let i = 0; i < this.tableBlock.length; i++) {
      for (let j = 0; j < this.tableBlock[i].length; j++) {

        if (this.tableBlock[i][j] == 1) {
      
          databus.pool.getItemByClassName('block', Block).drawToCanvas(ctx, i, j);
        }
      }
     }
  }

  /**
   * 每过一帧，自动向下移一格
   */
  update() {

    //判断是否可移。如果不可移，则此次activeBlock移动结束，创建新的activeBlock。
    this.getClearLine();

    //如果没有触底
    if (this.reachBottom() || !this.move(SPEED, 0)) {

      //如果触底了，则产生下一个activeBlock
      this.generateActiveBlock();
    }
    
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

    return maxX*20+20 >= screenHeight-150 || maxX >= (this.tableBlock.length-1);
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

    return direction === 'left' ? minY <= 0 : (maxY * 20 >= screenWidth-40 || maxY >= this.tableBlock[0].length - 1);

  }

  /**
   * 检测碰撞
   * @params: 竖向速度，横向速度
   */
  move(downSpeed, oriSpeed) {
    let flag = true;
    let next = { '1': {}, '2': {}, '3': {}, '4': {} };

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
        this.clearLine(i);
      }
    }
  }

  /**
   * 清行
   */
  clearLine(line) {
    console.log(this.tableBlock)
    for(let i=line-1; i>=0; i--) {
      for(let j=0; j<this.tableBlock[i].length; j++) {
        this.tableBlock[i+1][j] = this.tableBlock[i][j];
      }
    }
    console.log(this.tableBlock)
  }

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