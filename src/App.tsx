// import { AuthProvider } from "./hook/AuthContext";
// import NavigatorBrowser from "./navigate/navigator";



// const App: React.FC = () => {
//   return (
//     <AuthProvider>
//       <NavigatorBrowser />
//     </AuthProvider>
//   );
// };

// export default App;


import { AuthProvider } from "./hook/AuthContext";
import { LoadingProvider } from "./hook/AuthContext";
import NavigatorBrowser from "./navigate/navigator";
import GlobalLoader from "./components/loading/GlobalLoader";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LoadingProvider>
        <GlobalLoader />
        <NavigatorBrowser />
      </LoadingProvider>
    </AuthProvider>
  );
};

export default App;
