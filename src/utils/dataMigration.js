// Data Migration Utility for handling version updates and data structure changes
import storageManager from './storageManager';

class DataMigrationManager {
  constructor() {
    this.currentVersion = '1.1.0';
    this.migrations = new Map();
    this.setupMigrations();
  }

  setupMigrations() {
    // Migration from v1.0.0 to v1.1.0
    this.migrations.set('1.0.0', (storage) => {
      console.log('Migrating from v1.0.0 to v1.1.0...');
      
      // Migrate user profile
      const oldProfile = storage.get('wouldYouRatherProfile');
      if (oldProfile && !oldProfile.version) {
        const newProfile = {
          ...oldProfile,
          createdAt: oldProfile.lastUpdated || new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          version: '1.1.0'
        };
        storage.set('userProfile', newProfile, { debounce: false });
        storage.remove('wouldYouRatherProfile');
      }

      // Migrate game stats
      const oldStats = storage.get('gameStats');
      if (oldStats && !oldStats.version) {
        const newStats = {
          ...oldStats,
          lastUpdated: new Date().toISOString(),
          version: '1.1.0'
        };
        storage.set('gameStats', newStats, { debounce: false });
      }

      // Migrate settings
      const oldSettings = storage.get('gameSettings');
      if (oldSettings && !oldSettings.version) {
        const newSettings = {
          ...oldSettings,
          notifications: true,
          performanceMode: false,
          lastUpdated: new Date().toISOString(),
          version: '1.1.0'
        };
        storage.set('gameSettings', newSettings, { debounce: false });
      }

      // Migrate high scores
      const oldScores = storage.get('highScores');
      if (oldScores && oldScores.length > 0 && !oldScores[0].version) {
        const newScores = oldScores.map(score => ({
          ...score,
          version: '1.1.0'
        }));
        storage.set('highScores', newScores, { debounce: false });
      }

      // Migrate player learning data
      const oldLearning = storage.get('playerLearningData');
      if (oldLearning && !oldLearning.version) {
        const newLearning = {
          ...oldLearning,
          lastUpdated: new Date().toISOString(),
          version: '1.1.0',
          // Add new fields
          totalPlayTime: oldLearning.totalPlayTime || 0,
          favoriteDifficulty: oldLearning.favoriteDifficulty || 'medium',
          preferredPersonality: oldLearning.preferredPersonality || 'balanced'
        };
        storage.set('playerLearningData', newLearning, { debounce: false });
      }

      return { success: true, migratedItems: 5 };
    });

    // Future migrations can be added here
    // this.migrations.set('1.1.0', (storage) => { ... });
  }

  async migrateIfNeeded() {
    try {
      const currentStoredVersion = storageManager.get('dataVersion', '1.0.0');
      
      // Ensure we have a string version
      let versionString = '1.0.0';
      if (typeof currentStoredVersion === 'string') {
        versionString = currentStoredVersion;
      } else if (currentStoredVersion && typeof currentStoredVersion === 'object' && currentStoredVersion.version) {
        versionString = currentStoredVersion.version;
      } else if (currentStoredVersion && typeof currentStoredVersion === 'object') {
        // If it's an object without a version property, treat as legacy data
        versionString = '1.0.0';
      }
      
      if (versionString === this.currentVersion) {
        console.log('Data is up to date');
        return { success: true, migrated: false };
      }

      console.log(`Migrating data from ${versionString} to ${this.currentVersion}`);
      
      // Get all available migrations
      const migrationsToRun = this.getMigrationsToRun(versionString);
      
      let totalMigratedItems = 0;
      
      for (const [version, migrationFn] of migrationsToRun) {
        console.log(`Running migration for version ${version}...`);
        const result = migrationFn(storageManager);
        if (result && result.migratedItems) {
          totalMigratedItems += result.migratedItems;
        }
      }

      // Update to current version
      storageManager.set('dataVersion', this.currentVersion, { debounce: false });
      
      console.log(`Migration completed. ${totalMigratedItems} items migrated.`);
      
      return { 
        success: true, 
        migrated: true, 
        fromVersion: versionString,
        toVersion: this.currentVersion,
        migratedItems: totalMigratedItems
      };
      
    } catch (error) {
      console.error('Migration failed:', error);
      return { 
        success: false, 
        migrated: false, 
        error: error.message 
      };
    }
  }

  getMigrationsToRun(fromVersion) {
    const migrations = [];
    const versions = Array.from(this.migrations.keys()).sort();
    
    for (const version of versions) {
      if (this.compareVersions(version, fromVersion) > 0) {
        migrations.push([version, this.migrations.get(version)]);
      }
    }
    
    return migrations;
  }

  compareVersions(v1, v2) {
    // Ensure both parameters are strings
    const version1 = String(v1 || '0.0.0');
    const version2 = String(v2 || '0.0.0');
    
    const parts1 = version1.split('.').map(Number);
    const parts2 = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }
    
    return 0;
  }

  // Backup and restore functionality
  async createBackup() {
    try {
      const backup = {
        version: this.currentVersion,
        timestamp: new Date().toISOString(),
        data: {}
      };

      // Get all storage keys
      const keys = Object.keys(localStorage);
      
      for (const key of keys) {
        if (key.startsWith(storageManager.storagePrefix)) {
          const shortKey = key.replace(storageManager.storagePrefix, '');
          backup.data[shortKey] = storageManager.get(shortKey);
        }
      }

      // Save backup to localStorage with a unique name
      const backupKey = `backup_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(backup));
      
      console.log(`Backup created: ${backupKey}`);
      return { success: true, backupKey };
      
    } catch (error) {
      console.error('Backup creation failed:', error);
      return { success: false, error: error.message };
    }
  }

  async restoreBackup(backupKey) {
    try {
      const backupData = localStorage.getItem(backupKey);
      if (!backupData) {
        throw new Error('Backup not found');
      }

      const backup = JSON.parse(backupData);
      
      // Clear current data
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith(storageManager.storagePrefix)) {
          localStorage.removeItem(key);
        }
      }

      // Restore backup data
      for (const [key, value] of Object.entries(backup.data)) {
        storageManager.set(key, value, { debounce: false });
      }

      // Update version
      storageManager.set('dataVersion', backup.version, { debounce: false });
      
      console.log(`Backup restored from ${backup.timestamp}`);
      return { success: true, restoredVersion: backup.version };
      
    } catch (error) {
      console.error('Backup restoration failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Data validation and repair
  validateAndRepair() {
    try {
      const issues = [];
      const repairs = [];

      // Validate user profile
      const profile = storageManager.get('userProfile');
      if (profile && !profile.name) {
        issues.push('Invalid user profile: missing name');
        repairs.push(() => storageManager.remove('userProfile'));
      }

      // Validate game stats
      const stats = storageManager.get('gameStats');
      if (stats && typeof stats.gamesPlayed !== 'number') {
        issues.push('Invalid game stats: gamesPlayed is not a number');
        repairs.push(() => storageManager.remove('gameStats'));
      }

      // Validate settings
      const settings = storageManager.get('gameSettings');
      if (settings && typeof settings.soundEnabled !== 'boolean') {
        issues.push('Invalid settings: soundEnabled is not a boolean');
        repairs.push(() => storageManager.remove('gameSettings'));
      }

      // Perform repairs
      if (repairs.length > 0) {
        console.warn(`Found ${issues.length} data issues, attempting repairs...`);
        repairs.forEach(repair => repair());
      }

      return {
        success: true,
        issuesFound: issues.length,
        issues,
        repairsApplied: repairs.length
      };
      
    } catch (error) {
      console.error('Data validation failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const dataMigrationManager = new DataMigrationManager();

export default dataMigrationManager; 