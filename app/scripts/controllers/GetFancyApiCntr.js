app.controller('GetFancyApiCntr', function ($scope, $http, $stateParams, Dialog, $rootScope, sessionService,$filter) {
    $scope.MatchId=$stateParams.MatchId; 
    $scope.GetFancy=function(){
        $http.get("http://159.65.146.249/sanjuApiFancy?sportid=4&eventid="+$stateParams.MatchId).then(function successCallback(response){
                //; gulshan gopal
                $scope.apiFancy = response.data.result;
        }).then(function(apiFancy){                     
            $http.get("Lstsavemstrcontroller/GetFancyOnHeader/"+$stateParams.MatchId).then(function successCallback(response){
                //; gulshan gopal
                $scope.fancyFromDb = response.data.getFancy;
                $scope.apiFancy.find(function(item,index){
                    if($scope.fancyFromDb.length >0){
                        var fileterVal = $filter('filter')($scope.fancyFromDb, { marketId: item.id })[0];
                        if(fileterVal != angular.isUndefinedOrNull){
                            item.selected=true;                            
                        }else{
                            item.selected=false;                                
                        }   
                    }else{
                        item.selected=false;
                    }                       
                });     
            });
                                                    
        }); 
    }   
    $scope.GetFancy();
    $scope.saveFancy = function (FancyData) {
        //; gulshan gopal
        if(FancyData.runners[0].back[0].price==100){
            var PointDiff=10;
        }else{
            var PointDiff= 100 - parseInt(FancyData.runners[0].back[0].price);
        }
        var formData = { 
                    HeadName: FancyData.name,
                    remarks: 'N/A',
                    mid: $stateParams.MatchId,
                    fancyType: 2,
                    date: FancyData.lastUpdateTime,
                    time: FancyData.lastUpdateTime,
                    inputYes: FancyData.runners[0].back[0].line,
                    inputNo: FancyData.runners[0].lay[0].line,
                    sid:FancyData.eventTypeId,
                    NoLayRange:FancyData.runners[0].lay[0].price,
                    YesLayRange:FancyData.runners[0].back[0].price,
                    RateDiff:1,
                    MaxStake:9999999999999,
                    PointDiff:PointDiff,
                    marketId: FancyData.id,
                    isApi : 1,
            }       
        var url = BASE_URL + "Createmastercontroller/SaveFancy";
        $http.post(url, formData).success(function (response) {
            $scope.message= response.message;
            alert(response.message);
            $scope.GetFancy();
        });
       
    }
});