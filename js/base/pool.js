const _ = {
  poolDic : 'poolDic'
}

export default class Pool {

  constructor() {

    //该对象池是一个对象，里面有好多好多数组，每个数组存着一类对象集
    this[_.poolDic] = {}
  }

  /**
   * 根据标识名查找相应对象池(数组)
   */
  getItemBySign(name) {
    return this[_.poolDic][name] || (this[_.poolDic][name] = []);
  }

  /**
   * 根据标识名获取相应对象（单个），
   * 如果没有，则创建一个
   */
  getItemByClassName(name, className) {

    let pool = this.getItemBySign(name)
    return pool.length ? pool.shift() : new className();
  }

  /**
   * 回收对象池
   */
  recoverToPool(name, item) {
    this.getItemBySign(name).push(item);
  }
}