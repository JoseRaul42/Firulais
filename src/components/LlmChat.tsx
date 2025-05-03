
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateResponse } from "@/utils/llmService";
import { toast } from "sonner";

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
    <div className="cyber-panel flex flex-col gap-4">
      <h2 className="text-lg font-semibold cyber-text-glow">
        Tactical LLM Interface
      </h2>
      
      <div className="flex-1 min-h-[300px] max-h-[500px] overflow-y-auto bg-ebony-100 rounded border border-seal_brown-400 border-opacity-50 p-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
            Messages will appear here. All queries will include parsed context.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`${
                  message.role === 'user' 
                    ? 'ml-auto bg-raw_umber-700 text-khaki-900' 
                    : 'mr-auto bg-seal_brown-300 text-foreground'
                } rounded-lg p-3 max-w-[80%] break-words`}
              >
                <p className="text-xs font-medium mb-1 opacity-70">
                  {message.role === 'user' ? 'You' : 'LLM Assistant'}
                </p>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center my-4">
            <div className="cyber-text-glow animate-pulse">Processing...</div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          className="cyber-input flex-grow"
          placeholder={isConnected ? "Enter your message..." : "Connect to LLM to start chatting"}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          disabled={!isConnected}
        />
        
        <button 
          className={`cyber-button-highlight px-4 py-2 ${(!isConnected || !inputValue.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSendMessage}
          disabled={!isConnected || !inputValue.trim() || isLoading}
        >
          Send
        </button>
      </div>
      
      <div className="text-xs text-russet-700">
        <p>All messages include the parsed context for intelligent responses.</p>
      </div>
    </div>
  );
};

export default LlmChat;
