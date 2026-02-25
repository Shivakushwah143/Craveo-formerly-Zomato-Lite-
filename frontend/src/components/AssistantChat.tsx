import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { api } from '../api';

type AssistantMessage = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

const STORAGE_KEY = 'craveo_assistant_history';
const MAX_HISTORY = 20;

const buildId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const initialGreeting: AssistantMessage = {
    id: buildId(),
    role: 'assistant',
    content: "Hi there. Want help picking something, or checking an order?",
};

export const AssistantChat: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<AssistantMessage[]>([initialGreeting]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [typingMessage, setTypingMessage] = useState<AssistantMessage | null>(null);
    const [error, setError] = useState<string | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isLoggedIn) {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored) as AssistantMessage[];
                    if (parsed.length) {
                        setMessages([initialGreeting, ...parsed].slice(-MAX_HISTORY));
                    }
                } catch {
                    // ignore malformed storage
                }
            }
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (!isLoggedIn) {
            const trimmed = messages.filter((m) => m.role !== 'assistant' || m.id !== initialGreeting.id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed.slice(-MAX_HISTORY)));
        }
    }, [messages, isLoggedIn]);

    useEffect(() => {
        if (open && listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [open, messages, typingMessage]);

    const historyForRequest = useMemo(() => {
        if (isLoggedIn) return undefined;
        return messages
            .filter((m) => m.id !== initialGreeting.id)
            .slice(-MAX_HISTORY)
            .map((m) => ({ role: m.role, content: m.content }));
    }, [messages, isLoggedIn]);

    const startTyping = (text: string) => {
        const message: AssistantMessage = { id: buildId(), role: 'assistant', content: '' };
        setTypingMessage(message);
        let index = 0;
        const interval = setInterval(() => {
            index += 1;
            if (index >= text.length) {
                clearInterval(interval);
                setTypingMessage(null);
                setMessages((prev) => [...prev, { ...message, content: text }]);
                return;
            }
            const partial = text.slice(0, index);
            setTypingMessage({ ...message, content: partial });
        }, 24);
    };

    const handleSend = async () => {
        if (!input.trim() || sending) return;
        setError(null);
        const userMessage: AssistantMessage = {
            id: buildId(),
            role: 'user',
            content: input.trim(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setSending(true);

        try {
            const response = await api.assistantChat(userMessage.content, historyForRequest);
            const reply = (response?.reply as string) || 'I can help with the menu or your order. What do you need?';
            startTyping(reply);
        } catch (err: any) {
            setError(err?.message || 'Something went wrong. Try again in a moment.');
            startTyping('I had a quick hiccup. Want to try that again?');
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-40 brand-bg press shadow-lg shadow-emerald-500/20 rounded-full p-4 flex items-center gap-2"
            >
                <Sparkles className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold">AI Assistant</span>
            </button>

            {open && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
                    open ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Assistant</p>
                        <h3 className="text-lg font-semibold text-gray-900">Craveo Concierge</h3>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col h-[calc(100%-140px)]">
                    <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                                        message.role === 'user'
                                            ? 'brand-bg text-white'
                                            : 'bg-slate-100 text-gray-700'
                                    }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {typingMessage && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm bg-slate-100 text-gray-700">
                                    {typingMessage.content}
                                </div>
                            </div>
                        )}
                        {sending && !typingMessage && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 text-gray-600 rounded-2xl px-4 py-3 text-sm shadow-sm">
                                    <span className="typing-dots">
                                        <span />
                                        <span />
                                        <span />
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-100 px-4 py-4">
                        {error && <p className="text-xs text-rose-500 mb-2">{error}</p>}
                        <div className="flex items-center gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about the menu, delivery, or orders..."
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus-brand"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSend();
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={sending}
                                className="btn-base press brand-bg hover-brand-bg px-4 py-3 rounded-xl disabled:bg-gray-300"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
