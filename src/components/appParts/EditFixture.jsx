/* eslint-disable react/prop-types */
import React, { useState } from 'react';

const EditFixture = (props) => {
  const fixture = props.fixture;
  const [isEditing, setIsEditing] = useState(false);
  let homeValue = 0;
  let awayValue = 0;
  if (fixture.result[0] !== null) {
    homeValue = fixture.result[0];
  }
  if (fixture.result[1] !== null) {
    awayValue = fixture.result[1];
  }
  const [homeResult, setHomeResult] = useState(homeValue);
  const [awayResult, setAwayResult] = useState(awayValue);
  // On click Save, update Main data in LeagueInterface.

  const updateMainData = () => {
    if (homeResult === null || awayResult === null) {
      // show some error.
      setHomeResult(null);
      setAwayResult(null);
    } else {
      fixture.result = [homeResult, awayResult];
      props.updateFixtures(fixture);
    }
    setIsEditing(false);
  };

  let infoDocket = <p>{homeResult} - {awayResult}</p>;
  if (homeResult === null || awayResult === null) {
    infoDocket = <p>Fixture not Played</p>;
  }
  return (
    <div>
      <button
        className="button"
        onClick={isEditing ? updateMainData : () => setIsEditing(true)}
      >{isEditing ? 'Save' : 'Edit'}</button>
      <p>{fixture.home.name} vs {fixture.away.name}</p>
      {
        isEditing ?
          <div>
            <input
              onChange={e => setHomeResult(Number(e.target.value))}
              type="number"
              value={homeResult}
            />
            <input
              onChange={e => setAwayResult(Number(e.target.value))}
              type="number"
              value={awayResult}
            />
          </div>
          :
          <div>
            {infoDocket}
          </div>
      }
    </div>
  );
};

export default EditFixture;
