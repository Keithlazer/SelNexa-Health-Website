import React from 'react';
// Import the app's Tailwind entry so CSS is extracted into the embed bundle
import './index.css';
import { createRoot } from 'react-dom/client';
import {
  PatientAppMockup,
  ProviderDashboardMockup,
  AdminDashboardMockup,
} from './components/DashboardMockups';

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  patient: PatientAppMockup,
  provider: ProviderDashboardMockup,
  admin: AdminDashboardMockup,
};

function mountAllEmbeds() {
  const containers = Array.from(document.querySelectorAll<HTMLElement>('.selnexa-dashboard-embed'));
  if (containers.length === 0) return;

  containers.forEach((container) => {
    // avoid double-mount
    if ((container as any).__selnexa_mounted) return;

    const rawType = (container.dataset.type || 'patient').toLowerCase();
    const Comp = COMPONENT_MAP[rawType] || PatientAppMockup;

    // add a consistent wrapper class to allow Tailwind scoping
    if (!container.classList.contains('selnexa-embed-root')) {
      container.classList.add('selnexa-embed-root');
    }

    try {
      const root = createRoot(container);
      root.render(React.createElement(React.StrictMode, null, React.createElement(Comp, null)));
      (container as any).__selnexa_mounted = true;
    } catch (err) {
      // graceful fallback: show message and log error
      container.innerHTML = '<div style="color:crimson">SelNexa embed failed to load</div>';
      // eslint-disable-next-line no-console
      console.error('SelNexa embed mount error', err);
    }
  });
}

function runWhenReady() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAllEmbeds);
  } else {
    // If script is appended after the DOM, run immediately
    mountAllEmbeds();
  }
}

// Auto-run when the script loads
runWhenReady();

// Export nothing; this file is only intended as an auto-run entry for the embed bundle
export {};
