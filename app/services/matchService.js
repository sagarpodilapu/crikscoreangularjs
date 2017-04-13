app.factory('matchService',function($http){

  var players = [];
  var current_innings = '';

  var current_indi_batsmen = [];
  var current_indi_bowlers = [];

  var match = [];

  var batting_team = [];
  var bowling_team = [];

  var factory = {};

  factory.fetchPlayers = function() {
        var defer = $q.defer();

        $http.get('Json/players.json')
            .success(function(data) {
                angular.extend(factory, data);
                defer.resolve();
            })
            .error(function() {
                defer.reject('could not find player.json');
            });

        return defer.promise;
    }

  factory.insertMatch = function(totalPlayers, totalOvers){
    var match_id = this.getGUID();
    var team_one_id = this.getGUID();
    var team_two_id = this.getGUID();
    var teamOne = 'Team One';
    var teamTwo = 'Team Two'
    first_batting = teamOne;
    first_bowling = teamTwo;
    first_batting_teamId = team_one_id;
    first_bowling_teamId = team_two_id;
    match.push({
      matchId: match_id,
      teamOneId: team_one_id,
      teamOne: teamOne,
      teamTwoId: team_two_id,
      teamTwo: teamTwo,
      toss: teamOne,
      firstBatting: first_batting,
      firstBowling: first_bowling,
      firstBattingTeamId: first_batting_teamId,
      firstBowlingTeamId: first_bowling_teamId,
      firstInningsRuns: 0,
      firstInningsOvers: '0.0',
      firstInningsBalls: 0,
      firstInningsWkts: 0,
      secondInningsRuns: 0,
      secondInningsOvers: '0.0',
      secondInningsBalls: 0,
      secondInningsWkts: 0,
      winner:'',
      totalPlayer: totalPlayers,
      totalOvers: totalOvers,
    });

    for(var i=1;i<=totalPlayers;i++) {
      batsman_id = this.getGUID();
      bowler_id = this.getGUID();
      batsman_data = {
        id:i,
        playerId:batsman_id,
        playerName:first_batting.replace(' ','')+'#'+i,
        teamId:first_batting_teamId,
        teamName:first_batting,
        out: false,
        battingRuns:0,
        battingBalls:0,
        battingFours:0,
        battingSixes:0,
        battingStrikeRate: 0,
        bowlingBalls: 0,
        bowlingOvers: 0,
        bowlingRuns: 0,
        bowlingWkts: 0,
        bowlingWides: 0,
        bowlingNoBalls: 0,
        bowlingEconomyRate: 0,
        bowlingStrikeRate: 0,

      };
      bowler_data = {
        id:i,
        playerId:bowler_id,
        playerName:first_bowling.replace(' ','')+'#'+i,
        teamId:first_bowling_teamId,
        teamName:first_bowling,
        out: false,
        battingRuns:0,
        battingBalls:0,
        battingFours:0,
        battingSixes:0,
        battingStrikeRate: 0,
        bowlingBalls: 0,
        bowlingOvers: 0,
        bowlingRuns: 0,
        bowlingWkts: 0,
        bowlingWides: 0,
        bowlingNoBalls: 0,
        bowlingEconomyRate: 0,
        bowlingStrikeRate: 0,
      };
      batting_team.push(batsman_data);
      bowling_team.push(bowler_data);
    }
    players.push(batting_team,bowling_team);
    this.insertBatsman();
    this.insertStriker();
    this.insertBowler();
    current_innings = 'First Innings';
  }

  factory.endInnings = function(total_runs, total_wickets, total_overs, total_balls) {
    match[0].firstInningsRuns = total_runs;
    match[0].firstInningsWkts = total_wickets;
    match[0].firstInningsBalls = total_balls;
    match[0].firstInningsOvers = total_overs;
    players.reverse();
    current_indi_batsmen = [];
    current_indi_bowlers = [];
    current_innings = 'Second Innings';
  }

  factory.endMatch = function(total_runs, total_wickets, total_overs, total_balls) {
    match[0].secondInningsRuns = total_runs;
    match[0].secondInningsWkts = total_wickets;
    match[0].secondInningsBalls = total_balls;
    match[0].secondInningsOvers = total_overs;
    if(match[0].firstInningsRuns > match[0].secondInningsRuns) {
      match[0].winner = match[0].teamOne;
    }else if(match[0].firstInningsRuns < match[0].secondInningsRuns) {
      match[0].winner = match[0].teamTwo;
    }else {
      match[0].winner = 'match tied';
    }
  }

  factory.insertBatsman = function(){
    var new_batsman = {
       class: 'current-batsman-name',
       playerId: players[0][0].playerId,
       playerName: players[0][0].playerName,
       battingRuns: players[0][0].battingRuns,
       battingBalls: players[0][0].battingBalls,
       battingFours: players[0][0].battingFours,
       battingSixes: players[0][0].battingSixes,
       out: players[0][0].out,
       battingStrikeRate: players[0][0].battingStrikeRate,
    };
    current_indi_batsmen.unshift(new_batsman);
  }

  factory.insertStriker = function(){
    var new_batsman = {
       class: 'non-striker-name',
       playerId: players[0][1].playerId,
       playerName: players[0][1].playerName,
       battingRuns: players[0][1].battingRuns,
       battingBalls: players[0][1].battingBalls,
       battingFours: players[0][1].battingFours,
       battingSixes: players[0][1].battingSixes,
       out: players[0][1].out,
       battingStrikeRate: players[0][1].battingStrikeRate,
    };
    current_indi_batsmen.unshift(new_batsman);
  }

  factory.insertBowler = function(){
    len = players[1].length-1;
    var bowler_data = {
       class: 'current-bowler-name',
       playerId: players[1][len].playerId,
       playerName: players[1][len].playerName,
       bowlingRuns: players[1][len].bowlingRuns,
       bowlingBalls: players[1][len].bowlingBalls,
       bowlingOvers: players[1][len].bowlingOvers,
       bowlingWkts: players[1][len].bowlingWkts,
       bowlingWides: players[1][len].bowlingWides,
       bowlingNoBalls : players[1][len].bowlingNoBalls,
       bowlingEconomyRate : players[1][len].bowlingEconomyRate,
       bowlingStrikeRate: players[1][len].bowlingStrikeRate,
    };
    current_indi_bowlers.unshift(bowler_data);
  }

  factory.getCurrentIndiBatsmen = function(){
    return current_indi_batsmen;
  }

  factory.getCurrentIndiBowlers = function(){
    return current_indi_bowlers;
  }

  factory.setCurrentIndiBatsmen = function(current_indi_batsmen){
    this.current_indi_batsmen = current_indi_batsmen;
  }

  factory.setCurrentIndiBowlers = function(current_indi_bowlers){
    this.current_indi_bowlers = current_indi_bowlers;
  }

  factory.getPlayers = function(){
    return players;
  };

  factory.getTeams = function(){
    return ['teamOne','teamTwo'];
  }

  factory.getCurrentInnings = function(){
    return current_innings;
  }

  factory.deletePlayer = function(id){

  };

  factory.getMatchDetails = function(){
    return match;
  }

  factory.setMatchDetails = function(match_details){
    this.match = match_details;
  }

  factory.getMatchId = function(){
    return match;
  }

  factory.getGUID = function(){
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  };

  factory.s4 = function(){
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return factory;
});
