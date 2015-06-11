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

          var data = [
            ['< 2,000'        ,  '40' ],
            ['2,000 - 3,999'  ,  '142'],
            ['4,000 - 5,999'  ,  '116'],
            ['6,000 - 7,999'  ,  '197'],
            ['8,000 - 9,999'  ,  '362'],
            ['10,000 - 14,999',  '812'],
            ['15,000 - 19,999',  '611'],
            ['20,000 - 24,999',  '416'],
            ['25,000 - 29,999',  '241'],
            ['30,000 - 39,999',  '278'],
            ['40,000 - 59,999',  '451'],
            ['≧ 60,000'       ,  '804']
          ];

          var margin = {top: 20, right: 20, bottom: 30, left: 40};
          var actualWidth = document.querySelector('.chart').offsetWidth;
          var actualHeight = document.querySelector('.chart').offsetHeight;
          var width = actualWidth - margin.left - margin.right;
          var height = actualHeight - margin.top - margin.bottom;

          var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

          var y = d3.scale.linear()
            .range([height, 0]);

          var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

          var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10, "%");

          var svg = d3.select(".chart");
          svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          x.domain(data.map(function(d) { return d[0]; }));
          y.domain([0, d3.max(data, function(d) { return +d[1]; })]);

          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

          svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Monthly Income");

          svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d[0]); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return height - y(d[1]); });

          //function type(d) {
          //  d.frequency = +d.frequency;
          //  return d;
          //}

        })(d3);
      }};
  }]);

