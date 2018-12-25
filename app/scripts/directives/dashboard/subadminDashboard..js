'use strict';
var app = angular.module('ApsilonApp');
//app.directive('header' ,['$location','$timeout', function($window, $http,sessionService ,$timeout){
app.directive('subadmin', ['$location','$http', 'sessionService', '$timeout','$interval','get_userser','$state','speech', function ($window, $http, sessionService, $timeout,$interval,get_userser,$state,speech) {
    return {
        templateUrl: 'directives/subadminDashboard',
        restrict: 'E',
        replace: true,
        scope: {},
        controller: ['$scope', '$http', 'loginService', '$mdDialog', '$window', 'Dialog', 'sessionService','$interval','get_userser','$state','speech',function ($scope, $http, loginService, $mdDialog, $window, Dialog, sessionService,$interval,get_userser,$state,speech) {
            debugger;
           alert("rrrrrr");
           $scope.name="Manish";
            
        }]
    }
}]);

