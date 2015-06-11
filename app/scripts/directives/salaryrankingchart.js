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
      scope: {},
      link: function(scope, element, attrs) {
        (function(d3) {

          //var data = [
          //  ['< 2,000'        ,  '40' ],
          //  ['2,000 - 3,999'  ,  '142'],
          //  ['4,000 - 5,999'  ,  '116'],
          //  ['6,000 - 7,999'  ,  '197'],
          //  ['8,000 - 9,999'  ,  '362'],
          //  ['10,000 - 14,999',  '812'],
          //  ['15,000 - 19,999',  '611'],
          //  ['20,000 - 24,999',  '416'],
          //  ['25,000 - 29,999',  '241'],
          //  ['30,000 - 39,999',  '278'],
          //  ['40,000 - 59,999',  '451'],
          //  ['≧ 60,000'       ,  '804']
          //]

          var data = [4, 8, 15, 16, 23, 42];

          var barWidth = 20;
          var width = data.length * barWidth;
          var height = 400;

          var x = d3.scale.linear()
            .domain([0, d3.max(data)])
            .range([height, 0]);

          var chart = d3.select(".chart")
            .attr("width", width)
            .attr("height", height);

          var bar = chart.selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function(d, i) {
              return "translate(" + i * barWidth + ",0)";
            });
            //.attr("transform", function(d, i){
            //  return "rotate(180)";
            //});

          bar.append("rect")
            .attr("height", function(d){
              return height - x(d);
            })
            .attr("y", function(d){
              return x(d);
            })
            .attr("width", barWidth - 1);

          bar.append("text")
            .attr("y", function(d) { return height - (height - x(d)) / 2; })
            .attr("x", barWidth / 2)
            .attr("dx", "0.35em")
            .text(function(d) { return d; });

        })(d3);
      }};
  }]);

