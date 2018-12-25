app.controller('ChiphistorycntrByuId', function ($scope, $http, $filter, $stateParams, sessionService, loginService, $rootScope, $location) {
    if ($rootScope.HelperAllRights != angular.isUndefinedOrNull && $rootScope.HelperAllRights.ChipHistory == 0) { $location.path('/dashboard/Home'); }//170213
    $scope.UserID = $stateParams.UserID;
    $scope.usetype = $stateParams.usetype;
    $scope.userName = $stateParams.userName;
    var columnDefs = [
            { headerName: "SNo", width: 30, field: "SrNo" },            
            { headerName: "Narration", width: 600, field: "narration", cellStyle: { color: 'BLACK', 'text-align': 'left' } },
            { headerName: "Date", field: "EDate", width: 130, cellStyle: { color: 'BLACK', 'text-align': 'center' } },
            { headerName: "Credit", field: "Credit", width: 80, cellStyle: { color: 'GREEN', 'text-align': 'right' } },
            { headerName: "Debit", field: "Debit", width: 80, cellStyle: { color: 'RED', 'text-align': 'right', 'margin-right': '10px' } },
            { headerName: "Balance", field: "Balance", width: 80, cellStyle: { color: 'BLUE', 'text-align': 'right', 'margin-right': '10px' } },
            { headerName: "ID", width: 50, field: "Mstcode" },
    ];
    var gridOptions = {
        enableSorting: true,
        enableFilter: true,
        debug: true,
        rowSelection: 'multiple',
        enableColResize: true,
        paginationPageSize: 500,
        columnDefs: columnDefs,
        rowModelType: 'pagination'
    };
    $scope.gridOptions=gridOptions;
    function onPageSizeChanged(newPageSize) {
        this.gridOptions.paginationPageSize = new Number(newPageSize);
        createNewDatasource();
    }
    var allOfTheData;
    function createNewDatasource() {
        if (!allOfTheData) { return; }
        var dataSource = {
            getRows: function (params) {
                setTimeout(function () {
                    var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
                    var lastRow = -1;
                    if (allOfTheData.length <= params.endRow) { lastRow = allOfTheData.length; }
                    params.successCallback(rowsThisPage, lastRow);
                }, 500);
            }
        };
        gridOptions.api.setDatasource(dataSource);
        //gridOptions.api.sizeColumnsToFit();
    }
    function setRowData(rowData) { allOfTheData = rowData; createNewDatasource(); }
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    var FROMDate = "null";
    var ToDate = "null";
    $http.get('Betentrycntr/Chip_historyById/' + $stateParams.UserID + '/' + $stateParams.usetype + '/' + 5 + '/' + $stateParams.parentId + '/' + FROMDate + '/' + ToDate).success(function (data, status, headers, config) {
        $scope.chip_data = data.chips_data;
        setRowData(data.chips_data);
        //gridOptions.api.sizeColumnsToFit();
        $scope.SumOfCreadit = $scope.sum($scope.chip_data, 'Credit');
        $scope.SumOfDebit = $scope.sum($scope.chip_data, 'Debit'); 
        $scope.Total=$scope.SumOfCreadit-$scope.SumOfDebit;
        if ($scope.Total>=0) {
            $scope.setClass=true;

        }else{
           $scope.setClass=false; 
        }
    });
    $scope.onBtExport=function() {
        
        var params = {
                skipHeader: false,
                skipFooters: true,
                skipGroups: true,
                fileName: "ChipHistory_"+$scope.userName+".csv"
            };
        this.gridOptions.api.exportDataAsCsv(params);       
    }
    $scope.history_back=function(){
        
        window.history.back();
    }
    $scope.sum = function(items, prop){
        
        return items.reduce( function(a, b){
             
            return parseFloat(a) + parseFloat(b[prop]);
        }, 0);
    };
});