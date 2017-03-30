app.factory('matchService',function(){
  var players = [
    {
      playerName:'Sagar',
      playerBattingStyle:'rhb',
      playerBowlingStyle:'rf',
      playerTeamId:1,
      teamMatchId:1,
    },
  ];

  var teams = [
    {
      teamName:'One',
      teamId:1,
      matchId:1,
    },
    {
      teamName:'Two',
      teamId:2,
      matchId:1,
    },
  ];
  
  var factory = {};
  factory.insertPlayer = function(playerName,playerBattingStyle,playerBowlingStyle,playerTeamId,teamMatchId){
    players.push(
      {
        playerName: playerName,
        playerBattingStyle: playerBattingStyle,
        playerBowlingStyle: playerBowlingStyle,
        playerTeamId: playerTeamId,
        teamMatchId: teamMatchId,
      });
  };

  factory.getPlayers = function(){
    return players;
  };

  factory.deletePlayer = function(id){

  };

  factory.getMatchId = function(){
    return 1;
  };

  factory.getTeams = function(){
    return teams;
  }

  factory.getGUID = function(){
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  };
  factory.s4 = function(){
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return factory;
});
