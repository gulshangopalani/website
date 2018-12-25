app.controller('Onlineusersctrl', function($scope,$http,$filter,sessionService, loginService,$interval){
  
  $scope.loginId = sessionStorage.user_id;
  $scope.type = sessionStorage.type;
        $http.get('Betentrycntr/online_users/'+sessionService.get('type')+'/'+sessionService.get('user_id')).success(function (data, status, headers, config) { 
            $scope.online_user = data.online_user;
            setRowData(data.online_user); 
        });
        //$timeout(get_onlineusers(), 1000);
        $scope.onBtExport = function () {
            var params = {
                skipHeader: false,
                skipFooters: true,
                skipGroups: true,
                fileName: "online_users.csv"
            };
            gridOptions.api.exportDataAsCsv(params);
        }
        
        $interval( function(){ $scope.get_onlineusers(); }, 4000);
                  /*strat*/
                $scope.get_onlineusers=function(){
                    $http.get('Betentrycntr/online_users/'+sessionService.get('type')+'/'+sessionService.get('user_id')).success(function (data, status, headers, config) {
                                                      
                        if ($scope.online_user.length == data.online_user.length) {

                             $scope.online_user = data.online_user;
                        }else{
                            $scope.online_user = data.online_user;
                            setRowData(data.online_user);   
                        }
                    });
                }
                       
             
                /*end*/
   
          /*start*/
            var columnDefs = [
                // this row just shows the row index, doesn't use any data from the row
                {headerName: "#", width: 30, cellRenderer: function(params) {
                    return ++params.node.id;
                } },
                
                {headerName: "User ID", field: "mstruserid", width: 350},
                {headerName: "Login Time", field: "logstdt", width: 350},
                {headerName: "IP Address", field: "ipadress", width: 350},
               
            ];

            var gridOptions = {
                // note - we do not set 'virtualPaging' here, so the grid knows we are doing standard paging
                enableSorting: true,
                enableFilter: true,
                debug: true,
                rowSelection: 'multiple',
                enableColResize: true,
                paginationPageSize: 500,
                columnDefs: columnDefs,
                rowModelType: 'pagination'
            };
            /*function numberFormatter(params) {
                if (params.value == 0) {
                    return 'lay-head';
                } else {
                    return 'back-head';
                }
            }*/

            function onPageSizeChanged(newPageSize) {
                this.gridOptions.paginationPageSize = new Number(newPageSize);
                createNewDatasource();
            }

            // when json gets loaded, it's put here, and  the datasource reads in from here.
            // in a real application, the page will be got from the server.
            var allOfTheData;

            function createNewDatasource() {
                if (!allOfTheData) {
                    // in case user selected 'onPageSizeChanged()' before the json was loaded
                    return;
                }

                var dataSource = {
                    //rowCount: ???, - not setting the row count, infinite paging will be used
                    getRows: function (params) {
                       
                        //console.log('asking for ' + params.startRow + ' to ' + params.endRow);
                        setTimeout( function() {
                            // take a chunk of the array, matching the start and finish times
                            var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
                          
                            var lastRow = -1;
                            if (allOfTheData.length <= params.endRow) {
                                lastRow = allOfTheData.length;
                            }
                            params.successCallback(rowsThisPage, lastRow);
                        }, 500);
                    }
                };

                gridOptions.api.setDatasource(dataSource);
            }

            function setRowData(rowData) {
                allOfTheData = rowData;
                createNewDatasource();
            }

            // setup the grid after the page has finished loading
            //document.addEventListener('DOMContentLoaded', function() {
                var gridDiv = document.querySelector('#myGrid');
                new agGrid.Grid(gridDiv, gridOptions);

               
              
                
            //});

              /*End */
        /*End of AG_GRID*/
        /*End of Ag Grid*/
    });

  //end
   
