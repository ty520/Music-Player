
 define(['./createXHR', './canvas'], function(createXHR, Canvas){
 	var MusicVisiualer = function(obj){
	this.count = 0;//存储现播放的音频资源数目

	this.source = null;//存储现播放的bufferSource

	this.analyser = MusicVisiualer.ac.createAnalyser();

	this.sizeFFT = obj.size;


	this.analyser.fftSize = this.sizeFFT *2;//设置FFT值的大小，用于分析音频频域，实时分析得到音频频域的个数为fftSize的一半
	this.gainNode = MusicVisiualer.ac[MusicVisiualer.ac.createGain?"createGain":"createGainNode"]();
	//节点连接
	this.gainNode.connect(MusicVisiualer.ac.destination);
 	this.analyser.connect(this.gainNode);
 	this.xhr =new createXHR();
 	this.analyseFrequency();//持续执行
}
MusicVisiualer.ac =  new (window.AudioContext || window.webkitAudioContext)();

//点击歌曲，利用ajax发起请求，请求同域的歌曲资源文件
MusicVisiualer.prototype.load = function(url, func){
 	this.xhr.abort(); //每次发送请求前，结束上一次请求
	this.xhr.open('GET',url);
	this.xhr.responseType = "arraybuffer";
	var _self = this;
	this.xhr.onload = function(){
		func(_self.xhr.response);
	}
	this.xhr.send(null);
}


MusicVisiualer.prototype.decode = function(arraybuffer, func){
	var _self = this;
		MusicVisiualer.ac.decodeAudioData(arraybuffer, function(buffer){
			func(buffer);
		},function(err){
			console.log(err);
	});
}
//音频播放的方法
MusicVisiualer.prototype.play = function(url){
	var n = ++(this.count);  //定义n查看现在播放的音频数是否与n相等
	if(this.source)
	{
		this.source[this.source.stop? "stop":"noteOff"](0);
	}
	var _self = this;
	this.load(url, function(arraybuffer){
		_self.decode(arraybuffer, function(buffer){
			if(n !== _self.count ) return ;
			var bs = MusicVisiualer.ac.createBufferSource();
			if(n !== _self.count ) return ;
			bs.buffer = buffer;
			bs.connect(_self.analyser);
			bs[bs.start?"start" : "noteOn"](0);
			_self.analyseFrequency();
			_self.source = bs;
		});
	});
}

//根据range控制音量
MusicVisiualer.prototype.controlVolume = function(percent){
	this.gainNode.gain.value = percent *percent;
}
//通过bufferSource分析音频得到频域信息
MusicVisiualer.prototype.analyseFrequency = function(){
	//frequencyBinCount = fftSize/2;
	var array = new Uint8Array(this.analyser.frequencyBinCount);
	requestAnimationFrame = window.requestAnimationFrame||
						   window.webkitrequestAnimationFrame||
						   window.mozrequestAnimationFrame;
	var visualzer = new Canvas();
	var _self = this;
	
	function move(){
		_self.analyser.getByteFrequencyData(array);
		visualzer.drawing(array);
		requestAnimationFrame(move);
	}
	requestAnimationFrame(move);
}
return MusicVisiualer;
 });
