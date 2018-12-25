 
<div class="row padding">
<div class="col-md-12 inplay">
<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
    <div class="panel panel-default">
        <div class="panel-heading" role="tab" id="headingOne">
          <a data-toggle="collapse" data-parent="#accordion" id="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
             <h4 class="panel-title">Cricket</h4>
          </a>

        </div>
        <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
            <div class="panel-body">
              <ul class="sport-high">
                  <li class="clearfix" ng-repeat="match in sportDetail" ng-show="match.sportname=='Cricket' && od.status=='OPEN'">

                          <div class="spor-lft">
                             <a ui-sref="userDashboard.{{getUrl(match.TypeID,'match.matchid','match.marketid',match.matchName,match.MstDate,match.SportId)}}" class="left-play">
                              {{match.matchName}} >>{{match.HeadName}}>>{{match.Market}}
                             <span class="glyphicon glyphicon-check" aria-hidden="true" ng-class="{'mat-stat':(od.inplay && od.status=='OPEN')}"></span>
                            </a>

                             <div class="right-play">
                               <span  ng-class="{'mat-stat':(od.inplay && od.status=='OPEN')}">{{od.status=='OPEN'?od.inplay?"In-Play":"Going In-Play":od.status}}</span>
                               <span style="color: rgb(221,44,0);font-weight: 600;">{{match.MstDate | date : 'EEEE HH:mm'}}</span>

                            </div>
                          </div>
                          <div class="spor-rgt" ng-if='od=(oddsDetail|filter:{"marketId":match.marketid})[0]' ng-show='od.status=="OPEN"'>
                            <ul class="odds-detail">
                              <li>
                                <a  class="cell back-cell">{{getOddCalcVal(od.runners[0].ex.availableToBack[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a class="cell lay-cell">{{getOddCalcVal(od.runners[0].ex.availableToLay[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell back-cell">{{getOddCalcVal(od.runners[2].ex.availableToBack[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell lay-cell">{{getOddCalcVal(od.runners[2].ex.availableToLay[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell back-cell">{{getOddCalcVal(od.runners[1].ex.availableToBack[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell lay-cell">{{getOddCalcVal(od.runners[1].ex.availableToLay[0].price,match.oddsLimit)}}</a>
                              </li>
                            </ul>
                          </div>
                  </li>
              </ul>
            </div>
        </div>
    </div>
    <div class="panel panel-default">
        <div class="panel-heading" role="tab" id="headingTwo">
          <a class="collapsed" data-toggle="collapse" data-parent="#accordion" id="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
             <h4 class="panel-title"> Soccer</h4>
          </a>
        </div>
        <div id="collapseTwo" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingTwo">
            <div class="panel-body">
              <ul class="sport-high">
                  <li class="clearfix" ng-repeat="match in sportDetail" ng-show="match.sportname=='Soccer' && od.status=='OPEN'">
                          <!-- {{match.sportname}} -->
                          <div class="spor-lft">
                             <a ui-sref="userDashboard.{{getUrl(match.TypeID,'match.matchid','match.marketid',match.matchName,match.MstDate,match.SportId)}}" class="left-play">
                              {{match.matchName}} >>{{match.HeadName}}>>{{match.Market}}
                             <span class="glyphicon glyphicon-check" aria-hidden="true" ng-class="{'mat-stat':(od.inplay && od.status=='OPEN')}"></span>
                            </a>

                             <div class="right-play">

                               <span  ng-class="{'mat-stat':(od.inplay && od.status=='OPEN')}">{{od.status=='OPEN'?od.inplay?"In-Play":"Going In-Play":od.status}}</span>
                                <span style="color: rgb(221,44,0);font-weight: 600;">{{match.MstDate | date : 'EEEE HH:mm'}}</span>

                            </div>
                          </div>
                          <div class="spor-rgt" ng-if='od=(oddsDetail|filter:{"marketId":match.marketid})[0]' ng-show='od.status=="OPEN"'>
                            <ul class="odds-detail">
                              <li>
                                <a  class="cell back-cell">{{getOddCalcVal(od.runners[0].ex.availableToBack[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a class="cell lay-cell">{{getOddCalcVal(od.runners[0].ex.availableToLay[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell back-cell">{{getOddCalcVal(od.runners[2].ex.availableToBack[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell lay-cell">{{getOddCalcVal(od.runners[2].ex.availableToLay[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell back-cell">{{getOddCalcVal(od.runners[1].ex.availableToBack[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell lay-cell">{{getOddCalcVal(od.runners[1].ex.availableToLay[0].price,match.oddsLimit)}}</a>
                              </li>
                            </ul>
                          </div>
                  </li>
              </ul>
            </div>
        </div>
    </div>
    <div class="panel panel-default">
        <div class="panel-heading" role="tab" id="headingThree">
           <a class="collapsed" data-toggle="collapse" data-parent="#accordion" id="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
             <h4 class="panel-title"> Tennis </h4>
           </a>
        </div>
        <div id="collapseThree" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingThree">
            <div class="panel-body">
              <!-- {{sportDetail}} -->
              <ul class="sport-high">
                  <li class="clearfix" ng-repeat="match in sportDetail" ng-show="match.sportname=='Tennis' && od.status=='OPEN'">
                          <!-- {{match.sportname}} -->
                           <div class="spor-lft">

                             <a ui-sref="userDashboard.{{getUrl(match.TypeID,'match.matchid','match.marketid',match.matchName,match.MstDate,match.SportId)}}" class="left-play">
                              {{match.matchName}}>> {{match.HeadName}}>>{{match.Market}}
                             <span class="glyphicon glyphicon-check" aria-hidden="true" ng-class="{'mat-stat':(od.inplay && od.status=='OPEN')}"></span>
                            </a>

                             <div class="right-play">

                               <span  ng-class="{'mat-stat':(od.inplay && od.status=='OPEN')}">{{od.status=='OPEN'?od.inplay?"In-Play":"Going In-Play":od.status}}</span>
                                <span style="color: rgb(221,44,0);font-weight: 600;">{{match.MstDate | date : 'EEEE HH:mm'}}</span>

                            </div>
                          </div>
                          <div class="spor-rgt" ng-if='od=(oddsDetail|filter:{"marketId":match.marketid})[0]' ng-show='od.status=="OPEN"'>
                            <ul class="odds-detail">
                              <li>
                                <a  class="cell back-cell">{{getOddCalcVal(od.runners[0].ex.availableToBack[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a class="cell lay-cell">{{getOddCalcVal(od.runners[0].ex.availableToLay[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell back-cell">{{getOddCalcVal(od.runners[2].ex.availableToBack[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell lay-cell">{{getOddCalcVal(od.runners[2].ex.availableToLay[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell back-cell">{{getOddCalcVal(od.runners[1].ex.availableToBack[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell lay-cell">{{getOddCalcVal(od.runners[1].ex.availableToLay[0].price,match.oddsLimit)}}</a>
                              </li>
                            </ul>
                          </div>
                  </li>
              </ul>
            </div>
        </div>
    </div>
    <!-- start code for Horse Racing -->
    <div class="panel panel-default">
        <div class="panel-heading" role="tab" id="headingThree">
           <a class="collapsed" data-toggle="collapse" data-parent="#accordion" id="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
             <h4 class="panel-title"> Horse Racing </h4>
           </a>
        </div>
        <div id="collapseThree" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingThree">
            <div class="panel-body">
              <!-- {{sportDetail}} -->
              <ul class="sport-high">
                  <li class="clearfix" ng-repeat="match in sportDetail" ng-show="match.sportname=='Horse Racing' && od.status=='OPEN'">
                          <!-- {{match}} -->
                           <div class="spor-lft">

                             <a ui-sref="userDashboard.{{getUrl(match.TypeID,'match.matchid','match.marketid',match.matchName,match.MstDate,match.SportId)}}" class="left-play">
                              {{match.matchName}}>> {{match.HeadName}}>>{{match.Market}}
                             <span class="glyphicon glyphicon-check" aria-hidden="true" ng-class="{'mat-stat':(od.inplay && od.status=='OPEN')}"></span>
                            </a>

                             <div class="right-play">

                               <span  ng-class="{'mat-stat':(od.inplay && od.status=='OPEN')}">{{od.status=='OPEN'?od.inplay?"In-Play":"Going In-Play":od.status}}</span>
                                <span style="color: rgb(221,44,0);font-weight: 600;">{{match.MstDate | date : 'EEEE HH:mm'}}</span>

                            </div>
                          </div>
                          <div class="spor-rgt" ng-if='od=(oddsDetail|filter:{"marketId":match.marketid})[0]' ng-show='od.status=="OPEN"'>
                            <ul class="odds-detail">
                              <li>
                                <a  class="cell back-cell">{{getOddCalcVal(od.runners[0].ex.availableToBack[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a class="cell lay-cell">{{getOddCalcVal(od.runners[0].ex.availableToLay[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell back-cell">{{getOddCalcVal(od.runners[2].ex.availableToBack[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell lay-cell">{{getOddCalcVal(od.runners[2].ex.availableToLay[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell back-cell">{{getOddCalcVal(od.runners[1].ex.availableToBack[0].price,match.oddsLimit)}}</a>
                              </li>
                              <li>
                                <a  class="cell lay-cell">{{getOddCalcVal(od.runners[1].ex.availableToLay[0].price,match.oddsLimit)}}</a>
                              </li>
                            </ul>
                          </div>
                  </li>
              </ul>
            </div>
        </div>
    </div>
    <!-- End the code of Horse Racing -->
   
</div>
</div>
</div>

        
</div>