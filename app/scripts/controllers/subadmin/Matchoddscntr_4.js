app.controller('Matchoddscntr', ['$scope', '$http', '$stateParams', 'sessionService', '$timeout', 'Dialog', '$rootScope', 'deviceDetector', 'get_userser', '$mdDialog', 'speech', '$filter', '$location', '$state', '$interval', function($scope, $http, $stateParams, sessionService, $timeout, Dialog, $rootScope, deviceDetector, get_userser, $mdDialog, speech, $filter, $location, $state, $interval) {
    $scope.$on('test_dir', function(event, data) { $scope.getNameFunc(); });
    $scope.PLAYPAUSE=0;
    var marketTimer;
    $scope.loading = false;
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
    $scope.date = $stateParams.date;
    $scope.UserTypeId = sessionService.get('slctUseTypeID');
    $scope.UserId = sessionService.get('slctUseID');
    $scope.displayTable = false;
    $scope.logInTypeId = sessionService.get('slctUseTypeID');
    $scope.logInId = sessionService.get('slctUseID');
    var MarketId = $stateParams.MarketId;
    var matchStatus = "OPEN";
    get_userser.userChipSetting(function(response) {
        $rootScope.userPlcBtn = response;
        $rootScope.MyLenth = response.length;
    });
    $scope.GetScore=function(){      
            var eventIds = $stateParams.MatchId;
         //var eventIds = '28448035';
        $http.get(BASE_URL+'Geteventcntr/GetScoreApi/'+eventIds).then(function(result) {
            
            if (result.data.length!= 0) {
                $scope.Documents=result.data[0];
                $scope.displayScore=true;
                if($scope.Documents.eventTypeId==2){
                    $scope.Home=result.data[0].score.home.gameSequence;
                    $scope.away=result.data[0].score.away.gameSequence;
                }
            }else{
                $scope.displayScore=false;
                $interval.cancel($scope.stopScore);
            }
        });
    }
    $scope.stopScore = $interval(function () {
                    //Display the current time.
       $scope.GetScore();
    }, 5000);

    
    $scope.styleColor=function(value){
        if(value < 0){
            return "RED";
        }else{
            return "GREEN";
        }

    }

    /*strt ag grid code*/
    
    /*End of AG-Grid*/
    /*$scope.countdown = function() {
        stopped = $timeout(function() {
            $http.get('Betentrycntr/GatBetData/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function(data, status, headers, config) {
                
                $scope.MatchedBets = [];
                $scope.SessiondBets = [];
                $scope.UnmatchedBets = [];
                $scope.UserData = data.betUserData;
               // $scope.SessionData=$filter('filter')(data.betUserData, {MarketId:2 });
               if(data.betUserData.length != $scope.UserData){
                    angular.forEach($scope.UserData, function (value, index) {
                        
                        if (value.IsMatched == "1" && value.MarketId =="2"){
                                $scope.SessiondBets.push(value);
                        }else if(value.IsMatched == "1" && value.MarketId !="2"){
                                $scope.MatchedBets.push(value);

                        }
                        else if(value.IsMatched == "0"){
                            $scope.UnmatchedBets.push(value);
                        }
                    });
               }
               setRowData($scope.MatchedBets, 'Ma');
               
            });
            $scope.countdown();
        }, 1000);
    };
    $scope.countdown();*/
    $scope.getOddValue = function(item, priceVal, matchId, back_layStatus, placeName, selectionId) {
       ////debugger;
        $scope.UserTypeId = sessionService.get('type');
        $scope.UserId = sessionService.get('slctUseID');
        $scope.ParantId = sessionService.get('slctParantID');
        $scope.loginId = sessionStorage.user_id;
        $scope.slctUseTypeID = sessionService.get('slctUseTypeID');
        $scope.stake = 0;
        $scope.priceVal = parseFloat(priceVal.toFixed(2));
        $scope.MatchId = $scope.MatchId;
        $scope.displayTable = true;
        $scope.acc = 1;
        $scope.formStatus = back_layStatus;
        $scope.placeName = placeName;
        $scope.selectionId = selectionId;
        var s = item.currentTarget.getAttribute("data-id");
        $scope.testModel = parseFloat(priceVal);
        var oldPnLValue1 = 0;
        $scope.slctProfit = 0;
        if ($scope.RunnerValue != angular.isUndefinedOrNull && $scope.RunnerValue.length != angular.isUndefinedOrNull) {
            if ($scope.formStatus == '1') {
                oldPnLValue1 = $filter('filter')($scope.RunnerValue, { SelectionId: $scope.selectionId })[0]; //170316
                $scope.oldPnLValue = $scope.getSumValPnL(oldPnLValue1.winValue, oldPnLValue1.lossValue);
                $scope.slctProfit = $scope.getSumValPnL(oldPnLValue1.winValue, oldPnLValue1.lossValue);
            } else {
                var minVal = 0;
                if ($scope.RunnerValue.length == 2) {
                    // oldPnLValue1 =$filter('filter')($scope.RunnerValue, { SelectionId: $scope.selectionId })[0];
                    $scope.RunnerValue.find(function(item, j) {
                        if (item.SelectionId != $scope.selectionId) {
                            minVal = (parseFloat(item.winValue) + parseFloat(item.lossValue));
                            if (minVal >= 0) {

                            } else {
                                minVal = 0;
                            }
                            // alert(minVal);
                        }
                    });
                } else if ($scope.RunnerValue.length > 2) {
                    $scope.arrayText = [];
                    //oldPnLValue1 =$filter('filter')($scope.RunnerValue, { SelectionId: $scope.selectionId })[0];
                    $scope.RunnerValue.find(function(item, j) {
                        var selectionVal = (parseFloat(item.winValue) + parseFloat(item.lossValue));
                        if (item.SelectionId != $scope.selectionId) {
                            //var t=(parseFloat(item.winValue) + parseFloat(item.lossValue));
                            var t1 = (parseFloat(item.winValue) + parseFloat(item.lossValue));
                            $scope.arrayText.push(t1);
                            console.log("Push+===" + $scope.arrayText);
                        }
                    });
                    minVal = Math.min.apply(Math, $scope.arrayText.map(function(item) { return item; }));
                    if (minVal < 0) {
                        minVal = 0;
                    };
                }
                $scope.oldPnLValue = minVal;
            }
        } else {
            $scope.oldPnLValue = 0;
        }
    };
    $scope.reset_all_selection = function() {
        $scope.acc = 0;
        $scope.stake = 0;
    };
    /*$scope.GetUserData=function(){
        $http.get('Betentrycntr/GatBetData/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function(data, status, headers, config) {
            
            $scope.MatchedBets = [];
            $scope.SessiondBets = [];
            $scope.UnmatchedBets = [];
            $scope.UserData = data.betUserData;
           // $scope.SessionData=$filter('filter')(data.betUserData, {MarketId:2 });
            angular.forEach($scope.UserData, function (value, index) {
                    
                if (value.IsMatched == "1" && value.MarketId =="2"){
                        $scope.SessiondBets.push(value);
                }else if(value.IsMatched == "1" && value.MarketId !="2"){
                        $scope.MatchedBets.push(value);
                }
                else if(value.IsMatched == "0"){
                    $scope.UnmatchedBets.push(value);
                }
            });
             setRowData($scope.MatchedBets, 'Ma');
        });
    }
    $scope.GetUserData();*/
    
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
                   //debugger;
                    //$rootScope.$broadcast('changeSidebar_Market', {});
                     $scope.PLAYPAUSE=$filter('filter')(data.MatchMarket, { Id: $scope.MarketId })[0].IsPlay;                                   
                    // if (sessionService.get('type') == "1")
                    //     $state.go('dashboard.Masterdashboard');
                    // else if (sessionService.get('type') == "2")
                    //     $state.go('dashboard.Dealerdashboard');
                    // else if (sessionService.get('type') == "3")
                    //     $state.go('dashboard.Userdashboard');
                } catch (e) { console.log(data.status.error); }
            });
    }
    $scope.getNameFunc = function() {
        var user_id = sessionService.get('slctUseID');
        var user_type = sessionService.get('slctUseTypeID');
        //
        $http.get('Geteventcntr/getBackLaysOfMarketSelectionName/' + $scope.MarketId + '/' + user_id + '/' + user_type + '/' + $scope.MatchId).success(function(data, status, headers, config) ///sourabh 161226 change
            {
                //
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
        if(a==angular.isUndefinedOrNull && b==angular.isUndefinedOrNull){
            a=0;
            b=0;
        }

        return (parseFloat(a) + parseFloat(b));
    }
    $scope.counter = 0;
    var totalMatch = 0;
    var selectedRunner = null;
    $scope.$on("$destroy", function(event) {
    $interval.cancel($scope.stopScore);
        $timeout.cancel($scope.callOddsFunc);
        $scope.callOddsFunc = angular.isUndefinedOrNull;
    });
    $scope.callOddsFunc = function() {
        var maxloop = 0;
        if (sessionService.get('slctUseTypeID') == 3) {
            $scope.UserId = sessionService.get('slctUseID');
            get_userser.GetWALLibiInfo($scope.UserId);
        } else {
            $scope.UserId = sessionService.get('user_id');
            get_userser.GetWALLibiInfo($scope.UserId);
        }
        var $promise = $http.get('Geteventcntr/getBackLaysOfMarket/' + MarketId + '/' + $stateParams.MatchId);
        $promise.then(function(response) {
            //For Play Pause start
            if (sessionService.get('type') != "0") {
                $http({
                    method: 'POST',
                    url: 'Geteventcntr/matchMarketLst/',
                    data: {
                        matchId: $stateParams.MatchId,
                        sportsId: 4,
                        user_id: sessionService.get('user_id')
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(data) {
                    try {
                      // debugger;
                       
                       $scope.FancyLength=data.getMatchFancy.length;
                       if($scope.FancyLength > 0){
                            for (var i = 0; i < data.getMatchFancy.length; i++) {
                                if($scope.FancyData[i].SessInptYes==data.getMatchFancy[i].SessInptYes && $scope.FancyData[i].SessInptNo==data.getMatchFancy[i].SessInptNo && $scope.FancyData[i].active==data.getMatchFancy[i].SessInptNo){

                                }else{
                                     $scope.FancyData=data.getMatchFancy;
                                }
                            }
                        }
                        if ($filter('filter')(data.MatchMarket, { Id: $scope.MarketId })[0].IsPlay == "1") {

                            $rootScope.$broadcast('changeSidebar_Market', {});
                           

                        }
                         $scope.PLAYPAUSE=$filter('filter')(data.MatchMarket, { Id: $scope.MarketId })[0].IsPlay;
                    } catch (e) {}
                });
            }
            //For Play Pause end
            if (response.data.MatchOddsVolVal != angular.isUndefinedOrNull) {
                if (response.data.MatchOddsVolVal[0].oddsLimit != angular.isUndefinedOrNull)
                    $scope.oddsLimit = parseFloat(response.data.MatchOddsVolVal[0].oddsLimit);
                else
                    $scope.oddsLimit = 0;
                if (response.data.MatchOddsVolVal[0].volumeLimit != angular.isUndefinedOrNull && response.data.MatchOddsVolVal[0].volumeLimit != 0)
                    $scope.volumeLimit = parseFloat(response.data.MatchOddsVolVal[0].volumeLimit);
                else
                    $scope.volumeLimit = 1;
                if (response.data.MatchOddsVolVal[0].result != "0")
                    $scope.MatchResult = "CLOSED";
                else
                    $scope.MatchResult = "OPEN";
            }
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
            } else if (MarketId == $scope.GetMarketBackLayData.marketId) {
                selectedRunner = null;
                if (response.data.MarketRunner != angular.isUndefinedOrNull ) {//&& response.data.MarketRunner.totalMatched > totalMatch
                    selectedRunner = response.data.MarketRunner.runners;
                    try { $scope.GetMarketBackLayData.inplay = response.data.MarketRunner.inplay; } catch (e) { console.log('inplay--');
                        console.log(response.data.MarketRunner); }
                    $scope.GetMarketBackLayData.status = response.data.MarketRunner.status;
                    matchStatus = response.data.MarketRunner.status;
                    //$scope.GetMarketBackLayData.IsActive = data.IsActive;
                    totalMatch = response.data.MarketRunner.totalMatched;
                    $scope.GetMarketBackLayData.totalMatched = response.data.MarketRunner.totalMatched;
                    if ($scope.MatchResult == "OPEN" && $scope.GetMarketBackLayData.status == "OPEN" && $scope.GetMarketBackLayData.runners != angular.isUndefinedOrNull && $scope.GetMarketBackLayData.runners.length > 0) { //&& selectedRunner != angular.isUndefinedOrNull
                        try {
                            if ($scope.GetMarketBackLayData.runners.length < selectedRunner.length) //170204
                                maxloop = selectedRunner.length;
                            else
                                maxloop = $scope.GetMarketBackLayData.runners.length;
                            for (var j = 0; j < maxloop; j++) { //170204 $scope.GetMarketBackLayData.runners.length
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
                    } else if ($scope.GetMarketBackLayData.status == "CLOSED" || $scope.MatchResult == "CLOSED") //170201
                    {
                        $scope.GetMarketBackLayData = response.data.MarketRunner;
                        $scope.callOddsCloseMatch();
                    }
                } else if ($scope.GetMarketBackLayData.status == "CLOSED" || $scope.MatchResult == "CLOSED") //170201
                {
                    $scope.GetMarketBackLayData = response.data.MarketRunner;
                    $scope.callOddsCloseMatch();

                }
            } else {
                $scope.GetMarketBackLayData = response.data.MarketRunner;
                try { $scope.GetMarketBackLayData.inplay = response.data.MarketRunner.inplay; } catch (e) { console.log('inplay--');
                    console.log(response.data.MarketRunner); }
                $scope.GetMarketBackLayData.status = response.data.MarketRunner.status;
                matchStatus = response.data.MarketRunner.status;
                $scope.GetMarketBackLayData.totalMatched = response.data.MarketRunner.totalMatched;
            }
            marketTimer = $timeout(function() {
                //debugger;
                if ($scope.GetMarketBackLayData != angular.isUndefinedOrNull) { //sourabh 170107
                    for (var j = 0; j < maxloop; j++) { // $scope.GetMarketBackLayData.runners.length 170204
                        //for (var i = 0; i < 3; i++) {//$scope.GetMarketBackLayData.runners[j].ex.availableToBack.length
                        try { $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].SELECTED = false; } catch (e) {}
                        try { $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].SELECTED = false; } catch (e) {}
                        try { $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].SELECTED = false; } catch (e) {}
                        try { $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].SELECTED = false; } catch (e) {}
                        try { $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].SELECTED = false; } catch (e) {}
                        try { $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].SELECTED = false; } catch (e) {}
                        //}
                    }
                    if ($scope.GetMarketBackLayData.Status != 3) {
                        if ($scope.GetMarketBackLayData.marketId != null) {
                            $scope.callOddsFunc();
                            $scope.getNameFunc();
                        }
                    }
                } else {
                    $scope.callOddsFunc();
                    $scope.getNameFunc();
                }
            }, 500);
            /*{aakash 161226*/
            var OnlineStatus = $interval(OnlineStatusChanged, 10000)
            var updatedOnline = function() {
                //console.log("akash2", navigator.onLine)
                if (navigator.onLine) {
                    //clearInterval(Changed);
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
                        $scope.getNameFunc();
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
            /*}aakash 161226*/
        });
        //}
    }
    $scope.callOddsCloseMatch = function() { //sourabh 15-nov-2016
       ////debugger;
        if ($scope.GetMarketBackLayData.status == "CLOSED") {
            var vSelectionID = $filter('filter')($scope.GetMarketBackLayData.runners, { status: "WINNER" })[0].selectionId;
            var selectionName1 = "";
            //for (var j = 0; j < $scope.GetMarketBackLayData.runners.length; j++) {
            //if ($scope.GetMarketBackLayData.runners[j].status == "WINNER") {

            if ($scope.RunnerValue != angular.isUndefinedOrNull && $scope.RunnerValue.length > 0 && $scope.RunnerValue[0].length > 0) //sourabh 170131
            {
                //debugger;
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
                        //debugger;
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
            /*if (sessionService.get('type') == "1")
                $state.go('dashboard.Masterdashboard');
            else if (sessionService.get('type') == "2")
                $state.go('dashboard.Dealerdashboard');
            else if (sessionService.get('type') == "3")
                $state.go('dashboard.Userdashboard');*/

        }

    };
    $scope.getCheckLimitorVal = function(formdata) {
        get_userser.getCheckLimitOfPlaceBet(sessionService.get('slctUseID'), $stateParams.MatchId, $stateParams.MarketId, function(data) {

            $scope.viewUserAc1 = data.viewUserAc2[0];
            $scope.checkStakeLimit($scope.formData);
        });
        if ($scope.RunnerValue != angular.isUndefinedOrNull && $scope.RunnerValue.length > 0) {
            var vMaxProfit = 0,
                vMaxLoss = 0;
            $scope.RunnerValue.find(function(item, j) {
                if ($scope.formData.selectionId == item.SelectionId) {
                    if ($scope.formStatus == 0) {
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (($scope.formData.priceVal * $scope.formData.stake) - $scope.formData.stake)) < vMaxLoss) {
                            vMaxLoss = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (($scope.formData.priceVal * $scope.formData.stake) - $scope.formData.stake));
                        }
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (($scope.formData.priceVal * $scope.formData.stake) - $scope.formData.stake)) > vMaxProfit) {
                            vMaxProfit = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (($scope.formData.priceVal * $scope.formData.stake) - $scope.formData.stake));
                        }

                    } else {
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake - ($scope.formData.priceVal * $scope.formData.stake))) < vMaxLoss) {
                            vMaxLoss = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake - ($scope.formData.priceVal * $scope.formData.stake)));
                        }
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake - ($scope.formData.priceVal * $scope.formData.stake))) > vMaxProfit) {
                            vMaxProfit = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake - ($scope.formData.priceVal * $scope.formData.stake)));
                        }
                    }
                } else {
                    if ($scope.formStatus == 0) {
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (-$scope.formData.stake)) < vMaxLoss) {
                            vMaxLoss = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (-$scope.formData.stake));
                        }
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (-$scope.formData.stake)) > vMaxProfit) {
                            vMaxProfit = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (-$scope.formData.stake));
                        }
                    } else {
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake)) < vMaxLoss) {
                            vMaxLoss = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake));
                        }
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake)) > vMaxProfit) {
                            vMaxProfit = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake));
                        }
                    }
                }
            });
            $scope.SlMaxProfit = vMaxProfit;
            $scope.SlMaxLoss = vMaxLoss;
            console.log("" + $scope.SlMaxProfit + "|||||" + $scope.SlMaxLoss);
        }
    }
   
    $scope.getValColor = function(val) { //20-dec-2016 asha
        if (val == angular.isUndefinedOrNull || val == 0)
            return 'color:#000000';
        else if (val > 0)
            return 'color:#007c0e';
        else
            return 'color:#ff0000';
    }
    $scope.getOddCalcVal = function(a, ovType) { //sourabh 161229
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
    //$scope.countdown();

    $scope.$on("$destroy", function(event) {
        $timeout.cancel(marketTimer);
        marketTimer = angular.isUndefinedOrNull;
    });
    /*start code for Fancy*/
    $scope.$on("$destroy", function(event) {
                //clearInterval($scope.si_getMatchUnmatchData);
                //clearInterval(si_fancyData);
                $interval.cancel($scope.si_getMatchUnmatchData);
                $interval.cancel(si_fancyData);

                $scope.si_getMatchUnmatchData = angular.isUndefinedOrNull;
                si_fancyData = angular.isUndefinedOrNull;
            }); //sourabh 170124

           
           
    /*end of the code Fancy*/

    $scope.getFancyList = function() {
        get_userser.getSessionFancy($stateParams.MatchId, 4, function(response) {
            $scope.FancyData = response;            
        });
    }
    $scope.getFancyList();

}]);
app.directive('crntusrpsn', function() { //sourabh 170118
    return {
        templateUrl: 'app/scripts/directives/timeline/Matchodds_crntusr_psn.html',
        restrict: 'E',
        replace: true,
        scope: {},
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
            } //sourabh 170127
            $scope.si_getCrntUserPosition = $timeout($scope.getCrntUserPosition, 3000);
            $scope.$on("$destroy", function(event) {
                $timeout.cancel($scope.si_getCrntUserPosition);
                //clearInterval($scope.si_getCrntUserPosition);
            }); //sourabh 170124
        }]
    }
});
app.directive('matchunmatchlist', function() { //sourabh 170118
    return {
        templateUrl: 'app/scripts/directives/timeline/matchUnmatch.html',
        restrict: 'AE',
        replace: true,
        scope: {
            showFancy: "=fancy",
            showBetSlip: "=betslip",
            acc2: "@acc2"
        },
        link: function(scope, element, attrs) { //sourabh 170120
            console.log('attrs>>', scope);
            scope.$on('changeText', function(event, data) {
                scope.getBetsData1();
            });
            
        },
        controller: ['$scope', '$http', '$stateParams', 'sessionService', '$interval', 'Dialog', 'get_userser', 'deviceDetector', 'speech', 'focus', '$rootScope','$timeout','$filter', function($scope, $http, $stateParams, sessionService, $interval, Dialog, get_userser, deviceDetector, speech, focus, $rootScope,$timeout,$filter) { //sourabh 170125
            $scope.USERTYPE = sessionService.get('type');
            $scope.UnmatchedBets={};
            $scope.MatchId = $stateParams.MatchId;
            $scope.MarketId = $stateParams.MarketId;
            ////////debugger;
            $scope.betMaUn = 1;
            $scope.SetFValue=0;
            $scope.showBetsData1=false;
            // code commented by manish  12_10_2017
            $scope.getMatchUnmatchData = function() {
                //////debugger;
                if ($scope.$parent.GetMarketBackLayData != angular.isUndefinedOrNull && $scope.$parent.GetMarketBackLayData.status != "CLOSED" && $scope.$parent.MatchResult != "CLOSED") {
                    $http.get('Betentrycntr/GatBetData/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function(data, status, headers, config) {
                            //////debugger;
                        var oldUserData = 0;
                        if ($scope.UserData != angular.isUndefinedOrNull) oldUserData = $scope.UserData.length;
                        $scope.UserData = data.betUserData;
                        // console.log('8**************************',$scope.UserData,'.......................',data.betUserData.length,'-----------------------',oldUserData);
                        if (oldUserData != data.betUserData.length ) 
                            $scope.getBetsData();
                            try {
                                for (var i = 0; i < $scope.UserData.length; i++) {
                                    if ($scope.$parent.GetMarketBackLayData != angular.isUndefinedOrNull) {
                                        $scope.$parent.GetMarketBackLayData.runners.find(function(item, j) {
                                            if (item.selectionId == $scope.UserData[i].SelectionId && ($scope.$parent.GetMarketBackLayData.marketId == $scope.UserData[i].MarketId) && ($scope.UserData[i].MatchId == $stateParams.MatchId) && ($scope.UserData[i].IsMatched == 0)) {
                                                if ($scope.UserData[i].isBack == 0) {
                                                    if (item.ex.availableToBack.length != 0 && $scope.UserData[i].Odds <= (item.ex.availableToBack[0].price + $scope.$parent.oddsLimit)) {
                                                        /*$http.get('Betentrycntr/updateUnMatchedData/' + $scope.UserData[i].MstCode + '/' + 0 + '/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function(data, status, headers, config) {
                                                            $scope.UserData = data.betUserData;
                                                            $scope.getBetsData();
                                                        });*/
                                                    }
                                                } else {
                                                    if (item.ex.availableToLay.length != 0 && $scope.UserData[i].Odds >= (item.ex.availableToLay[0].price + $scope.$parent.oddsLimit)) {
                                                        /*$http.get('Betentrycntr/updateUnMatchedData/' + $scope.UserData[i].MstCode + '/' + 1 + '/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function(data, status, headers, config) {
                                                            $scope.UserData = data.betUserData;
                                                            $scope.getBetsData();
                                                        });*/
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }
                            } catch (e) {}
                    });
                } else if ($scope.$parent.GetMarketBackLayData != angular.isUndefinedOrNull) {
                    $interval.cancel($scope.si_getMatchUnmatchData);
                    $interval.cancel(si_fancyData);
                    $scope.si_getMatchUnmatchData = angular.isUndefinedOrNull;
                    si_fancyData = angular.isUndefinedOrNull;
                }
            }
            var columnDefs = [
                {
                    headerName: "Sno", width: 50, field: "SrNo",suppressMenu:true, cellClass: function (params) { return (params.data.isBack == 1 ? 'lay-head' : 'back-head'); }
                },

                {
                    headerName: "Runner", width: 150, field: "selectionName", cellClass: function (params) {
                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');
                    }
                },
                {
                    headerName: "Odds", width: 80, field: "Odds", cellClass: function (params) {
                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');
                    }
                },
                {
                    headerName: "Stake", width: 80, field: "Stack", cellClass: function (params) {
                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');
                    }
                },
                {
                    headerName: "P&L", width: 80, field: "P_L", cellClass: function (params) {
                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');
                    }
                },
                {
                    headerName: 'Time', width: 140, field: "MstDate", cellClass: function (params) {
                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');
                    }
                },
                {
                    headerName: "Id", width: 60, field: "MstCode", cellClass: function (params) { return (params.data.isBack == 1 ? 'lay-head' : 'back-head'); }
                },
            ];
            var columnDefsUn = [
                // this row just shows the row index, doesn't use any data from the row
                { headerName: "Sno", width: 30, field: "SrNo", cellClass: function (params) { return (params.data.isBack == 1 ? 'lay-head' : 'back-head'); } },
                
                

               
                {
                    headerName: "Runner", width: 100, field: "selectionName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                },

                {

                    headerName: "Odds", width: 80, field: "Odds", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                },

                {

                    headerName: "Stake", width: 80, field: "Stack", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                },

                {

                    headerName: "P&L", width: 80, field: "P_L", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                },

                {

                    headerName: 'Time', width: 140, field: "MstDate", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                },
                {
                    headerName: "Id", width: 60, field: "MstCode", cellClass: function (params) { return (params.data.isBack == 1 ? 'lay-head' : 'back-head'); }
                }

            ];
            var columnDefsSess = [
                // this row just shows the row index, doesn't use any data from the row
                { headerName: "Sno", width: 30, field: "SrNo", cellClass: function (params) { return (params.data.isBack == 1 ? 'lay-head' : 'back-head'); } },
               
                {
                    headerName: "Runner", width: 110, field: "selectionName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                },

                {

                    headerName: "Odds", width: 100, field: "Odds", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                },

                {

                    headerName: "Stake", width: 80, field: "Stack", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                },

                {

                    headerName: "P&L", width: 80, field: "P_L", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                },

                {

                    headerName: 'Time', width: 140, field: "MstDate", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                },
                {
                    headerName: "Id", width: 60, field: "MstCode", cellClass: function (params) { return (params.data.isBack == 1 ? 'lay-head' : 'back-head'); }
                }

            ];
            
            if (sessionService.get('type') == 0) {

                columnDefs.splice(2, 0, {

                    headerName: "Client", width: 110, field: "userName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });

                columnDefs.splice(2, 0, {

                    headerName: "Dealer", width: 110, field: "ParantName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });

                columnDefs.splice(2, 0, {

                    headerName: "Master", width: 110, field: "MasterName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });
                columnDefs.splice(8, 0, {

                    headerName: "IP ADDRESS", width: 110, field: "ip", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });
                

                columnDefsUn.splice(2, 0, {

                    headerName: "Client", width: 110, field: "userName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });

                columnDefsUn.splice(2, 0, {

                    headerName: "Dealer", width: 110, field: "ParantName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });

                columnDefsUn.splice(2, 0, {

                    headerName: "Master", width: 110, field: "MasterName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });
                columnDefsUn.splice(1, 0, {

                    headerName: "MatchedTest", width: 100, cellRenderer: ageCellRendererFunc2, cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });
                columnDefsUn.splice(1, 0, {

                    headerName: "Action", width: 50,suppressMenu:true, cellRenderer: ageCellRendererFunc, cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });
                columnDefsUn.splice(8, 0, {

                    headerName: "IP ADDRESS", width: 110, field: "ip", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });
                
                columnDefsSess.splice(2, 0, {

                    headerName: "Client", width: 100, field: "userName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });

                columnDefsSess.splice(2, 0, {

                    headerName: "Dealer", width: 100, field: "ParantName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });

                columnDefsSess.splice(2, 0, {

                    headerName: "Master", width: 110, field: "MasterName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });
                columnDefsSess.splice(8, 0, {

                    headerName: "IP ADDRESS", width: 110, field: "ip", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });
                /*columnDefsUn.push({

                    headerName: 'Matched',
                    width: 100,
                    cellRenderer: ageCellRendererFunc2,
                    cellClass: function(params) {
                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');
                    }

                });*/
                // add New button for Unmatched To Matched
               /* columnDefs.push({

                    headerName: 'Action',
                    width: 100,
                    cellRenderer: ageCellRendererFunc1,
                    cellClass: function(params) {
                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');
                    }

                });*/
                // End  Of add New button for Unmatched To Matched
                /*columnDefsSess.push({

                    headerName: 'Action',
                    width: 100,
                    cellRenderer: ageCellRendererFunc1,
                    cellClass: function(params) {
                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');
                    }

                });*/

            }
            else if (sessionService.get('type') == 1) {

                columnDefs.splice(2, 0, {

                    headerName: "Dealer", width: 110, field: "ParantName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });

                columnDefs.splice(2, 0, {

                    headerName: "Client", width: 110, field: "userName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });

                columnDefsUn.splice(2, 0, {

                    headerName: "Dealer", width: 110, field: "ParantName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });

                columnDefsUn.splice(2, 0, {

                    headerName: "Client", width: 110, field: "userName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });
                 columnDefsSess.splice(2, 0, {

                    headerName: "Dealer", width: 110, field: "ParantName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });

                columnDefsSess.splice(2, 0, {

                    headerName: "Client", width: 110, field: "userName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });
                /*columnDefs.push({

                    headerName: 'Action',
                    width: 100,
                    cellRenderer: ageCellRendererFunc1,
                    cellClass: function(params) {
                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');
                    }

                });
                columnDefsSess.push({

                    headerName: 'Action',
                    width: 100,
                    cellRenderer: ageCellRendererFunc1,
                    cellClass: function(params) {
                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');
                    }

                });*/

            }
            else if (sessionService.get('type') == 2) {

                columnDefs.splice(2, 0, {

                    headerName: "Client", width: 110, field: "userName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });

                columnDefsUn.splice(2, 0, {

                    headerName: "Client", width: 110, field: "userName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });
                columnDefsSess.splice(2, 0, {

                    headerName: "Client", width: 110, field: "userName", cellClass: function (params) {

                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');

                    }

                });
                /*columnDefs.push({

                    headerName: 'Action',
                    width: 100,
                    cellRenderer: ageCellRendererFunc1,
                    cellClass: function(params) {
                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');
                    }

                });
                columnDefsSess.push({

                    headerName: 'Action',
                    width: 100,
                    cellRenderer: ageCellRendererFunc1,
                    cellClass: function(params) {
                        return (params.data.isBack == 1 ? 'lay-head' : 'back-head');
                    }

                });*/
            }else if (sessionService.get('type') == 3 || sessionService.get('type') == 0) {
                {
                    /*columnDefsUn.push({

                        headerName: 'Action', width: 100, cellRenderer: ageCellRendererFunc, cellClass: function (params) {
                            return (params.data.isBack == 1 ? 'lay-head' : 'back-head');
                        }
                    });*/
                }
               
            }
            function ageCellRendererFunc(params) {

                var eSpan = document.createElement('button');

                eSpan.className = "del-btn";

                //eSpan.innerHTML = '<img src="http://www.google.com/intl/en_com/images/logo_plain.png" style="width: 50px;height: 20px;">';

                eSpan.innerHTML = '<span class="glyphicon glyphicon-trash"></span>';

                eSpan.addEventListener('click', function () {

                    raiseevent(params);

                });

                return eSpan;

            }
            function ageCellRendererFunc2(params) {

                var eSpan = document.createElement('button');

                eSpan.className = "del-btn";

                //eSpan.innerHTML = '<img src="http://www.google.com/intl/en_com/images/logo_plain.png" style="width: 50px;height: 20px;">';

                eSpan.innerHTML = '<span class="glyphicon glyphicon-ok-sign"></span>';

                eSpan.addEventListener('click', function () {

                    raiseevent2(params);

                });

                return eSpan;

            }
            function ageCellRendererFunc1(params) {

                var eSpan = document.createElement('button');

                eSpan.className = "del-btn";

                //eSpan.innerHTML = '<img src="http://www.google.com/intl/en_com/images/logo_plain.png" style="width: 50px;height: 20px;">';

                eSpan.innerHTML = '<span class="glyphicon glyphicon-trash"></span>';

                eSpan.addEventListener('click', function() {

                    raiseevent1(params);

                });

                return eSpan;

            }
            $scope.deleteUser = function (betId, userId) {
                var result = confirm("Are you sure want to delete Records Unmatched");
                if (result) {
                    $http.get('Betentrycntr/deleteGetbetting/' + betId + '/' + userId).success(function (data, status, headers, config) {
                        /*Dialog.autohide(data.message);*/
                        Dialog.autohide("Record Deleted Successfully...");
                        $http.get('Betentrycntr/GatBetData/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function (data, status, headers, config) {
                            $scope.UserData = data.betUserData;
                            $scope.getBetsData();
                        });



                    });

                }

            }
            $scope.deleteUser1 = function (betId, userId,MarketId) {
                var result = confirm("Are you sure want to delete Records Matched");
                if (result) {
                    $http.get('Betentrycntr/deleteGetbettingmat/' + betId + '/' + userId+'/'+MarketId).success(function (data, status, headers, config) {
                        //Dialog.autohide(data.message);
                         Dialog.autohide("Record Deleted Successfully...");
                        //////debugger;
                        $http.get('Betentrycntr/GatBetData/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function (data, status, headers, config) {
                            $scope.UserData = data.betUserData;
                            $scope.getBetsData();
                        });
                    });

                }

            }
            $scope.UnMatchToMatchedData=function(Parametr){
                //////debugger;
                $http.get('Betentrycntr/updateUnMatchedData/' + Parametr.MstCode + '/' + Parametr.isBack + '/' + Parametr.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + Parametr.MatchId).success(function(data, status, headers, config) {
                    $scope.UserData = data.betUserData;
                    $scope.getBetsData();
                });
            }
            function raiseevent(params) {
                //////debugger;

                var params;

                $scope.deleteUser(params.data.MstCode, params.data.UserId);

            }
            function raiseevent2(params) {
                //////debugger;

                var params;

                $scope.UnMatchToMatchedData(params.data);

            }
            function raiseevent1(params) {
                //////debugger;

                var params;

                $scope.deleteUser1(params.data.MstCode, params.data.UserId,params.data.MarketId);

            }
            $scope.CurrentAllBets = {

                enableSorting: true,

                enableFilter: true,

                debug: false,

                rowSelection: 'multiple',
                pagination: true,
                enableColResize: true,

                paginationPageSize: 100,

                columnDefs: columnDefs,

                rowModelType: 'pagination',

            };
            $scope.CurrentAllBetsUn = {

                enableSorting: true,

                enableFilter: true,

                debug: true,

                rowSelection: 'multiple',
                pagination: true,
                
                enableColResize: true,

                paginationPageSize: 100,

                columnDefs: columnDefsUn,

                rowModelType: 'pagination',
            };
            $scope.CurrentAllBetsSe = {

                enableSorting: true,

                enableFilter: true,

                debug: true,

                rowSelection: 'multiple',
                pagination: true,
                enableColResize: true,

                paginationPageSize: 100,

                columnDefs: columnDefsSess,

                rowModelType: 'pagination',
            };
            var allOfTheData;

            function createNewDatasource(type) {
                if (!allOfTheData) { return; }
                var dataSource = {
                    getRows: function(params) {
                        setTimeout(function() {
                            var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
                            var lastRow = -1;
                            if (allOfTheData.length <= params.endRow) {
                                lastRow = allOfTheData.length;
                            }
                            params.successCallback(rowsThisPage, lastRow);
                        }, 1000);
                    }
                };
                if (type == 'Un')
                    $scope.CurrentAllBetsUn.api.setDatasource(dataSource);
                else if(type == 'Ma' && $scope.SetFValue==0){

                    $scope.CurrentAllBets.api.setDatasource(dataSource);
                }else{
                    $scope.CurrentAllBetsSe.api.setDatasource(dataSource);
                }
            }

            function setRowData(rowData, type) {
                allOfTheData = rowData;
                createNewDatasource(type);
            }
            $scope.getBetsData = function () {
                ////////debugger;
                //if (sessionService.get('type') != "3")
                   // speech.sayText("b");
                $scope.MatchedBets = [];
                $scope.SessiondBets = [];
                $scope.UnmatchedBets = [];
                angular.forEach($scope.UserData, function (value, index) {
                    ////////debugger;
                    if (value.IsMatched == "1" && value.MarketId =="2"){
                            $scope.SessiondBets.push(value);
                    }else if(value.IsMatched == "1" && value.MarketId !="2"){
                            $scope.MatchedBets.push(value);
                    }
                    else if(value.IsMatched == "0"){
                        $scope.UnmatchedBets.push(value);
                    }
                });
                $scope.callBetsData($scope.betMaUn,$scope.SetFValue);//sourabh 170110
            }
            $scope.callBetsData = function (isMatched,setFancy) {
                //////debugger;
                $scope.betMaUn = isMatched;//sourabh 170110
                if (isMatched == "1") {
                    if ($scope.MatchedBets.length > 0){
                        $scope.showBetsData = true;
                        $scope.showBetsData0 = false;
                        $scope.showBetsData1 = false;
                    }
                    else{
                        $scope.showBetsData = false;
                        $scope.showBetsData0 = false;
                        $scope.showBetsData1 = true;
                    }
                    //$scope.CurrentAllBets.api.sizeColumnsToFit();
                    if (setFancy==1) {
                        $scope.showBetsData = false;
                        $scope.showBetsData0 = false;
                        $scope.showBetsData1 = true;
                        setRowData($scope.SessiondBets, 'Ma');
                    }else{
                        $scope.showBetsData = true;
                        $scope.showBetsData0 = false;
                        $scope.showBetsData1 = false;
                        setRowData($scope.MatchedBets, 'Ma');
                    }
                    
                }
                else {
                    if ($scope.UnmatchedBets.length > 0){
                        $scope.showBetsData = false;
                        $scope.showBetsData0 = true;
                        $scope.showBetsData1 = false;
                    }
                    else{
                        $scope.showBetsData = false;
                        $scope.showBetsData0 = false;
                        $scope.showBetsData1 = false;
                    }
                   // $scope.CurrentAllBetsUn.api.sizeColumnsToFit();
                    setRowData($scope.UnmatchedBets, 'Un');
                }
            }
             $scope.setFancyData=function(setValue){
                if (setValue==1) {
                    //$scope.showBetsData1=true;
                    $scope.SetFValue=setValue;
                }else{
                    //$scope.showBetsData1=false;
                    $scope.SetFValue=setValue;
                }
               
            }
            $scope.getBetsData1 = function() {
                $http.get('Betentrycntr/GatBetData/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function(data, status, headers, config) {
                    ////debugger;
                    var UnMatchedLength = $filter('filter')(data.betUserData, {IsMatched: 0}).length;
                    if($scope.UnmatchedBets.length==angular.isUndefinedOrNull){
                       $scope.UnmatchedBets.length=0; 
                    }
                    if ($scope.UserData.length==data.betUserData.length && UnMatchedLength==$scope.UnmatchedBets.length) {

                    }else{
                        $scope.UserData = data.betUserData;

                        $scope.getBetsData();
                        $scope.getBetsData1();
                    }
                    
                    
                });
            }
            $scope.getBetsData1();
            //comment the interval by Manish  12_10_2017
            var getGrid1 = $interval($scope.getBetsData1, 3000);
            //var getGrid2 = $interval($scope.getBetsData, 2000);
            $scope.si_getMatchUnmatchData = $interval($scope.getMatchUnmatchData, 3000);
            $scope.$on("$destroy", function(event) {
                $interval.cancel(getGrid2);
                $interval.cancel(getGrid1);
                $timeout.cancel(si_fancyData);
                $interval.cancel($scope.si_getMatchUnmatchData);

                $scope.si_getMatchUnmatchData = angular.isUndefinedOrNull;
               // si_fancyData = angular.isUndefinedOrNull;
            }); //sourabh 170124

           
            

            
        }]
    }
});
