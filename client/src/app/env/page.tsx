'use client';

export default function TestEnv() {
  console.log("API:", process.env.NEXT_PUBLIC_API_URL);
  return <div>Check console
       API URL: {process.env.NEXT_PUBLIC_API_URL || "NOT LOADED"}
  </div>;
}