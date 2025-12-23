import React, { useState } from 'react';
import { CareerInputs } from '../types';
import { ArrowRight, Compass, Clock, Briefcase, GraduationCap, Target } from 'lucide-react';

interface InputFormProps {
  onSubmit: (inputs: CareerInputs) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [inputs, setInputs] = useState<CareerInputs>({
    currentRole: '',
    yearsExperience: '',
    industry: '',
    desiredRole: '',
    timeHorizon: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-4">
          <Compass className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Career GPS</h1>
        <p className="text-slate-400">Initialize the navigation engine with your current coordinates.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Role */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-300">
            <GraduationCap className="w-4 h-4 mr-2 text-indigo-400" />
            Current Role / Status
          </label>
          <input
            required
            name="currentRole"
            value={inputs.currentRole}
            onChange={handleChange}
            placeholder="e.g. Senior Analyst, MBA Student, Freelancer"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Experience */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-300">
              <Clock className="w-4 h-4 mr-2 text-indigo-400" />
              Years of Experience
            </label>
            <input
              required
              name="yearsExperience"
              value={inputs.yearsExperience}
              onChange={handleChange}
              placeholder="e.g. 5 years, Student"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            />
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-300">
              <Briefcase className="w-4 h-4 mr-2 text-indigo-400" />
              Industry
            </label>
            <input
              required
              name="industry"
              value={inputs.industry}
              onChange={handleChange}
              placeholder="e.g. Fintech, Manufacturing"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        {/* Desired Role */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-300">
            <Target className="w-4 h-4 mr-2 text-indigo-400" />
            Desired Future Role / Direction
          </label>
          <input
            required
            name="desiredRole"
            value={inputs.desiredRole}
            onChange={handleChange}
            placeholder="e.g. Product Manager, VP of Engineering, Startup Founder"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        {/* Time Horizon */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 block">Time Horizon</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['6 Months', '1 Year', '3 Years', '5+ Years'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setInputs(prev => ({ ...prev, timeHorizon: option }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  inputs.timeHorizon === option
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <input className="hidden" required value={inputs.timeHorizon} readOnly />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Career Trajectory...
            </>
          ) : (
            <>
              Generate Strategic Plan
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
