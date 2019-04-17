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

  const generateSchedule = () => {
    const fixturesNeeded = ((playerObjectArray.length / 2) * (playerObjectArray.length - 1));
    const roundsNeeded = fixturesNeeded / (playerObjectArray.length / 2);
    const halfLength = Math.ceil(playerObjectArray.length / 2); // Of the player Array
    // Split the player Array into two
    const leftSide = playerObjectArray.slice(0, halfLength);
    const arraySecondHalf = playerObjectArray.slice(halfLength, playerObjectArray.length);
    arraySecondHalf.reverse();
    const createMatchDay = () => {
      const matchDay = leftSide.map((player, i) => ({ home: player, away: arraySecondHalf[i] }));
      return matchDay;
    };
    // Rotate the array Round Robin style to get unique fixtures.
    const rotateArrays = () => {
      const anchor = leftSide.shift();
      const array2FirstIndex = arraySecondHalf.splice(0, 1);
      leftSide.unshift(array2FirstIndex[0]);
      const array1FinalIndex = leftSide.pop();
      leftSide.unshift(anchor);
      arraySecondHalf.push(array1FinalIndex);
    };

    let counter = 0;
    const matchDays = [];
    while (counter < roundsNeeded) {
      matchDays.push(createMatchDay());
      rotateArrays();
      counter += 1;
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
        // eslint-disable-next-line max-len
        playerObjectArray.map(player => <CreatePlayerForm player={player} updatePlayerData={updatePlayerData} key={player.id} />)
      }
      <button
        onClick={() => generateSchedule()}
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
