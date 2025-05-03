
import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import RawTextInput from '@/components/RawTextInput';
import ParserOutput from '@/components/ParserOutput';
import LlmConnection from '@/components/LlmConnection';
import LlmChat from '@/components/LlmChat';
import { parseRawText } from '@/utils/parserUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Text, MessageSquare } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const [parsedData, setParsedData] = useState<string[]>([]);
  const [rawText, setRawText] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [llmEndpoint, setLlmEndpoint] = useState<string>(localStorage.getItem('llmEndpoint') || 'http://localhost:11434');
  const [isLlmConnected, setIsLlmConnected] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('input');

  const handleRawTextChange = (text: string) => {
    setRawText(text);
    const processed = parseRawText(text);
    setParsedData(processed);
  };

  const handleFileContent = (content: string) => {
    setRawText(content);
    const processed = parseRawText(content);
    setParsedData(processed);
  };

  const handleChatMessagesChange = (messages: Message[]) => {
    setChatMessages(messages);
  };

  return (
    <div className="min-h-screen bg-cyber-darker text-foreground flex flex-col">
      <header className="py-3 px-3 md:px-5 border-b border-primary border-opacity-30">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold tracking-tight cyber-text-glow">
            Firulais 🐶
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Parse, condense, and optimize .pcap files for LLM processing
          </p>
        </div>
      </header>

      <main className="flex-1 py-3 px-3 md:px-5 overflow-y-auto">
        <div className="max-w-7xl mx-auto grid gap-4">
          <div className="grid md:grid-cols-2 gap-3">
            <FileUpload onFileContent={handleFileContent} />
            
            <LlmConnection 
              onConnectionChange={setIsLlmConnected} 
              onEndpointChange={setLlmEndpoint} 
            />
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-2 h-8">
              <TabsTrigger value="input" className="flex gap-1 items-center text-xs">
                <Text className="h-3 w-3" />
                Input
              </TabsTrigger>
              <TabsTrigger value="output" className="flex gap-1 items-center text-xs">
                <FileText className="h-3 w-3" />
                Output
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex gap-1 items-center text-xs">
                <MessageSquare className="h-3 w-3" />
                Chat
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="input" className="mt-0">
              <RawTextInput onRawTextChange={handleRawTextChange} initialText={rawText} />
            </TabsContent>
            
            <TabsContent value="output" className="mt-0">
              <ParserOutput parsedData={parsedData} />
            </TabsContent>
            
            <TabsContent value="chat" className="mt-0">
              <LlmChat 
                parsedContext={parsedData} 
                llmEndpoint={llmEndpoint}
                isConnected={isLlmConnected}
                messages={chatMessages}
                onMessagesChange={handleChatMessagesChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="py-2 px-3 md:px-5 border-t border-primary border-opacity-30 text-center text-xxs text-muted-foreground">
        <div className="max-w-7xl mx-auto">
          Firulais 🐶 &mdash; Optimized for deuteranopia accessibility &mdash; Designed for Local LLM inference
        </div>
      </footer>
    </div>
  );
};

export default Index;
