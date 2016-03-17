define(['method', 'calendar'], function (m, Calendar) {
	'use strict';

	//课程定制日历
	var ClassCalendar = function () {
		Calendar.call(this);
		this.sub('initStart', this.initStartHandler);
		this.sub('initEnd', this.initEndHandler);
	}
	ClassCalendar.PROTOTYPE = {
		constructor: ClassCalendar,
		initStartHandler: function () { //初始化开始
			this.setDayState();
		},
		initEndHandler: function () { //初始化结束
			if(this.bInitial) { //初次执行
				this.tdClickHandler(); //td点击事件
			}
		},
		monthChangeHandler: function () {}, //月份改变后不作处理
		tdClickHandler: function () {
			var self = this;
			m.addEvent(this.tbody, 'click', function (ev) {
				var oEvent = ev || window.event,
					target = oEvent.target || oEvent.srcElement;

				if(target.nodeName.toLowerCase() === 'td' && target.className.indexOf('disable') === -1) {
					for(var i = 0; i < self.iDayAll; i++) {
						var index = i + self.oNowDate.getDay(),
							oTd = self.td[index];
						oTd.className = oTd.className.replace('active', '')
					}
					target.className += ' active';
					self.pub('tdClick', target);
				}
			});
		},
		setDayState: function () { //设置日期数据状态
			this.sub('setDayEnd', function () {

				for(var i = 0; i < this.iDayAll; i++) {
					var index = i + this.oNowDate.getDay(),
						oTd = this.td[index];

					oTd.removeAttribute('code');
					//有数据时设置数据	
					if(this.data[i] && this.data[i].length != 0) {
						oTd.className = 'haveData';
						oTd.setAttribute('code', this.data[i]);
					}
				}
			});
		}
	};
	//继承Calendar类
	ClassCalendar.prototype = m.extend(Object.create(Calendar.prototype), ClassCalendar.PROTOTYPE);

	return ClassCalendar;
});