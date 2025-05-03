import React, { useState, useEffect } from 'react';
import { Plug, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LlmConnectionProps {
  onConnectionChange: (connected: boolean) => void;
  onEndpointChange: (endpoint: string) => void;
}

const LlmConnection: React.FC<LlmConnectionProps> = ({ onConnectionChange, onEndpointChange }) => {
  const [endpoint, setEndpoint] = useState<string>(localStorage.getItem('llmEndpoint') || 'http://localhost:11434');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Save endpoint to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('llmEndpoint', endpoint);
    onEndpointChange(endpoint);
  }, [endpoint, onEndpointChange]);

  const testConnection = async () => {
    setIsLoading(true);
    
    try {
      // Simple connection test - just a HEAD request
      const response = await fetch(endpoint, {
        method: 'HEAD',
      });
      
      const newConnectionStatus = response.ok;
      setIsConnected(newConnectionStatus);
      onConnectionChange(newConnectionStatus);
      
      toast({
        title: newConnectionStatus ? "Connection successful" : "Connection failed",
        description: newConnectionStatus 
          ? "Successfully connected to LLM endpoint" 
          : "Could not connect to the specified endpoint",
        variant: newConnectionStatus ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnected(false);
      onConnectionChange(false);
      
      toast({
        title: "Connection failed",
        description: "Could not connect to the specified endpoint",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cyber-panel flex flex-col gap-4">
      <h2 className="text-lg font-semibold cyber-text-glow flex items-center gap-2">
        {isConnected ? 
          <Plug className="h-5 w-5 text-sage-500" /> : 
          <Plug className="h-5 w-5 text-raw_umber-500" />
        }
        <span>LLM Connection</span>
        {isConnected && <span className="inline-block w-3 h-3 bg-sage-500 rounded-full animate-pulse ml-2"></span>}
        {!isConnected && <span className="inline-block w-3 h-3 bg-raw_umber-500 rounded-full ml-2"></span>}
      </h2>
      
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="cyber-input flex-grow"
          placeholder="http://localhost:11434"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
        
        <button 
          className={`cyber-button-highlight px-4 py-2 ${isLoading ? 'opacity-50' : ''}`}
          onClick={testConnection}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isConnected ? "Reconnect" : "Test Connection"}
        </button>
      </div>
      
      <div className="text-xs text-russet-700">
        <p>Enter the endpoint for your local llama.cpp API (e.g., http://localhost:11434)</p>
      </div>
    </div>
  );
};

export default LlmConnection;
