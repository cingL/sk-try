const DB_NAME = 'muryo-giveaways';
const DB_VERSION = 1;
const STORE_NAME = 'giveaways';

interface CachedGiveaway {
  id: string;
  data: any;
  timestamp: number;
}

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

export async function cacheGiveaways(giveaways: any[]): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Clear old data
    await store.clear();

    // Store new data
    const timestamp = Date.now();
    for (const giveaway of giveaways) {
      await store.put({
        id: giveaway.id,
        data: giveaway,
        timestamp,
      });
    }

    // Wait for transaction to complete
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.warn('Failed to cache giveaways:', error);
  }
}

export async function getCachedGiveaways(): Promise<any[] | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const cached = request.result as CachedGiveaway[];
        if (cached.length === 0) {
          resolve(null);
          return;
        }

        // Check if cache is still valid (24 hours)
        const oldestTimestamp = Math.min(...cached.map((c) => c.timestamp));
        const cacheAge = Date.now() - oldestTimestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (cacheAge > maxAge) {
          resolve(null);
          return;
        }

        resolve(cached.map((c) => c.data));
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Failed to get cached giveaways:', error);
    return null;
  }
}
