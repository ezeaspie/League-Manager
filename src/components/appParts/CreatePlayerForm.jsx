import React from 'react';
import PropTypes from 'prop-types';

const CreatePlayerForm = (props) => {
  const player = props.player;

  const handleNameChange = (newValue) => {
    const newPlayerObject = player;
    newPlayerObject.name = newValue;
    props.updatePlayerData(player.id, newPlayerObject);
  };

  const handleStadiumChange = (newValue) => {
    const newPlayerObject = player;
    newPlayerObject.homeStadium = newValue;
    props.updatePlayerData(player.id, newPlayerObject);
  };

  return (
    <div className="player-form">
      <div className="section">
        <h4>Name:</h4>
        <input
          type="text"
          value={player.name}
          onChange={e => handleNameChange(e.target.value)}
        />
      </div>
      <div className="section">
        <h4>Home Venue:</h4>
        <input
          type="text"
          value={player.homeStadium}
          onChange={e => handleStadiumChange(e.target.value)}
        />
      </div>
    </div>
  );
};

CreatePlayerForm.propTypes = {
  player: PropTypes.shape({
    name: PropTypes.string,
    homeStadium: PropTypes.string,
    fixtures: PropTypes.array,
    results: PropTypes.array,
    goalDifference: PropTypes.number,
    goalsFor: PropTypes.number,
    goalsAgainst: PropTypes.number,
    gamesPlayed: PropTypes.number,
    wins: PropTypes.number,
    losses: PropTypes.number,
    draws: PropTypes.number,
    form: PropTypes.array,
  }).isRequired,
  updatePlayerData: PropTypes.func.isRequired,
};

export default CreatePlayerForm;
