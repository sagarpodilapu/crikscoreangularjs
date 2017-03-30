/*
/app
  /controllers
  /directives
  /services
  /partials
  /views
*/
var app = angular.module("crikscoreApp",['ngRoute']);
app.config(function ($routeProvider){
  $routeProvider
  .when('/addMatch',{
    controller:'addMatchController',
    templateUrl:'/app/partials/addPlayer.html'
  })
  .when('/scorecard',{
    controller:'scorecardController',
    templateUrl:'/app/partials/scorecard.html'
  })
  .when('/login',{
    controller:'loginController',
    templateUrl:'/app/partials/login.html'
  })
  .otherwise({ redirectTo: '/addMatch'});
});
