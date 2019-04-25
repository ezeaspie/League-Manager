import React, { useState } from 'react';

const EditFixture = (props) => {
  const fixture = props.fixture;
  const [isEditing, setIsEditing] = useState(false);
  const [homeResult, setHomeResult] = useState(fixture.result[0]);
  const [awayResult, setAwayResult] = useState(fixture.result[1]);
  // On click Save, update Main data in LeagueInterface.

  const updateMainData = () => {
    if (!homeResult || !awayResult) {
      // show some error.
      setHomeResult(false);
      setAwayResult(false);
    } else {
      fixture.result = [homeResult, awayResult];
      props.updateFixtures(fixture);
    }
    setIsEditing(false);
  };

  let infoDocket = <p>{homeResult} - {awayResult}</p>;
  if (!homeResult || !awayResult) {
    infoDocket = <p>Fixture not Played</p>;
  }
  return (
    <div>
      <button onClick={isEditing ? updateMainData : () => setIsEditing(true)}>{isEditing ? "Save" : "Edit"}</button>
      <p>{fixture.home.name} vs {fixture.away.name}</p>
      {
        isEditing ?
          <div>
            <input onChange={e => setHomeResult(Number(e.target.value))} type="number" value={homeResult} />
            <input onChange={e => setAwayResult(Number(e.target.value))} type="number" value={awayResult} />
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
