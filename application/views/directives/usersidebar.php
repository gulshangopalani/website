  <div class="sidebar">
  <!--=======SLID-NAV 1============-->
      <section id="nav-1">
        <nav id="main-nav">
          <h2 class="title" ui-sref="userDashboard.Home">Home <a href="javascript:;">
               <span class="home-icon pull-right" id="menu-home"></span></a></h2>
          <ul class="ul" id="main-menu" >
            <li ng-repeat="displyData in sprtData" id="{{displyData.id}}" ><!-- ng-if="displyData.id !=7" -->
              <a href="javascript:;" ui-sref-active="active" ui-sref="userDashboard.{{displyData.name}}MatchLst" ng-click="displaysubmenu(displyData.id);getSeriesMatch(displyData.id, 0);">
                <img src="app/images/sportsicon/{{displyData.name}}.png">{{displyData.name}}
              </a>
            </li>
            <!-- <li ng-repeat="displyData in sprtData" id="{{displyData.id}}" ng-if="displyData.id ==7">
              <a href="javascript:;" ui-sref-active="active" ui-sref="userDashboard.HorseMatchLst" ng-click="displaysubmenu(displyData.id);getSeriesMatch(displyData.id, 0);">
                <img src="app/images/sportsicon/{{displyData.name}}.png">{{displyData.name}}
              </a>
            </li>  -->           
          </ul>
        </nav>
      </section>
      
      <!--=======SLID-NAV 3============-->            
      <section ng-repeat="displyData in sprtData"  class="nav-2" id="nav-2">
        <nav class="main-nav" id="{{displyData.id}}-sub-nav">
          <h2 class="title" ui-sref="userDashboard.Home">{{displyData.name}}<!-- ||{{displyData.id}} --> <a href="javascript:;">
           <span class="home-icon pull-right" id="menu-home"></span></a></h2>
          <ul class="ul">
            <li class="back">
              <a href="javascript:;" ng-click="backButton()">
                <i class="fa fa-angle-double-left" aria-hidden="true"></i>Previous
              </a>
            </li>
            <li class="not" ng-repeat="series in GetMatchData">
              <a href="javascript:;" ng-click="oddsdisplay(series.matchName);getMatchMarket(displyData.id,series.MstCode,series.matchName)">
                 {{series.matchName}} <!-- || {{series.active}}  --><i class="fa fa fa-chevron-right pull-right" id="arow"></i>
              </a>
            </li>
          </ul>
        </nav>
      </section>    
      <!--=======SLID-NAV 4============-->
      <section class="nav-2" id="nav-2">
        <nav class="main-nav" id="not-sub-nav">
          <h2 class="title" ui-sref="userDashboard.Home">{{MatchName}} <a href="javascript:;">
               <span class="home-icon pull-right" id="menu-home"></span></a></h2>
          <ul class="ul">
            <li class="sub-back">
              <a href="javascript:;">
                <i class="fa fa-angle-double-left" aria-hidden="true"></i>Previous
              </a>
            </li>
            <li ng-repeat="market in MatchMarket">
              <a href="javascript:;" ui-sref="userDashboard.Matchodds({MatchId: market.matchId,MarketId:market.Id,matchName:MatchName,date:market.createdOn,sportId:market.sportsId})" >
                 {{market.Name}} <!-- || {{market}} -->
              </a>
            </li>
            <li ng-repeat="fancyArr in getMatchFancy">
              <div  ng-if="fancyArr.TypeID==1 && fancyArr.IsPlay==0" ui-sref-active="active" >
                     <!-- <a ng-init="fancyArr.IsPlayIcon==1?chkMarketPPF=false:chkMarketPPF=true;" href="" ng-class="{true:'play comm-play',false:'pause comm-play'}[chkMarketPPF]" ng-click="sdMarketPP(displyData.id,series.MstCode,0,fancyArr.ID,fancyArr.IsPlayIcon)" ng-show="sessionusetype!=3">
                     </a>
                     <a ng-init="fancyArr.IsPlayIcon==1?chkMarketPPF=false:chkMarketPPF=true;" href="" ng-class="{true:'play comm-play',false:'pause comm-play'}[chkMarketPPF]" ng-show="sessionusetype==3">
                     </a>
                    <a class="match-od-link" ui-sref="dashboard.Evenoddfancy({matchId: series.MstCode,FancyID:fancyArr.ID,TypeID:fancyArr.TypeID,matchName:series.matchName,sportId: displyData.id})">{{fancyArr.HeadName}}</a> -->
                    <a href="">{{fancyArr.HeadName}}</a>
                  </div>
                  <div ng-if="fancyArr.TypeID==2 && fancyArr.IsPlay==0" ui-sref-active="active">
                      <!-- <a ng-init="fancyArr.IsPlayIcon==1?chkMarketPPF=false:chkMarketPPF=true;" href="" ng-class="{true:'play comm-play',false:'pause comm-play'}[chkMarketPPF]" ng-click="sdMarketPP(displyData.id,series.MstCode,0,fancyArr.ID,fancyArr.IsPlayIcon)" ng-show="sessionusetype!=3">
                      </a>
                     
                    <a class="match-od-link" ui-sref="dashboard.Sessionfancy({matchId: series.MstCode,FancyID:fancyArr.ID,TypeID:fancyArr.TypeID,matchName:series.matchName,sportId: displyData.id})">{{fancyArr.HeadName}}</a> -->
                     <a href="">{{fancyArr.HeadName}}</a>
                  </div>
                  <div ng-if="fancyArr.TypeID==3 && fancyArr.IsPlay==0" ui-sref-active="active">
                    <!-- <a ng-init="fancyArr.IsPlayIcon==1?chkMarketPPF=false:chkMarketPPF=true;" href="" ng-class="{true:'play comm-play',false:'pause comm-play'}[chkMarketPPF]" ng-click="sdMarketPP(displyData.id,series.MstCode,0,fancyArr.ID,fancyArr.IsPlayIcon)" ng-show="sessionusetype!=3">
                    </a>
                    <a ng-init="fancyArr.IsPlayIcon==1?chkMarketPPF=false:chkMarketPPF=true;" href="" ng-class="{true:'play comm-play',false:'pause comm-play'}[chkMarketPPF]" ng-show="sessionusetype==3">
                    </a> 
                    <a class="match-od-link" ui-sref="dashboard.Khaddalfancy({matchId: series.MstCode,FancyID:fancyArr.ID,TypeID:fancyArr.TypeID,matchName:series.matchName,sportId: displyData.id})">{{fancyArr.HeadName}}</a> -->
                    <a href="">{{fancyArr.HeadName}}</a>
                  </div>
                  <div ng-if="fancyArr.TypeID==4 && fancyArr.IsPlay==0" ui-sref-active="active">
                     <!-- <a ng-init="fancyArr.IsPlayIcon==1?chkMarketPPF=false:chkMarketPPF=true;" href="" ng-class="{true:'play comm-play',false:'pause comm-play'}[chkMarketPPF]" ng-click="sdMarketPP(displyData.id,series.MstCode,0,fancyArr.ID,fancyArr.IsPlayIcon)" ng-show="sessionusetype!=3">
                     </a>
                     <a ng-init="fancyArr.IsPlayIcon==1?chkMarketPPF=false:chkMarketPPF=true;" href="" ng-class="{true:'play comm-play',false:'pause comm-play'}[chkMarketPPF]" ng-show="sessionusetype==3">
                     </a> 
                    <a class="match-od-link" ui-sref="dashboard.Lastdigit({matchId: series.MstCode,FancyID:fancyArr.ID,TypeID:fancyArr.TypeID,matchName:series.matchName,sportId: displyData.id})">{{fancyArr.HeadName}}</a> -->
                    <a href="">{{fancyArr.HeadName}}</a>
                  </div>
                  <div ng-if="fancyArr.TypeID==5 && fancyArr.IsPlay==0" ui-sref-active="active">
                      <!-- <a ng-init="fancyArr.IsPlayIcon==1?chkMarketPPF=false:chkMarketPPF=true;" href="" ng-class="{true:'play comm-play',false:'pause comm-play'}[chkMarketPPF]" ng-click="sdMarketPP(displyData.id,series.MstCode,0,fancyArr.ID,fancyArr.IsPlayIcon)" ng-show="sessionusetype!=3">
                      </a>
                      <a ng-init="fancyArr.IsPlayIcon==1?chkMarketPPF=false:chkMarketPPF=true;" href="" ng-class="{true:'play comm-play',false:'pause comm-play'}[chkMarketPPF]" ng-show="sessionusetype==3">
                      </a>
                    <a class="match-od-link" ui-sref="dashboard.Updown({matchId: series.MstCode,FancyID:fancyArr.ID,TypeID:fancyArr.TypeID,matchName:series.matchName,sportId: displyData.id})">{{fancyArr.HeadName}}</a> -->
                    <a href="">{{fancyArr.HeadName}}</a>
                  </div>
            </li>                     
          </ul>
        </nav>

      </section>

  </div>