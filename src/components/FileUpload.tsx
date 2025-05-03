
import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { FileText, Upload } from 'lucide-react';

interface FileUploadProps {
  onFileContent: (content: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileContent }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    setIsLoading(true);
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileContent(content);
      setIsLoading(false);
    };
    reader.onerror = () => {
      console.error("Error reading file");
      setIsLoading(false);
    };
    reader.readAsText(file);
  }, [onFileContent]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, [processFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  }, [processFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={cn(
        "cyber-panel min-h-[200px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
        isDragging ? "border-cyber-glow glow-border" : "border-primary border-opacity-30",
        isLoading ? "opacity-70" : "opacity-100"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".pcap,.txt,.log,.json" 
        onChange={handleFileChange}
      />
      
      <div className="flex flex-col items-center gap-3 p-4">
        {isLoading ? (
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary bg-opacity-30"></div>
            <p className="text-center text-sm text-muted-foreground">Processing file...</p>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-3">
            <div className="bg-primary bg-opacity-20 rounded-full p-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="cyber-text-glow text-sm font-medium">{fileName}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Click or drag to upload a different file
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="bg-primary bg-opacity-20 rounded-full p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="cyber-text-glow text-sm font-medium">Drop .pcap or log files here</p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse files
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
