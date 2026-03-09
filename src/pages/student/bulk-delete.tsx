import { useState } from "react"
import { students } from "@/db/student_db"
import { classes } from "@/db/class_db"
import { sections } from "@/db/section_db"
import { Trash2, AlertCircle, Search, Filter } from "lucide-react"

export function BulkDeleteStudentsPage() {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedClass, setSelectedClass] = useState("all")

    const filteredStudents = students.filter(student => {
        const nameMatch = (student.first_name + " " + student.last_name).toLowerCase().includes(searchTerm.toLowerCase());
        const admMatch = student.admission_number.toLowerCase().includes(searchTerm.toLowerCase());
        const classMatch = selectedClass === "all" || student.class_id === selectedClass;
        return (nameMatch || admMatch) && classMatch;
    }).slice(0, 50); // Show top 50 for performance

    const toggleAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(filteredStudents.map(s => s.student_id)))
        } else {
            setSelectedIds(new Set())
        }
    }

    const toggleOne = (id: string) => {
        const newSet = new Set(selectedIds)
        if (newSet.has(id)) newSet.delete(id)
        else newSet.add(id)
        setSelectedIds(newSet)
    }

    const handleDelete = () => {
        if (selectedIds.size === 0) return;
        if (confirm(`Warning: You are about to permanently delete ${selectedIds.size} student records. Proceed?`)) {
            alert(`Simulation: Removed ${selectedIds.size} records.`)
            setSelectedIds(new Set())
        }
    }

    return (
        <div className="flex flex-col gap-6 p-1 max-w-6xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-red-600 flex items-center gap-2">
                    <Trash2 className="w-6 h-6" />
                    Bulk Delete Operation
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Permanently remove multiple student records from the database</p>
            </div>

            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">
                    <strong>Critical:</strong> This operation is destructive. Once data is removed from the offline database, it cannot be recovered without a local reset or manual re-entry.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border rounded-xl p-3 shadow-sm">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-9 pl-9 pr-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        />
                    </div>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="h-9 px-3 border rounded-lg bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    >
                        <option value="all">All Classes</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-red-600">{selectedIds.size} selected</span>
                    <button
                        onClick={handleDelete}
                        disabled={selectedIds.size === 0}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-all shadow-md"
                    >
                        Delete Permanently
                    </button>
                </div>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden mb-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b">
                            <tr>
                                <th className="px-5 py-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                                        checked={filteredStudents.length > 0 && selectedIds.size === filteredStudents.length}
                                        onChange={(e) => toggleAll(e.target.checked)}
                                    />
                                </th>
                                <th className="px-5 py-4">Admission No</th>
                                <th className="px-5 py-4">Student Name</th>
                                <th className="px-5 py-4">Class & Section</th>
                                <th className="px-5 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredStudents.map((student) => {
                                const className = classes.find(c => c.id === student.class_id)?.name || "Unknown";
                                const sectionName = sections.find(s => s.id === student.section_id)?.name || "-";
                                const isSelected = selectedIds.has(student.student_id);

                                return (
                                    <tr key={student.student_id} className={`transition-colors ${isSelected ? 'bg-red-50 dark:bg-red-500/5' : 'hover:bg-muted/30'}`}>
                                        <td className="px-5 py-3.5 text-center">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                                                checked={isSelected}
                                                onChange={() => toggleOne(student.student_id)}
                                            />
                                        </td>
                                        <td className="px-5 py-3.5 font-medium">{student.admission_number}</td>
                                        <td className="px-5 py-3.5 font-bold text-foreground">{student.first_name} {student.last_name}</td>
                                        <td className="px-5 py-3.5 text-muted-foreground">{className} - {sectionName}</td>
                                        <td className="px-5 py-3.5 italic opacity-70">{student.enrollment_status}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
