import React, { useState } from 'react';
import Icon from '../AppIcon';
const SiteSelector = ({ sites, selectedSite, onSiteChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'offline':
        return 'bg-error';
      default:
        return 'bg-muted-foreground';
    }
  };

  const selectedSiteData = sites?.find(site => site?.id === selectedSite);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-smooth min-w-64"
      >
        <Icon name="MapPin" size={16} className="text-primary" />
        <div className="flex-1 text-left">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-foreground">
              {selectedSiteData?.name || 'Select Site'}
            </span>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedSiteData?.status)}`} />
          </div>
          {selectedSiteData && (
            <span className="text-xs text-muted-foreground">
              {selectedSiteData?.sensors} sensors active
            </span>
          )}
        </div>
        <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-popover border border-border rounded-lg shadow-modal z-50">
          <div className="p-2">
            {sites?.map((site) => (
              <button
                key={site?.id}
                onClick={() => {
                  onSiteChange(site?.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left hover:bg-muted transition-smooth ${
                  selectedSite === site?.id ? 'bg-muted' : ''
                }`}
              >
                <Icon name="Building2" size={16} className="text-primary" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">{site?.name}</span>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(site?.status)}`} />
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{site?.sensors} sensors</span>
                    <span>{site?.location}</span>
                  </div>
                </div>
                {site?.alerts > 0 && (
                  <div className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full">
                    {site?.alerts}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteSelector;