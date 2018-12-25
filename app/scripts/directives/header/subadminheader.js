'use strict';
var app = angular.module('ApsilonApp');
//app.directive('header' ,['$location','$timeout', function($window, $http,sessionService ,$timeout){
app.directive('subadminheader', ['$location','$http', 'sessionService', '$timeout','$interval','get_userser','$state','speech', function ($window, $http, sessionService, $timeout,$interval,get_userser,$state,speech) {
    return {
        templateUrl: 'directives/subadminheader',
        restrict: 'E',
        replace: true,
        scope: {},
        controller: ['$scope', '$http', 'loginService', '$mdDialog', '$window', 'Dialog', 'sessionService','$interval','get_userser','$state','speech',function ($scope, $http, loginService, $mdDialog, $window, Dialog, sessionService,$interval,get_userser,$state,speech) {
            
            $scope.displayFancyTest1 = function () {
                $scope.showvalue = true;
            }
             $scope.FancyListDisplay = function () {
                $http.get('Lstsavemstrcontroller/GetFancyOnHeader/').success(function (data, status, headers, config) {
                    $scope.GetfancyList1 = data.getFancy;
                    //alert("Get");
                });
            }
            $scope.FancyListDisplay();
            /*Get Fancy Result*/
            $scope.getFancyResult = function (sportId, match_id, fancy_Id) {
                var result1 = confirm("Are You sure want to set the Result ...");
                if (result1) {
                    var result = document.getElementById('result_' + fancy_Id).value;
                    var formData = {
                        sportId: sportId,
                        match_id: match_id,
                        fancy_Id: fancy_Id,
                        result: result
                    }
                    $http({
                        method: 'POST',
                        url: 'Lstsavemstrcontroller/updateFancyResult/',
                        data: formData, //forms user object
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                    .success(function (data) {
                        if (data.error == 0) {
                            Dialog.autohide('|' + data.message + '|');
                            $scope.FancyListDisplay();
                        } else {
                            Dialog.autohide('|' + data.message + '|');
                            $scope.FancyListDisplay();
                        }

                    });
                }

            }
            /*End of Get fancy Result*/
          // alert("Feeeee");
            $scope.HideFancyDiv = function () {
                $scope.showvalue = false;
                $scope.displayFicon=false;
            }
          $scope.logout = function () {

                loginService.logout(function(response){
                    //console.log("LOGOUT SUCCESS");
                });
                sessionStorage.user;
                localStorage.clear();
            };
            
        }]
    }
}]);

