  var controllers = {};
  controllers.addMatchController = function($scope, $location, $routeParams, matchService) {
  $scope.possible_overs = [];
  $scope.possible_players = [];
  for(var i=5;i<=11;i++) {
    $scope.possible_players.push(i);
  }
  $scope.possible_overs = [6,7,8,10,12,14,15,16,18,20];
  // for(var i=6;i<=20;) {
  //   $scope.possible_overs.push(i);
  //   i = i+2;
  // }
  var param1 = $routeParams.matchId;
  init();
  function init(){
    $scope.players = matchService.getPlayers();
    $scope.matchDetails = matchService.getMatchDetails();
    $scope.teamNames = matchService.getTeams();
  }

  $scope.insertMatch = function(){
    var total_players = parseInt($scope.newMatch.totalPlayers);
    var total_overs = parseInt($scope.newMatch.totalOvers);

    matchService.insertMatch(total_players, total_overs);
    var matchId = $scope.matchDetails[0].matchId;
    $location.path('/'+matchId+'/first/scorecard');
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
  $scope.possible_runs = ['.',1,2,3,4,5,6];
  $scope.batsmanRadio = false;
  $scope.out = false;
  $scope.whoIsOut = '';
  $scope.lastSixBalls = $scope.lastEvents;
  $scope.currentInnings = scoreService.getCurrentInnings();
  $scope.runsLeft = $scope.matchDetails[0].firstInningsRuns - $scope.total_runs + 1;
  $scope.ballsLeft = $scope.matchDetails[0].totalOvers*6 - $scope.current_ball_number;
}

$scope.endInnings = function(){
  scoreService.endInnings($scope.total_runs, $scope.wickets, $scope.current_over, $scope.current_ball_number);
  var matchId = $scope.matchDetails[0].matchId;
  $location.path('/'+matchId+'/second/scorecard');
}

$scope.selectedPlayer = function(player_id){
  $scope.currentPlayer = player_id;
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
  $location.path('/'+matchId+'/first/scorecard');
}

$scope.insertScore = function(){
  var matchId = $scope.matchDetails[0].matchId;
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

  $scope.total_runs += current_run_local + $scope.extra_run;
  if($scope.out){
    if($scope.extra_type_id == 'wicket') {
      $scope.current_indi_bowler_stats[0].wks++;
    }
    $scope.wickets++;
    $scope.current_indi_batsman_stats[0].out = $scope.out;
  }
  $scope.current_over = Math.floor($scope.current_ball_number/6) + "." + $scope.current_ball_number%6;
  if(current_run_local%2 == 1) {
    $scope.changeStrike();
  }

  if(current_ball_local % 6 == 0 && current_ball_local > 0) {
    $location.path('/'+matchId+'/changeBowler');
    $scope.changeStrike();
  }
  $scope.runsLeft = $scope.matchDetails[0].firstInningsRuns - $scope.total_runs;
  $scope.ballsLeft = $scope.matchDetails[0].totalOvers*6 - $scope.current_ball_number;
  if($scope.current_indi_bowler_stats.length == 2){
    var score_details = [
      {
        current_ball_number : $scope.current_ball_number,
        runs : current_run_local,
        total_runs : $scope.total_runs,
        last_ten_bals: $scope.lastEvents,
        batsman : $scope.current_indi_batsman_stats[0].name,
        batsman_id: $scope.current_indi_batsman_stats[0].playerId,
        batsman_runs: $scope.current_indi_batsman_stats[0].runs,
        non_striker : $scope.current_indi_batsman_stats[1].name,
        non_striker_id: $scope.current_indi_batsman_stats[1].playerId,
        non_striker_runs : $scope.current_indi_batsman_stats[1].runs,
        bowler : $scope.current_indi_bowler_stats[0].name,
        bowler_id: $scope.current_indi_bowler_stats[0].playerId,
        previous_bowler : $scope.current_indi_bowler_stats[1].name,
        previous_bowler_id: $scope.current_indi_bowler_stats[1].playerId,
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
        batsman_id: $scope.current_indi_batsman_stats[0].playerId,
        batsman_runs: $scope.current_indi_batsman_stats[0].runs,
        non_striker : $scope.current_indi_batsman_stats[1].name,
        non_striker_id: $scope.current_indi_batsman_stats[1].playerId,
        non_striker_runs : $scope.current_indi_batsman_stats[1].runs,
        bowler : $scope.current_indi_bowler_stats[0].name,
        bowler_id: $scope.current_indi_bowler_stats[0].playerId,
        previous_bowler : '-',
        previous_bowler_id: '-',
        extra: $scope.extra_type,
        out:$scope.out,
        wickets:$scope.wickets,
        current_over:$scope.current_over,
      }
    ];
  }
  scoreService.insertScore(score_details, $scope.current_indi_batsman_stats[0], $scope.current_indi_bowler_stats[0], $scope.lastEvents, $scope.whoIsOut);
  $('.possible-runs button').attr('class','btn btn-default btn-sm');
  $('.change-strike').attr('class','btn btn-info btn-sm change-strike');
  $('.new-batsman').attr('class','btn btn-success btn-sm new-batsman');
  $('.new-bowler').attr('class','btn btn-warning btn-sm new-bowler');
  $('.submit-score').prop('disabled',true);
  $('input').prop('checked',false).prop('disabled',true);
  $scope.players = scoreService.getPlayers();
  if($scope.out == true) {
    $scope.out = false;
    $location.path('/'+matchId+'/changeBatsman');
  }
  $scope.extra_type = '';
  $scope.extra_run = 0;
  $('.who-is-runout').css('display','none');
  $scope.current_indi_batsman_stats = scoreService.getCurrentIndiBatsmen();
  $scope.current_indi_bowler_stats = scoreService.getCurrentIndiBowlers();
  $scope.total_runs = scoreService.getTotalRuns();
  $scope.wickets = scoreService.getWickets();
  $scope.current_ball_number = scoreService.getCurrentBallNumber();
  $scope.current_over = scoreService.getCurrentOver();
  $scope.next_ball = scoreService.getNextBall();
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
  // $scope.current_indi_bowler_stats = $scope.current_indi_bowler_stats.reverse();
  $location.path('/'+matchId+'/first/scorecard');
}

$scope.changeStrike = function(){
  $scope.current_indi_batsman_stats[1].class = 'current-batsman-name';
  $scope.current_indi_batsman_stats[0].class = 'non-striker-name';
  $scope.current_indi_batsman_stats = $scope.current_indi_batsman_stats.reverse();
}

$scope.currentRun = function(element){
  $('.possible-runs button').attr('class','btn btn-default btn-sm');
  var change_strike_link = $('.change-strike').attr('class');
  $('.change-strike').attr('class',change_strike_link+' disabled');
  var new_batsman_link = $('.new-batsman').attr('class');
  $('.new-batsman').attr('class',new_batsman_link+' disabled');
  var new_bolwer_link = $('.new-bowler').attr('class');
  $('.new-bowler').attr('class',new_bolwer_link+' disabled');
  $('.submit-score').prop('disabled',false);
  var current_run = event.target.value;
  $scope.current_run = parseInt(current_run);
  if(current_run == 0) {
    event.target.className='btn-danger';
  }else if (current_run == 4) {
    event.target.className='btn-warning';
  }else if (current_run == 6) {
    event.target.className='btn-info';
  }else {
    event.target.className='btn-primary';
  }
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
