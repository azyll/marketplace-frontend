import React, { useState } from "react";
import "./App.css";
import { ConfigProvider } from "antd";
import { themeConfig } from "./themes/theme";

const App: React.FC = () => {
  return (
    <ConfigProvider theme={themeConfig}>
      <div></div>
    </ConfigProvider>
  );
};

export default App;
