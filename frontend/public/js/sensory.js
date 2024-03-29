const hamburgerMenuCheckbox = document.querySelector('.hamburger-menu input');
const sidebar = document.querySelector('.sidebar');
const sidebarNav = document.querySelector('.sidebar nav');

hamburgerMenuCheckbox.addEventListener('change', e => {
  let transitionHandled = false;

  function handleTransitionEnd() {
    if (!transitionHandled) {
      transitionHandled = true;
      if (e.target.checked) {
        sidebarNav.style.display = 'block';
      } else {
        sidebarNav.classList.remove('fade-out');
        sidebarNav.style.display = 'none';
        updateSelectedLi(null, true);
      }
    }
  }

  const transitionDuration = getTransitionDuration(sidebar);

  if (e.target.checked) {
    sidebar.addEventListener('transitionend', handleTransitionEnd, { once: true });
    setTimeout(handleTransitionEnd, transitionDuration);
    return;
  }

  sidebarNav.classList.add('fade-out');
  sidebarNav.addEventListener('transitionend', handleTransitionEnd, { once: true });
  setTimeout(handleTransitionEnd, transitionDuration);
});

const sidebarListItems = document.querySelectorAll('.sidebar li');
const sidebarX = document.querySelector('#sidebar-x-icon');

sidebarListItems.forEach(item => {
  item.addEventListener('mouseover', () => {
    updateSelectedLi(item);
  });

  item.addEventListener('click', () => {
    sidebarX.click();
  });
});

const upArrow = document.getElementById('up-arrow');
upArrow.addEventListener('click', () => {
  const currSelectedLi = document.querySelector('.curr-selected-li');
  const currIndex = currSelectedLi.dataset.index;

  if (currIndex === '0') {
    const exitLi = document.getElementById('exit-sidebar');
    currSelectedLi.classList.remove('curr-selected-li');
    exitLi.classList.add('curr-selected-li');
  } else {
    const newIndex = parseInt(currIndex) - 1;
    const newSelected = document.querySelector(`li[data-index="${newIndex}"]`);
    currSelectedLi.classList.remove('curr-selected-li');
    newSelected.classList.add('curr-selected-li');
  }
});

const downArrow = document.getElementById('down-arrow');
downArrow.addEventListener('click', () => {
  const currSelectedLi = document.querySelector('.curr-selected-li');
  const currIndex = currSelectedLi.dataset.index;

  if (currIndex === '4') {
    const firstLi = document.getElementById('first-li');
    currSelectedLi.classList.remove('curr-selected-li');
    firstLi.classList.add('curr-selected-li');
  } else {
    const newIndex = parseInt(currIndex) + 1;
    const newSelected = document.querySelector(`li[data-index="${newIndex}"]`);
    currSelectedLi.classList.remove('curr-selected-li');
    newSelected.classList.add('curr-selected-li');
  }
});

const middleSelectArrow = document.querySelector('.middle-select');
middleSelectArrow.addEventListener('click', () => {
  const currSelectedLi = document.querySelector('.curr-selected-li');
  if (currSelectedLi.textContent != 'Exit') {
    currSelectedLi.querySelector('a').click();
  } else {
    currSelectedLi.click();
  }

});

function getTransitionDuration(element) {
  const style = window.getComputedStyle(element);
  const duration = parseFloat(style.transitionDuration || '0s');
  return duration * 1000;
}

function updateSelectedLi(item, reset = false) {
  const currSelectedLi = document.querySelector('.curr-selected-li');
  if (!reset) {
    if (item === currSelectedLi) {
      return
    } else {
      currSelectedLi.classList.remove('curr-selected-li');
      item.classList.add('curr-selected-li');
    }
  } else {
    const sessionLi = document.querySelector('.session-li');
    currSelectedLi.classList.remove('curr-selected-li');
    sessionLi.classList.add('curr-selected-li');
  }
};

const imageSections = document.querySelectorAll('.section');
const headerHeight = document.querySelector('header').clientHeight;

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    const hasBeenIntersecting = entry.target.dataset.hasBeenIntersecting === 'true';
  
      if (entry.isIntersecting) {
        if (!hasBeenIntersecting) {
          entry.target.classList.remove('hidden');
          entry.target.dataset.hasBeenIntersecting = 'true';
        } else {
          entry.target.classList.remove('hidden');
        }
      } else {
        entry.target.classList.add('hidden');
      }
  });
}, {
  rootMargin: `-${headerHeight}px 0px 0px 0px`,
  threshold: .5
});

imageSections.forEach(section => {
  observer.observe(section);
});

