import React, { useState } from 'react';
import type { User } from '../types';
import * as authService from '../services/authService';

const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.84l8.57 3.9a2 2 0 0 0 1.66 0l8.57-3.9a1 1 0 0 0 0-1.84Z"/><path d="M2.6 14.1v3.72a1 1 0 0 0 .5.88l8.07 4.03a2 2 0 0 0 1.66 0l8.07-4.03a1 1 0 0 0 .5-.88v-3.72"/><path d="m2.6 10.1 8.57 3.9a2 2 0 0 0 1.66 0l8.57-3.9"/><path d="M21.4 6.08v7.86"/><path d="m12 22 8.57-4.29"/></svg>
);

const MicrosoftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" {...props}>
        <path fill="#F25022" d="M1 1h10.5v10.5H1z" />
        <path fill="#7FBA00" d="M12.5 1h10.5v10.5H12.5z" />
        <path fill="#00A4EF" d="M1 12.5h10.5v10.5H1z" />
        <path fill="#FFB900" d="M12.5 12.5h10.5v10.5H12.5z" />
    </svg>
);

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

interface LoginPageProps {
  onMicrosoftLogin: (user: User) => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onMicrosoftLogin, onBack }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLoginClick = async () => {
    setIsAuthenticating(true);
    try {
      const user = await authService.signIn();
      if (user) {
        onMicrosoftLogin(user);
      } else {
        // This case handles when the user closes the popup without signing in.
        setIsAuthenticating(false);
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      alert("Authentication failed. Please try again.");
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-300">
        {/* Left Panel - Visuals */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-slate-850 p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-850 to-slate-850"></div>
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:2rem_2rem] animate-spin-slow"></div>

            <div className="relative z-10 flex flex-col items-center">
                <LogoIcon className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
                <h1 className="text-4xl font-bold text-slate-100 tracking-tight">Welcome Back</h1>
                <p className="text-lg text-slate-400 mt-4 max-w-sm mx-auto">
                    Sign in to access your dashboard and get smart insights on your spending.
                </p>
            </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center text-center mb-8">
                    <LogoIcon className="w-12 h-12 text-emerald-400 mb-4 lg:hidden" />
                    <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                        Sign in to your account
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Continue with your Microsoft account to proceed.
                    </p>
                </div>
                
                <div className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700">
                    <button
                        onClick={handleLoginClick}
                        disabled={isAuthenticating}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-75 disabled:cursor-wait"
                        aria-label="Sign in with your Microsoft account"
                    >
                        {isAuthenticating ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <MicrosoftIcon className="w-6 h-6" />
                                <span>Sign in with Microsoft</span>
                            </>
                        )}
                    </button>
                </div>
                
                <div className="text-center mt-8">
                    <button 
                        onClick={onBack}
                        className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        <span>Back to landing page</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;