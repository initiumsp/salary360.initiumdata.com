'use strict';

describe('Directive: salaryRankingChart', function () {

  // load the directive's module
  beforeEach(module('salary360initiumdatacomApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  //it('should make hidden element visible', inject(function ($compile) {
  //  element = angular.element('<salary-ranking-chart></salary-ranking-chart>');
  //  element = $compile(element)(scope);
  //  expect(element.text()).toBe('this is the salaryRankingChart directive');
  //}));
});
