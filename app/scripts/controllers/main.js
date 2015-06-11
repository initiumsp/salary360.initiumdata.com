'use strict';

/**
 * @ngdoc function
 * @name salary360initiumdatacomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the salary360initiumdatacomApp
 */
angular.module('salary360initiumdatacomApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.input = {
      region: 'hk',
      district: 'a',
      area: 'a01',
      gender: 'both',
      salary: 11555
    };

    $scope.options = {
      region: ['hk', 'kl', 'nt'],
      district: ['a', 'b', 'c'],
      area: ['a01', 'b02', 'c03'],
      gender: ['male', 'female', 'both']
    };

    $http.get('http://salary360.initiumdata.com/api/census2011/geo/geo-tree.json')
      .success(function(d){
        $scope.geoTree = d;
      });

    $scope.getDistrictByRegion = function(){
      $scope.options.district = _.map($scope.geoTree[$scope.input.region], function(value, key){return key;});
    };

    $scope.getAreaByDistrict = function(){
      $scope.options.area = $scope.geoTree[$scope.input.region][$scope.input.district];
    };

    $http.get('http://salary360.initiumdata.com/api/census2011/geo/translation-areas.json')
      .success(function(d){
        $scope.options.area = _.map(d, function(value, key){return key;});
      });

  }]);
