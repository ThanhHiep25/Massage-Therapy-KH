import { useLoading } from "../../hook/AuthContext";

const GlobalLoader = () => {
  const { isLoadingPage } = useLoading();

  if (!isLoadingPage) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
      {/* <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div> */}
      <div className="border-gray-300 h-16 w-16 animate-spin rounded-full border-8 border-t-orange-600" />      
    </div>
  );
};

export default GlobalLoader;
