/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import React from 'react';

const LeagueTable = (props) => {
  const players = props.players.slice(0);

  players.forEach((player) => {
    player.goalDifference = 0;
    player.goalsFor = 0;
    player.goalsAgainst = 0;
    player.gamesPlayed = 0;
    player.points = 0;
    player.wins = 0;
    player.losses = 0;
    player.draws = 0;
    player.form = [];
  });

  const updatePlayerOnResult = (winnerId, loserId, result, isDraw = false) => {
    for (let i = 0; i < players.length; i += 1) {
      if (players[i].id === winnerId) {
        // Find Opponent and add a gameplayed.
        for (let p = 0; p < players.length; p += 1) {
          if (players[p].id === loserId) {
            if (isDraw) {
              players[p].points += 1;
              players[p].draws += 1;
              players[p].form.push(1);
            } else {
              players[p].form.push(2);
            }
            players[p].goalsFor += result[1];
            players[p].losses += 1;
            players[p].goalsAgainst += result[0];
            players[p].goalDifference = players[p].goalsFor - players[p].goalsAgainst;
            players[p].gamesPlayed += 1;
            break;
          }
        }
        // Manipulate the winning player object.
        if (isDraw) {
          players[i].points += 1;
          players[i].draws += 1;
          players[i].form.push(1);
        } else {
          players[i].points += 3;
          players[i].form.push(0);
          players[i].wins += 1;
        }
        players[i].goalsFor += result[0];
        players[i].goalsAgainst += result[1];
        players[i].goalDifference = players[i].goalsFor - players[i].goalsAgainst;
        players[i].gamesPlayed += 1;
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
      if (fixture.result[0] === null || fixture.result[1] === null) {
        return false;
      } else if (fixture.result[0] > fixture.result[1]) {
        updatePlayerOnResult(home, away, result, false);
      } else if (fixture.result[1] > fixture.result[0]) {
        updatePlayerOnResult(away, home, [result[1], result[0]], false);
      } else {
        updatePlayerOnResult(home, away, result, true);
      }
      return true;
    });
  });
  players.sort((a, b) => {
    if (b.points - a.points !== 0) {
      return b.points - a.points;
    }
    if (b.goalDifference - a.goalDifference !== 0) {
      return b.goalDifference - a.goalDifference;
    }
    if (b.goalsFor - a.goalsFor !== 0) {
      return b.goalsFor - a.goalsFor;
    }
    return b.name - a.name;
  });

  const tableContent = players.map((player, i) => {
    const formLabelObject = ['W', 'D', 'L'];
    const shownForm = player.form.slice(-5);
    return (
      <tr key={`row${i + 1}`}>
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
        <td>
          {shownForm.map(result => <span key={`pForm${i + 1}`} className={`form${result}`}>{formLabelObject[result]}</span>)}
        </td>
      </tr>
    );
  });

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
        <th>FRM</th>
      </tr>
      {tableContent.map(tableRow => tableRow)}
    </table>
  );
};

export default LeagueTable;
