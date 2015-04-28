# h5_init.js

## 功能说明

1.  禁止屏幕滚动
2.  重新获取屏幕高度
3.  屏幕翻转检测
4.  图片加载loading状态反馈
5.  添加点击流统计代码

## 使用方法

```js
var loadImgObj = new loadImg({
        callback: initPage,
        showProgress: function(i) {
        }
    });
```

**说明**

1.  `callback`：执行插件之后的回调函数，通常为初始化函数；
2.  `showProgress`：加载百分比表现形式，i为当前加载图片的百分比；
3.  引用此文件需要在`html`文档的`body`后面并且不能在`window.onload`内（不然图片加载失效），因为是自执行；
