'use strict';
var app = angular.module('ApsilonApp');
//app.directive('header' ,['$location','$timeout', function($window, $http,sessionService ,$timeout){
app.directive('dealerheader', ['$location','$http', 'sessionService', '$timeout','$interval','get_userser','$state','speech', function ($window, $http, sessionService, $timeout,$interval,get_userser,$state,speech) {
    return {
        templateUrl: 'directives/dealerheader',
        restrict: 'E',
        replace: true,
        scope: {},
        controller: ['$scope', '$http', 'loginService', '$mdDialog', '$window', 'Dialog', 'sessionService','$interval','get_userser','$state','speech',function ($scope, $http, loginService, $mdDialog, $window, Dialog, sessionService,$interval,get_userser,$state,speech) {

            $scope.$on('$locationChangeStart', function (event, next, current) {
                //event.preventDefault(); 
            });

            $scope.load = function() {
                onResizeWindow();
            };

            $scope.RedirectToFancy=function(fancyId,TypeID,MatchID,SportID,matchName){
                $scope.setValue=fancyId;
                ;
                $scope.showvalue = false;
                $scope.displayFicon=false;
                if (TypeID==1) {
                    //dashboard.Evenoddfancy({matchId: series.MstCode,FancyID:fancyArr.ID,TypeID:fancyArr.TypeID,matchName:series.matchName,sportId: displyData.id})
                    $state.go("dashboard.Evenoddfancy", { 'matchId': MatchID,'FancyID':fancyId,'TypeID':TypeID,'matchName':matchName,'sportId':SportID });
                }else if(TypeID==2){
                    $state.go("dashboard.Sessionfancy", { 'matchId': MatchID,'FancyID':fancyId,'TypeID':TypeID,'matchName':matchName,'sportId':SportID });
                }else if(TypeID==3){
                    $state.go("dashboard.Khaddalfancy", { 'matchId': MatchID,'FancyID':fancyId,'TypeID':TypeID,'matchName':matchName,'sportId':SportID });
                }else if(TypeID==4){
                    $state.go("dashboard.Lastdigit", { 'matchId': MatchID,'FancyID':fancyId,'TypeID':TypeID,'matchName':matchName,'sportId':SportID });
                }else if(TypeID==5){
                    $state.go("dashboard.Updown", { 'matchId': MatchID,'FancyID':fancyId,'TypeID':TypeID,'matchName':matchName,'sportId':SportID });
                }
            }

            //for Marque BY Manish
            $scope.ShowMessageOnHeader = function(){
                $http.get('Betentrycntr/DisplayMsgOnHeader/').success(function (data, status, headers, config) {
                    //;
                    $scope.diplayMsg = data.marqueMsg[0].Marquee;

                });
            }
            var msgHeader=function check_Fancydisplay() {
                $scope.ShowMessageOnHeader();
            }
            var timerGo12 = $interval(msgHeader, 30000);
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
            //alert("hi"+$scope.usertype);
            $scope.logout = function () {
                loginService.logout();
            };
            function onResize() {
                // uncomment for only fire when $window.innerWidth change
                if (scope.width !== $window.innerWidth) {
                    if ($window.width() > 768) {
                        $push.addClass('pushmenu-push-toright');
                        $puslft.addClass('pushmenu-open');
                    } else {
                        $('.second-navbar').addClass('navbar-fixed-bottom');
                        $push.removeClass('pushmenu-push-toright');
                        $puslft.removeClass('pushmenu-open');
                    }
                }
            };

            function onResizeWindow() {
                if ($window.innerWidth < 768) {
                    $('.second-navbar').addClass('navbar-fixed-bottom');
                } else {
                    $('.second-navbar').removeClass('navbar-fixed-bottom');
                }
            }

            angular.element($window).on('resize', onResizeWindow);

        }]
    }
}]);

