//主文件入口
require(['./EventUtil','./canvas', './MusicVisialer'], function(EventUtil, Canvas, MusicVisualer){
var mainPage = function(){
	var ul = document.querySelector('#music');
	var volume = document.querySelector('#volume');
	var liButton = document.querySelector('#button'); 

	 mainPage.type = 'Column';
	var size = 128;
	var musicCanvas = new Canvas({size: size});
	var musicVisualzer = new MusicVisualer({size: size, visualzer: musicCanvas.drawing});
//利用事件委托，给最上层的ul绑定click事件
EventUtil.addHandler(ul, 'click', function(e){
	var event = EventUtil.getEvent(e);
	var target = EventUtil.getTarget(event);
	var elementSelected = document.querySelectorAll('li.selected');
	if(elementSelected)
	{
		//移除所有li上selected类
		for(var i = 0, len  = elementSelected.length; i < len; i++)
		{
			elementSelected[i].className = "";
			// elementSelected[i].pause();
		}
	}
	target.className = 'selected';//点击以后，目标行颜色改变
	musicVisualzer.play("/media/" + target.title);
});
//为音量键添加change事件
EventUtil.addHandler(volume, 'change', function(e){
	var event = EventUtil.getEvent(e);
	var target = EventUtil.getTarget(event);
	musicVisualzer.controlVolume(event.target.value/event.target.max);
});

//为window对象添加resize响应函数
EventUtil.addHandler(window, 'resize', function(){
	musicCanvas.resize();
})

//给header中的button添加选择属性
EventUtil.addHandler(liButton, 'click', function(e){
	var event = EventUtil.getEvent(e);
	var target = EventUtil.getTarget(event);

	var buttonChild = document.querySelector("button.selected");
	if(buttonChild)
	{
		buttonChild.className = "";
	}	
	event.target.className = "selected";
	 mainPage.type = event.target.getAttribute('data-type');
});
 mainPage();
};


return {mainPage: mainPage};
});
