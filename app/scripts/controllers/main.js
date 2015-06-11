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

    // TODO: can migrate to i18n

    $http.get('http://salary360.initiumdata.com/api/census2011/geo/translation-areas.json')
      .success(function(d){
        $scope.translationAreas = d;
      });

    $http.get('http://salary360.initiumdata.com/api/census2011/geo/translation-districts.json')
      .success(function(d){
        $scope.translationDistricts = d;
      });

    $http.get('http://salary360.initiumdata.com/api/census2011/geo/translation-regions.json')
      .success(function(d){
        $scope.translationRegions = d;
      });

    $scope.translationGenders = {
      male: {T: '男性'},
      female: {T: '女性'},
      both: {T: '所有人'},
    }

    $http.get('http://salary360.initiumdata.com/api/census2011/geo/geo-tree.json')
      .success(function(d){
        $scope.geoTree = d;
      });


    $scope.getDistrictByRegion = function(){
      $scope.options.district = _.map($scope.geoTree[$scope.input.region], function(value, key){return key;});
      // Set default
      $scope.input.district = $scope.options.district[0];
      $scope.getAreaByDistrict();
    };

    $scope.getAreaByDistrict = function(){
      $scope.options.area = $scope.geoTree[$scope.input.region][$scope.input.district];
      // Set default
      $scope.input.area = $scope.options.area[0];
    };

    $http.get('http://salary360.initiumdata.com/api/census2011/geo/translation-areas.json')
      .success(function(d){
        $scope.options.area = _.map(d, function(value, key){return key;});
      });

  }]);
