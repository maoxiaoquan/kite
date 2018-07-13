import state_title from './title'
import state_loading from './loading'
import state_user from '../../containers/User/reducer/UserReducer'
import state_user_tag from '../../containers/UserTag/reducer/UserTagReducer'
import state_article from '../../containers/Article/reducer/ArticleReducer'
import state_article_tag from '../../containers/ArticleTag/reducer/ArticleTagReducer'
import state_article_column from '../../containers/ArticleColumn/reducer/ArticleColumnReducer'
import state_picture from '../../containers/Picture/reducer/PictureReducer'
import state_admin_user from '../../containers/adminUser/reducer/AdminUserReducer'
import state_admin_role from '../../containers/adminRole/reducer/adminRoleReducers'
import state_admin_authority from '../../containers/adminAuthority/reducer/AdminAuthorityReducer'

const rootReducer = {
  state_title,
  state_loading,
  state_user,
  state_user_tag,
  state_article,
  state_article_tag,
  state_article_column,
  state_picture,
  state_admin_user,
  state_admin_role,
  state_admin_authority
}

export default rootReducer

