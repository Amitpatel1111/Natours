/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

// STARFIELD IMPLEMENTATION
document.addEventListener('DOMContentLoaded', function () {
  const starfield = document.getElementById('starfield-background');
  if (starfield) {
    // Create stars
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');

      // Random properties for each star
      const size = Math.random() * 3;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const twinkleDuration = 2 + Math.random() * 8;
      const opacity = 0.2 + Math.random() * 0.8;

      // Apply properties
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${posX}%`;
      star.style.top = `${posY}%`;
      star.style.setProperty('--twinkle-duration', `${twinkleDuration}s`);
      star.style.opacity = opacity;

      // Add variation to twinkling
      if (twinkleDuration > 6) star.classList.add('slow');
      else if (twinkleDuration < 4) star.classList.add('fast');

      starfield.appendChild(star);
    }

    // Mouse move interaction
    let mouseX = 0;
    let mouseY = 0;
    let stars = document.querySelectorAll('.star');

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;

      // Move stars based on mouse position
      stars.forEach((star) => {
        const speed = parseFloat(star.style.width) * 0.5;
        const xOffset = mouseX * speed * 20;
        const yOffset = mouseY * speed * 20;

        const currentLeft = parseFloat(star.style.left);
        const currentTop = parseFloat(star.style.top);

        const newLeft = currentLeft + xOffset * 0.05;
        const newTop = currentTop + yOffset * 0.05;

        // Keep stars within bounds
        star.style.left = `${Math.max(0, Math.min(100, newLeft))}%`;
        star.style.top = `${Math.max(0, Math.min(100, newTop))}%`;
      });
    });
  }
});

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    // bookTour(tourId); // Commented out since bookTour is not defined in this file
  });
