/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import playerFactory from './playerFactory';
import CreatePlayerForm from './appParts/CreatePlayerForm';

const CreateLeagueInterface = (props) => {
  const initalObjectArray = [
    playerFactory('Player1', 'Home Stadium'),
    playerFactory('Player2', 'Home Stadium'),
    playerFactory('Player3', 'Home Stadium'),
    playerFactory('Player4', 'Home Stadium'),
  ];
  const [playerObjectArray, setPlayerObjectArray] = useState(initalObjectArray);
  const [leagueName, setLeagueName] = useState('My League');
  const [timesPlayed, setTimesPlayed] = useState(1);
  // Tourmanent type where 0 = League , 1 = Cup
  const [tournamentType, setTournamentType] = useState(0);

  const tournamentTypeNames = [
    'League',
    'Cup',
  ];

  const generateBracket = () => {
    const matchDays = [];
    const matchDay = [];
    const clone = playerObjectArray.slice(0);
    const generateID = () => Date.now() + Math.random();

    while (clone.length > 0) {
      let rand = Math.floor(Math.random() * clone.length);
      const home = clone.splice(rand, 1);
      rand = Math.floor(Math.random() * clone.length);
      const away = clone.splice(rand, 1);
      const fixture = { home: home[0], away: away[0], round: 0, result: [null, null], id: generateID(), cupId: generateID() };
      matchDay.push(fixture);
    }
    matchDays.push(matchDay);
    if (timesPlayed === 2) {
      // Create reverse fixtures.
      matchDays.forEach((matchDayWithin) => {
        const reverseMatchDay = matchDayWithin.map(fixture => (
          {
            home: fixture.away,
            away: fixture.home,
            result: fixture.result,
            id: generateID(),
            cupId: fixture.cupId,
            round: fixture.round,
          }
        ));
        matchDays.push(reverseMatchDay);
      });
    }
    return matchDays;
  };

  const generateSchedule = () => {
    const generateID = () => Date.now() + Math.random();
    const fixturesNeeded = ((playerObjectArray.length / 2) * (playerObjectArray.length - 1));
    const roundsNeeded = fixturesNeeded / (playerObjectArray.length / 2);
    const halfLength = Math.ceil(playerObjectArray.length / 2); // Of the player Array
    // Split the player Array into two
    const leftSide = playerObjectArray.slice(0, halfLength);
    const arraySecondHalf = playerObjectArray.slice(halfLength, playerObjectArray.length);
    arraySecondHalf.reverse();
    const createMatchDay = () => {
      // eslint-disable-next-line max-len
      const matchDay = leftSide.map((player, i) => ({ home: player, away: arraySecondHalf[i], result: [null, null], id: generateID() }));
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
    if (timesPlayed === 2) {
      // Create reverse fixtures.
      matchDays.forEach((matchDay) => {
        const reverseMatchDay = matchDay.map(fixture => (
          {
            home: fixture.away,
            away: fixture.home,
            result: fixture.result,
            id: generateID(),
          }
        ));
        matchDays.push(reverseMatchDay);
      });
    }
    return matchDays;
  };

  const handleLeagueGeneration = () => {
    const fixtures = tournamentType === 0 ? generateSchedule() : generateBracket();
    const leagueData = {
      players: playerObjectArray,
      fixtures,
      leagueTitle: leagueName,
      tournamentType,
    };
    props.updateCurrentView(2, leagueData);
  };

  const updateNumberOfPlayers = (amount, setAmount = false) => {
    // eslint-disable-next-line prefer-const
    let manipulatedArray = playerObjectArray;
    let desiredLength = 0;
    let amountToAdd = 0;
    if (!setAmount && tournamentType === 0) {
      desiredLength = playerObjectArray.length + (amount * 2);
    }
    if (setAmount) {
      desiredLength = amount;
    }
    if (tournamentType === 1 && !setAmount) {
      if (playerObjectArray.length === 4 && amount === 1) {
        desiredLength = 8;
      }
      if (playerObjectArray.length === 8) {
        if (amount === -1) {
          desiredLength = 4;
        } else {
          desiredLength = 16;
        }
      }
      if (playerObjectArray.length === 16) {
        if (amount === -1) {
          desiredLength = 8;
        } else {
          desiredLength = 32;
        }
      }
      if (playerObjectArray.length === 32 && amount === -1) {
        desiredLength = 16;
      }
    }
    if (desiredLength === 0) {
      return;
    }
    if (amount === -1 || setAmount) { // If less than, splice away the excess.
      manipulatedArray.splice(desiredLength);
    } else {
      if (tournamentType === 1) {
        amountToAdd = desiredLength - playerObjectArray.length;
      } else {
        amountToAdd = amount * 2;
      }
      for (let i = 0; i < amountToAdd; i += 1) {
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

  const switchToCupType = () => {
    setTournamentType(1);
    updateNumberOfPlayers(4, true);
  };

  setPlayerList();

  return (
    <div className="create-league">
      <input
        type="text"
        value={leagueName}
        onChange={e => setLeagueName(e.target.value)}
      />
      <div className="tournament-option">
        <button
          disabled={tournamentType === 0}
          onClick={() => setTournamentType(0)}
        >
          {tournamentTypeNames[0]}
        </button>
        <button
          disabled={tournamentType === 1}
          onClick={switchToCupType}
        >
          {tournamentTypeNames[1]}
        </button>
      </div>
      <div className="tournament-option">
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
      <div className="tournament-option">
        <p>{tournamentType === 0 ? 'Times played' : 'Legs per round'}</p>
        <button
          disabled={timesPlayed === 1}
          onClick={() => setTimesPlayed(1)}
        >1</button>
        <button
          disabled={timesPlayed === 2}
          onClick={() => setTimesPlayed(2)}
        >2</button>
      </div>
      {
        // eslint-disable-next-line max-len
        playerObjectArray.map(player => <CreatePlayerForm player={player} updatePlayerData={updatePlayerData} key={player.id} />)
      }
      <button
        onClick={handleLeagueGeneration}
      >
        Create {tournamentTypeNames[tournamentType]}
      </button>
    </div>
  );
};

CreateLeagueInterface.propTypes = {
  updateCurrentView: PropTypes.func.isRequired,
};

export default CreateLeagueInterface;
