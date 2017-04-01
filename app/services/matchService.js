app.factory('matchService',function($http){
  var players = [];

  var match = [];

  var batting_team = [];
  var bowling_team = [];

  var factory = {};

  factory.insertMatch = function(teamOne, teamTwo, toss, batting, totalPlayers, totalOvers){
    var match_id = this.getGUID();
    var team_one_id = this.getGUID();
    var team_two_id = this.getGUID();
    if(teamOne == batting) {
      first_batting = teamOne;
      first_bowling = teamTwo;
      first_batting_teamId = team_one_id;
      first_bowling_teamId = team_two_id;
    }else {
      first_bowling = teamOne;
      first_batting = teamTwo;
      first_batting_teamId = team_two_id;
      first_bowling_teamId = team_one_id;
    }
    match.push({
      matchId: match_id,
      teamOneId: team_one_id,
      teamOne: teamOne,
      teamTwoId: team_two_id,
      teamTwo: teamTwo,
      toss: toss,
      firstBatting: first_batting,
      firstBowling: first_bowling,
      firstBattingTeamId: first_batting_teamId,
      firstBowlingTeamId: first_bowling_teamId,
      firstInningsRuns: 0,
      secondInningsRuns: 0,
      firstInningsBalls: 0,
      secondInningsBalls: 0,
      firstInningsWkts: 0,
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
        playerName:'',
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
        playerName:'',
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
  }

  factory.getPlayers = function(){
    return players;
  };

  factory.deletePlayer = function(id){

  };

  factory.getMatchDetails = function(){
    return match;
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
