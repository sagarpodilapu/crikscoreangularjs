  var controllers = {};
  controllers.addMatchController = function($scope, $location, $routeParams, matchService) {
  $scope.possible_overs = [];
  $scope.possible_players = [];
  for(var i=5;i<=11;i++) {
    $scope.possible_players.push(i);
  }
  $scope.possible_overs = [6,7,8,10,12,14,15,16,18,20];

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

var param1 = $routeParams.matchId;

function init(){
  $scope.current_ball_number = scoreService.getCurrentBallNumber();
  $scope.players = scoreService.getPlayers();
  $scope.matchDetails = scoreService.getMatchDetails();
  $scope.current_indi_batsman_stats = scoreService.getCurrentIndiBatsmen();
  $scope.current_indi_bowler_stats = scoreService.getCurrentIndiBowlers();
  $scope.lastSixBalls = scoreService.getLastTenBallEvents();
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
  $scope.currentInnings = scoreService.getCurrentInnings();
  $scope.runsLeft = $scope.matchDetails[0].firstInningsRuns - $scope.total_runs + 1;
  $scope.ballsLeft = $scope.matchDetails[0].totalOvers*6 - $scope.current_ball_number;
}

$scope.endInnings = function(){
  scoreService.endInnings($scope.total_runs, $scope.wickets, $scope.current_over, $scope.current_ball_number);
  var matchId = $scope.matchDetails[0].matchId;
  // $('body').html('').attr('class', 'loader');
  $('input').prop('disabled',true);
  $location.path('/'+matchId+'/inningsBreak');
}


$scope.reload = function()
{
   location.reload();

   $location.path('/addMatch');
}

$scope.endMatch = function(){
  scoreService.endMatch($scope.total_runs, $scope.wickets, $scope.current_over, $scope.current_ball_number);
  var matchId = $scope.matchDetails[0].matchId;

  $location.path('/'+matchId+'/matchEnded');
}

$scope.selectedPlayer = function(player_id){
  $scope.currentPlayer = player_id;
}

$scope.insertScore = function(){

  var score_details = [];
  var matchId = $scope.matchDetails[0].matchId;
  var current_event = '';
  current_event = $scope.current_run;
  $scope.current_indi_batsman_stats[0].battingRuns += $scope.current_run;
  $scope.current_indi_bowler_stats[0].bowlingRuns += $scope.current_run;
  $scope.current_ball_number++;
  if($scope.extra_run == 1) {
    if($scope.extra_type_id != 'no-extra') {
        current_event += $scope.extra_type[0];
        $scope.current_indi_bowler_stats[0].bowlingRuns += $scope.extra_run;
        $scope.current_ball_number--;
        $scope.current_indi_bowler_stats[0].battingBalls--;
        $scope.current_indi_batsman_stats[0].bowlingBalls--;
    }
  }
  if($scope.out) {
    current_event += 'wk';
  }
  $scope.lastSixBalls.unshift(current_event);
  if($scope.lastSixBalls.length > 6) {
      $scope.lastSixBalls.pop();
  }
  var current_run_local = $scope.current_run;
  var current_ball_local = $scope.current_ball_number;
  $scope.current_indi_batsman_stats[0].battingBalls++;
  $scope.current_indi_bowler_stats[0].bowlingBalls++;
  var strike_rate = $scope.current_indi_batsman_stats[0].battingRuns/$scope.current_indi_batsman_stats[0].battingBalls;
  strike_rate = strike_rate.toFixed(2);
  $scope.current_indi_batsman_stats[0].battingStrikeRate = strike_rate*100;
  if($scope.current_indi_bowler_stats[0].bowlingBalls === 0) {
      $scope.current_indi_bowler_stats[0].bowlingEconomyRate = '-';
  }else {
    $scope.current_indi_bowler_stats[0].bowlingEconomyRate = (($scope.current_indi_bowler_stats[0].bowlingRuns/$scope.current_indi_bowler_stats[0].bowlingBalls)*6).toFixed(2);
  }
  if(current_run_local == 4) {
    $scope.current_indi_batsman_stats[0].battingFours++;
  }
  if(current_run_local == 6) {
    $scope.current_indi_batsman_stats[0].battingSixes++;
  }
  var current_bowler_balls = $scope.current_indi_bowler_stats[0].bowlingBalls;
  $scope.current_indi_bowler_stats[0].bowlingOvers = Math.floor(current_bowler_balls/6) + "." + current_bowler_balls%6;
  $scope.total_runs += current_run_local + $scope.extra_run;
  if($scope.out){
    if($scope.extra_type_id == 'wicket') {
      $scope.current_indi_bowler_stats[0].bowlingWkts++;
    }
    $scope.wickets++;
    $scope.current_indi_batsman_stats[0].out = $scope.out;
  }
  $scope.current_over = Math.floor(current_ball_local/6) + "." + current_ball_local%6;
  if($scope.currentInnings == 'Second Innings') {
    $scope.runsLeft = $scope.matchDetails[0].firstInningsRuns - $scope.total_runs + 1;
    $scope.ballsLeft = $scope.matchDetails[0].totalOvers*6 - current_ball_local;
  }else {
    $scope.runsLeft = 1000;
    $scope.ballsLeft = 1000;
  }
  score_details = {
      current_ball_number : current_ball_local,
      runs : current_run_local,
      total_runs : $scope.total_runs,
      batsman : $scope.current_indi_batsman_stats[0].playerName,
      batsman_id: $scope.current_indi_batsman_stats[0].playerId,
      batsman_runs: $scope.current_indi_batsman_stats[0].battingRuns,
      non_striker : $scope.current_indi_batsman_stats[1].playerName,
      non_striker_id: $scope.current_indi_batsman_stats[1].playerId,
      non_striker_runs : $scope.current_indi_batsman_stats[1].battingRuns,
      bowler : $scope.current_indi_bowler_stats[0].playerName,
      bowler_id: $scope.current_indi_bowler_stats[0].playerId,
      extra: $scope.extra_type,
      out:$scope.out,
      wickets:$scope.wickets,
      current_over:$scope.current_over,
      current_ball_event:current_event,
    };

  scoreService.insertScore(score_details, $scope.current_indi_batsman_stats[0], $scope.current_indi_bowler_stats[0], current_event, $scope.whoIsOut);
  if($scope.wickets == ($scope.matchDetails[0].totalPlayer-1)) {
    if($scope.currentInnings == 'Second Innings') {
      $scope.endMatch();
    }else {
      $scope.endInnings();
    }
  }else if($scope.runsLeft <= 0) {
    $scope.endMatch();
  }else if(current_ball_local == $scope.matchDetails[0].totalOvers*6){
    if($scope.currentInnings == 'Second Innings') {
      $scope.endMatch();
    }else {
      $scope.endInnings();
    }
  }else {
    if($scope.out == true) {

      $location.path('/'+matchId+'/changeBatsman');
    }

    if(current_run_local%2 == 1) {
      $scope.changeStrike();
    }
    if(current_ball_local % 6 == 0 && current_ball_local > 0 && $scope.extra_run != 1) {
      if(!$scope.out) {

        $location.path('/'+matchId+'/changeBowler');
      }
      $scope.changeStrike();
    }
    $('.possible-runs button').attr('class','btn btn-default btn-sm');
    $('.change-strike').attr('class','btn btn-info btn-sm change-strike');
    $('.new-batsman').attr('class','btn btn-success btn-sm new-batsman');
    $('.new-bowler').attr('class','btn btn-warning btn-sm new-bowler');
    $('.end-innings').attr('class','btn btn-danger btn-sm end-innings');
    $('.submit-score').prop('disabled',true);
    $('.not-out').css('display','none');
    $('.no-extra').css('display','none');
    $('.disable-toggle').prop('checked',false).prop('disabled',true);
    $('.who-is-runout').css('display','none');
    $('.wicket').css('display','inline-block');
    $scope.extra_type = '';
    $scope.extra_run = 0;
    // $scope.players = scoreService.getPlayers();
    // $scope.current_indi_batsman_stats = scoreService.getCurrentIndiBatsmen();
    // $scope.current_indi_bowler_stats = scoreService.getCurrentIndiBowlers();
    // $scope.total_runs = scoreService.getTotalRuns();
    // $scope.wickets = scoreService.getWickets();
    // $scope.current_ball_number = scoreService.getCurrentBallNumber();
    // $scope.current_over = scoreService.getCurrentOver();
    // $scope.next_ball = scoreService.getNextBall();
    $scope.out = false;
  }
  //

};

$scope.changeBatsman = function(){
  var matchId = $scope.matchDetails[0].matchId;
  current_ball_local = scoreService.getCurrentBallNumber();
  var batsman_class = 'current-batsman-name';
  for(var batsman_index in $scope.players[0]) {
    if($scope.currentPlayer == $scope.players[0][batsman_index].playerId) {
      batsman_name = $scope.players[0][batsman_index].playerName;
    }
  }
  scoreService.insertBatsman($scope.currentPlayer, batsman_name, batsman_class);
  if($scope.current_indi_batsman_stats.length < 2) {

    $location.path('/'+matchId+'/changeBatsman');
  }else if($scope.current_indi_bowler_stats.length < 1) {

    $location.path('/'+matchId+'/changeBowler');
  }else if(current_ball_local % 6 == 0 && current_ball_local > 0) {

    $location.path('/'+matchId+'/changeBowler');
    $scope.changeStrike();
  }else {

    $location.path('/'+matchId+'/first/scorecard');
  }
}

$scope.bowlerChange = function(){
  for(var bowler_index in $scope.players[1]) {
    if($scope.currentPlayer == $scope.players[1][bowler_index].playerId) {
      bowler_name = $scope.players[1][bowler_index].playerName;
    }
  }
  var bowler_class = 'current-bowler-name';
  scoreService.insertBowler($scope.currentPlayer, bowler_name, bowler_class);
  var matchId = $scope.matchDetails[0].matchId;

  $location.path('/'+matchId+'/first/scorecard');
}

$scope.changeStrike = function(){
  if($scope.current_indi_batsman_stats.length > 1) {
    $scope.current_indi_batsman_stats[1].class = 'current-batsman-name';
    $scope.current_indi_batsman_stats[0].class = 'non-striker-name';
    $scope.current_indi_batsman_stats = $scope.current_indi_batsman_stats.reverse();
  }
}

$scope.currentRun = function(element){
  $('.possible-runs button').attr('class','btn btn-default btn-sm');
  var change_strike_link = $('.change-strike').attr('class');
  $('.change-strike').attr('class',change_strike_link+' disabled');
  var new_batsman_link = $('.new-batsman').attr('class');
  $('.new-batsman').attr('class',new_batsman_link+' disabled');
  var new_bolwer_link = $('.new-bowler').attr('class');
  $('.new-bowler').attr('class',new_bolwer_link+' disabled');
  var end_innings_link = $('.end-innings').attr('class');
  $('.end-innings').attr('class',end_innings_link+' disabled');
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
  $('.disable-toggle').prop('disabled',false);
}

$scope.addExtra = function(element){
    $('.no-extra').css('display','inline-block');
    $scope.extra_run = 1;
    $scope.extra_type = event.target.value;
    $scope.extra_type_id = event.target.id;
    if($scope.extra_type == 'noball') {
      $('.wicket').css('display','none');
    }
    if($scope.extra_type == 'noextra') {
      $scope.extra_run = 0;
    }
}

$scope.addWicket = function(element){
  $('.not-out').css('display','inline-block');
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
