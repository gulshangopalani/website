app.controller('anctStatementCntr', function ($scope, $http, $filter, sessionService, loginService, $interval) {
     
    $scope.GetLeger=function(){
        $http.get('Betentrycntr/AcStatement/' + sessionService.get('user_id')).success(function (data, status, headers, config) {        
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
        
        if(index==0){
           //$('#'+index).val = parseFloat(chips);
            document.getElementById('Bal_'+index).value = parseFloat(chips).toFixed(2);
        }else{
            var temp='Bal_'+(index-1);
            document.getElementById('Bal_'+index).value=$scope.total(parseFloat(document.getElementById(temp).value).toFixed(2), parseFloat(chips).toFixed(2));
        }


    }
    $scope.sum = function(items, prop){
        
        return items.reduce( function(a, b){
             
             if (b[prop]==null || b[prop]=="") b[prop]=0;            
                return parseFloat(a) + parseFloat(b[prop]);
        }, 0);
    };
    $scope.total = function(val1, val2){
        //debugger;
        var Temp1= parseFloat(val1)+parseFloat(val2);
        return Temp1;
         
    };
});