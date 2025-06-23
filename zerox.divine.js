// ==UserScript==
// @name         ZEROX Advanced Bypasser [Modern UI - Redirect Only]
// @namespace    http://tampermonkey.net/
// @version      1.0.7
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
// @match        *://rip.linkvertise.lol/*
// @match        *://ads.luarmor.net/get_key*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// ==/UserScript==

(async function () {
  'use strict';

  const CURRENT_VERSION = '1.0.7';
  const RAW_URL = 'https://raw.githubusercontent.com/Divine-Flow/zerox-userscript/main/zerox.divine.js';
  const bypassAPI = atob('aHR0cHM6Ly9hcGkuc29sYXIteC50b3AvZnJlZS9ieXBhc3M/dXJsPQ==');

  const isLatest = await enforceUpdate();
  if (!isLatest) return;

  const hostname = location.hostname;
  const pathname = location.pathname + location.search;

  if (location.href.startsWith('https://ads.luarmor.net/get_key')) {
    showNotice('⚠️ Bypass Detected', 'Luarmor may blacklist you. Proceed with caution.');
    const observer = new MutationObserver(() => {
      const errorPopup = document.querySelector('.swal2-popup.swal2-modal.swal2-icon-error');
      if (errorPopup) {
        observer.disconnect();
        let sec = 5;
        const countdown = setInterval(() => {
          showNotice('⛔ Blacklisted', `Tab will close in ${sec--}s...`);
          if (sec < 0) {
            clearInterval(countdown);
            window.close();
          }
        }, 1000);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return;
  }

  if (
    hostname === 'linkvertise.com' &&
    (pathname === '/' || pathname === '' || pathname.includes('/376138/arceus-x-neo-key-system-1'))
  ) return;

  if (hostname === 'linkvertise.com') {
    showNotice("⏳ Redirecting", "Redirecting to linkvertise.lol...");
    await new Promise(r => setTimeout(r, 10000));
    location.href = location.href.replace('linkvertise.com', 'linkvertise.lol');
    return;
  }

  if (hostname.includes('codex.lol')) {
    showNotice("Notice", "❗ No stages or already whitelisted");
    return;
  }

  if (location.href.includes('spdmteam.com/key-system-bypass')) {
    showNotice("✅ Key System", "Key System completed!");
    return;
  }
  if (location.href.includes('spdmteam.com/key-system-1')) {
    showNotice("Captcha", "🔐 Complete the captcha!");
    return;
  }

  if (hostname.includes('rip.linkvertise.lol')) {
    const btns = [
      '#cta-button',
      '#75590a48-78ab-4d60-acbd-6024d87a3a71',
      '#55c60a5a-c0d6-4997-aa37-12511fd0f337'
    ];
    setInterval(() => {
      for (const sel of btns) {
        const el = document.querySelector(sel);
        if (el && el.offsetParent !== null) el.click();
      }
    }, 800);
    return;
  }

  const whitelist = [
    'loot-link.com', 'loot-links.com', 'lootlink.org', 'lootlinks.co',
    'lootdest.info', 'lootdest.org', 'lootdest.com', 'links-loot.com',
    'linksloot.net', 'rekonise.com', 'ldnesfspublic.org', 'mboost.me',
    'link.rbscripts.net', 'socialwolvez.com', 'sub2unlock.com',
    'sub2unlock.net', 'sub2get.com'
  ];

  const domain = hostname.replace(/^www\.|^mobile\.|^www2\./, '');
  if (!whitelist.some(d => domain.endsWith(d))) return;

  tryBypass(location.href);

  async function tryBypass(url) {
    try {
      showNotice("Bypass in Progress", "Please wait...");
      const start = Date.now();
      const res = await fetch(`${bypassAPI}${encodeURIComponent(url)}`);
      const data = await res.json();
      if ((data.status === 'success' || data.success) && data.result) {
        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        showNotice(`✅ Bypassed`, `Redirecting in 2s... (${elapsed}s)`);
        await new Promise(r => setTimeout(r, 2000));
        location.href = data.result;
      } else {
        throw new Error(data.message);
      }
    } catch (e) {
      console.warn("Bypass failed, retrying in 5s...", e);
      showNotice("⚠️ Retry", "Bypass failed. Retrying in 5s...");
      await new Promise(r => setTimeout(r, 5000));
      tryBypass(url);
    }
  }

  function showNotice(title, subtitle = '') {
    removeNotice();
    const div = document.createElement('div');
    div.id = 'zerox-notice';
    div.innerHTML = `
      <div style="
        background: #1e1e1e;
        color: white;
        border: 2px solid #2ecc71;
        border-radius: 12px;
        padding: 14px 20px;
        width: 320px;
        font-family: 'Segoe UI';
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        box-shadow: 0 0 10px rgba(0,0,0,0.4);
        transform: translateX(350px);
        opacity: 0;
        animation: fadeIn 0.6s forwards ease-out;
      ">
        <div style="font-size: 16px; font-weight: 600;">${title}</div>
        <div style="font-size: 13px; opacity: 0.85; margin-top: 4px;">${subtitle}</div>
      </div>
    `;
    GM_addStyle(`@keyframes fadeIn { to { transform: translateX(0); opacity: 1; } }`);
    document.body.appendChild(div);
  }

  function removeNotice() {
    document.getElementById('zerox-notice')?.remove();
  }

  async function enforceUpdate() {
    try {
      const response = await fetch(RAW_URL + '?_=' + Date.now());
      const code = await response.text();
      const match = code.match(/@version\s+([^\s]+)/);
      const latest = match?.[1];

      if (latest && latest !== CURRENT_VERSION) {
        blockAndPromptUpdate(latest);
        return false;
      }
    } catch (err) {
      console.warn('[ZEROX] Update check failed:', err);
    }
    return true;
  }

  function blockAndPromptUpdate(latestVersion) {
    removeNotice();
    const box = document.createElement('div');
    box.id = 'zerox-update-required';
    box.innerHTML = `
      <div style="
        background: #2c2c2c;
        color: white;
        border: 2px solid #e74c3c;
        border-radius: 12px;
        padding: 14px 20px;
        width: 340px;
        font-family: 'Segoe UI';
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        box-shadow: 0 0 10px rgba(0,0,0,0.4);
        transform: translateX(350px);
        animation: fadeIn 0.6s ease-out forwards;
        cursor: pointer;
      ">
        <div style="font-size: 16px; font-weight: 600;">🔔 Update Required</div>
        <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">
          Please update to <strong>v${latestVersion}</strong> to continue using ZEROX.
        </div>
        <div style="font-size: 12px; margin-top: 6px; opacity: 0.7;">Click to update manually.</div>
      </div>
    `;
    box.onclick = () => window.open(RAW_URL, '_blank');
    GM_addStyle(`@keyframes fadeIn { to { transform: translateX(0); opacity: 1; } }`);
    document.body.appendChild(box);
  }
})();
