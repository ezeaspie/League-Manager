/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import playerFactory from './playerFactory';
import CreatePlayerForm from './appParts/CreatePlayerForm';

const CreateLeagueInterface = (props) => {
  const initalObjectArray = [
    playerFactory('Player', 'Home Stadium'),
    playerFactory('Player', 'Home Stadium'),
    playerFactory('Player', 'Home Stadium'),
    playerFactory('Player', 'Home Stadium'),
  ];
  const [playerObjectArray, setPlayerObjectArray] = useState(initalObjectArray);
  const [leagueName, setLeagueName] = useState('My League');
  const createFixtures = (playerObjectArray) => {
    const allFixtures = [];
    // Two Step Process of Finding what players still need fixtures
    const getCurrentPlayerAndOpponents = (arrayOfPlayersWhoNeedFixtures) => {
      const currentPlayer = arrayOfPlayersWhoNeedFixtures[0];
      const opponentArray = arrayOfPlayersWhoNeedFixtures.filter(player => currentPlayer !== player);
      return { currentPlayer, opponentArray };
    };
    // and then creating those fixtures
    const createFixturesForAPlayer = (player, opponents) => {
      opponents.forEach((opponent) => {
        const fixtureObject = { home: player, away: opponent };
        allFixtures.push(fixtureObject);
      });
      return opponents;
    };

    let currentData = getCurrentPlayerAndOpponents(playerObjectArray);
    let returnedOpponentArray = createFixturesForAPlayer(currentData.currentPlayer, currentData.opponentArray);

    // Loop until no possible fixtures are left, then return the full fixture list
    while (returnedOpponentArray.length > 1) {
      currentData = getCurrentPlayerAndOpponents(returnedOpponentArray);
      returnedOpponentArray = createFixturesForAPlayer(currentData.currentPlayer, currentData.opponentArray);
    }
    return allFixtures;
  };

  const createMatchDays = (fixtures) => {
    let remainingFixtures = fixtures.slice(0);
    const matchesPerMatchday = playerObjectArray.length / 2;
    const matchDays = [];
    const removeFixture = (fixture) => {
      console.log(remainingFixtures);
      remainingFixtures.forEach((remainingFixture, index) => {
        const isMatch = remainingFixture.home === fixture.home && remainingFixture.away === fixture.away;
        if (isMatch) {
          remainingFixtures.splice(index, 1);
          console.log('removed');
        }
      });
    };
    const createMatchDayFixtures = () => {
      const filters = [];
      let matchDay = [];
      const clone = remainingFixtures.slice(0);
      if (matchesPerMatchday === remainingFixtures.length) {
        console.log("this run");
        matchDay = clone;
        remainingFixtures = [];
      } else {
        clone.forEach((fixture) => {
          const hasParticipatedInAFixture = filters.includes(fixture.home.id) || filters.includes(fixture.away.id);
          if (!hasParticipatedInAFixture) {
            console.log(filters);
            matchDay.push(fixture);
            removeFixture(fixture);
            filters.push(fixture.home.id);
            filters.push(fixture.away.id);
          }
        });
      }
      matchDays.push(matchDay);
    };

    while (remainingFixtures.length > 0) {
      console.log(remainingFixtures.length);
      createMatchDayFixtures();
    }
    return matchDays;
  };

  const updateNumberOfPlayers = (amount) => {
    // eslint-disable-next-line prefer-const
    let manipulatedArray = playerObjectArray;
    const desiredLength = playerObjectArray.length + (amount * 2);
    if (amount < 0) { // If less than, splice away the excess.
      manipulatedArray.splice(desiredLength);
    } else {
      for (let i = 0; i < amount * 2; i += 1) {
        manipulatedArray.push(playerFactory('Player', 'Home Stadium'));
      }
    }
    setPlayerObjectArray(manipulatedArray);
  };

  const playerDataForms = [];

  const setPlayerList = () => {
    for (let i = 0; i < playerObjectArray.length; i += 1) {
      playerDataForms.push(<h1>Player {i + 1}</h1>);
    }
  };

  const updatePlayerData = (id, newObject) => {
    const manipulatedArray = playerObjectArray;
    manipulatedArray.forEach((player) => {
      if (player.id === id) {
        player = newObject;
      }
    });
    setPlayerObjectArray(manipulatedArray);
  };

  setPlayerList();

  return (
    <div className="create-league">
      <div className="create-league_player-amount">
        <input
          type="text"
          value={leagueName}
          onChange={e => setLeagueName(e.target.value)}
        />
        <button
          onClick={() => updateNumberOfPlayers(-1)}
          className="create-league_player-amount_button--add"
        >-</button>
        <span
          type="number"
          className="create-league_player-amount_input-name"
        >{playerObjectArray.length}</span>
        <button
          onClick={() => updateNumberOfPlayers(1)}
          className="create-league_player-amount_button--add"
        >+</button>
      </div>
      {
        playerObjectArray.map(player => <CreatePlayerForm player={player} updatePlayerData={updatePlayerData} key={player.id} />)
      }
      <button
        onClick={() => console.log(createMatchDays(createFixtures(playerObjectArray)))}
      >
        Create League
      </button>
    </div>
  );
};

CreateLeagueInterface.propTypes = {
  updateCurrentView: PropTypes.func.isRequired,
};

export default CreateLeagueInterface;
