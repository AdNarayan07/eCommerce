import { StrictMode } from "react"; // Import StrictMode for highlighting potential problems in the app
import { createRoot } from "react-dom/client"; // Import createRoot for rendering the React app
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter for routing
import { Provider } from "react-redux"; // Import Provider for state management with Redux
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate for persisting Redux state
import { store, persistor } from "./app/store"; // Import the Redux store and persistor
import App from "./App.jsx"; // Import the main App component
import "./index.css"; // Import global CSS styles

// Render the app within the specified root element
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}> {/* Provide the Redux store to the app */}
      <PersistGate loading={null} persistor={persistor}> {/* Delay rendering until the persisted state is loaded */}
        <App /> {/* Render the main App component */}
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
