// Enhanced Storage Manager with better error handling, performance, and data validation
class StorageManager {
  constructor() {
    this.cache = new Map();
    this.debounceTimers = new Map();
    this.storagePrefix = 'wyr_';
    this.maxCacheSize = 50;
    this.debounceDelay = 300; // ms
    this.batchSaveTimer = null;
  }

  // Enhanced localStorage operations with better error handling
  get(key, defaultValue = null) {
    const fullKey = this.storagePrefix + key;
    
    // Check cache first
    if (this.cache.has(fullKey)) {
      return this.cache.get(fullKey);
    }

    try {
      const item = localStorage.getItem(fullKey);
      if (item === null) return defaultValue;
      
      const parsed = JSON.parse(item);
      
      // Validate data structure if schema is provided
      if (this.schemas[key] && !this.validateSchema(parsed, this.schemas[key])) {
        console.warn(`Invalid data structure for key "${key}", using default`);
        return defaultValue;
      }
      
      // Cache the result
      this.setCache(fullKey, parsed);
      return parsed;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      this.handleStorageError(error, 'read', key);
      return defaultValue;
    }
  }

  set(key, value, options = {}) {
    const fullKey = this.storagePrefix + key;
    const { debounce = true, validate = true } = options;

    // Validate data structure if schema is provided
    if (validate && this.schemas[key] && !this.validateSchema(value, this.schemas[key])) {
      console.warn(`Invalid data structure for key "${key}"`);
      return false;
    }

    // Update cache immediately
    this.setCache(fullKey, value);

    if (debounce) {
      // Debounce the actual localStorage write
      this.debounceSet(fullKey, value);
    } else {
      // Write immediately
      this.writeToStorage(fullKey, value);
    }

    return true;
  }

  remove(key) {
    const fullKey = this.storagePrefix + key;
    
    // Remove from cache
    this.cache.delete(fullKey);
    
    // Clear debounce timer
    if (this.debounceTimers.has(fullKey)) {
      clearTimeout(this.debounceTimers.get(fullKey));
      this.debounceTimers.delete(fullKey);
    }

    try {
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      this.handleStorageError(error, 'remove', key);
      return false;
    }
  }

  // Batch operations for better performance
  batchSet(operations) {
    const results = [];
    
    for (const { key, value, options } of operations) {
      results.push(this.set(key, value, { ...options, debounce: false }));
    }
    
    // Trigger a single debounced save for all operations
    this.debounceBatchSave();
    
    return results;
  }

  // Debounced batch save method
  debounceBatchSave() {
    if (this.batchSaveTimer) {
      clearTimeout(this.batchSaveTimer);
    }
    
    this.batchSaveTimer = setTimeout(() => {
      // Force write all cached items to storage
      for (const [key, value] of this.cache.entries()) {
        if (key.startsWith(this.storagePrefix)) {
          this.writeToStorage(key, value);
        }
      }
      this.batchSaveTimer = null;
    }, this.debounceDelay);
  }

  // Data migration support
  migrateData(fromVersion, toVersion, migrationFn) {
    try {
      const currentVersion = this.get('dataVersion', fromVersion);
      
      if (currentVersion === fromVersion) {
        const migratedData = migrationFn(this);
        this.set('dataVersion', toVersion);
        return migratedData;
      }
    } catch (error) {
      console.error('Migration failed:', error);
    }
    return null;
  }

  // Storage quota management
  getStorageUsage() {
    try {
      let totalSize = 0;
      const keys = Object.keys(localStorage);
      
      for (const key of keys) {
        if (key.startsWith(this.storagePrefix)) {
          totalSize += localStorage.getItem(key).length;
        }
      }
      
      return {
        used: totalSize,
        available: this.getStorageQuota() - totalSize,
        percentage: (totalSize / this.getStorageQuota()) * 100
      };
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  // Cleanup old data
  cleanup(olderThanDays = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
      
      const keys = Object.keys(localStorage);
      let cleanedCount = 0;
      
      for (const key of keys) {
        if (key.startsWith(this.storagePrefix)) {
          const item = localStorage.getItem(key);
          if (item) {
            try {
              const parsed = JSON.parse(item);
              if (parsed.lastAccessed && new Date(parsed.lastAccessed) < cutoffDate) {
                localStorage.removeItem(key);
                this.cache.delete(key);
                cleanedCount++;
              }
            } catch (error) {
              // If we can't parse it, it might be corrupted - remove it
              localStorage.removeItem(key);
              this.cache.delete(key);
              cleanedCount++;
            }
          }
        }
      }
      
      console.log(`Cleaned up ${cleanedCount} old storage items`);
      return cleanedCount;
    } catch (error) {
      console.error('Error during cleanup:', error);
      return 0;
    }
  }

  // Get all storage keys
  getAllKeys() {
    try {
      const keys = Object.keys(localStorage);
      return keys.filter(key => key.startsWith(this.storagePrefix));
    } catch (error) {
      console.error('Error getting storage keys:', error);
      return [];
    }
  }

  // Get storage statistics
  getStorageStats() {
    try {
      const keys = this.getAllKeys();
      const stats = {
        totalKeys: keys.length,
        totalSize: 0,
        keyDetails: []
      };

      for (const key of keys) {
        const item = localStorage.getItem(key);
        if (item) {
          const size = item.length;
          stats.totalSize += size;
          stats.keyDetails.push({
            key: key.replace(this.storagePrefix, ''),
            size,
            lastAccessed: null
          });

          try {
            const parsed = JSON.parse(item);
            if (parsed.lastAccessed) {
              stats.keyDetails[stats.keyDetails.length - 1].lastAccessed = parsed.lastAccessed;
            }
          } catch (error) {
            // Ignore parsing errors for stats
          }
        }
      }

      return stats;
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return { totalKeys: 0, totalSize: 0, keyDetails: [] };
    }
  }

  // Clear all storage data
  clearAll() {
    try {
      const keys = this.getAllKeys();
      let clearedCount = 0;
      
      for (const key of keys) {
        localStorage.removeItem(key);
        this.cache.delete(key);
        clearedCount++;
      }
      
      console.log(`Cleared ${clearedCount} storage items`);
      return clearedCount;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return 0;
    }
  }

  // Private methods
  setCache(key, value) {
    // Implement LRU cache
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  debounceSet(key, value) {
    // Clear existing timer
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }
    
    // Set new timer
    const timer = setTimeout(() => {
      this.writeToStorage(key, value);
      this.debounceTimers.delete(key);
    }, this.debounceDelay);
    
    this.debounceTimers.set(key, timer);
  }

  writeToStorage(key, value) {
    try {
      // Add metadata
      const dataWithMeta = {
        ...value,
        lastAccessed: new Date().toISOString(),
        version: this.get('dataVersion', '1.0.0')
      };
      
      localStorage.setItem(key, JSON.stringify(dataWithMeta));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      this.handleStorageError(error, 'write', key);
    }
  }

  handleStorageError(error, operation, key) {
    // Handle specific storage errors
    if (error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded, attempting cleanup...');
      this.cleanup(7); // Clean up data older than 7 days
      
      // Try the operation again
      setTimeout(() => {
        this.writeToStorage(key, this.cache.get(key));
      }, 100);
    } else if (error.name === 'SecurityError') {
      console.error('Storage access denied - check browser settings');
    }
  }

  validateSchema(data, schema) {
    // Basic schema validation
    for (const [key, type] of Object.entries(schema)) {
      if (!(key in data)) return false;
      if (typeof data[key] !== type) return false;
    }
    return true;
  }

  getStorageQuota() {
    // Estimate available storage (5MB is a safe default)
    return 5 * 1024 * 1024;
  }

  // Data schemas for validation
  schemas = {
    userProfile: {
      name: 'string',
      age: 'string',
      interests: 'string',
      difficulty: 'string',
      personality: 'string'
    },
    gameStats: {
      gamesPlayed: 'number',
      gamesWon: 'number',
      totalScore: 'number',
      highestScore: 'number',
      longestSurvival: 'number',
      averageRoundsSurvived: 'number'
    },
    gameSettings: {
      soundEnabled: 'boolean',
      difficulty: 'string',
      autoSave: 'boolean',
      theme: 'string'
    }
  };
}

// Create singleton instance
const storageManager = new StorageManager();

export default storageManager; 