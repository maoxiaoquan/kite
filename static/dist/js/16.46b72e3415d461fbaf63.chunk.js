(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{"2d083e2f99f441c93571":function(e,t,a){},affcd02f3b725ee0daf6:function(e,t,a){"use strict";a.r(t);a("dd1ecc38b32295d28890");var n=a("22b0af3c86168fc91a4c"),r=(a("a52713c529e7e40adb61"),a("4749dc165f579f563092")),c=(a("55aa7ca4a0a8a48c9e61"),a("fbb809245daa6bdefd4c")),o=(a("1512f71111e678bdc301"),a("54d09d2169758098c3cb")),i=(a("7b2cdc79ef95600c96fa"),a("ba2f3da11de1bc903512")),s=(a("0b403e9de8531798815b"),a("f93e88075e502b066463")),l=(a("2f3650d48acaa2aad9af"),a("29279c61aa3570bb3814")),u=(a("111ae47c12716851841c"),a("c206fca74049d124e35c")),f=(a("ec4109717b506939221b"),a("1d945b5a0267d56ef3e4")),_=a("3f489e511c06ad55a145"),d=a.n(_),p=a("7786c0fe89da92a9c05c"),m=(a("2d083e2f99f441c93571"),a("62b876d829a93e0fcd88")),b=a("5d6d9fb93f54f7c9adf8");function g(e){return(g="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(){return(h=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}function y(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{},n=Object.keys(a);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter(function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable}))),n.forEach(function(t){k(e,t,a[t])})}return e}function v(e,t,a,n,r,c,o){try{var i=e[c](o),s=i.value}catch(e){return void a(e)}i.done?t(s):Promise.resolve(s).then(n,r)}function E(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function w(e){return(w=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function O(e,t){return(O=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function S(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function k(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var j=f.a.Option,x=u.a.Item,N=l.a.confirm,P=s.a.TextArea,C=function(e){function t(e){var a,n,r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),n=this,r=w(t).call(this,e),a=!r||"object"!==g(r)&&"function"!==typeof r?S(n):r,k(S(S(a)),"_edit",function(e){a.setState({modal_visible_edit:!0,is_create:!1}),a.props.dispatch({type:"SET_USER_TAG_INFO",data:e}),a.props.form.setFieldsValue({user_tag_name:e.user_tag_name,user_tag_icon:e.user_tag_icon,user_tag_icon_type:a.state.menu_text[e.user_tag_icon_type],user_tag_description:e.user_tag_description})}),k(S(S(a)),"_delete",function(e){a.props.dispatch({type:"SET_USER_TAG_INFO",data:e}),N({title:"\u786e\u8ba4\u8981\u5220\u9664\u6b64\u6807\u7b7e\u5417\uff1f",content:"\u6b64\u64cd\u4f5c\u4e0d\u53ef\u9006\u8f6c",okText:"Yes",okType:"danger",cancelText:"No",onOk:function(){a.fetch_delete_user_tag({user_tag_id:a.props.state_user_tag.current_info.user_tag_id})},onCancel:function(){console.log("Cancel")}})}),k(S(S(a)),"TablePageChange",function(){var e,t=(e=regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return{}.current=t.current,e.next=4,a.setState({pagination:{current:t.current}});case 4:a.fetch_user_tag_list(t);case 5:case"end":return e.stop()}},e,this)}),function(){var t=this,a=arguments;return new Promise(function(n,r){var c=e.apply(t,a);function o(e){v(c,n,r,o,i,"next",e)}function i(e){v(c,n,r,o,i,"throw",e)}o(void 0)})});return function(e){return t.apply(this,arguments)}}()),k(S(S(a)),"showModal",function(){a.props.form.resetFields(),a.setState({modal_visible_edit:!0,is_create:!0})}),k(S(S(a)),"handleSubmit",function(e){e.preventDefault();var t=a.state.is_create;a.props.form.validateFieldsAndScroll(function(e,n){e||(console.log("Received values of form: ",n),t?a.fetch_create_user_tag(n):a.fetch_update_user_tag(n))})}),k(S(S(a)),"handleConfirmBlur",function(e){var t=e.target.value;a.setState({confirmDirty:a.state.confirmDirty||!!t})}),k(S(S(a)),"selectRole",function(e){a.setState({role_id:e})}),k(S(S(a)),"validateToNextPassword",function(e,t,n){var r=a.props.form;t&&a.state.confirmDirty&&r.validateFields(["confirm"],{force:!0}),n()}),k(S(S(a)),"fetch_create_user_tag",function(e){a.props.dispatch(Object(m.a)(e,function(e){b.a.message_success("\u521b\u5efa\u6807\u7b7e\u6210\u529f"),a.fetch_user_tag_list(),a.setState({modal_visible_edit:!1})}))}),k(S(S(a)),"fetch_update_user_tag",function(e){a.props.dispatch(Object(m.e)(y({user_tag_id:a.props.state_user_tag.current_info.user_tag_id},e),function(e){b.a.message_success("\u4fee\u6539\u6807\u7b7e\u6210\u529f"),a.fetch_user_tag_list(),a.setState({modal_visible_edit:!1})}))}),k(S(S(a)),"fetch_delete_user_tag",function(e){a.props.dispatch(Object(m.b)(e,function(e){b.a.message_success("\u5220\u9664\u6807\u7b7e\u6210\u529f"),a.fetch_user_tag_list()}))}),k(S(S(a)),"fetch_user_tag_list",function(){var e=S(S(a));a.setState({loading:!0});var t=a.state.pagination.current;a.props.dispatch(Object(m.d)({params:{page:t}},function(a){var n=y({},e.state.pagination);n.total=a.count,n.current=t,e.setState({loading:!1,pagination:n})}))}),a.state={columns:[{title:"user_tag_id",dataIndex:"user_tag_id",key:"user_tag_id"},{title:"\u6807\u7b7e\u540d",dataIndex:"user_tag_name",key:"user_tag_name",render:function(e,t){return d.a.createElement(i.a,{className:"table-article-tag-list",color:"orange"},t.user_tag_name)}},{title:"\u6807\u7b7e\u56fe\u6807",dataIndex:"user_tag_icon",key:"user_tag_icon"},{title:"\u64cd\u4f5c",key:"action",render:function(e,t){return d.a.createElement("div",{className:"table-right-btn"},d.a.createElement(o.a,{onClick:function(){a._edit(t)},size:"small",type:"primary"},"\u4fee\u6539"),d.a.createElement(o.a,{className:"box-btn-red",onClick:function(){a._delete(t)},size:"small"},"\u5220\u9664"))}}],pagination:{},loading:!1,confirmDirty:!1,modal_visible_edit:!1,modal_visible_authority:!1,is_create:!0,menu_text:["","\u56fe\u7247","\u5b57\u4f53\u56fe\u6807"]},a}var a,_,p;return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&O(e,t)}(t,d.a.Component),a=t,(_=[{key:"componentDidMount",value:function(){this.fetch_user_tag_list()}},{key:"render",value:function(){var e=this,t=this.props.state_user_tag,a=this.state,i=a.loading,_=a.is_create,p=this.props.form.getFieldDecorator,m={labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:19}}};return d.a.createElement("div",{className:"layout-main"},d.a.createElement("div",{className:"layout-main-title"},d.a.createElement(c.a,{type:"user"})," ",d.a.createElement("em",null,"\u6807\u7b7e\u7ba1\u7406")),d.a.createElement("div",{className:"layout-nav-btn"},d.a.createElement(o.a,{className:"article-tag-user-create-btn layout-btn",icon:"plus",type:"primary",onClick:function(){return e.showModal(0)}},"\u521b\u5efa\u7528\u6237\u6807\u7b7e")),d.a.createElement("div",{className:"user-tag"},d.a.createElement(l.a,{footer:null,onCancel:function(){e.setState({modal_visible_edit:!1})},title:"\u586b\u5199\u6807\u7b7e",visible:this.state.modal_visible_edit},d.a.createElement(u.a,{className:"from-view",onSubmit:this.handleSubmit},d.a.createElement(x,h({},m,{label:"\u6807\u7b7e\u540d"}),p("user_tag_name",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u6807\u7b7e\u540d\uff01",whitespace:!0}]})(d.a.createElement(s.a,{placeholder:"\u6807\u7b7e\u540d"}))),d.a.createElement(x,h({},m,{label:"\u6807\u7b7e\u540d\u56fe\u6807"}),p("user_tag_icon",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u6807\u7b7e\u540d\u56fe\u6807\uff01",whitespace:!0}]})(d.a.createElement(s.a,{placeholder:"\u6807\u7b7e\u540d\u56fe\u6807"}))),d.a.createElement(x,h({},m,{hasFeedback:!0,label:"\u6807\u7b7e\u56fe\u6807\u7c7b\u578b"}),p("user_tag_icon_type",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u6807\u7b7e\u56fe\u6807\u7c7b\u578b\uff01"}]})(d.a.createElement(f.a,{placeholder:"\u6807\u7b7e\u56fe\u6807\u7c7b\u578b\uff01"},d.a.createElement(j,{value:"1"},"\u56fe\u7247"),d.a.createElement(j,{value:"2"},"\u5b57\u4f53\u56fe\u6807")))),d.a.createElement(x,h({},m,{hasFeedback:!0,label:"\u6807\u7b7e\u63cf\u8ff0"}),p("user_tag_description",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u6807\u7b7e\u63cf\u8ff0"}]})(d.a.createElement(P,{placeholder:"\u8bf7\u8f93\u5165\u6807\u7b7e\u63cf\u8ff0",type:"text"}))),d.a.createElement(x,h({},m,{label:"\u662f\u5426\u6709\u6548"}),p("enable",{valuePropName:"checked"})(d.a.createElement(r.a,null))),d.a.createElement(x,{wrapperCol:{xs:{span:24,offset:0},sm:{span:16,offset:5}}},d.a.createElement(o.a,{className:"register-btn",htmlType:"submit",type:"primary"},_?"\u521b\u5efa\u6807\u7b7e":"\u66f4\u65b0")))),d.a.createElement("div",{className:"layout-table"},d.a.createElement(n.a,{columns:this.state.columns,dataSource:t.list,loading:i,onChange:this.TablePageChange.bind(this),pagination:this.state.pagination,rowKey:"user_tag_id"}))))}}])&&E(a.prototype,_),p&&E(a,p),t}(),T=u.a.create()(C);t.default=Object(p.connect)(function(e){return{state_user_tag:e.state_user_tag}})(T)}}]);