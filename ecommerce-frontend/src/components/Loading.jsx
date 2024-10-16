const Loading = ({component}) => {
  return (
    <div className="flex items-center justify-center h-full w-full bg-gray-100 p-10">
      <div className="text-center">
        <div
          className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-blue-500 border-t-transparent mb-6"
          role="status"
        >
          <span className="sr-only">Loading {component}...</span>
        </div>
        <p className="text-xl font-semibold text-gray-700">Loading {component}...</p>
        <p className="text-sm text-gray-500 mt-2">
          Please wait while we load {component}.
        </p>
      </div>
    </div>
  );
};

export default Loading
