import stateTitle from './title'
import stateMange from './mange'
import stateLoading from './loading'
import stateIndex from '../../containers/Index/reducer/IndexReducer'
import stateUser from '../../containers/User/reducer/UserReducer'
import stateUserRole from '../../containers/UserRole/reducer/UserRoleReducer'
import stateUserAuthority from '../../containers/UserAuthority/reducer/UserAuthorityReducer'
import stateUserAvatarReview from '../../containers/AvatarReview/reducer/AvatarReviewReducer'
import stateArticle from '../../containers/Article/reducer/ArticleReducer'
import stateArticleComment from '../../containers/ArticleComment/reducer/CommentReducer'
import stateArticleTag from '../../containers/ArticleTag/reducer/ArticleTagReducer'
import stateArticleBlog from '../../containers/ArticleBlog/reducer'
import stateArticleColumn from '../../containers/ArticleColumn/reducer/ArticleColumnReducer'
import statePicture from '../../containers/Picture/reducer/PictureReducer'
import stateAdminUser from '../../containers/AdminUser/reducer/AdminUserReducer'
import stateSystemConfig from '../../containers/SystemConfig/reducer/SystemConfigReducer'
import stateAdminRole from '../../containers/AdminRole/reducer/AdminRoleReducers'
import stateAdminAuthority from '../../containers/AdminAuthority/reducer/AdminAuthorityReducer'
import stateAdminSystemLog from '../../containers/AdminSystemLog/reducer/AdminSystemLogReducer'
import stateWebsiteConfig from '../../containers/WebsiteConfig/reducer/WebsiteConfigReducer'
import stateDynamicTopic from '../../containers/DynamicTopic/reducer/DynamicTopicReducer'
import stateDynamicComment from '../../containers/DynamicComment/reducer'
import stateDynamic from '../../containers/Dynamic/reducer'

import stateBook from '../../containers/Book/reducer'
import stateBooks from '../../containers/Books/reducer'
import stateBookComment from '../../containers/BookComment/reducer'
import stateBooksComment from '../../containers/BooksComment/reducer'

const rootReducer = {
  stateTitle,
  stateMange,
  stateLoading,
  stateIndex,
  stateUser,
  stateUserRole,
  stateUserAuthority,
  stateUserAvatarReview,
  stateArticle,
  stateArticleComment,
  stateArticleTag,
  stateArticleBlog,
  stateArticleColumn,
  statePicture,
  stateAdminUser,
  stateAdminRole,
  stateAdminAuthority,
  stateAdminSystemLog,
  stateSystemConfig,
  stateWebsiteConfig,
  stateDynamic,
  stateDynamicTopic,
  stateDynamicComment,
  // 2019.10.11
  stateBook,
  stateBooks,
  stateBookComment,
  stateBooksComment
}

export default rootReducer
