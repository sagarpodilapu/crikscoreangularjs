  var controllers = {};
  controllers.addMatchController = function($scope,matchService) {
  init();
  function init(){
    $scope.players = matchService.getPlayers();
    $scope.matchId = matchService.getMatchId();
    $scope.teams = matchService.getTeams();
  }
  $scope.teamId = 1;
  $scope.bowlingStyles = [
    {
      id: 'RF',
      display:'Right Arm Fast',
    },
    {
      id: 'RMF',
      display:'Right Arm Medium',

    },
    {
      id: 'LF',
      display:'Left Arm Fast',
    },
    {
      id: 'LMF',
      display:'Left Arm Medium',
    },
    {
      id: 'OS',
      display:'Offspin',
    },
    {
      id: 'LS',
      display:'Legspin',
    },
    {
      id: 'LOS',
      display:'Left Arm Spin',
    },
  ];
  $scope.insertPlayer = function(){
    var playerName = $scope.newPlayer.name;
    var playerBattingStyle = $scope.newPlayer.battingStyle;
    var playerBowlingStyle = $scope.newPlayer.bowlingStyle;
    var playerTeamId = $scope.newPlayer.teamId;
    // var teamMatchId = $scope.newPlayer.matchId;
    matchService.insertPlayer(playerName,playerBattingStyle,playerBowlingStyle,playerTeamId,$scope.matchId);
    $scope.newPlayer.name = '';
    $scope.newPlayer.battingStyle = '';
    $scope.newPlayer.bowlingStyle = '';
    $scope.newPlayer.teamId = '';
    $scope.newPlayer.matchId = '';
  };

  $scope.deletePlayer = function(id){
    matchService.deletePlayer(id);
  }
};

controllers.scorecardController = function($scope,scoreService) {
init();

//$scope.current_run = 0;
$scope.runOutChoice = '';
$scope.extra_run = 0;
$scope.total_runs = 0;
$scope.possible_runs = [0,1,2,3,4,5,6];
$scope.current_ball_number = 0;
$scope.last_ten_balls_events = [];
$scope.wickets = 0;
$scope.current_over = '0.0';
$scope.current_indi_batsman_stats = [
  {
    class: 'current-batsman-name',
    name: 'Sagar',
    runs:0,
    balls:0,
    fours:0,
    sixes:0,
    out:false,
    strike_rate: 0,
  },
  {
    class: 'non-striker-name',
    name: 'Ashish',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    out: false,
    strike_rate: 0,
  },
  ];
  $scope.current_indi_bowler_stats = [
    {
      class: 'current-bowler-name',
      name: 'Nagaraj',
      balls: 0,
      overs: 0,
      runs: 0,
      wks: 0,
      wides: 0,
      noballs: 0,
      economy_rate: 0,
      strike_rate: 0,
    },
    {
      class: 'previous-bowler-name',
      name: 'Kaali',
      balls:0,
      overs:0,
      runs:0,
      wks:0,
      wides: 0,
      noballs:0,
      economy_rate: 0,
      strike_rate: 0,
    }];
    $scope.batsmanRadio = false;

function init(){
  $scope.score = scoreService.getScore();
  $scope.current_score = scoreService.getCurrentScore();
  $scope.current_ball = scoreService.getCurrentBall();
}

$scope.insertScore = function(){
  var current_run_local = $scope.current_run;

  $scope.current_ball_number++;

  var current_ball_local = $scope.current_ball_number;
  var next_ball = current_ball_local + 1;
  $scope.current_over = Math.floor($scope.current_ball_number/6) + "." + $scope.current_ball_number%6;
  $scope.next_ball = Math.floor(next_ball/6) + "." + next_ball%6;

  if(current_run_local == 4) {
    $scope.current_indi_batsman_stats[0].fours++;
  }

  if(current_run_local == 6) {
    $scope.current_indi_batsman_stats[0].sixes++;
  }

  var extra_type_checked = $('#'+$scope.extra_type_id).prop('checked');

  if(!extra_type_checked){
    $scope.extra_type = '';
    $scope.out = false;
    $scope.extra_run = 0;
  }
  $scope.current_ball_event();
  var current_bowler_balls = $scope.current_indi_bowler_stats[0].balls;
  $scope.current_indi_bowler_stats[0].overs = Math.floor(current_bowler_balls/6) + "." + current_bowler_balls%6;

  if(current_run_local%2 == 1) {
    $scope.changeStrike();
  }

  if(current_ball_local % 6 == 0) {
    $scope.changeStrike();
    $scope.changeBowler();
  }
  $scope.total_runs += current_run_local + $scope.extra_run;

  var score_details = [
    {
      current_ball_number : $scope.current_ball_number,
      runs : current_run_local,
      total_runs : $scope.total_runs,
      last_ten_bals: $scope.last_ten_balls_events,
      batsman : $scope.current_indi_batsman_stats[0].name,
      batsman_runs: $scope.batsman_runs,
      non_striker : $scope.current_indi_batsman_stats[1].name,
      non_striker_runs : $scope.non_striker_runs,
      bowler : $scope.current_indi_bowler_stats[0].name,
      previous_bowler : $scope.current_indi_bowler_stats[1].name,
      extra: $scope.extra_type,
      out:$scope.out,
      wickets:$scope.wickets,
      current_over:$scope.current_over,
    }
  ];
  $('input').prop('checked',false).prop('disabled',true);
  $scope.extra_type = '';
  $scope.out = false;
  $scope.extra_run = 0;
  // var wide = $scope.currentBall.wide;
  // var noball = $scope.currentBall.noball;
  // var out = $scope.currentBall.out;
  // var out_type = $scope.currentBall.out_type;
  // var fielder = $scope.currentBall.fielder;
  // var batsman = $scope.currentBall.batsman;
  // var bowler = $scope.currentBall.bowler;
};

$scope.changeStrike = function(){
  $scope.current_indi_batsman_stats[1].class = 'current-batsman-name';
  $scope.current_indi_batsman_stats[0].class = 'non-striker-name';
  $scope.current_indi_batsman_stats = $scope.current_indi_batsman_stats.reverse();
}

$scope.changeBowler = function(){
  $scope.current_indi_bowler_stats[1].class = 'current-bowler-name';
  $scope.current_indi_bowler_stats[0].class = 'previous-bowler-name';
  $scope.current_indi_bowler_stats = $scope.current_indi_bowler_stats.reverse();
  $scope.current_indi_batsman_stats = $scope.current_indi_batsman_stats.reverse();
}

$scope.findIndexByBatsmanName = function(batsman_name){
  for(var i in $scope.current_indi_batsman_stats){
    if($scope.current_indi_batsman_stats[i].name == batsman_name) {
      return i;
    }
  }
}

$scope.findIndexByBowlerName = function(bowler_name){
  for(var i in $scope.current_indi_bowler_stats){
    if($scope.current_indi_bowler_stats[i].name == bowler_name) {
      return i;
    }
  }
}

$scope.current_ball_event = function(){
  var current_batsman = $scope.current_indi_batsman_stats[0];
  var current_bowler = $scope.current_indi_bowler_stats[0];
  var ball_incremented = false;
  var legal_delivery = true;
  var legal_run = true;
  var extra_run = $scope.extra_run;
  var current_run_local = $scope.current_run;
  var extra_type = $scope.extra_type;
  var out = $scope.out;
  var last_ten_balls = '';
  var current_ball_number_local = $scope.current_ball_number;
  if(current_run_local >= 0) {
    last_ten_balls += current_run_local;
    current_bowler.runs += current_run_local ;
    current_batsman.runs += current_run_local;

    current_bowler.balls++;
    current_batsman.balls++;
    var ball_incremented = true;
  }
  if(extra_run) {
    last_ten_balls += extra_type[0];
    current_bowler.runs += extra_run ;
    current_bowler.balls--;
  }
  if(out) {
    last_ten_balls += 'wk';
    if(!ball_incremented) {
        current_bowler.balls++;
        current_batsman.balls++;
    }
  }
  $scope.last_ten_balls_events.unshift(last_ten_balls);
  if($scope.last_ten_balls_events.length > 6) {
    $scope.last_ten_balls_events.pop();
  }
  var something = current_batsman.runs/current_batsman.balls;
  current_batsman.strike_rate = (something.toFixed(2))*100;
  // current_bowler.strike_rate = (current_bowler.wks/current_bowler.balls).toFixed(2)*100;
  if(current_bowler.balls === 0) {
      current_bowler.economy_rate = '-';
  }else {
    current_bowler.economy_rate = ((current_bowler.runs/current_bowler.balls)*6).toFixed(2);
  }

  if($scope.out){
    if($scope.extra_type_id == 'wicket') {
      current_bowler.wks++;
    }
    $scope.wickets++;
  }
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
  if(event.target.id == 'run-out'){
    $scope.batsmanRadio = true;
    var html = '';
    $scope.runOutChoice = html;
  }else{
    $scope.runOutChoice = '';
  }
  // console.log($scope.extra_type_id);
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
