
/**
 * @desc 
 */
const COLUMN = 25,
      ROW = 17;


export default class Blocks {
  constructor() {
    this.init();
  }

  init() {
  
    //创建整个15*13的数组
    let arr_column = new Array(COLUMN);
      for(let i=0; i<arr_column.length; i++) {
        arr_column[i] = new Array(ROW);
      }

      this.tableBlock = arr_column;


  }

  /**
   * 
   */

/**
 * 比如说点击重新开始，我们就要清空整个数组，变为全0
 */
  reset() {

    //暂时先出这四种形状
    this.blockShape = [
      {
        '1': { x: 0, y: 0 },
        '2': { x: 0, y: 1 },
        '3': { x: 0, y: 2 },
        '4': { x: 1, y: 1 }
      },
      {
        '1': { x: 2, y: 0 },
        '2': { x: 1, y: 0 },
        '3': { x: 1, y: 1 },
        '4': { x: 0, y: 1 }
      },
      {
        '1': { x: 1, y: 0 },
        '2': { x: 0, y: 0 },
        '3': { x: 0, y: 1 },
        '4': { x: 0, y: 2 }
      },
      {
        '1': { x: 3, y: 0 },
        '2': { x: 2, y: 0 },
        '3': { x: 1, y: 0 },
        '4': { x: 0, y: 0 },
      },
    ]

    for (let i = 0; i < this.tableBlock.length; i++) {
      for (let k = 0; k < this.tableBlock[i].length; k++) {
        this.tableBlock[i][k] = 0;
      }
    }

  }
}