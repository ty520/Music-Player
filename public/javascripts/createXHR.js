//定义Ajax创建函数,其中采用惰性函数，函数执行时，函数被覆盖为一个合适的函数执行
define(function(){
	var createXHR = function(){
	if(typeof XMLHttpRequest !== 'undefined'){
		createXHR = function(){
			return new XMLHttpRequest();
		};
	}else if(typeof ActiveXObject !== 'undefined'){
		createXHR = function(){
			if(arguments.callee.activeXString !== 'String'){
			var versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'];
			var i , 
				len;
			for(i = 0, len = versions.length; i < len; i++)
			{
				try{
					new ActiveXObject(versions[i]);
					arguments.callee.activeXString = versions[i];
					break;
				}catch(e){
					//跳过
				}
			}
		}
			return new ActiveXObject(arguments.callee.activeXString);
		};
	}else{
		createXHR = function(){
			throw new Error('No XHR object available');
		};
	}
	return createXHR();
}
return createXHR;
})
