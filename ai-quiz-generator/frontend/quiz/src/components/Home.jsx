import { useState } from "react";
import GenerateQuizTab from "../tabs/GenerateQuizTab";
import HistoryTab from "../tabs/HistoryTab";

function Home() {
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">
                  AI Wiki Quiz Generator
                </h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("generate")}
              className={`${
                activeTab === "generate"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Generate Quiz
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`${
                activeTab === "history"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Quiz History
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "generate" ? <GenerateQuizTab /> : <HistoryTab />}
      </div>
    </div>
  );
}

export default Home;
