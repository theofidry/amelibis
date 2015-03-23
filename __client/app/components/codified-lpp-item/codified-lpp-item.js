'use strict';

angular.module('codified-lpp-item', ['lbServices'])
    .controller('CodifiedLPPItemController', [
        '$scope', 'CodifiedLPPItem',
        function($scope, CodifiedLPPItem) {

            $scope.lpp = CodifiedLPPItem.find();

            //$scope.get = CodifiedLpp.create({
            //  classification: "",
            //  "code": 0
            //});
            //
            //$scope.todos = [];
            //
            //function getTodos() {
            //  Todo
            //    .find()
            //    .$promise
            //    .then(function(results) {
            //      $scope.todos = results;
            //    });
            //}
            //
            //getTodos();
            //
            //$scope.addTodo = function() {
            //  Todo
            //    .create($scope.newTodo)
            //    .$promise
            //    .then(function(todo) {
            //      $scope.newTodo = '';
            //      $scope.todoForm.content.$setPristine();
            //      $('.focus').focus();
            //      getTodos();
            //    });
            //};
            //
            //$scope.removeTodo = function(item) {
            //  Todo
            //    .deleteById(item)
            //    .$promise
            //    .then(function() {
            //      getTodos();
            //    });
            //};
        }
    ]);

//angular.module('movieApp').config(function($stateProvider) {
//    $stateProvider.state('lpp', { // state for showing all movies
//        url: '/lpp',
//        templateUrl: 'views/index.html',
//        controller: 'CodifiedLPPController'
//    }).state('viewMovie', { //state for showing single movie
//        url: '/movies/:id/view',
//        templateUrl: 'partials/movie-view.html',
//        controller: 'MovieViewController'
//    }).state('newMovie', { //state for adding a new movie
//        url: '/movies/new',
//        templateUrl: 'partials/movie-add.html',
//        controller: 'MovieCreateController'
//    }).state('editMovie', { //state for updating a movie
//        url: '/movies/:id/edit',
//        templateUrl: 'partials/movie-edit.html',
//        controller: 'MovieEditController'
//    });
//})
