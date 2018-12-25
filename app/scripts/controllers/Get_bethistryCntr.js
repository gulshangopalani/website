app.controller('Get_bethistryCntr', function ($scope, $http, $filter, sessionService, loginService, $interval) {
    var columnDefs = [
        { headerName: "SNo.", width: 30,field: "SrNo", },       
        { headerName: "Description", width: 400, field: "Description", cellClass: function (params) { return (params.data.Type == 'Lay' ? 'lay-head' : 'back-head'); } },
        { headerName: "Selection Name", width: 100, field: "selectionName", cellClass: function (params) { return (params.data.Type == 'Lay' ? 'lay-head' : 'back-head'); } },
        { headerName: "MatchName", width: 100, field: "MatchName", cellClass: function (params) { return (params.data.Type == 'Lay' ? 'lay-head' : 'back-head'); } },
        { headerName: "Date", width: 100, field: "CreatedOn", cellClass: function (params) { return (params.data.Type == 'Lay' ? 'lay-head' : 'back-head'); } },
        { headerName: "Type", width: 70, field: "Type", cellClass: function (params) { return (params.data.Type == 'Lay' ? 'lay-head' : 'back-head'); } },
        { headerName: "Odds", width: 70, field: "Odds", cellClass: function (params) { return (params.data.Type == 'Lay' ? 'lay-head' : 'back-head'); } },
        { headerName: "Stack", width: 70, field: "Stack", cellClass: function (params) { return (params.data.Type == 'Lay' ? 'lay-head' : 'back-head'); } },
        { headerName: "Date", width: 130, field: "MstDate", cellClass: function (params) { return (params.data.Type == 'Lay' ? 'lay-head' : 'back-head'); } },
        { headerName: "P_L", width: 80, field: "P_L", cellClass: function (params) { return (params.data.Type == 'Lay' ? 'lay-head col-right' : 'back-head col-right'); } },
        { headerName: "Profit", width: 80, field: "Profit", cellClass: 'col-right', cellClass: function (params) { return (params.data.Type == 'Lay' ? 'lay-head' : 'back-head'); } },
        { headerName: "Liability", width: 80, field: "Liability", cellClass: function (params) { return (params.data.Type == 'Lay' ? 'lay-head col-right' : 'back-head col-right'); } },
        { headerName: "Status", width: 80, field: "STATUS", cellClass: function (params) { return (params.data.Type == 'Lay' ? 'lay-head  col-status' : 'back-head  col-status'); } },
        { headerName: "Id.", width: 50, field: "mstcode", },
    ];
    if (sessionService.get('type') == 0 || sessionService.get('type') == 1) {
    columnDefs.splice(3, 0, {
        headerName: "Client", width: 100, field: "UserNm", cellClass: function (params) { return (params.data.Type == 'Lay' ? 'lay-head' : 'back-head'); }
    });
        columnDefs.splice(3, 0, {
            headerName: "Dealer", width: 100, field: "DealerNm", cellClass: function (params) { return (params.data.Type == 'Lay' ? 'lay-head' : 'back-head'); }
        });
    }
    else if (sessionService.get('type') == 2) {
            columnDefs.splice(3, 0, {
                headerName: "Client", width: 100, field: "UserNm", cellClass: function (params) { return (params.data.Type == 'Lay' ? 'lay-head' : 'back-head'); }
            });
        }
    /*function GetOddsName(params) {
        if (params.data.OddValue==0) {
             return "DOWN[Back]";
        }else{
             return "UP[Lay]";
        }
       // return thisYear - params.data.OddValue + params.data.age;
    }*/
    var gridOptions = {
        // note - we do not set 'virtualPaging' here, so the grid knows we are doing standard paging
        enableSorting: true,
        enableFilter: true,
        debug: true,
        rowSelection: 'multiple',
        enableColResize: true,
        paginationPageSize: 1000,
        columnDefs: columnDefs,
        rowModelType: 'pagination',
        onGridReady: function () {
            //gridOptions.api.sizeColumnsToFit();
        }
    };
    function onPageSizeChanged(newPageSize) {
        this.gridOptions.paginationPageSize = new Number(newPageSize);
        createNewDatasource();
    }
    var allOfTheData;
    function createNewDatasource() {
        if (!allOfTheData) {return;}
        var dataSource = {
            //rowCount: ???, - not setting the row count, infinite paging will be used
            getRows: function (params) {
                // this code should contact the server for rows. however for the purposes of the demo,
                // the data is generated locally, a timer is used to give the experience of
                // an asynchronous call
                //console.log('asking for ' + params.startRow + ' to ' + params.endRow);
                setTimeout(function () {
                    var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
                    var lastRow = -1;
                    if (allOfTheData.length <= params.endRow) {
                        lastRow = allOfTheData.length;
                    }
                    params.successCallback(rowsThisPage, lastRow);
                }, 500);
            }
        };
        var s = gridOptions.api.setDatasource(dataSource);
        //gridOptions.api.sizeColumnsToFit(s);
    }

    function autoSizeAll() {
        var allColumnIds = [];
        columnDefs.forEach(function (columnDef) {
            allColumnIds.push(columnDef.field);
        });
        gridOptions.columnApi.autoSizeColumns(allColumnIds);
    }

    function setRowData(rowData) {
        allOfTheData = rowData;
        createNewDatasource();
    }
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    $http.get('Betentrycntr/BetHistory/' + sessionService.get('user_id')).success(function (data, status, headers, config) {
        
        $scope.BetHistory = data.BetHistory;
        
        setRowData(data.BetHistory);
        //gridOptions.api.sizeColumnsToFit();
        $scope.SumOfP_L = $scope.sum($scope.BetHistory, 'P_L');
        $scope.SumOfProfit = $scope.sum($scope.BetHistory, 'Profit');
        $scope.SumOfLiability = $scope.sum($scope.BetHistory, 'Liability'); 
    });
    $scope.sum = function(items, prop){
        
        return items.reduce( function(a, b){
             
             if (b[prop]==null || b[prop]=="") b[prop]=0;            
                return parseFloat(a) + parseFloat(b[prop]);
        }, 0);
    };
    $scope.onBtExport = function () {
        var params = {
            skipHeader: false,
            skipFooters: true,
            skipGroups: true,
            fileName: "BetHistory.csv"
        };
        gridOptions.api.exportDataAsCsv(params);
    }
});