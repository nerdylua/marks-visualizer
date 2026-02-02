import { readFileSync } from 'fs';
import { join } from 'path';
import { Student } from './types';
import { parseAllStudents } from './parser';

let cachedStudents: Student[] | null = null;

export async function loadStudentData(): Promise<Student[]> {
    if (cachedStudents) {
        return cachedStudents;
    }

    try {
        const XLSX = await import('xlsx');
        const filePath = join(process.cwd(), 'public', '5th sem CSE.xlsx');

        const fileBuffer = readFileSync(filePath);
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];

        cachedStudents = parseAllStudents(rawData);
        console.log(`Loaded ${cachedStudents.length} students from Excel`);
        return cachedStudents;
    } catch (error) {
        console.error('Error loading student data:', error);
        return [];
    }
}

export async function getStudentByUsn(usn: string): Promise<Student | null> {
    const students = await loadStudentData();
    return students.find(s => s.usn.toLowerCase() === usn.toLowerCase()) || null;
}

export function clearCache(): void {
    cachedStudents = null;
}
