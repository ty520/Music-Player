define(function(){
	var box = document.querySelector('.right');
	var canvas = document.createElement('canvas');
	box.appendChild(canvas);
	var ctx = canvas.getContext('2d');
var Canvas = function(){
	this.height = 0;
	this.width = 0;
	this.Dots = [];
	this.sizeFFT = 128;
	this.gradient = null;
	this.type = 'Column';
	this.resize();  //每次实例化时要执行其resize函数
}
//利用canvas画矩形图和原点

//产生（m~n）的随机数
Canvas.prototype.getRandom = function(m, n){
	return Math.round(Math.random()*(n-m) +m);
}
//根据采样频域值绘制矩形和原点
Canvas.prototype.getDots = function(){
	this.Dots = [];
	for(var z = 0; z < this.sizeFFT ; z++) //每次加载歌曲都需重新获取各点的位置和颜色信息
	{
		var xDot = this.getRandom(0, this.width);
		var yDot = this.getRandom(0, this.height);
		var capDot = this.getRandom(0, this.height);
		var colorDot = "rgba("+this.getRandom(0, 255)+", "+this.getRandom(0, 255)+","+this.getRandom(0, 255)+","+"0)";
		this.Dots.push({
			x: xDot,
			y: yDot,
			dx:this.getRandom(1, 4),
			color: colorDot,
			cap: 0
		});
	}

}

//检测选择的展示形式：圆点或者柱状
Canvas.prototype.getType = function(){
	var buttons = document.querySelector('#button button.selected');
	if(buttons)
	{
		return buttons.getAttribute('data-type')
	}
	return  null;
}
Canvas.prototype.resize = function(){
	this.height = box.clientHeight;
	this.width = box.clientWidth;
	canvas.width = this.width;
	canvas.height = this.height;
	this.getDots(); //获取随机的圆点位置信息以及颜色信息
	
 //设置默认状态下为柱状图
    this.gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
	this.gradient.addColorStop(0, "red");
	this.gradient.addColorStop(0.5, "yellow");
	this.gradient.addColorStop(1, "green");
}
 
Canvas.prototype.drawing = function(arr){
 		ctx.clearRect(0, 0, this.width, this.height);
 		var rectWidth = this.width / this.sizeFFT;
 		var cw = rectWidth * 0.6;
 		this.type = this.getType() || 'Column';
 		for(var j = 0; j < this.sizeFFT; j++)
 		{
 			var o = this.Dots[j];
 			if(this.type === 'Column')
 		{
 			ctx.fillStyle = this.gradient;
 			var rectHeight = arr[j] / (3 * this.sizeFFT) * this.height;
 			//绘制渐变矩形
 			ctx.fillRect(rectWidth * j, this.height - rectHeight, cw, rectHeight);
 			ctx.fillRect(rectWidth * j, this.height -cw- o.cap , cw , cw);
 			o.cap -=4;
 			if(o.cap < 0)
 			{
 				o.cap = 0;
 			}
 			if( (rectHeight > 0) &&(o.cap < rectHeight + 40))
 			{
 				o.cap = (rectHeight + 40) >(this.height  - cw)? (this.height - cw ):(rectHeight + 40) ;
 			}
 		}else if(this.type === 'Dot'){
 			ctx.beginPath();
 			var radius = arr[j] / (3 * this.sizeFFT) * 50;
 			o.x += o.dx;
 			o.x = (o.x > this.width)? 0 :o.x;
 			ctx.arc(o.x, o.y, radius, 0 , 2 *Math.PI, false);
 			var radialGradient = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, radius);
 			radialGradient.addColorStop(0, "#ffffff");
 			radialGradient.addColorStop(1, o.color);
 			ctx.fillStyle = radialGradient;
 			ctx.fill();
 		}
 	}		
};
	return Canvas;
})

