app.controller('CrtSubAdminCntr', function ($scope, $http) {
    $http.get('Createdealercontroller/getSubadmin').success(function (data, status, headers, config) {
        debugger;
        $scope.subadmin = data.subadmin;
    });
    $scope.submitForm = function () {
        var formData = {
            name: $scope.name,
            username: $scope.username,
            password: $scope.password,
            type: 4,
        }
        $http({
            method: 'POST',
            url: 'Createdealercontroller/SaveSubAdmin/',
            data: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data) {
            if (data.message.error == 0) {
                $scope.message = data.message.message;
                $scope.subadmin = data.subadmin;
            } else {
                $scope.message = data.message.message;
            }
        });
    };
    $scope.checkUserName = function () {
        /*var username = $scope.username;
        if (username==angular.isUndefinedOrNull || username.length < 4) {
            $scope.errorMsg = "Username must be greater than Four Charector";
        } else {
            $http({
                method: 'POST',
                url: 'Createmastercontroller/CheckUserName/' + username,
                data: username,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                if (data.error == 0) {
                    $scope.errorMsg = data.message;
                } else {
                    $scope.errorMsg = data.message;
                }
            });
        }*/
    };
});