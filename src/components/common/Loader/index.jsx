import React from "react";
import { Space, Spin } from "antd";

export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-2.5">
      <p className="font-['Inter'] font-medium text-xl text-gray-900">Loading..Please Wait..</p>
      <Space size="middle">
        <Spin size="large" />
      </Space>
    </div>
  );
}
