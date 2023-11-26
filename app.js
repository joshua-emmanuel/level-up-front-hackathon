const menuButtons = [...document.querySelectorAll('[aria-haspopup]')];
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
const setupStepsAccordionBtn = document.querySelector(
  '[aria-controls="setup-guide__steps"]'
);
const setupGuideSteps = document.querySelector('.setup-guide__steps');
const progressBar = document.querySelector('.progress-bar');
const numOfCompletedGuides = document.querySelector('.no-of-completed-guide');
const allSetupGuideAccordionCheckbox = [
  ...document.querySelectorAll('.setup-guide__checkbox'),
];

function closeOtherMenus(currentMenuId) {
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

function handleMenuEscapeKeypress(event) {
  const menu = event.currentTarget;
  const menuId = menu.id;
  const menuButton = document.querySelector(`[aria-controls="${menuId}"]`);
  const keyPressed = event.key;
  if (keyPressed === 'Escape') {
    closeMenu(menu, menuButton);
  }
}

function handleMenuItemArrowKeypress(event, menuItemIndex, allMenuItems) {
  const keyPressed = event.key;
  const isFirstMenuItem = menuItemIndex === 0;
  const isLastMenuItem = menuItemIndex === allMenuItems.length - 1;
  const firstMenuItem = allMenuItems[0];
  const lastMenuItem = allMenuItems[allMenuItems.length - 1];
  const previousMenuItem = allMenuItems[menuItemIndex - 1];
  const nextMenuItem = allMenuItems[menuItemIndex + 1];

  if (keyPressed === 'ArrowDown' || keyPressed === 'ArrowRight') {
    if (isLastMenuItem) {
      firstMenuItem.focus();
      return;
    }
    nextMenuItem.focus();
  }

  if (keyPressed === 'ArrowUp' || keyPressed === 'ArrowLeft') {
    if (isFirstMenuItem) {
      lastMenuItem.focus();
      return;
    }
    previousMenuItem.focus();
  }
}

function openMenu(menu, menuButton) {
  menu.setAttribute('aria-hidden', false);
  menuButton.setAttribute('aria-expanded', true);

  menu.addEventListener('keydown', handleMenuEscapeKeypress);

  const allMenuItems = menu.querySelectorAll('[role="menuitem"]');
  if (allMenuItems.length === 0) {
    const firstButtonInMenu = menu.querySelector('button');
    firstButtonInMenu.focus();
    return;
  }
  allMenuItems[0].focus();

  allMenuItems.forEach((menuItem, menuItemIndex, allMenuItems) => {
    menuItem.addEventListener('keydown', (event) =>
      handleMenuItemArrowKeypress(event, menuItemIndex, allMenuItems)
    );
  });
}

function closeMenu(menu, menuButton) {
  menu.setAttribute('aria-hidden', true);
  menuButton.setAttribute('aria-expanded', false);
  menuButton.focus();
}

function toggleMenu(event) {
  const menuButton = event.currentTarget;
  const menuId = menuButton.getAttribute('aria-controls');
  const menu = document.getElementById(menuId);
  const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
  if (isExpanded) {
    closeMenu(menu, menuButton);
  } else {
    openMenu(menu, menuButton);
    closeOtherMenus(menuId);
  }
}

function closeAllMenus(event) {
  if (
    event.target.closest('[aria-controls]') ||
    event.target.closest('[role="menu"]') ||
    event.target.closest('[role="alert"]')
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

function openAccordion(accordionButton, accordionContent) {
  accordionContent.setAttribute('aria-hidden', 'false');
  accordionButton.setAttribute('aria-expanded', 'true');
}

function closeAccordion(accordionButton, accordionContent) {
  accordionContent.setAttribute('aria-hidden', 'true');
  accordionButton.setAttribute('aria-expanded', 'false');
}

function toggleAccordion(accordionButton, accordionContent) {
  if (accordionContent.getAttribute('aria-hidden') === 'true') {
    openAccordion(accordionButton, accordionContent);
  } else {
    closeAccordion(accordionButton, accordionContent);
  }
}

function toggleSetupStepsAccordion(event) {
  const accordionButton = event.currentTarget;
  const accordionContentId = accordionButton.getAttribute('aria-controls');
  const accordionContent = document.getElementById(accordionContentId);
  toggleAccordion(accordionButton, accordionContent);
}

function closeAllSetupGuideStepsAccordions() {
  const allSetupGuideAccordionBtns = [
    ...setupGuideSteps.querySelectorAll('button[aria-controls]'),
  ];
  allSetupGuideAccordionBtns.forEach((accBtn) => {
    const accContentId = accBtn.getAttribute('aria-controls');
    const accContent = document.getElementById(accContentId);
    closeAccordion(accBtn, accContent);
  });
}

function toggleSetupGuideStepsAccordion(event) {
  const accordionButton = event.target.closest('button[aria-controls]');
  if (!accordionButton) return;
  const accordionContentId = accordionButton.getAttribute('aria-controls');
  const accordionContent = document.getElementById(accordionContentId);
  closeAllSetupGuideStepsAccordions();
  openAccordion(accordionButton, accordionContent);
}

function openNextSetupGuideStepsAccordion(event) {
  const setupGuideCheckbox = event.target.closest('.setup-guide__checkbox');
  if (!setupGuideCheckbox) return;

  const checkboxIsChecked = setupGuideCheckbox.checked;
  if (!checkboxIsChecked) return;

  const currentAccordion = setupGuideCheckbox.closest('.setup-guide__step');
  const currentAccordionLabel =
    currentAccordion.getAttribute('aria-labelledby');

  const allAccordions = [
    ...setupGuideSteps.querySelectorAll('.setup-guide__step'),
  ];

  // Find the index of the current accordion
  const currentIndex = allAccordions.findIndex((accordion) => {
    return accordion.getAttribute('aria-labelledby') === currentAccordionLabel;
  });

  // Get next accordions after the current one
  const nextAccordions = allAccordions.slice(currentIndex + 1);

  // If no incomplete step is found after the current step, check previous accordions
  let accordionToBeOpened = nextAccordions.find((accordion) => {
    const accordionCheckbox = accordion.querySelector('.setup-guide__checkbox');
    return !accordionCheckbox.checked;
  });

  // If no incomplete step is found, check previous accordions
  if (!accordionToBeOpened) {
    accordionToBeOpened = allAccordions.find((accordion) => {
      const accordionCheckbox = accordion.querySelector(
        '.setup-guide__checkbox'
      );
      return !accordionCheckbox.checked;
    });
  }

  if (!accordionToBeOpened) return;

  const accordionToBeOpenedButton = accordionToBeOpened.querySelector(
    'button[aria-controls]'
  );
  const accordionToBeOpenedContentId =
    accordionToBeOpenedButton.getAttribute('aria-controls');
  const accordionToBeOpenedContent = document.getElementById(
    accordionToBeOpenedContentId
  );

  const accordionToBeOpenedCheckBox = accordionToBeOpened.querySelector(
    '.setup-guide__checkbox'
  );

  closeAllSetupGuideStepsAccordions();
  openAccordion(accordionToBeOpenedButton, accordionToBeOpenedContent);
  accordionToBeOpenedCheckBox.focus();
}

function updateProgressBar(event) {
  if (!event.target.closest('.setup-guide__checkbox')) return;
  const checkedCheckboxes = allSetupGuideAccordionCheckbox.filter(
    (checkbox) => checkbox.checked
  );
  const numofCheckedCheckboxes = checkedCheckboxes.length;
  const percentageOfCheckedCheckboxes =
    (numofCheckedCheckboxes / allSetupGuideAccordionCheckbox.length) * 100;
  progressBar.style.width = `${percentageOfCheckedCheckboxes}%`;
  numOfCompletedGuides.textContent = numofCheckedCheckboxes;
}

function handleCheckboxEnterKeyPress(event) {
  const checkbox = event.currentTarget;
  const keyPressed = event.key;
  if (keyPressed === 'Enter') checkbox.click();
}

notificationButton.addEventListener('click', toggleMenu);
collectionsButton.addEventListener('click', toggleMenu);
document.addEventListener('click', closeAllMenus);
trialCalloutDismissBtn.addEventListener('click', dismissTrialCallout);
setupStepsAccordionBtn.addEventListener('click', toggleSetupStepsAccordion);
setupGuideSteps.addEventListener('click', toggleSetupGuideStepsAccordion);
setupGuideSteps.addEventListener('click', openNextSetupGuideStepsAccordion);
setupGuideSteps.addEventListener('click', updateProgressBar);
allSetupGuideAccordionCheckbox.forEach((checkbox) => {
  checkbox.addEventListener('keydown', handleCheckboxEnterKeyPress);
});
