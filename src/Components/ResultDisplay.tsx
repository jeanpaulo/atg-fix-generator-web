import React from "react";

interface ResultDisplayProps {
  resultado: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ resultado }) => {
  return (
    <>
      <div className="flex flex-col w-1/2 gap-3 p-6 transition-all duration-200 ease-in-out rounded rounded-lg">
        {resultado == "ExecutionReport" && (
          <div className="flex justify-center alert alert-success">
            <span className="">{resultado}</span>
          </div>
        )}
        {resultado == "OrderReject" && (
          <div className="flex justify-center duration-200 alert alert-error">
            <span className="">{resultado}</span>
          </div>
        )}
      </div>
    </>
  );
};
