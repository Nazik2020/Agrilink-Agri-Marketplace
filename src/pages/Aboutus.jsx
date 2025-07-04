import React from "react";

const Aboutus = () => {
  return (
    <div className="min-h-screen bg-slate-50 w-full flex  items-center justify-center">
      <div className="flex flex-col items-start max-w-3xl gap-5">
        <h1 className="text-6xl font-bold text-black text-center mt-20 ">
          About us Page
        </h1>
        <p>
          We’ve trained a model called ChatGPT which interacts in a
          conversational way. The dialogue format makes it possible for ChatGPT
          to answer followup questions, admit its mistakes, challenge incorrect
          premises, and reject inappropriate requests.
        </p>
      </div>
    </div>
  );
};

export default Aboutus;
