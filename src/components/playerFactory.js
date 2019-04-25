const generateID = () => Date.now() + Math.random();

const playerFactory = (name, homeStadium) => (
  {
    name,
    homeStadium,
    goalDifference: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    gamesPlayed: 0,
    points: 0,
    id: generateID(),
    wins: 0,
    losses: 0,
    draws: 0,
    form: [],
  }
);


export default playerFactory;
