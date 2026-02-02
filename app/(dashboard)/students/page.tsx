import { loadStudentData } from "@/lib/data/loader"
import { getClassAverages } from "@/lib/data/transformers"
import { PageHeader } from "@/components/dashboard/page-header"
import { StudentSearch } from "./student-search"

export default async function StudentsPage() {
    const students = await loadStudentData()
    const classAverages = getClassAverages(students)

    return (
        <div className="space-y-6">
            <PageHeader
                title="Student Lookup"
                description="Search for individual student performance and compare against class averages"
            />

            <StudentSearch
                students={students}
                classAverages={classAverages}
            />
        </div>
    )
}
