app.factory('scoreService',['matchService', function(matchService){
  var score = [];
  var last_ten_balls = [];
  var next_ball = 0;
  var total_runs = 0;
  var wickets = 0;
  var current_over = 0;
  var current_ball_number = 0;

  var factory = {};

  factory.insertScore = function(scoreDetails, currentBatsman, currentBowler, currentBallDetails,whichBatsman){
    score.push(scoreDetails);
    next_ball = scoreDetails[0].current_ball_number+1;
    total_runs = scoreDetails[0].total_runs;
    wickets = scoreDetails[0].wickets;
    current_ball_number = scoreDetails[0].current_ball_number;
    current_over = Math.floor(current_ball_number/6) + "." + current_ball_number%6;
    next_ball = Math.floor(next_ball/6) + "." + next_ball%6;
    console.log(scoreDetails[0]);
    this.updatePlayersBatsmen(currentBatsman);
    this.updatePlayersBowlers(currentBowler);
    this.last_ten_balls = currentBallDetails;
    if(scoreDetails[0].out == true) {
      this.updateBatsmen(whichBatsman);
    }
  }

  factory.updatePlayersBatsmen = function(current_player_array){
    var players = this.getPlayers();
    for(var i in players[0]) {
      if(players[0][i].playerId == current_player_array.playerId) {
          players[0][i].out = current_player_array.out;
          players[0][i].battingRuns = current_player_array.runs;
          players[0][i].battingBalls = current_player_array.balls;
          players[0][i].battingFours = current_player_array.fours;
          players[0][i].battingSixes = current_player_array.sixes;
          players[0][i].battingStrikeRate = current_player_array.strike_rate;
        break;
      }
    }
    console.log(players[0][i]);
  }

  factory.updatePlayersBowlers = function(current_player_array){
    var players = this.getPlayers();
    for(var i in players[1]) {
      if(players[1][i].playerId == current_player_array.playerId) {
          players[1][i].bowlingBalls = current_player_array.balls;
          players[1][i].bowlingOvers = current_player_array.overs;
          players[1][i].bowlingRuns = current_player_array.runs;
          players[1][i].bowlingWkts = current_player_array.wks;
          players[1][i].bowlingWides = current_player_array.wides;
          players[1][i].bowlingNoBalls = current_player_array.noballs;
          players[1][i].bowlingEconomyRate = current_player_array.economy_rate;
          players[1][i].bowlingStrikeRate = current_player_array.strike_rate;
        break;
      }
    }
    console.log(players[1][i]);
  }

  factory.updateBatsmen = function(player_id) {
    var current_indi_batsmen = this.getCurrentIndiBatsmen();
    console.log(current_indi_batsmen);
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
   current_indi_batsmen.unshift(new_batsman);
   this.setCurrentIndiBatsmen(current_indi_batsmen);
 }

  factory.insertBowler = function(bowler_id, bowler_name, bowler_class){
    var current_indi_bowlers = this.getCurrentIndiBowlers();
    if(current_indi_bowlers.length > 1){
      for(var i in current_indi_bowlers) {
        if(current_indi_bowlers[i].playerId == bowler_id) {
          current_indi_bowler = current_indi_bowlers.reverse();
          return false;
        }
      }
    }
    players = this.getPlayers();
    for(var i in players[1]) {
      if(bowler_id == players[1][i].playerId) {
        var bowler_data = {
           class: bowler_class,
           playerId: bowler_id,
           name: bowler_name,
           runs: players[1][i].bowlingRuns,
           balls: players[1][i].bowlingBalls,
           overs: players[1][i].bowlingOvers,
           wks: players[1][i].bowlingWkts,
           wides: players[1][i].bowlingWides,
           noballs : players[1][i].bowlingNoBalls,
           economy_rate : players[1][i].bowlingEconomyRate,
           strike_rate: players[1][i].bowlingStrikeRate,
        };
        break;
      }

    }
    current_indi_bowlers.unshift(bowler_data);
    current_indi_bowlers[1].class='previous-bowler-name';
    if(current_indi_bowlers.length > 2) {
      this.updateBowlers(current_indi_bowlers[1].playerId);
    }
    this.setCurrentIndiBowlers(current_indi_bowlers);
  }

  factory.updateBowlers = function(player_id) {
    var current_indi_bowlers = this.getCurrentIndiBowlers();
    // this.updatePlayers(scoreDetails[0].bowler_id, current_indi_bowlers[0], 1);
    for(var i in current_indi_bowlers) {
      if(current_indi_bowlers[i].playerId === player_id) {
        current_indi_bowlers.splice(i,1);
      }
    }
    this.setCurrentIndiBowlers(current_indi_bowlers);
  }



  // factory.updateCurrentBatsmen = function(current_batsman){
  //   var current_indi_batsmen = this.getCurrentIndiBatsmen();
  //   // this.updatePlayers(scoreDetails[0].batsman_id, current_indi_batsmen[0], 0);
  //   console.log(current_batsman);
  //   console.log(current_indi_batsmen);
  //   for(var i in current_indi_batsmen) {
  //     if(current_indi_batsmen[i].playerId == current_batsman.playerId) {
  //       console.log(i);
  //       for(var key in current_batsman) {
  //         current_indi_batsmen[i].key = current_batsman.key;
  //       }
  //       break;
  //     }
  //   }
  //   this.setCurrentIndiBatsmen(current_indi_batsmen);
  // }

  // factory.updateCurrentBowler = function(current_bowler){
  //   var current_indi_bowlers = this.getCurrentIndiBowlers();
  //   for(var i in current_indi_bowlers) {
  //     if(current_indi_bowlers[i].playerId == current_bowler.playerId) {
  //       for(var key in current_bowler) {
  //         current_indi_bowlers[i].key = current_bowler.key;
  //       }
  //       break;
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
  factory.setCurrentIndiBowlers = function(current_indi_bowlers) {
    matchService.setCurrentIndiBowlers(current_indi_bowlers);
  }
  factory.setCurrentIndiBatsmen = function(current_indi_batsmen) {
    matchService.setCurrentIndiBatsmen(current_indi_batsmen);
  }

  return factory;
}]);
