export interface CareerInputs {
  currentRole: string;
  yearsExperience: string;
  industry: string;
  desiredRole: string;
  timeHorizon: string;
}

export interface GapAnalysis {
  skill_gaps: { item: string; importance: 'High' | 'Medium' | 'Low'; reason: string }[];
  experience_gaps: { item: string; importance: 'High' | 'Medium' | 'Low'; reason: string }[];
  role_exposure_gaps: { item: string; importance: 'High' | 'Medium' | 'Low'; reason: string }[];
  business_impact_gaps: { item: string; importance: 'High' | 'Medium' | 'Low'; reason: string }[];
}

export interface ActionPlanWeek {
  actions: string[];
  deliverable: string;
  why_now: string;
}

export interface DecisionOption {
  likelihood: 'Low' | 'Medium' | 'High';
  upside: string;
  risk: string;
  best_suited_for: string;
  when_not_to_choose: string;
}

export interface SkillROI {
  skill: string;
  time_to_impact: string;
  category: 'Career Accelerator' | 'Hygiene Requirement' | 'Optional / Low ROI';
}

export interface CareerGPSResponse {
  career_snapshot: string;
  career_distance_map: GapAnalysis;
  reality_check: string;
  age_stage_context: string;
  "90_day_action_plan": {
    weeks_1_4: ActionPlanWeek[]; // Array to handle potential list, though prompt implies structure. We'll map to single object in usage.
    weeks_5_8: ActionPlanWeek[];
    weeks_9_12: ActionPlanWeek[];
  };
  decision_simulator: {
    option_a: DecisionOption;
    option_b: DecisionOption;
    option_c: DecisionOption;
  };
  positioning_strategy: string;
  skill_roi_prioritization: SkillROI[];
  common_failure_modes: { mistake: string; why: string; avoidance: string }[]; // Adapting to array structure
  long_term_sustainability: string;
  executive_summary: string[];
}
