import React, { useRef } from "react";
import { useGraphData } from "../../context/DataContext";

const Handler = () => {
  //   const { graphData, setGraphData } = useGraphData();
  const weightInputRef = useRef(null);
  const handleSubmit = () => {
    const value = weightInputRef.current.value;
    const weightNumber = parseFloat(value);
    console.log(weightNumber);
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
        <button onClick={handleSubmit} className="btn btn-warning mt-2">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Handler;
