import React, { useRef, useState } from "react";
import { useGraphData } from "../../context/DataContext";
import data from "../../../public/data";

const Handler = () => {
  const [id, setId] = useState(31);
  const { graphData, updateGraphData } = useGraphData();
  const [isResetting, setIsResetting] = useState(false);
  const weightInputRef = useRef(null);

  const handleSubmit = () => {
    setId((prevId) => prevId + 1);
    const value = weightInputRef.current.value;
    if (!value) return;
    const weightValue = parseFloat(value);
    const newData = [...graphData, { personId: id, weight: weightValue }];
    updateGraphData(newData);
    weightInputRef.current.value = "";
  };

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      const newData = [...data];
      updateGraphData(newData);
      setIsResetting(false);
    }, 500);
  };

  return (
    <div>
      <div className="">
        <fieldset className="fieldset">
          <h1 className="fieldset-legend text-2xl">Please Enter Weight</h1>
          <input
            type="text"
            className="input input-neutral"
            placeholder="Person Weight"
            ref={weightInputRef}
          />
        </fieldset>
        <div className="">
          <button onClick={handleSubmit} className="btn btn-warning mt-2">
            Submit
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={handleReset}
            className="btn btn-outline"
            disabled={isResetting}
          >
            {isResetting && (
              <span className="loading loading-infinity text-2xl text-info"></span>
            )}
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Handler;
