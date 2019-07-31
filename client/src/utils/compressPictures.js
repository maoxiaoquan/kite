// 获取图片
// 压缩图片
function compress (img) {
  //    用于压缩图片的canvas
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  //    瓦片canvas
  var tCanvas = document.createElement('canvas')
  var tctx = tCanvas.getContext('2d')
  var maxsize = 100 * 1024
  var initSize = img.src.length
  var width = img.width
  var height = img.height
  // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
  var ratio
  if ((ratio = (width * height) / 4000000) > 1) {
    ratio = Math.sqrt(ratio)
    width /= ratio
    height /= ratio
  } else {
    ratio = 1
  }
  canvas.width = width
  canvas.height = height
  //        铺底色
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // 如果图片像素大于100万则使用瓦片绘制
  var count
  if ((count = (width * height) / 1000000) > 1) {
    count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
    //            计算每块瓦片的宽和高
    var nw = ~~(width / count)
    var nh = ~~(height / count)
    tCanvas.width = nw
    tCanvas.height = nh
    for (var i = 0; i < count; i++) {
      for (var j = 0; j < count; j++) {
        tctx.drawImage(
          img,
          i * nw * ratio,
          j * nh * ratio,
          nw * ratio,
          nh * ratio,
          0,
          0,
          nw,
          nh
        )
        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
      }
    }
  } else {
    ctx.drawImage(img, 0, 0, width, height)
  }
  // 进行最小压缩
  var ndata = canvas.toDataURL('image/jpeg', 0.8)
  console.log('压缩前：' + initSize)
  console.log('压缩后：' + ndata.length)
  console.log(
    '压缩率：' + ~~((100 * (initSize - ndata.length)) / initSize) + '%'
  )
  tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
  return ndata
}
// base64转成bolb对象
function dataURItoBlob (base64Data) {
  var byteString
  if (base64Data.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(base64Data.split(',')[1])
  } else byteString = unescape(base64Data.split(',')[1])
  var mimeString = base64Data
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]
  var ia = new Uint8Array(byteString.length)
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ia], { type: mimeString })
}

function imgPreview (file, callback) {
  let self = this
  // 判断支不支持FileReader
  if (!file || !window.FileReader) return
  if (/^image/.test(file.type)) {
    // 创建一个reader
    let reader = new FileReader()

    // 将图片转成base64格式
    reader.readAsDataURL(file)
    // 读取成功后的回调
    reader.onloadend = function () {
      let result = this.result
      let img = new Image()
      img.src = result
      console.log('********未压缩前的图片大小********')
      console.log(result.length)
      img.onload = function () {
        compress(img)

        let blob = dataURItoBlob(data)
        // let blob = data;
        console.log('*******base64转blob对象******')
        console.log(blob)
        var formData = new FormData()
        formData.append('file', blob)
        console.log('********将blob对象转成formData对象********')
        console.log(formData.get('file'))
        let config = {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
        // 发送请求;
        return formData
      }
    }
  }
}

export default imgPreview
