import { SubjectInfo, SubjectKey } from './types';

export const SUBJECTS: Record<SubjectKey, SubjectInfo> = {
    pome: {
        key: 'pome',
        name: 'Principles of Management',
        shortName: 'POME',
        maxMarks: 100,
        color: 'oklch(0.7 0.15 280)',
    },
    dbms: {
        key: 'dbms',
        name: 'Database Management Systems',
        shortName: 'DBMS',
        maxMarks: 150,
        color: 'oklch(0.65 0.18 200)',
    },
    aiml: {
        key: 'aiml',
        name: 'Artificial Intelligence & Machine Learning',
        shortName: 'AIML',
        maxMarks: 150,
        color: 'oklch(0.7 0.2 145)',
    },
    toc: {
        key: 'toc',
        name: 'Theory of Computation',
        shortName: 'TOC',
        maxMarks: 100,
        color: 'oklch(0.75 0.18 45)',
    },
    elective: {
        key: 'elective',
        name: 'Elective',
        shortName: 'Elective',
        maxMarks: 100,
        color: 'oklch(0.65 0.22 320)',
    },
};

export const ELECTIVE_COLORS = {
    'Cloud Computing': 'oklch(0.65 0.18 200)',
    NLP: 'oklch(0.7 0.15 280)',
    'Quantum Computing': 'oklch(0.65 0.22 320)',
};

export const GRADE_THRESHOLDS = {
    O: 90,
    'A+': 80,
    A: 70,
    'B+': 60,
    B: 50,
    C: 40,
    F: 0,
};

export const GRADE_COLORS = {
    O: 'oklch(0.7 0.2 145)',
    'A+': 'oklch(0.65 0.18 180)',
    A: 'oklch(0.65 0.18 200)',
    'B+': 'oklch(0.7 0.15 250)',
    B: 'oklch(0.75 0.18 45)',
    C: 'oklch(0.7 0.2 60)',
    F: 'oklch(0.65 0.2 25)',
};

export const CHART_CONFIG = {
    animationDuration: 800,
    animationEasing: 'ease-out' as const,
    tooltipDelay: 100,
};

export const TOTAL_MAX_MARKS = 100 + 150 + 150 + 100 + 100;