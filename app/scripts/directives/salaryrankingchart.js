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

        var chartQueryString = 'svg.chart#salary-chart';

        var margin = {top: 10, right: 10, bottom: 10, left: 10};
        // Firefox has problem with .offsetWidth sometimes.. Use jquery one instead
        // Ref:
        //     http://stackoverflow.com/questions/15931374/firefox-offsetwidth-not-reporting-anything
        //var actualWidth = document.querySelector('.chart').offsetWidth;
        var actualWidth = $(chartQueryString).width();
        //var actualHeight = document.querySelector('.chart').offsetHeight;
        var actualHeight = $(chartQueryString).height();
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

        var genderToName = {
          'male': '男性',
          'female': '女性',
          'both': '人',
        };

        // The outer framework
        var svg = d3.select(chartQueryString);
        //svg.selectAll("g").remove();
        //svg.selectAll("rect").remove();
        //svg.selectAll("text").remove();
        svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
          return number;
        };

        var ratioToMessage = function(ratio){
          var messages = [
            'Nothing here!', // Number 0 does not exist. Start from 1.
            '赶紧申请廉租屋',
            '基本上就是月光了……',
            '廉租房申不到，商品房买不起',
            '周末看电影，可以选3D的看……',
            '想买iPhone？吃一个月方便面就存够钱了……吧',
            '偶尔上班还能打的，也是挺爽的',
            '放假想去旅行？美洲、欧洲随意选！',
            '走上人生巅峰，想想还有点小激动呢'
          ];
          return messages[ratioToNumber(ratio)];
        };

        var render = function(d3) {
          var apiUrl = apiPrefix + '/census2011/areas/' + scope.area + '/' + scope.gender + '/data.csv';
          d3.csv(apiUrl,
            function(d){
              svg.selectAll("g").remove();
              svg.selectAll("rect").remove();
              svg.selectAll("text").remove();
              svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              var data = d.map(function(x){
                return [x.row, x.value];
              });

              var ranking = calculateRanking(d, scope.salary, salaryRangeMapping);
              var percentage = Math.floor(ranking.ratio * 100) + '%';

              var divMessageNumber = d3.select('.message-number');
              divMessageNumber.selectAll('div').remove();
              divMessageNumber.append('div')
                .text(percentage)
                .attr('class', 'message-number');

              var divMessageBack = d3.select('.message-back');
              divMessageBack.selectAll('div').remove();
              divMessageBack.append('div')
                .text('的' + genderToName[scope.gender])
                .attr('class', 'message-back');

              var descriptionDiv = d3.select('.description');
              descriptionDiv.selectAll('div').remove();

              var iconDiv = d3.select('.icon');
              iconDiv.selectAll('div').remove();

              var ratioNumber = ratioToNumber(ranking.ratio);
              var ratioMessage = ratioToMessage(ranking.ratio);
              descriptionDiv.append('div')
                .text(ratioMessage);

              iconDiv.selectAll('img').style('visibility', 'hidden');
              iconDiv.select('.icon-' + ratioNumber).style('visibility', 'visible');

              x.domain(data.map(function(d) { return d[0]; }));
              y.domain([0, 1.2 * d3.max(data, function(d) { return +d[1]; })]);

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

        };

        scope.$watch('area', function(){render(d3);});
        scope.$watch('gender', function(){render(d3);});
        scope.$watch('salary', function(){render(d3);});
      }};
  }]);

