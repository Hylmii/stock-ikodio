"use client";

import { useState } from "react";
import { signIn, signUp, useSession } from "@/lib/better-auth/client";

export default function TestAuth() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("Test User");
  const [result, setResult] = useState<any>(null);
  
  const { data: session } = useSession();

  const handleSignUp = async () => {
    try {
      console.log("Testing sign up...");
      const res = await signUp.email({
        email,
        password,
        name,
      });
      console.log("Sign up response:", res);
      setResult(res);
    } catch (error) {
      console.error("Sign up error:", error);
      setResult({ error: String(error) });
    }
  };

  const handleSignIn = async () => {
    try {
      console.log("Testing sign in...");
      const res = await signIn.email({
        email,
        password,
      });
      console.log("Sign in response:", res);
      setResult(res);
    } catch (error) {
      console.error("Sign in error:", error);
      setResult({ error: String(error) });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Auth Test Page</h1>
      
      <div className="max-w-md space-y-4">
        <div>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleSignUp}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Test Sign Up
          </button>
          
          <button
            onClick={handleSignIn}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            Test Sign In
          </button>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Session:</h2>
          <pre className="bg-gray-800 p-4 rounded overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Last Result:</h2>
          <pre className="bg-gray-800 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
