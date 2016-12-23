const closeMainMenu = () => {
  const mainMenu = document.getElementsByClassName('main-menu')[0];
  mainMenu.className = 'main-menu close';
};

const openMainMenu = () => {
  const mainMenu = document.getElementsByClassName('main-menu')[0];
  mainMenu.className = 'main-menu';
};

const openAbout = (e) => {
  const aboutScreen = document.getElementsByClassName('how-to-play-container')[0];
  if (aboutScreen.className.indexOf('how-to-play-open') !== -1) {
    aboutScreen.className = 'how-to-play-container group';
    game.unpause();
  } else {
    aboutScreen.className += ' how-to-play-open';
    game.pause();
  }
};

const Menu = {
  setMenuButtons(game) {
    const easyButton = document.getElementById('easy-button');
    const mediumButton = document.getElementById('medium-button');
    const hardButton = document.getElementById('hard-button');
    const aboutButton = document.getElementById('how-to-play-button');
    const closeAboutButton = document.getElementById('close-how-to-play');

    aboutButton.addEventListener('click', openAbout);
    closeAboutButton.addEventListener('click', openAbout);
    hardButton.addEventListener('click', (e) => {
        closeMainMenu();
        game.start('hard');
      }
    );
    mediumButton.addEventListener('click', (e) => {
        closeMainMenu();
        game.start('medium');
      }
    ),
    easyButton.addEventListener('click', (e) => {
        closeMainMenu();
        game.start('easy');
      }
    )
  },
  closeMainMenu: closeMainMenu,
  openMainMenu: openMainMenu,
  openAbout: openAbout,
};

module.exports = Menu;
