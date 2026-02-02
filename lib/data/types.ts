export interface Student {
    slNo: number;
    usn: string;
    name: string;
    pome: number | null;
    dbms: number | null;
    aiml: number | null;
    toc: number | null;
    elective: ElectiveData;
    totalMarks: number;
    percentage: number;
    grade: Grade;
}

export interface ElectiveData {
    name: ElectiveName;
    score: number | null;
}

export type ElectiveName = 'Cloud Computing' | 'NLP' | 'Quantum Computing';

export type Grade = 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F';

export interface SubjectInfo {
    key: SubjectKey;
    name: string;
    shortName: string;
    maxMarks: number;
    color: string;
}

export type SubjectKey = 'pome' | 'dbms' | 'aiml' | 'toc' | 'elective';

export interface SubjectStats {
    subject: SubjectInfo;
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
    passRate: number;
    totalStudents: number;
    passedStudents: number;
    distribution: GradeDistribution;
    percentiles: Percentiles;
}

export interface GradeDistribution {
    O: number;
    'A+': number;
    A: number;
    'B+': number;
    B: number;
    C: number;
    F: number;
}

export interface Percentiles {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
}

export interface ClassOverview {
    totalStudents: number;
    averagePercentage: number;
    highestPercentage: number;
    lowestPercentage: number;
    topStudent: Student;
    gradeDistribution: GradeDistribution;
    electiveDistribution: ElectiveDistribution;
}

export interface ElectiveDistribution {
    'Cloud Computing': number;
    NLP: number;
    'Quantum Computing': number;
}

export interface BarChartData {
    name: string;
    value: number;
    fill?: string;
}

export interface SubjectComparisonData {
    subject: string;
    average: number;
    highest: number;
    lowest: number;
}

export interface StudentRadarData {
    subject: string;
    student: number;
    classAverage: number;
    fullMark: number;
}

export interface DistributionBucket {
    range: string;
    count: number;
    percentage: number;
}

export interface ScatterPoint {
    x: number;
    y: number;
    name: string;
    usn: string;
}

export interface BoxPlotData {
    subject: string;
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    outliers: number[];
}
