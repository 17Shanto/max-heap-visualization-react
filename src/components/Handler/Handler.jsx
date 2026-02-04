import React, { useRef, useState } from "react";
import { useGraphData } from "../../context/DataContext";

const Handler = () => {
  const [id, setId] = useState(31);
  const { graphData, updateGraphData } = useGraphData();
  const weightInputRef = useRef(null);
  const handleSubmit = () => {
    setId((prevId) => prevId + 1);
    const value = weightInputRef.current.value;
    const weightValue = parseFloat(value);
    const newData = [...graphData, { personId: id, weight: weightValue }];
    updateGraphData(newData);
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
          <button className="btn btn-info">
            <span className="loading loading-spinner"></span>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Handler;
