app.controller('Matchoddscntr', ['$scope', '$http', '$stateParams', 'sessionService', '$timeout', 'Dialog', '$rootScope', 'deviceDetector', 'get_userser', '$mdDialog', 'speech', '$filter', '$location', '$state', '$interval','$window', function($scope, $http, $stateParams, sessionService, $timeout, Dialog, $rootScope, deviceDetector, get_userser, $mdDialog, speech, $filter, $location, $state, $interval,$window) {
    $scope.$on('test_dir', function(event, data) { $scope.getNameFunc(); });
    $scope.PLAYPAUSE=0;
    var marketTimer;
    $scope.loading = false;
    $scope.dateForm = new Date($stateParams.date);
    $scope.sportId = 0;
    $scope.SPORTID=$stateParams.sportId;
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
    $scope.GetScore=function(){      
        var eventIds = $stateParams.MatchId;
        $http({
                    method: 'POST',
                    url: 'Geteventcntr/matchMarketLst/',
                    data: {
                        matchId: $scope.MatchId,
                        sportsId: $scope.SPORTID,
                        user_id: sessionService.get('user_id')
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(data) {
                    $scope.PLAYPAUSE=$filter('filter')(data.MatchMarket, { Id: $scope.MarketId })[0].IsPlay;
        });
    }
    $scope.playpse = $interval(function () {
                    //Display the current time.
       $scope.GetScore();
    }, 8000);



    $scope.countdown = function() {
        //debugger;
        //stopped = $timeout(function() {
            $http.get("http://159.65.146.249/sanjuApiOdds?sportid=4" + $scope.SPORTID + "&eventid=" + $scope.MatchId).then(function successCallback(response){          
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
            $http.get("http://159.65.146.249/sanjuApiOdds?sportid=" + $scope.SPORTID + "&eventid=" + $scope.MatchId).then(function successCallback(response){
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
    $scope.volumeLimit=0;
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
                        url: "http://159.65.146.249/sanjuApiOdds?sportid=" + $scope.SPORTID + "&eventid=" + $scope.MatchId
                    }).success(function (data) {                       
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
        if ($scope.GetMarketBackLayData.status == "CLOSED") {
            var vSelectionID = $filter('filter')($scope.GetMarketBackLayData.runners, { status: "WINNER" })[0].selectionId;
            var selectionName1 = "";
            if ($scope.RunnerValue != angular.isUndefinedOrNull && $scope.RunnerValue.length > 0 && $scope.RunnerValue[0].length > 0){               
                selectionName1 = $filter('filter')($scope.RunnerValue, { SelectionId: vSelectionID })[0].selectionName;
                if (selectionName1 != "")
                    $scope.saveMatchoddsResult($scope.MatchId, $scope.GetMarketInfo.SportID, $scope.MarketId, vSelectionID, 1, $scope.GetMarketInfo.SportName, $stateParams.matchName, $scope.GetMarketInfo.MarketName, selectionName1);                
            } else {
                $http.get('Geteventcntr/getSelectionName/' + $scope.MarketId + '/' + $scope.MatchId).success(function(data, status, headers, config) {
                    selectionName1 = $filter('filter')(data.RunnerValue, { selectionId: vSelectionID })[0].selectionName;
                    if (selectionName1 != "")                        
                        $scope.saveMatchoddsResult($scope.MatchId, $scope.GetMarketInfo.SportID, $scope.MarketId, vSelectionID, 1, $scope.GetMarketInfo.SportName, $stateParams.matchName, $scope.GetMarketInfo.MarketName, selectionName1);
                });
            }   
        }else if ($scope.MatchResult == "CLOSED") {
            $scope.GetMarketBackLayData.status = "CLOSED";
            $timeout.cancel(marketTimer);
            marketTimer = angular.isUndefinedOrNull;
            $rootScope.$broadcast('changeSidebar_Market', {});
            if (sessionService.get('type') == "3")
                $state.go('userDashboard.Home');
        }

    };
    $scope.getOddValue = function(item, priceVal, matchId, back_layStatus, placeName, selectionId) {
       
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
    $scope.GetUserData=function(){       
        $http.get('Betentrycntr/GatBetData/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function(data, status, headers, config) {
            $scope.UserData = data.betUserData;
        });
    }
    $scope.GetUserData();
    $scope.getApiFrom = function(MarketId, MatchId) {       
        $scope.btnPlaceDis = true;
        $scope.MarketId = $stateParams.MarketId;
        $scope.UserTypeId = sessionService.get('type');
        var userId = document.getElementById('userId').value;
        var ParantId = document.getElementById('ParantId').value;
        var loginId = document.getElementById('loginId').value;
        var selectionId = document.getElementById('selectionId').value;
        var matchId = document.getElementById('matchId').value;
        var isback = document.getElementById('isback').value;
        var MarketId = document.getElementById('MarketId').value;
        var priceVal = $scope.priceVal;
        var stake = $scope.stake;
        var placeName = document.getElementById('placeName').value;
        get_userser.get_OddsFromApi($stateParams.MarketId, selectionId, MatchId, isback,$scope.MarketDelay,$stateParams.sportId, function(response) {           
            $scope.ApiOddsValue = response.oddsValue;
            var chkValPrice = $scope.ApiOddsValue;
            var P_and_l = 0,
                P_and_lLB = 0;
            if (isback == 0) {
                if (priceVal <= $scope.ApiOddsValue) {
                    isMatched = 1; 
                    priceVal = $scope.ApiOddsValue;
                } else { 
                    isMatched = 0;
                    priceVal = priceVal;
                    $scope.oldPnLValue = 0;
                }
            } else {
                if (priceVal >= $scope.ApiOddsValue) { 
                    isMatched = 1;
                    priceVal = $scope.ApiOddsValue;
                } else { 
                    isMatched = 0;
                    priceVal = priceVal;
                    $scope.oldPnLValue = 0;
                }
            }
            if (deviceDetector.device == 'unknown')
                var DIVICE = 'Desktop';
            else
                var DIVICE = deviceDetector.device;                      
            P_and_l = (priceVal * stake) - stake;
            var deviceInformation = " browser: " + deviceDetector.browser + " browser_version :" + deviceDetector.browser_version + "  device: " + DIVICE + "  OS : " + deviceDetector.os + " os_version: " + deviceDetector.os_version;
            $scope.formData = { userId: sessionService.get('slctUseID'),ParantId: ParantId,loginId: loginId,selectionId: selectionId,matchId: $stateParams.MatchId,isback: isback,stake: stake,priceVal: priceVal,p_l: P_and_l,MarketId: MarketId,isMatched: isMatched,UserTypeId: $scope.UserTypeId,placeName: placeName,MatchName: $stateParams.matchName,deviceInfo: deviceInformation,inplay: response.inplay,ApiVal: 0 }
            $scope.getCheckLimitorVal($scope.formData);
                if ($scope.gtTypeId == 3) {
                    $http({
                        method: 'POST',
                        url: 'Betentrycntr/Save_bet/',
                        data: $scope.formData,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).success(function(data) {
                        $scope.GetUserData();
                        $rootScope.$broadcast('updateBal', {});
                        $scope.loadingM = false;
                        if (data.error >= 0) {
                                $scope.displayTable1=false;
                                $scope.priceVal = 0;
                                $scope.stake = 0;
                                $scope.acc = false;
                                $scope.btnPlaceDis = false;
                                if(isMatched==0){
                                    Dialog.show("Oops you missed this...");
                                }else{
                                    Dialog.autohide(data.message);
                                }                                
                                $scope.loading = false;
                                $rootScope.$broadcast('changeText', {});
                                $scope.RunnerValue = data.RunnerValue;
                                if ($scope.gtTypeId == 3) {
                                    $scope.UserId = sessionService.get('slctUseID');
                                    get_userser.GetWALLibiInfo($scope.UserId);
                                    $scope.acc = 0;
                                } else {
                                    $scope.UserId = sessionService.get('user_id');
                                    get_userser.GetWALLibiInfo($scope.UserId);
                                    $scope.acc = 0;
                                }
                        } else if (data.error < 0) {
                            $scope.displayTable1=false;
                            alert('' + data.message);
                            $scope.btnPlaceDis = false;
                            $scope.loading = false;
                            $scope.loadingM = false;
                            $scope.acc = 0;
                        }
                    });
                    $scope.GetUserData();
                }else if($scope.gtTypeId != 3){
                    $scope.displayTable1=false;
                    alert("Invalid user");
                    $scope.btnPlaceDis = false;
                    $scope.loading = false;
                    $scope.loadingM = false; 
                }else if(isMatched==0){
                    $scope.displayTable1=false;
                    alert("Rate Change...");
                    $scope.btnPlaceDis = false;
                    $scope.loading = false;
                    $scope.loadingM = false;
                    $scope.acc = 0;
                }  
            });
    }
    $scope.place_bet = function() {
        $http({ method: 'POST',url: 'UsereventCntr/matchMarketLst/', data: { matchId: $stateParams.MatchId,sportsId: $stateParams.sportId,user_id: sessionService.get('user_id')}, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function(data) {
            $scope.PLAYPAUSE=$filter('filter')(data.MatchMarket, { Id: $scope.MarketId })[0].IsPlay;
            if($scope.PLAYPAUSE==0 && $scope.stake >=100){
                $scope.loadingM = true;
                $http.get('Chipscntrl/checkDeduction/' + sessionService.get('user_id')+"/"+$stateParams.MatchId).then(function(articles){
                   
                    return parseInt(articles.data.chkcnt[0].numb);
                }).then(function(cnt){
                    
                    if(cnt==0){
                        $http.get('Chipscntrl/getChipDataById/' + sessionService.get('user_id')).success(function(data, status, headers, config) {
                                
                                var cipsData = data.betLibility;
                                $scope.sessionLiability = -1*parseFloat(cipsData[0].sessionLiability).toFixed(2);
                                $scope.GET_BALANCE=parseFloat(cipsData[0].Balance).toFixed(2);
                                /*start code cut balance*/
                                $http.get('Betentrycntr/PointValue/'+sessionService.get('user_id')).success(function (data, status, headers, config) { 
                                    
                                       //$scope.PointValue = parseInt(data.GetPoint[0].value);
                                       if(data.GetPoint.length==0){
                                            $scope.PointValue=0;
                                        }else{
                                             $scope.PointValue = parseFloat(data.GetPoint[0].value);
                                        }
                                        //$scope.message=data.message;
                                        if($scope.GET_BALANCE>=$scope.PointValue){
                                            var userID = sessionService.get('user_id');
                                            var userType = sessionService.get('type');
                                            
                                            var ChipData={
                                                UserName: sessionService.get('slctUseName'),
                                                UserId: userID,
                                                userType: userType,
                                                ChpsVal: $scope.PointValue,
                                                MatchID: $stateParams.MatchId,
                                                MatchName: $stateParams.matchName,
                                            };
                                            $http({
                                                method: 'POST',
                                                url: 'Chipscntrl/SaveChipAc/',
                                                data: ChipData,
                                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                                            }).success(function (data) {
                                                $scope.TOTAL_LIABILITY=-1*(parseFloat(cipsData[0].sessionLiability)+parseFloat(cipsData[0].unmatchliability));
                                                    
                                            });

                                        }else{
                                            Dialog.show('Insufficient Balance1234');
                                            $scope.stake = 0;
                                            $scope.btnPlaceDis = false;
                                            
                                            $scope.loadingM = false;
                                            return;

                                        }
                                });
                                /*End of code to cut Balance*/
                        });

                    }
                    get_userser.getBetDelay(sessionService.get('slctUseID'), function(data) {
                        var BetDelay = (parseInt(data) * 1000);
                        if ($scope.GetMarketBackLayData.status == "OPEN" && $scope.stake >= 10 && $scope.stake <= 500000) {
                            $timeout(function() { $scope.getApiFrom($stateParams.MarketId, $stateParams.MatchId) }, BetDelay);
                        } else if ($scope.stake < 10) {
                            Dialog.autohide('Please Enter Min 5 Stake');
                            $scope.loadingM = false;
                        } else if ($scope.GetMarketBackLayData.status != "OPEN") {
                            Dialog.autohide('Match Closed');
                            $scope.loadingM = false;
                        }else if($scope.stake > 500000){
                            Dialog.autohide('Please Enter Max 500000 Stake');
                            $scope.loadingM = false;
                        }
                    });
                });
            }else if($scope.PLAYPAUSE==1){
                alert("Market is Pause. Dont Try to place Bet ");
            }else if($scope.stake < 100){
                // alert("Min stack 100...");
                (angular.element(document.querySelector("#displayErrorMsg")).removeClass("alert-message"),2000);
                // document.getElementById("displayErrorMsg").removeAttribute("class : alert-message");
            }
        });
    };
    
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
    $interval.cancel($scope.playpse);
        $timeout.cancel($scope.callOddsFunc);
        $scope.callOddsFunc = angular.isUndefinedOrNull;
    });
    
    $scope.stakeValReset = function(val) { //sourabh 15-nov-2016
        $scope.stake = parseInt(val);
    };
    $scope.getCalculation = function(priceVal, stake) {
      
        if (stake == angular.isUndefinedOrNull) {
            stake = 0;
        } else {
            $scope.sumOfVal = parseFloat(priceVal) * parseInt(stake) - parseInt(stake);
            $scope.sumOfVal = $scope.sumOfVal.toFixed(2);
        }

    }
    $scope.stakeVal = function(val, selectionId, stake) { //sourabh 15-nov-2016
        $scope.displayTable1=true;
        if (stake == angular.isUndefinedOrNull) {
            stake = 0;
        }
        if (stake == 0) {}
        $scope.sumOfVal = parseFloat(val) * parseInt(stake) - parseInt(stake);
        $scope.sumOfVal = $scope.sumOfVal.toFixed(2);
        $scope.stake = parseInt(val);//$scope.stake +
        $scope.MarketId = $stateParams.MarketId;
        $scope.UserTypeId = sessionService.get('type');
        var userId = document.getElementById('userId').value;
        var ParantId = document.getElementById('ParantId').value;
        var loginId = document.getElementById('loginId').value;
        var selectionId = document.getElementById('selectionId').value;
        var matchId = document.getElementById('matchId').value;
        var isback = document.getElementById('isback').value;
        var MarketId = document.getElementById('MarketId').value;
        var priceVal = $scope.priceVal;
        var stake = $scope.stake;
        var placeName = document.getElementById('placeName').value;
        var chkValPrice = document.getElementById('chkValPrice').value;
        chkValPrice = parseFloat(chkValPrice);
        if (chkValPrice == priceVal) {
            var isMatched = 1;
        } else {
            var isMatched = 0;
        }
        var P_and_l = (priceVal * stake) - stake;
        $scope.formData = {
            userId: sessionService.get('slctUseID'),
            ParantId: ParantId,
            loginId: loginId,
            selectionId: selectionId,
            matchId: $stateParams.MatchId,
            isback: isback,
            stake: stake,
            priceVal: priceVal,
            p_l: P_and_l,
            MarketId: MarketId,
            isMatched: isMatched,
            UserTypeId: $scope.UserTypeId,
            placeName: placeName,
            MatchName: $stateParams.matchName
        }
        $scope.getCheckLimitorVal($scope.formData);
    }
    $scope.chkUserValidation = function(formData) {
        get_userser.getCheckLimitOfPlaceBet(sessionService.get('slctUseID'), $stateParams.MatchId, $stateParams.MarketId, function(data) {
            $scope.viewUserAc1 = data.viewUserAc2[0];
            $scope.checkStakeLimit(formData);
        });
    }
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
    $scope.checkStakeLimit = function(formdata) {
       
        if ($scope.viewUserAc1 == angular.isUndefinedOrNull) {
            $scope.cValid = false;
            return false;
        } else if ($scope.viewUserAc1.lgnusrCloseAc == 0) {
            Dialog.autohide('Your Account is Closed...');
            $scope.stake = 0;
            $scope.cValid = false;
            $scope.btnPlaceDis = false;
            return false;
        } else if ($scope.viewUserAc1.mstrlock == 0) {
            Dialog.autohide('Your Account is InActive...');
            $scope.stake = 0;
            $scope.cValid = false;
            $scope.btnPlaceDis = false;
            return false;
        } else if ($scope.viewUserAc1.lgnusrlckbtng == 0) {
            Dialog.autohide('Your Betting is Locked...');
            $scope.stake = 0;
            $scope.cValid = false;
            $scope.btnPlaceDis = false;
            return false;
        } else if (parseInt($scope.viewUserAc1.stakeLimit) != 0 && parseInt($scope.viewUserAc1.stakeLimit) < $scope.stake) {
            Dialog.autohide('Your Stake Limit is Over...');
            $scope.stake = 0;
            $scope.cValid = false;
            $scope.btnPlaceDis = false;
            return false;
        } else if (-parseInt($scope.viewUserAc1.lgnUserMaxLoss) != 0 && -parseInt($scope.viewUserAc1.lgnUserMaxLoss) > $scope.SlMaxLoss) { //ye market wise aayegi n ki overall par
            Dialog.autohide('Your Max Loss is Over.....');
            $scope.stake = 0;
            $scope.cValid = false;
            $scope.btnPlaceDis = false;
            return false;
        } else if (parseFloat($scope.viewUserAc1.lgnUserMaxProfit) != 0 && parseFloat($scope.viewUserAc1.lgnUserMaxProfit) < $scope.SlMaxProfit) //sourabh 170102 new
        {
            Dialog.autohide('Your Max Profit is Over.....');
            $scope.stake = 0;
            $scope.cValid = false;
            $scope.btnPlaceDis = false;
            return false;
        } else if ($scope.GetMarketBackLayData.inplay == 'false' && parseInt($scope.viewUserAc1.GoingInplayStakeLimit) != 0 && parseInt($scope.viewUserAc1.GoingInplayStakeLimit) < $scope.stake) {
            Dialog.autohide('Going Inplay Stake Limit is Over...');
            $scope.stake = 0;
            $scope.cValid = false;
            $scope.btnPlaceDis = false;
            return false;
        } else if ($scope.viewUserAc1 != angular.isUndefinedOrNull && $scope.viewUserAc1.lgnusrCloseAc == 1 && $scope.viewUserAc1.mstrlock == 1 && $scope.viewUserAc1.lgnusrlckbtng == 1 && (parseInt($scope.viewUserAc1.stakeLimit) >= $scope.stake || parseInt($scope.viewUserAc1.stakeLimit) == 0)) {
            $scope.cValid = true;
            $scope.btnPlaceDis = false;
            return true;
        } else {
            alert("Problem Occered");
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
        $scope.oddsLimit=0;
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
    $scope.countdown();
    $scope.$on("$destroy", function(event) {
        $timeout.cancel(marketTimer);
         $timeout.cancel(stopped);
        marketTimer = angular.isUndefinedOrNull;
    });
    /*start code for Fancy*/
    $scope.$on("$destroy", function(event) {
        $interval.cancel($scope.si_getMatchUnmatchData);
        $scope.si_getMatchUnmatchData = angular.isUndefinedOrNull;
    }); 
    $scope.showSessionFancy = function(fanctTypeId, fanctId) {
        $scope.sessionFancy = fanctId;
        $scope.sessionFancyType = fanctTypeId;
        get_userser.GetFancyData($stateParams.MatchId, $scope.sessionFancy, sessionService.get('user_id'), sessionService.get('type'), $scope.sessionFancyType, function(response) { //sourabh 170125_1
            $scope.FancyData = response.data.fancyForm;
            $scope.showOdd1 = false;
            $scope.GetFancyBal();
        });
    }
    $scope.fancyBetSlip = function(event,line,price,Fancy,isFancy,isBack) {
        //debugger;
       $scope.betslipArray={};
       if(isBack==0){
            backlayName ="Back";
       }else{
            backlayName ="Lay";
       }      
       $scope.betslipArray={ id: Fancy.id,name : Fancy.name, backLine: Fancy.backLine, backPrice : Fancy.backPrice, layLine: Fancy.layLine, layPrice : Fancy.layPrice,status : Fancy.status, maxLiabilityPerBet : Fancy.maxLiabilityPerBet,maxLiabilityPerMarket: Fancy.maxLiabilityPerMarket,betDelay : Fancy.betDelay,isBettable: Fancy.isBettable,statusLabel: Fancy.statusLabel,isFancy: isFancy,betslip: true,backlayName : backlayName,isBack : isBack,line: line,price: price,stack: 0,marketId:Fancy.marketId }
    };
    $scope.checkValidation = function(sessionData,checkValidation) { //sourabh 170125
        if (sessionData.betValue == "" || sessionData.betValue <= 0) {
            Dialog.autohide('You cannot play at zero Stake...');
            $(".betOverlaypre"+checkValidation).removeClass('betOverlay');
            $(".betOverlaypre"+checkValidation).hide();
            focus('betValue');
            return false;
        }
        return true;
    }           
    $scope.FancyVal=function(val,stack,btnStatus){
       if(stack == angular.isUndefinedOrNull)
            stack=0;
        var sumOfVal = parseInt(val) + parseInt(stack);
        if(btnStatus==1){
           $scope.betslipArray.stack = parseInt(sumOfVal); 
        }else{
            $scope.betslipArray.stack = parseInt(sumOfVal); 
        }
    }
    $scope.saveSessionBet = function(pointDiff,FancyData,IndexVal) { 
       
        $(".betOverlaypre"+IndexVal).show();
        $(".betOverlaypre"+IndexVal).addClass('betOverlay');
        var HeadName = FancyData.HeadName;
        var SessInptNo = FancyData.SessInptNo;
        var SessInptYes = FancyData.SessInptYes;
        var FncyId = FancyData.FncyId;
        var sportId = FancyData.SprtId;
        var UserTypeId = sessionService.get('slctUseTypeID');
        var UserId = sessionService.get('slctUseID');
        var loginId = sessionStorage.user_id;
        var ParantId = sessionService.get('slctParantID');
        var amount = document.getElementById('betValueLay'+IndexVal).value;
        if ($scope.isBackYes == 0) {
            OddsNumber = SessInptYes;
        } else {
            OddsNumber = SessInptNo;
        }
        if (deviceDetector.device == 'unknown') {
            var DIVICE = 'Desktop';
        } else {
            var DIVICE = deviceDetector.device;
        }
        var deviceInformation = '"' + " browser: " + deviceDetector.browser + " browser_version :" + deviceDetector.browser_version + "  device: " + DIVICE + "  OS : " + deviceDetector.os + " os_version: " + deviceDetector.os_version + '"';
        var sessionData = {
            userId: UserId,
            ParantId: ParantId,
            loginId: loginId,
            betValue: amount,
            FancyID: FancyData.ID,
            matchId: $stateParams.MatchId,
            OddValue: $scope.isBackYes,
            type: sessionStorage.type,
            OddsNumber: OddsNumber,
            TypeID: FancyData.TypeID,
            HeadName: HeadName,
            SessInptNo: SessInptNo,
            SessInptYes: SessInptYes,
            sportId: sportId,
            FancyId: FncyId,
            pointDiff: pointDiff,
            deviceInformation: deviceInformation
        }
        if(amount >= 1){
            if ($scope.checkValidation(sessionData,IndexVal)) {
                /*start code for bet delay*/
                get_userser.getBetDelay(sessionService.get('slctUseID'), function(data) {
                    var BetDelay = (1 * 1000);
                    $timeout(function() {
                    $http({ method: 'POST',url: BASE_URL + 'Lstsavemstrcontroller/save_session_bet',data: sessionData,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(data) {
                        $scope.showOdd1 = false;
                        if(data.error>=0){                                
                            get_userser.GetWALLibiInfo(sessionService.get('slctUseID'));
                            Dialog.autohide(data.message);
                            $scope.openfancy = {};
                            $(".betOverlaypre"+IndexVal).hide();
                            $(".betOverlaypre"+IndexVal).removeClass('betOverlay');
                            $scope.GetUserData();
                        }else if(data.error < 0){                                
                            Dialog.autohide(data.message);
                            $scope.openfancy = {};
                            $(".betOverlaypre"+IndexVal).hide();
                            $(".betOverlaypre"+IndexVal).removeClass('betOverlay');
                        }
                    });
                }, BetDelay);
                    
                });
                /*end the code of betdelay*/                        
            }
        }else{
            var message="Min Bet 10";
            alert(""+message);
            $scope.openfancy = {};
            $(".betOverlaypre"+IndexVal).hide();
            $(".betOverlaypre"+IndexVal).removeClass('betOverlay');
        }
    };
    $scope.placeFancyBet=function(){
       // debugger;
         $scope.fancybetloader=true;
        //get_userser.getBetDelay(sessionService.get('slctUseID'), function(data) {
                   // var BetDelay = (parseInt(data) * 1000);
            fancyTimer = $timeout(function (){                 
                $http.get("http://159.65.146.249/sanjuApiOdds?sportid=4&eventid="+$stateParams.MatchId).then(function successCallback(response){
                   // debugger;
                    var marketOdds=response.data;        
                    var resltArray = $filter('filter')(marketOdds.result, { id: $scope.betslipArray.marketId });
                    if($scope.betslipArray.isBack==1 && resltArray[0].statusLabel==""){
                       if(resltArray[0].runners[0].lay[0].line == $scope.betslipArray.line && resltArray[0].runners[0].lay[0].price == $scope.betslipArray.price){
                            var line=resltArray[0].runners[0].lay[0].line;
                            var price=resltArray[0].runners[0].lay[0].price;
                            return true;
                       }else{
                            alert("Price or Line change", "Bet not Placed.Try Again...");
                            $scope.fancybetloader=false;
                            // return false;
                       }                        
                    }else if( $scope.betslipArray.isBack==0 && resltArray[0].statusLabel==""){
                        if(resltArray[0].runners[0].back[0].line == $scope.betslipArray.line && resltArray[0].runners[0].back[0].price == $scope.betslipArray.price){
                            var line=resltArray[0].runners[0].back[0].line;
                            var price=resltArray[0].runners[0].back[0].price;
                            return true;
                        }else{
                            alert("Price or Line change", "Bet not Placed.Try Again...");
                            $scope.fancybetloader=false;
                            // return false; 
                        }
                    }else{
                        alert("Sorry You Can not Bet , Fancy status is "+resltArray[0].statusLabel);
                        $scope.fancybetloader=false;
                        // return false; 
                    }
                }).then(function(status){                
                    if(status==true){
                        if($scope.betslipArray.isBack==0){
                            if($scope.betslipArray.price !=100)
                            var pointDiff= Math.abs($scope.betslipArray.price-100);
                            else
                            var pointDiff=10;
                        }else if($scope.betslipArray.isBack==1){
                            if($scope.betslipArray.price !=100)
                                var pointDiff= Math.abs($scope.betslipArray.price-100);
                            else
                                var pointDiff=10; 
                        }                
                        var SessInptNo = $scope.betslipArray.layLine;
                        var SessInptYes = $scope.betslipArray.backLine;                        
                        if ($scope.betslipArray.isBack == 0)
                            var OddsNumber = SessInptYes;
                        else 
                            var OddsNumber = SessInptNo;
                        if (deviceDetector.device == 'unknown')
                            var DIVICE = 'Desktop';
                        else
                        var DIVICE = deviceDetector.device;
                        var deviceInformation = '"' + " browser: " + deviceDetector.browser + " browser_version :" + deviceDetector.browser_version + "  device: " + DIVICE + "  OS : " + deviceDetector.os + " os_version: " + deviceDetector.os_version + '"';
                        var sessionData = { userId: sessionService.get('user_id'),ParantId: sessionService.get('slctParantID'),loginId: sessionStorage.user_id,betValue: $scope.betslipArray.stack,FancyID: $scope.betslipArray.id,matchId: $stateParams.MatchId,OddValue: $scope.betslipArray.isBack,type: sessionStorage.type,OddsNumber: OddsNumber,TypeID: 2,HeadName: $scope.betslipArray.name,SessInptNo: SessInptNo,SessInptYes: SessInptYes,sportId: $stateParams.sportId,FancyId: $scope.betslipArray.id,pointDiff: pointDiff,deviceInformation: deviceInformation }
                        if($scope.betslipArray.stack >= 100){
                            $http({ method: 'POST',url: BASE_URL + 'Lstsavemstrcontroller/save_session_bet',data: sessionData,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(data) {
                                if(data.error>=0){ 
                                     $scope.fancybetloader=false;                                 
                                    get_userser.GetWALLibiInfo(sessionService.get('slctUseID'));
                                    Dialog.autohide(data.message); 
                                    $scope.GetUserData();
                                }else if(data.error < 0){ 
                                     $scope.fancybetloader=false;                                 
                                    Dialog.autohide(data.message);
                                }
                            });                       
                        }else{
                            $scope.fancybetloader=false;
                            var message="Min Bet 100";
                            $scope.fancybetloader=false;
                            alert(""+message);                            
                        }
                    }             
                                     
                });
            },10);
        //});
    }
    //app/scripts/controllers/user/UserMatchoddscntr_3.js
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
	
					  $scope.fancyAutoSetToUserPannel = function (ID) {
          console.log("this is not active")   
						
		var url = BASE_URL + "Createmastercontroller/updatefancyAutoSetToUserPannel?ID="+ID;
        $http.get(url).success(function (response) {
              $scope.result= response;
			  console.log("shakti"+$scope.result.error)
			if($scope.result.error == 0)
			{
				  $scope.countdown()
			}
        });
       
    }
	
$scope.checkautofancyactive = function () {
        var url = BASE_URL + "Createmastercontroller/checkAutoFancyisActive?MatchId="+$scope.MatchId;
        $http.get(url).success(function (response) {
            $scope.result= response.result;
         
		   angular.forEach($scope.result, function(item){
                //   console.log(item.ID);  
				   if(item.autoActive == 0)
				   {
		           $scope.fancyAutoSetToUserPannel(item.ID)
     
				   }
               })
        });
       
    }
	
	
	

	
	
    /*$scope.getFancyList = function() {
        get_userser.getSessionFancy($stateParams.MatchId, 4, function(response) {
            $scope.FancyData = response;            
        });
    }
    $scope.getFancyList();*/

	setInterval(function(){
  
  $scope.checkautofancyactive();
 
      

}, 1000)
}]);
