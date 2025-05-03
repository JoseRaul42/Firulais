
import React, { useState } from 'react';
import { Text } from 'lucide-react';

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
        <h2 className="text-lg font-semibold cyber-text-glow flex items-center gap-2">
          <Text className="h-5 w-5" />
          <span>Paste Raw Data</span>
        </h2>
      </div>
      
      <textarea
        className="flex-1 min-h-[200px] cyber-input font-mono text-sm resize-y"
        placeholder="Paste raw .pcap or log data here..."
        value={rawText}
        onChange={handleTextChange}
        spellCheck={false}
      />
      
      <p className="text-xs text-muted-foreground">
        Paste your raw data here to parse it using the specified algorithm.
      </p>
    </div>
  );
};

export default RawTextInput;
