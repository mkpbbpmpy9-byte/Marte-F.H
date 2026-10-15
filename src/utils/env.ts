/**
 * Environment & preview window detection utility.
 * Enforces that editing capabilities are only accessible to the owner
 * inside the AI Studio preview window (iframe / dev server / owner secret key),
 * and completely hidden on the public website for external visitors.
 */

export function isInPreviewEnvironment(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    // 1. Inside an iframe (AI Studio Build workspace preview window)
    if (window.self !== window.top) {
      return true;
    }
  } catch {
    // Cross-origin iframe restrictions also confirm embedded preview iframe
    return true;
  }

  // 2. Development hostnames (localhost or cloud dev runners)
  const hostname = window.location.hostname;
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.includes('ais-dev-')
  ) {
    return true;
  }

  // 3. Explicit owner access parameter (?edit=true or #edit)
  const search = window.location.search;
  const hash = window.location.hash;
  if (
    search.includes('edit=true') ||
    search.includes('admin=true') ||
    search.includes('editor=true') ||
    hash === '#edit' ||
    hash === '#admin'
  ) {
    return true;
  }

  // 4. Session flag unlocked via keyboard shortcut (Ctrl+Alt+E / Cmd+Alt+E)
  try {
    if (window.sessionStorage?.getItem('portfolio_editor_allowed') === 'true') {
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}

/**
 * Toggles editor access for the current session (e.g. via keyboard shortcut).
 */
export function toggleSessionEditorPermission(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = window.sessionStorage?.getItem('portfolio_editor_allowed') === 'true';
    const next = !current;
    window.sessionStorage?.setItem('portfolio_editor_allowed', String(next));
    return next;
  } catch {
    return false;
  }
}
