define(function () {
	'use strict';

	//Object.create兼容
	if(typeof Object.create != 'function') {
		Object.create = function (obj) {
			var F = function () {};
			F.prototype = obj;
			return new F();
		};
	}

	return {
		getByClass: function(oParent, sClass) {
		    if (oParent.querySelectorAll) {
		        return oParent.querySelectorAll('.' + sClass);
		    } else {
		        var aEle = oParent.getElementsByTagName('*'),
		            aResults = [],
		            reg = new RegExp("(^|\\s)" + sClass + "(\\s|$)");

		        for (var i = 0; i < aEle.length; i++) {
		            if (reg.test(aEle[i].className)) {
		                aResults.push(aEle[i]);
		            }
		        }
		        return aResults;
		    }
		},
		addEvent: function(obj, type, fn) {
		    if (obj.addEventListener) {
		        obj.addEventListener(type, fn, false);
		    } else {
		        obj.attachEvent('on' + type, function () {
		            fn.call(this);
		        });
		    }
		},
		getTop: function(e) {
		    var offset = e.offsetTop;
		    if (e.offsetParent != null) offset += this.getTop(e.offsetParent);
		    return offset;
		},
		getLeft: function(e) {
		    var offset = e.offsetLeft;
		    if (e.offsetParent != null) offset += this.getLeft(e.offsetParent);
		    return offset;
		},
		stopPropagation: function (ev) {
			var oEvent = ev || window.event;
			if(oEvent.stopPropagation) {
				oEvent.stopPropagation();
			} else {
				oEvent.cancelBubble = true;
			}
		},
		ajax: function(param) {
			var xhr = null;

		    param.beforeSend && param.beforeSend();

		    try {
		    	xhr = new XMLHttpRequest();
		    } catch(e) {
		    	xhr = new ActiveXObject('Microsoft.XMLHTTP');
		    }

		    if (param.type != 'post') {
		        param.type = 'get';
		        if (param.data) {
		            param.url += '?' + param.data;
		        }
		    }

		    xhr.open(param.type, param.url, true);
		    if (param.type == 'get') {
		        xhr.send();
		    } else {
		        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
		        xhr.send(param.data);
		    }

		    xhr.onreadystatechange = function() {
		        if (xhr.readyState == 4) {
		            if (xhr.status == 200) {
		                param.success && param.success(xhr.responseText);
		            } else {
		                param.error && param.error(xhr.status);
		            }
		        }
		    }
		},
		extend: function (obj1, obj2) {
			for(var prop in obj2) {
				obj1[prop] = obj2[prop];
			}
			return obj1;
		}
	}
});