module.exports = function (randomFlag, min, max) {
  let str = '',
    pos = '',
    range = min,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min
  }

  for (let i = 0; i < range; i++) {
    pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }

  return str
}