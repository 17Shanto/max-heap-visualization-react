import React, { useRef } from "react";

const Handler = () => {
  const weightInputRef = useRef(null);
  const handleSubmit = () => {
    // 3. Access the value directly from the DOM element
    const value = weightInputRef.current.value;
    const weightNumber = parseFloat(value);
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
