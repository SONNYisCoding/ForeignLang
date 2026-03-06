import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, ArrowLeft, Shield, Zap, Crown, Sparkles, BookOpen } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCredits } from '../../contexts/CreditContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { UpgradeButton } from '../../components/common/UpgradeButton';

type Step = 'select' | 'confirm' | 'processing' | 'success';
type PlanType = 'subscription' | 'credits';

interface Plan {
    id: string;
    name: string;
    price: number;
    currency: string;
    period: string;
    description: string;
    features: string[];
    bonus?: string;
    recommended?: boolean;
    type: PlanType;
}

const subscriptionPlans: Plan[] = [
    {
        id: 'flpro-monthly',
        name: 'FLPro 1 Tháng',
        price: 29000,
        currency: '₫',
        period: '/tháng',
        description: 'Học viết email chuyên nghiệp với lộ trình cá nhân hóa.',
        features: [
            'Truy cập toàn bộ lộ trình học',
            'Template Library không giới hạn',
            'Tặng 5 AI Credits',
            'Hỗ trợ ưu tiên'
        ],
        bonus: '+5 AI Credits miễn phí',
        recommended: true,
        type: 'subscription'
    },
    {
        id: 'flpro-quarterly',
        name: 'FLPro 3 Tháng',
        price: 79000,
        currency: '₫',
        period: '/3 tháng',
        description: 'Tiết kiệm 9% so với gói tháng.',
        features: [
            'Tất cả quyền lợi FLPro 1 Tháng',
            'Tặng 20 AI Credits',
            'Tiết kiệm 8.000₫',
            'Ưu tiên tính năng mới'
        ],
        bonus: '+20 AI Credits miễn phí',
        type: 'subscription'
    }
];

const creditPlans: Plan[] = [
    {
        id: 'credits-5',
        name: 'Gói 5 Credits',
        price: 29000,
        currency: '₫',
        period: '',
        description: 'Mua trực tiếp, không cần subscription.',
        features: [
            '5 AI Credits',
            'Không hết hạn',
            'Dùng khi nào cũng được',
            'Thanh toán một lần'
        ],
        type: 'credits'
    },
    {
        id: 'credits-15',
        name: 'Gói 15 Credits',
        price: 79000,
        currency: '₫',
        period: '',
        description: 'Tiết kiệm 9% so với mua lẻ.',
        features: [
            '15 AI Credits',
            'Không hết hạn',
            'Bonus: Tiết kiệm 8.000₫',
            'Dành cho người dùng nhiều'
        ],
        recommended: true,
        type: 'credits'
    }
];

const UpgradePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState<Step>('select');
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<PlanType>('subscription');

    // Check authentication
    useEffect(() => {
        fetch('/api/v1/user/me', { credentials: 'include' })
            .then(res => {
                if (!res.ok) {
                    navigate('/login?redirect=/upgrade');
                } else {
                    setIsAuthenticated(true);
                }
            })
            .catch(() => navigate('/login?redirect=/upgrade'));
    }, [navigate]);

    const { user, refreshUser } = useAuth(); // Get user ID for SePay content
    const { refreshCredits } = useCredits();

    // Pre-select plan from URL params
    useEffect(() => {
        const planParam = searchParams.get('plan');
        const packParam = searchParams.get('pack');
        if (packParam) {
             
            setActiveTab('credits');
        }
        if (planParam || packParam) {
            const allPlans = [...subscriptionPlans, ...creditPlans];
            const found = allPlans.find(p => p.id === planParam || p.id === packParam);
            if (found) {
                 
                setSelectedPlan(found);
                 
                setActiveTab(found.type);
            }
        }

         
    }, [searchParams]);

    const currentPlans = activeTab === 'subscription' ? subscriptionPlans : creditPlans;

    const handleSelectPlan = (plan: Plan) => {
        setSelectedPlan(plan);
        setStep('confirm');
    };

    const handlePaymentSuccess = async () => {
        if (!selectedPlan) return;
        setStep('processing');
        try {
            const response = await fetch('/api/v1/user/upgrade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    planId: selectedPlan.id,
                    type: selectedPlan.type,
                    amount: selectedPlan.price
                })
            });

            if (response.ok) {
                setStep('success');
                // Sync user profile (isPremium flag) and credit count globally
                await refreshUser();
                refreshCredits();
            } else {
                toast.error('Có lỗi xảy ra khi xác nhận thanh toán');
                setStep('select');
            }
        } catch {
            toast.error('Lỗi kết nối server');
            setStep('select');
        }
    };



    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:underline mb-6"
                    >
                        <ArrowLeft size={16} />
                        Về Dashboard
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        <Crown className="inline-block mr-2 text-yellow-500" size={32} />
                        Nâng cấp tài khoản
                    </h1>
                    <p className="text-gray-500">Mở khóa toàn bộ tiềm năng của ForeignLang</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center gap-4 mb-8">
                    {['select', 'confirm', 'success'].map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === s || ['select', 'confirm', 'processing', 'success'].indexOf(step) > i
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-500'
                                }`}>
                                {i + 1}
                            </div>
                            <span className={`hidden sm:block text-sm ${step === s ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>
                                {s === 'select' ? 'Chọn gói' : s === 'confirm' ? 'Xác nhận' : 'Hoàn tất'}
                            </span>
                            {i < 2 && <div className="w-8 h-0.5 bg-gray-200 hidden sm:block"></div>}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Select Plan */}
                    {step === 'select' && (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* Tab Switcher */}
                            <div className="flex justify-center mb-8">
                                <div className="bg-gray-100 p-1 rounded-xl inline-flex">
                                    <button
                                        onClick={() => setActiveTab('subscription')}
                                        className={`px-6 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'subscription'
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <BookOpen size={16} />
                                        FLPro (Học tập)
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('credits')}
                                        className={`px-6 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'credits'
                                            ? 'bg-white text-sky-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <Zap size={16} />
                                        AI Credits
                                    </button>
                                </div>
                            </div>

                            {/* Plans Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentPlans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        onClick={() => handleSelectPlan(plan)}
                                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-xl ${plan.recommended
                                            ? 'border-indigo-600 bg-white shadow-lg'
                                            : 'border-gray-200 bg-white hover:border-indigo-300'
                                            }`}
                                    >
                                        {plan.recommended && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                <Star size={10} fill="currentColor" /> Phổ biến nhất
                                            </div>
                                        )}
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                            <div className="flex items-baseline gap-1 mt-2">
                                                <span className="text-3xl font-extrabold text-indigo-600">
                                                    {formatPrice(plan.price)}{plan.currency}
                                                </span>
                                                {plan.period && (
                                                    <span className="text-gray-500">{plan.period}</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
                                        </div>

                                        {plan.bonus && (
                                            <div className="flex items-center gap-2 mb-4 text-sm bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg">
                                                <Sparkles size={16} className="text-yellow-500" />
                                                <span className="font-semibold">{plan.bonus}</span>
                                            </div>
                                        )}

                                        <ul className="space-y-2 mb-6">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <Check size={16} className="text-green-500 mt-0.5" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="flex justify-center mt-auto w-full">
                                            <UpgradeButton
                                                text={plan.type === 'subscription' ? "Unlock Pro" : "Get Credits"}
                                                onClick={() => handleSelectPlan(plan)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Pay with SePay / VietQR */}
                    {step === 'confirm' && selectedPlan && isAuthenticated && (
                        <motion.div
                            key="confirm"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8"
                        >
                            <div className="text-center mb-6">
                                <span className="inline-block p-3 rounded-full bg-blue-50 text-blue-600 mb-4">
                                    <Zap size={32} />
                                </span>
                                <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.transfer.title')}</h2>
                                <p className="text-gray-500 text-sm mt-1">{t('dashboard.transfer.subtitle')}</p>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 mb-6 border border-indigo-100 relative overflow-hidden">
                                { /* Dynamic QR */}
                                <div className="text-center">
                                    <img
                                        src={`https://qr.sepay.vn/img?acc=1903698765432&bank=MBBank&amount=${selectedPlan.price}&des=FLPRO ${user?.id || "USER_ID"}`}
                                        alt="VietQR"
                                        className="w-48 h-48 mx-auto rounded-xl shadow-sm border-4 border-white mb-4"
                                    />
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b border-indigo-100 pb-2">
                                        <span className="text-gray-500">{t('dashboard.transfer.bank')}</span>
                                        <span className="font-bold text-gray-900">MB Bank</span>
                                    </div>
                                    <div className="flex justify-between border-b border-indigo-100 pb-2">
                                        <span className="text-gray-500">{t('dashboard.transfer.accountName')}</span>
                                        <span className="font-bold text-gray-900">FOREIGNLANG INC</span>
                                    </div>
                                    <div className="flex justify-between border-b border-indigo-100 pb-2">
                                        <span className="text-gray-500">{t('dashboard.transfer.accountNumber')}</span>
                                        <span className="font-bold text-indigo-600 font-mono tracking-wider">1903698765432</span>
                                    </div>
                                    <div className="flex justify-between border-b border-indigo-100 pb-2">
                                        <span className="text-gray-500">{t('dashboard.transfer.amount')}</span>
                                        <span className="font-bold text-red-600 text-lg">{formatPrice(selectedPlan.price)}{selectedPlan.currency}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">{t('dashboard.transfer.content')}</span>
                                        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded font-mono font-bold text-xs">
                                            FLPRO {user?.id}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-center text-gray-400 justify-center mb-6">
                                <Shield size={14} />
                                {t('dashboard.transfer.autoActivation')}
                            </div>

                            <div className="space-y-3 mt-4">
                                <button
                                    onClick={handlePaymentSuccess}
                                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 animate-pulse"
                                >
                                    <Check size={20} />
                                    {t('dashboard.transfer.iHavePaid')}
                                </button>
                                <button
                                    onClick={() => setStep('select')}
                                    className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium"
                                >
                                    {t('dashboard.transfer.chooseOther')}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Processing */}
                    {step === 'processing' && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-16"
                        >
                            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang xử lý thanh toán...</h2>
                            <p className="text-gray-500">Vui lòng đợi trong giây lát</p>
                        </motion.div>
                    )}

                    {/* Step 4: Success */}
                    {step === 'success' && selectedPlan && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check size={40} className="text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">🎉 Thanh toán thành công!</h2>
                            <p className="text-gray-500 mb-8">
                                {selectedPlan.type === 'subscription'
                                    ? 'Chào mừng bạn đến với FLPro!'
                                    : 'Credits đã được cộng vào tài khoản!'}
                            </p>

                            <div className="bg-indigo-50 rounded-xl p-6 max-w-md mx-auto mb-8">
                                <h3 className="font-bold text-indigo-900 mb-2">Bạn nhận được:</h3>
                                <ul className="text-sm text-indigo-700 space-y-2 text-left">
                                    {selectedPlan.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Check size={14} /> {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link
                                to={selectedPlan.type === 'subscription' ? '/dashboard' : '/dashboard/generator'}
                                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all"
                            >
                                <Zap size={20} />
                                {selectedPlan.type === 'subscription' ? 'Bắt đầu học ngay' : 'Bắt đầu tạo Email'}
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UpgradePage;
