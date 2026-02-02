import { createRequire } from 'module';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(process.cwd(), 'public', '5th sem CSE.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log('=== Excel File Analysis ===\n');
console.log('Sheet Names:', workbook.SheetNames);
console.log('\n=== Headers (First Row) ===');
console.log(data[0]);

console.log('\n=== Sample Data (First 5 data rows) ===');
for (let i = 1; i <= 5 && i < data.length; i++) {
    console.log(`Row ${i}:`, data[i]);
}

console.log('\n=== Column Analysis ===');
console.log('Total rows (including header):', data.length);
console.log('Total columns:', data[0]?.length);

const headers = data[0];
headers.forEach((header, index) => {
    const values = data.slice(1).map(row => row[index]).filter(v => v !== undefined && v !== null && v !== '');
    console.log(`\nColumn ${index}: "${header}"`);
    console.log(`  - Non-empty values: ${values.length}`);

    const numericValues = values.filter(v => typeof v === 'number' || !isNaN(Number(v)));
    if (numericValues.length > 0) {
        const nums = numericValues.map(Number);
        console.log(`  - Type: Numeric (${numericValues.length} values)`);
        console.log(`  - Min: ${Math.min(...nums)}`);
        console.log(`  - Max: ${Math.max(...nums)}`);
        console.log(`  - Sample values: ${nums.slice(0, 5).join(', ')}`);
    } else {
        console.log(`  - Type: Text`);
        console.log(`  - Unique values: ${[...new Set(values)].length}`);
        console.log(`  - Sample values: ${values.slice(0, 5).join(', ')}`);
    }
});

console.log('\n=== Full Data Structure ===');
console.log(JSON.stringify(data.slice(0, 10), null, 2));