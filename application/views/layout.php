<?php
  defined('BASEPATH') or exit('No direct script access allowed');
?>
<!DOCTYPE html>
<html class="no-js">
  <head>
      <meta http-equiv="cache-control" content="max-age=0" />
      <meta http-equiv="cache-control" content="no-cache" />
      <meta http-equiv="expires" content="0" />
      <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
      <meta http-equiv="pragma" content="no-cache" />
      <script> var BASE_URL = "<?php echo site_url(); ?>";</script>    

      <meta charset="utf-8"></meta>
      <meta name="description" content=""></meta>
      <meta name="viewport" content="width=device-width"></meta>
      <title>	<?php echo $this->config->item('title'); ?></title>
      <link rel="stylesheet" href="app/assets/css/angular-material.css" />
      <link rel="stylesheet" href="app/assets/css/fonts_css.css"/>
      <link rel="stylesheet" href="app/dist/angular-tree-widget.css"/>
      <link rel="stylesheet" href="app/assets/css/bootstrap.min.css"/>
      <link rel="stylesheet" href="app/assets/css/customStyle.css?ver=1.2"/>
      <link rel="stylesheet" href="app/assets/css/my-style.css?ver=1.2"/>
      <link rel="stylesheet" href="app/styles/libs/loading-bar.min.css"/>
      <link rel="stylesheet" href="app/dist/ng-slim-scroll.css"/>
      <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Ubuntu" />
      
     
  </head>
  <body>
    <div class="wrapper mainSite activeSideNav" ng-app="ApsilonApp">
      <div ui-view></div>
    </div>
      
       <!-- javascript Links -->
     <script src="https://use.fontawesome.com/0d0d403808.js"></script>
     <script type="text/javascript" src="app/dist/jquery-latest.min.js"></script>
      <script type="text/javascript" src="app/dist/agGrid.js"></script>
      <script type="text/javascript" src="app/lib/angular.min.js"></script>
      <script type="text/javascript" src="app/js/libs/angular-ui-router.min.js"></script>
      <script type="text/javascript" src="app/lib/angular-aria.min.js"></script>
      <script type="text/javascript" src="app/lib/angular-material.js"></script>
       <script type="text/javascript" src="app/lib/angular-animate.min.js"></script>
      <script type="text/javascript" src="app/scripts/app.js?var=<?php echo $s=(RAND() * (10 - 1) + 1)?>"></script>
      <script type="text/javascript" src="app/dist/re-tree.js"></script>
      <script type="text/javascript" src="app/dist/ng-device-detector.js"></script>
      <script type="text/javascript" src="app/js/libs/ocLazyLoad.min.js"></script>
      <script type="text/javascript" src="app/dist/angular-tree-widget.js"></script>
      <script type="text/javascript" src="app/js/libs/bootstrap.min.js"></script>
      <script type="text/javascript" src="app/js/libs/loading-bar.min.js"></script>
      <script type="text/javascript" src="app/assets/js/ui-bootstrap-tpls-0.10.0.min.js"></script>
      <script type="text/javascript" src="app/scripts/controllers/Form.js?var=<?php echo $s=(RAND() * (10 - 1) + 1)?>"></script>
      <script type="text/javascript" src="app/scripts/services/sessionService.js"></script>
      <script type="text/javascript" src="app/scripts/services/loginService.js"></script> 
  </body>
</html>