import { supabase } from '../lib/supabase';
import type { QueryInput, QueryResponse, Conversation, Message } from '../types';

const EDGE_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/medical-query`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export async function submitQuery(input: QueryInput): Promise<QueryResponse> {
  const res = await fetch(EDGE_FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<QueryResponse>;
}

export async function fetchConversations(): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('id, title, disease, patient_name, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(30);

  if (error) throw error;

  return (data || []).map((c) => ({
    id: c.id as string,
    title: c.title as string,
    disease: c.disease as string,
    patientName: c.patient_name as string | undefined,
    createdAt: c.created_at as string,
    updatedAt: c.updated_at as string,
  }));
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('id, role, content, query_data, research_data, ai_response, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data || []).map((m) => ({
    id: m.id as string,
    role: m.role as 'user' | 'assistant',
    content: m.content as string,
    createdAt: m.created_at as string,
    queryData: m.query_data as QueryInput | undefined,
    publications: (m.research_data as { publications?: [] } | null)?.publications,
    trials: (m.research_data as { trials?: [] } | null)?.trials,
    aiResponse: m.ai_response as import('../types').LLMResponse | undefined,
  }));
}

export async function deleteConversation(id: string): Promise<void> {
  const { error } = await supabase.from('conversations').delete().eq('id', id);
  if (error) throw error;
}
