const oneThirds = 100 / 3
const twoThirds = (100 / 3) * 2
const oneQuarters = 100 / 4
// const threeQuarters = (100 / 4) * 3
const oneFifths = 100 / 5
const threeFifths = (100 / 5) * 3
const fourFifths = (100 / 5) * 4

const irregularTwoPanel = [
  { width: 50, height: 100, marginType: 1, col: 2 },
  { width: 50, height: 100, marginType: 0, col: 2 }
]
const irregularThreePanel = [
  { width: 100, height: twoThirds, marginType: 2, row: 2 },
  { width: 50, height: oneThirds, marginType: 1, row: 2, col: 2 },
  { width: 50, height: oneThirds, marginType: 0, row: 2, col: 2 }
]
const irregularFivesPanel = [
  { width: 100, height: twoThirds, marginType: 2, row: 2 },
  { width: 100 / 4, height: oneThirds, marginType: 1, row: 2, col: 4 },
  { width: 100 / 4, height: oneThirds, marginType: 1, row: 2, col: 4 },
  { width: 100 / 4, height: oneThirds, marginType: 1, row: 2, col: 4 },
  { width: 100 / 4, height: oneThirds, marginType: 0, row: 2, col: 4 }
]
const irregularSixPanel = [
  { width: twoThirds, height: twoThirds, marginType: 3, row: 2, col: 2 },
  { width: oneThirds, height: oneThirds, marginType: 2, row: 3, col: 2 },
  { width: oneThirds, height: oneThirds, marginType: 2, row: 3, col: 2 },
  { width: oneThirds, height: oneThirds, marginType: 1, row: 2, col: 3 },
  { width: oneThirds, height: oneThirds, marginType: 1, row: 2, col: 3 },
  { width: oneThirds, height: oneThirds, marginType: 0, row: 3, col: 3 }
]
const irregularSevenPanel = [
  { width: 50, height: twoThirds, marginType: 3, row: 2, col: 2 },
  { width: 50, height: twoThirds, marginType: 2, row: 2, col: 2 },
  { width: 100 / 5, height: oneThirds, marginType: 1, row: 2, col: 5 },
  { width: 100 / 5, height: oneThirds, marginType: 1, row: 2, col: 5 },
  { width: 100 / 5, height: oneThirds, marginType: 1, row: 2, col: 5 },
  { width: 100 / 5, height: oneThirds, marginType: 1, row: 2, col: 5 },
  { width: 100 / 5, height: oneThirds, marginType: 0, row: 2, col: 5 }
]
const irregularEightPanel = [
  { width: 50, height: twoThirds, marginType: 3, row: 2, col: 3 },
  { width: oneQuarters, height: oneThirds, marginType: 3, row: 3, col: 3 },
  { width: oneQuarters, height: oneThirds, marginType: 2, row: 3, col: 3 },
  { width: oneQuarters, height: oneThirds, marginType: 3, row: 3, col: 3 },
  { width: oneQuarters, height: oneThirds, marginType: 2, row: 3, col: 3 },
  { width: oneThirds, height: oneThirds, marginType: 1, row: 2, col: 3 },
  { width: oneThirds, height: oneThirds, marginType: 1, row: 2, col: 3 },
  { width: oneThirds, height: oneThirds, marginType: 0, row: 2, col: 3 }
]
const irregularTenPanel = [
  { width: fourFifths, height: fourFifths, marginType: 3, row: 2, col: 2 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 8, col: 2 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 8, col: 2 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 8, col: 2 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 8, col: 2 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 2, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 2, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 2, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 2, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 0, row: 2, col: 2 }
]
const irregularElevenPanel = [
  { width: threeFifths, height: 100, marginType: 1, row: 1, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 5, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 0, row: 5, col: 3 }
]
const irregularTwelvePanel = [
  { width: 50, height: threeFifths, marginType: 3, row: 3, col: 2 },
  { width: 50, height: threeFifths, marginType: 2, row: 3, col: 2 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 0, row: 3, col: 5 }
]
const irregularThirteenPanel = [
  { width: oneThirds, height: threeFifths, marginType: 3, row: 3, col: 3 },
  { width: oneThirds, height: threeFifths, marginType: 3, row: 3, col: 3 },
  { width: oneThirds, height: threeFifths, marginType: 2, row: 3, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 0, row: 3, col: 5 }
]
const irregularFourteenPanel = [
  { width: oneFifths * 2, height: threeFifths, marginType: 3, row: 3, col: 3 },
  { width: oneFifths * 2, height: threeFifths, marginType: 3, row: 3, col: 3 },
  { width: oneFifths, height: threeFifths / 2, marginType: 2, row: 6, col: 3 },
  { width: oneFifths, height: threeFifths / 2, marginType: 2, row: 6, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 5 },

  { width: oneFifths, height: oneFifths, marginType: 1, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 0, row: 5, col: 5 }
]
const irregularFifteenPanel = [
  {
    width: threeFifths,
    height: oneQuarters * 2,
    marginType: 3,
    row: 3,
    col: 3
  },
  { width: oneFifths, height: oneQuarters, marginType: 3, row: 5, col: 3 },
  { width: oneFifths, height: oneQuarters, marginType: 2, row: 5, col: 3 },
  { width: oneFifths, height: oneQuarters, marginType: 3, row: 5, col: 3 },
  { width: oneFifths, height: oneQuarters, marginType: 2, row: 5, col: 3 },

  { width: oneFifths, height: oneQuarters, marginType: 3, row: 3, col: 9 },
  { width: oneFifths, height: oneQuarters, marginType: 3, row: 3, col: 9 },
  { width: oneFifths, height: oneQuarters, marginType: 3, row: 3, col: 9 },
  { width: oneFifths, height: oneQuarters, marginType: 3, row: 3, col: 3 },
  { width: oneFifths, height: oneQuarters, marginType: 2, row: 3, col: 3 },

  { width: oneFifths, height: oneQuarters, marginType: 1, row: 3, col: 9 },
  { width: oneFifths, height: oneQuarters, marginType: 1, row: 3, col: 9 },
  { width: oneFifths, height: oneQuarters, marginType: 1, row: 4, col: 9 },
  { width: oneFifths, height: oneQuarters, marginType: 1, row: 4, col: 3 },
  { width: oneFifths, height: oneQuarters, marginType: 0, row: 4, col: 3 }
]
const irregularSeventeenPanel = [
  { width: threeFifths, height: threeFifths, marginType: 3, row: 3, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 8, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 8, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 8, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 8, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 8, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 8, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 9 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 9 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 9 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 3, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 3, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 1, row: 3, col: 9 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 3, col: 9 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 9 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 0, row: 4, col: 3 }
]
const irregularEighteenPanel = [
  { width: fourFifths, height: oneFifths * 2, marginType: 3, row: 4, col: 2 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 8, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 8, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 4, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 4, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 0, row: 5, col: 3 }
]
const irregularNineteenPanel = [
  {
    width: oneFifths * 2,
    height: oneFifths * 2,
    marginType: 3,
    row: 3,
    col: 3
  },
  {
    width: oneFifths * 2,
    height: oneFifths * 2,
    marginType: 3,
    row: 3,
    col: 3
  },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 4, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 4, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 0, row: 5, col: 3 }
]
const irregularTwentyPanel = [
  { width: threeFifths, height: oneFifths * 2, marginType: 3, row: 3, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 3 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 4, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 4, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 0, row: 5, col: 3 }
]
const irregularTwentyOnePanel = [
  {
    width: oneFifths * 2,
    height: oneFifths * 2,
    marginType: 3,
    row: 3,
    col: 4
  },
  { width: oneFifths, height: oneFifths * 2, marginType: 3, row: 3, col: 4 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 4 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 4 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 6, col: 4 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 6, col: 4 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 6, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 6, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 6, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 6, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 6, col: 5 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 6, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 6, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 6, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 6, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 6, col: 5 },

  { width: oneFifths, height: oneFifths, marginType: 1, row: 6, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 6, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 6, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 6, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 0, row: 6, col: 5 }
]
const irregularTwentyTwoPanel = [
  {
    width: oneFifths * 2,
    height: oneFifths * 2,
    marginType: 3,
    row: 3,
    col: 4
  },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 4 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 4 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 4 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 4 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 4 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 4 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 4, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 4, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 0, row: 5, col: 3 }
]
const irregularTwentyThreePanel = [
  { width: oneFifths, height: oneFifths * 3, marginType: 3, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 5 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 4, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 4, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 0, row: 5, col: 3 }
]
const irregularTwentyFourPanel = [
  { width: oneFifths, height: oneFifths * 2, marginType: 3, row: 3, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 5, col: 5 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 5, col: 5 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 4, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 3, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 2, row: 4, col: 3 },

  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 1, row: 4, col: 8 },
  { width: oneFifths, height: oneFifths, marginType: 0, row: 5, col: 3 }
]

export function irregularPanelInfo(length) {
  if (length === 2) return irregularTwoPanel
  else if (length === 3) return irregularThreePanel
  else if (length === 5) return irregularFivesPanel
  else if (length === 6) return irregularSixPanel
  else if (length === 7) return irregularSevenPanel
  else if (length === 8) return irregularEightPanel
  else if (length === 10) return irregularTenPanel
  else if (length === 11) return irregularElevenPanel
  else if (length === 12) return irregularTwelvePanel
  else if (length === 13) return irregularThirteenPanel
  else if (length === 14) return irregularFourteenPanel
  else if (length === 15) return irregularFifteenPanel
  else if (length === 17) return irregularSeventeenPanel
  else if (length === 18) return irregularEighteenPanel
  else if (length === 19) return irregularNineteenPanel
  else if (length === 20) return irregularTwentyPanel
  else if (length === 21) return irregularTwentyOnePanel
  else if (length === 22) return irregularTwentyTwoPanel
  else if (length === 23) return irregularTwentyThreePanel
  else if (length === 24) return irregularTwentyFourPanel
  else return []
}
