
import React, { useState } from 'react';
import { Copy, FileJson } from 'lucide-react';
import TokenCounter from './TokenCounter';
import { convertToJson } from '@/utils/parserUtils';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="cyber-panel flex flex-col gap-2">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-sm font-medium cyber-text-glow">
          {parsedData.length > 0 
            ? `Summarized Output (${parsedData.length} lines, ${totalEntries} entries)` 
            : "Parsed Output"
          }
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowJson(!showJson)}
            className={`cyber-button text-xs py-1 px-2 ${showJson ? 'border-raw_umber-500' : ''}`}
            title={showJson ? "View plain text" : "View as JSON"}
          >
            <FileJson className="h-3 w-3" />
            {showJson ? "Text" : "JSON"}
          </button>
          <button 
            onClick={handleCopyToClipboard}
            className="cyber-button text-xs py-1 px-2"
            title="Copy to clipboard"
          >
            <Copy className="h-3 w-3" />
            Copy
          </button>
          <button 
            onClick={handleExportJson}
            className="cyber-button-highlight text-xs py-1 px-2"
            title="Export as JSON file"
          >
            <FileJson className="h-3 w-3" />
            Export
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1 h-[400px] border border-primary border-opacity-30 rounded p-2 bg-ebony-100">
        {parsedData.length > 0 ? (
          <pre className="text-xxs font-mono whitespace-pre-wrap pr-2">
            {outputText}
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
            No parsed data to display
          </div>
        )}
      </ScrollArea>

      <TokenCounter text={outputText} />
    </div>
  );
};

export default ParserOutput;
