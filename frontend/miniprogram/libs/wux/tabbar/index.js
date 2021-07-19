"use strict";var _baseComponent=_interopRequireDefault(require("../helpers/baseComponent")),_classNames2=_interopRequireDefault(require("../helpers/classNames")),_styleToCssString=_interopRequireDefault(require("../helpers/styleToCssString")),_checkIPhoneX=require("../helpers/checkIPhoneX");function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _defineProperty(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}(0,_baseComponent.default)({relations:{"../tabbar-item/index":{type:"child",observer:function(){this.debounce(this.updated)}}},properties:{prefixCls:{type:String,value:"wux-tabbar"},defaultCurrent:{type:String,value:""},current:{type:String,value:""},controlled:{type:Boolean,value:!1},theme:{type:String,value:"balanced"},backgroundColor:{type:String,value:"#fff"},position:{type:String,value:""},safeArea:{type:Boolean,value:!1}},data:{tabbarStyle:"",activeKey:"",keys:[]},computed:{classes:["prefixCls, position",function(e,t){return{wrap:(0,_classNames2.default)(e,_defineProperty({},"".concat(e,"--").concat(t),t))}}]},observers:_defineProperty({current:function(e){this.data.controlled&&this.updated(e)}},"backgroundColor, position, safeArea",function(){this.updateStyle.apply(this,arguments)}),methods:{updated:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:this.data.activeKey;this.data.activeKey!==e&&this.setData({activeKey:e}),this.changeCurrent(e)},changeCurrent:function(a){var n=this,r=this.getRelationNodes("../tabbar-item/index");0<r.length&&r.forEach(function(e,t){t=e.data.key||String(t);e.changeCurrent(t===a,t,n.data.theme,r.length)}),this.data.keys.length!==r.length&&this.setData({keys:r.map(function(e){return e.data})})},emitEvent:function(e){this.triggerEvent("change",{key:e,keys:this.data.keys})},setActiveKey:function(e){this.data.controlled||this.updated(e),this.emitEvent(e)},updateStyle:function(e,t,a){e={backgroundColor:e};(0,_checkIPhoneX.checkIPhoneX)()&&a&&["bottom","top"].includes(t)&&(e["bottom"===t?"paddingBottom":"paddingTop"]="".concat(_checkIPhoneX.safeAreaInset[t],"px")),this.setData({tabbarStyle:(0,_styleToCssString.default)(e)})}},ready:function(){var e=this.data,t=e.defaultCurrent,a=e.current,n=e.controlled,r=e.backgroundColor,i=e.position,e=e.safeArea;this.updated(n?a:t),this.updateStyle(r,i,e)}});