
/**
 * Parses raw text using the specified algorithm
 * @param rawText The raw text to parse
 * @returns Array of parsed lines
 */
export const parseRawText = (rawText: string): string[] => {
  if (!rawText) return [];

  try {
    const lines = rawText.split('\n').filter(line => line.trim() !== '');
    
    // Apply the specified parsing logic
    const processedLines = lines
      .filter(line => line.includes(']') && line.includes('[') && line.includes('"'))
      .map(line => {
        try {
          const parts = line.split(']');
          if (parts.length < 3) return null;
          
          const part = parts[2];
          const subParts = part.split('[');
          if (subParts.length < 1) return null;
          
          const subPart = subParts[0];
          const quoteParts = subPart.split('"');
          if (quoteParts.length < 2) return null;
          
          return quoteParts[1];
        } catch (e) {
          console.error("Error parsing line:", line, e);
          return null;
        }
      })
      .filter((line): line is string => line !== null);
    
    // Group similar lines and count occurrences
    const lineCountMap = new Map<string, number>();
    
    processedLines.forEach(line => {
      const count = lineCountMap.get(line) || 0;
      lineCountMap.set(line, count + 1);
    });
    
    // Convert to array and sort by count (descending)
    const summarizedLines = Array.from(lineCountMap.entries())
      .map(([line, count]) => `${line} (${count})`)
      .sort((a, b) => {
        const countA = parseInt(a.match(/\((\d+)\)$/)?.[1] || "0");
        const countB = parseInt(b.match(/\((\d+)\)$/)?.[1] || "0");
        return countB - countA;
      });
    
    return summarizedLines;
  } catch (error) {
    console.error("Error parsing text:", error);
    return [];
  }
};

/**
 * Calculates an approximation of LLM tokens in the text
 * @param text The text to count tokens for
 * @returns Approximate token count
 */
export const estimateTokenCount = (text: string): number => {
  // Simple approximation: 4 chars ≈ 1 token for English text
  if (!text) return 0;
  return Math.ceil(text.length / 4);
};

/**
 * Converts parsed data to JSON format
 * @param parsedData Array of parsed lines
 * @returns JSON string representation
 */
export const convertToJson = (parsedData: string[]): string => {
  try {
    const jsonObj = {
      parsedData,
      metadata: {
        count: parsedData.length,
        timestamp: new Date().toISOString(),
      }
    };
    return JSON.stringify(jsonObj, null, 2);
  } catch (error) {
    console.error("Error converting to JSON:", error);
    return "{}";
  }
};
