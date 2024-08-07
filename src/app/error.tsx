"use client";

// error.tsx
import React from "react";

const ErrorPage = ({ error }: { error: Error }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
      <p>Please try again later.</p>
    </div>
  );
};

export default ErrorPage;
