!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).WwLogin=e()}(this,(function(){"use strict";var t="https://open.work.weixin.qq.com",e=["work.weixin.qq.com","tencent.com"],o={sso:"/wwopen/sso/qrConnect",tww:"/login/wwLogin/sso/qrConnect",native:"/native/sso/qrConnect",twxg:"/login/wwLogin/sso/qrConnect"},n="1.2.7";return function(){function s(t){this.options=t,this.options=t,this.createFrame()}return s.prototype.destroyed=function(){console.log("WwLogin had destroyed."),window.removeEventListener("message",this.onPostMessage)},s.prototype.showQrcodeLogin=function(){this.postMessage({name:"showQrcodeLogin",data:{}})},s.prototype.postMessage=function(e){void 0===e&&(e={}),this.frame.contentWindow&&this.frame.contentWindow.postMessage(JSON.stringify(e),t)},s.prototype.getUrl=function(e){var s=[];Object.keys(e).forEach((function(t){var o=e[t];[void 0,null].includes(o)||["string","number","boolean"].includes(typeof o)&&"id"!==t&&s.push("".concat(t,"=").concat(o))})),s.push("version=".concat(n)),s.push("login_type=jssdk");var i=o[e.business_type||"sso"];if(!i)throw new Error("Argument business_type not match. Current version is ".concat(n,"."));var r=t;return/tencent\.com$/.test(location.host)&&(r="https://open.wecom.tencent.com"),"".concat(r).concat(i,"?").concat(s.join("&"))},s.prototype.createFrame=function(){var t=this;if(this.options.is_mobile)location.href=this.getUrl(this.options);else{this.frame=document.createElement("iframe");var e=document.getElementById(this.options.id);this.frame.src=this.getUrl(this.options),this.frame.frameBorder="0",this.frame.allowTransparency="true",this.frame.scrolling="no",this.frame.width="300px",this.frame.height="400px",e.innerHTML="",e.appendChild(this.frame),window.addEventListener("message",(function(e){t.onPostMessage(e)})),this.frame.onload=function(){t.frame.contentWindow.postMessage("ask_usePostMessage","*")}}},s.prototype.onPostMessage=function(t){var o,n;if(e.filter((function(e){return new RegExp("".concat(e,"$")).test(t.origin)})).length){var s;try{var i=JSON.parse(t.data),r=i.name,a=i.data;null===(n=null===(o=this.options)||void 0===o?void 0:o[r])||void 0===n||n.call(o,a)}catch(e){(s=t.data)&&"string"==typeof s&&/^http/.test(s)&&(location.href=s)}}},s}()}));