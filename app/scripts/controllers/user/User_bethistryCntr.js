app.controller('Get_bethistryCntr', function ($scope, $http, $filter, sessionService, loginService, $interval) {
    
    $scope.GetBetHistory=function(){
        $http.get('Betentrycntr/BetHistory/' + sessionService.get('user_id')).success(function (data, status, headers, config) {        
            $scope.BetHistory = data.BetHistory;        
            setRowData(data.BetHistory);
            //gridOptions.api.sizeColumnsToFit();
            $scope.SumOfP_L = $scope.sum($scope.BetHistory, 'P_L');
            $scope.SumOfProfit = $scope.sum($scope.BetHistory, 'Profit');
            $scope.SumOfLiability = $scope.sum($scope.BetHistory, 'Liability'); 
        }); 
    }
    $scope.GetBetHistory();
   
});