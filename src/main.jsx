import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { UIProvider } from "./context/UIContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);