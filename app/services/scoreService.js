app.factory('scoreService',function(){
    var score = [
      {
        batsmen:[
          {
            name:'Sagar',
            runs: 20,
            balls: 15,
            fours: 2,
            sixes: 1,
            status: 'notout',
          },
          {
            name:'Ashish',
            runs: 10,
            balls: 15,
            fours: 2,
            sixes: 0,
            status:  'notout',
          },
          {
            name:'Guddu',
            runs: 20,
            balls: 15,
            fours: 2,
            sixes: 1,
            out: 'ytb',
          },
          {
            name:'Kaali',
            runs: 20,
            balls: 15,
            fours: 2,
            sixes: 1,
            status: 'ytb',
          },
          {
            name:'Nagaraj',
            runs: 20,
            balls: 15,
            fours: 2,
            sixes: 1,
            status: 'ytb',
          },
          {
            name:'Jagan',
            runs: 20,
            balls: 15,
            fours: 2,
            sixes: 1,
            status: 'out'
          },
          {
            name:'Vamsi',
            runs: 20,
            balls: 15,
            fours: 2,
            sixes: 1,
            status: 'ytb',
          },
          {
            name:'Manoj',
            runs: 20,
            balls: 15,
            fours: 2,
            sixes: 1,
            status: 'ytb',
          },
        ],
        bowlers:[
          {
            name:'ragas',
            balls: 10,
            runs: 20,
            wkts: 1,
            current_bowler: true,
            extras: {
              wides: 0,
              noballs: 0,
            },
          },
          {
            name:'hsihsa',
            balls: 10,
            runs: 20,
            wkts: 1,
            current_bowler: true,
            extras: {
              wides: 0,
              noballs: 0,
            },
          },
          {
            name:'uddug',
            balls: 10,
            runs: 20,
            wkts: 1,
            current_bowler: true,
            extras: {
              wides: 0,
              noballs: 0,
            },
          },
          {
            name:'jonam',
            balls: 10,
            runs: 20,
            wkts: 1,
            current_bowler: true,
            extras: {
              wides: 0,
              noballs: 0,
            },
          },
          {
            name:'ismav',
            balls: 10,
            runs: 20,
            wkts: 1,
            current_bowler: true,
            extras: {
              wides: 0,
              noballs: 0,
            },
          },
          {
            name:'nagaj',
            balls: 10,
            runs: 20,
            wkts: 1,
            current_bowler: true,
            extras: {
              wides: 0,
              noballs: 0,
            },
          },
          {
            name:'jaragan',
            balls: 10,
            runs: 20,
            wkts: 1,
            current_bowler: true,
            extras: {
              wides: 0,
              noballs: 0,
            },
          },
          {
            name:'ilaak',
            balls: 10,
            runs: 20,
            wkts: 1,
            current_bowler: true,
            extras: {
              wides: 0,
              noballs: 0,
            },
          },
        ],
        balls:[
          {
            ball: 1,
            runs: 1,
            ball_event: '',
          },
          {
            ball: 2,
            runs: 0,
            ball_event: 'out',
          },
          {
            ball: 3,
            runs: 4,
            ball_event: '',
          },
          {
            ball: 4,
            runs: 1,
            ball_event: 'wide',
          },
          {
            ball: 4,
            runs: 0,
            ball_event: '',
          },
          {
            ball: 5,
            runs: 2,
            ball_event: 'noball',
          },
          {
            ball: 5,
            runs: 0,
            ball_event: 'out',
          },
          {
            ball: 6,
            runs: 0,
            ball_event: '',
          },
        ],
        wickets:[
          {
            batsman: 'Sagar',
            type: 'Caught',
            fielder: 'Ashish',
            bowler: 'Ashish',
            fow: 4,
            ball: 10,
          },
          {
            batsman: 'Guddu',
            type: 'Caught',
            fielder: 'Ashish',
            bowler: 'Sagar',
            fow: 7,
            ball: 14,
          },
        ],
      }
  ];
  var factory = {};
  factory.getScore = function(){
    console.log(score);
    return score;
  }

  factory.getCurrentBall = function(){
    console.log(score.length);
  }

  factory.getCurrentScore = function(){
    console.log(score);
  }

  factory.insertScore = function(scoreDetails){
    console.log(scoreDetails);
  }

  return factory;
});
