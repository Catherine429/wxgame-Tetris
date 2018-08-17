import Pool from './base/pool.js'
import Blocks from './runtime/blocks.js'

let instance;

export default class Databus {

  constructor() {
    if(instance) {
      return instance;
    }

    instance = this;

    this.pool = new Pool();

    this.reset();
  }

  reset() {
    this.blocks = new Blocks();
    this.blocks.reset();
    this.tableBlock = this.blocks.tableBlock;
    this.blockShape = this.blocks.blockShape;
    this.matrixShape = this.blocks.matrixShape;
    this.score = 0;
    this.clearLine = 0;
    this.blocks = [];
    this.frame = 0;
    this.gameover = false;
    this.pause = false;
  }

}