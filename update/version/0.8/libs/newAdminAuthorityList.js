module.exports = [
  {
    authority_id: 'wpyZ52Ask',
    authority_name: '小书管理',
    authority_type: '1',
    authority_parent_id: '',
    authority_parent_name: '',
    authority_url: 'bookManager',
    authority_sort: 5,
    authority_description: '小书管理',
    enable: true
  },
  {
    authority_id: 'moEnRcr5M',
    authority_name: '小书列表',
    authority_type: '1',
    authority_parent_id: 'wpyZ52Ask',
    authority_parent_name: '小书管理',
    authority_url: 'books',
    authority_sort: 0,
    authority_description: '小书列表',
    enable: true
  },
  {
    authority_id: '_ZSgNTq5d',
    authority_name: '获取小书列表',
    authority_type: '2',
    authority_parent_id: 'moEnRcr5M',
    authority_parent_name: '小书列表',
    authority_url: '/books/list',
    authority_sort: 0,
    authority_description: '获取小书列表',
    enable: false
  },
  {
    authority_id: 'G86RMnRid',
    authority_name: '更新小书',
    authority_type: '2',
    authority_parent_id: 'moEnRcr5M',
    authority_parent_name: '小书列表',
    authority_url: '/books/update',
    authority_sort: 1,
    authority_description: '更新小书',
    enable: false
  },
  {
    authority_id: 'QIMrkPCZO',
    authority_name: '删除小书',
    authority_type: '2',
    authority_parent_id: 'moEnRcr5M',
    authority_parent_name: '小书列表',
    authority_url: '/books/delete',
    authority_sort: 2,
    authority_description: '删除小书',
    enable: false
  },
  {
    authority_id: '8FMSzgXe-',
    authority_name: '小书章节列表',
    authority_type: '1',
    authority_parent_id: 'wpyZ52Ask',
    authority_parent_name: '小书管理',
    authority_url: 'book',
    authority_sort: 1,
    authority_description: '小书章节列表',
    enable: true
  },
  {
    authority_id: 'weDr040gv',
    authority_name: '获取小书章节列表',
    authority_type: '2',
    authority_parent_id: '8FMSzgXe-',
    authority_parent_name: '小书章节列表',
    authority_url: '/book/list',
    authority_sort: 0,
    authority_description: '获取小书章节列表',
    enable: false
  },
  {
    authority_id: 'ZkXVh7yVL',
    authority_name: '更新小书章节',
    authority_type: '2',
    authority_parent_id: '8FMSzgXe-',
    authority_parent_name: '小书章节列表',
    authority_url: '/book/update',
    authority_sort: 1,
    authority_description: '更新小书章节',
    enable: false
  },
  {
    authority_id: 'iQ2icICPg',
    authority_name: '删除小书章节',
    authority_type: '2',
    authority_parent_id: '8FMSzgXe-',
    authority_parent_name: '小书章节列表',
    authority_url: '/book/delete',
    authority_sort: 2,
    authority_description: '删除小书章节',
    enable: false
  },
  {
    authority_id: 'jefJfRgfU',
    authority_name: '小书评价',
    authority_type: '1',
    authority_parent_id: 'wpyZ52Ask',
    authority_parent_name: '小书管理',
    authority_url: 'booksComment',
    authority_sort: 2,
    authority_description: '小书评价',
    enable: true
  },
  {
    authority_id: 'VCTZEXPCI',
    authority_name: '获取小书评价列表',
    authority_type: '2',
    authority_parent_id: 'jefJfRgfU',
    authority_parent_name: '小书评价',
    authority_url: '/books-comment/list',
    authority_sort: 0,
    authority_description: '获取小书评价列表',
    enable: false
  },
  {
    authority_id: 'p6WXhPmqU',
    authority_name: '更新小书评价',
    authority_type: '2',
    authority_parent_id: 'jefJfRgfU',
    authority_parent_name: '小书评价',
    authority_url: '/books-comment/update',
    authority_sort: 1,
    authority_description: '更新小书评价',
    enable: false
  },
  {
    authority_id: 'keJadFOOt',
    authority_name: '删除小书评价',
    authority_type: '2',
    authority_parent_id: 'jefJfRgfU',
    authority_parent_name: '小书评价',
    authority_url: '/books-comment/delete',
    authority_sort: 2,
    authority_description: '删除小书评价',
    enable: false
  },
  {
    authority_id: 'bNZIZU8_k',
    authority_name: '小书章节评价',
    authority_type: '1',
    authority_parent_id: 'wpyZ52Ask',
    authority_parent_name: '小书管理',
    authority_url: 'bookComment',
    authority_sort: 3,
    authority_description: '小书章节评价',
    enable: true
  },
  {
    authority_id: 'j05QIMrKY',
    authority_name: '获取小书章节评论列表',
    authority_type: '2',
    authority_parent_id: 'bNZIZU8_k',
    authority_parent_name: '小书章节评价',
    authority_url: '/book-comment/list',
    authority_sort: 0,
    authority_description: '获取小书章节评论列表',
    enable: false
  },
  {
    authority_id: 'b-Kv51Dit',
    authority_name: '更新小书章节评论',
    authority_type: '2',
    authority_parent_id: 'bNZIZU8_k',
    authority_parent_name: '小书章节评价',
    authority_url: '/book-comment/update',
    authority_sort: 1,
    authority_description: '更新小书章节评论',
    enable: false
  },
  {
    authority_id: '4G1J-sZwB',
    authority_name: '删除小书章节评论',
    authority_type: '2',
    authority_parent_id: 'bNZIZU8_k',
    authority_parent_name: '小书章节评价',
    authority_url: '/book-comment/delete',
    authority_sort: 2,
    authority_description: '删除小书章节评论',
    enable: false
  }
]
