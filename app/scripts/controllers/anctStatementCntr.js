app.controller('anctStatementCntr', function ($scope, $http, $filter, sessionService, loginService, $interval) {
     
    $scope.GetLeger=function(){
        $http.get('Betentrycntr/AcStatement/' + sessionService.get('slctUseID')).success(function (data, status, headers, config) {        
            $scope.BetHistory = data.BetHistory;            
           // setRowData(data.BetHistory);
            //gridOptions.api.sizeColumnsToFit();
            $scope.SumOfP_L = $scope.sum($scope.BetHistory, 'Chips');
            $scope.SumOfProfit = $scope.sum($scope.BetHistory, 'Credit');
            $scope.SumOfLiability = $scope.sum($scope.BetHistory, 'Debit'); 
        }); 
    }
    $scope.GetLeger();
   
   $scope.GetBalance=function(index,chips){
        debugger;
        if(index==0){
            document.getElementById(index).value = parseFloat(chips);
        }else{
            document.getElementById(index).value=parseFloat(document.getElementById(index-1).value) + parseFloat(chips);
        }


    }
    $scope.sum = function(items, prop){
        
        return items.reduce( function(a, b){
             
             if (b[prop]==null || b[prop]=="") b[prop]=0;            
                return parseFloat(a) + parseFloat(b[prop]);
        }, 0);
    };
});