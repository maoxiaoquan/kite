(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{"080bc22e7e2ba253ad14":function(e,a,t){"use strict";t.r(a);t("103fa900714de4115392");var n=t("cb69991747b7dbc21adb"),c=(t("1d2d7046685af24049cb"),t("e4865ae04438775f6643")),r=(t("3a7c4b3e7c19bd75f388"),t("e16c7516edcc8897df91")),l=(t("f136fe54da740b633a56"),t("bea34796456f36c6d794")),o=(t("c6ee39b02ced3133f88d"),t("489f1da782ff0df40bbe")),i=(t("55aa7ca4a0a8a48c9e61"),t("fbb809245daa6bdefd4c")),s=(t("a3dbcdb302ba723667db"),t("1f0d12f4b9c35c2205eb")),m=(t("5153a9a467f55442a9d0"),t("f4942221fc722c1a8f83")),u=t("3f489e511c06ad55a145"),d=t.n(u),f=t("7786c0fe89da92a9c05c"),b=(t("88c5522c4826be14cd14"),t("5c883e50cbf2607bd71b"),t("8acb87cd8a280eb694a6"));function E(e){return(E="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function p(e,a){for(var t=0;t<a.length;t++){var n=a[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function v(e,a){return!a||"object"!==E(a)&&"function"!==typeof a?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):a}function y(e){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function h(e,a){return(h=Object.setPrototypeOf||function(e,a){return e.__proto__=a,e})(e,a)}m.a.SubMenu,s.a.Header,s.a.Content,s.a.Sider;var x=function(e){function a(e){var t;return function(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}(this,a),(t=v(this,y(a).call(this,e))).state={sex_arr:{0:"\u672a\u77e5",1:"\u7537",2:"\u5973"}},t}var t,s,m;return function(e,a){if("function"!==typeof a&&null!==a)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(a&&a.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),a&&h(e,a)}(a,d.a.Component),t=a,(s=[{key:"componentWillMount",value:function(){this.props.dispatch(Object(b.a)())}},{key:"render",value:function(){var e=this.props.state_index,a=e.count,t=void 0===a?{}:a,s=e.new_article,m=void 0===s?[]:s,u=e.new_user,f=void 0===u?[]:u,b=this.state.sex_arr;return d.a.createElement("div",{className:"layout-index layout-main"},d.a.createElement("div",{className:"layout-main-title"},d.a.createElement(i.a,{type:"home"})," ",d.a.createElement("em",null,"\u9996\u9875")),d.a.createElement("div",{className:"layout-count"},d.a.createElement(l.a,{gutter:24},d.a.createElement(o.a,{span:6,className:"count-view"},d.a.createElement("div",{className:"box-card clearfix"},d.a.createElement("i",{className:"iconfont icon-guanliyuan"}),d.a.createElement("div",{className:"content"},d.a.createElement("p",null,"\u7ba1\u7406\u5458"),d.a.createElement("strong",null,t.admin_user_count)))),d.a.createElement(o.a,{span:6,className:"count-view "},d.a.createElement("div",{className:"box-card clearfix"},d.a.createElement("i",{className:"iconfont icon-duouser"}),d.a.createElement("div",{className:"content"},d.a.createElement("p",null,"\u7528\u6237\u6570"),d.a.createElement("strong",null,t.user_count)))),d.a.createElement(o.a,{span:6,className:"count-view "},d.a.createElement("div",{className:"box-card clearfix"},d.a.createElement("i",{className:"iconfont icon-form"}),d.a.createElement("div",{className:"content"},d.a.createElement("p",null,"\u6587\u7ae0\u6570"),d.a.createElement("strong",null,t.article_count)))),d.a.createElement(o.a,{span:6,className:"count-view "},d.a.createElement("div",{className:"box-card clearfix"},d.a.createElement("i",{className:"iconfont icon-comments"}),d.a.createElement("div",{className:"content"},d.a.createElement("p",null,"\u603b\u8bc4\u8bba\u6570"),d.a.createElement("strong",null,t.comment_count)))))),d.a.createElement("div",{className:"layout-detailed"},d.a.createElement(l.a,{gutter:24},d.a.createElement(o.a,{span:10},d.a.createElement("div",{className:"box-card clearfix"},d.a.createElement("div",{className:"box-card-header"},d.a.createElement("h2",null,"\u6700\u65b0\u6587\u7ae0")),d.a.createElement("div",{className:"box-card-body"},d.a.createElement("div",{className:"limit-height"},d.a.createElement(c.a,{itemLayout:"horizontal",dataSource:m,renderItem:function(e){return d.a.createElement(c.a.Item,null,d.a.createElement(c.a.Item.Meta,{avatar:d.a.createElement(r.a,{src:e.user.avatar}),title:d.a.createElement("a",{href:"https://ant.design"},e.title),description:e.excerpt}))}}))))),d.a.createElement(o.a,{span:7},d.a.createElement("div",{className:"box-card clearfix"},d.a.createElement("div",{className:"box-card-header"},d.a.createElement("h2",null,"\u6700\u65b0\u6ce8\u518c\u7528\u6237")),d.a.createElement("div",{className:"box-card-body"},d.a.createElement("div",{className:"limit-height"},d.a.createElement(c.a,{itemLayout:"horizontal",dataSource:f,renderItem:function(e){return d.a.createElement(c.a.Item,null,d.a.createElement(c.a.Item.Meta,{avatar:d.a.createElement(r.a,{src:e.avatar}),title:d.a.createElement("a",{href:"https://ant.design"},e.nickname),description:b[e.sex]}))}}))))),d.a.createElement(o.a,{span:7},d.a.createElement("div",{className:"box-card clearfix"},d.a.createElement("div",{className:"box-card-header"},d.a.createElement("h2",null,"\u7248\u672c\u66f4\u65b0\u5386\u53f2")),d.a.createElement("div",{className:"box-card-body"},d.a.createElement("div",{className:"limit-height"},d.a.createElement(n.a,{mode:"alternate"},d.a.createElement(n.a.Item,null,"Create a services site 2015-09-01"),d.a.createElement(n.a.Item,{color:"green"},"Solve initial network problems 2015-09-01"),d.a.createElement(n.a.Item,{dot:d.a.createElement(i.a,{type:"clock-circle-o",style:{fontSize:"16px"}})},"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."),d.a.createElement(n.a.Item,{color:"red"},"Network problems being solved 2015-09-01"),d.a.createElement(n.a.Item,null,"Create a services site 2015-09-01"),d.a.createElement(n.a.Item,{dot:d.a.createElement(i.a,{type:"clock-circle-o",style:{fontSize:"16px"}})},"Technical testing 2015-09-01")))))))))}}])&&p(t.prototype,s),m&&p(t,m),a}();a.default=Object(f.connect)(function(e){var a=e.state_index;return console.log("state_index",a),{state_index:a}})(x)},"88c5522c4826be14cd14":function(e,a,t){}}]);