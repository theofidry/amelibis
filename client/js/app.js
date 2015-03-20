/*
 Define the application configuration. This is where the dependencies are included and the states defined.
 */

'use strict';

angular
  .module('app', [
    'lbServices',
    //'ui.router',
    'lumx'
  ]);
  //.config([
  //  '$stateProvider',
  //  '$urlRouterProvider',
  //  function($stateProvider, $urlRouterProvider) {
  //
  //    $stateProvider.state('CodifiedLPP', {
  //        url: '',
  //        templateUrl: 'js/templates/codified-lpp.html',
  //        controller: 'CodifiedLPPController'
  //      });
  //    $urlRouterProvider.otherwise('CodifiedLPP');
  //  }]);
