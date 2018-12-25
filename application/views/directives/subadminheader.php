   <div>
   <div class="example3">
      <nav class="navbar navbar-inverse navbar-static-top">
        <div class="container-fluid">
           <div class="row padding">
            <div class="col-sm-1">
              
            <div class="navbar-header">
              <div class="status-icon">
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
                              <td>MatchName</td>
                              <td>FancyName</td>
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
                            <tr ng-repeat="fancy in GetfancyList1">
                              <td data-label="Sno">{{$index+1}}</td>
                              <td data-label="MatchName">{{fancy.matchName}}</td>
                              <td data-label="FancyName">{{fancy.HeadName}}</td>
                              <td data-label="Status" class="status-cont">
                                <input type="radio" name="{{fancy.ID}}" value="1" ng-checked="fancy.active == 1" ng-click="getFancyStatus(fancy.ID,1)"  />
                                <img src="app/images/active.png"/>
                                <input type="radio" name="{{fancy.ID}}" value="0" ng-checked="fancy.active == 0" ng-click="getFancyStatus(fancy.ID,0)" />
                                <img src="app/images/inactive.png"/>
                                <input type="radio" name="{{fancy.ID}}" value="2" ng-checked="fancy.active == 2" ng-click="getFancyStatus(fancy.ID,2)" />
                                <img src="app/images/suspend.png"/>
                                <input type="text" id="result_{{fancy.ID}}" value="{{fancy.result}}" name="result" style="width:90px;"  ng-show="$root.HelperAllRights==angular.isUndefinedOrNull || $root.HelperAllRights.Result==1" />

                               
                                <span ng-if="fancy.TypeID==2" ui-sref-active="active" ng-show="$root.HelperAllRights==angular.isUndefinedOrNull || $root.HelperAllRights.EditFancy==1">
                                  <a href="" class="result-btn" ng-click="getFancyResult(fancy.SportID,fancy.MatchID,fancy.ID)" ng-show="$root.HelperAllRights==angular.isUndefinedOrNull || $root.HelperAllRights.Result==1">Result</a>
                                  <a href="" class="edit-btn" ui-sref="subadminDashboard.Editfancycntr({FancyID:fancy.ID,TypeID:fancy.TypeID,MatchName:fancy.matchName,SportID:fancy.SportID,MatchID:fancy.MatchID})" ng-click="HideFancyDiv();">
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
        </div>
            </div>
            <div class="col-sm-6 col-xs-12">
              <div class="navbar-header ">
                 <a class="navbar-brand visible-xs" ui-sref="subadminDashboard.Home"><img src="app/images/logo_user.png" alt="logo"></a>
                  <a class="navbar-brand hidden-xs" ui-sref="subadminDashboard.Home"><img src="app/images/logo_user.png" alt="logo"></a>
              </div>
            </div>
          <div class="col-sm-5 subadmin_menu">
            <ul>
                <li ui-sref-active="active"><a ui-sref="subadminDashboard.Createfancy" class="btn btn-warning btn-sm">All Matches</a></li>
                <li ui-sref-active="active"><a ui-sref="subadminDashboard.myMarketCntr" class="btn btn-warning btn-sm">Mymarket</a></li>

                <li ui-sref-active="active"><a ui-sref="subadminDashboard.changePasswordUser" class="btn btn-warning btn-sm">Change Pwd</a></li>
                <li><button ng-click="logout();" class="btn btn-danger btn-sm">Logout</button></li>
            </ul>
          </div>
          
          <!--/.nav-collapse -->
         </div>
      </div>
        <!--/.container-fluid -->
      </nav>
    </div>

  </div>




