import React from 'react';
import Icon from '../AppIcon';

const KPICard = ({ title, value, unit, status, trend, icon, threshold, lastUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'text-error border-error bg-error/5';
      case 'warning':
        return 'text-warning border-warning bg-warning/5';
      case 'good':
        return 'text-success border-success bg-success/5';
      default:
        return 'text-muted-foreground border-border bg-card';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return { name: 'TrendingUp', color: 'text-error' };
    if (trend < 0) return { name: 'TrendingDown', color: 'text-success' };
    return { name: 'Minus', color: 'text-muted-foreground' };
  };

  const trendIcon = getTrendIcon(trend);

  return (
    <div className={`p-4 rounded-lg border-2 transition-smooth hover:shadow-card ${getStatusColor(status)}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name={icon} size={20} className="text-primary" />
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name={trendIcon?.name} size={16} className={trendIcon?.color} />
          <span className={`text-xs font-medium ${trendIcon?.color}`}>
            {Math.abs(trend)}%
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>

        {threshold && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Threshold: {threshold}</span>
            <span className={`font-medium ${getStatusColor(status)?.split(' ')?.[0]}`}>
              {status?.toUpperCase()}
            </span>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Updated {lastUpdate}
        </div>
      </div>
    </div>
  );
};

export default KPICard;