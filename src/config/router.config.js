export default [
  // user
  {
    path: '/sign_in',
    component: () => import('../containers/Sign/view/SignIn')
  },
  /* {
     path: '/',
     component: '../layouts/BasicLayout',
     Routes: ['src/pages/Authorized'],
     authority: ['admin', 'user'],
     routes: [
       // dashboard
       {path: '/', redirect: '/dashboard/analysis'},
       {
         path: '/dashboard/analysis',
         name: 'analysis',
         component: './Dashboard/Analysis',
       },
       {
         path: '/dashboard/monitor',
         name: 'monitor',
         component: './Dashboard/Monitor',
       },
       {
         path: '/dashboard/workplace',
         name: 'workplace',
         component: './Dashboard/Workplace',
       }
     ]
   }*/
]
