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
      link: function(scope, element, attrs) {
        var render = function(d3) {
          //console.log(scope);

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
          //svg.selectAll("g").remove();
          svg.selectAll("rect").remove();
          svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var api_url = 'http://salary360.initiumdata.com/api/census2011/areas/'
            + scope.area + '/' + scope.gender + '/data.csv';

          d3.csv(api_url,
            function(d){
              //window.d = d;
              //console.log('data:');
              //console.log(d);
              var data = d.map(function(x){
                return [x.row, x.value]
              });

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


              var updates = svg.selectAll(".bar").data(data);
              updates.exit().remove();
              updates.enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d[0]); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return height - y(d[1]); });
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

