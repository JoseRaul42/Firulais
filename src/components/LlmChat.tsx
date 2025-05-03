
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateResponse } from "@/utils/llmService";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LlmChatProps {
  parsedContext: string[];
  llmEndpoint: string;
  isConnected: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const LlmChat: React.FC<LlmChatProps> = ({ parsedContext, llmEndpoint, isConnected }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast: shadcnToast } = useToast();

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isConnected) return;
    
    const userMessage = inputValue;
    setInputValue('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Send message with context
    setIsLoading(true);
    
    try {
      const llmConfig = {
        provider: 'local' as const,
        localEndpoint: llmEndpoint
      };
      
      const response = await generateResponse(userMessage, parsedContext, llmConfig);
      
      if (!response) {
        throw new Error("Failed to get a response");
      }
      
      // Add assistant message to chat
      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (error: any) {
      console.error("Error communicating with LLM:", error);
      
      toast.error("LLM Communication Error");
      
      // Add error message to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Error: I couldn't reach the LLM server. Please check your connection and try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cyber-panel flex flex-col gap-2">
      <h2 className="text-sm font-medium cyber-text-glow mb-1">
        Tactical LLM Interface
      </h2>
      
      <ScrollArea className="flex-1 h-[400px] rounded border border-seal_brown-400 border-opacity-50 p-2 bg-ebony-100">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
            Messages will appear here. All queries will include parsed context.
          </div>
        ) : (
          <div className="space-y-3 pr-2">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`${
                  message.role === 'user' 
                    ? 'ml-auto bg-raw_umber-700 text-khaki-100' 
                    : 'mr-auto bg-seal_brown-300 text-foreground'
                } rounded-lg p-2 max-w-[85%] break-words`}
              >
                <p className="text-xxs font-medium mb-0.5 opacity-70">
                  { message.role === 'user' ? 'You' : 'LLM assistant'}
                </p>
                <p className="whitespace-pre-wrap text-xs">{message.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center my-2">
            <div className="cyber-text-glow animate-pulse text-xs">Processing...</div>
          </div>
        )}
      </ScrollArea>
      
      <div className="flex gap-2 mt-1">
        <input
          type="text"
          className="cyber-input flex-grow text-xs py-1.5"
          placeholder={isConnected ? "Enter your message..." : "Connect to LLM to start chatting"}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          disabled={!isConnected}
        />
        
        <button 
          className={`cyber-button-highlight px-3 py-1.5 text-xs ${(!isConnected || !inputValue.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSendMessage}
          disabled={!isConnected || !inputValue.trim() || isLoading}
        >
          Send
        </button>
      </div>
      
      <div className="text-xxs text-russet-700">
        <p>All messages include the parsed context for intelligent responses.</p>
      </div>
    </div>
  );
};

export default LlmChat;
