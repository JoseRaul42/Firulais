
import React from 'react';
import { estimateTokenCount } from '@/utils/parserUtils';
import { cn } from '@/lib/utils';

interface TokenCounterProps {
  text: string;
  maxTokens?: number;
}

const TokenCounter: React.FC<TokenCounterProps> = ({ text, maxTokens = 3000 }) => {
  const tokenCount = estimateTokenCount(text);
  const percentage = Math.min((tokenCount / maxTokens) * 100, 100);
  
  // Determine color based on percentage
  const getStatusColor = () => {
    if (percentage < 70) return 'text-seal_brown-700';
    if (percentage < 90) return 'text-lion-500';
    return 'text-russet-600';
  };
  
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center text-xs">
        <span className={cn("font-mono", getStatusColor())}>
          ~{tokenCount.toLocaleString()} tokens
        </span>
        <span className="text-russet-700">
          Max {maxTokens.toLocaleString()}
        </span>
      </div>
      
      <div className="h-1.5 w-full bg-seal_brown-300 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-300",
            percentage < 70 ? 'bg-seal_brown-600' : 
            percentage < 90 ? 'bg-lion-500' : 
            'bg-russet-600'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {tokenCount > maxTokens && (
        <p className="text-xs text-russet-600 mt-1">
          Warning: Exceeds recommended token limit
        </p>
      )}
    </div>
  );
};

export default TokenCounter;
