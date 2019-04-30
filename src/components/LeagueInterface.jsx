/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import LeagueTable from './LeagueTable';
import EditFixture from './appParts/EditFixture';

const { dialog } = require('electron').remote;
const fs = require('fs');

const LeagueInterface = (props) => {
  const [currentLeagueView, setCurrentLeagueView] = useState(0);
  console.log(currentLeagueView);
  const [players] = useState(props.leagueData.players);
  const [fixtureData, setFixtureData] = useState(props.leagueData.fixtures);

  const generateBracket = () => {
    const matchDay = [];
    const winners = [];
    // Filter out all fixtures that took place in a particular round.
    const fixtureArray = fixtureData.filter(matchDayWithin => (
      matchDayWithin.every(fixture => fixture.round === 0)
    ));
    console.log(fixtureArray);

    // Remove duplicate ids in case there are two legs.
    const cupIdsUnfiltered = fixtureArray[0].map(filteredFixture => filteredFixture.cupId);
    const cupIds = [...new Set(cupIdsUnfiltered)];
    console.log(cupIds);

    // Get fixtures
    // Filter and return an array of players who won their matchup.
    cupIds.forEach((matchId) => {
      const filteredFixtures = [];
      fixtureData.forEach((matchDayWithin) => {
        matchDayWithin.forEach((fixture) => {
          if (fixture.cupId === matchId) {
            filteredFixtures.push(fixture);
          }
        });
      });
      let player1 = filteredFixtures[0].home;
      let player2 = filteredFixtures[0].away;

      player1.score = 0;
      player2.score = 0;
      player1.awayGoals = 0;
      player2.awayGoals = 0;
      filteredFixtures.forEach((fixture, i) => {
        if (i === 0) {
          player1.score += fixture.result[0];
          player2.score += fixture.result[1];
          player2.awayGoals += fixture.result[1];
        } else {
          player1.score += fixture.result[1];
          player1.awayGoals += fixture.result[1];
          player2.score += fixture.result[0];
        }
      });
      console.log(player1, player2);
      console.log(filteredFixtures);
      if (player1.score === player2.score) {
        if (player1.awayGoals === player2.awayGoals) {
          console.log('PENALTIES');
          return;
        } else if (player1.awayGoals > player2.awayGoals) {
          winners.push(player1);
          return;
        }
        winners.push(player2);
        return;
      } else if (player1.score > player2.score) {
        winners.push(player1);
        return;
      }
      winners.push(player2);
    });
    console.log(winners);

    const clone = props.leagueData.players.slice(0);
    const generateID = () => Date.now() + Math.random();
    while (clone.length > 0) {
      let rand = Math.floor(Math.random() * clone.length);
      const home = clone.splice(rand, 1);
      rand = Math.floor(Math.random() * clone.length);
      const away = clone.splice(rand, 1);
      const fixture = { home: home[0], away: away[0], round: 0, result: [null, null], id: generateID(), cupId: generateID() };
      matchDay.push(fixture);
    }
    return matchDay;
  };

  const saveFile = () => {
    const content = JSON.stringify(
      {
        players,
        fixtures: fixtureData,
        leagueTitle: props.leagueData.leagueTitle,
      },
    );
    dialog.showSaveDialog(
      {
        filters: { name: 'JSON Files', extensions: ['json'] },
      },
      (fileName) => {
        if (fileName === undefined) {
          // eslint-disable-next-line no-undef
          window.alert('Please enter a name for your file.');
          return;
        }
        fs.writeFile(fileName, content, (err) => {
          // eslint-disable-next-line no-undef
          window.alert(err);
        });
      });
  };

  const updateFixtures = (updatedFixture) => {
    const duplicate = fixtureData;
    for (let i = 0; i < duplicate.length; i += 1) {
      for (let p = 0; p < duplicate[i].length; p += 1) {
        // eslint-disable-next-line max-len
        if (duplicate[i][p].home === updatedFixture.home && duplicate[i][p].away === updatedFixture.away) {
          duplicate[i][p].result = updatedFixture.result;
          setFixtureData(duplicate);
          break;
        }
      }
    }
  };

  const updateView = (newViewValue) => {
    setCurrentLeagueView(newViewValue);
  };

  const renderFixtures = () => (
    fixtureData.map((matchDay, i) => {
      const items = matchDay.map(fixture => (
        <EditFixture key={fixture.id} fixture={fixture} updateFixtures={updateFixtures} />
      ));
      return <div><h2>Round {i + 1}</h2>{items}</div>;
    })
  );

  const renderLeagueTable = () => <LeagueTable players={players} fixtureData={fixtureData} />;

  const views = [
    renderFixtures,
    renderLeagueTable,
  ];

  const everyFixturePlayed = fixtureData.map(matchDay => (
    matchDay.every(fixture => (
      fixture.result[0] !== null && fixture.result[1] !== null
    ))
  ));

  let possibleNextDraw = false;
  if (everyFixturePlayed.every(matchDay => matchDay)) {
    possibleNextDraw = true;
  }

  return (
    <div>
      <button onClick={saveFile}>Save</button>
      <h1>{props.leagueData.leagueTitle}</h1>
      {props.leagueData.tournamentType === 1 ?
        <button
          disabled={!possibleNextDraw} 
          onClick={() => generateBracket()}
        >Draw Next Round</button>
        : null }
      {currentLeagueView === 0 ?
        <button onClick={() => updateView(1)}>Show Table</button> :
        <button onClick={() => updateView(0)}>Show Fixtures</button>
      }

      {views[currentLeagueView]()}
    </div>
  );
};

export default LeagueInterface;
