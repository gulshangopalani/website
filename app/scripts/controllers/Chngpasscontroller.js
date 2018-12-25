app.controller('Chngpasscontroller', function($scope,$http,sessionService,$state,loginService){
       	// calling our submit function.
        $scope.submitForm = function() {
            /*$http.get('Createdealercontroller/getPassword/').success(function (data, status, headers, config) { 
                  $scope.BetHistory = data.BetHistory;
            });*/
            $scope.loginId = sessionStorage.user_id;
            $scope.type = sessionStorage.type;
            var formData = {
                      old_password: $scope.old_password,      			    
                      newpassword: $scope.newpassword,
                      Renewpassword: $scope.Renewpassword,
                      user_id:$scope.loginId,
                      user_type:$scope.type
                }
                
            $http({
                method  : 'POST',
                url     : 'Createdealercontroller/changePassword/',
                data    : formData, //forms user object
                headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
            }).success(function(data) {
                if (data.error==0) {
                    $scope.message = data.message;
                     loginService.logout(function (response) {
                    
	                });
	                sessionStorage.user;
	                localStorage.clear();
                               
                    /*if($scope.type==0){
                    	 $state.go('dashboard.Home');
                    }else if($scope.type==1){
                    	 $state.go('dashboard.Masterdashboard');
                    }else if($scope.type==2){ 
                    	$state.go('dashboard.Dealerdashboard');}
                    else if($scope.type==3){
                    	 $state.go('dashboard.Userdashboard');
                    }*/
                } else {
                    $scope.message = data.message;
                }
            });
        };
        /*$scope.logout = function () {
                loginService.logout(function (response) {
                    //console.log("LOGOUT SUCCESS");
                });
                sessionStorage.user;
                localStorage.clear();
            };
*/
     
    });
  //end
   
