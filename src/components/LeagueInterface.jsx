/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import LeagueTable from './LeagueTable';

const LeagueInterface = (props) => {
  const [currentLeagueView, setCurrentLeagueView] = useState(0);
  const [players, setPlayers] = useState(props.leagueData.players);
  const [fixtureData, setFixtureData] = useState(props.leagueData.fixtures);
  console.log(props);

  const updateView = (newViewValue) => {
    setCurrentLeagueView(newViewValue);
  };

  const renderFixtures = () => {
    return fixtureData.map((matchDay, i) => {
      const items = matchDay.map(fixture => (
        <div>
          <p>{fixture.home.name} vs {fixture.away.name}</p>
          <p>{fixture.result[0]} - {fixture.result[1]}</p>
        </div>
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
