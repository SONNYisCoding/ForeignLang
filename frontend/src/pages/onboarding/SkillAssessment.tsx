import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Brain } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

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
            { value: 'rare', label: 'Very rare or scarce', score: 0 },
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

// Max Score = 100

const SkillAssessment = () => {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitting, setSubmitting] = useState(false);

    const handleAnswer = (score: number) => {
        setAnswers({ ...answers, [questions[currentStep].id]: score });
    };

    const nextStep = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            submitAssessment();
        }
    };

    const submitAssessment = () => {
        setSubmitting(true);
        const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

        fetch('/api/v1/assessment/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: totalScore }),
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                showSuccess(`Assessment Complete! You are: ${data.level}`);
                // Navigate to dashboard or result page
                // For now, redirect to dashboard as profile is complete
                setTimeout(() => navigate('/learner'), 1500);
            })
            .catch(err => {
                console.error(err);
                showError('Failed to submit assessment');
                setSubmitting(false);
            });
    };

    const progress = ((currentStep + 1) / questions.length) * 100;
    const currentQuestion = questions[currentStep];
    const hasAnswered = answers[currentQuestion.id] !== undefined;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-indigo-600 p-6 text-white text-center">
                    <Brain size={48} className="mx-auto mb-4 text-indigo-200" />
                    <h1 className="text-2xl font-bold">Skill Assessment</h1>
                    <p className="text-indigo-100 opacity-90">Let's determine your starting level</p>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-100">
                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="mb-6">
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Question {currentStep + 1} of {questions.length}</span>
                        <h2 className="text-xl font-bold text-slate-800 mt-2">{currentQuestion.text}</h2>
                    </div>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option.score)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${answers[currentQuestion.id] === option.score
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                                    : 'border-slate-100 hover:border-indigo-200 text-slate-600'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{option.label}</span>
                                    {answers[currentQuestion.id] === option.score && <CheckCircle size={20} className="text-indigo-600" />}
                                </div>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={nextStep}
                        disabled={!hasAnswered || submitting}
                        className={`w-full mt-8 py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${hasAnswered && !submitting
                            ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 shadow-indigo-500/20'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {submitting ? 'Analyzing...' : currentStep === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
                        {!submitting && <ArrowRight size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SkillAssessment;
