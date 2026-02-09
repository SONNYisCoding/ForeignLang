import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, User, Clock, ChevronRight, X } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface ChatSession {
    id: number;
    userId: string | null;
    guestId: string | null;
    startTime: string;
    lastActivity: string;
    isActive: boolean;
    user?: {
        fullName: string;
        email: string;
    };
    displayName?: string; // Helper from backend or calculated
}

interface ChatMessage {
    id: number;
    sender: 'USER' | 'BOT';
    content: string;
    timestamp: string;
}

const AdminChatHistoryPage = () => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'USER' | 'GUEST'>('ALL');
    const { showError } = useToast();

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = () => {
        setLoading(true);
        fetch('/api/v1/admin/chat/sessions', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setSessions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                showError('Failed to load chat sessions');
                setLoading(false);
            });
    };

    const handleSelectSession = (session: ChatSession) => {
        setSelectedSession(session);
        fetch(`/api/v1/admin/chat/session/${session.id}/messages`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setMessages(data))
            .catch(err => console.error(err));
    };

    const filteredSessions = sessions.filter(s => {
        if (filter === 'USER') return s.userId !== null;
        if (filter === 'GUEST') return s.userId === null;
        return true;
    });

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">
            {/* Sidebar: Session List */}
            <div className="w-1/3 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800 mb-4">Chat Sessions</h2>
                    <div className="flex gap-2">
                        {['ALL', 'USER', 'GUEST'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filter === f ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">Loading...</div>
                    ) : filteredSessions.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">No sessions found</div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {filteredSessions.map(session => (
                                <button
                                    key={session.id}
                                    onClick={() => handleSelectSession(session)}
                                    className={`w-full p-4 text-left hover:bg-slate-50 transition-colors flex items-center justify-between group ${selectedSession?.id === session.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${session.userId ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {session.userId ? <User size={20} /> : <MessageSquare size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">
                                                {session.user ? session.user.fullName : `Guest-${session.guestId?.substring(0, 6)}`}
                                            </p>
                                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                <Clock size={10} />
                                                {new Date(session.lastActivity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className={`text-slate-300 group-hover:text-indigo-400 ${selectedSession?.id === session.id ? 'text-indigo-500' : ''}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Area: Chat Transcript */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden relative">
                {selectedSession ? (
                    <>
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-bold text-slate-800">
                                    {selectedSession.user ? selectedSession.user.fullName : 'Guest User'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Session ID: {selectedSession.id} • Started: {new Date(selectedSession.startTime).toLocaleString()}
                                </p>
                            </div>
                            <button onClick={() => setSelectedSession(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.sender === 'USER'
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tl-none'
                                        }`}>
                                        <p>{msg.content}</p>
                                        <p className={`text-[10px] mt-1 opacity-70 ${msg.sender === 'USER' ? 'text-indigo-200' : 'text-slate-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <MessageSquare size={48} className="mb-4 opacity-20" />
                        <p>Select a session to view the transcript</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChatHistoryPage;
