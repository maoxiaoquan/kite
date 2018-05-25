import title from './title'
import loading from './loading'
import admin_user from '../../containers/adminUser/reducer/AdminUserReducer'
import admin_role from '../../containers/adminRole/reducer/adminRoleReducers'
import admin_authority from '../../containers/adminAuthority/reducer/AdminAuthorityReducer'
const rootReducer = {
  title,
  loading,
  admin_user,
  admin_role,
  admin_authority
}

export default rootReducer

