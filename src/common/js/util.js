// 获取随机数
export function getRandom(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

// 数组随机洗牌
export function shuffle(arr) {
  const _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    let index = getRandom(0, i);
    // 交换
    let temp = _arr[i];
    _arr[i] = _arr[index];
    _arr[index] = temp;
  }
  return _arr;
}

// 一层拷贝
export function copy(arr) {
  let newArr = [];
  arr.forEach((item, index) => {
    newArr[index] = Object.assign(Object.create(item.constructor.prototype), item);
  });
  return newArr;
}
