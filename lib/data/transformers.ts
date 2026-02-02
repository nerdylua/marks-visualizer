import {
    Student,
    BarChartData,
    SubjectComparisonData,
    StudentRadarData,
    DistributionBucket,
    ScatterPoint,
    SubjectKey,
    ElectiveName,
    GradeDistribution,
} from './types';
import { SUBJECTS, ELECTIVE_COLORS, GRADE_COLORS } from './constants';
import { mean, getSubjectScores, getSubjectStats } from './statistics';
import { getNormalizedScore } from './parser';

export function getSubjectAveragesChartData(students: Student[]): BarChartData[] {
    const subjectKeys: SubjectKey[] = ['pome', 'dbms', 'aiml', 'toc', 'elective'];

    return subjectKeys.map(key => {
        const stats = getSubjectStats(students, key);
        const normalizedMean = (stats.mean / SUBJECTS[key].maxMarks) * 100;

        return {
            name: SUBJECTS[key].shortName,
            value: Math.round(normalizedMean * 10) / 10,
            fill: SUBJECTS[key].color,
        };
    });
}

export function getGradeDistributionChartData(
    distribution: GradeDistribution
): BarChartData[] {
    return Object.entries(distribution).map(([grade, count]) => ({
        name: grade,
        value: count,
        fill: GRADE_COLORS[grade as keyof typeof GRADE_COLORS] || 'oklch(0.5 0 0)',
    }));
}

export function getElectiveDistributionChartData(students: Student[]): BarChartData[] {
    const counts: Record<ElectiveName, number> = {
        'Cloud Computing': 0,
        NLP: 0,
        'Quantum Computing': 0,
    };

    students.forEach(student => {
        counts[student.elective.name]++;
    });

    return Object.entries(counts).map(([name, count]) => ({
        name,
        value: count,
        fill: ELECTIVE_COLORS[name as ElectiveName],
    }));
}

export function getSubjectComparisonData(students: Student[]): SubjectComparisonData[] {
    const subjectKeys: SubjectKey[] = ['pome', 'dbms', 'aiml', 'toc', 'elective'];

    return subjectKeys.map(key => {
        const stats = getSubjectStats(students, key);
        const maxMarks = SUBJECTS[key].maxMarks;

        return {
            subject: SUBJECTS[key].shortName,
            average: Math.round((stats.mean / maxMarks) * 100),
            highest: Math.round((stats.max / maxMarks) * 100),
            lowest: Math.round((stats.min / maxMarks) * 100),
        };
    });
}

export function getStudentRadarData(
    student: Student,
    classAverages: Record<SubjectKey, number>
): StudentRadarData[] {
    const subjectKeys: SubjectKey[] = ['pome', 'dbms', 'aiml', 'toc', 'elective'];

    return subjectKeys.map(key => {
        const studentScore = key === 'elective'
            ? student.elective.score
            : student[key];

        const maxMarks = SUBJECTS[key].maxMarks;
        const normalizedStudent = studentScore !== null
            ? (studentScore / maxMarks) * 100
            : 0;
        const normalizedAverage = (classAverages[key] / maxMarks) * 100;

        return {
            subject: SUBJECTS[key].shortName,
            student: Math.round(normalizedStudent),
            classAverage: Math.round(normalizedAverage),
            fullMark: 100,
        };
    });
}

export function getClassAverages(students: Student[]): Record<SubjectKey, number> {
    const subjectKeys: SubjectKey[] = ['pome', 'dbms', 'aiml', 'toc', 'elective'];

    return subjectKeys.reduce((acc, key) => {
        const stats = getSubjectStats(students, key);
        acc[key] = stats.mean;
        return acc;
    }, {} as Record<SubjectKey, number>);
}

export function getDistributionBuckets(
    scores: number[],
    maxMarks: number,
    bucketCount: number = 10
): DistributionBucket[] {
    const bucketSize = maxMarks / bucketCount;
    const buckets: DistributionBucket[] = [];

    for (let i = 0; i < bucketCount; i++) {
        const rangeStart = i * bucketSize;
        const rangeEnd = (i + 1) * bucketSize;
        const count = scores.filter(s => s >= rangeStart && s < rangeEnd).length;

        buckets.push({
            range: `${rangeStart}-${rangeEnd}`,
            count,
            percentage: scores.length > 0 ? (count / scores.length) * 100 : 0,
        });
    }

    return buckets;
}

export function getCorrelationScatterData(
    students: Student[],
    subjectX: SubjectKey,
    subjectY: SubjectKey
): ScatterPoint[] {
    return students
        .filter(student => {
            const scoreX = subjectX === 'elective' ? student.elective.score : student[subjectX];
            const scoreY = subjectY === 'elective' ? student.elective.score : student[subjectY];
            return scoreX !== null && scoreY !== null;
        })
        .map(student => {
            const scoreX = subjectX === 'elective' ? student.elective.score : student[subjectX];
            const scoreY = subjectY === 'elective' ? student.elective.score : student[subjectY];

            const x = (scoreX! / SUBJECTS[subjectX].maxMarks) * 100;
            const y = (scoreY! / SUBJECTS[subjectY].maxMarks) * 100;

            return {
                x: Math.round(x),
                y: Math.round(y),
                name: student.name,
                usn: student.usn,
            };
        });
}

export function getTopStudents(students: Student[], n: number = 10): Student[] {
    return [...students]
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, n);
}

export function getStudentsByElective(
    students: Student[],
    elective: ElectiveName
): Student[] {
    return students.filter(s => s.elective.name === elective);
}

export function searchStudents(
    students: Student[],
    query: string
): Student[] {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return [];

    return students.filter(student =>
        student.name.toLowerCase().includes(lowerQuery) ||
        student.usn.toLowerCase().includes(lowerQuery)
    );
}

export function getCumulativeDistribution(students: Student[]): BarChartData[] {
    const sorted = [...students].sort((a, b) => a.percentage - b.percentage);
    const result: BarChartData[] = [];

    for (let pct = 0; pct <= 100; pct += 5) {
        const countAtOrBelow = sorted.filter(s => s.percentage <= pct).length;
        result.push({
            name: `${pct}%`,
            value: Math.round((countAtOrBelow / students.length) * 100),
        });
    }

    return result;
}

export function getElectiveComparisonData(students: Student[]): {
    elective: string;
    average: number;
    count: number;
    passRate: number;
}[] {
    const electives: ElectiveName[] = ['Cloud Computing', 'NLP', 'Quantum Computing'];

    return electives.map(elective => {
        const electiveStudents = getStudentsByElective(students, elective);
        const scores = electiveStudents
            .map(s => s.elective.score)
            .filter((s): s is number => s !== null);

        const avg = mean(scores);
        const passCount = scores.filter(s => s >= 40).length;

        return {
            elective,
            average: Math.round(avg * 10) / 10,
            count: electiveStudents.length,
            passRate: scores.length > 0 ? Math.round((passCount / scores.length) * 100) : 0,
        };
    });
}
