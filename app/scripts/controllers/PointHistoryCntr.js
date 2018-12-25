'use strict';
angular.module('ApsilonApp').controller('PointHistoryCntr',['$scope','$mdDialog', '$http', 'sessionService', '$timeout', 'deviceDetector','$filter','$rootScope','$window', function ($scope, $mdDialog,$http, sessionService, $timeout, deviceDetector,$filter,$rootScope,$window) {
  
    $http.get(BASE_URL+'Lstsavemstrcontroller/pointHistory/'+sessionService.get('user_id')+'/'+sessionService.get('type')).then(function(response) {
            debugger;
            $scope.UserList=response.data.jsonData;
            
        });
}]);