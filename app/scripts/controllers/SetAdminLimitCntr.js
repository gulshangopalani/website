app.controller('SetAdminLimitCntr', function($scope,$http){
    $scope.message="";
            $http.get('Betentrycntr/adminLimit/').success(function (data, status, headers, config) { 

                $scope.adminLimit = data.adminLimit;
     
            });
       $scope.saveData=function(limit,id){
        
            $http.get('Betentrycntr/UpdateAdminLimit/'+id+'/'+limit).success(function (data, status, headers, config) { 

                $scope.adminLimit = data.adminLimit;
                $scope.message="Limit set Successfully...";
            });
           
       }
       $scope.UpdateGngInPlayLimitLimit=function(limit){

            $http.get('Betentrycntr/UpdateGngInPlayLimitLimit/'+limit ).success(function (data, status, headers, config) { 
                   alert(data.message);
                    //$scope.message=data.message;
            });
       }
       
      $scope.UpdatePoint=function(pointVal){

            $http.get('Betentrycntr/UpdatepointVal/'+pointVal ).success(function (data, status, headers, config) { 
                   alert("Update Successfully...");
                    $scope.GetPoint();
                    //$scope.message=data.message;
            });
       }

       $scope.UpdateBetDelay=function(betDelay){

            $http.get('Betentrycntr/UpdateBetDelay/'+betDelay ).success(function (data, status, headers, config) { 
                   alert(data.message);
                    $scope.GetPoint();
                    //$scope.message=data.message;
            });
       }
       $scope.setHeaderMsg=function(e){
        //debugger;
        var dataArray={setMessage:e};
        $http.post("Betentrycntr/setHeaderMsg/",dataArray).success(function(data, status, headers, config){
          alert("success");
        });
      }
      $scope.GetPoint=function(){
            $http.get('Betentrycntr/PointValue/').success(function (data, status, headers, config) { 
              //debugger;
                   $scope.PointValue = parseInt(data.GetPoint[0].value);
                    //$scope.message=data.message;
            });
       }
       $scope.GetPoint();
       $scope.GetNotification=function(){
            $http.get('Betentrycntr/Getnotification/').success(function (data, status, headers, config) { 
              //debugger; gulshan gopal
                   $scope.notification = data.GetNotification[0].notificat_msg;
                    //$scope.message=data.message;
            });
       }
       $scope.GetNotification();
       $scope.UpdateNotification=function(notificationMsg){
          var dataArray={setMessage:notificationMsg};
          $http.post("Betentrycntr/UpdateNotification/",dataArray).success(function(data, status, headers, config){
            alert("success");
          });
       }
});



 