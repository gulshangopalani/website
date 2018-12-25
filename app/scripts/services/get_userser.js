'use strict';
app.factory('get_userser', function ($http, $location, sessionService, $rootScope, $filter) {
    var response = [];
    return {
        GetFancyBal: function (FancyID, $callback) {
            var $promise = $http.post(BASE_URL + 'Createdealercontroller/getFancySomOfBet/' + FancyID);
            $promise.then(function (response) {
                $callback(response.data.sumOfBetFancy[0].TotalBet);
            });
        },
        partnerValue: function (UserID, $callback) {
            var $promise = $http.post(BASE_URL + 'Createmastercontroller/partnerValue/' + UserID);
            $promise.then(function (response) {
                $callback(response.data);
            });
        },
        GetFancyData: function (matchId, FancyID, UserId, type, TypeID, $callback) {
            var $promise = $http.get(BASE_URL + 'Lstsavemstrcontroller/getFancyData/' + matchId + '/' + FancyID + '/' + UserId + '/' + type + '/' + TypeID);
            $promise.then(function (response) {
                $callback(response);
            });
        },
        GetFancyData1: function (matchId, FancyID, UserId, type, TypeID, $callback) {
            var $promise = $http.get(BASE_URL + 'Lstsavemstrcontroller/getFancyDataM/' + matchId + '/' + FancyID + '/' + UserId + '/' + type + '/' + TypeID);
            $promise.then(function (response) {
                $callback(response);
            });
        },
        updateUserBal: function (user_id, $callback) {
            var $promise = $http.post(BASE_URL + 'Chipscntrl/getChipDataById/' + user_id);
            $promise.then(function (response) {
                //$rootScope.FreeChips;
                var SFreechips = sessionService.get('FreeChips');
                var DFreeChip = response.data.betLibility[0].FreeChip;
                if (SFreechips == DFreeChip) {
                    var status = false;
                }
                else {
                    $rootScope.FreeChips = response.data.betLibility[0].FreeChip;
                    $rootScope.Balance = response.data.betLibility[0].Balance;
                    $rootScope.Liability = response.data.betLibility[0].Liability;
                    sessionService.set('FreeChips', response.data.betLibility[0].FreeChip);
                    sessionService.set('ChipInOut', response.data.betLibility[0].Chip);
                    sessionService.set('Liability', response.data.betLibility[0].Liability);
                    sessionService.set('Balance', response.data.betLibility[0].Balance);
                    var status = true;
                }
                $callback(status);
            });
        },
        GetAllSessFancyBet: function (FancyID, $callback) {
            var $promise = $http.post(BASE_URL + 'Createdealercontroller/GetAllSessFancyBet/' + FancyID);
            $promise.then(function (response) {
                $callback(response.data.GetSesFancyUserLst);
            });
        },
        GetWALLibiInfo: function (userId) {
            if (sessionService.get('slctUseTypeID') == 3) {
                $http.get('Chipscntrl/getChipDataById/' + userId).success(function (data, status, headers, config) {
                    var cipsData = data.betLibility;
                    sessionService.set('FreeChips', cipsData[0].FreeChip);
                    sessionService.set('ChipInOut', cipsData[0].Chip);
                    sessionService.set('Liability', cipsData[0].Liability);
                    sessionService.set('Balance', cipsData[0].Balance);
                    $rootScope.user = sessionService.get('slctUseName');
                    $rootScope.Balance = sessionService.get('Balance');
                    $rootScope.Liability = sessionService.get('Liability');
                });
            }
        },
        getAdminLImit: function () {
            var $promise = $http.post(BASE_URL + 'Betentrycntr/adminLimit/');
            $promise.then(function (response) {
                $callback(response.data.adminLimit);
                sessionService.set('adminLimit', response.data.adminLimit[0].adminLImit);
            });
        },
        userChipSetting: function ($callback) {
            var $promise = $http.post(BASE_URL + 'Createdealercontroller/UserChipSetting/' + sessionService.get('user_id'));
            $promise.then(function (response) {
                $rootScope.userPlcBtn = response.data.getChipsetting;
                $callback(response.data.getChipsetting);
            });
        },
        updateUserChipSetting: function (ChipData, $callback) {
            var $promise = $http.post(BASE_URL + 'Createdealercontroller/updateUserChipSetting/', ChipData);
            $promise.then(function (response) {
                $rootScope.userPlcBtn = response.data.getChipsetting;
                $rootScope.MyLenth = 1;
                $callback(response.data.status);
            });
        },
        getCheckLimitOfPlaceBet: function (slctUseID, MatchId, MarketId, $callback) {
            var $promise = $http.post(BASE_URL + 'Createmastercontroller/viewUserAcData/' + slctUseID + '/' + MatchId + '/' + MarketId);
            $promise.then(function (response) {
                $callback(response.data);
            });
        },
        get_OddsFromApi: function (MarketId, selectionId1, matchId, isback,MarketDelay,sportId, $callback) {
            if(MarketDelay==false){
                var $promise = $http.post(BASE_URL + 'Geteventcntr/getBackLaysOfMarket/' + MarketId + '/' + matchId);
                $promise.then(function (response) {
                    var odlm = 0;
                    if (response.data.MatchOddsVolVal != angular.isUndefinedOrNull) {
                        if (response.data.MatchOddsVolVal[0].oddsLimit != angular.isUndefinedOrNull)
                            odlm = parseFloat(response.data.MatchOddsVolVal[0].oddsLimit);
                        else
                            odlm = 0;
                    }
                    else
                        odlm = 0;
                    if (isback == "0") {

                        var oddsValue = ($filter('filter')(response.data.MarketRunner.runners, { selectionId: selectionId1 })[0].ex.availableToBack[0].price) + odlm;

                    }
                    else {
                        var oddsValue = ($filter('filter')(response.data.MarketRunner.runners, { selectionId: selectionId1 })[0].ex.availableToLay[0].price) + odlm;
                    }

                    var inplay = response.data.MarketRunner.inplay;
                    var ApiData={ oddsValue: oddsValue,inplay: inplay};
                    $callback(ApiData);
                });

            }else{
                var $promise = $http.get("http://159.65.146.249/sanjuApiOdds?sportid=" +sportId+ "&eventid=" + matchId);
                $promise.then(function (response) {
                    ;
                    var MarketRunner = $filter('filter')(response.data.result, { id: MarketId })[0];
                    if (isback == "0")
                        var oddsValue = ($filter('filter')(MarketRunner.runners, { id: selectionId1 })[0].back[0].price);
                    else 
                        var oddsValue = ($filter('filter')(MarketRunner.runners, { id: selectionId1 })[0].lay[0].price);
              

                    var inplay = MarketRunner.inPlay;
                    var ApiData={ oddsValue: oddsValue,inplay: inplay};
                    $callback(ApiData);
                    

                });

            }
            
        },
        getSessionFancy: function (matchId, sportId, $callback) {
            var marketData = { matchId: matchId, sportsId: sportId }
            var $promise = $http({ method: 'POST', url: 'Geteventcntr/SessionFancyData/', data: marketData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            $promise.then(function (response) {
                $callback(response.data.SessionFancyData);
            });
        },
        getUserPartnerShip: function (userId, $callback) {
            var $promise = $http.post(BASE_URL + 'Lstsavemstrcontroller/getPartnerShip/' + userId);
            $promise.then(function (response) {
                $callback(response);
            });
        },
        changePassword: function(oldPassword,newPassword,userId, $callback){
             var Data = { oldPassword: oldPassword, newPassword: newPassword , userId: userId};
             
             var $promise = $http.post(BASE_URL + 'Lstsavemstrcontroller/changeLgnPassword/', Data);
            //var $promise = $http({ method: 'POST', url: 'Lstsavemstrcontroller/changeLgnPassword/', Data: Data });
            $promise.then(function (response) {
                $callback(response.data);
            });
        },
        getBetDelay:function(userId, $callback){
            var $promise = $http.post(BASE_URL + 'Createdealercontroller/getBetDelay/' + userId);
            $promise.then(function (response) {
                //;
                $callback(response.data.BetDelay[0].set_timeout);
            });
        },
        GetFancyLength:function($callback){
            var $promise = $http.post(BASE_URL + 'Createdealercontroller/getFancyLength/');
            $promise.then(function (response) {
                //;
                $callback(response.data.FancyNum[0].ID);
            });
        }
    }
});