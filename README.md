# h5_init.js
文件地址：[https://github.com/LittleXiaosi/h5_init.js/blob/master/h5_event_init.js](https://github.com/LittleXiaosi/h5_init.js/blob/master/h5_event_init.js)
## 适用范围
本库文件适用于H5单屏滑动活动，文件内对该类活动做了一些初始化的设定

## 功能说明

1.  禁止屏幕默认滚动事件，强制重新获取屏幕高度（手动）
2.  屏幕翻转检测，横屏提示，也可自定义回调提示(自动检测，手动设置回调)
3.  图片加载loading状态反馈(自动加载图片，手动定义回调）
4.  queryString方法（手动）
5.  RunTime时间控制器，用于控制复杂动画和音频播放（手动）

## 使用方法

### 引用
因为对其他库没有依赖，可以在任何位置引用，建议放在head内
```html
<!DOCTYPE html>
<html>
    <head>
        <script type="text/javascript" src="javascript/h5_event_init.js"></script>
    </head>
    <body>
    </body>
</html>
```

### 使用
#### __单页划屏页面设置__
针对单页划屏页面的设置，会对页面做这些设置
1.  `html`元素强制设定高度，值为可视区域高度
2.  `body`添加`overflow:hidden`属性
3.  禁止页面的默认滚动，禁止`touchmove`事件
4.  可视区域`resize`的时候重设高度
```js
    //调用 initHeight()方法，实现以上设置
    initHeight();
```

#### __屏幕横竖屏检测__
默认提示：
```js
    alert('这样子没法正常显示啦，转过来啦');
```
自定义提示：
```js
    //设置横竖屏检测对象的回调函数
    orientationTester.setCallback(function() {
        alert('自定义横竖屏检测');
    });
```
#### __图片加载__
自动加载data-src属性的图片，显示进度回调函数需要手动定义
1. 把img的src属性替换成data-src，例子：

```html
 <!--替换前-->
 <img src="images/ren5.png" alt=""/>
 <!--替换后-->
 <img data-src="images/ren5.png" alt=""/>
```

2. 优先加载的图片，添加`data-src-priority="high"`属性，一般用于loading图片，优先其他图片加载

```html
<!--添加前-->
<img data-src="images/ren5.png" alt=""/>
<!--添加后-->
<img data-src="images/ren5.png" data-src-priority="high" alt=""/>
```

3. 设置加载进度回调函数

```js
 var loadImgObj = new loadImg({
        callback: initPage,                 //加载完毕之后执行callback回调函数
        showProgress: function(i) {         //当加载进度变化的时候，执行showProgress回调函数
            //i的值范围从0到1，如果要显示百分比，需要手动计算一下
            $load_progress.innerHTML = Math.floor(i * 100) + '%';
        }
    });
```

#### __queryString方法__
用于获取url内的参数

```js
   //例如：http://m.ac.qq.com/event/wxPublic/public.html?data1=1&data2=2
    queryString('data1')        //return '1'
    queryString('data2')        //return '2'
```

#### __RunTiime时间控制器__
RunTime主要是用来控制按照时间轴发生的复杂组合动画和音频播放，例子：
```js
      var runtime1 = new RunTime([                          //实例化一个控制器，同一页面可以实例化多个
                {
                    time: 0,                                //播放动画开始时间，这里是0 
                    dom: '.page1-zIndex5',                  //需要操作的dom节点
                    'className': 'page1-zIndex5-ani'            //给dom添加class名，实际动画在class内实现
                },
                {
                    time: 1000,                             //播放该动画的时间为1000ms
                    dom: '.page1-boy',                      //需要操作的dom节点
                    'className': 'page1-boy-ani',               //给dom节点添加class，触发动画
                    audio: '#audio2'                        //找寻audio的dom节点，并且在1000ms的时候播放音频
                },
                {
                    time: 7000,                             //播放动画开始时间，7000ms
                    dom: '.page1-getdown',                  //需要操作的dom节点
                    'className': 'page1-getdown-ani',           //给dom节点添加class名，触发动画
                    callback: function() {                  //完成 'page1-getdown-ani'触发的动画之后，触发回调函数
                        runtime2.play();
                    }

                }
            ]);
```
说明：

1.  time参数的单位为ms 
2.  dom参数需要传入一个queryselector选择器 
3.  className参数是用来触发动画的，把需要触发的动画放在该class内 
4.  audio参数需要传入一个queryselector选择器，寻找对应的audio元素，触发.play()方法 
5.  callback方法是在动画执行完毕触发的，一个runTime对象内可以有多个回调函数 
6.  可以存在单纯只有 time和audio参数情况，只触发在对应时间播放音乐，但是不支持callback，因为audio的ended事件判断非常不准确 
7.  RunTime内的audio只支持.play()方法，不支持.pause()方法，复杂音乐时间控制请单独写控制器，精确控制 