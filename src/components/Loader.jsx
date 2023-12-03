import React, { useState } from "react";

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>Loaded!</div>
      )}
    </div>
  );
};

export default Loader;
