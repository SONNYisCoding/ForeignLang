import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Brain, PenTool, BarChart3, Sparkles } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from '../../components/ui/Confetti';
import UiverseLoader from '../../components/ui/UiverseLoader';

interface Question {
    id: number;
    text: string;
    options: { value: string; label: string; score: number }[];
}

const questions: Question[] = [
    {
        id: 1,
        text: "How often do you use English in your daily life?",
        options: [
            { value: 'rarely', label: 'Rarely / Never', score: 0 },
            { value: 'sometimes', label: 'Sometimes (Movies, basic reading)', score: 10 },
            { value: 'often', label: 'Often (Work, extensive reading)', score: 20 },
        ]
    },
    {
        id: 2,
        text: "Choose the correct sentence:",
        options: [
            { value: 'a', label: 'He go to school yesterday.', score: 0 },
            { value: 'b', label: 'He went to school yesterday.', score: 20 },
            { value: 'c', label: 'He has gone to school yesterday.', score: 10 },
        ]
    },
    {
        id: 3,
        text: "What does 'Ubiquitous' mean?",
        options: [
            { value: 'rare', label: 'Very rare or scarce', score: 5 },
            { value: 'everywhere', label: 'Present, appearing, or found everywhere', score: 20 },
            { value: 'unique', label: 'One of a kind', score: 0 },
        ]
    },
    {
        id: 4,
        text: "Can you understand complex technical articles in English?",
        options: [
            { value: 'no', label: 'No, it is too difficult', score: 0 },
            { value: 'somewhat', label: 'With dictionary help', score: 10 },
            { value: 'yes', label: 'Yes, easily', score: 20 },
        ]
    },
    {
        id: 5,
        text: "Select the specific term for 'A word that represents a sound' (e.g. 'Boom')",
        options: [
            { value: 'metaphor', label: 'Metaphor', score: 0 },
            { value: 'onomatopoeia', label: 'Onomatopoeia', score: 20 },
            { value: 'alliteration', label: 'Alliteration', score: 10 },
        ]
    }
];

const writingPrompts = [
    "Write a short email to your manager requesting a day off next Friday for a personal appointment.",
    "Write an email to a colleague asking for their help on a project that is due next week.",
    "Write an email to a client apologizing for a delayed delivery and proposing a new timeline.",
];

interface AssessmentResult {
    level: string;
    totalScore: number;
    mcqScore: number;
    aiScore: number;
    grammar: number;
    vocabulary: number;
    coherence: number;
    tone: number;
    feedback: string;
}

type WizardPhase = 'goal' | 'quiz' | 'writing' | 'analyzing' | 'results';

const SkillAssessment = () => {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const { refreshUser } = useAuth();

    const [phase, setPhase] = useState<WizardPhase>('goal');
    const [learningGoal, setLearningGoal] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [writingSample, setWritingSample] = useState('');
    const [result, setResult] = useState<AssessmentResult | null>(null);

    const goals = [
        { id: 'career', label: 'Career Advancement', icon: '💼', desc: 'Professional emails & meetings' },
        { id: 'travel', label: 'Travel & Culture', icon: '✈️', desc: 'Communication abroad' },
        { id: 'school', label: 'School & Exams', icon: '🎓', desc: 'Academic writing & tests' },
        { id: 'hobby', label: 'Just for Fun', icon: '🎮', desc: 'Casual learning' },
    ];

    const selectedPrompt = writingPrompts[Math.floor(learningGoal.length % writingPrompts.length)];
    const wordCount = writingSample.trim() ? writingSample.trim().split(/\s+/).length : 0;

    const handleGoalSelect = (goalId: string) => {
        setLearningGoal(goalId);
        setTimeout(() => setPhase('quiz'), 600);
    };

    const handleAnswer = (score: number) => {
        setAnswers({ ...answers, [questions[currentStep].id]: score });
    };

    const nextQuizStep = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setPhase('writing');
        }
    };

    const skipWriting = async () => {
        setPhase('analyzing');
        const mcqScore = Object.values(answers).reduce((a, b) => a + b, 0);
        try {
            const res = await fetch('/api/v1/assessment/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score: mcqScore, learningGoal }),
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            setResult({ level: data.level, totalScore: mcqScore, mcqScore, aiScore: 0, grammar: 0, vocabulary: 0, coherence: 0, tone: 0, feedback: 'Writing challenge was skipped. You can retake the assessment later for a more accurate result.' });

            // Refresh user to update profileComplete status locally
            await refreshUser();

            setTimeout(() => setPhase('results'), 1000);
        } catch {
            showError('Failed to submit. Please try again.');
            setPhase('writing');
        }
    };

    const submitAssessment = async () => {
        if (wordCount < 10) {
            showError('Please write at least 10 words.');
            return;
        }

        setPhase('analyzing');
        const mcqScore = Object.values(answers).reduce((a, b) => a + b, 0);

        try {
            const res = await fetch('/api/v1/assessment/evaluate-writing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ writingSample, mcqScore, learningGoal }),
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed');

            const data: AssessmentResult = await res.json();
            setResult(data);

            // Refresh user to update profileComplete status locally
            await refreshUser();

            // Brief delay for animation
            setTimeout(() => setPhase('results'), 1500);
        } catch {
            showError('Assessment failed. Please try again.');
            setPhase('writing');
        }
    };

    // ─── Progress Calculation ───
    const currentProgress =
        phase === 'goal' ? 0 :
            phase === 'quiz' ? ((currentStep + 1) / questions.length) * 33 + 33 :
                phase === 'writing' || phase === 'analyzing' ? 100 : 100;

    const levelColors: Record<string, string> = {
        BEGINNER: 'from-amber-400 to-orange-500',
        INTERMEDIATE: 'from-blue-400 to-indigo-500',
        ADVANCED: 'from-emerald-400 to-teal-500',
    };

    const levelEmoji: Record<string, string> = {
        BEGINNER: '🌱',
        INTERMEDIATE: '📚',
        ADVANCED: '🏆',
    };

    // ─────────────── RENDER ───────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-indigo-950 flex items-center justify-center p-4">
            <Confetti active={phase === 'results'} />
            <div className="w-full max-w-lg">
                {/* Progress bar (hidden on goal and results) */}
                {phase !== 'goal' && phase !== 'results' && (
                    <div className="mb-6">
                        <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                            <span>Goal</span>
                            <span>Quiz</span>
                            <span>Writing</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                animate={{ width: `${currentProgress}%` }}
                                transition={{ duration: 0.4 }}
                            />
                        </div>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {/* ═══════════ GOAL SELECTION ═══════════ */}
                    {phase === 'goal' && (
                        <motion.div key="goal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden p-8"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Brain size={32} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">What's your main goal?</h1>
                                <p className="text-slate-500 dark:text-slate-400">We'll personalize your learning path.</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {goals.map((goal) => (
                                    <motion.button
                                        key={goal.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleGoalSelect(goal.id)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${learningGoal === goal.id
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500'
                                            : 'border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <span className="text-2xl">{goal.icon}</span>
                                        <div>
                                            <span className="font-semibold text-slate-800 dark:text-white">{goal.label}</span>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{goal.desc}</p>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ═══════════ MCQ QUIZ ═══════════ */}
                    {phase === 'quiz' && (
                        <motion.div key={`quiz-${currentStep}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
                                <Brain size={36} className="mx-auto mb-3 text-indigo-200" />
                                <h1 className="text-xl font-bold">Skill Assessment</h1>
                                <p className="text-indigo-100 text-sm">Question {currentStep + 1} of {questions.length}</p>
                            </div>

                            <div className="p-8">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">{questions[currentStep].text}</h2>

                                <div className="space-y-3">
                                    {questions[currentStep].options.map((option, idx) => (
                                        <motion.button
                                            key={idx}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => handleAnswer(option.score)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${answers[questions[currentStep].id] === option.score
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium'
                                                : 'border-slate-100 dark:border-slate-700 hover:border-indigo-200 text-slate-600 dark:text-slate-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{option.label}</span>
                                                {answers[questions[currentStep].id] === option.score && <CheckCircle size={20} className="text-indigo-600" />}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>

                                <button
                                    onClick={nextQuizStep}
                                    disabled={answers[questions[currentStep].id] === undefined}
                                    className={`w-full mt-6 py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${answers[questions[currentStep].id] !== undefined
                                        ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    {currentStep === questions.length - 1 ? 'Continue to Writing' : 'Next Question'}
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ═══════════ WRITING CHALLENGE ═══════════ */}
                    {phase === 'writing' && (
                        <motion.div key="writing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white text-center">
                                <PenTool size={36} className="mx-auto mb-3 text-purple-200" />
                                <h1 className="text-xl font-bold">Writing Challenge</h1>
                                <p className="text-purple-100 text-sm">Our AI will evaluate your writing skills</p>
                            </div>

                            <div className="p-8">
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4 mb-6">
                                    <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-1">📧 Email Prompt:</p>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400">{selectedPrompt}</p>
                                </div>

                                <textarea
                                    value={writingSample}
                                    onChange={(e) => setWritingSample(e.target.value)}
                                    placeholder="Dear [Recipient],&#10;&#10;Write your email here...&#10;&#10;Best regards,&#10;[Your Name]"
                                    rows={8}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition resize-none text-sm leading-relaxed"
                                />

                                <div className="flex items-center justify-between mt-3 mb-6">
                                    <span className={`text-xs font-medium ${wordCount >= 10 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                        {wordCount} words {wordCount < 10 && '(min. 10)'}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        <Sparkles size={12} className="inline mr-1" /> AI-evaluated
                                    </span>
                                </div>

                                <button
                                    onClick={submitAssessment}
                                    disabled={wordCount < 10}
                                    className={`w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${wordCount >= 10
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/20'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    Submit & Analyze
                                    <Sparkles size={18} />
                                </button>

                                <button
                                    onClick={skipWriting}
                                    className="w-full mt-3 py-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                                >
                                    Skip this step →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ═══════════ ANALYZING ANIMATION ═══════════ */}
                    {phase === 'analyzing' && (
                        <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-12 text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center scale-150">
                                <UiverseLoader />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Analyzing Your Writing...</h2>
                            <p className="text-slate-500 dark:text-slate-400">Our AI is evaluating grammar, vocabulary, coherence, and tone.</p>

                            <div className="mt-8 space-y-3">
                                {['Grammar', 'Vocabulary', 'Coherence', 'Tone'].map((item, i) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.4 }}
                                        className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: i * 0.4 + 0.3 }}
                                        >
                                            <CheckCircle size={16} className="text-emerald-500" />
                                        </motion.div>
                                        Evaluating {item}...
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ═══════════ RESULTS ═══════════ */}
                    {phase === 'results' && result && (
                        <motion.div key="results" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                        >
                            {/* Level banner */}
                            <div className={`bg-gradient-to-r ${levelColors[result.level] || 'from-indigo-500 to-purple-500'} p-8 text-white text-center`}>
                                <span className="text-5xl mb-4 block">{levelEmoji[result.level] || '📊'}</span>
                                <h1 className="text-2xl font-bold mb-1">You are {result.level}</h1>
                                <p className="text-white/80 text-sm">Overall Score: {result.totalScore}/100</p>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Score breakdown */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result.mcqScore}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Quiz Score</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{result.aiScore}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Writing Score</p>
                                    </div>
                                </div>

                                {/* Skill bars */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <BarChart3 size={16} /> Writing Breakdown
                                    </h3>
                                    {[
                                        { label: 'Grammar', value: result.grammar, color: 'bg-blue-500' },
                                        { label: 'Vocabulary', value: result.vocabulary, color: 'bg-purple-500' },
                                        { label: 'Coherence', value: result.coherence, color: 'bg-teal-500' },
                                        { label: 'Tone', value: result.tone, color: 'bg-amber-500' },
                                    ].map((skill) => (
                                        <div key={skill.label}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-600 dark:text-slate-400">{skill.label}</span>
                                                <span className="font-bold text-slate-700 dark:text-slate-300">{skill.value}/10</span>
                                            </div>
                                            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full ${skill.color} rounded-full`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${skill.value * 10}%` }}
                                                    transition={{ duration: 0.8, delay: 0.3 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* AI Feedback */}
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
                                    <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-1">🤖 AI Feedback</p>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 leading-relaxed">{result.feedback}</p>
                                </div>

                                {/* CTA */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        showSuccess('Welcome to ForeignLang! 🎉');
                                        navigate('/dashboard');
                                    }}
                                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
                                >
                                    Start Learning
                                    <ArrowRight size={20} />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SkillAssessment;
