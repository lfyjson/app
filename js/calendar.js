define(['method', 'observer'], function (m, Observer) {
	'use strict';

	//日历基类
	var Calendar = function () {};
	Calendar.prototype = {
		constructor: Calendar,
		init: function (param, bFlag) {
			this.pub('initStart'); //发布初始化开始通知

			this.bInitial = bFlag; //是否初次执行
			if(this.bInitial) {
				this.createDOM(); //创建日历DOM
				this.bindEvent(); //事件绑定
			} else {
				this.wrap.style.display = 'block';
			}

			this.param = param;
			this.obj = this.param.obj;
			this.data = this.param.data;

			this.setPosition(); //设置日历位置
			this.initDate();
			this.showDate();
			this.monthChangeLoading(); //月份请求时loading状态
			this.monthChangeHandler(); //月份改变后显示新日期

			this.pub('initEnd'); //发布初始化结束通知
		},
		setPosition: function () {
			var left = m.getLeft(this.obj) + this.obj.offsetWidth,
				top = m.getTop(this.obj);

			this.wrap.style.left = left + 'px';
			this.wrap.style.top = top + 'px';
		},
		initDate: function () { //初始化日期
			var date = this.param.date.split('-');

			this.date = new Date();
			this.date.setFullYear(date[0]);
			this.date.setMonth(date[1] - 1);
			this.date.setDate(date[2]);
		},
		bindEvent: function () {
			var self = this;
			this.prev.onclick = function () {
				self.date.setMonth(self.date.getMonth()-1);
				self.pub('monthChange');
			};
			this.next.onclick = function () {
				self.date.setMonth(self.date.getMonth()+1);
				self.pub('monthChange');
			};

			//隐藏日历
			this.wrap.onclick = function (ev) {
				m.stopPropagation(ev);
			};
			setTimeout(function() {
				m.addEvent(document, 'click', function () {
					self.wrap.style.display = 'none';
				});
			}, 0);

		},
		monthChangeHandler: function () {
			this.sub('monthChangeHandler', function () {
				this.showDate(); //月份改变后显示新日期;
			});
		},
		prevNextEvent: function () {
			var self = this;
			this.prev.onclick = function () {
				self.date.setMonth(self.date.getMonth()-1);
				self.pub('monthChange');
			};
			this.next.onclick = function () {
				self.date.setMonth(self.date.getMonth()+1);
				self.pub('monthChange');
			};
		},
		monthChangeLoading: function () {
			this.loading = m.getByClass(this.wrap, 'calendar-loading')[0];
			this.sub('monthChange', function () {
				this.loading.style.visibility = 'visible';
				this.loading.className += ' loading-show';
			});
			this.sub('setDayEnd', function () {
				this.loading.style.visibility = 'hidden';
				this.loading.className = this.loading.className.replace('loading-show', '');
			});
		},
		getDate: function () {
			this.year = this.date.getFullYear();
			this.month = this.date.getMonth() + 1;
		},
		showDate: function () {
			this.getDate();

			this.title.innerHTML = this.year + '年' + this.month + '月';

			this.td = this.tbody.getElementsByTagName('td');
			this.clearDate();
			this.getDays();
			this.setDay();
		},
		clearDate: function () {
			for(var i = 0; i < this.td.length; i++) {
				this.td[i].innerHTML = '';
				this.td[i].className = 'disable'; 
			}
		},
		setDay: function () { //设置日期
			this.oNowDate = new Date();
			this.oNowDate.setFullYear(this.year);
			this.oNowDate.setMonth(this.month - 1);
			this.oNowDate.setDate(1);

			//设置日期
			for(var i = 0; i < this.iDayAll; i++) {
				var index = i + this.oNowDate.getDay(),
					oTd = this.td[index];
				oTd.innerHTML = i + 1;
				oTd.className = '';

				//设置td的日期对象
				oTd.date = new Date();
				oTd.date.setFullYear(this.year);
				oTd.date.setMonth(this.month);
				oTd.date.setDate(i + 1);

			}
			this.pub('setDayEnd'); //发布设置时期结束通知
		},
		getDays: function () { //获取天数
			var month = this.month,
				bigMonth = [1, 3, 5, 7, 8, 10, 12].join(" "),
				smallMonth = [4, 6, 9, 11].join(" "),
				reg = new RegExp('(^|\\s)' + month + '($|\\s)');

			if(reg.test(bigMonth)) {
				this.iDayAll = 31;
			} else if (reg.test(smallMonth)) {
				this.iDayAll = 30;
			} else if(month === 2 && this.isLeapYear()) {
				this.iDayAll = 29;
			} else {
				this.iDayAll = 28;
			}
		},
		isLeapYear: function () { //闰年判断
			if(this.year % 4 === 0 && this.year % 100 != 0) {
				return true;
			} else if(this.year % 400 === 0) {
				return true;
			} else {
				return false;
			}
		},
		createDOM: function () {
			this.wrap = document.createElement('div');
			this.wrap.className = 'calendar-wrap';
			this.wrap.innerHTML = this.template();

			this.title = m.getByClass(this.wrap, 'calendar-title')[0];
			this.prev = m.getByClass(this.wrap, 'calendar-prev')[0];
			this.next = m.getByClass(this.wrap, 'calendar-next')[0];
			this.tbody = this.wrap.getElementsByTagName('tbody')[0];
			this.createTd();

			document.body.appendChild(this.wrap);
		},
		createTd: function () {
			for(var i = 0; i < 6; i++) {
				var oTr = document.createElement('tr');
				for(var j = 0; j < 7; j++) {
					var oTd = document.createElement('td');
					oTr.appendChild(oTd);
				}
				this.tbody.appendChild(oTr);
			}
		}, 
		template: function () {
			return	[
				'<div class="calendar-header">',
					'<span class="calendar-title">2016年1月</span>',
					'<i class="calendar-prev">&lt;</i>',
					'<i class="calendar-next">&gt;</i>',
				'</div>',
				'<table class="calendar-table">',
					'<thead>',
						'<tr>',
							'<th>日</th>',
							'<th>一</th>',
							'<th>二</th>',
							'<th>三</th>',
							'<th>四</th>',
							'<th>五</th>',
							'<th>六</th>',
						'</tr>',
					'</thead>',
					'<tbody>',
					'</tbody>',
				'</table>',
				'<div class="calendar-loading"></div>',
			].join("");
		}
	}
	//增加观察者模式功能
	m.extend(Calendar.prototype, new Observer()); 

	return Calendar;
});


