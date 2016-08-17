//通用添加事件，获取事件，获取target的函数，兼容各种浏览器
define(function(){
	var addHandler = function(element, type, handler){
		if(element.addEventListener)
		{
			 element.addEventListener(type, handler, false);
		}else if(element.attachEvent){
			 element.attachEvent('on'+type, handler);
		}else{
			element['on' + type] = handler;	
		}
	}
	var getEvent = function(event){
		return event?event :window.event;
	}
	var getTarget = function(event){
		return event.target||event.srcElement;
	}
	return {
		addHandler: addHandler,
		getEvent: getEvent,
		getTarget: getTarget
	}

})
	