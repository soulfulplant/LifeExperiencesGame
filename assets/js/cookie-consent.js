(function () {
  'use strict';

  const consentKey = 'lifeExperiencesOptionalContent';
  let banner;

  function readConsent() {
    try {
      return window.localStorage.getItem(consentKey);
    } catch (error) {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      window.localStorage.setItem(consentKey, value);
    } catch (error) {
      /* The preference will last for this page view if storage is blocked. */
    }
  }

  function enableOptionalContent() {
    document.querySelectorAll('iframe[data-cookie-src]').forEach((frame) => {
      if (!frame.getAttribute('src')) {
        frame.setAttribute('src', frame.dataset.cookieSrc);
      }
      frame.hidden = false;
    });

    document.querySelectorAll('[data-cookie-placeholder]').forEach((placeholder) => {
      placeholder.hidden = true;
    });
  }

  function disableOptionalContent() {
    document.querySelectorAll('iframe[data-cookie-src]').forEach((frame) => {
      frame.removeAttribute('src');
      frame.hidden = true;
    });

    document.querySelectorAll('[data-cookie-placeholder]').forEach((placeholder) => {
      placeholder.hidden = false;
    });
  }

  function closeBanner() {
    banner.hidden = true;
  }

  function acceptOptionalContent() {
    saveConsent('accepted');
    enableOptionalContent();
    closeBanner();
  }

  function rejectOptionalContent() {
    saveConsent('rejected');
    disableOptionalContent();
    closeBanner();
  }

  function showBanner() {
    banner.hidden = false;
    banner.querySelector('.cookie-accept').focus();
  }

  function createBanner() {
    banner = document.createElement('section');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-labelledby', 'cookie-title');
    banner.hidden = true;
    banner.innerHTML = `
      <div class="cookie-banner-inner">
        <div class="cookie-copy">
          <h2 id="cookie-title">Your privacy choices</h2>
          <p>We use necessary browser storage to remember your choice. If you allow optional content, pages such as our waiting-list form can load from Google, which may use cookies or similar technologies.</p>
          <a href="terms-and-conditions.html#cookies">Read our cookie information</a>
        </div>
        <div class="cookie-actions">
          <button type="button" class="cookie-reject">USE NECESSARY ONLY</button>
          <button type="button" class="btn-orange cookie-accept">ALLOW OPTIONAL CONTENT</button>
        </div>
      </div>`;

    document.body.appendChild(banner);
    banner.querySelector('.cookie-accept').addEventListener('click', acceptOptionalContent);
    banner.querySelector('.cookie-reject').addEventListener('click', rejectOptionalContent);
  }

  function addSettingsButton() {
    const legalGroup = document.querySelector('.footer-group:last-child');
    if (!legalGroup) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cookie-settings-link';
    button.textContent = 'Cookie settings';
    button.addEventListener('click', showBanner);
    legalGroup.appendChild(button);
  }

  function initialiseConsent() {
    createBanner();
    addSettingsButton();

    document.querySelectorAll('[data-enable-optional]').forEach((button) => {
      button.addEventListener('click', acceptOptionalContent);
    });

    const consent = readConsent();
    if (consent === 'accepted') {
      enableOptionalContent();
    } else {
      disableOptionalContent();
      if (consent !== 'rejected') showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiseConsent);
  } else {
    initialiseConsent();
  }
}());


