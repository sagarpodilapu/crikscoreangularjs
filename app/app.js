/*
/app
  /controllers
  /directives
  /services
  /partials
  /views
*/
var app = angular.module("crikscoreApp",['ngRoute','angular-google-analytics']);
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
app.config(['AnalyticsProvider', function (AnalyticsProvider) {
   // Add configuration code as desired
   AnalyticsProvider.setAccount('UA-96467533-1');
}]).run(['Analytics', function(Analytics) { }]);
