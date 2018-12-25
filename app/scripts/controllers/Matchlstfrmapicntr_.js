app.controller('Matchlstfrmapicntr', function ($scope, $http, $stateParams, Dialog, $rootScope, sessionService,$filter) {
    $scope.loading = true;
    var sportId = $stateParams.sportId;
    $scope.seriesId = $stateParams.seriesId;
    $http.get('Geteventcntr/getMatchOfSport/' + sportId + '/' + $scope.seriesId).success(function (data, status, headers, config) {
        if (data.matchfrmApi != angular.isUndefinedOrNull) {
            $scope.GetSeriesData = data;
        }
        else {
            Dialog.autohide("Record Not Found "+data,10000);
        }
        $scope.loading = false;
    });

    $scope.testFuc = function(formData){

        //var setFancyTime = document.getElementById('setFancyTime').value;sourabh 170103
        //var inputYes = document.getElementById('inputYes').value;sourabh 170103
        //var inputNo = document.getElementById('inputNo').value;sourabh 170103
        //var formData = { HeadName: formData.HeadName, remarks: formData.remarks, mid: $scope.mid, fancyType: $scope.fancyType, date: $scope.dt, time: setFancyTime, inputYes: inputYes, inputNo: inputNo }sourabh 170103
        var url = BASE_URL + "Createmastercontroller/SaveFancy";
        $http.post(url, formData).success(function (response) {
            $scope.SessionFancyForm = response.message;
            $scope.SessionFancyMsg = true;
            $mdDialog.hide();//sourabh 170103
            $timeout(callAtTimeout, 1000);
            function callAtTimeout() {
                $scope.SessionFancyMsg = false;
                $scope.showModal = false;
            }
        });
    };

    //TODO: Time to create fancy. handle select, deselect
    $scope.saveMatch = function (event, id, name, openDate1, countryCode, marketCount) {
        debugger;
        // console.log(event.target.checked);
        $scope.loading = true;
        ////debugger;
        if (countryCode == undefined) {countryCode = null;}
        var NewOpenDate = $filter('date')(openDate1 , 'yyyy-MM-dd HH:mm:ss');

        var formData = { seriesId: $scope.seriesId, matchId: id, matchName: name, openDate: openDate1, countryCode: countryCode, marketCount: marketCount, sportId: sportId, HelperID: sessionService.get('HelperID') }
        var url = BASE_URL + "Geteventcntr/saveSportMatch";

        $http.post(url, formData).success(function (response) {
            //Dialog.autohide(response.message);
            console.log(response)
debugger;
            $http.get('Geteventcntr/getMarketOfMatch/' + id)
                .success(function (data, status, headers, config) {
                    debugger;
                    if (data.marketfrmApi != angular.isUndefinedOrNull) {
                        $scope.GetMarketData = data;
                        // console.log("$scope.GetMarketData", $scope.GetMarketData)
                        $scope.GetMarketData['marketfrmApi'].forEach(function (x) {
                            if(x['marketName']=="Match Odds"){
                                $scope.saveMarket(x['marketId'], x['marketName'], x['totalMatched'],
                                    id,sportId,$scope.seriesId);
                            }
                        })
                    }
                });
            if(event.target.checked===true){
                $scope.lotusApiCall(sportId, id, $scope.seriesId);
            }
            $scope.loading = false;
            $rootScope.$broadcast('changeSidebar_Match', {});
        });

    }

    //TODO: Call lotus Api for markets Additions
    /**
     * @$scope.SessionFancyForm for single market addition
     */
    $scope.SaveSessionFancyForm = function (formData, mrkid) {

        var getUrl = BASE_URL + 'Createmastercontroller/getDatamatchfancy'

        $http.get(getUrl, {params:{market_id:mrkid}}).success(function (data) {

            if (data['success']===true){
                var url = BASE_URL + "Createmastercontroller/SaveFancy";
                $http.post(url, formData).success(function (response) {
                    debugger;
                    $scope.SessionFancyForm = response.message;
                    $scope.SessionFancyMsg = true;
                    $mdDialog.hide();//sourabh 170103
                    $timeout(callAtTimeout, 1000);
                    function callAtTimeout() {
                        $scope.SessionFancyMsg = false;
                        $scope.showModal = false;
                    }
                }).error(function(data, status, headers, config) {
                    console.log("error",data, status, headers, config);
                });
            }
        })
    };

    $scope.saveMarket = function (id, name, totmat, MatchId, sportId, seriesId) {
        // $scope.loading = true;
        var formData = { marketId: id, marketName: name,
            totalMatched: totmat, MatchId: MatchId, SportsId: sportId,
            seriesId: seriesId, HelperID: sessionService.get('HelperID') }
        var url = BASE_URL + "Geteventcntr/saveMatchMarket";
        $http.post(url, formData).success(function (response) {
            debugger;
            if (response.error == 0) {
                $http.get('Geteventcntr/saveSelectionName/' + id + '/' + MatchId + '/' + $scope.sportId)
                    .success(function (data, status, headers, config) {
                        // $scope.loading = false;
                        // Dialog.autohide(data.message);
                        console.log("saved")
                        // $rootScope.$broadcast('changeSidebar_Market', {});
                    })
            }
        });
    }

    $scope.GetMarketData = '';
    $scope.lotusApiCall = function (sportId, matchId, srsId) {

        $http({
            method:"GET",
            url: "https://www.lotusbook.com/api/exchange/event/" + sportId + "/" + matchId,
            header: {
                'Accept':'application/json, text/plain, */*',
                'Accept-Encoding':'gzip, deflate, br',
                'Accept-Language':'en-GB,en-US;q=0.9,en;q=0.8',
                'Connection':'keep-alive',
                'Cookie':'_ga=GA1.2.1999558291.1523965378; _gid=GA1.2.798275937.1525699924; _gat=1',
                'Host':'www.lotusbook.com',
                'Referer':'https://www.lotusbook.com/d/index.html',
                'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
                'X-Client':'desktop',
                'X-Client-Id':'1999558291.1523965378',
                'X-User-Id':'LIOR0E01M0Z',
                'X-xid':'08d95e08-8def-4fa1-aa40-930b444e9783'
            }
        }).success(function (data, status, header, config) {

            // console.log("https://www.lotusbook.com/api/exchange/event/" + sportId + "/" + matchId)
            // console.log("data",data, "status",status, "header", header, "config", config);
            debugger;
            var resultData = data['result']
            var d = new Date();
            var dateToSend = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();
            var timeToSend = d.getHours()+':'+d.getMinutes()+'-'+d.getSeconds();
            // console.log(resultData[1]['name'],resultData[1]['runners'][0]['back'][0]['line'],);

            if (resultData.length > 0){
                for (var x = 1;x < resultData.length; x++) {
                    if (resultData[x]['provider']=="FANCY"){
                        var formData = {
                            HeadName: resultData[x]['name'],
                            remarks: '',
                            mid: matchId,
                            date: dateToSend,
                            time: timeToSend,
                            fancyType: 2,
                            inputYes: resultData[x]['runners'][0]['back'][0]['line'],
                            inputNo: resultData[x]['runners'][0]['lay'][0]['line'],
                            sid: sportId,
                            RateDiff:Math.abs(resultData[x]['runners'][0]['back'][0]['line'] - resultData[x]['runners'][0]['lay'][0]['line']),
                            PointDiff:1,
                            MaxStake:100000,
                            NoLayRange:resultData[x]['runners'][0]['back'][0]['price'],
                            YesLayRange:resultData[x]['runners'][0]['lay'][0]['price'],
                            marketId:resultData[x]['id'],
                            IsAutoFancy:'yes'
                        }
                        // $scope.SessionFancyForm(formData);
                        // $scope.testFuc(formData);
                        $scope.SaveSessionFancyForm(formData, resultData[x]['id']);
                    }

                }
            };

        }).error(function(data, status, headers, config) {
            console.log("error",data, status, headers, config);
        });
    }

});

