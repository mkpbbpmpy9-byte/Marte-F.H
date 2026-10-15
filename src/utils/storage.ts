/**
 * Hybrid persistent storage utility.
 * 1. Primary: Server-side disk file via Express (/api/portfolio) ensures complete
 *    persistence across browser sessions, refreshes, iframes, and device reboots.
 * 2. Secondary: IndexedDB and localStorage local cache for instant offline startup.
 */

const DB_NAME = 'portfolio_builder_db';
const STORE_NAME = 'portfolio_store';
const DATA_KEY = 'portfolio_current_state';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves portfolio state to the server disk via /api/portfolio
 * and synchronizes with IndexedDB as a local cache.
 */
export async function savePortfolioToStorage(data: unknown): Promise<void> {
  // 1. Save to server backend disk
  try {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    if (res.ok) {
      // Backend write succeeded
    }
  } catch (err) {
    console.warn('[Storage] Backend write error, falling back to client cache:', err);
  }

  // 2. Cache in IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, DATA_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // 3. Fallback to localStorage if IndexedDB is unavailable
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(DATA_KEY, serialized);
    } catch {
      // ignore quota exceeded if payload is large
    }
  }
}

/**
 * Loads portfolio state: checks server disk first, then IndexedDB, then localStorage.
 */
export async function loadPortfolioFromStorage<T>(): Promise<T | null> {
  // 1. Try server backend disk
  try {
    const res = await fetch('/api/portfolio');
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        return json.data as T;
      }
    }
  } catch (err) {
    console.warn('[Storage] Could not reach backend, checking local cache:', err);
  }

  // 2. Try IndexedDB cache
  try {
    const db = await openDB();
    const result = await new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(DATA_KEY);
      req.onsuccess = () => resolve((req.result as T) || null);
      req.onerror = () => reject(req.error);
    });
    if (result) return result;
  } catch {
    // fallback check
  }

  // 3. Try localStorage cache
  try {
    const fromLocal = localStorage.getItem(DATA_KEY);
    if (fromLocal) {
      return JSON.parse(fromLocal) as T;
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Resets portfolio storage on both server disk and local cache.
 */
export async function clearPortfolioStorage(): Promise<void> {
  try {
    await fetch('/api/reset-portfolio', { method: 'POST' });
  } catch {
    // ignore
  }

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(DATA_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // ignore
  }

  try {
    localStorage.removeItem(DATA_KEY);
  } catch {
    // ignore
  }
}
