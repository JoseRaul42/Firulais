/**
 * Parses raw text using the specified algorithm
 * @param rawText The raw text to parse
 * @returns Array of parsed lines including alert summaries and IP counts
 */
export const parseRawText = (rawText: string): string[] => {
  if (!rawText) return [];

  try {
    const lines = rawText.split('\n').filter(line => line.trim() !== '');

    const processedLines: string[] = [];
    const alertMap = new Map<string, number>();
    const ipMap = new Map<string, number>();
    const ipRegex = /\b\d{1,3}(?:\.\d{1,3}){3}\b/;

    lines.forEach(line => {
      // Extract alert name
      if (line.includes(']') && line.includes('[') && line.includes('"')) {
        const parts = line.split(']');
        if (parts.length >= 3) {
          const subPart = parts[2].split('[')[0];
          const quoteParts = subPart.split('"');
          if (quoteParts.length >= 2) {
            const alertName = quoteParts[1];
            alertMap.set(alertName, (alertMap.get(alertName) || 0) + 1);
          }
        }
      }

      // Extract IP
      const ipMatch = line.match(ipRegex);
      if (ipMatch) {
        const ip = ipMatch[0];
        ipMap.set(ip, (ipMap.get(ip) || 0) + 1);
      }
    });

    // Create alert summary
    const alertSummary = Array.from(alertMap.entries())
      .map(([alert, count]) => `${alert} (${count})`)
      .sort((a, b) => {
        const countA = parseInt(a.match(/\((\d+)\)/)?.[1] || "0");
        const countB = parseInt(b.match(/\((\d+)\)/)?.[1] || "0");
        return countB - countA;
      });

    // Create IP summary
    const ipSummary = Array.from(ipMap.entries())
      .map(([ip, count]) => `${ip} (${count})`)
      .sort((a, b) => {
        const countA = parseInt(a.match(/\((\d+)\)/)?.[1] || "0");
        const countB = parseInt(b.match(/\((\d+)\)/)?.[1] || "0");
        return countB - countA;
      });

    return [...alertSummary, ...ipSummary];
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
  if (!text) return 0;
  return Math.ceil(text.length / 4);
};

/**
 * Converts parsed data to JSON format (alerts and IPs combined)
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
