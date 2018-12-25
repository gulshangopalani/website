app.controller('MatchBetListCntr', ['$scope', '$http','$stateParams','sessionService', '$timeout', '$log', '$mdDialog','$filter', function ($scope, $http,$stateParams,sessionService, $timeout, $log, $mdDialog,$filter){
    $scope.GetUserData=function(){
        $http.get('Betentrycntr/GatBetData/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function(data, status, headers, config) {
            $scope.UserData = $filter('filter')(data.betUserData, function (item) { return item.MarketId != '2'; });
        });
    }
    $scope.GetUserData();
    $scope.selectAll = function(selectedValue) {
        debugger;
        var MatchedBet=$scope.UserData;
        MatchedBet.find(function (item, itmeindex) {
        debugger;           
            item.Selected = selectedValue;           
           
        });    
    };
    $scope.checkIfAllSelected = function() {
      $scope.selectedAll = $scope.item.every(function(item) {
        return item.Selected == true
      })
    };
    $scope.deleteAll=function(){
         $scope.UserData.find(function (item, itmeindex) {      
            if(item.Selected==true && item.IsMatched==1){
                debugger;
                $scope.DeleteAllBets(item.MstCode,item.IsMatched,item.MatchId,item.MarketId,item.UserId);
            }else if(item.Selected==true && item.IsMatched==0){
               $scope.DeleteAllBets(item.MstCode,item.IsMatched,item.MatchId,item.MarketId,item.UserId);
            }
        });

    }
    $scope.DeleteAllBets=function(MstCode,IsMatched,MatchId,MarketId,UserId){
        debugger;
        
       if(IsMatched==1){
            $http.get('Betentrycntr/deleteGetbettingmat/' + MstCode + '/' + UserId+'/'+MarketId).success(function(data, status, headers, config) {
            });
        }else if(IsMatched==0){
            $http.get('Betentrycntr/deleteGetbetting/' + MstCode + '/' + UserId).success(function(data, status, headers, config) {
            });
        } 
    }
    $scope.DeleteBets=function(MstCode,IsMatched,MatchId,MarketId,UserId){
        debugger;
        var result = confirm("Are you sure want to delete Records Unmatched");
       if(IsMatched==1 && result){
            $http.get('Betentrycntr/deleteGetbettingmat/' + MstCode + '/' + UserId+'/'+MarketId).success(function(data, status, headers, config) {
               
                $scope.GetUserData();
               
            });
        }else if(IsMatched==0 && result){
            $http.get('Betentrycntr/deleteGetbetting/' + MstCode + '/' + UserId).success(function(data, status, headers, config) {
                
                $scope.GetUserData();
               
            });
        } 
    }
    
}]);
