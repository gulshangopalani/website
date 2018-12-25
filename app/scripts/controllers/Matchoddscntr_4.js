app.controller('Matchoddscntr', ['$scope', '$http', '$stateParams', 'sessionService', '$timeout', 'Dialog', '$rootScope', 'deviceDetector', 'get_userser', '$mdDialog', 'speech', '$filter', '$location', '$state', '$interval', function($scope, $http, $stateParams, sessionService, $timeout, Dialog, $rootScope, deviceDetector, get_userser, $mdDialog, speech, $filter, $location, $state, $interval) {
    $scope.$on('test_dir', function(event, data) { $scope.getNameFunc(); });
    var marketTimer;
    $scope.loading = false;
    $scope.loadingM = false;
    $scope.dateForm = new Date($stateParams.date);
    $scope.sportId = 0;
    var stopped;
    var currentdate = new Date();
    $scope.btnPlaceDis = false;
    $scope.netConn = true;
    $scope.gtTypeId = sessionService.get('type');
    $scope.matchName = $stateParams.matchName;
    $scope.MatchId = $stateParams.MatchId;
    $scope.MarketId = $stateParams.MarketId;
    $scope.SPORTID=$stateParams.sportId;
    $scope.date = $stateParams.date;
    $scope.UserTypeId = sessionService.get('slctUseTypeID');
    $scope.UserId = sessionService.get('slctUseID');
    $scope.displayTable = false;
    $scope.logInTypeId = sessionService.get('slctUseTypeID');
    $scope.logInId = sessionService.get('slctUseID');
    var MarketId = $stateParams.MarketId;
    $scope.PLAYPAUSE=0;
    var matchStatus = "OPEN";
    $scope.checkBet={};
    $scope.countdown = function() {
        
        //stopped = $timeout(function() {
            $http.get("http://159.65.146.249/sanjuApiOdds?sportid=" + $stateParams.sportId + "&eventid=" + $scope.MatchId).then(function successCallback(response){
                $scope.apiFancy = response.data;
            }).then(function(apiFancy){
                $scope.FancyArray = { "items": [] };                                
                $http.get("Lstsavemstrcontroller/GetFancyOnHeader/"+$stateParams.MatchId).then(function successCallback(response){                           
                    $scope.FancyFromDb = response.data.getFancy;               
                    /*Filter The Fancy api to Db*/
                    $scope.apiFancy.result.find(function(item,index){                    
                        if($scope.FancyFromDb.length >0){
                            var fileterVal = $filter('filter')($scope.FancyFromDb, { marketId: item.id })[0];
                            if( fileterVal != angular.isUndefinedOrNull && item.btype =='LINE'){                                
                               $scope.FancyArray.items.push({
                                    id : fileterVal.ID,
                                    marketId : item.id,
                                    name : item.name,
                                    backLine: item.runners[0].back[0].line,
                                    backPrice: item.runners[0].back[0].price,
                                    layLine: item.runners[0].lay[0].line,
                                    layPrice: item.runners[0].lay[0].price,
                                    status: item.status,
                                    maxLiabilityPerBet: item.maxLiabilityPerBet,
                                    maxLiabilityPerMarket: item.maxLiabilityPerMarket,
                                    betDelay: item.betDelay,
                                    isBettable: item.isBettable,
                                    statusLabel:item.statusLabel                                
                               });
                            }
                        }                     
                    });
                    /*Filter The Fancy api to Db*/
                     updateFancy();     
                });                                                    
            });
            //$scope.countdown();
       // }, 10000);
    };
    function updateFancy(){
        fancyTimer = $timeout(function (){           
            $http.get("http://159.65.146.249/sanjuApiOdds?sportid=" + $stateParams.sportId + "&eventid=" + $scope.MatchId).then(function successCallback(response){
                $scope.apiFancy = response.data;
                if($scope.apiFancy.result.length >0){                                   
                    for (var i = 0; i < $scope.apiFancy.result.length; i++) {
                       var fileterVal = $filter('filter')($scope.FancyArray.items, { marketId: $scope.apiFancy.result[i].id })[0];
                        if( fileterVal != angular.isUndefinedOrNull && $scope.apiFancy.result[i].btype =='LINE'){
                            $scope.FancyArray.items.filter(function(item){
                                if(item.marketId == $scope.apiFancy.result[i].id){
                                    item.backLine= $scope.apiFancy.result[i].runners[0].back[0].line;
                                    item.backPrice= $scope.apiFancy.result[i].runners[0].back[0].price;
                                    item.layLine= $scope.apiFancy.result[i].runners[0].lay[0].line;
                                    item.layPrice= $scope.apiFancy.result[i].runners[0].lay[0].price;
                                    item.status= $scope.apiFancy.result[i].status,
                                    item.betDelay= $scope.apiFancy.result[i].betDelay;
                                    item.isBettable= $scope.apiFancy.result[i].isBettable;
                                    item.statusLabel=$scope.apiFancy.result[i].statusLabel;
                                }
                            });
                        }
                    }
                }                
            });
            updateFancy();
        }, 1000);
    }
    $scope.countdown();   
    $scope.initiateBet=function(){
    	$http.get('Betentrycntr/chkbets/').success(function(data, status, headers, config) {    		
    			$scope.checkBet = data.jsonData;
        });
    }
    $scope.GetUserData=function(){
        $http.get('Betentrycntr/GatBetData/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function(data, status, headers, config) {
            $scope.UserData = data.betUserData;           

        });
        $scope.initiateBet();
    }
    $scope.chkbets=function(){
    	$http.get('Betentrycntr/chkbets/').success(function(data, status, headers, config) {
    		
    		if ($scope.checkBet == angular.isUndefinedOrNull) {
    			$scope.chkbets();
    		}else{

    			var MaxFancyId = data.jsonData[0].FbetId;
    			var oddsbetId = data.jsonData[0].oddsbetId;
    			if(data.jsonData[0].FbetId >$scope.checkBet[0].FbetId || data.jsonData[0].oddsbetId >$scope.checkBet[0].oddsbetId ){
                    $rootScope.$broadcast('update_cntrusrpos', {});
                    $scope.getNameFunc();
    				$scope.GetUserData();
    			}
    		}
                

        });
    }
    $scope.FancyBet = $interval($scope.chkbets, 2000);
    $scope.$on("$destroy", function(event) {
        $interval.cancel($scope.FancyBet);
        $scope.FancyBet = angular.isUndefinedOrNull;
    });    
    $scope.styleColor=function(value){
        if(value < 0){ return "RED"; }else{ return "GREEN";  }
    }   
    if($scope.gtTypeId !=3){       
        var scorePosition = $interval(function () {        
        if($stateParams.MatchId == sessionService.get('MatchId') && $scope.gtTypeId !=3){
            var $promise = $http.get(BASE_URL + 'Sessioncntr/FancyScorePosition/'  + sessionService.get('fancyId') + '/' + sessionService.get('slctUseID') + '/' + sessionService.get('FancyType'));
            $promise.then(function (response) {               
                $scope.scorePosition=response.data.scorePosition;
            });
        } 
        }, 10000);
    }
    $scope.scorePosition=function(FancyId,FancyTypeId){
       
       
            var $promise = $http.get(BASE_URL + 'Sessioncntr/FancyScorePosition/'  + FancyId + '/' + sessionService.get('slctUseID') + '/' + FancyTypeId);
            $promise.then(function (response) {
               
                $scope.scorePosition1=response.data.scorePosition;
            });
       
    }
    $scope.showSetPassword = function (mstcode,user_id,marketId) {
        $mdDialog.show({
            controller: SetPasswrdCntr,
            templateUrl: 'app/scripts/directives/header/header-notification/bet_password.html',
            locals: { betId : mstcode,userId: user_id,MarketId:marketId },
            clickOutsideToClose: false,
            fullscreen: false,
        });
    };
    function SetPasswrdCntr(scope,$mdDialog,betId,userId,MarketId) {
       
        scope.checkPassword=function(password){           
            var marketData = { Password: password };         
            $http({ method: 'POST', url: 'Betentrycntr/CheckAdminPass/', data: marketData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .success(function(data) {               
                if (data.error=='1') {
                    scope.hide();
                    $http.get('Betentrycntr/deleteGetbettingmat/' + betId + '/' + userId+'/'+MarketId).success(function (data, status, headers, config) {
                        alert("Record Deleted Successfully...");
                    });

                }else{
                    scope.hide();
                    alert(data.message);
                }
                
            });
        }
        scope.hide = function () { $mdDialog.hide(); };
    }
    $scope.deleteUser = function (betId, userId) {
        var result = confirm("Are you sure want to delete Records Unmatched");
        if (result) {
            $http.get('Betentrycntr/deleteGetbetting/' + betId + '/' + userId).success(function (data, status, headers, config) {
                
                Dialog.autohide("Record Deleted Successfully...");
            });

        }

    }
    $scope.deleteUser1 = function (betId, userId,MarketId) {
        var result = confirm("Are you sure want to delete Records Matched"+MarketId);
        if (result) {
            $http.get('Betentrycntr/deleteGetbettingmat/' + betId + '/' + userId+'/'+MarketId).success(function (data, status, headers, config) {
                
                 Dialog.autohide("Record Deleted Successfully...");
               
            });

        }

    }
    $scope.sum = function (items, prop) {
            return items.reduce(function (a, b) {
                var t = parseFloat(a) + parseFloat(b[prop]);
                return parseFloat(a) + parseFloat(b[prop]);
            }, 0);
    };
    
    $scope.GetUserData();
    /*end of new function*/
    $scope.saveMatchoddsResult = function(Match_id, Sport_id, market_id, selectionId, model_result, spartName, matchName, MarketName, selectionName) {
        var marketData = {
            Sport_id: Sport_id,
            Match_id: Match_id,
            market_id: market_id,
            selectionId: selectionId,
            result: model_result,
            isFancy: 1,
            sportName: spartName,
            matchName: matchName,
            MarketName: MarketName,
            selectionName: selectionName
        }
        $timeout.cancel(marketTimer);
        marketTimer = angular.isUndefinedOrNull;
        $http({ method: 'POST', url: 'Geteventcntr/SetResult/', data: marketData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .success(function(data) {
                try {
                    $scope.message = data.status.message;
                    $rootScope.$broadcast('changeSidebar_Market', {});

                    if (sessionService.get('type') == "1")
                        $state.go('dashboard.Masterdashboard');
                    else if (sessionService.get('type') == "2")
                        $state.go('dashboard.Dealerdashboard');
                    else if (sessionService.get('type') == "3")
                        $state.go('dashboard.Userdashboard');
                } catch (e) { console.log(data.status.error); }
            });
    }
    $scope.getNameFunc = function() {
        var user_id = sessionService.get('slctUseID');
        var user_type = sessionService.get('slctUseTypeID');
        
        $http.get('Geteventcntr/getBackLaysOfMarketSelectionName/' + $scope.MarketId + '/' + user_id + '/' + user_type + '/' + $scope.MatchId).success(function(data, status, headers, config)
            {
                
                if (data.runnerSlName != angular.isUndefinedOrNull && data.runnerSlName.length > 0)
                    $scope.GetMarketBackLayDataSelectionName = data.runnerSlName[0].runners;
                if (data.RunnerValue != angular.isUndefinedOrNull && data.RunnerValue.length != 0)
                    $scope.RunnerValue = data.RunnerValue;
                else
                    $scope.RunnerValue = [{}];

                if (data.MarketData != angular.isUndefinedOrNull && data.MarketData.length != 0)
                    $scope.GetMarketInfo = data.MarketData[0];
            });
    }
    $scope.getSumValPnL = function(a, b) {
        if(a==angular.isUndefinedOrNull && b==angular.isUndefinedOrNull){ a=0;b=0; }
        return (parseFloat(a) + parseFloat(b));
    }
    $scope.counter = 0;
    var totalMatch = 0;
    var selectedRunner = null;
    $scope.$on("$destroy", function(event) {
    $interval.cancel($scope.stopScore);
        $timeout.cancel($scope.callOddsFunc);
        $timeout.cancel(fancyTimer);
        $scope.callOddsFunc = angular.isUndefinedOrNull;
    });
    $scope.callOddsFunc = function() {
        var maxloop = 0;       
        var $promise = $http.get('UsereventCntr/getBackLaysOfMarket/' + MarketId + '/' + $stateParams.MatchId);
        $promise.then(function(response) {
           $scope.MarketDelay=response.data.MarketRunner.isMarketDataDelayed;
             /*start code for Match Unmatch*/
            if($scope.UserData != angular.isUndefinedOrNull){
                if($filter('filter')($scope.UserData, { IsMatched: '0' }).length >0){
                    $scope.unMatchBets = $filter('filter')($scope.UserData, { IsMatched: '0' });
                    try {
                        for (var i = 0; i < $scope.unMatchBets.length; i++) {                            
                            if ($scope.GetMarketBackLayData != angular.isUndefinedOrNull) {
                                $scope.GetMarketBackLayData.runners.find(function(item, j) {                                    
                                    if (item.selectionId == $scope.unMatchBets[i].SelectionId && ($scope.GetMarketBackLayData.marketId == $scope.unMatchBets[i].MarketId) && ($scope.unMatchBets[i].MatchId == $stateParams.MatchId) && ($scope.unMatchBets[i].IsMatched == 0)) {
                                        if ($scope.unMatchBets[i].isBack == 0) {
                                            if (item.ex.availableToBack.length != 0 && $scope.unMatchBets[i].Odds <= (item.ex.availableToBack[0].price)) {
                                                $http.get('Betentrycntr/updateUnMatchedData/' + $scope.unMatchBets[i].MstCode + '/' + 0 + '/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function(data, status, headers, config) {
                                                    $scope.UserData = data.betUserData;
                                                    $scope.GetUserData();
                                                });
                                            }
                                        } else {
                                            if (item.ex.availableToLay.length != 0 && $scope.unMatchBets[i].Odds >= (item.ex.availableToLay[0].price)) {
                                                $http.get('Betentrycntr/updateUnMatchedData/' + $scope.unMatchBets[i].MstCode + '/' + 1 + '/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function(data, status, headers, config) {
                                                    $scope.UserData = data.betUserData;
                                                    $scope.GetUserData();
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    } catch (e) {} 
                }
            }                                       
            /*End of the code of Match and unmatch*/
            if ($scope.GetMarketBackLayData == angular.isUndefinedOrNull) {
                $scope.GetMarketBackLayData = response.data.MarketRunner;
                if (response.data.MarketRunner == angular.isUndefinedOrNull) {
                    try { $scope.GetMarketBackLayData.inplay = response.data.MarketRunner.inplay; } catch (e) { console.log('inplay--');
                        console.log(response.data.MarketRunner); }
                    $scope.GetMarketBackLayData.status = response.data.MarketRunner.status;
                    matchStatus = response.data.MarketRunner.status;
                    totalMatch = response.data.MarketRunner.totalMatched;
                    $scope.GetMarketBackLayData.totalMatched = response.data.MarketRunner.totalMatched;
                    if ($scope.GetMarketBackLayData.status == "CLOSED" || $scope.MatchResult == "CLOSED") {
                        $scope.callOddsCloseMatch();
                    }
                }
            } else if ($stateParams.MarketId == $scope.GetMarketBackLayData.marketId) {
                /*start code for other Api*/
                if($scope.MarketDelay == false){
                    selectedRunner = null;
                    if (response.data.MarketRunner != angular.isUndefinedOrNull ) {
                        selectedRunner = response.data.MarketRunner.runners;
                        try { $scope.GetMarketBackLayData.inplay = response.data.MarketRunner.inplay; } catch (e) { console.log('inplay--');
                            console.log(response.data.MarketRunner); }
                        $scope.GetMarketBackLayData.status = response.data.MarketRunner.status;
                        matchStatus = response.data.MarketRunner.status;                        
                        totalMatch = response.data.MarketRunner.totalMatched;
                        $scope.GetMarketBackLayData.totalMatched = response.data.MarketRunner.totalMatched;
                        if ($scope.GetMarketBackLayData.status == "OPEN" && $scope.GetMarketBackLayData.runners != angular.isUndefinedOrNull && $scope.GetMarketBackLayData.runners.length > 0) { //&& selectedRunner != angular.isUndefinedOrNull
                            try {
                                if ($scope.GetMarketBackLayData.runners.length < selectedRunner.length) //170204
                                    maxloop = selectedRunner.length;
                                else
                                    maxloop = $scope.GetMarketBackLayData.runners.length;
                                for (var j = 0; j < maxloop; j++) {
                                    if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack.length == selectedRunner[j].ex.availableToBack.length) {
                                        try {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].SELECTED = false;
                                            if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].price != selectedRunner[j].ex.availableToBack[0].price || $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].size != selectedRunner[j].ex.availableToBack[0].size) {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].SELECTED = true;
                                            }
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].price = selectedRunner[j].ex.availableToBack[0].price;
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].size = selectedRunner[j].ex.availableToBack[0].size;
                                        } catch (e) {
                                            if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[0] != angular.isUndefinedOrNull) {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].price = "";
                                            }
                                        }
                                        try {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].SELECTED = false;
                                            if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].price != selectedRunner[j].ex.availableToBack[1].price || $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].size != selectedRunner[j].ex.availableToBack[1].size) {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].SELECTED = true;
                                            }
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].price = selectedRunner[j].ex.availableToBack[1].price;
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].size = selectedRunner[j].ex.availableToBack[1].size;
                                        } catch (e) {
                                            if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[1] != angular.isUndefinedOrNull) {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].price = "";
                                            }
                                        }
                                        try {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].SELECTED = false;
                                            if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].price != selectedRunner[j].ex.availableToBack[2].price || $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].size != selectedRunner[j].ex.availableToBack[2].size) {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].SELECTED = true;
                                            }
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].price = selectedRunner[j].ex.availableToBack[2].price;
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].size = selectedRunner[j].ex.availableToBack[2].size;
                                        } catch (e) {
                                            if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[2] != angular.isUndefinedOrNull) {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].price = "";
                                            }
                                        }
                                    } else {

                                        $scope.GetMarketBackLayData.runners[j].ex.availableToBack = selectedRunner[j].ex.availableToBack;
                                    }
                                    if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay.length == selectedRunner[j].ex.availableToLay.length) {
                                        try {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].SELECTED = false;
                                            if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].price != selectedRunner[j].ex.availableToLay[0].price || $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].size != selectedRunner[j].ex.availableToLay[0].size) {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].SELECTED = true;
                                            }
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].price = selectedRunner[j].ex.availableToLay[0].price;
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].size = selectedRunner[j].ex.availableToLay[0].size;
                                        } catch (e) {
                                            if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[0] != angular.isUndefinedOrNull) {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].price = "";
                                            }
                                        }
                                        try {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].SELECTED = false;
                                            if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].price != selectedRunner[j].ex.availableToLay[1].price || $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].size != selectedRunner[j].ex.availableToLay[0].size) {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].SELECTED = true;
                                            }
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].price = selectedRunner[j].ex.availableToLay[1].price;
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].size = selectedRunner[j].ex.availableToLay[1].size;
                                        } catch (e) {
                                            if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[1] != angular.isUndefinedOrNull) {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].price = "";
                                            }
                                        }
                                        try {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].SELECTED = false;
                                            if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].price != selectedRunner[j].ex.availableToLay[2].price || $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].size != selectedRunner[j].ex.availableToLay[2].size) {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].SELECTED = true;
                                            }
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].price = selectedRunner[j].ex.availableToLay[2].price;
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].size = selectedRunner[j].ex.availableToLay[2].size;
                                        } catch (e) {
                                            if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[2] != angular.isUndefinedOrNull) {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].price = "";
                                            }
                                        }
                                    } else {

                                        $scope.GetMarketBackLayData.runners[j].ex.availableToLay = selectedRunner[j].ex.availableToLay;
                                    }
                                }
                            } catch (e) {

                                $scope.GetMarketBackLayData = angular.isUndefinedOrNull;
                            }
                            $scope.counter = $scope.counter + 1;
                        } else if ($scope.GetMarketBackLayData.status == "CLOSED" ){
                            $scope.GetMarketBackLayData = response.data.MarketRunner;
                            $scope.callOddsCloseMatch();
                        }
                    }else if ($scope.GetMarketBackLayData.status == "CLOSED") {
                        $scope.GetMarketBackLayData = response.data.MarketRunner;
                        $scope.callOddsCloseMatch();
                    }
                }else{
                    $http({
                        method: "GET",
                        url: "http://159.65.146.249/sanjuApiOdds?sportid=" + $stateParams.sportId + "&eventid=" + $scope.MatchId
                    }).success(function (data) {
                    //debugger;                       
                        selectedRunner = null;
                        var MarketRunner = $filter('filter')(data.result, { id: $stateParams.MarketId })[0];
                        if (MarketRunner != angular.isUndefinedOrNull ) {
                            selectedRunner = MarketRunner.runners;
                            try { $scope.GetMarketBackLayData.inplay = MarketRunner.inPlay; } catch (e) { console.log('inplay--');
                                console.log(MarketRunner); }
                            $scope.GetMarketBackLayData.status = MarketRunner.status;
                            matchStatus = MarketRunner.status;
                            
                            totalMatch = MarketRunner.matched;
                            $scope.GetMarketBackLayData.totalMatched = MarketRunner.matched;
                            if ($scope.GetMarketBackLayData.status == "OPEN" && $scope.GetMarketBackLayData.runners != angular.isUndefinedOrNull && $scope.GetMarketBackLayData.runners.length > 0) { //&& selectedRunner != angular.isUndefinedOrNull
                                try {
                                    if ($scope.GetMarketBackLayData.runners.length < selectedRunner.length) //170204
                                        maxloop = selectedRunner.length;
                                    else
                                        maxloop = $scope.GetMarketBackLayData.runners.length;
                                    for (var j = 0; j < maxloop; j++) { //170204 $scope.GetMarketBackLayData.runners.length
                                        if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack.length == selectedRunner[j].back.length) {
                                            try {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].SELECTED = false;
                                                if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].price != selectedRunner[j].back[0].price || $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].size != selectedRunner[j].back[0].size) {
                                                    $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].SELECTED = true;
                                                }
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].price = selectedRunner[j].back[0].price;
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].size = selectedRunner[j].back[0].size;
                                            } catch (e) {
                                                if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[0] != angular.isUndefinedOrNull) {
                                                    $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].price = "";
                                                }
                                            }
                                            try {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].SELECTED = false;
                                                if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].price != selectedRunner[j].back[1].price || $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].size != selectedRunner[j].back[1].size) {
                                                    $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].SELECTED = true;
                                                }
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].price = selectedRunner[j].back[1].price;
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].size = selectedRunner[j].back[1].size;
                                            } catch (e) {
                                                if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[1] != angular.isUndefinedOrNull) {
                                                    $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].price = "";
                                                }
                                            }
                                            try {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].SELECTED = false;
                                                if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].price != selectedRunner[j].back[2].price || $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].size != selectedRunner[j].back[2].size) {
                                                    $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].SELECTED = true;
                                                }
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].price = selectedRunner[j].back[2].price;
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].size = selectedRunner[j].back[2].size;
                                            } catch (e) {
                                                if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[2] != angular.isUndefinedOrNull) {
                                                    $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].price = "";
                                                }
                                            }
                                        } else {

                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack = selectedRunner[j].back;
                                        }
                                        if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay.length == selectedRunner[j].lay.length) {
                                            try {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].SELECTED = false;
                                                if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].price != selectedRunner[j].lay[0].price || $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].size != selectedRunner[j].lay[0].size) {
                                                    $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].SELECTED = true;
                                                }
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].price = selectedRunner[j].lay[0].price;
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].size = selectedRunner[j].lay[0].size;
                                            } catch (e) {
                                                if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[0] != angular.isUndefinedOrNull) {
                                                    $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].price = "";
                                                }
                                            }
                                            try {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].SELECTED = false;
                                                if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].price != selectedRunner[j].lay[1].price || $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].size != selectedRunner[j].lay[0].size) {
                                                    $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].SELECTED = true;
                                                }
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].price = selectedRunner[j].lay[1].price;
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].size = selectedRunner[j].lay[1].size;
                                            } catch (e) {
                                                if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[1] != angular.isUndefinedOrNull) {
                                                    $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].price = "";
                                                }
                                            }
                                            try {
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].SELECTED = false;
                                                if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].price != selectedRunner[j].lay[2].price || $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].size != selectedRunner[j].lay[2].size) {
                                                    $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].SELECTED = true;
                                                }
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].price = selectedRunner[j].lay[2].price;
                                                $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].size = selectedRunner[j].lay[2].size;
                                            } catch (e) {
                                                if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[2] != angular.isUndefinedOrNull) {
                                                    $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].price = "";
                                                }
                                            }
                                        } else {

                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay = selectedRunner[j].lay;
                                        }
                                    }
                                } catch (e) {

                                    $scope.GetMarketBackLayData = angular.isUndefinedOrNull;
                                }
                                $scope.counter = $scope.counter + 1;
                            } else if ($scope.GetMarketBackLayData.status == "CLOSED" ) //170201
                            {
                                $scope.GetMarketBackLayData = MarketRunner;
                                $scope.callOddsCloseMatch();
                            }
                        }else if ($scope.GetMarketBackLayData.status == "CLOSED") {
                            $scope.GetMarketBackLayData = MarketRunner;
                            $scope.callOddsCloseMatch();
                        }
                    }).error(function (err) {
                        console.log("err", err)
                    });
                }                
                /*End the code of other api*/
            } else {
                $scope.GetMarketBackLayData = response.data.MarketRunner;
                try { $scope.GetMarketBackLayData.inplay = response.data.MarketRunner.inplay; } catch (e) { console.log('inplay--');
                    console.log(response.data.MarketRunner); }
                $scope.GetMarketBackLayData.status = response.data.MarketRunner.status;
                matchStatus = response.data.MarketRunner.status;
                $scope.GetMarketBackLayData.totalMatched = response.data.MarketRunner.totalMatched;
            }
            marketTimer = $timeout(function() {                
                if ($scope.GetMarketBackLayData != angular.isUndefinedOrNull) {                    
                    for (var j = 0; j < maxloop; j++) {                        
                        try { $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].SELECTED = false; } catch (e) {}
                        try { $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].SELECTED = false; } catch (e) {}
                        try { $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].SELECTED = false; } catch (e) {}
                        try { $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].SELECTED = false; } catch (e) {}
                        try { $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].SELECTED = false; } catch (e) {}
                        try { $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].SELECTED = false; } catch (e) {}                    
                    }
                    if ($scope.GetMarketBackLayData.Status != 3) {
                        if ($scope.GetMarketBackLayData.marketId != null) {
                            $scope.callOddsFunc();                           
                        }
                    }
                } else {
                    $scope.callOddsFunc();                   
                }
            }, 1000);            
            var OnlineStatus = $interval(OnlineStatusChanged, 10000)
            var updatedOnline = function() {                
                if (navigator.onLine) {                    
                    $interval.cancel(Changed);
                    Changed = angular.isUndefinedOrNull;
                    location.reload();
                }
            }
            var Changed;
            function OnlineStatusChanged() {
                if (navigator.onLine) {
                    if (!$scope.netConn) {
                        $mdDialog.hide();
                        $scope.netConn = true;
                        $scope.callOddsFunc();                        
                    }
                } else {
                    Changed = $interval(updatedOnline, 100)
                    if ($scope.netConn) {
                        $mdDialog.show({
                            clickOutsideToClose: false,
                            escapeToClose: false,
                            template: "<md-dialog style='border: rgb(255, 0, 0) solid 2px;width: 300px;height: 100px;font-size:14px;font-weight:bold;'><md-dialog-content>Internet Connection is Disconnect... Please Wait...</md-dialog-content></md-dialog>",
                            locals: { prntScope: $scope },
                            fullscreen: false,
                            controller: function DialogController(prntScope) {
                                prntScope.netConn = false;
                            }
                        });
                    }
                }
            }
        });
    }
    $scope.callOddsCloseMatch = function() { 
       // 
        if ($scope.GetMarketBackLayData.status == "CLOSED") {
            var vSelectionID = $filter('filter')($scope.GetMarketBackLayData.runners, { status: "WINNER" })[0].selectionId;
            var selectionName1 = "";
            //for (var j = 0; j < $scope.GetMarketBackLayData.runners.length; j++) {
            //if ($scope.GetMarketBackLayData.runners[j].status == "WINNER") {

            if ($scope.RunnerValue != angular.isUndefinedOrNull && $scope.RunnerValue.length > 0 && $scope.RunnerValue[0].length > 0) //sourabh 170131
            {
                //
                selectionName1 = $filter('filter')($scope.RunnerValue, { SelectionId: vSelectionID })[0].selectionName;
                //for (var i = 0; i < $scope.RunnerValue.length; i++) {
                //if ($scope.RunnerValue[i].SelectionId == $scope.GetMarketBackLayData.runners[j].selectionId || $scope.RunnerValue[i].selectionId == $scope.GetMarketBackLayData.runners[j].selectionId) {
                //selectionName1 = $scope.RunnerValue[i].selectionName;
                if (selectionName1 != "")
                    $scope.saveMatchoddsResult($scope.MatchId, $scope.GetMarketInfo.SportID, $scope.MarketId, vSelectionID, 1, $scope.GetMarketInfo.SportName, $stateParams.matchName, $scope.GetMarketInfo.MarketName, selectionName1);
                //}
                //}
            } else {
                $http.get('Geteventcntr/getSelectionName/' + $scope.MarketId + '/' + $scope.MatchId).success(function(data, status, headers, config) {
                    //$scope.RunnerValue = data.RunnerValue;
                    selectionName1 = $filter('filter')(data.RunnerValue, { selectionId: vSelectionID })[0].selectionName;
                    if (selectionName1 != "")
                        //
                        $scope.saveMatchoddsResult($scope.MatchId, $scope.GetMarketInfo.SportID, $scope.MarketId, vSelectionID, 1, $scope.GetMarketInfo.SportName, $stateParams.matchName, $scope.GetMarketInfo.MarketName, selectionName1);
                });
            }
            //}
            //}
        } else if ($scope.MatchResult == "CLOSED") {
            $scope.GetMarketBackLayData.status = "CLOSED";
            $timeout.cancel(marketTimer);
            marketTimer = angular.isUndefinedOrNull;
            $rootScope.$broadcast('changeSidebar_Market', {});
            if (sessionService.get('type') == "1")
                $state.go('dashboard.Masterdashboard');
            else if (sessionService.get('type') == "2")
                $state.go('dashboard.Dealerdashboard');
            else if (sessionService.get('type') == "3")
                $state.go('dashboard.Userdashboard');

        }
    };
    $scope.UnMatchToMatchedData=function(Parametr){
       
        $http.get('Betentrycntr/updateUnMatchedData/' + Parametr.MstCode + '/' + Parametr.isBack + '/' + Parametr.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + Parametr.MatchId).success(function(data, status, headers, config) {
            $scope.UserData = data.betUserData;
            $scope.getBetsData();
        });
    }
    $scope.getValColor = function(val) {
        if (val == angular.isUndefinedOrNull || val == 0)
            return 'color:#000000';
        else if (val > 0)
            return 'color:#1ed61e';
        else
            return 'color:#ff0000';
    }
    $scope.getOddCalcVal = function(a, ovType) {
        var x = 0,
            y = 0,
            z = 0;
        switch (ovType) {
            case 1:
                if (a != angular.isUndefinedOrNull) {
                    x = a;
                    if ($scope.oddsLimit != angular.isUndefinedOrNull) y = $scope.oddsLimit;
                }
                z = parseFloat((parseFloat(x) + parseFloat(y)).toFixed(2));
                break;
            case 2:
                if (a != angular.isUndefinedOrNull) {
                    x = a;
                    if ($scope.volumeLimit != angular.isUndefinedOrNull) y = $scope.volumeLimit;
                }
                z = parseFloat((parseFloat(x) * parseFloat(y)).toFixed(0));
                break;
        }
        if (z > 0) return z;
        else return "";
    }
    $scope.getNameFunc();
    $scope.callOddsFunc();
    $scope.$on("$destroy", function(event) {
        $timeout.cancel(marketTimer);
        marketTimer = angular.isUndefinedOrNull;
    });
}]);
app.directive('crntusrpsn', function() { 
    return {
        templateUrl: 'app/scripts/directives/timeline/Matchodds_crntusr_psn.html',
        restrict: 'E',
        replace: true,
        scope: {},
        link: function (scope, element, attrs) {            
          
            scope.$on('update_cntrusrpos', function (event, data) { scope.getUserPosition(1, 0); });           

        },
        controller: ['$scope', '$http', '$stateParams', 'sessionService', '$interval','$timeout', function($scope, $http, $stateParams, sessionService, $interval,$timeout) {
            $scope.getUserPosition = function(userId, userType) {
               
                $scope.crntusep_userId = userId;
                $scope.crntusep_userType = userType;
                if (userType != "3") {
                    $http.get(BASE_URL + 'Usercurrntposicntr/getUserPosition/' + userId + '/' + userType + '/' + $stateParams.MatchId + '/' + $stateParams.MarketId).success(function(data, status, headers, config) {
                        
                        $scope.totalTeamA = 0;
                        $scope.totalTeamB = 0;
                        $scope.totaltheDraw = 0;
                        $scope.userPosition = data.userPosition;
                        $scope.userOwnPosition = data.userOwnPosition;
                        if ($scope.userPosition != angular.isUndefinedOrNull) //sourabh 170107
                            for (var i = 0; i < $scope.userPosition.result_array.length; i++) {
                                $scope.totalTeamA = parseFloat($scope.totalTeamA) + parseFloat($scope.userPosition.result_array[i].TeamA);
                                $scope.totalTeamB = parseFloat($scope.totalTeamB) + parseFloat($scope.userPosition.result_array[i].TeamB);
                                $scope.totaltheDraw = parseFloat($scope.totaltheDraw) + parseFloat($scope.userPosition.result_array[i].theDraw);
                            }
                        /*console.log($scope.totalTeamA);
                         //
                         alert($scope.totalTeamA);*/
                    });
                }
            }
            $scope.getCrntUserPosition_Back = function() {
                $scope.crntusep_userId = sessionService.get('user_id');
                $scope.crntusep_userType = sessionService.get('type');
                $scope.getCrntUserPosition();
            }
            $scope.getUserPosition(sessionService.get('user_id'), sessionService.get('type'));
            $scope.getCrntUserPosition = function() {
                $scope.getUserPosition($scope.crntusep_userId, $scope.crntusep_userType);
            }
            $scope.$on("$destroy", function(event) {
                $timeout.cancel($scope.si_getCrntUserPosition);
                
            });
        }]
    }
});

