/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import LeagueTable from './LeagueTable';
import EditFixture from './appParts/EditFixture';

const { dialog } = require('electron').remote;
const fs = require('fs');


const LeagueInterface = (props) => {
  const [currentLeagueView, setCurrentLeagueView] = useState(0);
  const [players, setPlayers] = useState(props.leagueData.players);
  const [fixtureData, setFixtureData] = useState(props.leagueData.fixtures);

  const saveFile = () => {
    const content = JSON.stringify(fixtureData);
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
        console.log(err);
        });
      });
  };

  const updateFixtures = (updatedFixture) => {
    const duplicate = fixtureData;
    for (let i = 0; i < duplicate.length; i += 1) {
      for (let p = 0; p < duplicate[i].length; p += 1) {
        if (duplicate[i][p].home === updatedFixture.home && duplicate[i][p].away === updatedFixture.away) {
          duplicate[i][p].result = updatedFixture.result;
          console.log(duplicate[i][p]);
          setFixtureData(duplicate);
          break;
        }
      }
    }
  };

  console.log(props);

  const updateView = (newViewValue) => {
    setCurrentLeagueView(newViewValue);
  };

  const renderFixtures = () => {
    return fixtureData.map((matchDay, i) => {
      const items = matchDay.map(fixture => (
        <EditFixture fixture={fixture} updateFixtures={updateFixtures} />
      ));
      return <div><h2>Round {i + 1}</h2>{items}</div>;
    });
  };

  const renderLeagueTable = () => <LeagueTable players={players} fixtureData={fixtureData} />;

  const views = [
    renderFixtures,
    renderLeagueTable,
  ];

  return (
    <div>
      <button onClick={saveFile}>Save</button>
      <p style={{ display: 'none' }} id="leagueData">{JSON.stringify({ players, fixtureData })}</p>
      <h1>{props.leagueData.leagueTitle}</h1>
      {currentLeagueView === 0 ?
        <button onClick={() => updateView(1)}>Show Table</button> :
        <button onClick={() => updateView(0)}>Show Fixtures</button>
      }

      {views[currentLeagueView]()}
    </div>
  );
};

export default LeagueInterface;
