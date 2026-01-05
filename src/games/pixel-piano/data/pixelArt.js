// Pixel art patterns for the game - More colorful designs!

export const PIXEL_ART = {
  // Colorful flower
  flower: {
    width: 11, height: 11, difficulty: 'Easy',
    pixels: [
      '    RRR    ',
      '   RPYPR   ',
      '  RPYYYPR  ',
      ' RPYYOYYPR ',
      'RPYYYOYYYRR',
      ' RPYYOYYPR ',
      '  RPYYYPR  ',
      '   RPYPR   ',
      '    GGG    ',
      '    GGG    ',
      '   GGGGG   ',
    ],
    colorMap: { 'R': 'red4', 'P': 'pink4', 'Y': 'yellow3', 'O': 'orange3', 'G': 'green3' }
  },

  // Rainbow fish
  fish: {
    width: 14, height: 9, difficulty: 'Medium',
    pixels: [
      '    BBBB      ',
      '  BBBCCCBB    ',
      ' BCCCYYYYCB PP',
      'BCYYOOOOYCBPPP',
      'BCOORRROYCBPPP',
      'BCYYOOOOYCBPPP',
      ' BCCCYYYYCB PP',
      '  BBBCCCBB    ',
      '    BBBB      ',
    ],
    colorMap: { 'B': 'blue3', 'C': 'blue5', 'Y': 'yellow3', 'O': 'orange3', 'R': 'red4', 'P': 'purple4' }
  },

  // Colorful parrot
  parrot: {
    width: 12, height: 14, difficulty: 'Medium',
    pixels: [
      '    RRRR    ',
      '   RRRRRR   ',
      '  RRWWRRRR  ',
      '  RWBWRRRRR ',
      '  RRRRYYRR  ',
      '   RRYYY    ',
      '   GGGYYY   ',
      '  GGGGGYYY  ',
      '  GGGGGYY   ',
      ' BBBGGGG    ',
      ' BBBBBGG    ',
      '  BBBBB     ',
      '   OO OO    ',
      '   OO OO    ',
    ],
    colorMap: { 'R': 'red4', 'W': 'white', 'B': 'blue4', 'Y': 'yellow3', 'G': 'green4', 'O': 'orange3' }
  },

  // Ice cream cone
  icecream: {
    width: 9, height: 13, difficulty: 'Easy',
    pixels: [
      '   PPP   ',
      '  PPPPP  ',
      ' PPPPPPP ',
      ' BBBBBBB ',
      '  BBBBB  ',
      ' YYYYYYY ',
      '  YYYYY  ',
      '  OOOOO  ',
      '   OOO   ',
      '   OOO   ',
      '    O    ',
      '    O    ',
      '    O    ',
    ],
    colorMap: { 'P': 'pink4', 'B': 'blue4', 'Y': 'yellow3', 'O': 'orange4' }
  },

  // Colorful butterfly
  butterfly: {
    width: 13, height: 11, difficulty: 'Medium',
    pixels: [
      ' PP     PP ',
      'PPPP   PPPP',
      'PRRRP PRRRP',
      'PRYRP PRYRP',
      'PRRRPPPRRRP',
      ' PPPPBPPPP ',
      'BGGGPBPGGGB',
      'BGYGYBYGYBB',
      'BGGGP PGGGB',
      ' BBB   BBB ',
      '           ',
    ],
    colorMap: { 'P': 'purple4', 'R': 'red4', 'Y': 'yellow3', 'B': 'blue4', 'G': 'green4' }
  },

  // Pizza slice
  pizza: {
    width: 11, height: 12, difficulty: 'Easy',
    pixels: [
      '    YYY    ',
      '   YYYYY   ',
      '  YYRYYRY  ',
      '  YYYYYYY  ',
      ' YYYGYYGYY ',
      ' YYRYYYYRY ',
      'YYYYYGYYYYY',
      'YYRYYYYYRYY',
      ' YYYYYYYYY ',
      '  OOOOOOO  ',
      '   OOOOO   ',
      '    OOO    ',
    ],
    colorMap: { 'Y': 'yellow3', 'R': 'red4', 'G': 'green4', 'O': 'orange4' }
  },

  // Spaceship
  rocket: {
    width: 9, height: 14, difficulty: 'Medium',
    pixels: [
      '    W    ',
      '   WWW   ',
      '   WWW   ',
      '  BWWWB  ',
      '  BWRWB  ',
      '  BWRWB  ',
      '  BWWWB  ',
      '  BBBBB  ',
      ' GBBBBBY ',
      ' GBBBBBY ',
      'GGBBBBBGG',
      '  RRORR  ',
      '  RO OR  ',
      '  O   O  ',
    ],
    colorMap: { 'W': 'white', 'B': 'blue4', 'R': 'red4', 'G': 'gray5', 'Y': 'yellow3', 'O': 'orange3' }
  },

  // Rainbow cake
  cake: {
    width: 13, height: 11, difficulty: 'Hard',
    pixels: [
      '    YYYYY    ',
      '   YYYYYYY   ',
      '  WRWRWRWRW  ',
      ' PPPPPPPPPPP ',
      ' OOOOOOOOOOO ',
      ' YYYYYYYYYYY ',
      ' GGGGGGGGGGG ',
      ' BBBBBBBBBBB ',
      ' PPPPPPPPPPP ',
      '  WWWWWWWWW  ',
      '  WWWWWWWWW  ',
    ],
    colorMap: { 'Y': 'yellow3', 'W': 'white', 'R': 'red4', 'P': 'pink4', 'O': 'orange3', 'G': 'green4', 'B': 'blue4' }
  },

  // Cute robot
  robot: {
    width: 11, height: 13, difficulty: 'Medium',
    pixels: [
      '    YYY    ',
      '   GGGGG   ',
      '  GGGGGGG  ',
      '  GBWGWBG  ',
      '  GGGRGGG  ',
      '  GGGGGGG  ',
      '   GGGGG   ',
      '  BBBBBBB  ',
      ' BGBBBBBGB ',
      ' BBBBYBBBB ',
      ' BGBBBBBGB ',
      '   BB BB   ',
      '   GG GG   ',
    ],
    colorMap: { 'Y': 'yellow3', 'G': 'gray5', 'B': 'blue4', 'W': 'white', 'R': 'red4' }
  },

  // Sunset scene
  sunset: {
    width: 14, height: 10, difficulty: 'Hard',
    pixels: [
      'YYYYYYYYYYYYYY',
      'YYYYYOOYYYYYY',
      'YYYYOOOOYYYYY',
      'OOOOOOOOOOOOO',
      'ORRRRRRRRRRRO',
      'RRRRRRRRRRRRO',
      'PPPPPPPPPPRRR',
      'BBBPPPPPPPPPP',
      'BBBBBBBBBBBBB',
      'BBBBBBBBBBBBB',
    ],
    colorMap: { 'Y': 'yellow3', 'O': 'orange3', 'R': 'red4', 'P': 'purple4', 'B': 'blue3' }
  },

  // Colorful heart (upgraded)
  heart: {
    width: 12, height: 11, difficulty: 'Easy',
    pixels: [
      '  RR    PP  ',
      ' RRRR  PPPP ',
      'RRRROOPPPPPP',
      'RRROOOOOPPPP',
      'RROOYYYYOOPP',
      ' ROYYYYYYOP ',
      ' ROYYYYYYOP ',
      '  ROYYYYOP  ',
      '   ROYYOP   ',
      '    ROOP    ',
      '     OP     ',
    ],
    colorMap: { 'R': 'red4', 'P': 'pink4', 'O': 'orange3', 'Y': 'yellow3' }
  },

  // Star with rainbow
  star: {
    width: 13, height: 12, difficulty: 'Medium',
    pixels: [
      '      Y      ',
      '     YYY     ',
      '     YOY     ',
      '    YYOYY    ',
      'RRRRROOORRRRR',
      ' RRRROOOORRR ',
      '  PPOOOOPP   ',
      '  PPOOOOPPP  ',
      ' BBBBOOBBBB  ',
      ' BBB     BBB ',
      'GGG       GGG',
      'GG         GG',
    ],
    colorMap: { 'Y': 'yellow3', 'O': 'orange3', 'R': 'red4', 'P': 'purple4', 'B': 'blue4', 'G': 'green4' }
  },

  // Treasure chest
  treasure: {
    width: 12, height: 10, difficulty: 'Medium',
    pixels: [
      '  BBBBBBBB  ',
      ' BYBYBYBYBY ',
      ' BBBBBBBBBB ',
      'BOOOOOOOOOOB',
      'BOYYYYYYYYOB',
      'BOYYYGYYOYOB',
      'BOYYYYYYYYOB',
      'BOOOOOOOOOOB',
      ' BBBBBBBBBB ',
      '  BBBBBBBB  ',
    ],
    colorMap: { 'B': 'brown4', 'Y': 'yellow2', 'O': 'orange4', 'G': 'green4' }
  },

  // Cute alien
  alien: {
    width: 11, height: 12, difficulty: 'Easy',
    pixels: [
      '   GGGGG   ',
      '  GGGGGGG  ',
      ' GGGGGGGGG ',
      ' GBWGGGWBG ',
      ' GBBGGGBBG ',
      ' GGGGGGGGG ',
      '  GGGPGGG  ',
      '  GPPPPPG  ',
      '   GGGGG   ',
      '  PG   GP  ',
      '  PG   GP  ',
      '  PP   PP  ',
    ],
    colorMap: { 'G': 'green4', 'B': 'blue4', 'W': 'white', 'P': 'purple4' }
  },
};

export const LEVELS = Object.keys(PIXEL_ART);
