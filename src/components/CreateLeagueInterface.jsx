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
  const [leagueName, setLeagueName] = useState("My League");

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
    let manipulatedArray = playerObjectArray;
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
        onClick={() => console.log(playerObjectArray)}
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
