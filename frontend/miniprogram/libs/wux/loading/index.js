"use strict";var _baseComponent=_interopRequireDefault(require("../helpers/baseComponent")),_classNames3=_interopRequireDefault(require("../helpers/classNames")),_index=require("../index");function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function ownKeys(t,e){var r,n=Object.keys(t);return Object.getOwnPropertySymbols&&(r=Object.getOwnPropertySymbols(t),e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)),n}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach(function(e){_defineProperty(t,e,r[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))})}return t}function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var defaults={prefixCls:"wux-loading",classNames:"wux-animate--fadeIn",text:"数据加载中",mask:!0,transparent:!0};(0,_baseComponent.default)({useFunc:!0,data:defaults,computed:{classes:["prefixCls",function(e){return{wrap:(0,_classNames3.default)(e),content:(0,_classNames3.default)("".concat(e,"__content"),_defineProperty({},"".concat(e,"__content--has-icon"),!0)),icon:(0,_classNames3.default)("".concat(e,"__icon"),_defineProperty({},"".concat(e,"__icon--loading"),!0)),text:"".concat(e,"__text")}}]},methods:{hide:function(){this.$$setData({in:!1}),this.$wuxBackdrop&&this.$wuxBackdrop.release()},show:function(){var e=this.$$mergeOptionsAndBindMethods(Object.assign({},defaults,0<arguments.length&&void 0!==arguments[0]?arguments[0]:{}));this.$$setData(_objectSpread({in:!0},e)),this.$wuxBackdrop&&this.$wuxBackdrop.retain()}},created:function(){this.data.mask&&(this.$wuxBackdrop=(0,_index.$wuxBackdrop)("#wux-backdrop",this))}});