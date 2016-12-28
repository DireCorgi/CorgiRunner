const Difficulty = {
  'hard': {
    birds: true,
    multiplier: 7,
    maxTrees: 3,
    maxObstacles: 10,
  },
  'medium': {
    birds: false,
    multiplier: 3,
    maxTrees: 3,
    maxObstacles: 7,
  },
  'easy': {
    birds: false,
    multiplier: 1,
    maxTrees: 1,
    maxObstacles: 6,
  }
};

module.exports = Difficulty;
