import React from 'react';
import { motion } from 'framer-motion';

interface CircularProgressProps {
  percentage: number;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  color?: string;
  strokeWidth?: number;
  showValue?: boolean;
  value?: string | number;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 'medium',
  color = '#007AFF',
  strokeWidth,
  showValue = true,
  value,
  className = '',
}) => {
  const sizes = {
    small: { dimension: 32, stroke: 3, fontSize: '10px' },
    medium: { dimension: 48, stroke: 4, fontSize: '12px' },
    large: { dimension: 80, stroke: 5, fontSize: '18px' },
    xlarge: { dimension: 120, stroke: 6, fontSize: '24px' },
  };

  const { dimension, stroke, fontSize } = sizes[size];
  const effectiveStrokeWidth = strokeWidth || stroke;

  const radius = (dimension - effectiveStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={dimension} height={dimension} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={effectiveStrokeWidth}
          fill="none"
          className="text-bg-tertiary-light dark:text-bg-tertiary-dark"
        />

        {/* Progress circle */}
        <motion.circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke={color}
          strokeWidth={effectiveStrokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
          }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>

      {/* Center value */}
      {showValue && (
        <div
          className="absolute inset-0 flex items-center justify-center font-semibold text-text-primary-light dark:text-text-primary-dark"
          style={{ fontSize }}
        >
          {value !== undefined ? value : `${Math.round(percentage)}%`}
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
