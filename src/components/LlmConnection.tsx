
import React, { useState, useEffect } from 'react';
import { Plug, RefreshCw, WifiOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { defaultLLMConfig, LLMConfig } from "@/utils/llmService";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface LlmConnectionProps {
  onConnectionChange: (connected: boolean) => void;
  onEndpointChange: (endpoint: string) => void;
}

const LlmConnection: React.FC<LlmConnectionProps> = ({ onConnectionChange, onEndpointChange }) => {
  const [endpoint, setEndpoint] = useState<string>(
    localStorage.getItem('llmEndpoint') || defaultLLMConfig.localEndpoint || 'http://localhost:11434'
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast: shadcnToast } = useToast();

  // Save endpoint to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('llmEndpoint', endpoint);
    onEndpointChange(endpoint);
  }, [endpoint, onEndpointChange]);

  const testConnection = async () => {
    setIsLoading(true);
    
    try {
      // First try a HEAD request to check if the server is responding
      try {
        const headResponse = await fetch(endpoint, {
          method: 'HEAD',
        });
        
        if (headResponse.ok) {
          setIsConnected(true);
          onConnectionChange(true);
          toast.success("Connection successful");
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log("HEAD request failed, trying OPTIONS...");
      }

      // If HEAD fails, try a simple OPTIONS request
      try {
        const optionsResponse = await fetch(endpoint, {
          method: 'OPTIONS',
        });
        
        if (optionsResponse.ok) {
          setIsConnected(true);
          onConnectionChange(true);
          toast.success("Connection successful");
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log("OPTIONS request failed, trying a minimal POST...");
      }
      
      // Last resort: try a minimal POST request that should be accepted by most LLM APIs
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'hello' }],
          max_tokens: 1
        }),
      });

      // Check if we got any response back, even an error
      const newConnectionStatus = response.status !== 0;
      setIsConnected(newConnectionStatus);
      onConnectionChange(newConnectionStatus);
      
      if (newConnectionStatus) {
        toast.success("Connection successful");
      } else {
        toast.error("Connection failed");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnected(false);
      onConnectionChange(false);
      
      toast.error("Connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`cyber-panel flex flex-col gap-4 ${isConnected ? 'border-sage-500 border-opacity-70' : ''}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold cyber-text-glow flex items-center gap-2">
          {isConnected ? 
            <Plug className="h-5 w-5 text-sage-500" /> : 
            <WifiOff className="h-5 w-5 text-raw_umber-500" />
          }
          <span>LLM Connection</span>
        </h2>
        
        {isConnected ? (
          <Badge variant="outline" className="bg-sage-500 bg-opacity-20 text-sage-500 border-sage-500 flex items-center gap-1.5 py-0.5">
            <span className="inline-block w-2 h-2 bg-sage-500 rounded-full animate-pulse"></span>
            Connected
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-raw_umber-500 bg-opacity-10 text-raw_umber-500 border-raw_umber-500 flex items-center gap-1.5 py-0.5">
            <span className="inline-block w-2 h-2 bg-raw_umber-500 rounded-full"></span>
            Disconnected
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="text"
          className={`cyber-input flex-grow ${isConnected ? 'border-sage-500 border-opacity-40' : ''}`}
          placeholder={defaultLLMConfig.localEndpoint}
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
        
        <button 
          className={`cyber-button-highlight px-4 py-2 ${isLoading ? 'opacity-50' : ''} ${
            isConnected ? 'bg-ebony-500 hover:bg-ebony-600 text-khaki-500 border border-sage-500' : ''
          }`}
          onClick={testConnection}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isConnected ? "Reconnect" : "Test Connection"}
        </button>
      </div>
      
      <div className="text-xs text-russet-700">
        <p>Enter the endpoint for your local LLM API (e.g., http://localhost:1234/v1/chat/completions)</p>
        {isConnected && <p className="text-sage-600 mt-1">✓ Successfully connected to LLM endpoint</p>}
      </div>
    </div>
  );
};

export default LlmConnection;
