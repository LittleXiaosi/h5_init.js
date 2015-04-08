/**
 * Created by xiaosiyan on 2015/3/19.
 */

;
(function(window) {
    //页面初始化设定高度和静止滚动事件
    function initHeight() {
        document.documentElement.style.height = window.innerHeight + 'px';
    }

    initHeight();
    window.onresize = initHeight;
    document.body.style.overflow = 'hidden';
    document.body.addEventListener('touchstart', function(e) {
        e.preventDefault();
    }, false);

    //加载图片
    (function() {
        var that = {};

        var DATASRC_1PX = 'http://ac.gtimg.com/media/images/blank.gif';

        function loadImg(obj) {
            that = this;
            this.obj = obj;

            this.options = {
                $$allImg: document.querySelectorAll('img[data-src]'),
                $$highImg: document.querySelectorAll('img[data-src-priority=high][data-src]'),
                callback: obj.callback,
                showProgress: obj.showProgress
            };
            this.nowCount = 0;
            this.nowProgerss = 0;

            this.init();
        }

        loadImg.prototype = {
            init: function() {
                if (that.checkDataSrc() == 0) {

                    if (that.options.$$allImg.length >= 0 && that.options.$$highImg.length >= 0) {
                        that.loadHighImg();
                    } else {
                        that.console('此页面缺少图片');
                    }
                } else {
                    that.console(that.checkDataSrc() + '个img缺少data-src');
                    return false;
                }
            },
            //加载图片通用方法
            loadImg: function(type, $dom, endCount, callback) {
                $dom.src = $dom.getAttribute('data-src');

                $dom.onload = function() {
                    $dom.setAttribute('data-src-load', 'loaded');
                    that.nowCount++;

                    that.console(that.nowCount);

                    if (type == 'high') {
                        //do nothing
                    } else if (type == 'normal') {
                        that.nowProgress = (that.nowCount / endCount).toFixed(3);
                        that._showProgress();
                    }

                    if (that.nowCount == endCount) {
                        if (typeof callback == 'function') {
                            callback();
                        }
                    }
                }
            },
            //加载高优先级的图片
            loadHighImg: function() {
                that.nowCount = 0;
                for (var i = 0; i < that.options.$$highImg.length; i++) {
                    that.loadImg('high', that.options.$$highImg[i], that.options.$$highImg.length, that.loadNormalImg);
                }
            },
            //加载低优先级图片
            loadNormalImg: function() {
                that.nowCount = 0;
                var $$normalImg = that.getNormalImg();
                for (var i = 0; i < $$normalImg.length; i++) {
                    that.loadImg('normal', $$normalImg[i], $$normalImg.length, that.options.callback);
                }
            },
            //展现加载图片百分比
            _showProgress: function() {
                that.options.showProgress.call(that, that.nowProgress);
            },
            //检测是否所有的img都已经添加data-src
            checkDataSrc: function() {
                var $$img = document.querySelectorAll('img');
                var imgLength = $$img.length;
                var temp_ARR = new Array();

                for (var i = 0; i < imgLength; i++) {
                    if ($$img[i].hasAttribute('data-src') && $$img[i].getAttribute('data-src') != '') {
                        //do nothing
                    } else if ($$img[i].getAttribute('data-src') == '') {
                        $$img[i].setAttribute('data-src', DATASRC_1PX);
                        that.console($$img[i]);
                        that.console('该元素data-src为空，地址替换为：' + DATASRC_1PX);
                    } else {
                        temp_ARR.push($$img[i]);
                        that.console($$img[i]);
                        that.console('该元素缺少data-src或者为空地址');
                    }
                }
                return temp_ARR.length;
            },
            //获取普通图片
            getNormalImg: function() {
                var allImg_length = that.options.$$allImg.length;
                var normal_ARR = new Array();
                for (var i = 0; i < allImg_length; i++) {
                    if (that.options.$$allImg[i].getAttribute('data-src-priority') == 'high') {
                        //do nothing
                    } else {
                        normal_ARR.push(that.options.$$allImg[i]);
                    }
                }
                return normal_ARR;
            },
            //输出log提示
            console: function(print) {
                if (window.console) {
                    console.log(print);
                }
            }
        }

        window.loadImg = loadImg;

    })();

    //屏幕翻转检测
    var onVertical = undefined;
    var updataOrientation = function() {
        if (window.orientation == '-90' || window.orientation == '90') {
            if (onVertical == undefined) {
                onVertical = false;
            } else if (onVertical == true) {
                onVertical = false;
            }
            alert('这样子没法正常显示啦，转过来啦');
        } else {
            if (onVertical == undefined) {
                onVertical = true;
            } else if (onVertical == false) {
                onVertical = true;
                history.go(0);
            }
        }
    }
    window.onorientationchange = updataOrientation;
    updataOrientation();

    /*页面所有链接跳转 begin*/
    (function() {
        var $aList = document.querySelectorAll('a');
        var aList_length = $aList.length;
        for (var i = 0; i < aList_length; i++) {
            (function(i) {
                if ($aList[i].href && $aList[i].href != '') {
                    var h_a = new Hammer($aList[i]);
                    h_a.on('tap', function() {
                        window.location.href = $aList[i].href;
                    });
                }
            })(i);
        }
    })();
    /*页面所有链接跳转 end*/

    /*添加点击流代码 begin*/
    (function() {
        var script1 = document.createElement('script');
        script1.setAttribute('type', 'text/javascript');
        script1.src = 'http://ac.gtimg.com/media/js/ping.js';

        var script2 = document.createElement('script');
        script2.setAttribute('type', 'text/javascript');
        script2.innerHTML = "  if (typeof(pgvMain) == 'function') {pgvMain();}";

        document.body.appendChild(script1);
        document.body.appendChild(script2);
    })();
    /*添加点击流代码 end*/
})(window);
