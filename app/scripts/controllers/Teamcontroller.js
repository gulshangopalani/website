app.controller("Teamcontroller",["$scope","$http",function(e,t){t.get("Createmastercontroller/lstTeamId").success(function(t,a,r,s){e.teamData=t,e.teamId="tm000"+t.id}).error(function(t,a,r,s){e.ResponseDetails="Data: "+t+"<br />status: "+a+"<br />headers: "+jsonFilter(r)+"<br />config: "+jsonFilter(s)}),e.submitForm=function(){var a={Team_name:e.Team_name};t({method:"POST",url:"Createmastercontroller/saveTeamData/",data:a,headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(a){0==a.errors?e.message=a.message:(e.message=a.message,t.get("Createmastercontroller/lstTeamId").success(function(t,a,r,s){e.teamData=t,e.teamId="tm000"+t.id}).error(function(t,a,r,s){e.ResponseDetails="Data: "+t+"<br />status: "+a+"<br />headers: "+jsonFilter(r)+"<br />config: "+jsonFilter(s)}))})}}]);