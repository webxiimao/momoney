"use strict";var _baseComponent=_interopRequireDefault(require("../helpers/baseComponent")),_classNames4=_interopRequireDefault(require("../helpers/classNames")),_eventsMixin=_interopRequireDefault(require("../helpers/eventsMixin")),_utils=_interopRequireDefault(require("./utils"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _defineProperty(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var MAX_SAFE_INTEGER=Number.MAX_SAFE_INTEGER||Math.pow(2,53)-1,toNumberWhenUserInput=function(e){return/\.\d*0$/.test(e)||16<e.length||isNaN(e)?e:Number(e)},getValidValue=function(e,t,a){var i=parseFloat(e);return isNaN(i)?e:a<(i=i<t?t:i)?a:i},defaultEvents={onChange:function(){},onFocus:function(){},onBlur:function(){}};(0,_baseComponent.default)({behaviors:[(0,_eventsMixin.default)({defaultEvents:defaultEvents})],externalClasses:["wux-sub-class","wux-input-class","wux-add-class"],relations:{"../field/index":{type:"ancestor"}},properties:{prefixCls:{type:String,value:"wux-input-number"},shape:{type:String,value:"square"},min:{type:Number,value:-MAX_SAFE_INTEGER},max:{type:Number,value:MAX_SAFE_INTEGER},step:{type:Number,value:1},defaultValue:{type:Number,value:0},value:{type:Number,value:0},disabled:{type:Boolean,value:!0},longpress:{type:Boolean,value:!1},color:{type:String,value:"balanced"},controlled:{type:Boolean,value:!1}},data:{inputValue:0,disabledMin:!1,disabledMax:!1},computed:{classes:["prefixCls, shape, color, disabledMin, disabledMax",function(e,t,a,i,n){return{wrap:(0,_classNames4.default)(e,_defineProperty({},"".concat(e,"--").concat(t),t)),sub:(0,_classNames4.default)("".concat(e,"__selector"),(_defineProperty(t={},"".concat(e,"__selector--sub"),!0),_defineProperty(t,"".concat(e,"__selector--").concat(a),a),_defineProperty(t,"".concat(e,"__selector--disabled"),i),t)),add:(0,_classNames4.default)("".concat(e,"__selector"),(_defineProperty(t={},"".concat(e,"__selector--add"),!0),_defineProperty(t,"".concat(e,"__selector--").concat(a),a),_defineProperty(t,"".concat(e,"__selector--disabled"),n),t)),icon:"".concat(e,"__icon"),input:"".concat(e,"__input")}}]},observers:{value:function(e){this.data.controlled&&this.setValue(e,!1)},"inputValue, min, max":function(e,t,a){this.setData({disabledMin:e<=t,disabledMax:a<=e})}},methods:{updated:function(e){this.hasFieldDecorator||this.data.inputValue!==e&&this.setData({inputValue:e})},setValue:function(e){var t=!(1<arguments.length&&void 0!==arguments[1])||arguments[1],a=this.data,i=a.min,a=a.max,a=_utils.default.strip(getValidValue(e,i,a));this.updated(a),t&&this.triggerEvent("change",{value:a})},calculation:function(e,t){var a=this,i=this.data,n=i.disabledMax,u=i.disabledMin,s=i.inputValue,l=i.step,r=i.longpress;i.controlled;if("add"===e){if(n)return;this.setValue(_utils.default.plus(s,l))}if("sub"===e){if(u)return;this.setValue(_utils.default.minus(s,l))}r&&t&&(this.timeout=setTimeout(function(){return a.calculation(e,t)},100))},onInput:function(t){var a=this;this.clearInputTimer(),this.inputTime=setTimeout(function(){var e=toNumberWhenUserInput(t.detail.value);a.setValue(e)},300)},onFocus:function(e){this.triggerEvent("focus",e.detail)},onBlur:function(e){this.setData({inputValue:this.data.inputValue}),this.triggerEvent("blur",e.detail)},onLongpress:function(e){e=e.currentTarget.dataset.type;this.data.longpress&&this.calculation(e,!0)},onTap:function(e){var t=e.currentTarget.dataset.type,e=this.data.longpress;e&&(!e||this.timeout)||this.calculation(t,!1)},onTouchEnd:function(){this.clearTimer()},onTouchCancel:function(){this.clearTimer()},clearTimer:function(){this.timeout&&(clearTimeout(this.timeout),this.timeout=null)},clearInputTimer:function(){this.inputTime&&(clearTimeout(this.inputTime),this.inputTime=null)}},attached:function(){var e=this.data,t=e.defaultValue,a=e.value,e=e.controlled;this.setValue(e?a:t,!1)},detached:function(){this.clearTimer(),this.clearInputTimer()}});