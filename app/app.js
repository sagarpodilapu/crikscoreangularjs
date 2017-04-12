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
  .when('/',{
    controller:'addMatchController',
    templateUrl:'/app/partials/home.html'
  })
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
  .otherwise({ redirectTo: '/'});
});
app.config(['AnalyticsProvider', function (AnalyticsProvider) {
   // Add configuration code as desired
   AnalyticsProvider.setAccount('UA-96467533-1');
   AnalyticsProvider.setDomainName('https://www.crikscore.com/');
}]).run(['Analytics', function(Analytics) { }]);
// app.directive("spinner", function(){
//   return {
//   restrict: 'E',
//   scope: {enable:"="},
//   template: '<i class="fa fa-spinner" aria-hidden="true"></i>'
//   }
// });
app.filter('outPlayers', function() {
  return function( players) {
    var filtered = [];
    angular.forEach(players, function(players) {
      if(players.out) {
        filtered.push(players);
      }
    });
    return filtered;
  };
});
app.filter('notPlayed', function() {
  return function(players, striker, nonStriker) {
    var filtered = [];
    angular.forEach(players, function(players) {
      if(!players.out && players.playerId != striker && players.playerId != nonStriker) {
        filtered.push(players);
      }
    });
    return filtered;
  };
});
app.filter('notOutBatsmen', function() {
  return function(players) {
    var filtered = [];
    angular.forEach(players, function(player) {
      if(player.out == false && player.battingBalls > 0 ) {
        filtered.push(player);
      }
    });
    return filtered;
  };
});
app.filter('didNotBat', function() {
  return function(players) {
    var filtered = [];
    angular.forEach(players, function(players) {
      if(players.out == false && players.battingBalls == 0 ) {
        filtered.push(players);
      }
    });
    return filtered;
  };
});

// app.filter('outPlayers', function() {
//   return function( items, userAccessLevel) {
//     var filtered = [];
//     angular.forEach(items, function(item) {
//       if(userAccessLevel >= item.minAccess) {
//         filtered.push(item);
//       }
//     });
//     return filtered;
//   };
// });
