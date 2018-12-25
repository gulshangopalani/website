app.controller('Fancylistcntr', function ($scope, $http, $timeout, $stateParams,Dialog) {
    var MatchId = $stateParams.matchId;
    $scope.getFancyOfMatch = function () {
        $http.get('Lstsavemstrcontroller/fancyList/' + MatchId)
            .success(function (data, status, headers, config) {
                $scope.fancyList = data;
                $scope.currentPage = 1;
                $scope.entryLimit = 100;
                $scope.filteredItems = $scope.fancyList.length;
                $scope.totalItems = $scope.fancyList.length;
            })
            .error(function (data, status, header, config) {
                $scope.ResponseDetails = "Data: " + data +
                    "<br />status: " + status +
                    "<br />headers: " + jsonFilter(header) +
                    "<br />config: " + jsonFilter(config);
            });
    }
    $scope.getFancyOfMatch();

    $scope.setPage = function (pageNo) { $scope.currentPage = pageNo; };
    $scope.filter = function () {
        $timeout(function () {
            $scope.filteredItems = $scope.filtered.length;
        }, 10);
    };
    $scope.sort_by = function (predicate) {
        $scope.predicate = predicate;
        $scope.reverse = !$scope.reverse;
    };
    
    $scope.delFancy = function (id) {
        var result = confirm("Are you sure want to Delete this fancy ?");
        if (result) {
            $http.get('Lstsavemstrcontroller/updateFancySatatusNew/' + id + '/2')
                .success(function (data, status, headers, config) {
                    Dialog.autohide(data.message);
                    $scope.getFancyOfMatch();
                })
                .error(function (data, status, header, config) {
                    $scope.ResponseDetails = "Data: " + data +
                        "<br />status: " + status +
                        "<br />headers: " + jsonFilter(header) +
                        "<br />config: " + jsonFilter(config);
                });
        }
    }
    /*Get Fancy Result*/
            $scope.getFancyResult = function (sportId, match_id, fancy_Id) {
                var result1 = confirm("Are You sure want to set the Result ...");
                if (result1) {
                    var result = document.getElementById('result_' + fancy_Id).value;
                    var formData = {
                        sportId: sportId,
                        match_id: match_id,
                        fancy_Id: fancy_Id,
                        result: result
                    }
                    $http({
                        method: 'POST',
                        url: 'Lstsavemstrcontroller/updateFancyResult/',
                        data: formData, //forms user object
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                    .success(function (data) {
                        if (data.error == 0) {
                            Dialog.autohide('|' + data.message + '|');
                            $scope.FancyListDisplay();
                        } else {
                            Dialog.autohide('|' + data.message + '|');
                            $scope.FancyListDisplay();
                        }

                    });
                }

            }
            /*End of Get fancy Result*/

});
app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    }
});