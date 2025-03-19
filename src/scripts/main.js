'use strict';

const body = document.body;
let leftClicked = false;
let rightClicked = false;

function addNotification(message, isError = false) {
  document
    .querySelectorAll('[data-qa="notification"]')
    .forEach((notification) => notification.remove());

  const div = document.createElement('div');

  div.classList.add('notification', isError ? 'error' : 'success');
  div.textContent = message;
  div.setAttribute('data-qa', 'notification');
  document.body.appendChild(div);
}

const firstPromise = new Promise((resolve, reject) => {
  // eslint-disable-next-line no-shadow
  const clickHandler = (event) => {
    if (event.button === 0) {
      event.stopPropagation();
      // eslint-disable-next-line no-console
      console.log('First promise resolved');
      resolve('First promise was resolved');
      body.removeEventListener('click', clickHandler);
    }
  };

  body.addEventListener('click', clickHandler);

  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.log('First promise rejected');
    // eslint-disable-next-line prefer-promise-reject-errors
    reject('First promise was rejected in 3 seconds');
    body.removeEventListener('click', clickHandler);
  }, 3000);
});

const secondPromise = new Promise((resolve) => {
  // eslint-disable-next-line no-shadow
  const clickHandler = (event) => {
    if (event.button === 0 || event.button === 2) {
      // eslint-disable-next-line no-console
      console.log('Second promise resolved');
      resolve('Second promise was resolved');
      body.removeEventListener('click', clickHandler);
    }
  };

  body.addEventListener('click', clickHandler);
});

const thirdPromise = new Promise((resolve) => {
  // eslint-disable-next-line no-shadow
  const clickHandler = (event) => {
    if (event.button === 0) {
      leftClicked = true;
      // eslint-disable-next-line no-console
      console.log('Left click detected');
    }

    if (event.button === 2) {
      rightClicked = true;
      // eslint-disable-next-line no-console
      console.log('Right click detected');
    }

    if (leftClicked && rightClicked) {
      // eslint-disable-next-line no-console
      console.log('Third promise resolved');
      resolve('Third promise was resolved');
      body.removeEventListener('click', clickHandler);
    }
  };

  body.addEventListener('click', clickHandler);
});

firstPromise
  .then((message) => addNotification(message))
  .catch((errorMessage) => addNotification(errorMessage, true));

secondPromise.then((message) => {
  setTimeout(() => addNotification(message), 100);
});

thirdPromise.then((message) => addNotification(message));
