/**
 * Created by xiaosiyan on 2015/3/19.
 * 在 7.27日更新
 */
;
(function(window) {
    /** 工具函数
     * 判断某个元素是否符合某个选择器
     * @param el 目标元素
     * @param selector 选择器
     * @returns {*} 是否符合
     */
    function isThis(el, selector) {
        var _matches = (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector);

        if (_matches) {
            return _matches.call(el, selector);
        } else if (el.parentNode) {
            var nodes = el.parentNode.querySelectorAll(selector);
            for (var i = nodes.length; i--;)
                if (nodes[i] === el) {
                    return true;
                }
            return false;
        }
        return false;
    }

    /** 工具函数
     * 向上寻找符合selector的元素
     * @param el 目标元素
     * @param selector 选择器
     * @param excludeThis 是否包括自己
     * @returns 符合选择器的元素
     */
    function refluxToFind(el, selector, excludeThis) {
        if (!excludeThis && isThis(el, selector)) {
            return el;
        } else if (el.parentNode) {
            return refluxToFind(el.parentNode, selector);
        } else {
            return null;
        }
    }

    window.refluxToFind = refluxToFind;

    //页面初始化设定高度和静止滚动事件
    (function() {
        var i = 0;

        function initHeight() {
            //兼容在APP之内window.innerHeight初始化为0，不能正常显示bug
            if (window.innerHeight && window.innerHeight > 0) {
                console.log('有高度：' + window.document.toLocaleString() + 'time:' + new Date().getTime());
                document.documentElement.style.height = window.innerHeight + 'px';
                document.body.style.overflow = 'hidden';
                document.body.addEventListener('touchmove', function(e) {
                    e.preventDefault();
                }, false);
            } else {
                setTimeout(initHeight, 20);
            }
        }

        initHeight();
        window.onresize = initHeight;
    })();

    //加载图片
    //加载图片必须要有2个级别，data-src-priority=high级别一般用于loading图，只有data-src代表正常地址，正常加载
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
                            function sto_callback() {
                                //兼容在APP之内window.innerHeight初始化为0，不能正常显示bug，回调函数需要在
                                //页面大小能够确认之后再执行
                                if (window.innerHeight && window.innerHeight > 0) {
                                    callback();
                                } else {
                                    setTimeout(sto_callback, 100);
                                }
                            }

                            sto_callback();
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

    //设定a标签点击跳转
    /*页面所有链接跳转 begin*/
    (function() {
        function changeLocation(target) {
            var $a_href = undefined;
            if (target && ($a_href = refluxToFind(target, 'a[href]'))) {
                window.location.href = $a_href.getAttribute('href');
            }
        }

        document.body.addEventListener('click', function(e) {
            if (e.target && (refluxToFind(e.target, 'a[href]'))) {
                e.target.preventDefault();
            }
        });

        if (window.Hammer) {
            var hammer_body = new Hammer(document.body);
            hammer_body.on('tap', function(e) {
                changeLocation(e.target);
            });
        } else if (window.TouchHandler) {
            var touch_body = new TouchHandler(document.body);
            touch_body.on('click', function(e) {
                changeLocation(e.target);
            });
        } else {
            document.body.addEventListener('touchstart', function(e) {
                changeLocation(e.target)
            });
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
        script2.innerHTML = " if (typeof(pgvMain) == 'function') {pgvMain();}";

        document.body.appendChild(script1);
        script1.onload = function() {
            document.body.appendChild(script2);
        }
    })();
    /*添加点击流代码 end*/

    /*添加queryString begin*/
    function queryString(key) {
        var queryStrings = {};
        var qs = (window.location.href.split('?')[1] || '').split('&');
        for (var i = 0, q; q = qs[i]; i++) {
            q = q.split('=');
            if (q.length == 2) {
                queryStrings[q[0]] = decodeURIComponent(q[1]);
            }
        }
        return queryStrings[key];
    }

    /*时间轴动画控制*/
    (function(window) {

        var TIMELOOP = 50;      //定义时间轴循环检测的时间
        var TIMESPACE = TIMELOOP / 2;     //定义容错区间，一般为循环检测时间的 1/2

        function RunTime(arr) {
            this.aniList = [];
            this.aniLink = [];
            this.nowTime = 0;
            this.nowLinkIndex = 0;

            this.init(arr);
            window.xiaosi = this;
        }

        RunTime.prototype = {
            //每一次循环的处理
            timeActive: function() {
                var that = this;

                if (that.aniLink[0] < that.nowTime + TIMESPACE && that.aniLink[0] > that.nowTime - TIMESPACE) {
                    var nowAniList = that.aniList[that.aniLink[0]];
                    for (var x = 0, y = nowAniList.length; x < y; x++) {
                        if (document.querySelector(nowAniList[x].dom)) {
                            document.querySelector(nowAniList[x].dom).classList.add(nowAniList[x].class);
                            if (nowAniList[x].callback && typeof (nowAniList[x].callback) == "function") {
                                document.querySelector(nowAniList[x].dom).addEventListener('webkitAnimationEnd', (function(a) {
                                    nowAniList[a].callback();
                                })(x));
                            }
                            if (nowAniList[x].audio && document.querySelector(nowAniList[x].audio)) {
                                document.querySelector(nowAniList[x].audio).play();
                            }
                        } else {
                            console.dir(nowAniList[x]);
                            console.log('这个节点寻找不到');
                        }
                    }
                    that.nowLinkIndex++;
                    that.aniLink.shift();
                }
                that.nowTime = that.nowTime + TIMELOOP;
            },

            //时间循环函数
            timeLoop: function() {
                var that = this;

                setTimeout(function() {
                    if (that.aniLink.length > 0) {
                        that.timeActive();
                        that.timeLoop();
                    } else {
                        return false;
                    }
                }, TIMELOOP);
            },

            //排序函数
            orderLink: function(item) {
                var that = this;

                var num = Number(item.time);
                if (that.aniLink.length == 0) {
                    that.aniLink.push(num);
                    that.aniList[String(num)] = [item];
                } else {
                    if (that.aniLink[0] > num) {
                        that.aniLink.unshift(num);
                        that.aniList[String(num)] = [item];
                    } else if (that.aniLink[that.aniLink.length - 1] < num) {
                        that.aniLink.push(num);
                        that.aniList[String(num)] = [item];
                    } else {

                        for (var i = 0, j = that.aniLink.length; i < j; i++) {

                            if ((num > that.aniLink[i] && num < that.aniLink[i + 1])) {
                                that.aniLink.splice((i + 1), 0, num);
                                that.aniList[String(num)] = [item];
                            } else if ((num == that.aniLink[i])) {
                                if (that.aniList[String(num)]) {
                                    that.aniList[String(num)].push(item);
                                }
                            }
                        }
                    }
                }
            },

            //初始化时间轴
            init: function(arr) {
                var that = this;

                if (that.checkArgument(arr)) {
                    for (var i = 0, j = arr.length; i < j; i++) {
                        that.orderLink(arr[i]);
                    }
                }
            },

            //初始化之前检测参数是否有效
            checkArgument: function(arr) {
                var that = this;

                if (arr.length && arr.length > 0) {
                    for (var i = 0, j = arr.length; i < j; i++) {
                        if (!(arr[i]['time'] || arr[i]['time'] == 0)) {
                            console.log('时间轴数组参数的第' + i + '个对象time参数有问题');
                            return false;
                        }
                        if (!(arr[i]['dom'] && document.querySelector(arr[i]['dom']))) {
                            console.log('时间轴数组参数的第' + i + '个对象dom参数有问题');
                            return false;
                        }
                        if (!(arr[i]['class'])) {
                            console.log('时间轴数组参数的第' + i + '个对象dom参数有问题');
                            return false;
                        }
                    }
                    return true;
                } else {
                    console.log('传入的时间轴数组格式有误或者参数为空');
                    return false;
                }
            },

            //开始播放动画
            play: function() {
                var that = this;

                that.timeActive();
                that.timeLoop();
            }
        };

        window.RunTime = RunTime;
    })(window);

    window.queryString = queryString;
    /*添加queryString end*/
})(window);
