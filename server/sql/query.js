const {sequelize} = require('../models')

module.exports = {

  query_user_verify_code (email) {
    return sequelize.query('SELECT * FROM user_verify_codes where email="' + email + '" group by id desc LIMIT 1', {
      type: sequelize.QueryTypes.SELECT
    })
  }

}