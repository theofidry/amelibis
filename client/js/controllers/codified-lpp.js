'use strict';

angular.module('app', ['lbServices'])
  .controller('CodifiedLPPController', [
    '$scope', '$state', 'CodifiedLPPItem',
    function($scope, $state, CodifiedLPPItem) {

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
