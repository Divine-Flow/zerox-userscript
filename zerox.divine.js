// ==UserScript==
// @name         ZEROX Advanced Bypasser [Modern UI - Redirect Only]
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  💡 Built for speed. Designed for users. Powered by Divine.
// @author       Divine Reinhard Micheal
// @updateURL    https://raw.githubusercontent.com/Divine-Flow/zerox-userscript/main/zerox.divine.js
// @downloadURL  https://raw.githubusercontent.com/Divine-Flow/zerox-userscript/main/zerox.divine.js
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
// @match        *://spdmteam.com/key-system-2*
// @match        *://spdmteam.com/key-system-3*
// @match        *://rip.linkvertise.lol/*
// @match        *://ads.luarmor.net/get_key*
// @grant        GM_addStyle
// ==/UserScript==

(async function () {
  'use strict';

  const hostname = location.hostname;
  const pathname = location.pathname + location.search;
  const url = window.location.href;
  const title = document.title || '';
  const CURRENT_VERSION = '1.0.9';
  const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/Divine-Flow/zerox-userscript/main/zerox.divine.js';
  const fallbackAPI = "https://spdmteam.com/api/keysystem?step=";

  if (url.startsWith('https://ads.luarmor.net/get_key')) {
    showProgressNotification('⚠️ Bypass Detected', 'Redirecting to Luarmor. You might get blacklisted.');
    const observer = new MutationObserver(() => {
      const errorPopup = document.querySelector('.swal2-popup.swal2-modal.swal2-icon-error');
      if (errorPopup) {
        showProgressNotification('⛔ Blacklisted', 'Luarmor has likely blacklisted your IP or device.');
        observer.disconnect();
        let seconds = 5;
        const interval = setInterval(() => {
          if (seconds === 0) {
            clearInterval(interval);
            try {
              window.close();
              if (!window.closed) throw new Error("Blocked");
            } catch {
              showProgressNotification('🔒 Close Manually', 'Browser blocked auto-close.');
            }
          } else {
            showProgressNotification('⏳ Closing Tab', `This tab will close in ${seconds--}s...`);
          }
        }, 1000);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return;
  }

  // SPDM Logic (No alerts)
  if (title !== 'Just a moment...') {
    if (url.includes("https://spdmteam.com/key-system-1?hwid=")) {
      return;
    } else if (url.includes("arceus-x-neo-key-system-1") || (title.includes("NEO") && title.includes("1"))) {
      window.location.href = `${fallbackAPI}1&advertiser=linkvertise&OS=ios`;
    } else if (url.includes("https://spdmteam.com/key-system-2?hwid=")) {
      window.location.href = "https://loot-link.com/s?fJTD";
    } else if (title.includes("NEO") && title.includes("2")) {
      window.location.href = `${fallbackAPI}2&advertiser=linkvertise&OS=ios`;
    } else if (url.includes("https://spdmteam.com/key-system-3?hwid=")) {
      window.location.href = "https://loot-link.com/s?fJTE";
    } else if (title.includes("Key System 3")) {
      window.location.href = `${fallbackAPI}3&advertiser=linkvertise&OS=ios`;
    }
  }

  if (hostname === 'linkvertise.com') {
    window.addEventListener("load", () => {
      showProgressNotification("⏳ Redirecting — Calling Fallback..", "You’ll be redirected in 3 seconds.");
      setTimeout(() => {
        window.location.href = url.replace('linkvertise.com', 'linkvertise.lol');
      }, 3000);
    });
    return;
  }

  if (hostname.includes('codex.lol')) {
    showProgressNotification("Notice", "❗ No stages available or already whitelisted");
    return;
  }

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

  const bypassAPI = atob('aHR0cHM6Ly9hcGkuc29sYXIteC50b3AvZnJlZS9ieXBhc3M/dXJsPQ==');

  function showProgressNotification(title, subtitle = '') {
    removeNotification();
    const box = document.createElement('div');
    box.id = 'zerox-progress';
    box.innerHTML = `
      <div style="
        background: #1e1e1e;
        color: white;
        border: 2px solid #e67e22;
        border-radius: 12px;
        padding: 14px 20px;
        width: 320px;
        font-family: 'Segoe UI', sans-serif;
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        box-shadow: 0 0 12px rgba(255,255,255,0.15);
        opacity: 0;
        transform: translateX(100%);
        animation: slideInFade 0.5s forwards, fadeOut 0.6s ease-out 5s forwards;
      ">
        <div style="font-size: 16px; font-weight: 600;">${title}</div>
        <div style="font-size: 13px; opacity: 0.85; margin-top: 4px;">${subtitle}</div>
      </div>
    `;
    GM_addStyle(`
      @keyframes slideInFade {
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes fadeOut {
        to { opacity: 0; transform: translateX(100%); }
      }
    `);
    document.body.appendChild(box);
  }

  function removeNotification() {
    document.getElementById('zerox-progress')?.remove();
  }

  async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function tryBypass(url) {
    try {
      showProgressNotification("Bypass in Progress", "Please wait...");
      const start = Date.now();
      const response = await fetch(`${bypassAPI}${encodeURIComponent(url)}`);
      const data = await response.json();
      if ((data.status === 'success' || data.success) && data.result) {
        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        showProgressNotification(`✅ Bypassed in ${elapsed}s`, "Redirecting...");
        await delay(2000);
        window.location.href = data.result;
      } else {
        throw new Error(data.message || 'Bypass failed');
      }
    } catch (err) {
      console.error('Bypass failed, retrying in 5s:', err);
      showProgressNotification("Bypass failed, retrying...", "Retrying in 5 seconds");
      await delay(5000);
      tryBypass(url);
    }
  }

  tryBypass(url);
})();
