
'use strict';
angular.module('ApsilonApp').controller('dealerdashboard',['$scope', '$http', 'sessionService', '$timeout', 'deviceDetector','$filter', function ($scope, $http, sessionService, $timeout, deviceDetector,$filter) {
   $scope.getMatchResult = function () {
    // debugger;
        $http.get('Geteventcntr/getUserMatchResult/' + sessionService.get('slctUseID') + '/' + sessionService.get('slctUseTypeID')).success(function (data, status, headers, config) {
            $scope.matchResult = data.matchRslt;
            getDynamicOdds();
        }).error(function (data, status, header, config) {
            
        });
        
    }
    $scope.getMatchResult();
    
    var marketTimer;
    function getDynamicOdds() 
    {
        // debugger;
        marketTimer = $timeout(function () {
           // debugger;
            $http.get('Geteventcntr/getUserMatchResult/' + sessionService.get('slctUseID') + '/' + sessionService.get('slctUseTypeID')).success(function (data, status, headers, config) {
                $scope.matchResult = data.matchRslt;           
            }).error(function (data, status, header, config) {
                $scope.ResponseDetails = "Data: " + data + "<br />status: " + status + "<br />headers: " + jsonFilter(header) + "<br />config: " + jsonFilter(config);
            });
            getDynamicOdds();
        }, 2000);
    }
    $scope.$on("$destroy", function (event) {
               
        $timeout.cancel(marketTimer);
              
    });
    
   
    $scope.getUrl = function (type, matchid, marketid, matchname, matchdate,SportId)//sourabh 161231
    {
        switch (type) {
            case "0": return "Matchodds({MatchId: " + matchid + ",MarketId:" + marketid + ",matchName:'" + matchname.replace("'", "&quot;") + "',date:'" + matchdate + "',sportId:'"+SportId+"'})"; break;
            case "1": return "Evenoddfancy({matchId: " + matchid + ",FancyID:" + marketid + ",TypeID:" + type + ",matchName:'"+matchname.replace("'", "&quot;")+"',sportId:4 })"; break;
            case "2": return "Sessionfancy({matchId: " + matchid + ",FancyID:" + marketid + ",TypeID:" + type + ",sportId:"+SportId+",matchName:'"+matchname.replace("'", "&quot;")+"'})"; break;
            case "3": return "Khaddalfancy({matchId: " + matchid + ",FancyID:" + marketid + ",TypeID:" + type + ",matchName:'"+matchname.replace("'", "&quot;")+"',sportId:4 })"; break;
            case "4": return "Lastdigit({matchId: " + matchid + ",FancyID:" + marketid + ",TypeID:" + type + ",matchName:'"+matchname.replace("'", "&quot;")+"',sportId:4 })"; break;
            case "5": return "Updown({matchId: " + matchid + ",FancyID:" + marketid + ",TypeID:" + type + ",matchName:'"+matchname.replace("'", "&quot;")+"',sportId:4 })"; break;
        }
    }
    
    
    $scope.$on("$destroy", function (event) { $timeout.cancel(marketTimer); marketTimer = angular.isUndefinedOrNull; });//sourabh 161229
}]);