
import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import RawTextInput from '@/components/RawTextInput';
import ParserOutput from '@/components/ParserOutput';
import { parseRawText } from '@/utils/parserUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Text, Eye } from 'lucide-react';

const Index = () => {
  const [parsedData, setParsedData] = useState<string[]>([]);

  const handleRawTextChange = (text: string) => {
    const processed = parseRawText(text);
    setParsedData(processed);
  };

  const handleFileContent = (content: string) => {
    const processed = parseRawText(content);
    setParsedData(processed);
  };

  return (
    <div className="min-h-screen bg-cyber-darker text-foreground flex flex-col">
      <header className="py-6 px-4 md:px-8 border-b border-primary border-opacity-30">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight cyber-text-glow">
            Cyber Whisper Parser
          </h1>
          <p className="text-muted-foreground mt-1">
            Parse, condense, and optimize .pcap files for LLM processing
          </p>
        </div>
      </header>

      <main className="flex-1 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid gap-8">
          <div className="grid md:grid-cols-2 gap-6">
            <FileUpload onFileContent={handleFileContent} />

            <div className="cyber-panel">
              <h2 className="text-lg font-semibold cyber-text-glow flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5" />
                <span>System Overview</span>
              </h2>
              
              <div className="space-y-4 text-sm">
                <div className="bg-cyber-darker p-3 rounded border border-primary border-opacity-20">
                  <div className="font-medium text-cyber-amber mb-1">Parser Logic</div>
                  <pre className="text-xs overflow-x-auto p-2 bg-cyber-darker font-mono">
                    {`var processedLines = lines
  .Select(line => line.Split(']')[2])
  .Select(part => part.Split('[')[0])
  .Select(part => part.Split('"')[1])
  .ToList();`}
                  </pre>
                </div>

                <div>
                  <div className="font-medium mb-1">Optimization Goal</div>
                  <p className="text-muted-foreground">
                    Generate condensed output under 3,000 tokens optimized for LLM inference
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-cyber-darker p-3 rounded border border-primary border-opacity-20">
                    <div className="text-xs font-medium mb-1">Current Data Points</div>
                    <div className="text-xl font-mono text-cyber-blue">
                      {parsedData.length.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-cyber-darker p-3 rounded border border-primary border-opacity-20">
                    <div className="text-xs font-medium mb-1">Processing Status</div>
                    <div className={`text-sm font-medium ${parsedData.length > 0 ? 'text-cyber-blue' : 'text-muted-foreground'}`}>
                      {parsedData.length > 0 ? 'Data Ready' : 'Awaiting Input'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="input" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="input" className="flex gap-2 items-center">
                <Text className="h-4 w-4" />
                Input Raw Data
              </TabsTrigger>
              <TabsTrigger value="output" className="flex gap-2 items-center">
                <FileText className="h-4 w-4" />
                Processed Output
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="input" className="mt-0">
              <RawTextInput onRawTextChange={handleRawTextChange} />
            </TabsContent>
            
            <TabsContent value="output" className="mt-0">
              <ParserOutput parsedData={parsedData} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="py-4 px-4 md:px-8 border-t border-primary border-opacity-30 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto">
          Cyber Whisper Parser &mdash; Optimized for deuteranopia accessibility &mdash; Designed for LLM inference
        </div>
      </footer>
    </div>
  );
};

export default Index;
