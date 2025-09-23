import React, { useState } from 'react';
import Icon from '../AppIcon';
const TimeRangePicker = ({ selectedRange, onRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const timeRanges = [
    { value: '15min', label: 'Last 15 minutes', icon: 'Clock' },
    { value: '1hour', label: 'Last 1 hour', icon: 'Clock' },
    { value: '6hours', label: 'Last 6 hours', icon: 'Clock' },
    { value: '24hours', label: 'Last 24 hours', icon: 'Clock' },
    { value: 'custom', label: 'Custom Range', icon: 'Calendar' }
  ];

  const selectedRangeData = timeRanges?.find(range => range?.value === selectedRange);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-smooth"
      >
        <Icon name={selectedRangeData?.icon || 'Clock'} size={16} className="text-primary" />
        <span className="text-sm font-medium text-foreground">
          {selectedRangeData?.label || 'Select Range'}
        </span>
        <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-modal z-50">
          <div className="p-2">
            {timeRanges?.map((range) => (
              <button
                key={range?.value}
                onClick={() => {
                  onRangeChange(range?.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left hover:bg-muted transition-smooth ${
                  selectedRange === range?.value ? 'bg-muted' : ''
                }`}
              >
                <Icon name={range?.icon} size={16} className="text-primary" />
                <span className="text-sm text-foreground">{range?.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeRangePicker;