import state_title from './title'
import state_mange from './mange'
import state_loading from './loading'
import state_index from '../../containers/Index/reducer/IndexReducer'
import state_user from '../../containers/User/reducer/UserReducer'
import state_user_role from '../../containers/UserRole/reducer/UserRoleReducer'
import state_user_authority from '../../containers/UserAuthority/reducer/UserAuthorityReducer'
import state_user_avatar_review from '../../containers/AvatarReview/reducer/AvatarReviewReducer'
import state_article from '../../containers/Article/reducer/ArticleReducer'
import state_comment from '../../containers/Comment/reducer/CommentReducer'
import state_article_tag from '../../containers/ArticleTag/reducer/ArticleTagReducer'
import state_article_column from '../../containers/ArticleColumn/reducer/ArticleColumnReducer'
import state_picture from '../../containers/Picture/reducer/PictureReducer'
import state_admin_user from '../../containers/AdminUser/reducer/AdminUserReducer'
import state_system_config from '../../containers/SystemConfig/reducer/SystemConfigReducer'
import state_admin_role from '../../containers/AdminRole/reducer/AdminRoleReducers'
import state_admin_authority from '../../containers/AdminAuthority/reducer/AdminAuthorityReducer'
import state_admin_system_log from '../../containers/AdminSystemLog/reducer/AdminSystemLogReducer'
import state_website_config from '../../containers/WebsiteConfig/reducer/WebsiteConfigReducer'

const rootReducer = {
  state_title,
  state_mange,
  state_loading,
  state_index,
  state_user,
  state_user_role,
  state_user_authority,
  state_user_avatar_review,
  state_article,
  state_comment,
  state_article_tag,
  state_article_column,
  state_picture,
  state_admin_user,
  state_admin_role,
  state_admin_authority,
  state_admin_system_log,
  state_system_config,
  state_website_config
}

export default rootReducer
