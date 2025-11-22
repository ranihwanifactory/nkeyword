import React from 'react';
import { AppTab } from '../types';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#03C75A] rounded flex items-center justify-center text-white font-bold text-lg">
              N
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Keyword Insight
            </span>
          </div>
          
          <nav className="flex space-x-4">
            <button
              onClick={() => onTabChange(AppTab.TOP_CHART)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === AppTab.TOP_CHART
                  ? 'bg-[#03C75A] text-white'
                  : 'text-gray-500 hover:text-[#03C75A] hover:bg-green-50'
              }`}
            >
              인기 검색어 Top 100
            </button>
            <button
              onClick={() => onTabChange(AppTab.ANALYZER)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === AppTab.ANALYZER
                  ? 'bg-[#03C75A] text-white'
                  : 'text-gray-500 hover:text-[#03C75A] hover:bg-green-50'
              }`}
            >
              키워드 정밀 분석
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};