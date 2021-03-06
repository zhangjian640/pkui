/**
 * @file 配置文件
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
;+function ( window ) {

    var isSupportHtml5Markup,
        isSupportMediaQuery,
        isSupportES5,
        isSupportJSON,
        isIE8,

        /** 时间戳：版本控制，避免缓存 */
        timestamp,

        scriptNodeList,
        currentScript,
        currentScriptPath,
        pkuiBasePath,
        mainJsPath
        ;


    scriptNodeList = window.document.scripts;
    currentScript = scriptNodeList[ scriptNodeList.length - 1 ];
    currentScriptPath = currentScript.src;
    pkuiBasePath = currentScriptPath.substring( 0, currentScriptPath.lastIndexOf( "/" ) );
    mainJsPath = currentScript.getAttribute( "data-main" );
    timestamp = currentScript.getAttribute( "data-timestamp" );


    if ( !timestamp ) { // 没设置
        timestamp = "v=please-set-version";
    } else if ( timestamp == "dev" ) { // 开发模式
        timestamp = "v=" + new Date().getTime();
    } else if ( timestamp.indexOf( "=" ) === -1 ) { // 生产模式：但没有请求参数名
        timestamp = "v=" + timestamp;
    }

    isSupportHtml5Markup = ( function ( ver ) {
        var b = document.createElement( "b" );
        b.innerHTML = "<!--[if IE " + ver + "]><i></i><![endif]-->";
        return b.getElementsByTagName( "i" ).length === 1
    }( 8 ) );

    isIE8 = isSupportHtml5Markup;

    isSupportMediaQuery = window.matchMedia && window.matchMedia( "only all" ) !== null
        && window.matchMedia( "only all" ).matches;

    isSupportES5 = Function.prototype.bind;

    isSupportJSON = window.JSON;


    // 配置
    seajs.config( {

        // 别名配置
        alias: {
            // "seajs-css": "lib/sea-modules/seajs-css/1.0.0/seajs-css",
            "seajs-text": "lib/sea-modules/seajs-text/1.1.1/seajs-text",

            // polyfill ES5 grammar
            "es5-shim": "lib/es5-shim/4.5.9.x/es5-shim",
            "es5-sham": "lib/es5-shim/4.5.9.x/es5-sham",

            // polyfill JSON（JSON.parse、JSON.stringify）
            "json3": "lib/json3/3.3.2/json3",

            // polyfill for min/max-width CSS3 Media Queries (for IE 6-8, and more)
            "respond": "lib/respond/1.4.2/respond",

            // 是IE8识别HTML5标记
            "html5shiv": "lib/html5shiv/3.7.3/html5shiv",

            // jQuery
            "jquery": "lib/jquery/1.11.3.x/jquery",

            // jQuery UI
            "jquery-ui": "lib/jquery/plugin/jquery-ui/1.12.1.x/jquery-ui.min",

            // 轮播图组件
            "swiper": "lib/swiper/2.7.6.x/swiper",

            // 弹窗组件
            "layer": "lib/layer/3.0.1.x/layer",

            // 模块名"artDialog"已在模块内定义，请勿更改
            "artDialog": "lib/art-dialog/6.0.4.x/dialog-plus",

            // 模板引擎
            "artTemplate": "lib/art-template/3.1.0/template",

            // RSA
            "jsencrypt": "lib/jsencrypt/2.3.1.x/jsencrypt",

            // AOP
            "meld": "lib/meld/1.3.1.x/meld.js"
        },

        // 路径配置
        paths: {
            //"pkui": "../../pkui"
        },

        // 变量配置
        vars: {
            //"locale": "zh-cn"
        },

        // 映射配置
        map: [
            // [ "http://example.com/js/app/", "http://localhost/js/app/" ]
            [ /^(.*\.(?:css|js|tpl))(.*)$/i, '$1?' + timestamp ]
        ],

        // 预加载项
        preload: [
            window.jQuery ? "" : "jquery",
            isSupportES5 ? "" : "es5-sham",
            isSupportJSON ? "" : "json3",
            isSupportMediaQuery ? "" : "respond",
            isSupportHtml5Markup ? "html5shiv" : ""

        ],

        // 调试模式
        debug: true,

        // Sea.js 的基础路径，由页面指定
        base: pkuiBasePath,

        // 文件编码
        charset: "utf-8"
    } );


    if ( mainJsPath ) {
        seajs.use( mainJsPath );
    } else {
        console.info( "“<script data-main=\"\" src=\"${ctx}/pkui/lib/pkui.js\"></script>”，没有通过“data-main”指定入口文件URL。" );
    }


    // 暴露出去
    window.isIE8 = isIE8;

/*

     loadJS( pkuiBasePath + "/lib/sea-modules/seajs/3.0.0.x/sea.js?" + timestamp, function () {

     } );
    //---
    function loadJS( src, callback ) {
        var script = document.createElement( 'script' );
        var head = document.getElementsByTagName( 'head' )[ 0 ];
        var isLoaded;

        script.src = src;
        script.charset = "utf-8";

        script.onload = script.onreadystatechange = function () {
            if ( !isLoaded && (!script.readyState || /loaded|complete/.test( script.readyState )) ) {
                script.onload = script.onreadystatechange = null;
                isLoaded = true;
                callback();
            }
        };
        head.appendChild( script );
    }*/
}( window );