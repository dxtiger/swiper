/*
 * @params
 * opt.box : 容器选择器
 * opt.step : 子容器选择器
 * opt.index : 当前展示的子容器下标，默认0
 * opt.direction : 方向 v=垂直,h=水平，默认v
 * opt.callback : 回调
 * @method
 * pre() 往前翻一屏
 * next() 往后翻一屏
 * go(index) 滚动到index屏
 * getIndex() return index 获取当前屏下标
 */
function Scrolls(opt){
	if(!document.querySelector(opt.box)) return;
	var box = document.querySelector(opt.box),
		steps = document.querySelectorAll(opt.step),
		c =opt.index|| 0,x,y,fix,path,
		len = steps.length,
		direction = opt.direction || 'v', // 滑动方向 v=垂直,h=水平
		w = box.offsetWidth,
		h = box.offsetHeight,
		cb=opt.callback||function(){},style,state,
		max=50;
	
	function setStyle(){
		var x=0,y=0;
		if(direction == 'v'){
			y = h
		}
		if(direction == 'h'){
			x = w
		}
		style = {
			'on' : '-webkit-transition-duration: 350ms;-webkit-transform:translate3d(0,0,0);',
			'pre' : '-webkit-transition-duration: 350ms;-webkit-transform:translate3d(-'+x+'px,-'+y+'px,0);',
			'next' : '-webkit-transition-duration: 350ms;-webkit-transform:translate3d('+x+'px,'+y+'px,0);'
		}
	}

	function handerEvent(e){
		switch(e.type){
			case "touchstart" : 
				_start(e);
				break;
			case 'touchmove' : 
				move(e);
				break;
			case 'touchend' : 
				setTimeout(end(e),1);
				break;
		}
	}
	function _start(e){
		if(e.touches.length == 1){
			var tar = e.target;
			if(tar.nodeName == 'INPUT' || tar.nodeName == 'TEXTAREA'){
				path = false;
				return;
			}
			x = e.touches[0].clientX;
			y = e.touches[0].clientY;
			path = false;
			fix = {x:0,y:0}
			box.addEventListener('touchmove',handerEvent,false);
			box.addEventListener('touchend',handerEvent,false);
		}
	}
	function end(e){
		box.removeEventListener('touchmove',handerEvent,false);
		box.removeEventListener('touchend',handerEvent,false);
		change();
	}
	function move(e){
		if(e.touches.length == 1){
			var _x = e.touches[0].clientX,_y = e.touches[0].clientY;
			fix = {
				x : _x - x,
				y : _y - y
			}
			if( Math.abs(fix.x) > Math.abs(fix.y) ){
				if(fix.x > 3){
					path = 'right'
				}
				if(fix.x < -3){
					path = 'left'
				}
				if(direction == 'v'){
					path = false;
				}
			}else{
				if(fix.y > 3){
				  path = 'down';
				}
				if(fix.y < -3){
				  path = 'up';
				}
				if(direction == 'h'){
					path = false
				}
			}
			if(path){
				state = true;
				follow();
			}
		}
		if(path){
			e.preventDefault();
			e.stopPropagation();
		}
	}
	// 翻页
	function change(){
	  	if(!path) return;
	  	var n = 0;
		var pre = steps[c-1],next = steps[c+1],current = steps[c];
		if(path == 'down' || path == 'right'){
			n = -1;
			state = true;
			if(pre){
				pre.addEventListener('webkitTransitionEnd',function(){
		            cb(c);
					setCurrent(c,c-n);
		            pre.removeEventListener('webkitTransitionEnd',arguments.callee,false);
		            state = false;
		        },false);
		        current.style.cssText += style.next;
				pre.style.cssText += style.on;
			}else{
				current.style.cssText += style.on;
				next.style.cssText += style.next;
				state = false;
			}
		}
		if(path == 'up' || path == 'left'){
			n = 1;
			state = true;
			if(next){
				next.addEventListener('webkitTransitionEnd',function(){
		            cb(c);
		            setCurrent(c,c-n);
		            next.removeEventListener('webkitTransitionEnd',arguments.callee,false);
		            state = false;
		        },false);
		        current.style.cssText += style.pre;
				next.style.cssText += style.on;
			}else{
				current.style.cssText += style.on;
				pre.style.cssText += style.pre;
				state = false;
			}
		}
		c += n;
		c = Math.max(0,Math.min(c,len-1))
		path = false;
		fix = {x:0,y:0}
	}

	// 滑动
	function follow(){
		var pre = steps[c-1],
			next = steps[c+1],
			current = steps[c],
			x={current : 0,next : 0, pre:0},y={current : 0,next : 0, pre:0};

		if(path == 'up'){
			if(!next){
				y.current = Math.max(fix.y,-max);
			}else{
				y.current = fix.y;
			}
			y.next = (y.current + h) + 'px';
			y.current += 'px';
			y.pre = '-'+h+'px';
		}

		if(path == 'down'){
			if(!pre){
				y.current = Math.min(fix.y,max);
			}else{
				y.current = fix.y;
			}
			y.pre = (y.current - h) + 'px';
			y.current += 'px';
			y.next = h+'px';
		  
		}
		if(path == 'left'){
			if(!next){
				x.current = Math.max(fix.x,-max);
			}else{
				x.current = fix.x;
			}
			x.next = (x.current + w) + 'px';
			x.current += 'px';
			x.pre = '-'+w+'px';
		}
		if(path == 'right'){
			if(!pre){
				x.current = Math.min(fix.x,max);
			}else{
				x.current = fix.x;
			}
			x.pre = (x.current - w) + 'px';
			x.current += 'px';
			x.next = w+'px';
		}
		current.style.cssText += ';-webkit-transition-duration:0;-webkit-transform:translate3d('+ x.current +','+ y.current +',0);';
		pre&&(pre.style.cssText += ';-webkit-transition-duration:0;-webkit-transform:translate3d('+x.pre+','+ y.pre +',0);')
		next&&(next.style.cssText += ';-webkit-transition-duration:0;-webkit-transform:translate3d('+x.next+','+ y.next +',0);');
	}

	function setChange(p){
		if(state) return;
		if(p == 'pre'){
			if(direction == 'v'){
				path = 'down';
			}
			if(direction=='h'){
				path = 'right'
			}
		}
		if(p == 'next'){
			if(direction == 'v'){
				path = 'up';
			}
			if(direction=='h'){
				path = 'left'
			}
		}
		change();
	}
	function goPre(){
		setChange('pre')
	}
	function goNext(){
		setChange('next')
	}
	function setIndex(m){
		if(m>=len|| m<0) return;
		var i = 0;
		for(;i<len;i++){
			if(i<m){
				steps[i].style.cssText = style.pre;
			}
		  	if(i>m){
		  		steps[i].style.cssText = style.next;
		  	}
		  	if(i==m){
		  		steps[i].style.cssText = style.on;
		  	}
		}
		setCurrent(m,c)
		c = m;
	}
	function resize(){
		w = box.offsetWidth;
		h = box.offsetHeight;
		setStyle();
		setIndex(c);
	}
	function setCurrent(m,c){
		steps[c]&&steps[c].classList.remove('on');
		steps[m]&&steps[m].classList.add('on');
	}

	function getIndex(){
		return c;
	}
	function init(){
		setStyle();
		setIndex(c);
		setCurrent(c);
		cb(c);
		box.addEventListener('touchstart',handerEvent,false);
		window.addEventListener('resize',resize,false);
	}
	init();
  

	return {
		pre : goPre,
		next : goNext,
		go : setIndex,
		getIndex : getIndex
	}
}