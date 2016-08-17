define("EventUtil.js", [], function() {
	var t = function(t, e, n) {
			t.addEventListener ? t.addEventListener(e, n, !1) : t.attachEvent ? t.attachEvent("on" + e, n) : t["on" + e] = n
		},
		e = function(t) {
			return t ? t : window.event
		},
		n = function(t) {
			return t.target || t.srcElement
		};
	return {
		addHandler: t,
		getEvent: e,
		getTarget: n
	}
}), define("canvas.js", [], function() {
	var t = document.querySelector(".right"),
		e = document.createElement("canvas");
	t.appendChild(e);
	var n = e.getContext("2d"),
		i = function() {
			this.height = 0, this.width = 0, this.Dots = [], this.sizeFFT = 128, this.gradient = null, this.type = "Column", this.resize()
		};
	return i.prototype.getRandom = function(t, e) {
		return Math.round(Math.random() * (e - t) + t)
	}, i.prototype.getDots = function() {
		this.Dots = [];
		for (var t = 0; t < this.sizeFFT; t++) {
			var e = this.getRandom(0, this.width),
				n = this.getRandom(0, this.height),
				i = (this.getRandom(0, this.height), "rgba(" + this.getRandom(0, 255) + ", " + this.getRandom(0, 255) + "," + this.getRandom(0, 255) + ",0)");
			this.Dots.push({
				x: e,
				y: n,
				dx: this.getRandom(1, 4),
				color: i,
				cap: 0
			})
		}
	}, i.prototype.getType = function() {
		var t = document.querySelector("#button button.selected");
		return t ? t.getAttribute("data-type") : null
	}, i.prototype.resize = function() {
		this.height = t.clientHeight, this.width = t.clientWidth, e.width = this.width, e.height = this.height, this.getDots(), this.gradient = n.createLinearGradient(0, 0, this.width, this.height), this.gradient.addColorStop(0, "red"), this.gradient.addColorStop(.5, "yellow"), this.gradient.addColorStop(1, "green")
	}, i.prototype.drawing = function(t) {
		n.clearRect(0, 0, this.width, this.height);
		var e = this.width / this.sizeFFT,
			i = .6 * e;
		this.type = this.getType() || "Column";
		for (var a = 0; a < this.sizeFFT; a++) {
			var r = this.Dots[a];
			if ("Column" === this.type) {
				n.fillStyle = this.gradient;
				var o = t[a] / (3 * this.sizeFFT) * this.height;
				n.fillRect(e * a, this.height - o, i, o), n.fillRect(e * a, this.height - i - r.cap, i, i), r.cap -= 4, r.cap < 0 && (r.cap = 0), o > 0 && r.cap < o + 40 && (r.cap = o + 40 > this.height - i ? this.height - i : o + 40)
			} else if ("Dot" === this.type) {
				n.beginPath();
				var s = t[a] / (3 * this.sizeFFT) * 50;
				r.x += r.dx, r.x = r.x > this.width ? 0 : r.x, n.arc(r.x, r.y, s, 0, 2 * Math.PI, !1);
				var c = n.createRadialGradient(r.x, r.y, 0, r.x, r.y, s);
				c.addColorStop(0, "#ffffff"), c.addColorStop(1, r.color), n.fillStyle = c, n.fill()
			}
		}
	}, i
}), define("createXHR.js", [], function() {
	var t = function() {
		return (t = "undefined" != typeof XMLHttpRequest ? function() {
			return new XMLHttpRequest
		} : "undefined" != typeof ActiveXObject ? function() {
			if ("String" !== arguments.callee.activeXString) {
				var t, e, n = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
				for (t = 0, e = n.length; e > t; t++) try {
					new ActiveXObject(n[t]), arguments.callee.activeXString = n[t];
					break
				} catch (i) {}
			}
			return new ActiveXObject(arguments.callee.activeXString)
		} : function() {
			throw new Error("No XHR object available")
		})()
	};
	return t
}), define("MusicVisialer.js", ["./createXHR", "./canvas"], function(t, e) {
	var n = function(e) {
		this.count = 0, this.source = null, this.analyser = n.ac.createAnalyser(), this.sizeFFT = e.size, this.analyser.fftSize = 2 * this.sizeFFT, this.gainNode = n.ac[n.ac.createGain ? "createGain" : "createGainNode"](), this.gainNode.connect(n.ac.destination), this.analyser.connect(this.gainNode), this.xhr = new t, this.analyseFrequency()
	};
	return n.ac = new(window.AudioContext || window.webkitAudioContext), n.prototype.load = function(t, e) {
		this.xhr.abort(), this.xhr.open("GET", t), this.xhr.responseType = "arraybuffer";
		var n = this;
		this.xhr.onload = function() {
			e(n.xhr.response)
		}, this.xhr.send(null)
	}, n.prototype.decode = function(t, e) {
		n.ac.decodeAudioData(t, function(t) {
			e(t)
		}, function(t) {
			console.log(t)
		})
	}, n.prototype.play = function(t) {
		var e = ++this.count;
		this.source && this.source[this.source.stop ? "stop" : "noteOff"](0);
		var i = this;
		this.load(t, function(t) {
			i.decode(t, function(t) {
				if (e === i.count) {
					var a = n.ac.createBufferSource();
					e === i.count && (a.buffer = t, a.connect(i.analyser), a[a.start ? "start" : "noteOn"](0), i.analyseFrequency(), i.source = a)
				}
			})
		})
	}, n.prototype.controlVolume = function(t) {
		this.gainNode.gain.value = t * t
	}, n.prototype.analyseFrequency = function() {
		function t() {
			a.analyser.getByteFrequencyData(n), i.drawing(n), requestAnimationFrame(t)
		}
		var n = new Uint8Array(this.analyser.frequencyBinCount);
		requestAnimationFrame = window.requestAnimationFrame || window.webkitrequestAnimationFrame || window.mozrequestAnimationFrame;
		var i = new e,
			a = this;
		requestAnimationFrame(t)
	}, n
}), require(["./EventUtil", "./canvas", "./MusicVisialer"], function(t, e, n) {
	var i = function() {
		var a = document.querySelector("#music"),
			r = document.querySelector("#volume"),
			o = document.querySelector("#button");
		i.type = "Column";
		var s = 128,
			c = new e,
			u = new n({
				size: s
			});
		t.addHandler(a, "click", function(e) {
			var n = t.getEvent(e),
				i = t.getTarget(n),
				a = document.querySelectorAll("li.selected");
			if (a)
				for (var r = 0, o = a.length; o > r; r++) a[r].className = "";
			i.className = "selected", u.play("/media/" + i.title)
		}), t.addHandler(r, "change", function(e) {
			var n = t.getEvent(e);
			t.getTarget(n);
			u.controlVolume(n.target.value / n.target.max)
		}), t.addHandler(window, "resize", function() {
			c.resize()
		}), t.addHandler(o, "click", function(e) {
			var n = t.getEvent(e),
				i = (t.getTarget(n), document.querySelector("button.selected"));
			i && (i.className = ""), n.target.className = "selected"
		})
	};
	i()
}), define("index.js", function() {}), require(["./EventUtil", "./canvas", "./MusicVisialer"], function(t, e, n) {
	var i = function() {
		var a = document.querySelector("#music"),
			r = document.querySelector("#volume"),
			o = document.querySelector("#button");
		i.type = "Column";
		var s = 128,
			c = new e({
				size: s
			}),
			u = new n({
				size: s,
				visualzer: c.drawing
			});
		t.addHandler(a, "click", function(e) {
			var n = t.getEvent(e),
				i = t.getTarget(n),
				a = document.querySelectorAll("li.selected");
			if (a)
				for (var r = 0, o = a.length; o > r; r++) a[r].className = "";
			i.className = "selected", u.play("/media/" + i.title)
		}), t.addHandler(r, "change", function(e) {
			var n = t.getEvent(e);
			t.getTarget(n);
			u.controlVolume(n.target.value / n.target.max)
		}), t.addHandler(window, "resize", function() {
			c.resize()
		}), t.addHandler(o, "click", function(e) {
			var n = t.getEvent(e),
				a = (t.getTarget(n), document.querySelector("button.selected"));
			a && (a.className = ""), n.target.className = "selected", i.type = n.target.getAttribute("data-type")
		}), i()
	};
	return {
		mainPage: i
	}
}), define("addHander.js", function() {});