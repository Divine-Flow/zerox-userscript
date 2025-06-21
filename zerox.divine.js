// ==UserScript==
// @name         ZEROX Advanced Bypasser [Modern UI - Redirect Only]
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  💡 Built for speed. Designed for users. Powered by Divine.
// @author       Divine Reinhard Micheal
// @updateURL    https://raw.githubusercontent.com/Divine-Flow/zerox-userscript/main/zerox.divine.js
// @downloadURL  https://raw.githubusercontent.com/Divine-Flow/zerox-userscript/main/.zerox.divine.js
// @match        *://linkvertise.com/*
// @match        *://*.codex.lol/*
// @match        *://loot-link.com/*
// @match        *://loot-links.com/*
// @match        *://lootlink.org/*
// @match        *://lootlinks.co/*
// @match        *://lootdest.info/*
// @match        *://lootdest.org/*
// @match        *://lootdest.com/*
// @match        *://links-loot.com/*
// @match        *://linksloot.net/*
// @match        *://rekonise.com/*
// @match        *://ldnesfspublic.org/*
// @match        *://mboost.me/*
// @match        *://link.rbscripts.net/*
// @match        *://socialwolvez.com/*
// @match        *://sub2unlock.com/*
// @match        *://sub2unlock.net/*
// @match        *://sub2get.com/*
// @match        *://spdmteam.com/key-system-bypass*
// @match        *://spdmteam.com/key-system-1*
// @match        *://rip.linkvertise.lol/*
// @match        *://ads.luarmor.net/get_key*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// ==/UserScript==

(async function () {
  'use strict';

  const CURRENT_VERSION = '1.0.7';
  const bypassAPI = atob('aHR0cHM6Ly9hcGkuc29sYXIteC50b3AvZnJlZS9ieXBhc3M/dXJsPQ==');
  const hostname = location.hostname;
  const pathname = location.pathname + location.search;
  let retryCount = 0;

  if (location.href.startsWith('https://ads.luarmor.net/get_key')) {
    showProgressNotification(
      '⚠️ Bypass Detected',
      'Redirecting to Luarmor. You might get blacklisted for any bypass attempts.'
    );

    const observer = new MutationObserver(() => {
      const errorPopup = document.querySelector('.swal2-popup.swal2-modal.swal2-icon-error');
      if (errorPopup) {
        showProgressNotification('⛔ Blacklisted', 'Luarmor has likely blacklisted you.');
        playSound('error');
        observer.disconnect();

        let seconds = 5;
        const countdown = setInterval(() => {
          if (seconds === 0) {
            clearInterval(countdown);
            window.close();
          } else {
            showProgressNotification('⏳ Closing Tab', `This tab will close in ${seconds--}s...`);
          }
        }, 1000);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return;
  }

  if (hostname === 'linkvertise.com' && (pathname === '/' || pathname === '' || pathname.includes('/376138/arceus-x-neo-key-system-1'))) return;
  if (hostname === 'linkvertise.com') return location.href = location.href.replace('linkvertise.com', 'linkvertise.lol');
  if (hostname.includes('codex.lol')) return showProgressNotification("Notice", "❗ No stages or already whitelisted");
  if (location.href.includes('spdmteam.com/key-system-bypass')) return showProgressNotification("✅ Key System", "Key System completed!");
  if (location.href.includes('spdmteam.com/key-system-1')) return showProgressNotification("Captcha", "🔐 Complete the captcha!");

  if (hostname.includes('rip.linkvertise.lol')) {
    const clickButtons = ['#cta-button', '#75590a48-78ab-4d60-acbd-6024d87a3a71', '#55c60a5a-c0d6-4997-aa37-12511fd0f337'];
    setInterval(() => clickButtons.forEach(sel => {
      const el = document.querySelector(sel);
      if (el && el.offsetParent !== null) el.click();
    }), 800);
    return;
  }

  const domainWhitelist = [
    'loot-link.com', 'loot-links.com', 'lootlink.org', 'lootlinks.co',
    'lootdest.info', 'lootdest.org', 'lootdest.com', 'links-loot.com',
    'linksloot.net', 'rekonise.com', 'ldnesfspublic.org', 'mboost.me',
    'link.rbscripts.net', 'socialwolvez.com', 'sub2unlock.com',
    'sub2unlock.net', 'sub2get.com'
  ];

  const currentDomain = hostname.replace(/^www\.|^mobile\.|^www2\./, '');
  if (!domainWhitelist.some(domain => currentDomain.endsWith(domain))) return;

  addFloatingButton();
  tryBypass(location.href);
  checkForUpdates();

  async function tryBypass(url) {
    if (retryCount >= 3) return showProgressNotification("❌ Max Retries", "Bypass failed 3 times.");
    try {
      showProgressNotification("Bypass in Progress", "Please wait...");
      const start = Date.now();
      const res = await fetch(`${bypassAPI}${encodeURIComponent(url)}`);
      const data = await res.json();

      if ((data.status === 'success' || data.success) && data.result) {
        const time = ((Date.now() - start) / 1000).toFixed(1);
        showRedirectNotice(`✅ Bypassed in ${time}s`);
        playSound('success');
        logBypassedLink(url, data.result);
        await delay(2000);
        location.href = data.result;
      } else throw new Error(data.message);
    } catch (e) {
      retryCount++;
      console.warn("Retrying...", e);
      playSound('warning');
      showProgressNotification("⚠️ Retry", `Retrying in 5s (${retryCount}/3)...`);
      await delay(5000);
      tryBypass(url);
    }
  }

  function showProgressNotification(title, subtitle = '') {
    removeNotification();
    const box = document.createElement('div');
    box.id = 'zerox-progress';
    box.innerHTML = `
      <div style="background:#1e1e1e;color:white;border:2px solid #2ecc71;border-radius:12px;padding:14px 20px;width:320px;font-family:'Segoe UI';position:fixed;top:20px;right:20px;z-index:999999;box-shadow:0 0 8px rgba(0,0,0,0.3);transform:translateX(350px);animation:slideIn 0.4s forwards;">
        <div style="font-size:16px;font-weight:600;">${title}</div>
        <div style="font-size:13px;opacity:0.85;margin-top:4px;">${subtitle}</div>
      </div>
    `;
    GM_addStyle(`@keyframes slideIn { to { transform: translateX(0); } }`);
    document.body.appendChild(box);
  }

  function showRedirectNotice(message, countdown = 2) {
    removeNotification();
    const box = document.createElement('div');
    box.id = 'zerox-result';
    box.innerHTML = `
      <div style="background:#1e1e1e;color:white;border:2px solid #3498db;border-radius:12px;padding:14px 20px;width:320px;font-family:'Segoe UI';position:fixed;top:20px;right:20px;z-index:999999;box-shadow:0 0 8px rgba(0,0,0,0.3);transform:translateX(350px);animation:slideIn 0.4s forwards;">
        <div style="font-size:16px;font-weight:600;">${message}</div>
        <div id="zerox-countdown" style="margin-top:8px;font-size:13px;opacity:0.8;">Redirecting in ${countdown} seconds...</div>
      </div>
    `;
    document.body.appendChild(box);
    const counter = document.getElementById('zerox-countdown');
    let seconds = countdown;
    const interval = setInterval(() => {
      seconds--;
      if (seconds <= 0) return clearInterval(interval);
      counter.textContent = `Redirecting in ${seconds} seconds...`;
    }, 1000);
  }

  function removeNotification() {
    document.getElementById('zerox-progress')?.remove();
    document.getElementById('zerox-result')?.remove();
  }

  function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  function addFloatingButton() {
    const btn = document.createElement('button');
    btn.textContent = "🔄 Manual Bypass";
    btn.style = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #3498db;
      color: white;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      font-family: 'Segoe UI';
      font-size: 14px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      z-index: 999999;
      cursor: pointer;
    `;
    btn.onclick = () => tryBypass(window.location.href);
    document.body.appendChild(btn);
  }

  function playSound(type = 'success') {
    const url = {
      success: 'https://notificationsounds.com/storage/sounds/file-sounds-1153-pristine.mp3',
      error: 'https://notificationsounds.com/storage/sounds/file-sounds-1145-correct.mp3',
      warning: 'https://notificationsounds.com/storage/sounds/file-sounds-1148-you-wouldnt-believe.mp3'
    }[type];
    if (!url) return;
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play().catch(console.error);
  }

  function logBypassedLink(original, bypassed) {
    const logs = JSON.parse(localStorage.getItem('zerox_history') || '[]');
    logs.unshift({ original, bypassed, time: new Date().toLocaleString() });
    localStorage.setItem('zerox_history', JSON.stringify(logs.slice(0, 25)));
  }

  async function checkForUpdates() {
    try {
      const res = await fetch('https://raw.githubusercontent.com/Divine-Flow/zerox-userscript/main/zerox.version.json');
      const data = await res.json();
      if (data.version !== CURRENT_VERSION) {
        showProgressNotification('🔔 Update Available', `v${data.version} — click to update`);
        const box = document.getElementById('zerox-progress');
        box.style.cursor = 'pointer';
        box.onclick = () => window.open('https://raw.githubusercontent.com/Divine-Flow/zerox-userscript/main/zerox.user.js', '_blank');
      }
    } catch (e) {
      console.warn('Update check failed:', e);
    }
  }
})();
