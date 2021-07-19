"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.format=exports.diff=exports.monthDiff=exports.parse=void 0;var parse=function(e){if(e instanceof Date)return e;if(!isNaN(e)||/^\d+$/.test(e))return new Date(parseInt(e,10));e=e.trim();return e=(e=(e=(e=(e=e.replace(/\.\d+/,"")).replace(/-/,"/").replace(/-/,"/")).replace(/T/," ").replace(/Z/," UTC")).replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2")).replace(/([\+\-]\d\d)$/," $100"),new Date(e)};exports.parse=parse;var monthDiff=function(e,r){e=parse(e),r=parse(r);return 12*(e.getFullYear()-r.getFullYear())+e.getMonth()-r.getMonth()};exports.monthDiff=monthDiff;var diff=function(e,r,t){var a=parse(e),e=r?parse(r):new Date,r=e.getTime()-a.getTime();return"second"===t&&r/1e3||"minute"===t&&r/1e3/60||"hour"===t&&r/1e3/60/60||"day"===t&&r/1e3/60/60/24||"week"===t&&r/1e3/60/60/24/7||"month"===t&&monthDiff(a,e)||"quarter"===t&&monthDiff(a,e)/3||"year"===t&&monthDiff(a,e)/12||r};exports.diff=diff;var defaults={second:["刚刚","片刻后"],seconds:["%d 秒前","%d 秒后"],minute:["大约 1 分钟前","大约 1 分钟后"],minutes:["%d 分钟前","%d 分钟后"],hour:["大约 1 小时前","大约 1 小时后"],hours:["%d 小时前","%d 小时后"],day:["1 天前","1 天后"],days:["%d 天前","%d 天后"],month:["大约 1 个月前","大约 1 个月后"],months:["%d 月前","%d 月后"],year:["大约 1 年前","大约 1 年后"],years:["%d 年前","%d 年后"]},format=function(e,r){var t=Object.assign({},defaults,r),a=e<0?1:0,n=Math.abs(e)/1e3,s=n/60,o=s/60,d=o/24,r=d/365,e=function(e,r){return e.replace(/%d/i,r)};return n<10&&e(t.second[a],parseInt(n))||n<45&&e(t.seconds[a],parseInt(n))||n<90&&e(t.minute[a],1)||s<45&&e(t.minutes[a],parseInt(s))||s<90&&e(t.hour[a],1)||o<24&&e(t.hours[a],parseInt(o))||o<42&&e(t.day[a],1)||d<30&&e(t.days[a],parseInt(d))||d<45&&e(t.month[a],1)||d<365&&e(t.months[a],parseInt(d/30))||r<1.5&&e(t.year[a],1)||e(t.years[a],parseInt(r))};exports.format=format;