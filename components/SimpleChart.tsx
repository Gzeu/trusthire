'use client';

import React from 'react';

interface SimpleChartProps {
  data: Array<{
    date: string;
    value: number;
    label: string;
  }>;
  height?: number;
  color?: string;
}

export default function SimpleChart({ data, height = 200, color = '#8b5cf6' }: SimpleChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Trend Analysis</h3>
      
      <div className="relative" style={{ height }}>
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {/* Background grid */}
          {[...Array(5)].map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={i * 40 + 20}
              x2="400"
              y2={i * 40 + 20}
              stroke="#374151"
              strokeWidth="1"
            />
          ))}
          
          {/* Chart line */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={sortedData.map((d, i) => {
              const x = (i / (sortedData.length - 1)) * 360 + 40;
              const y = 200 - ((d.value / maxValue) * 160);
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data points */}
          {sortedData.map((d, i) => {
            const x = (i / (sortedData.length - 1)) * 360 + 40;
            const y = 200 - ((d.value / maxValue) * 160);
            const isLast = i === sortedData.length - 1;
            
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={color}
                  className="cursor-pointer hover:r-6 transition-all"
                />
                {!isLast && (
                  <line
                    x1={x}
                    y1={y}
                    x2={(i + 1) / (sortedData.length - 1) * 360 + 40}
                    y2={200 - ((sortedData[i + 1].value / maxValue) * 160)}
                    stroke={color}
                    strokeWidth="2"
                    strokeDasharray="2,2"
                  />
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Labels */}
        {sortedData.map((d, i) => {
          const x = (i / (sortedData.length - 1)) * 360 + 40;
          const isRight = x > 200;
          
          return (
            <text
              key={i}
              x={x}
              y={220}
              textAnchor={isRight ? 'start' : 'end'}
              className="text-xs fill-gray-400"
              dominantBaseline="middle"
            >
              {d.value}
            </text>
          );
        })}
      </div>
    </div>
  );
}
