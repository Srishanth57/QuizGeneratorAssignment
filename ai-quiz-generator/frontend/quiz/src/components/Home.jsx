import { useState } from "react";
import GenerateQuizTab from "../tabs/GenerateQuizTab";
import HistoryTab from "../tabs/HistoryTab";

const Home = () => {
  const [activeTab, setactiveTab] = useState(1);

  return (
    <div className="flex-col justify-center m-15">
      <h1 className="text-4xl text-center mb-5  ">Quiz Generator</h1>
      <div className="flex mx-auto flex-column justify-center gap-5 w-[70vw]  h-20">
        <button
          type="button"
          onClick={() => setactiveTab(1)}
          className="rounded-xl border-b-2 h-16 border-b-blue-500 px-9 py-3  hover:font-semibold hover:border-b-3 "
        >
          Generate Quiz
        </button>
        <button
          type="button"
          onClick={() => setactiveTab(0)}
          className="rounded-xl border-b-2 h-16 border-b-blue-500 px-9 py-3  hover:font-semibold hover:border-b-3 "
        >
          History Tab
        </button>
      </div>
      <div>{activeTab ? <GenerateQuizTab /> : <HistoryTab />}</div>
    </div>
  );
};

export default Home;
