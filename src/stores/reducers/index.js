import title from './title'
import loading from './loading'
import user from '../../containers/User/reducer/UserReducer'
import admin_user from '../../containers/adminUser/reducer/AdminUserReducer'
import admin_role from '../../containers/adminRole/reducer/adminRoleReducers'
import admin_authority from '../../containers/adminAuthority/reducer/AdminAuthorityReducer'
const rootReducer = {
  title,
  loading,
  user,
  admin_user,
  admin_role,
  admin_authority
}

export default rootReducer

