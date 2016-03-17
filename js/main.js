define(['method', 'calendar-class', 'json2'], function(m, ClassCalendar) {

    var classHandler = {
        obj: null,
        createClassCalendar: function(param) {
            classHandler.btnStopPropagation(param.obj); //按钮阻止冒泡

            if (classHandler.obj) {
                classHandler.obj.init(param);
            } else {
                classHandler.obj = new ClassCalendar();
                classHandler.obj.init(param, true);
            }classHandler.obj
            return classHandler.obj;
        },
        btnStopPropagation: function(obj) {
            if (!obj.stopPropagation) {
                m.addEvent(obj, 'click', function(ev) {
                    m.stopPropagation(ev);
                });
                obj.stopPropagation = true;
            }
        }
    }

    return  {
        createClassCalendar: classHandler.createClassCalendar,
        m: m
    }
});
