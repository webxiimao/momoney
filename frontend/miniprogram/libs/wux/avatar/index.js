"use strict";var _baseComponent=_interopRequireDefault(require("../helpers/baseComponent")),_classNames2=_interopRequireDefault(require("../helpers/classNames")),_styleToCssString=_interopRequireDefault(require("../helpers/styleToCssString"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_unsupportedIterableToArray(e,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Map"===(r="Object"===r&&e.constructor?e.constructor.name:r)||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function _iterableToArrayLimit(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var r=[],n=!0,a=!1,i=void 0;try{for(var o,l=e[Symbol.iterator]();!(n=(o=l.next()).done)&&(r.push(o.value),!t||r.length!==t);n=!0);}catch(e){a=!0,i=e}finally{try{n||null==l.return||l.return()}finally{if(a)throw i}}return r}}function _arrayWithHoles(e){if(Array.isArray(e))return e}function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}(0,_baseComponent.default)({properties:{prefixCls:{type:String,value:"wux-avatar"},shape:{type:String,value:"circle"},size:{type:String,value:"default"},src:{type:String,value:""},bodyStyle:{type:[String,Object],value:"",observer:function(e){this.setData({extStyle:(0,_styleToCssString.default)(e)})}},scale:{type:Boolean,value:!1}},data:{extStyle:"",childrenStyle:""},computed:{classes:["prefixCls, shape, size, src",function(e,t,r,n){var a;return{wrap:(0,_classNames2.default)(e,(_defineProperty(a={},"".concat(e,"--").concat(t),t),_defineProperty(a,"".concat(e,"--").concat(r),r),_defineProperty(a,"".concat(e,"--thumb"),n),a)),string:"".concat(e,"__string")}}]},methods:{setScale:function(){var r=this,e=this.data.prefixCls,t=wx.createSelectorQuery().in(this);t.select(".".concat(e)).boundingClientRect(),t.select(".".concat(e,"__string")).boundingClientRect(),t.exec(function(e){var t;e.filter(function(e){return!e}).length||(e=(t=_slicedToArray(e,2))[0],t=t[1],t=1!=(e=e.width-8<t.width?(e.width-8)/t.width:1)?"position: absolute; display: inline-block; transform: scale(".concat(e,"); left: calc(50% - ").concat(Math.round(t.width/2),"px)"):"",r.setData({childrenStyle:t}))})}},ready:function(){!this.data.src&&this.data.scale&&this.setScale()}});