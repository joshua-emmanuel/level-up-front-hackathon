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
  ...setupGuideSteps.querySelectorAll('.setup-guide__step-checkbox'),
];
const HIDDEN_CLASS = 'hidden';
const TIMEOUT_DELAY = 1500;

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
    if (!firstButtonInMenu) return;
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

function closeAllSetupGuidesAccordions() {
  const allSetupGuideAccordionBtns = [
    ...setupGuideSteps.querySelectorAll('button[aria-controls]'),
  ];
  allSetupGuideAccordionBtns.forEach((accBtn) => {
    const accContentId = accBtn.getAttribute('aria-controls');
    const accContent = document.getElementById(accContentId);
    closeSetupGuideStepAccordion(accBtn, accContent);
  });
}

function openSetupGuideStepAccordion(accordionButton, accordionContent) {
  const accordionInner = accordionContent.children[0];
  const accordionContentHeight = accordionInner.getBoundingClientRect().height;
  accordionContent.style.height = `${accordionContentHeight}px`;
  openAccordion(accordionButton, accordionContent);
}

function closeSetupGuideStepAccordion(accordionButton, accordionContent) {
  closeAccordion(accordionButton, accordionContent);
  accordionContent.style.height = 0;
}

function toggleSetupGuideAccordion(accordionButton, accordionContent) {
  if (accordionContent.getAttribute('aria-hidden') === 'true') {
    openSetupGuideStepAccordion(accordionButton, accordionContent);
  } else {
    closeSetupGuideStepAccordion(accordionButton, accordionContent);
  }
}

function toggleSetupGuidesAccordion(event) {
  const accordionButton = event.target.closest('button[aria-controls]');
  if (!accordionButton) return;
  const accordionContentId = accordionButton.getAttribute('aria-controls');
  const accordionContent = document.getElementById(accordionContentId);
  closeAllSetupGuidesAccordions();
  toggleSetupGuideAccordion(accordionButton, accordionContent);
}

function markCheckboxAsDone(checkbox) {
  const notCompletedIcon = checkbox.querySelector('.not-completed-icon');
  const completedIcon = checkbox.querySelector('.completed-icon');
  const loadingSpinnerIcon = checkbox.querySelector('.loading-spinner-icon');

  const checkboxStatus = checkbox.parentElement.querySelector(
    '.setup-guide__step-checkbox-status'
  );
  checkboxStatus.ariaLabel = 'Loading. Please wait...';

  notCompletedIcon.classList.add(HIDDEN_CLASS);
  loadingSpinnerIcon.classList.remove(HIDDEN_CLASS);

  checkbox.disabled = true;
  checkbox.style.cursor = 'not-allowed';

  setTimeout(() => {
    loadingSpinnerIcon.classList.add(HIDDEN_CLASS);
    completedIcon.classList.remove(HIDDEN_CLASS);

    checkbox.disabled = false;
    checkbox.style.cursor = 'pointer';

    checkboxStatus.ariaLabel = `successfully ${checkbox.ariaLabel.replace(
      'mark',
      'marked'
    )}`;

    checkbox.ariaChecked = 'true';
  }, TIMEOUT_DELAY);
}

function markCheckboxAsNotDone(checkbox) {
  const notCompletedIcon = checkbox.querySelector('.not-completed-icon');
  const completedIcon = checkbox.querySelector('.completed-icon');
  const loadingSpinnerIcon = checkbox.querySelector('.loading-spinner-icon');

  const checkboxStatus = checkbox.parentElement.querySelector(
    '.setup-guide__step-checkbox-status'
  );
  checkboxStatus.ariaLabel = 'Loading. Please wait...';

  completedIcon.classList.add(HIDDEN_CLASS);
  loadingSpinnerIcon.classList.remove(HIDDEN_CLASS);

  checkbox.disabled = true;
  checkbox.style.cursor = 'not-allowed';

  setTimeout(() => {
    loadingSpinnerIcon.classList.add(HIDDEN_CLASS);
    notCompletedIcon.classList.remove(HIDDEN_CLASS);

    checkboxStatus.ariaLabel = `successfully ${checkbox.ariaLabel.replace(
      'mark',
      'marked'
    )}`;

    checkbox.disabled = false;
    checkbox.style.cursor = 'pointer';

    checkbox.ariaChecked = 'false';
  }, TIMEOUT_DELAY);
}

function handleGuideStepCheckboxClick(event) {
  const checkbox = event.target.closest('.setup-guide__step-checkbox');
  if (!checkbox) return;
  const checkboxIsChecked = checkbox.ariaChecked;
  if (checkboxIsChecked === 'false') {
    markCheckboxAsDone(checkbox);
  } else {
    markCheckboxAsNotDone(checkbox);
  }
}

function findNextAccordionToOpen(allAccordions, currentAccordionIndex) {
  // Get next accordions after the current one
  const nextAccordions = allAccordions.slice(currentAccordionIndex + 1);

  // If no incomplete step is found after the current step, check previous accordions
  let accordionToBeOpened = nextAccordions.find((accordion) => {
    const accordionCheckbox = accordion.querySelector(
      '.setup-guide__step-checkbox'
    );
    const accordionCheckboxIsChecked = accordionCheckbox.ariaChecked;
    return accordionCheckboxIsChecked === 'false';
  });

  // If no incomplete step is found, check previous accordions
  if (!accordionToBeOpened) {
    accordionToBeOpened = allAccordions.find((accordion) => {
      const accordionCheckbox = accordion.querySelector(
        '.setup-guide__step-checkbox'
      );
      const accordionCheckboxIsChecked = accordionCheckbox.ariaChecked;
      return accordionCheckboxIsChecked === 'false';
    });
  }

  return accordionToBeOpened;
}

function getAccordionElements(accordion) {
  const accordionButton = accordion.querySelector('button[aria-controls]');
  const accordionContentId = accordionButton.getAttribute('aria-controls');
  const accordionContent = document.getElementById(accordionContentId);

  return { accordionButton, accordionContent };
}

function openNextSetupGuideStepsAccordion(event) {
  const setupGuideCheckbox = event.target.closest(
    '.setup-guide__step-checkbox'
  );
  if (!setupGuideCheckbox) return;

  const currentAccordion = setupGuideCheckbox.closest('.setup-guide__step');
  const allAccordions = [
    ...setupGuideSteps.querySelectorAll('.setup-guide__step'),
  ];

  // Find the index of the current accordion
  const currentAccordionIndex = allAccordions.findIndex((accordion) => {
    return (
      accordion.getAttribute('aria-labelledby') ===
      currentAccordion.getAttribute('aria-labelledby')
    );
  });

  const accordionToBeOpened = findNextAccordionToOpen(
    allAccordions,
    currentAccordionIndex
  );

  if (!accordionToBeOpened) return;

  const { accordionButton, accordionContent } =
    getAccordionElements(accordionToBeOpened);

  setTimeout(() => {
    closeAllSetupGuidesAccordions();
    openSetupGuideStepAccordion(accordionButton, accordionContent);
    accordionButton.focus();
  }, TIMEOUT_DELAY + 500);
}

function updateProgressBar(event) {
  if (!event.target.closest('.setup-guide__step-checkbox')) return;
  setTimeout(() => {
    const checkedCheckboxes = allSetupGuideAccordionCheckbox.filter(
      (checkbox) => {
        return checkbox.ariaChecked === 'true';
      }
    );
    const numofCheckedCheckboxes = checkedCheckboxes.length;
    const percentageOfCheckedCheckboxes =
      (numofCheckedCheckboxes / allSetupGuideAccordionCheckbox.length) * 100;
    progressBar.style.width = `${percentageOfCheckedCheckboxes}%`;
    numOfCompletedGuides.textContent = numofCheckedCheckboxes;
  }, TIMEOUT_DELAY);
}

function findAccordionHeadingIndex(accordionHeading, allAccordionsHeading) {
  return allAccordionsHeading.findIndex(
    (heading) => heading === accordionHeading
  );
}

function getAdjacentAccordionHeading(
  currentAccordionHeading,
  allAccordionsHeading,
  direction
) {
  const currentIndex = findAccordionHeadingIndex(
    currentAccordionHeading,
    allAccordionsHeading
  );

  if (direction === 'next') {
    return currentIndex === allAccordionsHeading.length - 1
      ? allAccordionsHeading[0]
      : allAccordionsHeading[currentIndex + 1];
  } else if (direction === 'previous') {
    return currentIndex === 0
      ? allAccordionsHeading[allAccordionsHeading.length - 1]
      : allAccordionsHeading[currentIndex - 1];
  }

  return null;
}

function focusAccordionButton(accordionHeading) {
  const accordionButton = accordionHeading.querySelector('button');
  if (accordionButton) {
    accordionButton.focus();
  }
}

function handleAccordionHeaderKeyPress(event) {
  const currentAccordionHeading = event.target.closest(
    '.setup-guide__step-heading'
  );
  if (!currentAccordionHeading) return;

  const keyPressed = event.key;
  const allAccordionsHeading = [
    ...document.querySelectorAll('.setup-guide__step-heading'),
  ];

  const nextAccordionHeading = getAdjacentAccordionHeading(
    currentAccordionHeading,
    allAccordionsHeading,
    'next'
  );

  const previousAccordionHeading = getAdjacentAccordionHeading(
    currentAccordionHeading,
    allAccordionsHeading,
    'previous'
  );

  if (keyPressed === 'ArrowDown' || keyPressed === 'ArrowRight') {
    focusAccordionButton(nextAccordionHeading);
  } else if (keyPressed === 'ArrowUp' || keyPressed === 'ArrowLeft') {
    focusAccordionButton(previousAccordionHeading);
  }
}

notificationButton.addEventListener('click', toggleMenu);
collectionsButton.addEventListener('click', toggleMenu);
document.addEventListener('click', closeAllMenus);
trialCalloutDismissBtn.addEventListener('click', dismissTrialCallout);
setupStepsAccordionBtn.addEventListener('click', toggleSetupStepsAccordion);
setupGuideSteps.addEventListener('click', toggleSetupGuidesAccordion);
setupGuideSteps.addEventListener('click', handleGuideStepCheckboxClick);
setupGuideSteps.addEventListener('click', openNextSetupGuideStepsAccordion);
setupGuideSteps.addEventListener('click', updateProgressBar);
document.addEventListener('keydown', handleAccordionHeaderKeyPress);
