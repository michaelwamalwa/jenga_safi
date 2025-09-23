import React from 'react';
import Icon from '../AppIcon';

const ConnectionStatus = ({ isConnected, lastUpdate, autoRefresh, onToggleAutoRefresh }) => {
  const formatLastUpdate = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Connection Status */}
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-error'}`} />
        <span className={`text-sm font-medium ${isConnected ? 'text-success' : 'text-error'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Last Update */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Icon name="RefreshCw" size={14} />
        <span>Updated {formatLastUpdate(lastUpdate)}</span>
      </div>

      {/* Auto Refresh Toggle */}
      <button
        onClick={onToggleAutoRefresh}
        className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-smooth ${
          autoRefresh
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        <Icon name={autoRefresh ? "Pause" : "Play"} size={14} />
        <span>{autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}</span>
      </button>
    </div>
  );
};

export default ConnectionStatus;