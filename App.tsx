import React, { useState } from 'react';
import { Header } from './components/Header';
import { TopKeywordsList } from './components/TopKeywordsList';
import { KeywordAnalyzer } from './components/KeywordAnalyzer';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.TOP_CHART);

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === AppTab.TOP_CHART ? (
          <div className="animate-fade-in">
            <TopKeywordsList />
          </div>
        ) : (
          <div className="animate-fade-in">
            <KeywordAnalyzer />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Naver Keyword Insight. Built with React & Gemini API.</p>
          <p className="mt-1 text-xs">본 서비스는 Gemini AI를 활용하여 데이터를 추정/분석하므로 실제 네이버 공식 데이터와 차이가 있을 수 있습니다.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;