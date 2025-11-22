import { GoogleGenAI } from "@google/genai";
import { KeywordRank, KeywordAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to extract JSON from Markdown code blocks
const extractJson = (text: string) => {
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch && jsonMatch[1]) {
    return JSON.parse(jsonMatch[1]);
  }
  // Fallback: try to find array bracket
  const arrayMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (arrayMatch) {
    return JSON.parse(arrayMatch[0]);
  }
  // Fallback: try to find object bracket
  const objectMatch = text.match(/\{\s*"[\s\S]*\}\s*/);
  if (objectMatch) {
    return JSON.parse(objectMatch[0]);
  }
  throw new Error("Failed to parse JSON from Gemini response");
};

export const fetchTopKeywords = async (): Promise<{ keywords: KeywordRank[], sources: string[] }> => {
  try {
    // We use Google Search grounding to get recent real-world data
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        지난주 대한민국에서 가장 인기 있었던 네이버 검색어 트렌드 Top 100개를 찾아주세요.
        1위부터 100위까지 최대한 많은 데이터를 순위대로 나열해주세요.
        최신 뉴스, 연예, 스포츠, 사회 이슈 등을 기반으로 정밀하게 분석해주세요.
        
        반드시 다음 형식의 JSON 데이터만 출력해주세요 (코드 블록 안에 넣어주세요):
        Array<{
          rank: number,
          keyword: string,
          category: string,
          change: 'up' | 'down' | 'new' | 'same',
          volumeEstimate: string (e.g., "100K+", "50K+")
        }>
      `,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.5,
      },
    });

    const text = response.text;
    
    // Extract sources from grounding metadata
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((c: any) => c.web?.uri)
      .filter((uri: string | undefined) => uri !== undefined) as string[] || [];

    if (!text) return { keywords: [], sources: [] };
    
    const data = extractJson(text);
    return { keywords: data as KeywordRank[], sources };
  } catch (error) {
    console.error("Error fetching top keywords:", error);
    // Fallback mock data in case of API failure or limits
    const mockData = Array.from({ length: 10 }).map((_, i) => ({
      rank: i + 1,
      keyword: `데이터 로드 실패 (예시 키워드 ${i + 1})`,
      category: "시스템",
      change: "same" as const,
      volumeEstimate: "-"
    }));
    return { keywords: mockData, sources: [] };
  }
};

export const analyzeKeyword = async (keyword: string): Promise<KeywordAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        키워드 "${keyword}"에 대한 SEO 및 검색 분석을 수행해주세요.
        네이버 검색 환경을 기준으로 분석해주세요.
        
        다음 정보가 포함된 JSON 데이터를 작성해주세요 (코드 블록 안에 넣어주세요):
        {
          "keyword": "${keyword}",
          "searchVolume": "월간 예상 검색량 (예: 15,000+)",
          "competition": "Low" | "Medium" | "High" | "Very High",
          "competitionScore": 0-100 사이 숫자 (높을수록 경쟁 심함),
          "cpcEstimate": "예상 클릭당 비용 (원화)",
          "summary": "이 키워드의 현재 트렌드와 경쟁 상황에 대한 2문장 요약",
          "trendData": [ // 최근 7일간의 가상 트렌드 지수 (0-100)
             {"date": "D-6", "value": number},
             {"date": "D-5", "value": number},
             ...
             {"date": "Today", "value": number}
          ],
          "relatedKeywords": [ // 연관 키워드 5개
             {"keyword": "string", "relevance": number (0-100)}
          ]
        }
      `,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((c: any) => c.web?.uri)
      .filter((uri: string | undefined) => uri !== undefined) as string[] || [];

    if (!text) throw new Error("No response text");

    const data = extractJson(text);
    return { ...data, sources };

  } catch (error) {
    console.error("Error analyzing keyword:", error);
    throw error;
  }
};