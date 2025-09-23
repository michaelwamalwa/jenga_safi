import React from 'react';
import Icon from '../AppIcon.jsx';

const AlertFeed = ({ alerts, onAcknowledge }) => {
  const getAlertVariant = (type) => {
    const variants = {
      critical: {
        bg: 'bg-error/5',
        border: 'border-l-error',
        icon: { name: 'AlertOctagon', color: 'text-error' },
        badge: 'bg-error text-error-foreground'
      },
      warning: {
        bg: 'bg-warning/5',
        border: 'border-l-warning',
        icon: { name: 'AlertTriangle', color: 'text-warning' },
        badge: 'bg-warning text-warning-foreground'
      },
      info: {
        bg: 'bg-blue-500/5',
        border: 'border-l-blue-500',
        icon: { name: 'Info', color: 'text-blue-500' },
        badge: 'bg-blue-500 text-blue-50'
      },
      offline: {
        bg: 'bg-muted/30',
        border: 'border-l-muted-foreground',
        icon: { name: 'WifiOff', color: 'text-muted-foreground' },
        badge: 'bg-muted text-muted-foreground'
      },
      default: {
        bg: 'bg-muted/20',
        border: 'border-l-border',
        icon: { name: 'Bell', color: 'text-muted-foreground' },
        badge: 'bg-secondary text-secondary-foreground'
      }
    };
    return variants[type] || variants.default;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diff = Math.floor((now - alertTime) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return alertTime.toLocaleDateString(); // Show date if older than a day
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Icon name="AlertCircle" size={20} className="text-primary" />
            Live Site Alerts
          </h2>
          <div className="flex items-center space-x-2 bg-muted/50 px-3 py-1 rounded-full">
            {alerts?.length > 0 && (
              <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
            )}
            <span className="text-sm font-medium text-muted-foreground">
              {alerts?.length || 'No'} active
            </span>
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="max-h-[500px] overflow-y-auto">
        {alerts?.length === 0 ? (
          // Empty State
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="rounded-full bg-success/10 p-4 mb-3">
              <Icon name="CheckCircle" size={32} className="text-success" />
            </div>
            <h3 className="font-medium text-foreground mb-1">All Clear</h3>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              No active alerts. Monitoring for issues.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {alerts?.map((alert) => {
              const variant = getAlertVariant(alert?.type);
              return (
                <div
                  key={alert?.id}
                  className={`p-5 border-l-4 ${variant.border} ${variant.bg} transition-colors hover:opacity-90`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`rounded-full p-2 ${variant.bg}`}>
                      <Icon
                        name={variant.icon.name}
                        size={18}
                        className={variant.icon.color}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground line-clamp-1">
                            {alert?.site}
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${variant.badge}`}
                          >
                            {alert?.type}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(alert?.timestamp)}
                        </span>
                      </div>

                      {/* Message */}
                      <p className="text-sm text-foreground">{alert?.message}</p>

                      {/* Values */}
                      {(alert?.value || alert?.threshold) && (
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          {alert?.value && (
                            <span>
                              <strong>Reading:</strong> {alert.value}
                            </span>
                          )}
                          {alert?.threshold && (
                            <span>
                              <strong>Limit:</strong> {alert.threshold}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Acknowledge Button */}
                      {!alert?.acknowledged && (
                        <button
                          onClick={() => onAcknowledge(alert?.id)}
                          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 mt-1"
                        >
                          <Icon name="Check" size={12} />
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertFeed;