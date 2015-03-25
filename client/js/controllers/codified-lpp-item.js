'use strict';

angular.module('ameliApp')

    .config(function($routeProvider) {

        var uriRoot = '/lpp',
            templateRoot = '/views/codified-lpp-item';

        $routeProvider

            .when(uriRoot, {
                templateUrl: templateRoot + '/list.html',
                controller: 'CodifiedLPPItemListCtrl',
                resolve: {
                    lpp: function(CodifiedLPPItemService) {
                        return CodifiedLPPItemService.fetch();
                    }
                }
            })

            //.when(uriRoot + '/new', {
            //    templateUrl: templateRoot + '/new.html',
            //    controller: 'CodifiedLPPItemCtrl'
            //})
            //
            //.when(uriRoot + '/edit', {
            //    templateUrl: templateRoot + '/edit.html',
            //    controller: 'CodifiedLPPItemCtrl'
            //})
            //
            .when(uriRoot + '/:code', {
                templateUrl: templateRoot + '/detail.html',
                controller: 'CodifiedLPPItemEditCtrl'
            });
    })

    .factory('CodifiedLPPItemService', [
        'CodifiedLPPItem', function(CodifiedLPPItem) {

            var self = this;

            return {
                fetch: function() {

                    return CodifiedLPPItem
                        .find()
                        .$promise;
                }
            }
        }
    ])

    .controller('CodifiedLPPItemListCtrl', function($scope, lpp) {
        $scope.lpp = lpp;
    })

    .controller('CodifiedLPPItemEditCtrl', function($scope, $location, $routeParams, CodifiedLPPItem) {

        //console.log($routeParams.code);


        $scope.lppItem = CodifiedLPPItem.findById({id: $routeParams.code});

        $scope.update = function() {
            $scope.lppItem.$save();
        };

        //$scope.destroy = function() {
        //    $scope.projects.$remove($scope.project).then(function(data) {
        //        $location.path('/lpp');
        //    });
        //};
        //
        //$scope.save = function() {
        //    $scope.projects.$save($scope.project).then(function(data) {
        //        $location.path('/lpp');
        //    });
        //};
    })

//.controller('CreateCtrl', function($scope, $location, Projects) {
//    $scope.save = function() {
//        Projects.projects.$add($scope.project).then(function(data) {
//            $location.path('/');
//        });
//    };
//})
//
//.controller('CodifiedLPPItemEditCtrl', [
//    '$scope', '$location', '$routeParams', 'CodifiedLPPItem',
//    function($scope, $location, $routeParams, CodifiedLPPItem) {
//
//        var lppItemCode = $routeParams.code,
//            lppItemIndex;
//
//        $scope.lpp = Projects.projects;
//        projectIndex = $scope.projects.$indexFor(projectId);
//        $scope.project = $scope.projects[projectIndex];
//
//        $scope.destroy = function() {
//            $scope.projects.$remove($scope.project).then(function(data) {
//                $location.path('/');
//            });
//        };
//
//        $scope.save = function() {
//            $scope.projects.$save($scope.project).then(function(data) {
//                $location.path('/');
//            });
//        };
//    });
