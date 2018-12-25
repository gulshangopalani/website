<div class="row ng-scope" style="height: 700px">
<div class="col-sm-6 col-sm-offset-3 login">
<div class="login-cont">
  <div class="login-logo" ng-init="user={username1:'',password1:''}">
    <img src="app/images/Home_logo.png" style="width:100%!important;">
  </div>                                                                                            
  <!-- FORM -->
  <form name="userForm" method="post">
    <div class="login-form">
      <span class="login-error" >{{message}}</span>
      <div class="inp-box">
        <input type="text" name="username" id="username" class="form-control" ng-model="user.username1" required="required" placeholder="Username" autofocus/>
      </div>
      <div class="inp-box">
        <input type="password" name="password" class="form-control" ng-model="user.password1" placeholder="Password" required="required"/>
      </div>

      <div class="betOverlay" ng-if="loadingM">
            <img src="app/images/loader.gif">
        </div>
        
      <div class="text-center">
        <button type="submit" class="btn btn-primary" ng-click="submitForm(user)">
          <span class=" glyphicon glyphicon-log-in"></span>&emsp;Login</button>
      </div>
    </div>
  </form>
</div>
</div>
</div>
