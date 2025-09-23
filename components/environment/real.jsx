import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const RealTimeChart = ({ data, title, dataKey, color, threshold, unit }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-md p-3 shadow-modal">
          <p className="text-sm font-medium text-foreground">{`Time: ${label}`}</p>
          <p className="text-sm text-primary">
            {`${title}: ${payload?.[0]?.value} ${unit}`}
          </p>
          {threshold && (
            <p className="text-xs text-muted-foreground">
              {`Threshold: ${threshold} ${unit}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full bg-${color}`} />
          <span className="text-sm text-muted-foreground">Live Data</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {threshold && (
              <ReferenceLine 
                y={threshold} 
                stroke="var(--color-error)" 
                strokeDasharray="5 5"
                label={{ value: "Threshold", position: "topRight" }}
              />
            )}
            
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={`var(--color-${color})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: `var(--color-${color})` }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealTimeChart;