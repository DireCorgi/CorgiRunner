const closeMainMenu = () => {
  const mainMenu = document.getElementsByClassName('main-menu')[0];
  mainMenu.className = 'main-menu close';
};

const openMainMenu = () => {
  const mainMenu = document.getElementsByClassName('main-menu')[0];
  mainMenu.className = 'main-menu';
};


const Menu = {
  setMenuButtons(game) {
    const easyButton = document.getElementById('easy-button');
    const mediumButton = document.getElementById('medium-button');
    const hardButton = document.getElementById('hard-button');
    const aboutButton = document.getElementById('how-to-play-button');
    const closeAboutButton = document.getElementById('close-how-to-play');
    const selectSound = new Audio('./assets/sounds/select.wav');

    const openAbout = (e) => {
      const aboutScreen = document.getElementsByClassName('how-to-play-container')[0];
      if (aboutScreen.className.indexOf('how-to-play-open') !== -1) {
        aboutScreen.className = 'how-to-play-container group';
        playSelectSound();
        game.unpause();
      } else {
        aboutScreen.className += ' how-to-play-open';
        playSelectSound();
        game.pause();
      }
    };

    const playSelectSound = () => {
      selectSound.pause();
      selectSound.currentTime = 0;
      selectSound.play();
    };

    aboutButton.addEventListener('click', openAbout);
    closeAboutButton.addEventListener('click', openAbout);
    hardButton.addEventListener('click', (e) => {
        closeMainMenu();
        playSelectSound();
        setTimeout(()=> game.start('hard'), 200);
      }
    );
    mediumButton.addEventListener('click', (e) => {
        closeMainMenu();
        playSelectSound();
        setTimeout(()=> game.start('medium'), 200);
      }
    ),
    easyButton.addEventListener('click', (e) => {
        closeMainMenu();
        playSelectSound();
        setTimeout(()=> game.start('easy'), 200);
      }
    );
  },
  closeMainMenu: closeMainMenu,
  openMainMenu: openMainMenu,
};

module.exports = Menu;
