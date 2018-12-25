app.controller('Marketlstapicntr', function ($scope, $http, $stateParams, Dialog, $rootScope, sessionService) {
    $scope.loading = true;
    $scope.sportId = $stateParams.sportId;
    var MatchId = $stateParams.MatchId;
    $scope.MatchId=$stateParams.MatchId;
    $scope.seriesId = $stateParams.seriesId;
    $http.get('Geteventcntr/getMarketOfMatch/' + MatchId).success(function (data, status, headers, config) {
        
        if (data.marketfrmApi != angular.isUndefinedOrNull) {
            $scope.GetMarketData = data;
        }
        else {
            Dialog.autohide("Record Not Found " + data, 4000);
        }
        $scope.loading = false;
    });
    $scope.saveMarket = function (id, name, totmat,marketType) {
        debugger;
       // if (marketType != angular.isUndefinedOrNull) {
        var marketType=0;
            var formData = { marketId: id, marketName: name, totalMatched: totmat, MatchId: MatchId, SportsId: $scope.sportId, seriesId: $scope.seriesId, HelperID: sessionService.get('HelperID'),marketType: marketType}
            var url = BASE_URL + "Geteventcntr/saveMatchMarket";
            $http.post(url, formData).success(function (response) {
                if (response.error == 0) {
                    $http.get('Geteventcntr/saveSelectionName/' + id + '/' + MatchId + '/' + $scope.sportId)
                        .success(function (data, status, headers, config) {
                            $scope.loading = false;
                            Dialog.autohide(data.message);
                            $rootScope.$broadcast('changeSidebar_Market', {});
                        });
                }
                else {
                    Dialog.autohide(response.message);
                    $scope.loading = false;
                    $rootScope.$broadcast('changeSidebar_Market', {});
                }
            });
        //}else{
          //  alert("Please select MarketType...");
        //}
    }
});