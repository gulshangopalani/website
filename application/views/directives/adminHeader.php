<div class="example3">
<nav class="navbar navbar-inverse navbar-static-top">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-4 col-xs-6">
           
            <div class="navbar-header">
             <a id="mobileDemo" class="button-collapse"><i class="fa fa-bars"></i></a>
              <div class="status-icon" ng-if="usertype == 0">
                <span>
                  <a class="status-btn" ng-click="displayFancyTest1();FancyListDisplay()">
                    <img src="app/images/Status-tray.png"/></a>

                  <ul class="dropdown-stat" ng-show="showvalue==true">

                    <button type="button" class="ref-stat" ng-click="FancyListDisplay()">
                      <span class="glyphicon glyphicon-retweet"></span>
                    </button>

                    <div class="close-stat">
                      <span class="glyphicon glyphicon-remove" ng-click="HideFancyDiv();"></span>
                    </div>
                    <li>
                      <div class="resp_table2">
                        <table class="table">
                          <thead>
                            <tr>
                              <td>Sno</td>
                              <td>Match<input type="text" ng-model="search.matchName" placeholder="Search by Match Name"></td>
                              <td>Fancy<input type="text" ng-model="search.HeadName" placeholder="Search by FancyName"></td>
                              <td>
                                Status :-

                                <span class="stat-head">
                                  <img src="app/images/active.png"/>Active
                                  <img src="app/images/inactive.png"/>Inactive
                                  <img src="app/images/suspend.png"/>Suspend
                                </span>
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <!-- {{GetfancyList1}} -->
                            <tr ng-repeat="fancy in GetfancyList1 | filter:search">
                              <td data-label="Sno">{{$index+1}}</td>
                              <td data-label="MatchName">{{fancy.matchName}}</td>
                              <td data-label="FancyName">{{fancy.HeadName}}</td>
                              <td data-label="Status" class="status-cont">
                                <input type="radio" name="{{fancy.ID}}" value="1" ng-checked="fancy.active == 1" ng-click="getFancyStatus(fancy.ID,1)"  />
                                <img src="app/images/active.png"/>
                                <input type="radio" name="{{fancy.ID}}" value="0" ng-checked="fancy.active == 0" ng-click="getFancyStatus(fancy.ID,0)" />
                                <img src="app/images/inactive.png"/>
                                <input type="radio" name="{{fancy.ID}}" value="2" ng-checked="fancy.active == 2" ng-click="getFancyStatus(fancy.ID,2,1)" />
                                <img src="app/images/suspend.png"/>
                                <input type="text" id="result_{{fancy.ID}}" value="{{fancy.result}}" name="result" style="width:90px;"  ng-show="$root.HelperAllRights==angular.isUndefinedOrNull || $root.HelperAllRights.Result==1" />

                                <div ng-if="fancy.TypeID==1" class="even_oddpopup" ng-show="$root.HelperAllRights==angular.isUndefinedOrNull || $root.HelperAllRights.EditFancy==1">
                                  <a href="" class="result-btn" ng-click="getFancyUpDown(fancy.SportID,fancy.MatchID,fancy.ID,fancy.TypeID)" ng-show="$root.HelperAllRights==angular.isUndefinedOrNull || $root.HelperAllRights.Result==1">Result</a>
                                  <a href="" class="edit-btn" ng-click="editOddEvenFancy(fancy.ID,fancy.TypeID,fancy.matchName,fancy.SportID,fancy.HeadName);HideFancyDiv();">
                                    <span class="glyphicon glyphicon-pencil"></span>
                                  </a>
                                </div>
                                <span ng-if="fancy.TypeID==2" ui-sref-active="active" ng-show="$root.HelperAllRights==angular.isUndefinedOrNull || $root.HelperAllRights.EditFancy==1">
                                  <a href="" class="result-btn" ng-click="getFancyResult(fancy.SportID,fancy.MatchID,fancy.ID)" ng-show="$root.HelperAllRights==angular.isUndefinedOrNull || $root.HelperAllRights.Result==1">Result</a>
                                  <a href="" class="edit-btn" ui-sref="dashboard.Editfancycntr({FancyID:fancy.ID,TypeID:fancy.TypeID,MatchName:fancy.matchName,SportID:fancy.SportID,MatchID:fancy.MatchID})" ng-click="HideFancyDiv();">
                                    <span class="glyphicon glyphicon-pencil"></span>
                                  </a>
                                </span>
                                <span ng-if="fancy.TypeID==3 || fancy.TypeID==4" ng-show="$root.HelperAllRights==angular.isUndefinedOrNull || $root.HelperAllRights.EditFancy==1">
                                  <a href="" class="result-btn" ng-click="getFancyUpDown(fancy.SportID,fancy.MatchID,fancy.ID,fancy.TypeID)" ng-show="$root.HelperAllRights==angular.isUndefinedOrNull || $root.HelperAllRights.Result==1">Result</a>
                                  <a href="" class="edit-btn" ng-click="editFancy(fancy.ID,fancy.TypeID,fancy.matchName,fancy.SportID,fancy.HeadName)">
                                    <span class="glyphicon glyphicon-pencil"></span>
                                  </a>
                                </span>
                                <span ng-if="fancy.TypeID==5" ui-sref-active="active" ng-show="$root.HelperAllRights==angular.isUndefinedOrNull || $root.HelperAllRights.EditFancy==1">
                                  <a href="" class="result-btn" ng-click="getFancyUpDown(fancy.SportID,fancy.MatchID,fancy.ID,fancy.TypeID)" ng-show="$root.HelperAllRights==angular.isUndefinedOrNull || $root.HelperAllRights.Result==1">Result</a>
                                  <a href="" class="edit-btn" ui-sref="dashboard.EditUpdown({FancyID:fancy.ID,TypeID:fancy.TypeID,MatchName:fancy.matchName,SportID:fancy.SportID})" ng-click="HideFancyDiv();">
                                    <span class="glyphicon glyphicon-pencil"></span>
                                  </a>
                                </span>
                              </td>
                            </tr>
                          </tbody>

                        </table>
                      </div>

                    </li>

                  </ul>


                </span>
              </div>
              <div class="status-icon" ng-if="usertype != 0 && displayFicon==true">
                <span>
                  <button type="button" class="fancy-blink-btn blink" name="changerate" ng-click="displayFancyTest1();">F</button>
                  <ul class="dropdown-stat" ng-show="showvalue==true">
                    <div class="close-stat">
                      <span class="glyphicon glyphicon-remove" ng-click="closeBlink(FancyIcon[0].ID);"></span>
                    </div>
                    <li class="fancy-blink-li">
                      <div class="resp_table2">
                          <span class="fancy-head">{{FancyIcon[0].HeadName}} >></span> {{FancyIcon[0].matchName}}
                          <button type="button" class="goto-fancy" ng-click="RedirectToFancy(FancyIcon[0].ID,FancyIcon[0].TypeID,FancyIcon[0].MatchID,FancyIcon[0].SportID,FancyIcon[0].matchName);">Go To Fancy</button>                  
                      </div>
                    </li>
                  </ul>
                </span>
              </div>

                 <!--  <a class="navbar-brand visible-xs" ui-sref="dashboard.Home"><img src="app/images/CricExchangeSmall.png" alt="logo"></a>
                  <a class="navbar-brand hidden-xs" ui-sref="dashboard.Home"><img src="app/images/CricExchange.png" alt="logo"></a> -->
          
        </div>
      </div>
        <div class="col-sm-8">
         <header-notification></header-notification>
        </div>
    </div>
  </div>
</nav>
    <sidebar></sidebar>
  </div>