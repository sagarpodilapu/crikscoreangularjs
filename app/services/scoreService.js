app.factory('scoreService',['matchService', function(matchService){
  var score = [];
  var last_ten_balls = [];
  var next_ball = 0;
  var total_runs = 0;
  var wickets = 0;
  var current_over = 0;
  var current_ball_number = 0;

  var factory = {};

  factory.insertScore = function(scoreDetails){
    score.push(scoreDetails);
    next_ball = scoreDetails[0].current_ball_number+1;
    total_runs = scoreDetails[0].total_runs;
    wickets = scoreDetails[0].wickets;
    current_ball_number = scoreDetails[0].current_ball_number;
    current_over = Math.floor(current_ball_number/6) + "." + current_ball_number%6;
    next_ball = Math.floor(next_ball/6) + "." + next_ball%6;
    current_indi_bowlers = this.getCurrentIndiBowlers();
    current_indi_batsmen = this.getCurrentIndiBatsmen();
    this.updatePlayers(scoreDetails[0].batsman_id, current_indi_batsmen[0], 0);
    this.updatePlayers(scoreDetails[0].bowler_id, current_indi_bowlers[0], 1);
  }

  factory.updatePlayers = function(player_id,current_player_array,team_index){
    for(var i in players[team_index]) {
      if(players[team_index][i].playerId == player_id) {
        if(team_index == 0) {
          players[team_index][i].out = current_player_array.out;
          players[team_index][i].battingRuns = current_player_array.runs;
          players[team_index][i].battingBalls = current_player_array.balls;
          players[team_index][i].battingFours = current_player_array.fours;
          players[team_index][i].battingSixes = current_player_array.sixes;
          players[team_index][i].battingStrikeRate = current_player_array.strike_rate;
        }else {
          players[team_index][i].bowlingBalls = current_player_array.balls;
          players[team_index][i].bowlingOvers = current_player_array.overs;
          players[team_index][i].bowlingRuns = current_player_array.runs;
          players[team_index][i].bowlingWkts = current_player_array.wks;
          players[team_index][i].bowlingWides = current_player_array.wides;
          players[team_index][i].bowlingNoBalls = current_player_array.noballs;
          players[team_index][i].bowlingEconomyRate = current_player_array.economy_rate;
          players[team_index][i].bowlingStrikeRate = current_player_array.strike_rate;
        }
        break;
      }
    }
    console.log(team_index);
    console.log(players[team_index][i]);
  }

  factory.getPlayers = function(){
    return matchService.getPlayers();
  }

  factory.getMatchDetails = function(){
    return matchService.getMatchDetails();
  }

  factory.getCurrentIndiBatsmen = function() {
    return matchService.getCurrentIndiBatsmen();
  }

  factory.getCurrentIndiBowlers = function() {
    return matchService.getCurrentIndiBowlers();
  }
  factory.setCurrentIndiBowlers = function(current_indi_bowlers) {
    matchService.setCurrentIndiBowlers(current_indi_bowlers);
  }
  factory.setCurrentIndiBatsmen = function(current_indi_batsmen) {
    matchService.setCurrentIndiBatsmen(current_indi_batsmen);
  }

  factory.updateBowlers = function(player_id) {
    var current_indi_bowlers = this.getCurrentIndiBowlers();
    for(var i in current_indi_bowlers) {
      if(current_indi_bowlers[i].playerId === player_id) {
        current_indi_bowlers.splice(i,1);
      }
    }
    this.setCurrentIndiBowlers(current_indi_bowlers);
  }

  factory.updateCurrentBatsmen = function(current_batsman){
    var current_indi_batsmen = this.getCurrentIndiBatsmen();
    for(var i in current_indi_batsmen) {
      if(current_indi_batsmen[i].playerId == current_batsman.playerId) {
        for(var key in current_batsman) {
          current_indi_batsmen[i].key = current_batsman.key;
        }
        break;
      }
    }
    this.setCurrentIndiBatsmen(current_indi_batsmen);
  }

  factory.updateBatsmen = function(player_id) {
    var current_indi_batsmen = this.getCurrentIndiBatsmen();
    for(var i in current_indi_batsmen) {
      if(current_indi_batsmen[i].playerId === player_id) {
        current_indi_batsmen.splice(i,1);
      }
    }
    this.setCurrentIndiBatsmen(current_indi_batsmen);
  }

  factory.updateCurrentBowler = function(current_bowler){
    var current_indi_bowlers = this.getCurrentIndiBowlers();
    for(var i in current_indi_bowlers) {
      if(current_indi_bowlers[i].playerId == current_bowler.playerId) {
        for(var key in current_bowler) {
          current_indi_bowlers[i].key = current_bowler.key;
        }
        break;
      }
    }
    this.setCurrentIndiBowlers(current_indi_bowlers);
  }

  factory.getScore = function(){
    return score;
  }

  factory.getNextBall = function(){
    return next_ball;
  }

  factory.getTotalRuns = function(){
    return total_runs;
  }

  factory.getWickets = function(){
    return wickets;
  }

  factory.getCurrentOver = function(){
    return current_over;
  }

  factory.getCurrentBallNumber = function(){
    return current_ball_number;
  }

  factory.getLastTenBallEvents = function(){
    return last_ten_balls;
  }

  factory.updateLastTenBalls = function(last_ten_balls){
    this.last_ten_balls = last_ten_balls;
  }

  factory.setNextBall = function(next_ball) {
    this.next_ball = next_ball;
  }

  return factory;
}]);
