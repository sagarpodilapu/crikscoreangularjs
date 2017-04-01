app.factory('scoreService',['matchService', function(matchService){
  var score = [];
  var current_indi_batsmen = [];
  var current_indi_bowlers = [];
  var last_ten_balls = [];
  var next_ball = 0;
  var total_runs = 0;
  var wickets = 0;
  var current_over = 0;
  var current_ball_number = 0;

  var factory = {};

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

  factory.insertScore = function(scoreDetails){
    score.push(scoreDetails);
    next_ball = scoreDetails[0].current_ball_number+1;
    total_runs = scoreDetails[0].total_runs;
    wickets = scoreDetails[0].wickets;
    current_ball_number = scoreDetails[0].current_ball_number;
    current_over = Math.floor(current_ball_number/6) + "." + current_ball_number%6;
    next_ball = Math.floor(next_ball/6) + "." + next_ball%6;
    // console.log(score);
  }

  factory.getPlayers = function(){
    return matchService.getPlayers();
  }

  factory.getMatchDetails = function(){
    return matchService.getMatchDetails();
  }

  factory.insertBatsman = function(batsman_id, batsman_name, batsman_class){
    players = this.getPlayers();
    for(var i in players[0]) {
      if(batsman_id == players[0][i].playerId) {
        var new_batsman = {
           class: batsman_class,
           playerId: batsman_id,
           name: batsman_name,
           runs: players[0][i].battingRuns,
           balls: players[0][i].battingBalls,
           fours: players[0][i].battingFours,
           sixes: players[0][i].battingSixes,
           out: players[0][i].out,
           strike_rate: players[0][i].battingStrikeRate,
        };
        break;
      }
    }
    current_indi_batsmen.push(new_batsman);
  }

  factory.insertBowler = function(bowler_id, bowler_name, bowler_class){
    var new_bowler = {
       class: bowler_class,
       playerId: bowler_id,
       name: bowler_name,
       balls: 0,
       overs: 0,
       runs: 0,
       wks: 0,
       wides: 0,
       noballs: 0,
       economy_rate: 0,
       strike_rate: 0,
    };
    players = this.getPlayers();
    for(var i in players[1]) {
      if(bowler_id == players[1][i].playerId) {
        var new_batsman = {
           class: bowler_class,
           playerId: bowler_id,
           name: bowler_name,
           runs: players[1][i].battingRuns,
           balls: players[1][i].bowlingBalls,
           overs: players[1][i].bowlingOvers,
           wks: players[1][i].bowlingWkts,
           wides: players[1][i].bowlingWides,
           noballs : players[1][i].bowlingNoBalls,
           economy_rate : players[1][i].bowlingEconomyRate,
           strike_rate: players[1][i].battingStrikeRate,
        };
        break;
      }
    }
    current_indi_bowlers.push(new_bowler);
    if(current_indi_bowlers.length > 2) {
      this.updateBowlers(current_indi_bowlers[1].playerId);
    }
  }

  factory.updateBowlers = function(player_id) {
    var transfer_bowler = [];
    for(var i in current_indi_bowlers) {
      if(current_indi_bowlers[i].playerId === player_id) {
        transfer_bowler = current_indi_bowlers[i];
        current_indi_bowlers.splice(i,1);
      }
    }
    for(var i in players[1]) {
      if(players[1][i].playerId === player_id) {
        for(var key in transfer_bowler) {
          players[1][i].bowlingBalls = transfer_bowler.balls;
          players[1][i].bowlingOvers = transfer_bowler.overs;
          players[1][i].bowlingRuns = transfer_bowler.runs;
          players[1][i].bowlingWkts = transfer_bowler.wks;
          players[1][i].bowlingWides = transfer_bowler.wides;
          players[1][i].bowlingNoBalls = transfer_bowler.noballs;
          players[1][i].bowlingEconomyRate = transfer_bowler.economy_rate;
          players[1][i].bowlingStrikeRate = transfer_bowler.strike_rate;
        }
        break;
      }
    }
  }

  factory.getCurrentIndiBatsmen = function(){
    return current_indi_batsmen;
  }

  factory.getCurrentIndiBowlers = function(){
    return current_indi_bowlers;
  }

  factory.updateCurrentBatsmen = function(current_batsman){
    for(var i in current_indi_batsmen) {
      if(current_indi_batsmen[i].playerId == current_batsman.playerId) {
        for(var key in current_batsman) {
          current_indi_batsmen[i].key = current_batsman.key;
        }
        break;
      }
    }
  }

  factory.updateCurrentBowler = function(current_bowler){
    for(var i in current_indi_bowlers) {
      if(current_indi_bowlers[i].playerId == current_bowler.playerId) {
        for(var key in current_bowler) {
          current_indi_bowlers[i].key = current_bowler.key;
        }
        break;
      }
    }
  }

  factory.getLastTenBallEvents = function(){
    return last_ten_balls;
  }

  factory.updateLastTenBalls = function(last_ten_balls){
    this.last_ten_balls = last_ten_balls;
  }

  factory.updatePlayers = function(player_id) {
    var transfer_batsman = [];
    for(var i in current_indi_batsmen) {
      if(current_indi_batsmen[i].playerId === player_id) {
        transfer_batsman = current_indi_batsmen[i];
        current_indi_batsmen.splice(i,1);
      }
    }
    for(var i in players[0]) {
      if(players[0][i].playerId === player_id) {
        for(var key in transfer_batsman) {
          players[0][i].out = transfer_batsman.out;
          players[0][i].battingRuns = transfer_batsman.runs;
          players[0][i].battingBalls = transfer_batsman.balls;
          players[0][i].battingFours = transfer_batsman.fours;
          players[0][i].battingSixes = transfer_batsman.sixes;
          players[0][i].battingStrikeRate = transfer_batsman.strike_rate;
        }
        break;
      }
    }
  }

  factory.setNextBall = function(next_ball) {
    this.next_ball = next_ball;
  }

  return factory;
}]);
