const sequelize = require('./init')

class POOL {
  static async poolInit () {
    sequelize
      .authenticate()
      .then(() => {
        console.log('mysql success')
      })
      .catch(error => {
        console.log('mysql fail' + error)
      })
  }
}
/* 表关联 暂不用 */
/* user.hasMany(comment, {foreignKey: 'uid',as:'user'}) */
/* comment.belongsTo(user, {foreignKey: 'uid',as:'user'})
user_message.belongsTo(user, {foreignKey: 'other_uid',as:'other_user'})
article.belongsTo(user, {foreignKey: 'uid',as:'user'}) */
module.exports = POOL
