import React from 'react';

const Loader = () => (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-50">
    <img src="/loader.gif" alt="Loading..." className="w-32 h-32" />
  </div>
);

export default Loader;

