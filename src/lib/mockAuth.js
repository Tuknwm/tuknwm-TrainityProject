"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getUserByEmail, addUser } from "@/lib/mockStore";

const STORAGE_KEY = "trainity_session";

const Ctx = createContext({
  data: null,
  status: "unauthenticated",
  update: () => {},
  logout: () => {},
});

export function MockAuthProvider({ children }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setData(JSON.parse(raw));
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    } catch {
      setStatus("unauthenticated");
    }
  }, []);

  const update = useCallback((user) => {
    const session = { user, expires: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setData(session);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(null);
    setStatus("unauthenticated");
  }, []);

  return React.createElement(Ctx.Provider, { value: { data, status, update, logout } }, children);
}

export function useSession() {
  const ctx = useContext(Ctx);
  return { data: ctx.data, status: ctx.status };
}

export async function signIn(_provider, opts) {
  const user = getUserByEmail(opts.email);
  if (!user) return { error: "Email not found" };
  if (user.password !== opts.password) return { error: "Incorrect password" };
  const session = {
    user: { id: user._id, username: user.username, name: user.username, email: user.email, role: user.role },
    expires: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return { error: null };
}

export async function signOut() {
  localStorage.removeItem(STORAGE_KEY);
}

export function useMockAuth() {
  return useContext(Ctx);
}

export function mockRegister(username, email, password, confirm) {
  if (!username || !email || !password) throw new Error("All fields are required");
  if (password.length < 8) throw new Error("Password must be at least 8 characters");
  if (password !== confirm) throw new Error("Passwords do not match");
  addUser({ username, email, password, role: "user" });
}
