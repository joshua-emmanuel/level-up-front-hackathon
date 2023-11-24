const menuButtons = [...document.querySelectorAll('[aria-haspopup="menu"]')];
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
  const nextAccordions = [
    ...setupGuideSteps.querySelectorAll(
      `[aria-labelledby="${currentAccordionLabel}"] ~ .setup-guide__step`
    ),
  ];
  const accordionToBeOpened = nextAccordions.find((accordion) => {
    const accordionCheckbox = accordion.querySelector('.setup-guide__checkbox');
    if (!accordionCheckbox.checked) return true;
  });
  if (!accordionToBeOpened) return;
  const accordionToBeOpenedButton = accordionToBeOpened.querySelector(
    'button[aria-controls]'
  );
  const accordionToBeOpenedContentId =
    accordionToBeOpenedButton.getAttribute('aria-controls');
  const accordionToBeOpenedContent = document.getElementById(
    accordionToBeOpenedContentId
  );
  closeAllSetupGuideStepsAccordions();
  openAccordion(accordionToBeOpenedButton, accordionToBeOpenedContent);
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

notificationButton.addEventListener('click', toggleMenu);
collectionsButton.addEventListener('click', toggleMenu);
document.addEventListener('click', closeAllMenus);
trialCalloutDismissBtn.addEventListener('click', dismissTrialCallout);
setupStepsAccordionBtn.addEventListener('click', toggleSetupStepsAccordion);
setupGuideSteps.addEventListener('click', toggleSetupGuideStepsAccordion);
setupGuideSteps.addEventListener('click', openNextSetupGuideStepsAccordion);
setupGuideSteps.addEventListener('click', updateProgressBar);
