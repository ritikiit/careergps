import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsDashboard from './components/ResultsDashboard';
import { geminiService } from './services/gemini';
import { CareerInputs, CareerGPSResponse } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [data, setData] = useState<CareerGPSResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFormSubmit = async (inputs: CareerInputs) => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const result = await geminiService.generateCareerPlan(inputs);
      setData(result);
      setStatus('success');
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setData(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 md:py-12 flex-grow">
        {status === 'idle' && (
          <div className="animate-fade-in-up flex flex-col items-center justify-center min-h-[80vh]">
            <InputForm onSubmit={handleFormSubmit} isLoading={false} />
          </div>
        )}

        {status === 'loading' && (
           <div className="flex flex-col items-center justify-center min-h-[80vh]">
               <InputForm onSubmit={() => {}} isLoading={true} />
               <p className="mt-8 text-slate-400 animate-pulse text-sm">Analyzing market dynamics... Simulating career paths...</p>
           </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto text-center space-y-6">
            <div className="bg-rose-500/10 p-4 rounded-full">
                <svg className="w-12 h-12 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Analysis Failed</h2>
            <p className="text-slate-400">{errorMessage}</p>
            <button 
                onClick={() => setStatus('idle')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700 font-medium"
            >
                Return to Inputs
            </button>
          </div>
        )}

        {status === 'success' && data && (
          <ResultsDashboard data={data} onReset={handleReset} />
        )}
      </div>

      <footer className="relative z-10 pb-6 text-center text-slate-500 text-sm">
        Developed by <a href="https://www.linkedin.com/in/yadavritik/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Ritik Yadav</a>
      </footer>

      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;