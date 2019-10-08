const config = require('../../../../server/config')
module.exports = [
  {
    authority_description: '小书模块',
    authority_id: 'acGMnWL02',
    authority_name: '小书模块',
    authority_parent_id: '',
    authority_parent_name: '',
    authority_sort: 6,
    authority_type: '1',
    authority_url: '',
    enable: true
  },
  {
    authority_description: '创建小书不需要审核',
    authority_id: config.BOOKS.dfNoReviewBooksId,
    authority_name: '创建小书不需要审核',
    authority_parent_id: 'acGMnWL02',
    authority_parent_name: '小书模块',
    authority_sort: 1,
    authority_type: '2',
    authority_url: '',
    enable: true
  },
  {
    authority_description: '创建小书章节不需要审核',
    authority_id: config.BOOK.dfNoReviewBookId,
    authority_name: '创建小书章节不需要审核',
    authority_parent_id: 'acGMnWL02',
    authority_parent_name: '小书模块',
    authority_sort: 2,
    authority_type: '2',
    authority_url: '',
    enable: true
  },
  {
    authority_description: '创建小书',
    authority_id: 'XooORzyiy',
    authority_name: '创建小书',
    authority_parent_id: 'acGMnWL02',
    authority_parent_name: '小书模块',
    authority_sort: 3,
    authority_type: '2',
    authority_url: '/books/create',
    enable: true
  },
  {
    authority_description: '创建小书章节',
    authority_id: 'dILa2CfIB',
    authority_name: '创建小书章节',
    authority_parent_id: 'acGMnWL02',
    authority_parent_name: '小书模块',
    authority_sort: 4,
    authority_type: '2',
    authority_url: '/book/create',
    enable: true
  },
  {
    authority_description: '创建小书评价不需要审核',
    authority_id: config.BOOKS.dfNoReviewBooksCommentId,
    authority_name: '创建小书评价不需要审核',
    authority_parent_id: 'acGMnWL02',
    authority_parent_name: '小书模块',
    authority_sort: 1,
    authority_type: '2',
    authority_url: '',
    enable: true
  },
  {
    authority_description: '创建小书章节评论不需要审核',
    authority_id: config.BOOK.dfNoReviewBookCommentId,
    authority_name: '创建小书章节评论不需要审核',
    authority_parent_id: 'acGMnWL02',
    authority_parent_name: '小书模块',
    authority_sort: 2,
    authority_type: '2',
    authority_url: '',
    enable: true
  },
  {
    authority_description: '创建小书评论',
    authority_id: 'QvlWruFxl',
    authority_name: '创建小书评论',
    authority_parent_id: 'acGMnWL02',
    authority_parent_name: '小书模块',
    authority_sort: 3,
    authority_type: '2',
    authority_url: '/books-comment/create',
    enable: true
  },
  {
    authority_description: '创建小书章节评论',
    authority_id: 'R6d8x4C_z',
    authority_name: '创建小书章节评论',
    authority_parent_id: 'acGMnWL02',
    authority_parent_name: '小书模块',
    authority_sort: 4,
    authority_type: '2',
    authority_url: '/book-comment/create',
    enable: true
  }
]
