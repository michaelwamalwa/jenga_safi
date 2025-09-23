import React from 'react';
import Icon from '../AppIcon';

const NEMAComplianceStatus = ({ complianceData }) => {
  const getComplianceColor = (status) => {
    switch (status) {
      case 'compliant':
        return 'text-success border-success bg-success/10';
      case 'warning':
        return 'text-warning border-warning bg-warning/10';
      case 'violation':
        return 'text-error border-error bg-error/10';
      default:
        return 'text-muted-foreground border-border bg-muted/10';
    }
  };

  const getComplianceIcon = (status) => {
    switch (status) {
      case 'compliant':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'violation':
        return 'XCircle';
      default:
        return 'Clock';
    }
  };

  return (
    <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg border ${getComplianceColor(complianceData?.status)}`}>
      <Icon 
        name={getComplianceIcon(complianceData?.status)} 
        size={20} 
        className={getComplianceColor(complianceData?.status)?.split(' ')?.[0]} 
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-foreground">NEMA Compliance</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getComplianceColor(complianceData?.status)}`}>
            {complianceData?.status?.toUpperCase()}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
          <span>Score: {complianceData?.score}/100</span>
          <span>•</span>
          <span>Next Report: {complianceData?.nextReport}</span>
        </div>
      </div>
      {complianceData?.violations > 0 && (
        <div className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
          {complianceData?.violations} violations
        </div>
      )}
    </div>
  );
};

export default NEMAComplianceStatus;