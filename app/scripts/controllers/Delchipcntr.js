app.controller("Delchipcntr",["$scope","$http","$filter","sessionService","loginService",function(e,t,n,i,a){function r(e){var t=document.createElement("button");return t.className="del-btn",t.innerHTML='<span class="glyphicon glyphicon-trash"></span>',t.addEventListener("click",function(){c(e)}),t}function c(n){var n,i=confirm("Are you sure want to Delete ?");i&&t.get("Chipscntrl/deleteCashEntry/"+n.data.rowId).success(function(t,n,i,a){e.cashList()})}function l(){if(d){var t={getRows:function(e){setTimeout(function(){var t=d.slice(e.startRow,e.endRow),n=-1;d.length<=e.endRow&&(n=d.length),e.successCallback(t,n)},500)}};e.CurrentAllBetsUn.api.setDatasource(t)}}function o(e){d=e,l()}var s=[{headerName:"Sno",width:30,field:"SrNo"},{headerName:"Parent Name",width:110,field:"parentUser"},{headerName:"Child Name",width:110,field:"childUser"},{headerName:"DateTime",width:130,field:"onDate"},{headerName:"Amount",width:80,field:"amountV"},{headerName:"Remark",width:100,field:"remarkV"},{headerName:"Action",width:60,cellRenderer:r},{headerName:"ID",width:50,field:"rowId"}];e.CurrentAllBetsUn={enableSorting:!0,enableFilter:!0,debug:!0,rowSelection:"multiple",enableColResize:!0,paginationPageSize:100,columnDefs:s,rowModelType:"pagination"};var d;e.cashList=function(){t.get("Chipscntrl/getChipDelList").success(function(t,n,i,a){e.chipData=t,e.currentPage=1,e.entryLimit=50,e.filteredItems=e.chipData.length,e.totalItems=e.chipData.length,e.chipData1=t.delChipData,o(e.chipData1)})},e.setPage=function(t){e.currentPage=t},e.filter=function(){$timeout(function(){e.filteredItems=e.filtered.length},10)},e.sort_by=function(t){e.predicate=t,e.reverse=!e.reverse},e.cashList(),e.del_record=function(n){var i=confirm("Are you sure want to Delete ?");i&&t.get("Chipscntrl/deleteCashEntry/"+n).success(function(t,n,i,a){e.cashList()})}}]),app.filter("startFrom",function(){return function(e,t){return e?(t=+t,e.slice(t)):[]}});