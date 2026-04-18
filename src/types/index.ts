export interface Publication {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  year: number;
  source: string;
  url: string;
  relevanceScore: number;
}

export interface ClinicalTrial {
  id: string;
  title: string;
  status: string;
  eligibility: string;
  location: string;
  contactInfo: string;
  url: string;
  phase?: string;
}

export interface LLMResponse {
  condition_overview: string;
  research_insights: string[];
  key_findings: string[];
  clinical_trials_summary: string;
  recommendations: string;
}

export interface QueryInput {
  patientName?: string;
  disease: string;
  query: string;
  location?: string;
  conversationId?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  queryData?: QueryInput;
  publications?: Publication[];
  trials?: ClinicalTrial[];
  aiResponse?: LLMResponse;
  isLoading?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  disease: string;
  patientName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueryResponse {
  conversationId: string;
  aiResponse: LLMResponse;
  publications: Publication[];
  trials: ClinicalTrial[];
}
