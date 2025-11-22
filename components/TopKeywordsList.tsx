import React, { useEffect, useState } from 'react';
import { KeywordRank } from '../types';
import { fetchTopKeywords } from '../services/geminiService';

export const TopKeywordsList: React.FC = () => {
  const [keywords, setKeywords] = useState<KeywordRank[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { keywords: data, sources: fetchedSources } = await fetchTopKeywords();
        setKeywords(data);
        setSources(fetchedSources);
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getChangeIcon = (change: string) => {
    switch (change) {
      case 'up':
        return <span className="text-red-500 flex items-center">▲</span>;
      case 'down':
        return <span className="text-blue-500 flex items-center">▼</span>;
      case 'new':
        return <span className="text-[#03C75A] text-xs font-bold border border-[#03C75A] px-1 rounded">NEW</span>;
      default:
        return <span className="text-gray-400">-</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03C75A]"></div>
        <p className="text-gray-500 animate-pulse">최신 Top 100 트렌드를 분석 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-8 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">주간 인기 검색어 Top 100</h2>
          <p className="text-gray-500 mt-1 text-sm">지난주 대한민국 실시간 네이버 검색 트렌드 순위</p>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded self-start sm:self-auto">
          Powered by Google Gemini Grounding
        </span>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">순위</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">키워드</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">추이</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">검색량(추정)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {keywords.map((item) => (
                <tr key={item.rank} className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {item.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.keyword}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getChangeIcon(item.change)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.volumeEstimate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {keywords.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            데이터를 찾을 수 없습니다.
          </div>
        )}
      </div>

      {sources.length > 0 && (
        <div className="text-xs text-gray-400 bg-white p-4 rounded-lg border border-gray-100">
          <p className="mb-2 font-medium">데이터 출처 (Google Search Grounding):</p>
          <ul className="list-disc pl-4 space-y-1 max-h-32 overflow-y-auto">
            {sources.map((source, idx) => (
              <li key={idx} className="truncate">
                <a href={source} target="_blank" rel="noreferrer" className="hover:underline hover:text-[#03C75A]">
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};