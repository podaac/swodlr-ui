/* yepnope 1.5.x|WTFPL */
(function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);

/**
 * Version Comparison Function
 * Credit: https://github.com/kvz/phpjs/blob/master/functions/info/version_compare.js
 */
function version(required,version){var compare=0;var vm={'dev':-6,'alpha':-5,'a':-5,'beta':-4,'b':-4,'RC':-3,'rc':-3,'#':-2,'p':1,'pl':1};var sanitize=function(v){v=v.toString().replace(/[_\-+]/g,'.');v=v.replace(/([^.\d]+)/g,'.$1.').replace(/\.{2,}/g,'.');return(!v.length?[-8]:v.split('.'))};var numerical=function(v){return!v?0:(isNaN(v)?vm[v]||-7:parseInt(v,10))};var v1=sanitize(required),v2=sanitize(version);var x=Math.max(v1.length,v2.length);for(var i=0;i<x;i++){if(v1[i]==v2[i]){continue}v1[i]=numerical(v1[i]);v2[i]=numerical(v2[i]);if(v1[i]<v2[i]){compare=-1;break}else if(v1[i]>v2[i]){compare=1;break}}return compare<=0};

/**
 * Main Loader
 */
(function(win, doc) {
	win.PODAAC = win.PODAAC || {};
  win.PODAAC.navigation = '#podaac-navigation';
  
  PodaacjQuery = 'jQuery' in win && win.jQuery;
  
  var bootstrap = function($) {
    var html = '<link href="https://podaac.jpl.nasa.gov/api/template.css" type="text/css" rel="stylesheet" /> <div id="podaac-header-container"> <header id="podaac-header" role="banner"> <div id="block-podaac-helper-podaac-jpl-banner" class="block block-podaac-helper first odd"> <div class="block-content"> <div id="JPL-banner"> <div id="JPL-home"> <a href="http://www.nasa.gov" id="JPL-NASA-link"></a> <a href="http://www.jpl.nasa.gov" id="JPL-home-link">Jet Propulsion Laboratory</a> <a href="http://www.caltech.edu/" id="JPL-caltech-link">California Institute of Technology</a> </div> </div><!-- /.JPL-banner --> </div> </div><!-- /.block --> <div id="block-podaac-helper-podaac-search" class="block block-podaac-helper first odd"> <div class="block-content"> <form action="https://podaac.jpl.nasa.gov/helper/search" method="GET" id="podaac-search-form--2" accept-charset="UTF-8"><div><div class="form-item form-type-select form-item-type"> <label class="element-invisible" for="edit-type--2">Search Type </label> <select class="not-chosen form-select" id="edit-type--2" name="type"><option value="website">Website</option><option value="dataset" selected="selected">Data</option></select> </div> <div class="form-item form-type-textfield form-item-search"> <label class="element-invisible" for="edit-search--2">Search </label> <input title="Enter the terms you wish to search for." type="text" id="edit-search--2" name="search" value="Search" size="15" maxlength="128" class="form-text" /> </div> </div></form> </div> </div><!-- /.block --> <hgroup id="podaac-name-and-slogan"> <a href="https://podaac.jpl.nasa.gov/" title="Home" rel="home" id="podaac-logo"><img src="https://podaac.jpl.nasa.gov/sites/all/themes/podaac/logo.png" alt="Home" /></a> </hgroup> <div id="podaac-header-satellite"></div> <div id="podaac-follow-us"> <span id="podaac-follow-us-trigger">Follow Us</span> <ul id="podaac-follow-us-links"> <li><a href="https://www.facebook.com/NASAEarthData" class="podaac-follow-us-icon" id="podaac-facebook" target="_blank" title="NASA Earthdata Facebook"></a></li> <li><a href="http://www.youtube.com/user/NASAJPLPODAAC " class="podaac-follow-us-icon" id="podaac-youtube" target="_blank" title="PODAAC YouTube"></a></li> <li><a href="https://twitter.com/NASAEarthData" class="podaac-follow-us-icon" id="podaac-twitter" target="_blank" title="NASA Earthdata Twitter"></a></li> </ul> </div> <div class="podaac-clearfix"></div> </header> <div id="podaac-header-banner"></div> </div> <div id="podaac-main-container"> <div id="podaac-content-backdrop"> <div id="podaac-backdrop"> <div id="podaac-backdrop-gradient"></div> </div> </div> <div id="podaac-main"> <div id="podaac-navigation"> <div class="podaac-clearfix"></div> </div> <div id="podaac-content-container"> <div id="podaac-content"> <div id="podaac-page-content"></div> </div> </div> </div> </div> <div id="podaac-footer"></div> ';
    var menu = '<div id="block-podaac-helper-podaac-navigation" class="block block-podaac-helper first odd"> <div class="block-content"> <div class="block block-menu-block"> <h2 class="block-title">Navigation <button id="navigation-toggle"> <span class="first-bar"></span> <span class="bar"></span> <span class="bar"></span> </button> </h2> <div class="block block-podaac-helper menu-search-form clearfix"><form action="https://podaac.jpl.nasa.gov/helper/search" method="GET" id="podaac-search-form" accept-charset="UTF-8"><div><div class="form-item form-type-select form-item-type"> <label class="element-invisible" for="edit-type">Search Type </label> <select class="not-chosen form-select" id="edit-type" name="type"><option value="website">Website</option><option value="dataset" selected="selected">Data</option></select> </div> <div class="form-item form-type-textfield form-item-search"> <label class="element-invisible" for="edit-search">Search </label> <input title="Enter the terms you wish to search for." type="text" id="edit-search" name="search" value="Search" size="15" maxlength="128" class="form-text" /> </div> </div></form></div> <div class="menu-block-wrapper menu-name-menu-podaac-nav"> <ul class="navbar-podaac-nav"> <li class="leaf"> <a href="/" class="menu-item">Home</a> </li> <li class="leaf mega-dropdown"> <a href="/cloud-datasets" class="menu-item">Find Data</a> <div class="animated fadeIn mega-menu"> <ul class="dropdown-menu-row"> <li class="dropdown-menu-column submenu-science-disciplines has-children first"> <a class="label">Science Disciplines</a> <div class="menu-item-wrapper"> <ul> <li class="clearfix"> <a href=\'/cloud-datasets?ids=Keywords:Keywords&values=Oceans::Solid%20Earth&view=list\' class=\'menu-item\'><img src=https://podaac.jpl.nasa.gov/sites/default/files/science_theme/state_icons/oceans_on.svg class="on_state"><img src=https://podaac.jpl.nasa.gov/sites/default/files/science_theme/state_icons/oceans_off.svg class="off_state"><div class="discipline-name">Ocean</div></a> </li> <li class="clearfix"> <a href=\'/cloud-datasets?ids=Keywords&values=Cryosphere&view=list\' class=\'menu-item\'><img src=https://podaac.jpl.nasa.gov/sites/default/files/science_theme/state_icons/cryosphere_blue.svg class="on_state"><img src=https://podaac.jpl.nasa.gov/sites/default/files/science_theme/state_icons/cryosphere_white.svg class="off_state"><div class="discipline-name">Cryosphere</div></a> </li> <li class="clearfix"> <a href=\'/cloud-datasets?view=list&ids=Keywords&values=Terrestrial%20Hydrosphere\' class=\'menu-item\'><img src=https://podaac.jpl.nasa.gov/sites/default/files/science_theme/state_icons/hydrology_on.svg class="on_state"><img src=https://podaac.jpl.nasa.gov/sites/default/files/science_theme/state_icons/hydrology_off.svg class="off_state"><div class="discipline-name">Terrestrial Hydrosphere</div></a> </li> </ul> </div> </li> <li class="dropdown-menu-column submenu-measurements has-children"> <a class="label">Measurements</a> <div class="menu-item-wrapper"> <ul> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets?ids=Keywords&values=Cryosphere:Glaciers/Ice%20Sheets" class="menu-item">Glaciers/Ice Sheets</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets?ids=Keywords&values=Solid%20Earth:Gravity/Gravitational%20Field" class="menu-item">Gravity/Gravitational Field</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets?ids=Keywords&values=Oceans:Ocean%20Circulation" class="menu-item">Ocean Circulation</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets?ids=Keywords&values=Oceans:Ocean%20Heat%20Budget" class="menu-item">Ocean Heat Budget</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets?ids=Keywords&values=Oceans:Sea%20Surface%20Topography" class="menu-item">Ocean Surface Topography</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets?ids=Keywords&values=Oceans:Ocean%20Temperature" class="menu-item">Ocean Temperature</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets?ids=Keywords&values=Oceans:Ocean%20Waves" class="menu-item">Ocean Waves</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets?ids=Keywords&values=Oceans:Ocean%20Winds" class="menu-item">Ocean Winds</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets?ids=Keywords&values=Oceans:Salinity/Density" class="menu-item">Salinity/Density</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets?ids=Keywords&values=Oceans:Sea%20Ice" class="menu-item">Sea Ice</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets?ids=Keywords&values=Terrestrial%20Hydrosphere:Surface%20Water" class="menu-item">Surface Water</a> </li> </ul> </div> </li> <li class="dropdown-menu-column submenu-missions has-children"> <a class="label">Missions</a> <div class="menu-item-wrapper"> <ul> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/ADEOS-II?sections=data" class="menu-item">ADEOS-II</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/AQUA?sections=data" class="menu-item">AQUA</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/Aquarius?sections=data" class="menu-item">AQUARIUS/SAC-D</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/COWVR-TEMPEST?sections=data" class="menu-item">COWVR-TEMPEST</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/CYGNSS?sections=data" class="menu-item">CYGNSS</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/ECCO?sections=data" class="menu-item">ECCO</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/GEOS-3?sections=data" class="menu-item">GEOS-3</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/GHRSST?sections=data" class="menu-item">GHRSST</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/GRACE?sections=data" class="menu-item">GRACE</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/GRACE-FO?sections=data" class="menu-item">GRACE-FO</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/ISS-RapidScat?sections=data" class="menu-item">ISS-RAPIDSCAT </a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/JASON1?sections=data" class="menu-item">JASON 1</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/JASON3?sections=data" class="menu-item">JASON 3</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/MEaSUREs-CCMP?sections=data" class="menu-item">MEASURES-CCMP</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/MEaSUREs-MUR?sections=data" class="menu-item">MEASURES-MUR</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/MEaSUREs-Pre-SWOT?sections=data" class="menu-item">MEASURES-PRE-SWOT</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/MEaSUREs-SSH?sections=data" class="menu-item">MEASURES-SSH</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/NSCAT?sections=data" class="menu-item">NSCAT</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/OMG?sections=data" class="menu-item">OMG</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/OPERA?sections=data" class="menu-item">OPERA</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/OSTM-JASON2?sections=data" class="menu-item">OSTM-JASON 2</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/QuikSCAT?sections=data" class="menu-item">QUIKSCAT</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/S-MODE?sections=data" class="menu-item">S-MODE</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/S-NPP?sections=data" class="menu-item">S-NPP</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/Saildrone?sections=data" class="menu-item">SAILDRONE</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/SASSIE?sections=data" class="menu-item">SASSIE</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/SEASAT?sections=data" class="menu-item">SEASAT</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/Sentinel-6?sections=data" class="menu-item">SENTINEL-6</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/SMAP?sections=data" class="menu-item">SMAP</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/SPURS?sections=data" class="menu-item">SPURS</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/SWOT?sections=data" class="menu-item">SWOT</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/Terra?sections=data" class="menu-item">TERRA</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/TOPEX-POSEIDON?sections=data" class="menu-item">TOPEX-POSEIDON</a> </li> </ul> </div> </li> </ul> </div> </li> <li class="leaf"> <a href="/cloud-datasets/dataaccess" class="menu-item">Access Data</a> </li> <li class="leaf mega-dropdown"> <a href="/resources" class="menu-item">RESOURCES</a> <div class="animated fadeIn mega-menu"> <ul class="dropdown-menu-row"> <li class="dropdown-menu-column submenu-cloud-data-users first"> <a href="https://podaac.jpl.nasa.gov/Cloud-Data-Users-Resources" class="menu-item">Cloud Data Users</a> </li> <li class="dropdown-menu-column submenu-data-providers"> <a href="/Data-Provider-Resources" class="menu-item">Data Providers</a> </li> <li class="dropdown-menu-column submenu-data-users"> <a href="/resources" class="menu-item">Data Users</a> </li> </ul> </div> </li> <li class="leaf mega-dropdown"> <a href="/AboutPodaac" class="menu-item">About</a> <div class="animated fadeIn mega-menu"> <ul class="dropdown-menu-row"> <li class="dropdown-menu-column submenu-about-us has-children first"> <a class="label">ABOUT Us</a> <div class="menu-item-wrapper"> <ul> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/AboutPodaac" class="menu-item">ABOUT PO.DAAC</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/CitingPODAAC" class="menu-item">Data Use and Citation Policy</a> </li> </ul> </div> </li> <li class="dropdown-menu-column submenu-measurements has-children"> <a class="label">MEASUREMENTS</a> <div class="menu-item-wrapper"> <ul> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/Glaciers-IceSheets" class="menu-item">Glaciers/Ice Sheets</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/gravity" class="menu-item">Gravity/Gravitational Field</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/OceanCurrentsCirculation" class="menu-item">Ocean Circulation</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/OceanHeatBudget" class="menu-item">Ocean Heat Budget</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/OceanSurfaceTopography" class="menu-item">Ocean Surface Topography</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/SeaSurfaceTemperature" class="menu-item">Ocean Temperature</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/OceanWaves" class="menu-item">Ocean Waves</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/OceanWinds" class="menu-item">Ocean Winds</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/SeaSurfaceSalinity" class="menu-item">Salinity/Density</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/SeaIce" class="menu-item">Sea Ice</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/SurfaceWater" class="menu-item">Surface Water</a> </li> </ul> </div> </li> <li class="dropdown-menu-column submenu-missions has-children"> <a class="label">MISSIONS</a> <div class="menu-item-wrapper"> <ul> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/ADEOS-II" class="menu-item">ADEOS-II</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/AQUA" class="menu-item">AQUA</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/Aquarius" class="menu-item">Aquarius/SAC-D</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/CYGNSS" class="menu-item">CYGNSS</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/ECCO" class="menu-item">ECCO</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/GEOS-3" class="menu-item">GEOS-3</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/GHRSST" class="menu-item">GHRSST</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/GRACE" class="menu-item">GRACE</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/GRACE-FO" class="menu-item">GRACE-FO</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/ISS-RapidScat" class="menu-item">ISS-RapidScat</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/JASON1" class="menu-item">JASON 1</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/JASON3" class="menu-item">JASON 3</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/MEaSUREs-CCMP" class="menu-item">MEaSUREs-CCMP</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/MEaSUREs-MUR" class="menu-item">MEaSUREs-MUR</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/MEaSUREs-Pre-SWOT" class="menu-item">MEaSUREs-Pre-SWOT</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/MEaSUREs-SSH" class="menu-item">MEaSUREs-SSH</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/NSCAT" class="menu-item">NSCAT</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/OMG" class="menu-item">OMG</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/OPERA" class="menu-item">OPERA</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/OSTM-JASON2" class="menu-item">OSTM - JASON 2</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/QuikSCAT" class="menu-item">QuikSCAT</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/S-MODE" class="menu-item">S-MODE</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/S-NPP" class="menu-item">S-NPP</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/Saildrone" class="menu-item">Saildrone</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/SASSIE" class="menu-item">SASSIE</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/SEASAT" class="menu-item">Seasat</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/Sentinel-6" class="menu-item">Sentinel-6</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/SMAP" class="menu-item">SMAP</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/SPURS" class="menu-item">SPURS</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/SWOT" class="menu-item">SWOT</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/Terra" class="menu-item">TERRA</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/TOPEX-POSEIDON" class="menu-item">TOPEX-POSEIDON</a> </li> </ul> </div> </li> <li class="dropdown-menu-column submenu-news has-children"> <a class="label">NEWS</a> <div class="menu-item-wrapper"> <ul> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/announcements" class="menu-item">Announcements</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/events" class="menu-item">Events</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/MeetingsandWorkshops" class="menu-item">Meetings and Workshops</a> </li> <li class="clearfix"> <a href="https://podaac.jpl.nasa.gov/system-alerts" class="menu-item">System Alerts</a> </li> </ul> </div> </li> </ul> </div> </li> <li class="leaf mega-dropdown"> <a href="/HELP" class="menu-item">HELP</a> <div class="animated fadeIn mega-menu"> <ul class="dropdown-menu-row"> <li class="dropdown-menu-column submenu-mailing-list first"> <a href="/MailingList" class="menu-item">Mailing List</a> </li> <li class="dropdown-menu-column submenu-forum"> <a href="http://podaac.jpl.nasa.gov/forum" class="menu-item">Forum</a> </li> <li class="dropdown-menu-column submenu-po.daac-rss-feeds"> <a href="/PO.DAAC_RSS_Feed" class="menu-item">PO.DAAC RSS Feeds</a> </li> </ul> </div> </li> <li class="leaf mega-dropdown"> <a href="/cloud-datasets/about" class="menu-item">CLOUD DATA</a> <div class="animated fadeIn mega-menu"> <ul class="dropdown-menu-row"> <li class="dropdown-menu-column submenu-about first"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets/about" class="menu-item">ABOUT</a> </li> <li class="dropdown-menu-column submenu-cloud-datasets"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets" class="menu-item">Cloud Datasets</a> </li> <li class="dropdown-menu-column submenu-access-data"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets/dataaccess" class="menu-item">Access Data</a> </li> <li class="dropdown-menu-column submenu-faq"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets/faq" class="menu-item">FAQ</a> </li> <li class="dropdown-menu-column submenu-resources"> <a href="https://podaac.jpl.nasa.gov/cloud-datasets/resources" class="menu-item">Resources</a> </li> <li class="dropdown-menu-column submenu-migration"> <a href="/cloud-datasets/migration" class="menu-item">Migration</a> </li> </ul> </div> </li> </ul> </div> </div> </div> </div><!-- /.block --> ';
    var footer = '<div id="block-block-17" class="block block-block first odd"> <div class="block-content"> <style> <!--/*--><![CDATA[/* ><!--*/ .core-trust-seal { position:absolute; left:45%; } @media (max-width: 950px) { .core-trust-seal { margin-top:25px; } } @media (max-width:700px) { .core-trust-seal { float: right; left: auto; top: auto; margin-top: 0; position:relative; } } /*--><!]]>*/ </style><div class="core-trust-seal"><a href="https://www.coretrustseal.org/" style="text-decoration: none;" target="_blank"><img alt="PODAAC Core Trust Seal" height="50" loading="lazy" src="//podaac.jpl.nasa.gov/sites/default/files/image/custom_thumbs/PODAAC-CoreTrustSeal-th50.jpg" width="50" /></a></div> </div> </div><!-- /.block --> <div id="block-menu-block-2" class="block block-menu-block even" role="navigation"> <div class="block-content"> <div class="menu-block-wrapper menu-block-2 menu-name-menu-footer-menu parent-mlid-0 menu-level-1"> <ul class="menu"><li class="first leaf menu-mlid-3805"><a href="/rss.xml" title="">RSS Feed</a></li> <li class="leaf menu-mlid-1996"><a href="http://www.jpl.nasa.gov/copyrights.cfm" title="">Privacy</a></li> <li class="leaf menu-mlid-1997"><a href="/CitingPODAAC" title="">Data Citation</a></li> <li class="leaf menu-mlid-1999"><a href="/AboutPodaac" title="">About PO.DAAC</a></li> <li class="last leaf menu-mlid-2000"><a href="mailto:podaac@podaac.jpl.nasa.gov" title="">Contact</a></li> </ul></div> </div> </div><!-- /.block --> ';
    var settings = $.extend({
      load_menu: true,
      load_footer: true
    }, win.podaac_settings || {});
    
    $(function() {
      var body = $('body');
      var content = body.contents().detach();
      
      body.html(html).find('#podaac-page-content').html(content);
      if (settings.load_menu) $('#podaac-navigation').append(menu);
      if (settings.load_footer) $('#podaac-footer').append(footer);
    });
  };
  
  if (!PodaacjQuery || PodaacjQuery.fn || !PodaacjQuery.fn.jquery || !version('1.5.2', PodaacjQuery.jquery)) {
    yepnope({
      load: ['https://podaac.jpl.nasa.gov/sites/all/modules/contrib/jquery_update/replace/jquery/1.12/jquery.min.js', 'https://podaac.jpl.nasa.gov/sites/all/libraries/modernizr/modernizr.min.js', 'https://podaac.jpl.nasa.gov/sites/all/themes/podaac/js/navigation.js'],
      callback: {
        'jquery.min.js': function() {
          PodaacjQuery = jQuery.noConflict();
          bootstrap(PodaacjQuery);
        },
      }
    });
  }
  
})(window, document);