'use strict';
var app = angular.module('ApsilonApp');
app.controller('Formctrl', function ($scope, $http, loginService) {
    $scope.logout = function () {
        loginService.logout();
    }
    $scope.submitForm = function (user) {
        //debugger;
        $scope.loadingM=true;
        loginService.login(user, $scope, function (response) {
            $scope.loadingM=false;
            if (response.data.type == "0" || response.data.type == "1" || response.data.type == "2") {
            } else {
                setInterval(worker, 60000);
            }
        });
    }
    var worker = function () {
        loginService.chkLoginStatus(function (response) {
            if (response.status == 1) {
                loginService.logout();
            }
        })
    }
});