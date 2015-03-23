///*
// Define the application configuration. This is where the dependencies are included and the states defined.
// */
//
//'use strict';
//
//var ameliApp = angular
//    .module('app', [
//        //'lbServices',
//        //'lumx',
//        'ngRoute'
//    ]);
//
////ameliApp.config([
////    '$routeProvider',
////    function($routeProvider) {
////        $routeProvider
////            .when('/lpp', {
////                templateUrl: '/views/codified-lpp-item/index.html',
////                controller: 'CodifiedLPPItemController'
////            })
////            .when('/lpp/:code', {
////                templateUrl: '/views/codified-lpp-item/view.html',
////                controller: 'CodifiedLPPItemController'
////            })
////
////            // route for the about page
////            .when('/about', {
////                templateUrl: 'pages/about.html',
////                controller: 'aboutController'
////            })
////
////            // route for the contact page
////            .when('/contact', {
////                templateUrl: 'pages/contact.html',
////                controller: 'contactController'
////            });
////    }]);
//
//ameliApp.config(function($routeProvider) {
//    $routeProvider
//
//        // route for the home page
//        .when('/', {
//            templateUrl : 'pages/home.html',
//            controller  : 'mainController'
//        })
//
//        // route for the about page
//        .when('/about', {
//            templateUrl : 'pages/about.html',
//            controller  : 'aboutController'
//        })
//
//        // route for the contact page
//        .when('/contact', {
//            templateUrl : 'pages/contact.html',
//            controller  : 'contactController'
//        });
//});
//
//// create the controller and inject Angular's $scope
//ameliApp.controller('mainController', function($scope) {
//    // create a message to display in our view
//    $scope.message = 'Everyone come and see how good I look!';
//});
//
//ameliApp.controller('aboutController', function($scope) {
//    $scope.message = 'Look! I am an about page.';
//});
//
//ameliApp.controller('contactController', function($scope) {
//    $scope.message = 'Contact us! JK. This is just a demo.';
//});


// create the module and name it scotchApp
angular.module('scotchApp', ['ngRoute']);

// configure our routes
angular.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'pages/home.html',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/about', {
            templateUrl : 'pages/about.html',
            controller  : 'aboutController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl : 'pages/contact.html',
            controller  : 'contactController'
        });
});

// create the controller and inject Angular's $scope
angular.controller('mainController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
});

angular.controller('aboutController', function($scope) {
    $scope.message = 'Look! I am an about page.';
});

angular.controller('contactController', function($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});
