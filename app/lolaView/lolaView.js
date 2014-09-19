'use strict';

angular.module('myApp.lolaView', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/lola', {
            templateUrl: 'lolaView/lolaView.html',
            controller: 'LolaCtrl',
            resolve: {
                chartData: ['$http',
                    function($http) {
                        return $http.get('/app/flare.json')
                            .then(
                                function success(response) {
                                    return response;
                                },
                                function error(reason) {
                                    return false;
                                }
                            );
                    }
                ]
            }
        });
    }])
.controller('LolaCtrl', ['$scope', '$http', 'chartData',
    function($scope, $http, chartData) {
        // get json file for the chart
        $scope.chartData = chartData.data;
    }]);