"use strict";var QRCode=require("./lib/QRCode"),ErrorCorrectLevel=require("./lib/ErrorCorrectLevel"),qrcode=function(r,e){e=new QRCode((e=e||{}).typeNumber||-1,e.errorCorrectLevel||ErrorCorrectLevel.H);return e.addData(r),e.make(),e};qrcode.ErrorCorrectLevel=ErrorCorrectLevel,module.exports=qrcode;