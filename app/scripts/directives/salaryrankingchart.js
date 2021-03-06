'use strict';

/**
 * @ngdoc directive
 * @name salary360initiumdatacomApp.directive:salaryRankingChart
 * @description
 * # salaryRankingChart
 */

// Structure adapted from:
// http://www.robinwieruch.de/d3-on-angular-seed/
//
// However, there is problem double loading D3.
// We don't use d3Service provided in that article.
// Instead we invoke d3 from the window domain.


angular.module('salary360initiumdatacomApp')
  .directive('salaryRankingChart', [function() {
    return {
      restrict: 'EA',
      scope: {
        'area': '@',
        'gender': '@',
        'salary': '@'
      },
      //link: function(scope, element, attrs) {
      link: function(scope) {

        var salaryRangeMapping = [
          [
            -1,
            '< 2000',
            'a78_<',
            '78'
          ],
          [
            2000,
            '2000 - 3999',
            'a80_2000',
            '80'
          ],
          [
            4000,
            '4000 - 5999',
            'a82_4000',
            '82'
          ],
          [
            6000,
            '6000 - 7999',
            'a84_6000',
            '84'
          ],
          [
            8000,
            '8000 - 9999',
            'a86_8000',
            '86'
          ],
          [
            10000,
            '10000 - 14999',
            'a88_10000',
            '88'
          ],
          [
            15000,
            '15000 - 19999',
            'a90_15000',
            '90'
          ],
          [
            20000,
            '20000 - 24999',
            'a92_20000',
            '92'
          ],
          [
            25000,
            '25000 - 29999',
            'a94_25000',
            '94'
          ],
          [
            30000,
            '30000 - 39999',
            'a96_30000',
            '96'
          ],
          [
            40000,
            '40000 - 59999',
            'a98_40000',
            '98'
          ],
          [
            60000,
            '>= 60000',
            'a100_>=',
            '100'
          ]
        ];

        var calculateRanking = function(areaProfile, salary, salaryRangeMapping){
          var cummulative = 0.0;
          var total = 0.0;
          var binID = 0;
          var binName = areaProfile[0].row;
          for (var i = 1; i < salaryRangeMapping.length; i++) {
            var value = parseInt(areaProfile[i - 1].value);
            total += value;
            if (salaryRangeMapping[i][0] <= salary) {
              cummulative += value;
              binID = i;
              binName = areaProfile[i].row;
            }
          }
          return {
            binID: binID,
            binName: binName,
            cummulative: cummulative,
            total: total,
            ratio: cummulative / total
          };
        };

        var render = function(d3) {
          //console.log(scope);

          var margin = {top: 10, right: 10, bottom: 10, left: 10};
          // Firefox has problem with .offsetWidth sometimes.. Use jquery one instead
          // Ref:
          //     http://stackoverflow.com/questions/15931374/firefox-offsetwidth-not-reporting-anything
          //var actualWidth = document.querySelector('.chart').offsetWidth;
          var actualWidth = $('.chart').width();
          //var actualHeight = document.querySelector('.chart').offsetHeight;
          var actualHeight = $('.chart').height();
          var width = actualWidth - margin.left - margin.right;
          var height = actualHeight - margin.top - margin.bottom;


          var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0.1);

          var y = d3.scale.linear()
            .range([height, 0]);


          var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

          var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10, "%");

          var apiPrefix = 'api';
          var apiUrl = apiPrefix + '/census2011/areas/' +
            scope.area + '/' + scope.gender + '/data.csv';

          d3.csv(apiUrl,
            function(d){
              var svg = d3.select(".chart");
              svg.selectAll("g").remove();
              svg.selectAll("rect").remove();
              svg.selectAll("text").remove();
              svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              //window.d = d;
              //console.log('data:');
              //console.log(d);
              var data = d.map(function(x){
                return [x.row, x.value];
              });

              var ranking = calculateRanking(d, scope.salary, salaryRangeMapping);
              //console.log(ranking);
              //document.querySelector('.message').appendChild()

              var divMessageNumber = d3.select('.message-number');
              divMessageNumber.selectAll('div').remove();

              var divMessageBack = d3.select('.message-back');
              divMessageBack.selectAll('div').remove();

              var descriptionDiv = d3.select('.description');
              descriptionDiv.selectAll('div').remove();

              var iconDiv = d3.select('.icon');
              iconDiv.selectAll('div').remove();

              var genderToName = {
                'male': '男性',
                'female': '女性',
                'both': '人',
              };

              var percentage = Math.floor(ranking.ratio * 100) + '%';

              divMessageNumber.append('div')
             //   .text('您的月收入擊敗了該區' + Math.floor(ranking.ratio * 100) + '% 的' + genderToName[scope.gender])
                .text(percentage)
                .attr('class', 'message-number');

              divMessageBack.append('div')
                .text('的' + genderToName[scope.gender])
                .attr('class', 'message-back');



              var ratioToNumber = function(ratio){
                // Defensive assignment
                var number = 0;
                if ( ratio <= 0.25 ) {
                  number = 1;
                }
                if ( (0.25 < ratio) && (ratio <= 0.85) ) {
                  number = Math.floor((ratio - 0.15) / 0.1) + 1;
                }
                if ( ratio > 0.85 ) {
                  number = 8;
                }
                return number
              };

              var number = ratioToNumber(ranking.ratio);

              var messages = [
                'Nothing here!', // Number 0 does not exist. Start from 1.
                '快D到房屋署申請公屋，加油！捱多幾年就上樓！',
                '呢個月係咪又無畀家用呢？',
                '公屋無你份，居屋抽唔到，私樓又租唔起',
                '週末睇戲可以揀3D',
                '諗住買名牌手袋？食成個月菠蘿包就得嘅...應該',
                '間中可以搭的士返工，係爽嘅',
                '放假想去旅行？關島、加州任你揀！',
                '都人上人啦，你仲想點呀？',
              ];

              descriptionDiv.append('div')
                .text(messages[number]);

              iconDiv.selectAll('img').style('visibility', 'hidden');
              iconDiv.select('.icon-' + number).style('visibility', 'visible');
                //.append('div')
                //.html('<img src="images/icon' + number + '.png">')
                //.attr('class', 'icon');


              //Social Functions

              ////TODO: ONLINE
              ////      Change to the deployment server address
              //var shareURLSina = 'http://v.t.sina.com.cn/share/share.php?title=我的收入擊敗了'
              //  + percentage
              //  + '的香港'
              //  + genderToName[scope.gender]
              //  + '，快來試試你的吧&amp;url=http://192.168.1.6/salary360/';
              //d3.select('.social .weibo a').attr('href', shareURLSina);
              //
              //var description = encodeURIComponent('我的收入擊敗了' + percentage + '的香港' + genderToName[scope.gender] + '，快來試試你的吧');
              //var url = encodeURIComponent('http://bc3f09dc.ngrok.io');
              //var title = document.getElementsByTagName('h1')[0].innerText;
              //
              //var shareURLFacebook = 'https://www.facebook.com/dialog/feed?app_id=1651657371748354' +
              //  '&link=' + url +
              //  '&name=' + title +
              //  '&description=' + description +
              //  '&redirect_uri=' + url;
              //d3.select('.social .facebook a').attr('href', shareURLFacebook);

              //ranking['ratio']

              x.domain(data.map(function(d) { return d[0]; }));
              y.domain([0, 1.2 * d3.max(data, function(d) { return +d[1]; })]);


              //svg.append("g")
              //  .attr("class", "x axis")
              //  .attr("transform", "translate(0," + height + ")")
              //  .call(xAxis);

              ////svg.append("g")
              //svg
              //  //.attr("class", "y axis")
              //  //.call(yAxis)
              //  .append("text")
              //  .attr("y", 0)
              //  .attr("x", 0)
              //  .attr("dx", "7em")
              //  .attr("dy", "1em")
              //  //.attr("transform", "rotate(-15)")
              //  //.attr("dy", ".71em")
              //  //.style("text-anchor", "end")
              //  .text("該區月收入分佈")
              //  .attr('class', 'figure-title');

              var updates = svg.selectAll(".bar").data(data);
              updates.exit().remove();
              updates.enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d[0]); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return height - y(d[1]); });
              //window.u = updates;
              d3.selectAll(".bar").filter(function(d){
                //console.log("once");
                //console.log(d);
                //console.log(ranking);
                return d[0] === ranking.binName;
              }).attr("class", "bar highlight");

              var tagX = x(data[ranking.binID][0]);
              var tagY = y(data[ranking.binID][1]);
              console.log(tagX);
              console.log(tagY);
              svg.append("text")
                .attr("x", tagX)
                .attr("y", tagY)
                .attr("dy", "-0.5em")
                .attr("dx", "0.2em")
                .text("You")
                .attr("class", "text highlight");
            });

          //function type(d) {
          //  d.frequency = +d.frequency;
          //  return d;
          //}
        };

        scope.$watch('area', function(){render(d3);});
        scope.$watch('gender', function(){render(d3);});
        scope.$watch('salary', function(){render(d3);});
      }};
  }]);

