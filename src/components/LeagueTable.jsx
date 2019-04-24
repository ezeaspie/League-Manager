import React from 'react';

const LeagueTable = (props) => {

  let players = props.players.slice(0);

  players.forEach((player) => {
    player.goalDifference = 0;
    player.goalsFor = 0;
    player.goalsAgainst = 0;
    player.gamesPlayed = 0;
    player.points = 0;
    player.wins = 0;
    player.losses = 0;
    player.draws = 0;
  });

  const updatePlayerOnResult = (winnerId, loserId, result, isDraw=false) => {
    console.log(result);
    for (let i = 0; i < players.length; i += 1) {
      if (players[i].id === winnerId) {
        // Find Opponent and add a gameplayed.
        for (let p = 0; p < players.length; p += 1) {
          if (players[p].id === loserId) {
            if (isDraw) {
              players[p].points += 1;
              players[p].draws += 1;
            }
            players[p].goalsFor += result[1];
            players[p].losses += 1;
            players[p].goalsAgainst += result[0];
            players[p].goalDifference = players[p].goalsFor - players[p].goalsAgainst;
            players[p].gamesPlayed += 1;
            console.log({loser: players[p]});
            break;
          }
        }
        // Manipulate the winning player object.
        if (isDraw) {
          console.log("DRAW");
          players[i].points += 1;
          players[i].draws += 1;
        } else {
          console.log("YOU WINA");
          players[i].points += 3;
          players[i].wins += 1;
        }
        players[i].goalsFor += result[0];
        players[i].goalsAgainst += result[1];
        players[i].goalDifference = players[i].goalsFor - players[i].goalsAgainst;
        players[i].gamesPlayed += 1;
        console.log({winner: players[i]});
      }
    }
    return players;
  };

  // Get played fixtures and calculate points based on wins / draws.
  props.fixtureData.forEach((matchDay) => {
    matchDay.forEach((fixture) => {
      const result = fixture.result;
      const home = fixture.home.id;
      const away = fixture.away.id;
      if (fixture.result[0] === false || fixture.result[1] === false) {
      } else if (fixture.result[0] > fixture.result[1]) {
        updatePlayerOnResult(home, away, result, false);
      } else if (fixture.result[1] > fixture.result[0]) {
        updatePlayerOnResult(away, home, [result[1],result[0]], false);
      } else {
        updatePlayerOnResult(home, away, result, true);
      }
    });
  });
  players.sort((a, b) => {
    if(b.points - a.points !== 0){
      return b.points - a.points;
    }
    if(b.goalDifference - a.goalDifference !== 0){
      return b.goalDifference - a.goalDifference;
      }
    if(b.goalsFor - a.goalsFor !== 0){
      return b.goalsFor - a.goalsFor;
        }
    return b.name - a.name;
  });

  const tableContent = players.map((player,i) => {
    return (
      <tr>
        <td>{i + 1}</td>
        <td>{player.name}</td>
        <td>{player.gamesPlayed}</td>
        <td>{player.wins}</td>
        <td>{player.draws}</td>
        <td>{player.losses}</td>
        <td>{player.goalsFor}</td>
        <td>{player.goalsAgainst}</td>
        <td>{player.goalDifference}</td>
        <td>{player.points}</td>
      </tr>
    )
  })

  console.log(players);

  return (
    <table>
      <tr>
        <th>POS</th>
        <th>Name</th>
        <th>GP</th>
        <th>W</th>
        <th>D</th>
        <th>L</th>
        <th>GF</th>
        <th>GA</th>
        <th>GD</th>
        <th>PTS</th>
      </tr>
      {tableContent.map(tableRow => tableRow)}
    </table>
  )
}

export default LeagueTable;