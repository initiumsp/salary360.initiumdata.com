'use strict';

/**
 * @ngdoc function
 * @name salary360initiumdatacomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the salary360initiumdatacomApp
 */
angular.module('salary360initiumdatacomApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.input = {
      area: 'a01',
      gender: 'both',
      salary: 11555
    };

    $scope.options = {
      area: ['a01', 'b02', 'c03'],
      gender: ['male', 'female', 'both']
    };

  });
