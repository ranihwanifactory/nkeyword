import React, { useState } from 'react';
import { KeywordAnalysis } from '../types';
import { analyzeKeyword } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

export const KeywordAnalyzer: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<KeywordAnalysis | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setData(null);
    try {
      const result = await analyzeKeyword(input);
      setData(result);
    } catch (error) {
      alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">키워드 경쟁도 분석</h2>
        <p className="text-gray-500 mb-6">분석하고 싶은 키워드를 입력하여 검색량, 경쟁도, 연관 키워드를 확인하세요.</p>
        
        <form onSubmit={handleAnalyze} className="max-w-lg mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="예: 아이폰16, 제주도 여행, 겨울 코트"
            className="w-full px-5 py-4 pr-32 rounded-full border-2 border-gray-200 focus:border-[#03C75A] focus:ring-0 outline-none text-lg shadow-sm transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className={`absolute right-2 top-2 bottom-2 bg-[#03C75A] text-white px-6 rounded-full font-medium hover:bg-[#02b050] transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? '분석 중...' : '분석하기'}
          </button>
        </form>
      </div>

      {data && (
        <div className="animate-fade-in-up">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">월간 예상 검색량</h3>
              <p className="text-3xl font-bold text-gray-900">{data.searchVolume}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">경쟁도 (Score: {data.competitionScore})</h3>
              <div className="flex items-center gap-2">
                <p className={`text-3xl font-bold ${
                  data.competition === 'Very High' || data.competition === 'High' ? 'text-red-500' : 
                  data.competition === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {data.competition}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                <div 
                  className={`h-2.5 rounded-full ${
                    data.competitionScore > 70 ? 'bg-red-500' : 
                    data.competitionScore > 40 ? 'bg-yellow-400' : 'bg-green-500'
                  }`} 
                  style={{ width: `${data.competitionScore}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">예상 CPC</h3>
              <p className="text-3xl font-bold text-gray-900">{data.cpcEstimate}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trend Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">최근 검색 추이 (지난 7일)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.trendData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#03C75A" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#03C75A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#03C75A" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-bold mr-2">AI 요약:</span>
                  {data.summary}
                </p>
              </div>
            </div>

            {/* Related Keywords */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">연관 키워드</h3>
              <div className="space-y-4">
                {data.relatedKeywords.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <span className="text-gray-700 font-medium group-hover:text-[#03C75A] transition-colors cursor-pointer" onClick={() => {
                      setInput(item.keyword);
                      // Optional: auto trigger analysis
                    }}>
                      {item.keyword}
                    </span>
                    <div className="flex items-center gap-2">
                       <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-[#03C75A] h-1.5 rounded-full" 
                          style={{ width: `${item.relevance}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right">{item.relevance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {data.sources.length > 0 && (
            <div className="mt-8 text-xs text-gray-400">
              <p className="mb-1">참조 출처:</p>
              <ul className="list-disc pl-4 space-y-1">
                {data.sources.map((source, idx) => (
                  <li key={idx} className="truncate max-w-2xl">
                    <a href={source} target="_blank" rel="noreferrer" className="hover:underline hover:text-[#03C75A]">
                      {source}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};