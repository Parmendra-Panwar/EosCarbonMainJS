import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { store } from "./app/store";
import AppRoutes from "./routes/AppRoutes";
import { restoreSession } from "./app/authSlice";
import "./styles/index.css";

const session = localStorage.getItem("session");
if (session) {
  store.dispatch(restoreSession(JSON.parse(session)));
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
