  var controllers = {};
  controllers.addMatchController = function($scope, $location, $routeParams, matchService) {
  $scope.possible_overs = [];
  $scope.possible_players = [];
  for(var i=3;i<=11;i++) {
    $scope.possible_players.push(i);
  }
  for(var i=5;i<=20;i++) {
    $scope.possible_overs.push(i);
  }
  var param1 = $routeParams.matchId;
  init();
  function init(){
    $scope.players = matchService.getPlayers();
    // matchService.getPlayers().then(function(response){console.log(response)},function(err){console.log(err)});
    $scope.matchDetails = matchService.getMatchDetails();
  }

  $scope.insertMatch = function(){
    var teamOneName = $scope.newMatch.teamOneName;
    var teamTwoName = $scope.newMatch.teamTwoName;
    var toss = $scope.newMatch.toss;
    var batting = $scope.newMatch.batting;
    var total_players = parseInt($scope.newMatch.totalPlayers);
    var total_overs = parseInt($scope.newMatch.totalOvers);

    $scope.batting_team = batting;
    if(teamOneName == batting) {
      $scope.bowling_team = teamTwoName;
    }else {
      $scope.bowling_team = teamOneName;
    }
    matchService.insertMatch(teamOneName, teamTwoName, toss, batting, total_players, total_overs);
    $scope.newMatch.teamOneName = 'teamOne';
    $scope.newMatch.teamTwoName = 'teamTwo';
    $scope.newMatch.toss = '';
    $scope.newMatch.batting = '';
    var matchId = $scope.matchDetails[0].matchId;
    $location.path('/'+matchId+'/addPlayers');
  }

  $scope.startMatch = function(){
    var matchId = $scope.matchDetails[0].matchId;
    $location.path('/'+matchId+'/selectBatsman');
  }

  $scope.deletePlayer = function(id){
    matchService.deletePlayer(id);
  }
};

controllers.scorecardController = function($scope, $routeParams, $location, scoreService) {
init();

//$scope.current_run = 0;
var param1 = $routeParams.matchId;

function init(){
  $scope.score = scoreService.getScore();
  $scope.current_ball_number = scoreService.getCurrentBallNumber();
  $scope.players = scoreService.getPlayers();
  $scope.matchDetails = scoreService.getMatchDetails();
  $scope.current_indi_batsman_stats = scoreService.getCurrentIndiBatsmen();
  $scope.current_indi_bowler_stats = scoreService.getCurrentIndiBowlers();
  $scope.lastEvents = scoreService.getLastTenBallEvents();
  $scope.total_runs = scoreService.getTotalRuns();
  $scope.wickets = scoreService.getWickets();
  $scope.current_over = scoreService.getCurrentOver();
  $scope.next_ball = scoreService.getNextBall();
  $scope.extra_run = 0;
  $scope.extra_type = '';
  $scope.extra_type_id = '';
  $scope.runOutChoice = '';
  $scope.possible_runs = [0,1,2,3,4,5,6];
  $scope.batsmanRadio = false;
  $scope.out = false;
  $scope.whoIsOut = '';
  $scope.lastSixBalls = $scope.lastEvents;
}

$scope.selectedPlayer = function(player_id){
  $scope.currentPlayer = player_id;
}

$scope.selectedBatsman = function(player_id){
  $scope.newBatsman = player_id;
}

$scope.selectedStriker = function(player_id){
  $scope.newStriker = player_id;
}

$scope.selectedBowler = function(player_id){
  $scope.newBowler = player_id;
}

$scope.selectStriker = function(){
  for(var batsman_index in $scope.players[0]) {
    if($scope.newBatsman == $scope.players[0][batsman_index].playerId) {
      batsman_name = $scope.players[0][batsman_index].playerName;
    }
  }
  var batsman_class = 'current-batsman-name';
  scoreService.insertBatsman($scope.newBatsman, batsman_name, batsman_class);
  var matchId = $scope.matchDetails[0].matchId;
  // if($scope.out) {
  //     $location.path('/'+matchId+'/scorecard');
  // }

}

$scope.changeBatsman = function(){
  for(var batsman_index in $scope.players[0]) {
    if($scope.currentPlayer == $scope.players[0][batsman_index].playerId) {
      batsman_name = $scope.players[0][batsman_index].playerName;
    }
  }
  var batsman_class = 'current-batsman-name';
  scoreService.insertBatsman($scope.currentPlayer, batsman_name, batsman_class);
  var matchId = $scope.matchDetails[0].matchId;
  $location.path('/'+matchId+'/scorecard');
}

$scope.selectBowler = function(){
  for(var batsman_index in $scope.players[0]) {
    if($scope.newStriker == $scope.players[0][batsman_index].playerId) {
      batsman_name = $scope.players[0][batsman_index].playerName;
    }
  }
  var batsman_class = 'non-striker-name';
  scoreService.insertBatsman($scope.newStriker, batsman_name, batsman_class);
  var matchId = $scope.matchDetails[0].matchId;
}

$scope.startInnings = function(){
  $scope.selectStriker();
  $scope.selectBowler();
  for(var bowler_index in $scope.players[1]) {
    if($scope.newBowler == $scope.players[1][bowler_index].playerId) {
      bowler_name = $scope.players[1][bowler_index].playerName;
    }
  }
  var bowler_class = 'current-bowler-name';
  scoreService.insertBowler($scope.newBowler, bowler_name, bowler_class);
  var matchId = $scope.matchDetails[0].matchId;
  $location.path('/'+matchId+'/scorecard');
}

$scope.insertScore = function(){
  var current_event = '';
  current_event = $scope.current_run;
  $scope.current_indi_batsman_stats[0].runs += $scope.current_run;
  $scope.current_indi_bowler_stats[0].runs += $scope.current_run;
  $scope.current_ball_number++;

  if($scope.extra_run == 1) {
    if($scope.extra_type_id != 'no-extra') {
        current_event += $scope.extra_type[0];
        $scope.current_indi_bowler_stats[0].runs += $scope.extra_run;
        $scope.current_ball_number--;
        $scope.current_indi_bowler_stats[0].balls--;
    }
  }

  if($scope.out) {
    current_event += 'wk';
  }

  $scope.lastEvents.unshift(current_event);
  $scope.lastSixBalls = $scope.lastEvents;
  if($scope.lastEvents.length > 6) {
      $scope.lastSixBalls.pop();
  }

  $scope.current_indi_batsman_stats[0].balls++;
  $scope.current_indi_bowler_stats[0].balls++;

  var strike_rate = $scope.current_indi_batsman_stats[0].runs/$scope.current_indi_batsman_stats[0].balls;
  strike_rate = strike_rate.toFixed(2);
  $scope.current_indi_batsman_stats[0].strike_rate = strike_rate*100;

  if($scope.current_indi_bowler_stats[0].balls === 0) {
      $scope.current_indi_bowler_stats[0].economy_rate = '-';
  }else {
    $scope.current_indi_bowler_stats[0].economy_rate = (($scope.current_indi_bowler_stats[0].runs/$scope.current_indi_bowler_stats[0].balls)*6).toFixed(2);
  }

  var current_run_local = $scope.current_run;

  var current_ball_local = $scope.current_ball_number;

  if(current_run_local == 4) {
    $scope.current_indi_batsman_stats[0].fours++;
  }

  if(current_run_local == 6) {
    $scope.current_indi_batsman_stats[0].sixes++;
  }

  var current_bowler_balls = $scope.current_indi_bowler_stats[0].balls;
  $scope.current_indi_bowler_stats[0].overs = Math.floor(current_bowler_balls/6) + "." + current_bowler_balls%6;

  if(current_run_local%2 == 1) {
    $scope.changeStrike();
  }

  if(current_ball_local % 6 == 0 && current_ball_local > 0) {
    if($scope.current_indi_bowler_stats.length == 2) {
      $scope.changeBowler();
      $scope.changeStrike();
    }else{
      var matchId = $scope.matchDetails[0].matchId;
      $location.path('/'+matchId+'/changeBowler');
    }
  }
  $scope.total_runs += current_run_local + $scope.extra_run;
  if($scope.out){
    if($scope.extra_type_id == 'wicket') {
      $scope.current_indi_bowler_stats[0].wks++;
    }
    $scope.wickets++;
    $scope.current_indi_batsman_stats[0].out = $scope.out;
  }
  $scope.current_over = Math.floor($scope.current_ball_number/6) + "." + $scope.current_ball_number%6;
  if($scope.current_indi_bowler_stats.length == 2){
    var score_details = [
      {
        current_ball_number : $scope.current_ball_number,
        runs : current_run_local,
        total_runs : $scope.total_runs,
        last_ten_bals: $scope.lastEvents,
        batsman : $scope.current_indi_batsman_stats[0].name,
        batsman_runs: $scope.current_indi_batsman_stats[0].runs,
        non_striker : $scope.current_indi_batsman_stats[1].name,
        non_striker_runs : $scope.current_indi_batsman_stats[1].runs,
        bowler : $scope.current_indi_bowler_stats[0].name,
        previous_bowler : $scope.current_indi_bowler_stats[1].name,
        extra: $scope.extra_type,
        out:$scope.out,
        wickets:$scope.wickets,
        current_over:$scope.current_over,
      }
    ];
  }else{
    var score_details = [
      {
        current_ball_number : $scope.current_ball_number,
        runs : current_run_local,
        total_runs : $scope.total_runs,
        last_ten_bals: $scope.lastEvents,
        batsman : $scope.current_indi_batsman_stats[0].name,
        batsman_runs: $scope.current_indi_batsman_stats[0].runs,
        non_striker : $scope.current_indi_batsman_stats[1].name,
        non_striker_runs : $scope.current_indi_batsman_stats[1].runs,
        bowler : $scope.current_indi_bowler_stats[0].name,
        previous_bowler : '-',
        extra: $scope.extra_type,
        out:$scope.out,
        wickets:$scope.wickets,
        current_over:$scope.current_over,
      }
    ];
  }
  scoreService.insertScore(score_details);
  scoreService.updateCurrentBatsmen($scope.current_indi_batsman_stats[0]);
  scoreService.updateCurrentBowler($scope.current_indi_bowler_stats[0]);
  scoreService.updateLastTenBalls($scope.lastEvents);
  if($scope.out) {
    console.log($scope.current_indi_batsman_stats);
    scoreService.updatePlayers($scope.whoIsOut);
  }
  $scope.current_indi_batsman_stats = scoreService.getCurrentIndiBatsmen();
  $scope.current_indi_bowler_stats = scoreService.getCurrentIndiBowlers();
  $scope.total_runs = scoreService.getTotalRuns();
  $scope.wickets = scoreService.getWickets();
  $scope.current_ball_number = scoreService.getCurrentBallNumber();
  $scope.current_over = scoreService.getCurrentOver();
  $scope.next_ball = scoreService.getNextBall();
  $('input').prop('checked',false).prop('disabled',true);
  $scope.extra_type = '';
  $scope.out = false;
  $scope.extra_run = 0;
  $('.who-is-runout').css('display','inline-block');

};

$scope.bowlerChange = function(){
  for(var bowler_index in $scope.players[1]) {
    if($scope.currentPlayer == $scope.players[1][bowler_index].playerId) {
      bowler_name = $scope.players[1][bowler_index].playerName;
    }
  }
  var bowler_class = 'current-bowler-name';
  scoreService.insertBowler($scope.currentPlayer, bowler_name, bowler_class);
  var matchId = $scope.matchDetails[0].matchId;
  $scope.changeBowler();
  // $scope.changeStrike();
  console.log('bowlerChange');
  $location.path('/'+matchId+'/scorecard');
}

$scope.changeBowler = function(){
  $scope.current_indi_bowler_stats[1].class = 'current-bowler-name';
  $scope.current_indi_bowler_stats[0].class = 'previous-bowler-name';
  $scope.current_indi_bowler_stats = $scope.current_indi_bowler_stats.reverse();
  $scope.current_indi_batsman_stats = $scope.current_indi_batsman_stats.reverse();
  console.log('changeBowler');
}

$scope.changeStrike = function(){
  $scope.current_indi_batsman_stats[1].class = 'current-batsman-name';
  $scope.current_indi_batsman_stats[0].class = 'non-striker-name';
  $scope.current_indi_batsman_stats = $scope.current_indi_batsman_stats.reverse();
  console.log('changeStrike');
}

$scope.currentRun = function(element){
  var current_run = event.target.value;
  $scope.current_run = parseInt(current_run);
  $('input').prop('disabled',false);
}

$scope.addExtra = function(element){
    if($scope.current_ball_number > 0){
        $scope.current_ball_number--;
    }
    $scope.extra_run = 1;
    $scope.extra_type = event.target.value;
    $scope.extra_type_id = event.target.id;
}

$scope.addWicket = function(element){
  $scope.out = true;
  $scope.extra_type_id = event.target.id;
  $scope.whichBatsman($scope.current_indi_batsman_stats[0].playerId);
  switch(event.target.id){
    case 'wicket':
      $scope.current_indi_bowler_stats[0].wkt++;
      $scope.out = true;
      break;
    case 'run-out':
      $('.who-is-runout').css('display','inline-block');
      $scope.out = true;
      break;
    case 'not-out':
      if($scope.out) {
          $scope.current_indi_bowler_stats[0].wkt--;
          $scope.out = false;
      }
      break;
    case 'retired':
      $('.who-is-runout').css('display','inline-block');
      if($scope.out) {
          $scope.current_indi_bowler_stats[0].wkt--;
      }
      $scope.out = true;
    break;
  }
}

$scope.whichBatsman = function(out_batsman){
  $scope.whoIsOut = out_batsman;
}

$scope.deleteScore = function(id){

}


};

controllers.loginController = function($scope) {
init();
function init(){

}

};

controllers.navbarController = function($scope,$location) {
  $scope.getClass = function(path) {
    if($location.path().substr(0,path.length) == path) {
      return true;
    } else {
      return false;
    }
  }
};

app.controller(controllers);
