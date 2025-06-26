import React, { useState, useEffect } from 'react';
import storageManager from '../utils/storageManager';
import dataMigrationManager from '../utils/dataMigration';

const StorageAnalytics = () => {
  const [storageInfo, setStorageInfo] = useState(null);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    updateStorageInfo();
    checkMigrationStatus();
  }, []);

  const updateStorageInfo = () => {
    const info = storageManager.getStorageUsage();
    setStorageInfo(info);
  };

  const checkMigrationStatus = async () => {
    setIsLoading(true);
    try {
      const status = await dataMigrationManager.migrateIfNeeded();
      setMigrationStatus(status);
    } catch (error) {
      console.error('Migration check failed:', error);
      setMigrationStatus({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      const cleanedCount = storageManager.cleanup(7);
      alert(`Cleaned up ${cleanedCount} old storage items`);
      updateStorageInfo();
    } catch (error) {
      console.error('Cleanup failed:', error);
      alert('Cleanup failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setIsLoading(true);
    try {
      const result = await dataMigrationManager.createBackup();
      if (result.success) {
        alert(`Backup created successfully! Key: ${result.backupKey}`);
      } else {
        alert('Backup creation failed: ' + result.error);
      }
    } catch (error) {
      console.error('Backup creation failed:', error);
      alert('Backup creation failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateAndRepair = async () => {
    setIsLoading(true);
    try {
      const result = dataMigrationManager.validateAndRepair();
      if (result.success) {
        if (result.issuesFound > 0) {
          alert(`Found and repaired ${result.issuesFound} data issues`);
        } else {
          alert('No data issues found');
        }
      } else {
        alert('Validation failed: ' + result.error);
      }
    } catch (error) {
      console.error('Validation failed:', error);
      alert('Validation failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageColor = (percentage) => {
    if (percentage < 50) return '#4CAF50';
    if (percentage < 80) return '#FF9800';
    return '#F44336';
  };

  if (!storageInfo) {
    return <div className="loading">Loading storage information...</div>;
  }

  return (
    <div className="storage-analytics">
      <h2>Storage Analytics</h2>
      
      <div className="storage-overview">
        <h3>Storage Usage</h3>
        <div className="storage-bar">
          <div 
            className="storage-fill"
            style={{ 
              width: `${Math.min(storageInfo.percentage, 100)}%`,
              backgroundColor: getStorageColor(storageInfo.percentage)
            }}
          />
        </div>
        <div className="storage-details">
          <span>Used: {formatBytes(storageInfo.used)}</span>
          <span>Available: {formatBytes(storageInfo.available)}</span>
          <span>{storageInfo.percentage.toFixed(1)}% used</span>
        </div>
      </div>

      {migrationStatus && (
        <div className={`migration-status ${migrationStatus.success ? 'success' : 'error'}`}>
          <h3>Data Migration Status</h3>
          {migrationStatus.migrated ? (
            <div>
              <p>✅ Data migrated from v{migrationStatus.fromVersion} to v{migrationStatus.toVersion}</p>
              <p>{migrationStatus.migratedItems} items migrated successfully</p>
            </div>
          ) : migrationStatus.error ? (
            <p>❌ Migration failed: {migrationStatus.error}</p>
          ) : (
            <p>✅ Data is up to date</p>
          )}
        </div>
      )}

      <div className="storage-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button 
            onClick={handleCleanup}
            disabled={isLoading}
            className="action-btn cleanup"
          >
            {isLoading ? 'Cleaning...' : 'Clean Old Data'}
          </button>
          
          <button 
            onClick={handleCreateBackup}
            disabled={isLoading}
            className="action-btn backup"
          >
            {isLoading ? 'Creating...' : 'Create Backup'}
          </button>
          
          <button 
            onClick={handleValidateAndRepair}
            disabled={isLoading}
            className="action-btn repair"
          >
            {isLoading ? 'Validating...' : 'Validate & Repair'}
          </button>
        </div>
      </div>

      <div className="advanced-section">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="toggle-advanced"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>
        
        {showAdvanced && (
          <div className="advanced-options">
            <h3>Advanced Storage Management</h3>
            
            <div className="option-group">
              <h4>Storage Details</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span>Cache Size:</span>
                  <span>{storageManager.cache.size} items</span>
                </div>
                <div className="detail-item">
                  <span>Debounce Delay:</span>
                  <span>{storageManager.debounceDelay}ms</span>
                </div>
                <div className="detail-item">
                  <span>Storage Prefix:</span>
                  <span>{storageManager.storagePrefix}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageAnalytics; 