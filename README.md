# swiper
## 移动端页面滚动效果
调用实例请参考swiper.html

html

    <div class="scroll">
    <div class="step">
      <h1>1</h1>
    </div>
    <div class="step">
      <h1>2</h1>
    </div>
    <div class="step">
      <h1>3</h1>
    </div>
    <div class="step">
      <h1>4</h1>
    </div>
    <div class="step">
      <h1>5</h1>
    </div>
    <div class="step">
      <h1>6</h1>
    </div>
    </div>

css

    .scroll{
      position:relative; width:100%;height:100%;overflow:hidden;;
    }
    .step{
      width:100%; height:100%; overflow:hidden; position:absolute;
      -webkit-transform:translate3d(0,0,0); left:0; top:0; ;
      -webkit-transition:-webkit-transform 300ms ease-out; 
      background-color:#fff;
    }

JS调用：

    a = Scrolls({
        box : '.scroll', // 盒容器
        step : '.step',  // 子容器
        index : 3,       // 初始显示第几屏,默认值 0
        direction : 'v', // 方向，v = 垂直，h=水平，默认值v
        callback : fn    // 回调，fn(index);传入当前屏下标
    });
    a.pre(); // 往前翻一屏
    a.next(); // 往后返一屏
    a.go(index); // 滚动到index屏
    a.getIndex(); // 获取当前屏下标
