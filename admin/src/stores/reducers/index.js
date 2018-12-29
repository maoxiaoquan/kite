import state_title from './title'
import state_loading from './loading'
import state_index from '../../containers/Index/reducer/IndexReducer'
import state_user from '../../containers/User/reducer/UserReducer'
import state_user_tag from '../../containers/UserTag/reducer/UserTagReducer'
import state_article from '../../containers/Article/reducer/ArticleReducer'
import state_comment from '../../containers/Comment/reducer/CommentReducer'
import state_article_tag from '../../containers/ArticleTag/reducer/ArticleTagReducer'
import state_article_column from '../../containers/ArticleColumn/reducer/ArticleColumnReducer'
import state_picture from '../../containers/Picture/reducer/PictureReducer'
import state_banner from '../../containers/Banner/reducer/BannerReducer'
import state_admin_user from '../../containers/adminUser/reducer/AdminUserReducer'
import state_admin_role from '../../containers/adminRole/reducer/adminRoleReducers'
import state_admin_authority from '../../containers/adminAuthority/reducer/AdminAuthorityReducer'
import state_admin_system_log from '../../containers/AdminSystemLog/reducer/AdminSystemLogReducer'

const rootReducer = {
  state_title,
  state_loading,
  state_index,
  state_user,
  state_user_tag,
  state_article,
  state_comment,
  state_article_tag,
  state_article_column,
  state_picture,
  state_banner,
  state_admin_user,
  state_admin_role,
  state_admin_authority,
  state_admin_system_log
}

export default rootReducer

