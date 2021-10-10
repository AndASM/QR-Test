(()=>{"use strict";({554:function(e,n){var t=this&&this.__awaiter||function(e,n,t,r){return new(t||(t=Promise))((function(o,i){function c(e){try{a(r.next(e))}catch(e){i(e)}}function s(e){try{a(r.throw(e))}catch(e){i(e)}}function a(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(c,s)}a((r=r.apply(e,n||[])).next())}))},r=this&&this.__generator||function(e,n){var t,r,o,i,c={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(t)throw new TypeError("Generator is already executing.");for(;c;)try{if(t=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return c.label++,{value:i[1],done:!1};case 5:c.label++,r=i[1],i=[0];continue;case 7:i=c.ops.pop(),c.trys.pop();continue;default:if(!(o=c.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){c=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){c.label=i[1];break}if(6===i[0]&&c.label<o[1]){c.label=o[1],o=i;break}if(o&&c.label<o[2]){c.label=o[2],c.ops.push(i);break}o[2]&&c.ops.pop(),c.trys.pop();continue}i=n.call(e,c)}catch(e){i=[6,e],r=0}finally{t=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}};Object.defineProperty(n,"__esModule",{value:!0}),n._Service=void 0;var o,i=self;!function(e){function n(n){n.waitUntil(function(){return t(this,void 0,void 0,(function(){var n;return r(this,(function(t){switch(t.label){case 0:return console.log("Install Event"),[4,caches.open(e.cacheNames.install)];case 1:return n=t.sent(),console.log('Opened cache "'+e.cacheNames.install+'"'),[4,n.addAll(e.knownUrls)];case 2:return t.sent(),console.log("Added "+e.knownUrls.length+" items"),[4,i.skipWaiting()];case 3:return t.sent(),[2]}}))}))}()),console.log("eventInstall")}function o(n){n.waitUntil(function(){return t(this,void 0,void 0,(function(){var n,t,o,c,s,a;return r(this,(function(r){switch(r.label){case 0:return console.log("Activate Event"),[4,caches.keys()];case 1:return n=r.sent(),t=n.filter((function(n){return!Object.values(e.cacheNames).includes(n)})),console.log('To remove: ["'+t.join('", "')+'"] from: ["'+n.join('", "')+'"]'),[4,Promise.all(t.map((function(e){return caches.delete(e)})))];case 2:return r.sent(),console.log("Caches removed"),[4,i.clients.claim()];case 3:return r.sent(),console.log("Clients claimed"),[4,i.clients.matchAll({type:"window"})];case 4:for(o=r.sent(),c=0,s=o;c<s.length;c++)"navigate"in(a=s[c])&&a.navigate(i.location.href.replace(/\/[^\/]+?\.[^\/]+?$/,"/")).then();return[2]}}))}))}()),console.log("eventActivate")}function c(e){var n=new URL(e.request.url,i.location.href);n.protocol.startsWith("http")&&n.origin===self.location.origin&&e.respondWith(function(e){return t(this,void 0,void 0,(function(){var n,t;return r(this,(function(r){switch(r.label){case 0:return[4,caches.match(e.request)];case 1:return(n=r.sent())?[2,n]:(t=new URL(e.request.url,i.location.href),console.log("Attempted to fetch missing: "+t.toString()),[4,caches.match(new Request("404.html"))]);case 2:return[2,r.sent()]}}))}))}(e))}e.version="v0.1.0-3-g31e2bbf: 2021-10-09T00:12:05-06:00",e.cacheNames={install:"install2 v0.1.0-3-g31e2bbf"},e.knownUrls=["qr.worker.js","404.html","404.js","404.css"],e.init=function(){console.log("Initializing service worker "+e.version),i.addEventListener("install",n),i.addEventListener("activate",o),i.addEventListener("fetch",c)}}(o=n._Service||(n._Service={})),self.CachingSW=o,o.init()}})[554](0,{})})();