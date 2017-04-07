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
    templateUrl:'/app/partials/addMatch.html'
  })
  .when('/:matchId/:innings/scorecard',{
    controller:'scorecardController',
    templateUrl:'/app/partials/scorecard.html'
  })
  .when('/login',{
    controller:'loginController',
    templateUrl:'/app/partials/login.html'
  })
  .when('/:matchId/selectBatsman',{
    controller:'scorecardController',
    templateUrl:'/app/partials/newBatsman.html'
  })
  .when('/:matchId/addPlayers', {
    controller:'addMatchController',
    templateUrl:'/app/partials/addPlayers.html'
  })
  .when('/:matchId/changeBowler',{
    controller:'scorecardController',
    templateUrl:'/app/partials/changeBowler.html'
  })
  .when('/:matchId/changeBatsman',{
    controller:'scorecardController',
    templateUrl:'/app/partials/changeBatsman.html'
  })
  .when('/:matchId/fullScorecard',{
    controller:'scorecardController',
    templateUrl:'/app/partials/fullScorecard.html'
  })
  .when('/:matchId/inningsBreak',{
    controller:'scorecardController',
    templateUrl:'/app/partials/inningsBreak.html'
  })
  .when('/:matchId/matchEnded',{
    controller:'scorecardController',
    templateUrl:'/app/partials/matchEnded.html'
  })
  .otherwise({ redirectTo: '/addMatch'});
});
app.config(['AnalyticsProvider', function (AnalyticsProvider) {
   // Add configuration code as desired
   AnalyticsProvider.setAccount('UA-96467533-1');
   AnalyticsProvider.setDomainName('https://www.crikscore.com/');
}]).run(['Analytics', function(Analytics) { }]);
