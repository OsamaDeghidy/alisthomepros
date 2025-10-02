'use client';

import React from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  return <>{children}</>;
}

export default AuthProvider;
export { AuthProvider };