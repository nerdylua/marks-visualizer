import {
    Student,
    SubjectStats,
    GradeDistribution,
    Percentiles,
    ClassOverview,
    ElectiveDistribution,
    SubjectKey,
    BoxPlotData
} from './types';
import { SUBJECTS, GRADE_THRESHOLDS } from './constants';
import { calculateGrade, getNormalizedScore } from './parser';

export function mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
}

export function median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function stdDev(values: number[]): number {
    if (values.length === 0) return 0;
    const avg = mean(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(mean(squareDiffs));
}

export function percentile(values: number[], p: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    if (upper >= sorted.length) return sorted[sorted.length - 1];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export function getPercentiles(values: number[]): Percentiles {
    return {
        p25: percentile(values, 25),
        p50: percentile(values, 50),
        p75: percentile(values, 75),
        p90: percentile(values, 90),
    };
}

export function getGradeDistribution(percentages: number[]): GradeDistribution {
    const distribution: GradeDistribution = {
        O: 0, 'A+': 0, A: 0, 'B+': 0, B: 0, C: 0, F: 0
    };

    percentages.forEach(pct => {
        const grade = calculateGrade(pct);
        distribution[grade]++;
    });

    return distribution;
}

export function getSubjectGradeDistribution(
    scores: number[],
    maxMarks: number
): GradeDistribution {
    const percentages = scores.map(score => (score / maxMarks) * 100);
    return getGradeDistribution(percentages);
}

export function getSubjectScores(students: Student[], subjectKey: SubjectKey): number[] {
    if (subjectKey === 'elective') {
        return students
            .map(s => s.elective.score)
            .filter((score): score is number => score !== null);
    }

    return students
        .map(s => s[subjectKey])
        .filter((score): score is number => score !== null);
}

export function getSubjectStats(students: Student[], subjectKey: SubjectKey): SubjectStats {
    const subject = SUBJECTS[subjectKey];
    const scores = getSubjectScores(students, subjectKey);
    const percentages = scores.map(score => (score / subject.maxMarks) * 100);
    const passThreshold = subject.maxMarks * 0.4;
    const passedCount = scores.filter(score => score >= passThreshold).length;

    return {
        subject,
        mean: mean(scores),
        median: median(scores),
        stdDev: stdDev(scores),
        min: scores.length > 0 ? Math.min(...scores) : 0,
        max: scores.length > 0 ? Math.max(...scores) : 0,
        passRate: scores.length > 0 ? (passedCount / scores.length) * 100 : 0,
        totalStudents: scores.length,
        passedStudents: passedCount,
        distribution: getSubjectGradeDistribution(scores, subject.maxMarks),
        percentiles: getPercentiles(scores),
    };
}

export function getClassOverview(students: Student[]): ClassOverview {
    const percentages = students.map(s => s.percentage);

    const topStudent = students.reduce((top, student) =>
        student.percentage > top.percentage ? student : top
        , students[0]);

    const electiveDistribution: ElectiveDistribution = {
        'Cloud Computing': 0,
        NLP: 0,
        'Quantum Computing': 0,
    };

    students.forEach(student => {
        electiveDistribution[student.elective.name]++;
    });

    return {
        totalStudents: students.length,
        averagePercentage: mean(percentages),
        highestPercentage: Math.max(...percentages),
        lowestPercentage: Math.min(...percentages),
        topStudent,
        gradeDistribution: getGradeDistribution(percentages),
        electiveDistribution,
    };
}

export function getBoxPlotData(students: Student[]): BoxPlotData[] {
    const subjectKeys: SubjectKey[] = ['pome', 'dbms', 'aiml', 'toc', 'elective'];

    return subjectKeys.map(key => {
        const scores = getSubjectScores(students, key);
        const sorted = [...scores].sort((a, b) => a - b);

        const q1 = percentile(scores, 25);
        const med = median(scores);
        const q3 = percentile(scores, 75);
        const iqr = q3 - q1;

        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        const outliers = sorted.filter(v => v < lowerBound || v > upperBound);
        const validScores = sorted.filter(v => v >= lowerBound && v <= upperBound);

        return {
            subject: SUBJECTS[key].shortName,
            min: validScores.length > 0 ? Math.min(...validScores) : q1,
            q1,
            median: med,
            q3,
            max: validScores.length > 0 ? Math.max(...validScores) : q3,
            outliers,
        };
    });
}

export function correlation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
    const sumX2 = x.reduce((total, xi) => total + xi * xi, 0);
    const sumY2 = y.reduce((total, yi) => total + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
        (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
}

export function getStudentPercentileRank(student: Student, allStudents: Student[]): number {
    const belowCount = allStudents.filter(s => s.percentage < student.percentage).length;
    return (belowCount / allStudents.length) * 100;
}

export function getStudentRank(student: Student, allStudents: Student[]): number {
    const sorted = [...allStudents].sort((a, b) => b.percentage - a.percentage);
    return sorted.findIndex(s => s.usn === student.usn) + 1;
}

export function computeCorrelation(
    students: Student[],
    subjectX: SubjectKey,
    subjectY: SubjectKey
): number {
    const pairs: { x: number; y: number }[] = [];

    students.forEach(student => {
        const scoreX = subjectX === 'elective' ? student.elective.score : student[subjectX];
        const scoreY = subjectY === 'elective' ? student.elective.score : student[subjectY];

        if (scoreX !== null && scoreY !== null) {
            const maxX = SUBJECTS[subjectX].maxMarks;
            const maxY = SUBJECTS[subjectY].maxMarks;
            pairs.push({
                x: (scoreX / maxX) * 100,
                y: (scoreY as number / maxY) * 100,
            });
        }
    });

    if (pairs.length < 3) return 0;

    const xValues = pairs.map(p => p.x);
    const yValues = pairs.map(p => p.y);

    return correlation(xValues, yValues);
}
