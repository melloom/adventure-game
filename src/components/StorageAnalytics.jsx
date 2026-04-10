import React, { useState, useEffect } from 'react';
import storageManager from '../utils/storageManager';
import dataMigrationManager from '../utils/dataMigration';

const StorageAnalytics = () => {
  const [storageInfo, setStorageInfo] = useState(null);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [backups, setBackups] = useState([]);
  const [showBackups, setShowBackups] = useState(false);

  useEffect(() => {
    updateStorageInfo();
    checkMigrationStatus();
    loadBackups();
  }, []);

  const loadBackups = () => {
    try {
      const backupList = dataMigrationManager.listBackups();
      setBackups(backupList);
    } catch (error) {
      console.error('Failed to load backups:', error);
      setBackups([]);
    }
  };

  const handleCleanupBackups = async () => {
    setIsLoading(true);
    setLastAction(null);
    try {
      const result = dataMigrationManager.cleanupOldBackups(3);
      if (result.success) {
        setLastAction({ type: 'backup-cleanup', success: true, message: `Cleaned up ${result.deletedCount} old backups` });
        loadBackups();
      } else {
        setLastAction({ type: 'backup-cleanup', success: false, message: 'Backup cleanup failed: ' + result.error });
      }
    } catch (error) {
      console.error('Backup cleanup failed:', error);
      setLastAction({ type: 'backup-cleanup', success: false, message: 'Backup cleanup failed: ' + error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBackup = async (backupKey) => {
    if (!window.confirm('Are you sure you want to delete this backup?')) {
      return;
    }
    
    setIsLoading(true);
    setLastAction(null);
    try {
      const result = dataMigrationManager.deleteBackup(backupKey);
      if (result.success) {
        setLastAction({ type: 'backup-delete', success: true, message: 'Backup deleted successfully' });
        loadBackups();
      } else {
        setLastAction({ type: 'backup-delete', success: false, message: 'Backup deletion failed: ' + result.error });
      }
    } catch (error) {
      console.error('Backup deletion failed:', error);
      setLastAction({ type: 'backup-delete', success: false, message: 'Backup deletion failed: ' + error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStorageInfo = () => {
    try {
      const info = storageManager.getStorageUsage();
      setStorageInfo(info);
    } catch (error) {
      console.error('Failed to get storage info:', error);
      setStorageInfo({ used: 0, available: 0, percentage: 0, error: true });
    }
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
    setLastAction(null);
    try {
      const cleanedCount = storageManager.cleanup(7);
      setLastAction({ type: 'cleanup', success: true, message: `Cleaned up ${cleanedCount} old storage items` });
      updateStorageInfo();
      loadBackups(); // Refresh backup list in case backups were affected
    } catch (error) {
      console.error('Cleanup failed:', error);
      setLastAction({ type: 'cleanup', success: false, message: 'Cleanup failed: ' + error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setIsLoading(true);
    setLastAction(null);
    try {
      const result = await dataMigrationManager.createBackup();
      if (result.success) {
        setLastAction({ type: 'backup', success: true, message: `Backup created successfully! Key: ${result.backupKey}` });
        loadBackups(); // Refresh backup list
      } else {
        setLastAction({ type: 'backup', success: false, message: 'Backup creation failed: ' + result.error });
      }
    } catch (error) {
      console.error('Backup creation failed:', error);
      setLastAction({ type: 'backup', success: false, message: 'Backup creation failed: ' + error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateAndRepair = async () => {
    setIsLoading(true);
    setLastAction(null);
    try {
      const result = dataMigrationManager.validateAndRepair();
      if (result.success) {
        if (result.issuesFound > 0) {
          setLastAction({ type: 'repair', success: true, message: `Found and repaired ${result.issuesFound} data issues` });
        } else {
          setLastAction({ type: 'repair', success: true, message: 'No data issues found' });
        }
      } else {
        setLastAction({ type: 'repair', success: false, message: 'Validation failed: ' + result.error });
      }
    } catch (error) {
      console.error('Validation failed:', error);
      setLastAction({ type: 'repair', success: false, message: 'Validation failed: ' + error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAllData = async () => {
    if (!window.confirm('Are you sure you want to clear ALL game data? This action cannot be undone!')) {
      return;
    }
    
    setIsLoading(true);
    setLastAction(null);
    try {
      const clearedCount = storageManager.clearAll();
      setLastAction({ type: 'clear', success: true, message: `Cleared ${clearedCount} storage items` });
      updateStorageInfo();
    } catch (error) {
      console.error('Clear all failed:', error);
      setLastAction({ type: 'clear', success: false, message: 'Clear all failed: ' + error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    setLastAction(null);
    try {
      const stats = storageManager.getStorageStats();
      const exportData = {
        version: '1.1.0',
        timestamp: new Date().toISOString(),
        stats,
        data: {}
      };

      // Export all data
      const keys = storageManager.getAllKeys();
      for (const key of keys) {
        const shortKey = key.replace(storageManager.storagePrefix, '');
        exportData.data[shortKey] = storageManager.get(shortKey);
      }

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wyr-game-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLastAction({ type: 'export', success: true, message: 'Data exported successfully!' });
    } catch (error) {
      console.error('Export failed:', error);
      setLastAction({ type: 'export', success: false, message: 'Export failed: ' + error.message });
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

  const getStorageStatus = (percentage) => {
    if (percentage < 50) return { text: 'Good', icon: '✅' };
    if (percentage < 80) return { text: 'Warning', icon: '⚠️' };
    return { text: 'Critical', icon: '🚨' };
  };

  if (!storageInfo) {
    return (
      <div className="storage-loading">
        <div className="loading-spinner"></div>
        <p>Loading storage information...</p>
      </div>
    );
  }

  const storageStatus = getStorageStatus(storageInfo.percentage);

  return (
    <div className="storage-analytics">
      {/* Storage Overview Card */}
      <div className="storage-overview-card">
        <div className="storage-header">
          <h3>Storage Usage</h3>
          <div className={`storage-status ${storageStatus.text.toLowerCase()}`}>
            <span>{storageStatus.icon}</span>
            <span>{storageStatus.text}</span>
          </div>
        </div>
        
        <div className="storage-progress">
          <div className="storage-bar">
            <div 
              className="storage-fill"
              style={{ 
                width: `${Math.min(storageInfo.percentage, 100)}%`,
                backgroundColor: getStorageColor(storageInfo.percentage)
              }}
            />
          </div>
          <div className="storage-percentage">{storageInfo.percentage.toFixed(1)}%</div>
        </div>
        
        <div className="storage-details">
          <div className="detail-item">
            <span className="detail-label">Used:</span>
            <span className="detail-value">{formatBytes(storageInfo.used)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Available:</span>
            <span className="detail-value">{formatBytes(storageInfo.available)}</span>
          </div>
        </div>
      </div>

      {/* Migration Status Card */}
      {migrationStatus && (
        <div className={`migration-card ${migrationStatus.success ? 'success' : 'error'}`}>
          <h3>Data Migration Status</h3>
          {migrationStatus.migrated ? (
            <div className="migration-content">
              <div className="migration-icon">✅</div>
              <div className="migration-text">
                <p>Data migrated from v{migrationStatus.fromVersion} to v{migrationStatus.toVersion}</p>
                <p className="migration-detail">{migrationStatus.migratedItems} items migrated successfully</p>
              </div>
            </div>
          ) : migrationStatus.error ? (
            <div className="migration-content">
              <div className="migration-icon">❌</div>
              <div className="migration-text">
                <p>Migration failed: {migrationStatus.error}</p>
              </div>
            </div>
          ) : (
            <div className="migration-content">
              <div className="migration-icon">✅</div>
              <div className="migration-text">
                <p>Data is up to date</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Results */}
      {lastAction && (
        <div className={`action-result ${lastAction.success ? 'success' : 'error'}`}>
          <div className="result-icon">{lastAction.success ? '✅' : '❌'}</div>
          <div className="result-message">{lastAction.message}</div>
          <button 
            className="result-close"
            onClick={() => setLastAction(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="storage-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <button 
            onClick={handleCleanup}
            disabled={isLoading}
            className="action-btn cleanup"
          >
            <div className="btn-icon">🧹</div>
            <div className="btn-content">
              <div className="btn-title">Clean Old Data</div>
              <div className="btn-subtitle">Remove outdated cache</div>
            </div>
            {isLoading && <div className="btn-loading">...</div>}
          </button>
          
          <button 
            onClick={handleCreateBackup}
            disabled={isLoading}
            className="action-btn backup"
          >
            <div className="btn-icon">💾</div>
            <div className="btn-content">
              <div className="btn-title">Create Backup</div>
              <div className="btn-subtitle">Save current data</div>
            </div>
            {isLoading && <div className="btn-loading">...</div>}
          </button>
          
          <button 
            onClick={handleValidateAndRepair}
            disabled={isLoading}
            className="action-btn repair"
          >
            <div className="btn-icon">🔧</div>
            <div className="btn-content">
              <div className="btn-title">Validate & Repair</div>
              <div className="btn-subtitle">Fix data issues</div>
            </div>
            {isLoading && <div className="btn-loading">...</div>}
          </button>

          <button 
            onClick={handleExportData}
            disabled={isLoading}
            className="action-btn export"
          >
            <div className="btn-icon">📤</div>
            <div className="btn-content">
              <div className="btn-title">Export Data</div>
              <div className="btn-subtitle">Download as JSON</div>
            </div>
            {isLoading && <div className="btn-loading">...</div>}
          </button>

          <button 
            onClick={handleClearAllData}
            disabled={isLoading}
            className="action-btn clear-all"
          >
            <div className="btn-icon">🗑️</div>
            <div className="btn-content">
              <div className="btn-title">Clear All Data</div>
              <div className="btn-subtitle">Reset everything</div>
            </div>
            {isLoading && <div className="btn-loading">...</div>}
          </button>
        </div>
      </div>

      {/* Backup Management Section */}
      <div className="backup-section">
        <button 
          onClick={() => setShowBackups(!showBackups)}
          className="toggle-backups"
        >
          <span>{showBackups ? 'Hide' : 'Show'} Backup Management</span>
          <span className="toggle-icon">{showBackups ? '▼' : '▶'}</span>
        </button>
        
        {showBackups && (
          <div className="backup-options">
            <div className="backup-header">
              <h3>Backup Management</h3>
              <button 
                onClick={handleCleanupBackups}
                disabled={isLoading}
                className="cleanup-backups-btn"
              >
                🧹 Clean Old Backups
              </button>
            </div>
            
            {backups.length > 0 ? (
              <div className="backup-list">
                {backups.map((backup, index) => (
                  <div key={backup.key} className="backup-item">
                    <div className="backup-info">
                      <div className="backup-date">
                        {new Date(backup.timestamp).toLocaleString()}
                      </div>
                      <div className="backup-details">
                        <span>Version: {backup.version}</span>
                        <span>Items: {backup.dataKeys}</span>
                      </div>
                    </div>
                    <div className="backup-actions">
                      <button 
                        onClick={() => handleDeleteBackup(backup.key)}
                        disabled={isLoading}
                        className="delete-backup-btn"
                        title="Delete backup"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-backups">
                <p>No backups found. Create your first backup using the "Create Backup" button above.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Section */}
      <div className="advanced-section">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="toggle-advanced"
        >
          <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Options</span>
          <span className="toggle-icon">{showAdvanced ? '▼' : '▶'}</span>
        </button>
        
        {showAdvanced && (
          <div className="advanced-options">
            <h3>Advanced Storage Management</h3>
            
            <div className="option-group">
              <h4>Storage Details</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Cache Size:</span>
                  <span className="detail-value">{storageManager.cache?.size || 0} items</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Debounce Delay:</span>
                  <span className="detail-value">{storageManager.debounceDelay || 300}ms</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Storage Prefix:</span>
                  <span className="detail-value">{storageManager.storagePrefix || 'wyr_'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total Keys:</span>
                  <span className="detail-value">{storageManager.getAllKeys().length}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Max Cache Size:</span>
                  <span className="detail-value">{storageManager.maxCacheSize || 50} items</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Data Version:</span>
                  <span className="detail-value">{storageManager.get('dataVersion', '1.0.0')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .storage-analytics {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .storage-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 20px;
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .storage-overview-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .storage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .storage-header h3 {
          margin: 0;
          color: #fff;
          font-size: 1.1rem;
        }

        .storage-status {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .storage-status.good {
          background: rgba(76, 175, 80, 0.2);
          color: #4CAF50;
        }

        .storage-status.warning {
          background: rgba(255, 152, 0, 0.2);
          color: #FF9800;
        }

        .storage-status.critical {
          background: rgba(244, 67, 54, 0.2);
          color: #F44336;
        }

        .storage-progress {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .storage-bar {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .storage-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .storage-percentage {
          font-weight: 600;
          color: #fff;
          min-width: 50px;
        }

        .storage-details {
          display: flex;
          gap: 20px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 0.8rem;
          color: #ccc;
        }

        .detail-value {
          font-weight: 600;
          color: #fff;
        }

        .migration-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .migration-card.success {
          border-color: rgba(76, 175, 80, 0.3);
        }

        .migration-card.error {
          border-color: rgba(244, 67, 54, 0.3);
        }

        .migration-card h3 {
          margin: 0 0 12px 0;
          color: #fff;
          font-size: 1rem;
        }

        .migration-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .migration-icon {
          font-size: 1.2rem;
        }

        .migration-text p {
          margin: 0;
          color: #fff;
          font-size: 0.9rem;
        }

        .migration-detail {
          color: #ccc !important;
          font-size: 0.8rem !important;
        }

        .action-result {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          position: relative;
        }

        .action-result.success {
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
        }

        .action-result.error {
          background: rgba(244, 67, 54, 0.1);
          border: 1px solid rgba(244, 67, 54, 0.3);
        }

        .result-icon {
          font-size: 1.1rem;
        }

        .result-message {
          flex: 1;
          color: #fff;
          font-size: 0.9rem;
        }

        .result-close {
          background: none;
          border: none;
          color: #ccc;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .result-close:hover {
          color: #fff;
        }

        .storage-actions h3 {
          margin: 0 0 16px 0;
          color: #fff;
          font-size: 1.1rem;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .action-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-btn.clear-all:hover:not(:disabled) {
          background: rgba(244, 67, 54, 0.2);
          border-color: rgba(244, 67, 54, 0.5);
        }

        .action-btn.export:hover:not(:disabled) {
          background: rgba(33, 150, 243, 0.2);
          border-color: rgba(33, 150, 243, 0.5);
        }

        .btn-icon {
          font-size: 1.5rem;
        }

        .btn-content {
          flex: 1;
          text-align: left;
        }

        .btn-title {
          font-weight: 600;
          margin-bottom: 2px;
        }

        .btn-subtitle {
          font-size: 0.8rem;
          color: #ccc;
        }

        .btn-loading {
          position: absolute;
          top: 50%;
          right: 16px;
          transform: translateY(-50%);
          font-size: 1.2rem;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .advanced-section {
          margin-top: 8px;
        }

        .toggle-advanced {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .toggle-advanced:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .toggle-icon {
          font-size: 0.9rem;
        }

        .advanced-options {
          margin-top: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .backup-section {
          margin-top: 8px;
        }

        .toggle-backups {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .toggle-backups:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .backup-options {
          margin-top: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .backup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .backup-header h3 {
          margin: 0;
          color: #fff;
          font-size: 1rem;
        }

        .cleanup-backups-btn {
          padding: 8px 12px;
          background: rgba(255, 152, 0, 0.2);
          border: 1px solid rgba(255, 152, 0, 0.3);
          border-radius: 6px;
          color: #FF9800;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .cleanup-backups-btn:hover:not(:disabled) {
          background: rgba(255, 152, 0, 0.3);
        }

        .cleanup-backups-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .backup-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .backup-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .backup-info {
          flex: 1;
        }

        .backup-date {
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }

        .backup-details {
          display: flex;
          gap: 16px;
          font-size: 0.8rem;
          color: #ccc;
        }

        .backup-actions {
          display: flex;
          gap: 8px;
        }

        .delete-backup-btn {
          padding: 6px 8px;
          background: rgba(244, 67, 54, 0.2);
          border: 1px solid rgba(244, 67, 54, 0.3);
          border-radius: 4px;
          color: #F44336;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .delete-backup-btn:hover:not(:disabled) {
          background: rgba(244, 67, 54, 0.3);
        }

        .delete-backup-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .no-backups {
          text-align: center;
          padding: 20px;
          color: #ccc;
          font-style: italic;
        }

        .advanced-options h3 {
          margin: 0 0 16px 0;
          color: #fff;
          font-size: 1rem;
        }

        .option-group h4 {
          margin: 0 0 12px 0;
          color: #ccc;
          font-size: 0.9rem;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        @media (max-width: 600px) {
          .action-grid {
            grid-template-columns: 1fr;
          }
          
          .storage-details {
            flex-direction: column;
            gap: 12px;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default StorageAnalytics; 