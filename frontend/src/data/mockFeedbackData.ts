// Mock data for AI Email Feedback & Scoring feature
// This file provides realistic mock responses to simulate AI analysis.
// Replace with real AI API calls when ready.

export interface FeedbackAnnotation {
    startIndex: number;
    endIndex: number;
    type: 'grammar' | 'vocabulary' | 'tone' | 'clarity';
    original: string;
    suggestion: string;
    explanation: string;
}

export interface VocabSuggestion {
    original: string;
    recommended: string;
    category: string;
    reason: string;
}

export interface FeedbackScores {
    grammar: number;
    vocabulary: number;
    tone: number;
    clarity: number;
    overall: number;
}

export interface FeedbackResult {
    annotations: FeedbackAnnotation[];
    scores: FeedbackScores;
    suggestions: VocabSuggestion[];
    summary: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getMockFeedback(_email: string): FeedbackResult {
    return {
        annotations: [
            {
                startIndex: 0,
                endIndex: 0,
                type: 'grammar',
                original: 'I want to',
                suggestion: 'I would like to',
                explanation: '"I want to" sounds too direct in business emails. Use "I would like to" for a more polished, professional tone.'
            },
            {
                startIndex: 0,
                endIndex: 0,
                type: 'vocabulary',
                original: 'talk about',
                suggestion: 'discuss',
                explanation: '"Talk about" is informal. In business writing, "discuss" is the standard professional alternative.'
            },
            {
                startIndex: 0,
                endIndex: 0,
                type: 'tone',
                original: 'ASAP',
                suggestion: 'at your earliest convenience',
                explanation: '"ASAP" can feel demanding. "At your earliest convenience" shows respect for the recipient\'s schedule.'
            },
            {
                startIndex: 0,
                endIndex: 0,
                type: 'grammar',
                original: 'me and my team',
                suggestion: 'my team and I',
                explanation: 'In formal writing, the first-person pronoun should come last in a compound subject: "my team and I".'
            },
            {
                startIndex: 0,
                endIndex: 0,
                type: 'clarity',
                original: 'the thing we discussed',
                suggestion: 'the project proposal we discussed',
                explanation: 'Vague references like "the thing" reduce clarity. Be specific about what you\'re referring to.'
            },
            {
                startIndex: 0,
                endIndex: 0,
                type: 'vocabulary',
                original: 'get back to you',
                suggestion: 'follow up with you',
                explanation: '"Get back to you" is casual. "Follow up with you" is the professional standard in business correspondence.'
            }
        ],
        scores: {
            grammar: 62,
            vocabulary: 55,
            tone: 70,
            clarity: 58,
            overall: 61
        },
        suggestions: [
            { original: 'talk about', recommended: 'discuss', category: 'Business Verb', reason: 'More formal and professional' },
            { original: 'help', recommended: 'assist / facilitate', category: 'Business Verb', reason: 'Elevated register for corporate context' },
            { original: 'get', recommended: 'obtain / acquire', category: 'Business Verb', reason: 'Avoid informal verbs in written communication' },
            { original: 'ASAP', recommended: 'at your earliest convenience', category: 'Business Phrase', reason: 'Politeness and respect for recipient' },
            { original: 'thanks', recommended: 'Thank you for your consideration', category: 'Closing', reason: 'Full closing phrase adds professionalism' },
            { original: 'fix the issue', recommended: 'resolve the matter', category: 'Business Phrase', reason: '"Resolve the matter" is standard in formal reports' },
            { original: 'set up a meeting', recommended: 'schedule a meeting', category: 'Business Phrase', reason: '"Schedule" is the professional standard' },
            { original: 'look into', recommended: 'investigate / review', category: 'Business Verb', reason: 'More precise and authoritative' }
        ],
        summary: 'Your email communicates the core message but uses several informal expressions that weaken its professional impact. Focus on replacing casual verbs ("talk about", "get back to") with business-standard alternatives, and avoid abbreviations like "ASAP" in formal contexts.'
    };
}

// Sample email for demo/placeholder purposes
export const SAMPLE_EMAIL = `Dear Mr. Johnson,

I want to talk about the thing we discussed last week regarding the new marketing campaign. Me and my team have been working on it and we need to get some feedback from your side.

Can you help us set up a meeting ASAP? We need to fix the issue with the budget allocation before the deadline. I'll look into the vendor proposals and get back to you by Friday.

Also, can you send me the latest report? I want to talk about the Q3 numbers with the board.

Thanks,
Sarah`;
