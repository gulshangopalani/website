app.controller("Chiphistorycntr", ["$scope", "$http", "$filter", "sessionService", "loginService", "$rootScope", "$location", function(e, t, i, a, r, l, n) {
    function d(t) {
        var i = document.createElement("a");
        return console.log(t), i.innerHTML = "" + t.data.narration, i.addEventListener("click", function() {
            9 != t.data.TypeID && 6 != t.data.TypeID ? e.raiseevent(t) : console.log("TYPEID IS" + t.data.TypeID)
        }), i
    }

    function o(t) {
        if (p) {
            var i = {
                getRows: function(e) {
                    setTimeout(function() {
                        var t = p.slice(e.startRow, e.endRow),
                            i = -1;
                        p.length <= e.endRow && (i = p.length), e.successCallback(t, i)
                    }, 500)
                }
            };
            "lgr" == t ? e.gridOptionslgr.api.setDatasource(i) : e.gridOptions.api.setDatasource(i)
        }
    }

    function s(e, t) {
        p = e, o(t)
    }
    l.HelperAllRights != angular.isUndefinedOrNull && 0 == l.HelperAllRights.ChipHistory && n.path("/dashboard/Home"), e.legershow = !1, e.hstshow = !1, e.typeDropDown = [{
        value: "0",
        label: "Chip"
    }, {
        value: "1",
        label: "Free Chip"
    }, {
        value: "2",
        label: "Win"
    }, {
        value: "3",
        label: "Lose"
    }, {
        value: "5",
        label: "All"
    }], e.loginId = sessionStorage.user_id, e.type = sessionStorage.type;
    var h = [{
            headerName: "SNo",
            width: 50,
            suppressMenu: true,
            field: "SrNo",
            cellClass: function(e) {
                return 1 == e.data.isBack ? "lay-head" : "back-head"
            }
        }, {
            headerName: "Narration",
            width: 500,
            field: "narration",
            cellStyle: {
                color: "BLACK",
                "text-align": "center"
            }
        }, {
            headerName: "MstDate",
            field: "EDate",
            width: 150
        }, {
            headerName: "Credit",
            field: "Credit",
            cellStyle: {
                color: "GREEN",
                "text-align": "center",
                "margin-right": "10px",
                "padding-right": "15px"
            },
            width: 100
        }, {
            headerName: "Debit",
            field: "Debit",
            cellStyle: {
                color: "RED",
                "text-align": "center",
                "margin-right": "10px",
                "padding-right": "15px"
            },
            width: 100
        }, {
            headerName: "Odds",
            field: "Odds",
            width: 100,
            cellStyle: {
                color: "BLACK",
                "text-align": "center"
            }
        }, {
            headerName: "Stake",
            field: "Stack",
            width: 100,
            cellStyle: {
                color: "BLACK",
                "text-align": "center"
            }
        }, {
            headerName: "Status",
            field: "Status_",
            width: 100,
            cellStyle: {
                color: "BLACK",
                "text-align": "center"
            }
        }, {
            headerName: "Total",
            field: "Total",
            cellStyle: {
                color: "BLUE",
                "text-align": "center",
                "margin-right": "10px",
                "padding-right": "15px"
            },
            width: 100
        }, {
            headerName: "ID",
            width: 60,
            field: "Mstcode",
            cellStyle: {
                color: "BLACK",
                "text-align": "center"
            }
        }],
        c = [{
            headerName: "Sno",
            width: 50,
            suppressMenu: true, 
            field: "SrNo"
        }, {
            headerName: "Narration",
            width: 590,
            field: "narration",
            cellRenderer: d,
            cellStyle: {
                color: "BLACK",
                "text-align": "left",
                "white-space": "normal"
            }
        }, {
            headerName: "Date",
            field: "EDate",
            width:200,
            cellStyle: {
                color: "BLACK",
                "text-align": "center",
                "white-space": "pre-line"
            }
        }, {
            headerName: "Credit",
            field: "Credit",
            width: 130,
            cellStyle: {
                color: "GREEN",
                "text-align": "right",
                "white-space": "pre-line"
            }
        }, {
            headerName: "Debit",
            field: "Debit",
            width: 150,
            cellStyle: {
                color: "RED",
                "text-align": "right",
                "margin-right": "10px",
                "padding-right": "15px",
                "white-space": "normal"
            }
        }, {
            headerName: "Balance",
            field: "Balance",
            width: 150,
            cellStyle: {
                color: "BLUE",
                "text-align": "right",
                "margin-right": "10px",
                "padding-right": "15px",
                "white-space": "normal"
            }
        }, {
            headerName: "id",
            width:80,
            field: "Mstcode",
            cellStyle: {
                "white-space": "normal"
            }
        }];
    e.raiseevent = function(i) {
        var i;
        e.hstshow = !0, e.legershow = !1, t.get("Betentrycntr/Chip_history/" + i.data.UserID + "/" + sessionStorage.type + "/" + i.data.MatchId + "/" + i.data.MarketId + "/" + i.data.oppAcID).success(function(t, i, a, r) {
            e.chip_data = t.chips_data, s(t.chips_data, ""), e.SumOfCreadit = e.sum(e.chip_data, "Credit"), e.SumOfDebit = e.sum(e.chip_data, "Debit")
        })
    }, e.gridOptions = {
        enableSorting: !0,
        enableFilter: !0,
        debug: !0,
        rowSelection: "multiple",
        enableColResize: !0,
        paginationPageSize: 5000,
        columnDefs: h,
        rowModelType: "pagination"
    }, e.gridOptionslgr = {
        enableSorting: !0,
        enableFilter: !0,
        debug: !0,
        rowSelection: "multiple",
        enableColResize: !0,
        paginationPageSize: 5000,
        columnDefs: c,
        rowModelType: "pagination",
        // getRowHeight: function(e) {
        //     25 * (Math.floor(e.data.narration.length / 45) + 1);
        //     return 18 * (Math.floor(e.data.narration.length / 36) + 1.2)
        // }
    };
    var p;
    e.getChipHistoryData = function(i, a, r, l) {
        t.get("Betentrycntr/Chip_history/" + e.loginId + "/" + from + "/" + to + "/" + type + "/" + e.type).success(function(t, i, a, r) {
            e.chip_data = t.chips_data, s(t.chips_data, ""), e.SumOfCreadit = e.sum(e.chip_data, "Credit"), e.SumOfDebit = e.sum(e.chip_data, "Debit")
        })
    }, e.ChipLeger = function(a, r, l, n) {
        if (e.legershow = !0, e.hstshow = !1, void 0 == l) var d = 1;
        else var d = l;
        if (a == angular.isUndefinedOrNull || r == angular.isUndefinedOrNull) var o = "",
            h = "";
        else if (a != angular.isUndefinedOrNull && r != angular.isUndefinedOrNull) var o = i("date")(a, "yyyy-MM-dd"),
            h = i("date")(r, "yyyy-MM-dd");
        t.get("Betentrycntr/Chip_leger/" + sessionStorage.user_id + "/" + sessionStorage.type + "/" + d + "/" + o + "/" + h).success(function(t, i, a, r) {
            e.chips_lgr = t.chips_lgr, s(t.chips_lgr, "lgr"), e.SumOfCreadit = e.sum(e.chips_lgr, "Credit"), e.SumOfDebit = e.sum(e.chips_lgr, "Debit")
        })
    }, e.ChipLeger(angular.isUndefinedOrNull, angular.isUndefinedOrNull, angular.isUndefinedOrNull, angular.isUndefinedOrNull), e.sum = function(e, t) {
        return e.reduce(function(e, i) {
            return parseFloat(e) + parseFloat(i[t])
        }, 0)
    }, e.onBtExport = function(t) {
        if (1 == t) {
            var i = {
                skipHeader: !1,
                skipFooters: !0,
                skipGroups: !0,
                fileName: "ChipHistory.csv"
            };
            e.gridOptions.api.exportDataAsCsv(i)
        } else {
            var i = {
                skipHeader: !1,
                skipFooters: !0,
                skipGroups: !0,
                fileName: "ChipLeger.csv"
            };
            e.gridOptionslgr.api.exportDataAsCsv(i)
        }
    }
}]);