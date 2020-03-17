const { resAdminJson } = require('../../utils/resData')
const upload = require('../../utils/upload') // 上传工具类

class Picture {
  /**
   * -----------------------------------权限操作--------------------------------
   * 创建标签
   * @param   {object} ctx 上下文对象
   */
  static async uploadPicture(req: any, res: any, next: any) {
    try {
      if (req.file) {
        let destination = req.file.destination.split('static')[1]
        let filename = req.file.filename
        let origin = req.headers.origin
        resAdminJson(res, {
          state: 'success',
          message: '小书图片上传成功',
          data: {
            filename: `${origin}${destination}/${filename}`
          }
        })
      } else {
        resAdminJson(res, {
          state: 'error',
          message: '小书图片上传成功失败，文件格式有误'
        })
      }
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '上传图片大于1m'
      })
      return false
    }
  }
}

export default Picture
