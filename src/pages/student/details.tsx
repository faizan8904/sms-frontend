import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import {
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Download,
    PenLine,
    Trash2,
    LayoutGrid,
    List,
    Users,
    User,
    UserMinus,
    CheckCircle2,
    XCircle,
    ChevronDown
} from "lucide-react"

import { students } from "@/db/student_db"
import { classes } from "@/db/class_db"
import { sections } from "@/db/section_db"

export function StudentDetailsPage() {
    const [viewMode, setViewMode] = useState<"list" | "grid">("list")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedClass, setSelectedClass] = useState<string>("all")
    const [selectedSection, setSelectedSection] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Filtering Logic
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch =
                student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.admission_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.roll_number.includes(searchQuery);

            const matchesClass = selectedClass === "all" || student.class_id === selectedClass;
            const matchesSection = selectedSection === "all" || student.section_id === selectedSection;

            return matchesSearch && matchesClass && matchesSection;
        });
    }, [searchQuery, selectedClass, selectedSection]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredStudents, currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-1">
            {/* Header & Stats Cards */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="flex-1 bg-card border rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                        <h2 className="font-semibold text-base">Student Stages</h2>
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                        <div className="flex-1 border-r pr-4">
                            <div className="flex items-center gap-1.5 mb-1 text-muted-foreground">
                                <Users className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Total</span>
                            </div>
                            <div className="text-2xl font-bold">{students.length}</div>
                        </div>
                        <div className="flex-1 border-r px-4">
                            <div className="flex items-center gap-1.5 mb-1 text-muted-foreground">
                                <User className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-xs font-medium">Male</span>
                            </div>
                            <div className="text-2xl font-bold">
                                {students.filter(s => s.gender === 'Male').length}
                            </div>
                        </div>
                        <div className="flex-1 border-r px-4">
                            <div className="flex items-center gap-1.5 mb-1 text-muted-foreground">
                                <User className="w-3.5 h-3.5 text-pink-500" />
                                <span className="text-xs font-medium">Female</span>
                            </div>
                            <div className="text-2xl font-bold">
                                {students.filter(s => s.gender === 'Female').length}
                            </div>
                        </div>
                        <div className="flex-1 pl-4">
                            <div className="flex items-center gap-1.5 mb-1 text-muted-foreground">
                                <UserMinus className="w-3.5 h-3.5 text-orange-500" />
                                <span className="text-xs font-medium">Inactive</span>
                            </div>
                            <div className="text-2xl font-bold">
                                {students.filter(s => s.enrollment_status === 'Inactive').length}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-[350px] bg-card border rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <h2 className="font-semibold text-base">Current Status</h2>
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                        <div className="flex-1 border-r pr-4">
                            <div className="flex items-center gap-1.5 mb-1 text-green-600 dark:text-green-500">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Present</span>
                            </div>
                            <div className="text-2xl font-bold">475</div>
                        </div>
                        <div className="flex-1 pl-4">
                            <div className="flex items-center gap-1.5 mb-1 text-red-600 dark:text-red-500">
                                <XCircle className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Absent</span>
                            </div>
                            <div className="text-2xl font-bold">25</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border rounded-xl p-3 shadow-sm">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-9 pl-9 pr-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all dark:bg-muted/50"
                        />
                    </div>

                    <div className="flex items-center bg-muted/50 p-1 rounded-lg border">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>

                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="h-9 px-3 border rounded-lg bg-background text-sm font-medium hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    >
                        <option value="all">All Classes</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="h-9 px-3 border rounded-lg bg-background text-sm font-medium hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    >
                        <option value="all">All Sections</option>
                        {sections.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <Link to="/student/admission" className="flex items-center gap-2 h-9 px-4 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors shadow-sm whitespace-nowrap">
                        <Plus className="w-4 h-4" />
                        Add Student
                    </Link>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col justify-between">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b">
                            <tr>
                                <th className="px-5 py-4 font-medium">Admission No</th>
                                <th className="px-5 py-4 font-medium">Student Name</th>
                                <th className="px-5 py-4 font-medium">Roll No</th>
                                <th className="px-5 py-4 font-medium">Class</th>
                                <th className="px-5 py-4 font-medium">Section</th>
                                <th className="px-5 py-4 font-medium">Date of Birth</th>
                                <th className="px-5 py-4 font-medium">Gender</th>
                                <th className="px-5 py-4 font-medium text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {paginatedStudents.length > 0 ? paginatedStudents.map((student) => {
                                const className = classes.find(c => c.id === student.class_id)?.name || "Unknown";
                                const sectionName = sections.find(s => s.id === student.section_id)?.name || "-";

                                return (
                                    <tr key={student.student_id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-5 py-3.5 text-muted-foreground font-medium">{student.admission_number}</td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center font-semibold text-xs shrink-0">
                                                    {student.first_name.charAt(0)}
                                                </div>
                                                <Link to={`/student/view/${student.student_id}`} className="font-medium text-foreground hover:text-violet-600 transition-colors hover:underline">
                                                    {student.first_name} {student.last_name}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">{student.roll_number}</td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                                {className}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 font-medium">{sectionName}</td>
                                        <td className="px-5 py-3.5 text-muted-foreground">{student.date_of_birth}</td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${student.gender === "Male" ? "bg-blue-500" : "bg-pink-500"}`}></div>
                                                <span>{student.gender}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <Link to={`/student/view/${student.student_id}?edit=true`} className="p-1.5 text-muted-foreground hover:text-green-600 hover:bg-green-50 rounded-md transition-colors">
                                                    <PenLine className="w-4 h-4" />
                                                </Link>
                                                <button className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">
                                        No students found matching the criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
                    <div>
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border rounded-md hover:bg-accent disabled:opacity-50 transition-colors"
                        >
                            Previous
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                let pageNum = currentPage;
                                if (currentPage <= 3) pageNum = i + 1;
                                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                else pageNum = currentPage - 2 + i;

                                if (pageNum < 1 || pageNum > totalPages) return null;

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-9 h-9 flex items-center justify-center rounded-md border transition-colors ${currentPage === pageNum ? "bg-violet-600 text-white border-violet-600" : "hover:bg-accent"}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1.5 border rounded-md hover:bg-accent disabled:opacity-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
