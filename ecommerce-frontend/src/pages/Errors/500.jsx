import React from 'react';
import useNavigateTransition from '../../hooks/useNavigateTransition';
import nprogress from 'nprogress';

const ISEpage = () => {
  const navigateTransition = useNavigateTransition();
  nprogress.done()

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">500</h1>
        <p className="text-2xl font-semibold mb-6">Internal Server Error</p>
        <p className="text-lg text-gray-500 mb-8">
          See browser console for details.
        </p>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-600 transition duration-300"
          onClick={() => navigateTransition('/')}
        >
          Go back to Homepage
        </button>
      </div>
    </div>
  );
};

export default ISEpage;