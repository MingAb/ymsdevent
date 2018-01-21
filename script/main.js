$(document).ready(()=>{
   var date = new Date();
   var offset = date.getTimezoneOffset();
   var data = timeline.data;

   var newChart = {};
   for(var i = 0; i < data.length; i++){
      var eve = data[i];
      if(!newChart[eve.day + "_" + eve.time]){
         newChart[eve.day + "_" + eve.time] = [];
      }
      newChart[eve.day + "_" + eve.time].push(eve);
   }

   var timeOffset = (offset / 60);
   var eventOffset = Math.floor(Math.abs(timeOffset / 4)) * (timeOffset < 0 ? -1 : 1);
   var remain = Math.abs(timeOffset) % 4;

   var trueChart = {};
   for(var _day = 0; _day < 7; _day++){
      for(var _time = 0; _time < 6; _time++){
         var day = _day;
         var time = _time + eventOffset;
         if(time >= 6){
            time -= 6;
            day++;
         }else if(time < 0){
            time += 6;
            day--;
         }

         if(day < 0){
            day += 7;
         }else if(day >= 7){
            day -= 7;
         }
         trueChart[_day + "_" + _time] = newChart[day + "_" + time];
      }
   }

   // 填充表格
   var timeRow = $('tr[id=time]');
   timeRow.html(timeRow.html() + '<td></td>');
   for(var i = 0; i < 6; i++){
      var from = (i * 4 + remain + 24) % 24;
      var to = ((i + 1) * 4 + remain) % 24;
      var fromStr = (from < 10 ? '0' : '') + from + ":" + "00";
      var toStr = (to < 10 ? '0' : '') + to + ":" + "00";
      timeRow.html(timeRow.html() + '<td>' + fromStr + '</td>');
   }

   var dataChart = $('tbody');
   var currentDay = (date.getDay() - 1 < 0 ? 6 : date.getDay() - 1);
   var currentHour = date.getHours();
   for(var _day = 0; _day < 7; _day++){
      dataChart.html(dataChart.html() + '<tr id="day' + _day + '"></tr>');
      var dayStr = '';
      switch (_day) {
         case 0:
            dayStr = '一';
            break;
         case 1:
            dayStr = '二';
            break;
         case 2:
            dayStr = '三';
            break;
         case 3:
            dayStr = '四';
            break;
         case 4:
            dayStr = '五';
            break;
         case 5:
            dayStr = '六';
            break;
         case 6:
            dayStr = '日';
            break;
      }
      var curRow = $('tr[id=day' + _day + ']');
      curRow.html(curRow.html() + '<td>' + dayStr + '</td>');
      for(var _time = 0; _time < 6; _time++){
         var eve = trueChart[_day + '_' + _time][0];
         var testDay = currentDay;
         var _testTime = (currentHour - eventOffset);
         if(_testTime < 0){
            _testTime += 24;
            testDay--;
            if(testDay < 0){
               testDay += 7;
            }
         }

         var eventStr = '';
         switch (eve.event) {
            case 'wish':
               eventStr = '许愿';
               break;
            case 'recruit':
               eventStr = '招募';
               break;
            case 'power':
               eventStr = '实力';
               break;
            case 'research':
               eventStr = '研究';
               break;
            case 'build':
               eventStr = '建造';
               break;
            case 'brutal':
               eventStr = '原始';
               break;
            case 'clean':
               eventStr = '扫除';
               break;
            case 'wolf':
               eventStr = '杀狼';
               break;
            case 'rune':
               eventStr = '符文';
               break;
         }

         if(trueChart[_day + '_' + _time].length > 1){
            eventStr = '<div id="tiger">剑齿虎</div>' + eventStr;
         }

         var testTime = Math.ceil(_testTime / 4) - 1;
         var isNow = (testDay == _day && testTime == _time);
         var cls = eve.event + (eve.length > 1 ? ' tiger' : '') + (trueChart[_day + '_' + _time].length > 1 ? ' tiger' : '') + (isNow ? ' now' : '');
         curRow.html(curRow.html() + '<td ' + 'class="' + cls + '" id="day' + _day + '_time' + _time + '">' + eventStr + '</td>');
      }
   }

   $('td').click(function(){
      $(this).removeClass('now');
   })
});
