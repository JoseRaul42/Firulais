
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
    if (percentage < 70) return 'text-cyber-blue';
    if (percentage < 90) return 'text-cyber-amber';
    return 'text-cyber-orange';
  };
  
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center text-xs">
        <span className={cn("font-mono", getStatusColor())}>
          ~{tokenCount.toLocaleString()} tokens
        </span>
        <span className="text-muted-foreground">
          Max {maxTokens.toLocaleString()}
        </span>
      </div>
      
      <div className="h-1.5 w-full bg-cyber-darker rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-300",
            percentage < 70 ? 'bg-cyber-blue' : 
            percentage < 90 ? 'bg-cyber-amber' : 
            'bg-cyber-orange'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {tokenCount > maxTokens && (
        <p className="text-xs text-cyber-orange mt-1">
          Warning: Exceeds recommended token limit
        </p>
      )}
    </div>
  );
};

export default TokenCounter;
