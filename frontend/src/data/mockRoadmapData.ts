// Mock data for the Personalized Learning Roadmap feature.
// Replace with real AI-generated roadmap when backend is ready.

export interface RoadmapLesson {
    title: string;
    duration: string;
    type: 'lesson' | 'practice' | 'quiz';
}

export interface RoadmapModule {
    id: number;
    week: number;
    title: string;
    description: string;
    skills: string[];
    lessons: RoadmapLesson[];
    estimatedTime: string;
    progress: number; // 0-100
    status: 'locked' | 'current' | 'completed';
}

export interface RoadmapData {
    goal: string;
    level: string;
    totalWeeks: number;
    modules: RoadmapModule[];
}

export function getMockRoadmap(_input: string): RoadmapData {
    return {
        goal: 'Master Business Email Communication',
        level: 'Intermediate',
        totalWeeks: 6,
        modules: [
            {
                id: 1,
                week: 1,
                title: 'Email Foundations & Etiquette',
                description: 'Learn the basic structure of professional emails: subject lines, greetings, body, and closings.',
                skills: ['Email Structure', 'Formal Greetings', 'Subject Lines'],
                lessons: [
                    { title: 'Anatomy of a Professional Email', duration: '8 min', type: 'lesson' },
                    { title: 'Writing Effective Subject Lines', duration: '6 min', type: 'lesson' },
                    { title: 'Practice: Format a Business Email', duration: '10 min', type: 'practice' },
                ],
                estimatedTime: '24 min',
                progress: 100,
                status: 'completed'
            },
            {
                id: 2,
                week: 2,
                title: 'Professional Tone & Register',
                description: 'Master the appropriate tone for different business contexts: formal, semi-formal, and casual professional.',
                skills: ['Tone Control', 'Register Awareness', 'Politeness Strategies'],
                lessons: [
                    { title: 'Understanding Tone in Writing', duration: '7 min', type: 'lesson' },
                    { title: 'Formal vs. Informal Register', duration: '8 min', type: 'lesson' },
                    { title: 'Politeness Markers & Hedging', duration: '6 min', type: 'lesson' },
                    { title: 'Quiz: Identify the Right Tone', duration: '5 min', type: 'quiz' },
                ],
                estimatedTime: '26 min',
                progress: 45,
                status: 'current'
            },
            {
                id: 3,
                week: 3,
                title: 'Business Vocabulary Power-Up',
                description: 'Build a strong repertoire of industry-standard vocabulary for emails across different departments.',
                skills: ['Business Verbs', 'Industry Jargon', 'Collocations'],
                lessons: [
                    { title: 'Top 50 Business Email Verbs', duration: '10 min', type: 'lesson' },
                    { title: 'Department-Specific Vocabulary', duration: '8 min', type: 'lesson' },
                    { title: 'Practice: Replace Informal Words', duration: '7 min', type: 'practice' },
                ],
                estimatedTime: '25 min',
                progress: 0,
                status: 'locked'
            },
            {
                id: 4,
                week: 4,
                title: 'Writing Common Email Types',
                description: 'Practice writing the most common business emails: requests, follow-ups, complaints, and thank-you notes.',
                skills: ['Request Emails', 'Follow-up Emails', 'Complaint Handling'],
                lessons: [
                    { title: 'Writing Request Emails', duration: '8 min', type: 'lesson' },
                    { title: 'Follow-up & Reminder Emails', duration: '7 min', type: 'lesson' },
                    { title: 'Handling Complaints Professionally', duration: '9 min', type: 'lesson' },
                    { title: 'Practice: Write 3 Email Types', duration: '10 min', type: 'practice' },
                ],
                estimatedTime: '34 min',
                progress: 0,
                status: 'locked'
            },
            {
                id: 5,
                week: 5,
                title: 'Grammar for Clarity',
                description: 'Fix the most common grammar mistakes that reduce email clarity and professionalism.',
                skills: ['Subject-Verb Agreement', 'Punctuation', 'Sentence Structure'],
                lessons: [
                    { title: 'Common Grammar Pitfalls', duration: '8 min', type: 'lesson' },
                    { title: 'Punctuation That Matters', duration: '6 min', type: 'lesson' },
                    { title: 'Writing Clear Sentences', duration: '7 min', type: 'lesson' },
                    { title: 'Quiz: Spot the Error', duration: '5 min', type: 'quiz' },
                ],
                estimatedTime: '26 min',
                progress: 0,
                status: 'locked'
            },
            {
                id: 6,
                week: 6,
                title: 'Advanced: Cross-Cultural Communication',
                description: 'Learn to adapt your email style for international audiences with cultural sensitivity.',
                skills: ['Cultural Awareness', 'Global English', 'Adapting Styles'],
                lessons: [
                    { title: 'Email Across Cultures', duration: '9 min', type: 'lesson' },
                    { title: 'Avoiding Cultural Pitfalls', duration: '7 min', type: 'lesson' },
                    { title: 'Final Project: Write a Multi-Audience Email', duration: '10 min', type: 'practice' },
                ],
                estimatedTime: '26 min',
                progress: 0,
                status: 'locked'
            },
        ]
    };
}
