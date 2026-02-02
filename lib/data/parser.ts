import { Student, ElectiveName, Grade } from './types';
import { GRADE_THRESHOLDS, TOTAL_MAX_MARKS, SUBJECTS } from './constants';

export function parseStudentRow(row: unknown[]): Student | null {
    if (!row || row.length < 11) return null;

    const [slNo, usn, _sin, name, pome, dbms, aiml, toc, cloudComputing, nlp, quantumComputing] = row;

    if (typeof slNo !== 'number' || !usn || !name) return null;

    const parseScore = (value: unknown): number | null => {
        if (value === null || value === undefined || value === '') return null;
        if (typeof value === 'string') {
            const upper = value.toUpperCase().trim();
            if (upper === 'DX' || upper === '') return null;
            const parsed = parseFloat(value);
            return isNaN(parsed) ? null : parsed;
        }
        if (typeof value === 'number') return value;
        return null;
    };

    const determineElective = (): { name: ElectiveName; score: number | null } => {
        const ccScore = parseScore(cloudComputing);
        const nlpScore = parseScore(nlp);
        const qcScore = parseScore(quantumComputing);

        if (ccScore !== null) return { name: 'Cloud Computing', score: ccScore };
        if (nlpScore !== null) return { name: 'NLP', score: nlpScore };
        if (qcScore !== null) return { name: 'Quantum Computing', score: qcScore };

        return { name: 'Cloud Computing', score: null };
    };

    const pomeScore = parseScore(pome);
    const dbmsScore = parseScore(dbms);
    const aimlScore = parseScore(aiml);
    const tocScore = parseScore(toc);
    const elective = determineElective();

    const totalMarks =
        (pomeScore ?? 0) +
        (dbmsScore ?? 0) +
        (aimlScore ?? 0) +
        (tocScore ?? 0) +
        (elective.score ?? 0);

    const percentage = (totalMarks / TOTAL_MAX_MARKS) * 100;
    const grade = calculateGrade(percentage);

    return {
        slNo: slNo as number,
        usn: String(usn).trim(),
        name: String(name).trim(),
        pome: pomeScore,
        dbms: dbmsScore,
        aiml: aimlScore,
        toc: tocScore,
        elective,
        totalMarks,
        percentage,
        grade,
    };
}

export function calculateGrade(percentage: number): Grade {
    if (percentage >= GRADE_THRESHOLDS.O) return 'O';
    if (percentage >= GRADE_THRESHOLDS['A+']) return 'A+';
    if (percentage >= GRADE_THRESHOLDS.A) return 'A';
    if (percentage >= GRADE_THRESHOLDS['B+']) return 'B+';
    if (percentage >= GRADE_THRESHOLDS.B) return 'B';
    if (percentage >= GRADE_THRESHOLDS.C) return 'C';
    return 'F';
}

export function parseAllStudents(data: unknown[][]): Student[] {
    return data
        .slice(1)
        .map(parseStudentRow)
        .filter((student): student is Student => student !== null);
}

export function getNormalizedScore(score: number | null, subjectKey: keyof typeof SUBJECTS): number {
    if (score === null) return 0;
    const maxMarks = SUBJECTS[subjectKey].maxMarks;
    return (score / maxMarks) * 100;
}
