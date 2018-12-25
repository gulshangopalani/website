app.controller('FancyBetListcntr', ['$scope', '$http','$stateParams','sessionService', '$timeout', '$log', '$mdDialog', function ($scope, $http,$stateParams,sessionService, $timeout, $log, $mdDialog){
    $scope.GetUserData=function(){
        //http://betphub.com/Sessioncntr/getFancyData/28615049/35/1/0/2
        $http.get('Sessioncntr/getFancyBetList/' + $stateParams.matchId + '/' + $stateParams.fancyId +'/'+ sessionService.get('user_id')+ '/'+ sessionService.get('type') + '/'+ $stateParams.Type ).success(function(data, status, headers, config) {
            //debugger; gulshan gopal
            $scope.UserData = data.UserBetData;
        });
    }
    $scope.GetUserData();
    $scope.selectAll = function(selectedValue) {
        //debugger; gulshan gopal
        var MatchedBet=$scope.UserData;
        MatchedBet.find(function (item, itmeindex) {
        //debugger; gulshan gopal
            item.Selected = selectedValue;           
           
        });    
    };
    $scope.deleteAll=function(){
         $scope.UserData.find(function (item, itmeindex) {      
            if(item.Selected==true){
                $http.get('Betentrycntr/deleteGetbettingmat/' + item.bet_id + '/' + item.userId+'/2').success(function (data, status, headers, config) { 

                });
            } 
        });

    }

    $scope.checkIfAllSelected = function() {
      $scope.selectedAll = $scope.item.every(function(item) {
        return item.Selected == true;
      })
    };
    $scope.DeleteBets = function (betId, userId,MarketId) {
        var result = confirm("Are you sure want to delete Fancy"+MarketId);
        if (result) {
            $http.get('Betentrycntr/deleteGetbettingmat/' + betId + '/' + userId+'/'+MarketId).success(function (data, status, headers, config) {                
                 
                 $scope.GetUserData();               
            });
        }
    }
    
}]);
