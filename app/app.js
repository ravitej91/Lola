'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.lolaComponent',
  'myApp.lolaView'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/lola'});
}])
.controller('MainCtrl', ['$scope',
    function($scope) {
        function init() {
            $scope.menuTemplateUrl = "templates/top-menu.html";
            $scope.brandName = "Lola Components v1.0";
        }
        init();
}]);
