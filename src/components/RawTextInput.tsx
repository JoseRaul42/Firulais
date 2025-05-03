
import React, { useState } from 'react';
import { Text } from 'lucide-react';
import TokenCounter from './TokenCounter';

interface RawTextInputProps {
  onRawTextChange: (text: string) => void;
}

const RawTextInput: React.FC<RawTextInputProps> = ({ onRawTextChange }) => {
  const [rawText, setRawText] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setRawText(newText);
    onRawTextChange(newText);
  };

  return (
    <div className="cyber-panel flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold cyber-text-glow flex items-center gap-2 text-cyber-mutedLight">
          <Text className="h-5 w-5" />
          <span>Paste Raw Data</span>
        </h2>
      </div>
      
      <textarea
        className="flex-1 min-h-[200px] cyber-input font-mono text-sm resize-y border-cyber-muted"
        placeholder="Paste raw .pcap or log data here..."
        value={rawText}
        onChange={handleTextChange}
        spellCheck={false}
      />
      
      <div className="flex flex-col gap-2">
        <TokenCounter text={rawText} maxTokens={3000} />
        <p className="text-xs text-muted-foreground">
          Paste your raw data here to parse it using the specified algorithm.
        </p>
      </div>
    </div>
  );
};

export default RawTextInput;
