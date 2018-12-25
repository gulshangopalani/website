app.controller('Serieslstfrmapicntr', function ($scope, $http, $stateParams, Dialog, $rootScope, sessionService,$mdToast) {
    $scope.loading = true;
    var sportId = $stateParams.sportId;
    $http.get('Geteventcntr/getSeriesOfSport/' + sportId).success(function (data, status, headers, config) {
        if (data.seriesfrmApi != angular.isUndefinedOrNull) {
            $scope.GetSeriesData = data;
        }
        else {
            Dialog.autohide("Record Not Found " + data, 10000);
        }
        $scope.loading = false;
    });
/*    $scope.message = 'hello';
  var toast = $mdToast.simple()
    .content($scope.message)
    .position('bottom right')
    .hideDelay(1000);
  
  $scope.show = function(e) {
    $mdToast.show(toast);
  };*/
    $scope.saveSeries = function (id, name, marketCount, region) {
        $scope.loading = true;
        var formData = { matchId: id, matchName: name, marketCount: marketCount, region: region, sportId: sportId, HelperID: sessionService.get('HelperID') }
        var url = BASE_URL + "Geteventcntr/saveSportSeries";
        $http.post(url, formData).success(function (response) {
            //;
            //Dialog.autohide(response.message);
            var toast = $mdToast.simple().content(response.message).position('bottom right').hideDelay(1000);
            $mdToast.show(toast);
           

            $scope.loading = false;
            $rootScope.$broadcast('changeSidebar_Series', {});
        });
    }
});