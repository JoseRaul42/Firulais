
import React, { useState, useEffect } from 'react';
import { Text } from 'lucide-react';
import TokenCounter from './TokenCounter';

interface RawTextInputProps {
  onRawTextChange: (text: string) => void;
  initialText?: string;
}

const RawTextInput: React.FC<RawTextInputProps> = ({ onRawTextChange, initialText = '' }) => {
  const [rawText, setRawText] = useState(initialText);

  // Update internal state when initialText prop changes
  useEffect(() => {
    if (initialText !== rawText) {
      setRawText(initialText);
    }
  }, [initialText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setRawText(newText);
    onRawTextChange(newText);
  };

  return (
    <div className="cyber-panel flex flex-col gap-2">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-sm font-medium cyber-text-glow flex items-center gap-2 text-seal_brown-700">
          <Text className="h-4 w-4" />
          <span>Paste Raw Data</span>
        </h2>
      </div>
      
      <textarea
        className="flex-1 h-[400px] cyber-input font-mono text-xs resize-y border-seal_brown-400"
        placeholder="Paste raw .pcap or log data here..."
        value={rawText}
        onChange={handleTextChange}
        spellCheck={false}
      />
      
      <div className="flex flex-col gap-1">
        <TokenCounter text={rawText} maxTokens={3000} />
        <p className="text-xxs text-russet-700">
          Paste your raw data here to parse it using the specified algorithm.
        </p>
      </div>
    </div>
  );
};

export default RawTextInput;
