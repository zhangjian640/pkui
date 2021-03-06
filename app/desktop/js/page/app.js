/**
 * @fileOverview 应用（App）系统
 * @author 吴钦飞（wuqf@pkusoft.net）
 *
 * @module module:page/app
 * @requires jquery
 * @requires module:page/app-dock
 * @requires module:page/app-window
 */
define( function ( require ) {
    var $,
        AppDock,
        AppWindow
        ;

    $ = require( "jquery" );
    AppDock = require( "./app-dock" );
    AppWindow = require( "./app-window" );

    /**
     * @classDesc 应用（App）类
     * @exports module:page/app
     * @alias App
     * @constructor
     * @param {object} $target 快捷方式DOM
     */
    function App( $target ) {
        // 如果没有初始化，就先初始化。
        !App.isInited && App.init( null );

        this.appId = null;
        /** 快捷方式容器 */
        this.$target = $target;
        this.appDock = null;
        this.appWindow = null;
        this.isAppDestroy = false;
        this.isAppDockDestroy = false;
        this.isAppWindowDestroy = false;

        this._init();
    }

    /**
     * 用于App类初始化时的默认参数
     * @type {object}
     * @property {string} appSelector 标志快捷方式的CSS选择器
     * @property {string} optionsProp 标志快捷方式的参数的HTML属性
     * @property {string} hideAllAppSelector 标志显示桌面的CSS选择器
     */
    App.defaults = {
        appSelector: '[data-pkui-app="true"]',
        optionsProp: 'data-pkui-app-options',
        hideAllAppSelector: ".topbar-home"
    };

    /**
     * 用于存放所有App实例
     * @type {Array}
     */
    App.appList = [];

    /** 标志是否初始化，在实例化时进行判断 */
    App.isInited = false;
    /**
     * App类的初始化（设置参数和绑定事件处理函数）
     * @param options
     */
    App.init = function ( options ) {
        this.options = $.extend( {}, App.defaults, options );
        this._bind();
        this.isInited = true;
    };
    /**
     *
     */
    App.hideAll = function () {
        $.each( this.appList, function () {
            this && this.hide && this.hide();
        } );
    };

    /**
     * 绑定事件处理函数：当点击快捷方式时，触发App的实例化
     * @private
     */
    App._bind = function () {
        $( window.document ).on( "click.shortcut.app", this.options.appSelector, function () {
            var $this,
                appInstance
                ;
            $this = $( this );
            appInstance = $this.data( "appInstance" );

            if ( appInstance ) {
                appInstance.show();
                return;
            }
            $this.data( "appInstance", new App( $this ) );
        } )
            .on( "click.home.app", this.options.hideAllAppSelector, function () {
                App.hideAll();
            } );
    };

    /**
     * App实例的默认参数，从 "data-pkui-app-options" 中获取
     * @property {string} icon App图标的URL（建议使用绝对路径）
     * @property {string} title App标题
     * @property {string} src 要载入的内容的URL
     * @property {string} data 模板数据
     * 当 data 为空时，不需要使用artTemplate，直接将返回的数据插入窗口主体节点
     * 当 data 非空时，会请求src对应的模板和data对应的数据，
     * @property {function} dataHandler 对请求到的data数据进行预处理
     */
    App.prototype.defaults = {
        icon: "",
        title: "",
        src: "",

        //----- Deprecated ---------
        data: "",
        dataHandler: window.PKUI.responseDataHandler
        //----- Deprecated ---------
    };

    // @public
    $.extend( App.prototype, /** @lends App.prototype */ {

        /**
         * 显示dock和window。
         * @returns {App}
         */
        show: function () {
            this.appDock.show();
            this.appWindow.show();
            return this;
        },
        /**
         * 隐藏dock和window。
         * @returns {App}
         */
        hide: function () {
            this.appDock.hide();
            this.appWindow.hide();
            return this;
        },
        /**
         * 销毁App（关闭窗口，关闭dock）。
         * @returns {App}
         */
        destroy: function () {
            !this.isAppDockDestroy && this.appDock.destroy();
            !this.isAppWindowDestroy && this.appWindow.destroy();
            this.$target && this.$target.data( "appInstance", null );
            this.isAppDestroy = true;
            this.$target = null;
            this.appDock = null;
            this.appWindow = null;
            App.appList[ this.appId ] = null;
            return this;
        }
    } );

    // @private
    $.extend( App.prototype, /** @lends App.prototype */ {
        /**
         * 初始化一个App实例
         * @returns {App}
         * @private
         */
        _init: function () {

            // 1. 获取参数
            this.options = $.extend( {}, this.defaults, this._getOptsFromTarget() );

            // 2. 创建一个 页签（dock）
            this.appDock = new AppDock( this.options );
            this.appDock.appInstance = this;

            // 3. 创建一个 窗口（window）
            this.appWindow = new AppWindow( this.options );
            this.appWindow.appInstance = this;

            // 将实例添加到 App.appList，同时保存索引
            this.appId = App.appList.length;
            App.appList.push( this );

            return this;
        },

        /**
         * 从快捷方式的自定义HTML属性中获取参数
         * @returns {*}
         * @private
         */
        _getOptsFromTarget: function () {
            var data = this.$target.attr( App.options.optionsProp );
            return $.parseJSON( data );
        }

    } );


    return App;
} );
