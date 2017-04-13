app.factory('scoreService',['matchService', function(matchService){
  var factory = {};
  var score = [];
  var last_ten_balls = [];
  var next_ball = 0;
  var total_runs = 0;
  var current_over = 0;
  var current_ball_number = 0;
  var wickets = 0;

  factory.insertScore = function(scoreDetails, currentBatsman, currentBowler, currentBallDetails, whichBatsman){
    scoreDetails.whoIsOut = whichBatsman;
    score.push(scoreDetails);
    next_ball = scoreDetails.current_ball_number+1;
    total_runs = scoreDetails.total_runs;
    wickets = scoreDetails.wickets;
    current_ball_number = scoreDetails.current_ball_number;
    current_over = Math.floor(current_ball_number/6) + "." + current_ball_number%6;
    next_ball = Math.floor(next_ball/6) + "." + next_ball%6;
    this.updatePlayersBatsmen(currentBatsman, whichBatsman);
    if(scoreDetails.out == true) {
      this.updateBatsmen(whichBatsman);
    }
    this.updatePlayersBowlers(currentBowler);
  }

  factory.updatePlayersBatsmen = function(current_player_array, who_is_out){
    var players = this.getPlayers();
    for(var i in players[0]) {
      if(players[0][i].playerId == who_is_out) {
        players[0][i].out = current_player_array.out;
      }
      if(players[0][i].playerId == current_player_array.playerId) {
          players[0][i].playerName = current_player_array.playerName;
          players[0][i].battingRuns = current_player_array.battingRuns;
          players[0][i].battingBalls = current_player_array.battingBalls;
          players[0][i].battingFours = current_player_array.battingFours;
          players[0][i].battingSixes = current_player_array.battingSixes;
          players[0][i].battingStrikeRate = current_player_array.battingStrikeRate;
        break;
      }
    }
  }

  factory.updatePlayersBowlers = function(current_player_array){
    var players = this.getPlayers();
    for(var i in players[1]) {
      if(players[1][i].playerId == current_player_array.playerId) {
          players[1][i].playerName = current_player_array.playerName;
          players[1][i].bowlingBalls = current_player_array.bowlingBalls;
          players[1][i].bowlingOvers = current_player_array.bowlingOvers;
          players[1][i].bowlingRuns = current_player_array.bowlingRuns;
          players[1][i].bowlingWkts = current_player_array.bowlingWkts;
          players[1][i].bowlingWides = current_player_array.bowlingWides;
          players[1][i].bowlingNoBalls = current_player_array.bowlingNoBalls;
          players[1][i].bowlingEconomyRate = current_player_array.bowlingEconomyRate;
          players[1][i].bowlingStrikeRate = current_player_array.battingStrikeRate;
        break;
      }
    }
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

  factory.insertBatsman = function(batsman_id, batsman_name, batsman_class){
   var current_indi_batsmen = this.getCurrentIndiBatsmen();
   players = this.getPlayers();
   for(var i in players[0]) {
     if(batsman_id == players[0][i].playerId) {
       var new_batsman = {
          class: batsman_class,
          playerId: batsman_id,
          playerName: batsman_name,
          battingRuns: players[0][i].battingRuns,
          battingBalls: players[0][i].battingBalls,
          battingFours: players[0][i].battingFours,
          battingSixes: players[0][i].battingSixes,
          out: players[0][i].out,
          battingStrikeRate: players[0][i].battingStrikeRate,
       };
       break;
     }
   }
   current_indi_batsmen.unshift(new_batsman);
   this.setCurrentIndiBatsmen(current_indi_batsmen);
 }

  factory.insertBowler = function(bowler_id, bowler_name, bowler_class){
    var current_indi_bowlers = this.getCurrentIndiBowlers();
    players = this.getPlayers();
    for(var i in players[1]) {
      if(bowler_id == players[1][i].playerId) {
        var bowler_data = {
           class: bowler_class,
           playerId: bowler_id,
           playerName: bowler_name,
           bowlingRuns: players[1][i].bowlingRuns,
           bowlingBalls: players[1][i].bowlingBalls,
           bowlingOvers: players[1][i].bowlingOvers,
           bowlingWkts: players[1][i].bowlingWkts,
           bowlingWides: players[1][i].bowlingWides,
           bowlingNoBalls : players[1][i].bowlingNoBalls,
           bowlingEconomyRate : players[1][i].bowlingEconomyRate,

           bowlingStrikeRate: players[1][i].bowlingStrikeRate,
        };
        break;
      }
    }
    current_indi_bowlers[0] = bowler_data;
    this.setCurrentIndiBowlers(current_indi_bowlers);
  }

  // factory.updateBowlers = function(player_id) {
  //   var current_indi_bowlers = this.getCurrentIndiBowlers();
  //   for(var i in current_indi_bowlers) {
  //     if(current_indi_bowlers[i].playerId === player_id) {
  //       current_indi_bowlers.splice(i,1);
  //     }
  //   }
  //   this.setCurrentIndiBowlers(current_indi_bowlers);
  // }

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

  factory.endInnings = function(totalRuns, total_wickets, total_overs, total_balls) {
    // this.updatePlayersBatsmen(currentBatsman, whichBatsman);
    // this.updatePlayersBowlers(currentBowler);
    matchService.endInnings(totalRuns, total_wickets, total_overs, total_balls);
    last_ten_balls = [];
    next_ball = 0;
    total_runs = 0;
    current_over = 0;
    current_ball_number = 0;
    wickets = 0;
  }

  factory.endMatch = function(totalRuns, total_wickets, total_overs, total_balls) {
    matchService.endMatch(totalRuns, total_wickets, total_overs, total_balls);
    last_ten_balls = [];
    next_ball = 0;
    total_runs = 0;
    current_over = 0;
    current_ball_number = 0;
    wickets = 0;
  }

  factory.setNextBall = function(next_ball) {
    this.next_ball = next_ball;
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
  factory.getCurrentInnings = function(){
    return matchService.getCurrentInnings();
  }
  factory.setCurrentIndiBowlers = function(current_indi_bowlers) {
    matchService.setCurrentIndiBowlers(current_indi_bowlers);
  }
  factory.setCurrentIndiBatsmen = function(current_indi_batsmen) {
    matchService.setCurrentIndiBatsmen(current_indi_batsmen);
  }

  return factory;
}]);
