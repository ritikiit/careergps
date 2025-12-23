import React from 'react';
import { CareerGPSResponse, GapAnalysis, ActionPlanWeek } from '../types';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, TrendingUp, 
  Map as MapIcon, Calendar, Zap, Target, BookOpen, UserCheck 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsDashboardProps {
  data: CareerGPSResponse;
  onReset: () => void;
}

// Helper Components moved outside to avoid re-definition and type inference issues

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-4">
    <div className="p-2 bg-slate-800 rounded-lg">
      <Icon className="w-5 h-5 text-indigo-400" />
    </div>
    <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
  </div>
);

// FIX: Made children optional in types to resolve TypeScript errors where children are passed via JSX but TS reports them missing
const Card = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

const Badge = ({ type, text }: { type: 'High' | 'Medium' | 'Low', text: string }) => {
  const colors = {
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${colors[type]}`}>
      {text}
    </span>
  );
};

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data, onReset }) => {
  
  // Explicitly map sections to preserve types, avoiding 'unknown' type from Object.entries
  const distanceMapSections = [
    { key: 'Skill Gaps', gaps: data.career_distance_map.skill_gaps },
    { key: 'Experience Gaps', gaps: data.career_distance_map.experience_gaps },
    { key: 'Role Exposure Gaps', gaps: data.career_distance_map.role_exposure_gaps },
    { key: 'Business Impact Gaps', gaps: data.career_distance_map.business_impact_gaps },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* HEADER ACTIONS */}
      <div className="flex justify-between items-center mb-8">
         <div>
            <h1 className="text-2xl font-bold text-white">Career Strategic Output</h1>
            <p className="text-slate-400 text-sm">AI-Generated Analysis</p>
         </div>
         <button 
           onClick={onReset}
           className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
         >
           Start New Analysis
         </button>
      </div>

      {/* 1. EXECUTIVE SUMMARY (Module 11) - Front and Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-indigo-500/30 ring-1 ring-indigo-500/20">
              <SectionHeader icon={Zap} title="Executive Summary" />
              <div className="space-y-4">
                {data.executive_summary.map((point, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    <p className="text-slate-200 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
           </Card>

           {/* 2. SNAPSHOT & REALITY (Module 1 & 3) */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center space-x-2 text-indigo-400 font-semibold mb-3">
                    <UserCheck className="w-4 h-4" />
                    <h3>Current Positioning</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{data.career_snapshot}</p>
              </Card>
              <Card>
                <div className="flex items-center space-x-2 text-amber-400 font-semibold mb-3">
                    <Target className="w-4 h-4" />
                    <h3>Reality Check</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{data.reality_check}</p>
              </Card>
           </div>
        </div>

        {/* 3. DISTANCE MAP (Module 2) - Vertical list for "Gaps" */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <SectionHeader icon={MapIcon} title="Distance Map" />
            <div className="space-y-6 overflow-y-auto max-h-[500px] pr-2">
                {distanceMapSections.map((section) => (
                    <div key={section.key}>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                            {section.key}
                        </h4>
                        <div className="space-y-3">
                            {section.gaps.length === 0 ? <p className="text-sm text-slate-600 italic">No significant gaps identified.</p> : 
                             section.gaps.map((gap, idx) => (
                                <div key={idx} className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-slate-200 text-sm">{gap.item}</span>
                                        <Badge type={gap.importance} text={gap.importance} />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">{gap.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 4. DECISION SIMULATOR (Module 6) */}
      <Card>
        <SectionHeader icon={TrendingUp} title="Decision Simulator" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { label: 'Option A: Stay & Optimize', data: data.decision_simulator.option_a },
                { label: 'Option B: Switch Environment', data: data.decision_simulator.option_b },
                { label: 'Option C: Strategic Pivot', data: data.decision_simulator.option_c },
            ].map((opt, idx) => (
                <div key={idx} className="bg-slate-900 rounded-xl p-5 border border-slate-800 flex flex-col h-full hover:border-slate-700 transition-colors">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">{opt.label}</h3>
                    <div className="space-y-4 flex-grow">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500 uppercase">Success Likelihood</span>
                            <Badge type={opt.data.likelihood as any} text={opt.data.likelihood} />
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase block mb-1">Upside</span>
                            <p className="text-sm text-slate-300">{opt.data.upside}</p>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase block mb-1">Risk</span>
                            <p className="text-sm text-rose-300">{opt.data.risk}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-800">
                             <span className="text-xs text-slate-500 uppercase block mb-1">Best For</span>
                             <p className="text-xs text-slate-400 italic">{opt.data.best_suited_for}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </Card>

      {/* 5. 90-DAY ACTION PLAN (Module 5) */}
      <Card>
        <SectionHeader icon={Calendar} title="90-Day High-Leverage Plan" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { title: 'Weeks 1-4: Foundation', items: data["90_day_action_plan"].weeks_1_4 },
                { title: 'Weeks 5-8: Momentum', items: data["90_day_action_plan"].weeks_5_8 },
                { title: 'Weeks 9-12: Leverage', items: data["90_day_action_plan"].weeks_9_12 },
            ].map((phase, idx) => (
                <div key={idx} className="space-y-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-indigo-500' : idx === 1 ? 'bg-blue-500' : 'bg-cyan-500'}`} />
                        <h3 className="font-semibold text-white">{phase.title}</h3>
                    </div>
                    {/* The model might return an array of objects for weeks, usually size 1 based on prompt, but safe handling here */}
                    {phase.items.map((weekItem, wIdx) => (
                         <div key={wIdx} className="bg-slate-900 p-4 rounded-lg border border-slate-800/60 h-full">
                            <ul className="space-y-2 mb-4">
                                {weekItem.actions.map((action, aIdx) => (
                                    <li key={aIdx} className="flex items-start text-sm text-slate-300">
                                        <span className="mr-2 text-indigo-500 font-bold">•</span>
                                        {action}
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-3 border-t border-slate-800 mt-auto">
                                <p className="text-xs text-slate-500 uppercase mb-1">Deliverable</p>
                                <p className="text-xs font-medium text-emerald-400">{weekItem.deliverable}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
      </Card>

      {/* 6. SKILL ROI (Module 8) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
              <SectionHeader icon={BookOpen} title="Skill ROI Prioritization" />
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data.skill_roi_prioritization.map(s => ({...s, impactScore: s.category === 'Career Accelerator' ? 100 : s.category === 'Hygiene Requirement' ? 60 : 30}))} margin={{ left: 0, right: 30 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="skill" width={120} tick={{fill: '#94a3b8', fontSize: 11}} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        />
                        <Bar dataKey="impactScore" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.skill_roi_prioritization.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.category === 'Career Accelerator' ? '#6366f1' : entry.category === 'Hygiene Requirement' ? '#0ea5e9' : '#94a3b8'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 text-xs mt-2">
                 <div className="flex items-center"><div className="w-3 h-3 bg-indigo-500 rounded mr-1"></div>Accelerator</div>
                 <div className="flex items-center"><div className="w-3 h-3 bg-sky-500 rounded mr-1"></div>Hygiene</div>
              </div>
          </Card>

          <Card>
               <SectionHeader icon={ShieldAlert} title="Defensive Intelligence" />
               <div className="space-y-4">
                   <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Common Failure Modes</h3>
                   <div className="space-y-3">
                       {data.common_failure_modes.map((mode, idx) => (
                           <div key={idx} className="flex items-start p-3 rounded bg-rose-500/5 border border-rose-500/10">
                               <AlertTriangle className="w-5 h-5 text-rose-500 mr-3 flex-shrink-0" />
                               <div>
                                   <p className="text-rose-200 font-medium text-sm">{mode.mistake}</p>
                                   <p className="text-rose-300/70 text-xs mt-1">{mode.avoidance}</p>
                               </div>
                           </div>
                       ))}
                   </div>
                   
                   <div className="mt-6 pt-6 border-t border-slate-700">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">Long-Term Sustainability</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">{data.long_term_sustainability}</p>
                   </div>
               </div>
          </Card>
      </div>

    </div>
  );
};

export default ResultsDashboard;