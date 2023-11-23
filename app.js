const menuButtons = [...document.querySelectorAll('[aria-controls]')];
const notificationButton = menuButtons.find(
  (menuButton) =>
    menuButton.getAttribute('aria-controls') === 'notification-menu'
);
const collectionsButton = menuButtons.find(
  (menuButton) =>
    menuButton.getAttribute('aria-controls') === 'collections-menu'
);
const trialCalloutDismissBtn = document.querySelector(
  '.trial-callout__dismiss-btn'
);

function closeOtherMenuBtns(currentMenuId) {
  const otherMenuBtns = menuButtons.filter(
    (menuButton) => menuButton.getAttribute('aria-controls') !== currentMenuId
  );
  otherMenuBtns.forEach((menuButton) => {
    const menuId = menuButton.getAttribute('aria-controls');
    const menu = document.getElementById(menuId);
    menuButton.setAttribute('aria-expanded', false);
    menu.setAttribute('aria-hidden', true);
  });
}

function toggleMenu(event) {
  const button = event.currentTarget;
  const menuId = button.getAttribute('aria-controls');
  const menu = document.getElementById(menuId);
  if (button.getAttribute('aria-expanded') === 'false') {
    button.setAttribute('aria-expanded', true);
    menu.setAttribute('aria-hidden', false);
    closeOtherMenuBtns(menuId);
  } else {
    button.setAttribute('aria-expanded', false);
    menu.setAttribute('aria-hidden', true);
  }
}

function closeAllMenus(event) {
  if (
    event.target.closest('[aria-controls]') ||
    event.target.closest('[role="menu"]')
  )
    return;
  menuButtons.forEach((menuButton) => {
    if (menuButton.getAttribute('aria-expanded') === 'true') {
      const menuId = menuButton.getAttribute('aria-controls');
      const menu = document.getElementById(menuId);
      menuButton.setAttribute('aria-expanded', false);
      menu.setAttribute('aria-hidden', true);
    }
  });
}

function dismissTrialCallout(event) {
  const btn = event.currentTarget;
  const trialCallout = btn.closest('.trial-callout');
  trialCallout.remove();
}

notificationButton.addEventListener('click', toggleMenu);
collectionsButton.addEventListener('click', toggleMenu);
document.addEventListener('click', closeAllMenus);
trialCalloutDismissBtn.addEventListener('click', dismissTrialCallout);
