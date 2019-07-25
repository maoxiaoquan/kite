const { sequelize } = require('../../db/mysqldb')

module.exports = {
  queryUserVerifyCode (email) {
    return sequelize.query(
      'SELECT * FROM verify_code where email="' +
        email +
        '" group by id desc LIMIT 1',
      {
        type: sequelize.QueryTypes.SELECT
      }
    )
  }
}
