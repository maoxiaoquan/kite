(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{"365b1ecbd6128eb6b31d":function(e,t,n){"use strict";n.r(t);n("16f858f3f384ce88563c");var r=n("38b775c111ad54477772"),a=(n("e203e9cdf1d04b987c70"),n("51ee6e570e2670da87a8")),o=(n("5e569c16e4680660800b"),n("1217f17bae420d4493e1")),i=(n("f64a93eb9111f8ff70de"),n("209ab97d27c4dc65994d")),c=(n("396e0dd03397a933ee2d"),n("5ee5360c13f822fd1f96")),l=(n("84fdc10c7305fb37dd40"),n("23324ffdd5712bdb1e5e")),s=(n("ccca5c1b00f8430f3746"),n("bea61fa5539cd12254c4")),u=(n("917ca226ec41e7cd3ca1"),n("efb72053f7d88d47b1da")),_=n("3f489e511c06ad55a145"),f=n.n(_),d=n("7786c0fe89da92a9c05c"),p=n("5d6d9fb93f54f7c9adf8"),m=(n("489c92a1cf4a91fcd1a4"),n("ebc36760de3f885a3395")),h=n("561c3bf1d85c7e61ff95");function y(e){return(y="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function b(){return(b=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function v(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function g(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){T(e,t,n[t])})}return e}function E(e,t,n,r,a,o,i){try{var c=e[o](i),l=c.value}catch(e){return void n(e)}c.done?t(l):Promise.resolve(l).then(r,a)}function O(e){return function(){var t=this,n=arguments;return new Promise(function(r,a){var o=e.apply(t,n);function i(e){E(o,r,a,i,c,"next",e)}function c(e){E(o,r,a,i,c,"throw",e)}i(void 0)})}}function w(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function k(e){return(k=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function S(e,t){return(S=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function C(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function T(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var R=u.a.TreeNode,x=s.a.Item,j=(l.a.Option,c.a.confirm),N=i.a.TextArea,I=function(e){function t(e){var n,r,a;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),r=this,a=k(t).call(this,e),n=!a||"object"!==y(a)&&"function"!==typeof a?C(r):a,T(C(C(n)),"showModal",function(){n.setState({visible_create_role_modal:!0,is_create:!0}),n.init_role_from()}),T(C(C(n)),"init_tree_data",function(e){var t=[];return console.log("val",e),n.props.state_admin_authority.admin_authority_source_list.map(function(n){2===Number(n.authority_type)&&-1!==e.indexOf(n.authority_id)&&t.push(n.authority_id)}),t}),T(C(C(n)),"init_role_from",function(){n.setState({role_name:"",role_description:""})}),T(C(C(n)),"edit_role",function(e){n.setState({visible_create_role_modal:!0,is_create:!1,role_name:e.role_name,role_description:e.role_description})}),T(C(C(n)),"delete_role",function(){var e=n.props.state_admin_role.current_role_info;j({title:"\u786e\u8ba4\u8981\u5220\u9664\u5f53\u524d\u89d2\u8272\u5417?",content:"\u5220\u9664\u5f53\u524d\u89d2\u8272\u4f1a\u5220\u9664\u89d2\u8272\u7528\u6237\u5173\u8054\uff0c\u4ee5\u53ca\u89d2\u8272\u6743\u9650\u5173\u8054",okText:"\u662f",okType:"danger",cancelText:"\u5426",onOk:function(){var t=O(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.props.dispatch(Object(h.b)({role_id:e.role_id},function(e){n.fetch_admin_role_list()}));case 2:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),onCancel:function(){console.log("Cancel")}})}),T(C(C(n)),"handleOk",function(){n.state.is_create?n.fetch_admin_create_role():n.fetch_admin_edit_role()}),T(C(C(n)),"handleCancel",function(e){n.setState({visible_create_role_modal:!1})}),T(C(C(n)),"handleTableChange",function(){var e=O(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return{}.current=t.current,e.next=4,n.setState({pagination:{current:t.current}});case 4:n.fetch_admin_role_list();case 5:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()),T(C(C(n)),"fetch_admin_edit_role",function(){n.props.dispatch(Object(h.c)({role_id:n.props.state_admin_role.current_role_info.role_id,role_name:n.state.role_name,role_description:n.state.role_description},function(){p.a.message_success("\u4fee\u6539\u89d2\u8272\u6210\u529f"),n.fetch_admin_role_list(),n.setState({visible_create_role_modal:!1})}))}),T(C(C(n)),"fetch_admin_create_role",function(){var e={role_name:n.state.role_name,role_description:n.state.role_description};n.props.dispatch(Object(h.a)(e,function(){p.a.message_success("\u89d2\u8272\u521b\u5efa\u6210\u529f"),n.fetch_admin_role_list(),n.setState({visible_create_role_modal:!1})}))}),T(C(C(n)),"fetch_set_admin_role_authority",function(){var e=n.props.state_admin_role,t=e.current_role_info,r=e.role_authority_list_all;console.log("role_authority_list_all",r),n.props.dispatch(Object(h.f)(g({},t,{role_authority_list:r}),function(){p.a.message_success("\u89d2\u8272\u6743\u9650\u8bbe\u7f6e\u6210\u529f"),n.setState({visible_set_authority_modal:!1})}))}),T(C(C(n)),"fetch_admin_role_list",function(){var e=C(C(n));n.setState({loading:!0});var t=n.state.pagination.current;n.props.dispatch(Object(h.e)({params:{page:t}},function(n){var r=g({},e.state.pagination);r.total=n.count,r.current=t,e.setState({loading:!1,pagination:r})}))}),T(C(C(n)),"onCheck",function(e,t){console.log("event",t),n.setState({role_authority_list:e}),n.props.dispatch({type:"SET_ROLE_AUTHORITY_LIST_ALL",data:v(e).concat(v(t.halfCheckedKeys))})}),T(C(C(n)),"renderTreeNodes",function(e){return e.map(function(e){return e.children.length>0?f.a.createElement(R,{dataRef:e,key:e.authority_id,title:e.authority_name,type:e.type},n.renderTreeNodes(e.children)):f.a.createElement(R,{key:e.authority_id,title:e.authority_name})})}),n.state={columns:[{title:"\u89d2\u8272id",dataIndex:"role_id",key:"role_id"},{title:"\u89d2\u8272\u540d\u5b57",dataIndex:"role_name",key:"role_name"},{title:"\u89d2\u8272\u63cf\u8ff0",dataIndex:"role_description",key:"role_description"},{title:"\u64cd\u4f5c",key:"action",render:function(e,t){return f.a.createElement("div",{className:"table-right-btn"},f.a.createElement(o.a,{onClick:O(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n.edit_role(t),e.next=3,n.props.dispatch({type:"SET_CURRENT_ROLE_INFO",data:t});case 3:case"end":return e.stop()}},e,this)})),size:"small",type:"primary"},"\u4fee\u6539"),f.a.createElement(o.a,{className:"box-btn-red",onClick:O(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.props.dispatch({type:"SET_CURRENT_ROLE_INFO",data:t});case 2:n.delete_role();case 3:case"end":return e.stop()}},e,this)})),size:"small"},"\u5220\u9664"),f.a.createElement(o.a,{className:"box-btn-orange",onClick:O(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n.setState({visible_set_authority_modal:!0}),e.next=3,n.props.dispatch(Object(h.d)({params:g({},t)},function(e){console.log("res",e),n.setState({role_authority_list:n.init_tree_data(e)})}));case 3:return e.next=5,n.props.dispatch({type:"SET_CURRENT_ROLE_INFO",data:t});case 5:case"end":return e.stop()}},e,this)})),size:"small"},"\u8bbe\u7f6e\u6743\u9650"))}}],pagination:{},loading:!1,visible_create_role_modal:!1,visible_set_authority_modal:!1,role_name:"",role_description:"",is_create:!0,role_authority_list:[]},n}var n,l,s;return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&S(e,t)}(t,f.a.Component),n=t,(l=[{key:"componentDidMount",value:function(){this.fetch_admin_role_list(),this.props.dispatch(Object(m.c)())}},{key:"render",value:function(){var e=this,t=this.props,n=t.state_admin_role,l=t.state_admin_authority,s=this.state,_=s.loading,d=s.role_name,p=s.role_description,m=s.is_create,h={labelCol:{xs:{span:24},sm:{span:4}},wrapperCol:{xs:{span:24},sm:{span:20}}};return f.a.createElement("div",{className:"layout-main"},f.a.createElement("div",{className:"layout-main-title"},f.a.createElement(a.a,{type:"user"})," ",f.a.createElement("em",null,"\u6743\u9650\u83dc\u5355")),f.a.createElement("div",{className:"layout-nav-btn"},f.a.createElement(o.a,{className:"admin-role-create-btn layout-btn",icon:"plus",onClick:this.showModal,type:"primary"},"\u521b\u5efa\u89d2\u8272")),f.a.createElement("div",{className:"admin-role"},f.a.createElement(c.a,{footer:null,onCancel:this.handleCancel,title:"\u521b\u5efa\u89d2\u8272",visible:this.state.visible_create_role_modal},f.a.createElement(x,b({},h,{label:"\u89d2\u8272\u540d"}),f.a.createElement(i.a,{className:"input-view",onChange:function(t){e.setState({role_name:t.target.value})},placeholder:"\u8bf7\u586b\u5199\u89d2\u8272\u540d",value:d})),f.a.createElement(x,b({},h,{label:"\u89d2\u8272\u63cf\u8ff0"}),f.a.createElement(N,{autosize:{minRows:2,maxRows:6},onChange:function(t){e.setState({role_description:t.target.value})},placeholder:"\u8bf7\u586b\u5199\u89d2\u8272\u63cf\u8ff0",value:p})),f.a.createElement(x,{wrapperCol:{xs:{span:24,offset:0},sm:{span:16,offset:4}}},f.a.createElement(o.a,{className:"register-btn",htmlType:"submit",onClick:this.handleOk,type:"primary"},m?"\u521b\u5efa":"\u66f4\u65b0"))),f.a.createElement(c.a,{footer:null,onCancel:function(){e.setState({visible_set_authority_modal:!1})},title:"\u8bbe\u7f6e\u6743\u9650",visible:this.state.visible_set_authority_modal},f.a.createElement(u.a,{checkable:!0,checkedKeys:this.state.role_authority_list,onCheck:this.onCheck,ref:"tree",showLine:!0},this.renderTreeNodes(l.admin_authority_list)),f.a.createElement("div",{className:"admin-role-foot"},f.a.createElement(o.a,{icon:"save",onClick:function(){e.fetch_set_admin_role_authority()},type:"primary"},"\u786e\u5b9a"),f.a.createElement(o.a,{onClick:function(){e.setState({visible_set_authority_modal:!1})}},"\u53d6\u6d88"))),f.a.createElement("div",{className:"layout-table"},f.a.createElement(r.a,{columns:this.state.columns,dataSource:n.admin_role_list,loading:_,onChange:this.handleTableChange.bind(this),pagination:this.state.pagination,rowKey:"role_id"}))))}}])&&w(n.prototype,l),s&&w(n,s),t}();t.default=Object(d.connect)(function(e){return{state_admin_role:e.state_admin_role,state_admin_authority:e.state_admin_authority}})(I)},"489c92a1cf4a91fcd1a4":function(e,t,n){},"561c3bf1d85c7e61ff95":function(e,t,n){"use strict";n.d(t,"a",function(){return a}),n.d(t,"e",function(){return o}),n.d(t,"c",function(){return i}),n.d(t,"f",function(){return c}),n.d(t,"d",function(){return l}),n.d(t,"b",function(){return s});var r=n("41aca8bac90a667dc80d"),a=function(e,t){return function(n){r.a.post("/api/create_admin_role",e).then(function(e){t&&t(e)})}},o=function(e,t){return function(n){r.a.get("/api/get_admin_role_list",e).then(function(e){return t&&t(e),n({type:"GET_ADMIN_ROLE_LIST",data:e})})}},i=function(e,t){return function(n){r.a.post("/api/edit_admin_role",e).then(function(e){t&&t(e)})}},c=function(e,t){return function(n){r.a.post("/api/set_admin_role_authority",e).then(function(e){t&&t(e)})}},l=function(e,t){return function(n){r.a.get("/api/get_admin_role_authority",e).then(function(e){t&&t(e)})}},s=function(e,t){return function(n){r.a.post("/api/delete_admin_role",e).then(function(e){t&&t(e)})}}},ebc36760de3f885a3395:function(e,t,n){"use strict";n.d(t,"a",function(){return a}),n.d(t,"c",function(){return o}),n.d(t,"b",function(){return i}),n.d(t,"d",function(){return c});var r=n("41aca8bac90a667dc80d"),a=function(e,t){return function(n){r.a.post("/api/create_admin_authority",e).then(function(e){t&&t(e)})}};var o=function(e,t){return function(n){r.a.get("/api/get_admin_authority_list",e).then(function(e){return t&&t(function e(t,n){var r=[];for(var a in t)t[a].authority_parent_id===n&&(t[a].children=e(t,t[a].authority_id),r.push(t[a]));return r}(e,"")),n({type:"GET_ADMIN_AUTHORITY_LIST",data:e})})}},i=function(e,t){return function(n){r.a.post("/api/delete_admin_authority",e).then(function(e){t&&t(e)})}},c=function(e,t){return function(n){r.a.post("/api/update_admin_authority",e).then(function(e){t&&t(e)})}}}}]);