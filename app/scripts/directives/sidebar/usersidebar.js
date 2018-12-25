'use strict';
var app = angular.module('ApsilonApp');
app.directive('usersidebar', ['$location', '$timeout', function ($window, $http, sessionService, $timeout, get_userser,Matchoddscntr) {
    return {
        templateUrl: 'directives/userSidebar',
        restrict: 'E',
        replace: true,
       // controller: Matchoddscntr,
        scope: {
           // test_dir: '&',
        },
        link: function (scope, element, attrs,Matchoddscntr) {            
           // Matchoddscntr.test_dir();
            scope.$on('changeSidebar_Series', function (event, data) { scope.ShowHideAng(scope.sportsId); });
            scope.$on('changeSidebar_Match', function (event, data) { scope.getSeriesMatch(scope.sportsId, scope.seriesId); });
            scope.$on('changeSidebar_Market', function (event, data) { scope.getMatchMarket(scope.sportsId, scope.MatchId); });
        },
        controller: ['$scope', '$http', '$timeout', '$mdDialog', 'sessionService', '$rootScope', 'get_userser', 'Dialog',function ($scope, $http, $timeout, $mdDialog, sessionService, $rootScope, get_userser, Dialog) {
            $scope.chkMarketPP = false;
            $scope.chkMarketPPF = false;
            /*start the code of js file sidebar.js*/
            $scope.displaysubmenu=function(id){
                   
                $("#"+id+"-sub-nav").toggle();
                $("#main-menu").hide();
            }
            $scope.backButton=function(){
               $("#4-sub-nav").hide();
                $("#1-sub-nav").hide();
                $("#2-sub-nav").hide();
                $("#7-sub-nav").hide();
                $("#main-menu").show(); 
            }
            $scope.oddsdisplay=function(MatchName){
                debugger;
                
                $("#not-sub-nav").toggle();
                $("#main-menu").hide();
            }
            $scope.getMatchMarket = function (sportsId, matchId,MatchName) {
                $scope.MatchName=MatchName;
                $scope.accordion = sportsId;
                $scope.accordionLv1 = matchId;
                $scope.MatchId = matchId;
                $scope.sportsId = sportsId;
                var marketData = {
                    matchId: matchId,
                    sportsId: sportsId,
                    user_id: sessionService.get('user_id')
                }
                $http({ method: 'POST', url: 'Geteventcntr/matchMarketLst/', data: marketData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .success(function (data) {
                    //debugger;
                    $scope.MatchMarket = data.MatchMarket;
                    $scope.getMatchFancy = data.getMatchFancy;
                });
            }


            /*$(".not").click(function(){ 
                $("#not-sub-nav").toggle();
                $("#main-menu").hide();
            });*/

            $(".sub-back").click(function(){ 
                $("#not-sub-nav").hide(200);
            });
            /*end of sidebar.js*/
           /* $scope.refresh_tree = function () {
                $http.get('Lstsavemstrcontroller/lstSaveMaster/' + sessionService.get('user_id') + '/' + sessionService.get('type') + '/' + sessionService.get('HelperID') + '/' + sessionService.get('Helperype')).success(function (data, status, headers, config) {
                    $scope.treeNodes = data.tree;
                });
            }*/
            /*$(".myMenu1").click(function () { $(".dropdown123").show(); });
            $(document).click(function (e) {
                if (!$(e.target).hasClass("myMenu1") && $(e.target).parents(".dropdown").length === 0) { $(".dropdown123").hide(); }
                if (!$(e.target).hasClass("myMenu2") && $(e.target).parents(".dropdown").length === 0) { $scope.dropdown124 = false; }
            });*/
            /*$scope.showAddSetting = function (node, currentScope1) {
                $scope.mid = node.id;
                $scope.fancyType = node.usetype;
                if (node.usetype == 1) {
                    $scope.HeadingType = "Create Dealer";
                    $scope.HeadingName = "Dealer Name";
                    $scope.HeadingTypeId = 2;
                }
                else if (node.usetype == 2) {
                    $scope.HeadingType = "Create User";
                    $scope.HeadingName = "User Name";
                    $scope.HeadingTypeId = 3;
                }
                else if (node.usetype == 0) {
                    $scope.HeadingType = "Create Master";
                    $scope.HeadingName = "Master Name";
                    $scope.HeadingTypeId = 1;
                }
                $mdDialog.show({
                    controller: showAddSettingController,
                    templateUrl: 'app/scripts/directives/popupform/add_account.html?var='+Math.random(),
                    locals: { prntScope: $scope, node: node, currentScope1: currentScope1 },
                    clickOutsideToClose: false,
                    fullscreen: false,
                });
            };*/
           
            $scope.getDate = new Date();
            $scope.$watch('sessionService', function (newVal, oldVal) {
                $scope.FreeChips = sessionService.get('FreeChips');
                $scope.ChipInOut = sessionService.get('ChipInOut');
                $scope.Liability = sessionService.get('Liability');
                $scope.Balance = sessionService.get('Balance');
            });
            $scope.sessionusetype = sessionService.get('type');
            $scope.sessionuser_id = sessionService.get('user_id');
            $scope.getDashboardurl = function () {
                switch ($scope.sessionusetype) {
                    case "0": return "dashboard.Home"; break;
                    case "1": return "dashboard.Masterdashboard"; break;
                    case "2": return "dashboard.Dealerdashboard"; break;
                    case "3": return "dashboard.Userdashboard"; break;
                }
            }
            $http.get('Geteventcntr/GetSportFrmDatabase').success(function (data, status, headers, config) {
                $scope.sprtData = data.sportData;
            }).error(function (data, status, header, config) {
                $scope.ResponseDetails = "Data: " + data + "<br />status: " + status + "<br />headers: " + jsonFilter(header) + "<br />config: " + jsonFilter(config);
            });
            
            
            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[1];
           
           
            $scope.getSeriesMatch = function (sportsId, seriesId) {
                $scope.inPlay = [];
                $scope.upComing = [];
                $scope.accordion = sportsId;
                $scope.accordionLv1 = 0;
                $scope.accordionLv2 = seriesId;
                $scope.seriesId = seriesId;
                $scope.GetMatchData = angular.isUndefinedOrNull;
                $http.get('Geteventcntr/getMatchLst/' + sportsId + '/' + seriesId).success(function (data, status, headers, config) {
                    $scope.GetMatchData = data.matchLst;
					
				 var date = new Date();
		          var d = date.getDate();
							if(d<10)
								d = 0+""+d;
				 var y = date.getFullYear();
		          var m = date.getMonth();
		          m= m+1;
							if(m<10)
								m = 0+""+m;
					//	alert(""+y+"-"+m+"-"+d+" 00:00:00");
					var hours = date.getHours();
		if(hours<10)
			hours = 0+""+hours;
		var min = date.getMinutes();
		min = min+1;
		if(min<10)
			min = 0+""+min;
		var sec = date.getSeconds();
		if(sec<10)
			sec = 0+""+sec;
		var currentTime = new Date(""+y+"-"+m+"-"+d+" "+hours+":"+min+":"+sec+"");
								var date = new Date(""+y+"-"+m+"-"+d+" 00:00:00");
								//console.log("newDate : " + newDate);
					
						angular.forEach($scope.GetMatchData, function(value, key) {
							  console.log(key + ': ' + value);
							  var d = new Date(value.MstDate);
								
					//			alert("n : " + n);
								console.log("n " + d);
								if(date < d && d < currentTime){
									$scope.inPlay.push(value);
								}
else if(d>currentTime)
{$scope.upComing.push(value);
			  }else{}
								console.log($scope.inPlay);
								console.log($scope.upComing);
							});
                });
            }
            var UserId = sessionService.get('user_id');
            
            $scope.showCreateFancy = function (ev, type) {
                $mdDialog.show({
                    controller: 'showCreateFancyCntr',
                    templateUrl: 'app/scripts/directives/popupform/create_fancy.html?var='+Math.random(),
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    locals: { prntScope: $scope, matchInfo: $scope.CreateFancyMatchInfo, type: type },
                })
              .then(function () {
              }, function () {
              });
            };
            $scope.createAllTypeFancy = function (formData) {
                 
                var url = BASE_URL + "Createmastercontroller/SaveFancy";
                $http.post(url, formData).success(function (response) {
                    Dialog.autohide(response.message);
                    $scope.loading=true;
                    $scope.SubmitBtnDis=false;
                });
            };
            $scope.sdMarketPP = function (sportId,matchId,MarketId,FancyId,IsPlay) {
                
                var user_id=sessionService.get("user_id");
                var user_type=sessionService.get("type");
                var $promise = $http.get(BASE_URL + 'Lstsavemstrcontroller/chaneMarketPPStatus/' +user_id+'/'+matchId+'/'+MarketId+'/'+FancyId+'/'+user_type+'/'+IsPlay);
                $promise.then(function (response) {
                   // debugger;
                     Dialog.autohide(response.data.message);
                     $scope.getMatchMarket(sportId, matchId);
                   
                });
            };
        }]
    }
}]);
app.controller('showCreateFancyCntr',['$scope', '$mdDialog', 'prntScope', 'matchInfo', 'type', function ($scope, $mdDialog, prntScope, matchInfo, type) {
    $scope.SubmitBtnDis=false;
    $scope.dt = null;
    if (type == 1) {
        $scope.fancyHeaderName = "Odd Even";
        var t = matchInfo.MstDate.split(/[- :]/);
        var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
        $scope.mytime = new Date(matchInfo.MstDate);
        $scope.dt = t[0] + "-" + (t[1]) + "-" + t[2];
    }
    else if (type == 2) {
        $scope.fancyHeaderName = "Session";
        var t = matchInfo.MstDate.split(/[- :]/);
        var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
        $scope.mytime = new Date(matchInfo.MstDate);
        $scope.dt = t[0] + "-" + (t[1]) + "-" + t[2];
    }
    else if (type == 3) {
        $scope.fancyHeaderName = "Khaddal";
        var t = matchInfo.MstDate.split(/[- :]/);
        var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
        $scope.mytime = new Date(matchInfo.MstDate);
        $scope.dt = t[0] + "-" + (t[1]) + "-" + t[2];
    }
    else if (type == 4) {
        $scope.fancyHeaderName = "Last Digit";
        var t = matchInfo.MstDate.split(/[- :]/);
        var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
        $scope.mytime = new Date(matchInfo.MstDate);
        $scope.dt = t[0] + "-" + (t[1]) + "-" + t[2];
    }
    else if (type == 5) {
        $scope.fancyHeaderName = "Up Down";
        $scope.ratediff = 1;
        $scope.maxStake = 10000;
        $scope.pointDiff = 10;
        var t = matchInfo.MstDate.split(/[- :]/);
        var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
        $scope.mytime = new Date(matchInfo.MstDate);
        $scope.dt = t[0] + "-" + (t[1]) + "-" + t[2];
    }
    $scope.mid = matchInfo.MstCode;
    $scope.SportID = matchInfo.SportID;
    $scope.fancyType = type;
    $scope.oddEvenFancy = function (formData) {
       // debugger;
        $scope.loading=true;
        $scope.SubmitBtnDis=true;
       // alert("test");
        var setFancyTime = document.getElementById('setFancyTime').value;
        var formData1 = { HeadName: formData.HeadName, remarks: formData.remarks, mid: $scope.mid, fancyType: $scope.fancyType, date: $scope.dt, time: setFancyTime, sid: $scope.SportID }
        prntScope.createAllTypeFancy(formData1, setFancyTime);
    };
    $scope.SessionFancyForm = function (formData) {
        $scope.loading=true;
        $scope.SubmitBtnDis=true;
        var setFancyTime = document.getElementById('setFancyTimeS').value;
        var inputYes = document.getElementById('inputYes').value;
        var inputNo = document.getElementById('inputNo').value;
        var formData1 = { HeadName: formData.HeadName, remarks: formData.remarks, mid: $scope.mid, fancyType: $scope.fancyType, date: $scope.dt, time: setFancyTime, inputYes: inputYes, inputNo: inputNo, sid: $scope.SportID }
        prntScope.createAllTypeFancy(formData1);
    };
    $scope.KhaddalFancyForm = function (formData) {
        $scope.loading=true;
        $scope.SubmitBtnDis=true;
        var setFancyTime = document.getElementById('setFancyTimeK').value;
        var formData1 = { HeadName: formData.HeadName, remarks: formData.remarks, mid: $scope.mid, fancyType: $scope.fancyType, date: $scope.dt, time: setFancyTime, fancyRange: formData.range, sid: $scope.SportID }
        prntScope.createAllTypeFancy(formData1);
    };
    $scope.LastDigitFancy = function (formData) {
        $scope.loading=true;
        $scope.SubmitBtnDis=true;
        var setFancyTime = document.getElementById('setFancyTimeL').value;
        var liabilityLstDigit = document.getElementById('liabilityLstDigit').value;
        var formData1 = { HeadName: formData.HeadName, remarks: formData.remarks, mid: $scope.mid, fancyType: $scope.fancyType, date: $scope.dt, time: setFancyTime, liability: liabilityLstDigit, sid: $scope.SportID }
        prntScope.createAllTypeFancy(formData1);
    };
    $scope.UpDownFancy = function (formData) {
        $scope.loading=true;
        $scope.SubmitBtnDis=true;
        var liability = document.getElementById('liability').value;
        var upDownHead = document.getElementById('upDownHead').value;
        var ratediffUpdwn = document.getElementById('ratediffUpdwn').value;
        var pointDiffUpdwn = document.getElementById('pointDiffUpdwn').value;
        var maxStakeUpdwn = document.getElementById('maxStakeUpdwn').value;
        var formData1 = { HeadName: upDownHead, mid: $scope.mid, remarks: formData.remarks, fancyType: $scope.fancyType, date: $scope.dt, time: $scope.mytime, rateDiff: ratediffUpdwn, pointDiff: pointDiffUpdwn, MaxStake: maxStakeUpdwn, liability: liability, sid: $scope.SportID }
        prntScope.createAllTypeFancy(formData1);
    };
    $scope.hide = function () { $mdDialog.hide(); };
}]);