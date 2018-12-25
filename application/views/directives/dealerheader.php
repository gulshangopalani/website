   <div ng-init='load()'>
   <div class="example3">
      <nav class="navbar navbar-inverse navbar-static-top">
        <div class="container-fluid">
           <div class="row padding">
            <div class="col-sm-3 col-xs-6">
              <div class="navbar-header ">
                  <a class="home-logo-pa" ui-sref="dealerDashboard.Home"><img src="app/images/Home_logo.png" alt="logo"></a>
              </div>
            </div>
          <div class="col-sm-9">
            <header-notificationdealer></header-notificationdealer>

          </div>

          <!--/.nav-collapse -->
         </div>
      </div>
        <!--/.container-fluid -->
      </nav>
    </div>

     <nav class="navbar navbar-default second-navbar">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand">Menu</a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="navbar-collapse-1">
          <ul class="nav navbar-nav navbar-left">
            <li ui-sref-active="active"><a ui-sref="dealerDashboard.Home">Dashboard</a></li>
            <li ui-sref-active="active"><a ui-sref="dealerDashboard.ClientList">ClientList</a></li>
            <li ui-sref-active="active"><a ui-sref="dealerDashboard.Chiphistorycntr">Chip History</a></li>
            <li ui-sref-active="active"><a ui-sref="dealerDashboard.ChipSummaryCntr">Chips Summary</a></li>
            <li ui-sref-active="active"><a ui-sref="dealerDashboard.alleMatchLst">AllSports</a></li>
            <li ui-sref-active="active"><a ui-sref="dealerDashboard.PointHistory">Point History</a></li>
          </ul>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container -->
    </nav><!-- /.navbar -->

  </div>




