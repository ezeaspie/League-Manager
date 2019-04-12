const generateID = () => Date.now() + Math.random();

const playerFactory = (name, homeStadium) => (
  {
    name,
    homeStadium,
    fixtures: [],
    results: [],
    goalDifference: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    id: generateID(),
  }
);


export default playerFactory;
