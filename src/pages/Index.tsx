
import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import RawTextInput from '@/components/RawTextInput';
import ParserOutput from '@/components/ParserOutput';
import LlmConnection from '@/components/LlmConnection';
import LlmChat from '@/components/LlmChat';
import { parseRawText } from '@/utils/parserUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Text, Eye, MessageSquare } from 'lucide-react';

const Index = () => {
  const [parsedData, setParsedData] = useState<string[]>([]);
  const [llmEndpoint, setLlmEndpoint] = useState<string>(localStorage.getItem('llmEndpoint') || 'http://localhost:11434');
  const [isLlmConnected, setIsLlmConnected] = useState<boolean>(false);

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
            Firulais
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
            
            <LlmConnection 
              onConnectionChange={setIsLlmConnected} 
              onEndpointChange={setLlmEndpoint} 
            />
          </div>

          <Tabs defaultValue="input" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="input" className="flex gap-2 items-center">
                <Text className="h-4 w-4" />
                Input Raw Data
              </TabsTrigger>
              <TabsTrigger value="output" className="flex gap-2 items-center">
                <FileText className="h-4 w-4" />
                Processed Output
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex gap-2 items-center">
                <MessageSquare className="h-4 w-4" />
                LLM Chat
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="input" className="mt-0">
              <RawTextInput onRawTextChange={handleRawTextChange} />
            </TabsContent>
            
            <TabsContent value="output" className="mt-0">
              <ParserOutput parsedData={parsedData} />
            </TabsContent>
            
            <TabsContent value="chat" className="mt-0">
              <LlmChat 
                parsedContext={parsedData} 
                llmEndpoint={llmEndpoint}
                isConnected={isLlmConnected}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="py-4 px-4 md:px-8 border-t border-primary border-opacity-30 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto">
          Firulais &mdash; Optimized for deuteranopia accessibility &mdash; Designed for Local LLM inference
        </div>
      </footer>
    </div>
  );
};

export default Index;
