module.exports = [
  {
    authority_description: 'dynamic',
    authority_id: 'xWIFibb79',
    authority_name: '动态管理',
    authority_parent_id: '',
    authority_parent_name: '',
    authority_sort: 4,
    authority_type: '1',
    authority_url: 'dynamic',
    enable: true
  },
  {
    authority_description: '动态话题',
    authority_id: 'iZA1hoZbJ',
    authority_name: '动态话题',
    authority_parent_id: 'xWIFibb79',
    authority_parent_name: '动态管理',
    authority_sort: 0,
    authority_type: '1',
    authority_url: 'dynamicTopic',
    enable: true
  },
  {
    authority_description: '查看所有动态',
    authority_id: 'MopXJpRWJ',
    authority_name: '查看所有动态话题',
    authority_parent_id: 'iZA1hoZbJ',
    authority_parent_name: '动态话题',
    authority_sort: 0,
    authority_type: '2',
    authority_url: '/dynamic-topic/all',
    enable: false
  },
  {
    authority_description: '获取动态话题列表',
    authority_id: 'yzTgrYRj1',
    authority_name: '获取动态话题列表',
    authority_parent_id: 'iZA1hoZbJ',
    authority_parent_name: '动态话题',
    authority_sort: 1,
    authority_type: '2',
    authority_url: '/dynamic-topic/list',
    enable: false
  },
  {
    authority_description: '创建动态话题',
    authority_id: 'rti2yTBeF',
    authority_name: '创建动态话题',
    authority_parent_id: 'iZA1hoZbJ',
    authority_parent_name: '动态话题',
    authority_sort: 2,
    authority_type: '2',
    authority_url: '/dynamic-topic/create',
    enable: false
  },
  {
    authority_description: '更新动态话题',
    authority_id: 'TCYdHQC8-',
    authority_name: '更新动态话题',
    authority_parent_id: 'iZA1hoZbJ',
    authority_parent_name: '动态话题',
    authority_sort: 3,
    authority_type: '2',
    authority_url: '/dynamic-topic/update',
    enable: false
  },
  {
    authority_description: '删除动态话题',
    authority_id: 'UKpCTczAb',
    authority_name: '删除动态话题',
    authority_parent_id: 'iZA1hoZbJ',
    authority_parent_name: '动态话题',
    authority_sort: 4,
    authority_type: '2',
    authority_url: '/dynamic-topic/delete',
    enable: false
  }
]
