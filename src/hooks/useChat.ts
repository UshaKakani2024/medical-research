import { useState, useCallback, useEffect } from 'react';
import { submitQuery, fetchConversations, fetchMessages, deleteConversation } from '../services/api';
import type { Message, Conversation, QueryInput } from '../types';

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations()
      .then(setConversations)
      .catch(() => setConversations([]));
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    setActiveConversationId(id);
    setError(null);
    try {
      const msgs = await fetchMessages(id);
      setMessages(msgs);
    } catch {
      setMessages([]);
    }
  }, []);

  const startNewChat = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
    setError(null);
  }, []);

  const sendQuery = useCallback(async (input: QueryInput) => {
    setIsLoading(true);
    setError(null);

    const tempUserId = `temp_user_${Date.now()}`;
    const tempLoadingId = `temp_loading_${Date.now()}`;

    const tempUserMsg: Message = {
      id: tempUserId,
      role: 'user',
      content: input.query,
      createdAt: new Date().toISOString(),
      queryData: input,
    };

    const loadingMsg: Message = {
      id: tempLoadingId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, tempUserMsg, loadingMsg]);

    try {
      const response = await submitQuery({
        ...input,
        conversationId: activeConversationId || undefined,
      });

      const assistantMsg: Message = {
        id: `assist_${Date.now()}`,
        role: 'assistant',
        content: response.aiResponse.condition_overview,
        createdAt: new Date().toISOString(),
        aiResponse: response.aiResponse,
        publications: response.publications,
        trials: response.trials,
        queryData: input,
      };

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempLoadingId),
        assistantMsg,
      ]);

      if (!activeConversationId) {
        setActiveConversationId(response.conversationId);
      }
      fetchConversations().then(setConversations).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setMessages((prev) => prev.filter((m) => m.id !== tempLoadingId));
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId]);

  const regenerateLastAnswer = useCallback(async () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg?.queryData) return;
    setMessages((prev) => prev.filter((m) => m.role !== 'assistant' || prev.indexOf(m) < prev.lastIndexOf(lastUserMsg)));
    await sendQuery(lastUserMsg.queryData);
  }, [messages, sendQuery]);

  const removeConversation = useCallback(async (id: string) => {
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) startNewChat();
    } catch {
      // ignore
    }
  }, [activeConversationId, startNewChat]);

  return {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    error,
    loadConversation,
    startNewChat,
    sendQuery,
    regenerateLastAnswer,
    removeConversation,
  };
}
