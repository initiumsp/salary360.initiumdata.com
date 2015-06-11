'use strict';

/**
 * @ngdoc overview
 * @name salary360initiumdatacomApp
 * @description
 * # salary360initiumdatacomApp
 *
 * Main module of the application.
 */
angular
  .module('salary360initiumdatacomApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
