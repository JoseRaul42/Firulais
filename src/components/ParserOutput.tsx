import React, { useState } from 'react';
import { Copy, FileJson } from 'lucide-react';
import TokenCounter from './TokenCounter';
import { convertToJson } from '@/utils/parserUtils';
import { useToast } from "@/hooks/use-toast";

interface ParserOutputProps {
  parsedData: string[];
}

const ParserOutput: React.FC<ParserOutputProps> = ({ parsedData }) => {
  const [showJson, setShowJson] = useState(false);
  const { toast } = useToast();
  const outputText = showJson 
    ? convertToJson(parsedData) 
    : parsedData.join('\n');

  // Function to extract count from summarized line for display
  const extractTotalEntries = (): number => {
    if (parsedData.length === 0) return 0;
    
    let totalCount = 0;
    parsedData.forEach(line => {
      const match = line.match(/\((\d+)\)$/);
      if (match && match[1]) {
        totalCount += parseInt(match[1]);
      } else {
        totalCount += 1; // If no count found, assume 1
      }
    });
    return totalCount;
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "Copied to clipboard",
        description: "The parsed content has been copied to your clipboard.",
        duration: 2000,
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportJson = async () => {
    try {
      const jsonContent = convertToJson(parsedData);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'parsed_data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "JSON file has been downloaded.",
        duration: 2000,
      });
    } catch (error) {
      console.error("Failed to export:", error);
      toast({
        title: "Export failed",
        description: "Could not export JSON. Please try again.",
        variant: "destructive",
      });
    }
  };

  const totalEntries = extractTotalEntries();

  return (
    <div className="cyber-panel flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold cyber-text-glow">
          {parsedData.length > 0 
            ? `Summarized Output (${parsedData.length} unique lines, ${totalEntries} total entries)` 
            : "Parsed Output"
          }
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowJson(!showJson)}
            className={`cyber-button text-xs ${showJson ? 'border-raw_umber-500' : ''}`}
            title={showJson ? "View plain text" : "View as JSON"}
          >
            <FileJson className="h-4 w-4" />
            {showJson ? "Text" : "JSON"}
          </button>
          <button 
            onClick={handleCopyToClipboard}
            className="cyber-button text-xs"
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
          <button 
            onClick={handleExportJson}
            className="cyber-button-highlight text-xs"
            title="Export as JSON file"
          >
            <FileJson className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[200px] max-h-[400px] overflow-auto bg-ebony-100 rounded border border-primary border-opacity-30 p-4">
        {parsedData.length > 0 ? (
          <pre className="text-xs font-mono whitespace-pre-wrap">
            {outputText}
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
            No parsed data to display
          </div>
        )}
      </div>

      <TokenCounter text={outputText} />
    </div>
  );
};

export default ParserOutput;
