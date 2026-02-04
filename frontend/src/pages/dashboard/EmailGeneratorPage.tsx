import { useState } from 'react';
import { Send, Copy, RefreshCw, Sparkles, Check } from 'lucide-react';

// DTOs matching backend
interface EmailGenerateRequest {
    prompt: string;
    tone: string;
    language: string;
    emailType: string;
    recipientType: string;
}

interface EmailGenerateResponse {
    success: boolean;
    subject: string;
    body: string;
    remainingUses: number;
    isPremium: boolean;
    error?: string;
}

const EmailGeneratorPage = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<EmailGenerateResponse | null>(null);
    const [copied, setCopied] = useState(false);

    // Form state
    const [formData, setFormData] = useState<EmailGenerateRequest>({
        prompt: '',
        tone: 'professional',
        language: 'vi', // Default to Vietnamese
        emailType: 'general',
        recipientType: 'colleague'
    });

    const handleGenerate = async () => {
        if (!formData.prompt.trim()) return;

        setLoading(true);
        setCopied(false);
        setResult(null);

        try {
            const response = await fetch('/api/v1/email/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else if (response.status === 401) {
                alert("Vui lòng đăng nhập để sử dụng tính năng này!");
                // Redirect to login using window.location or navigate hook if available
                // Since navigate isn't in scope of this function easily without passing it, window.location is safe
                window.location.href = '/login';
            } else {
                console.error('Error:', data);
                // Handle error (show toast etc)
            }
        } catch (error) {
            console.error('Network error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!result) return;
        const textToCopy = `Subject: ${result.subject}\n\n${result.body}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="text-indigo-600" />
                    AI Email Generator
                </h1>
                <p className="text-gray-500 mt-1">Viết email chuyên nghiệp chỉ trong vài giây</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bạn muốn viết về điều gì?
                            </label>
                            <textarea
                                value={formData.prompt}
                                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                                placeholder="Ví dụ: Xin nghỉ phép 2 ngày vì lý do gia đình, hứa sẽ hoàn thành report trước khi đi..."
                                className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Người nhận</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    value={formData.recipientType}
                                    onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                                >
                                    <option value="manager">Sếp / Quản lý</option>
                                    <option value="colleague">Đồng nghiệp</option>
                                    <option value="client">Khách hàng</option>
                                    <option value="HR">Nhân sự (HR)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mục đích</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    value={formData.emailType}
                                    onChange={(e) => setFormData({ ...formData, emailType: e.target.value })}
                                >
                                    <option value="general">Chung</option>
                                    <option value="request">Yêu cầu / Đề nghị</option>
                                    <option value="followup">Follow up</option>
                                    <option value="apology">Xin lỗi</option>
                                    <option value="thankyou">Cảm ơn</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Giọng văn</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    value={formData.tone}
                                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                >
                                    <option value="professional">Chuyên nghiệp</option>
                                    <option value="friendly">Thân thiện</option>
                                    <option value="direct">Thẳng thắn</option>
                                    <option value="urgent">Khẩn cấp</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ</label>
                                <div className="flex bg-gray-100 p-1 rounded-xl">
                                    <button
                                        onClick={() => setFormData({ ...formData, language: 'vi' })}
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${formData.language === 'vi' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Tiếng Việt
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, language: 'en' })}
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${formData.language === 'en' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        English
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !formData.prompt.trim()}
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="animate-spin" size={20} />
                                    Đang viết email...
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Tạo Email
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Output Section */}
                <div className="space-y-6">
                    {result ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Email Header */}
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'Đã copy!' : 'Copy'}
                                </button>
                            </div>

                            {/* Email Content */}
                            <div className="p-6 flex-1 bg-white">
                                <div className="mb-4">
                                    <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">Subject</span>
                                    <input
                                        type="text"
                                        value={result.subject}
                                        readOnly
                                        className="w-full mt-1 text-lg font-semibold text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                                    />
                                </div>
                                <div className="w-full h-px bg-gray-100 mb-4" />
                                <textarea
                                    value={result.body}
                                    readOnly
                                    className="w-full h-[300px] text-gray-600 leading-relaxed bg-transparent border-none focus:ring-0 resize-none p-0"
                                />
                            </div>

                            {/* Footer Stats */}
                            <div className="px-6 py-3 bg-indigo-50 border-t border-indigo-100 flex justify-between items-center text-sm">
                                <span className="text-indigo-700 font-medium">✨ Generated by AI</span>
                                <span className="text-gray-500">Quota: {result.remainingUses} left today</span>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                                <Sparkles size={32} className="text-indigo-200" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Sẵn sàng sáng tạo</h3>
                            <p className="max-w-xs">Nhập nội dung bạn muốn truyền tải, AI sẽ giúp bạn viết email hoàn chỉnh.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailGeneratorPage;
