'use strict';
var app = angular.module('ApsilonApp');
//app.directive('header' ,['$location','$timeout', function($window, $http,sessionService ,$timeout){
app.directive('userheader', ['$location','$http', 'sessionService', '$timeout','$interval','get_userser','$state','speech', function ($window, $http, sessionService, $timeout,$interval,get_userser,$state,speech) {
    return {
        templateUrl: 'directives/userheader',
        restrict: 'E',
        replace: true,
        scope: {},
        controller: ['$scope', '$http', 'loginService', '$mdDialog', '$window', 'Dialog', 'sessionService','$interval','get_userser','$state','speech',function ($scope, $http, loginService, $mdDialog, $window, Dialog, sessionService,$interval,get_userser,$state,speech) {
            
            $scope.$on('$locationChangeStart', function (event, next, current) { 
                //event.preventDefault(); 
            });
            $scope.getNotifi_status = function(){
                $http.get('Betentrycntr/getNotifi_status/'+sessionStorage.user_id).success(function (data, status, headers, config) {
                        
                        $scope.noti_status = data.jsonData[0].notif_status;
                        
                });
            }
            
           
            //for Marque BY Manish
            $scope.ShowMessageOnHeader = function(){
                $http.get('Betentrycntr/DisplayMsgOnHeader/').success(function (data, status, headers, config) {
                    $scope.diplayMsg = data.marqueMsg[0].Marquee;
                        
                });
                $scope.getNotifi_status();
            }
            var msgHeader=function check_Fancydisplay() {
                $scope.ShowMessageOnHeader();             
            }
            var timerGo12 = $interval(msgHeader, 1000000);
             $scope.ShowMessageOnHeader();
            //for Marque BY Manish
           
            $("#mobileDemo").click(function() {
                if($(".mainSite").hasClass('activeSideNav')){
                    $(".mainSite").removeClass('activeSideNav');
                    $(".mainSite").addClass('deactiveSideNav');
                }
                else{
                    $(".mainSite").addClass('activeSideNav');
                    $(".mainSite").removeClass('deactiveSideNav');
                }
            });
            //$scope.name = sessionStorage.HelperName;
            $scope.name = sessionStorage.user;
            $scope.usertype = sessionStorage.type;
            
            $scope.getNotifi_status();
            $scope.updatenoti_status=function(){
                
                $http.get('Betentrycntr/updatenoti_status/'+sessionStorage.user_id).success(function (data, status, headers, config) {                        
                });
            }


            $scope.show_notification=function(){
               
                $http.get('Betentrycntr/Getnotification/').success(function (data, status, headers, config) { 
                  
                       $scope.notification = data.GetNotification[0].notificat_msg;
                         var result = 1;//test the output message
                        var success = '<div class="alert alert-success fade in" role="alert">'
                              var success = '<div class="alert alert-success fade in" role="alert">'
                            + '<a class="close" data-dismiss="alert">&times</a>'
                            + '<strong><span class="glyphicon glyphicon-ok"></span> Your Notification</strong>'
                            + '<div>'+$scope.notification+'</div>'
                            + '</div></div>';
                        
                        if(result == 1){
                            var output = success;
                        }
                        else {
                            var output = fail;
                        }
                        $('#alert-dialogue').append(output);
                });
                $scope.updatenoti_status();
                $scope.getNotifi_status();
               
           
    
            };
            //alert("hi"+$scope.usertype);
            $scope.logout = function () {
                loginService.logout();
            };
            function onResize() {
                //alert("go to fun");
                // uncomment for only fire when $window.innerWidth change   
                if (scope.width !== $window.innerWidth) {
                    if ($window.width() > 768) {
                        $push.addClass('pushmenu-push-toright');
                        $puslft.addClass('pushmenu-open');
                    } else {

                        $push.removeClass('pushmenu-push-toright');
                        $puslft.removeClass('pushmenu-open');
                    }
                }
            };
            
        }]
    }
}]);

