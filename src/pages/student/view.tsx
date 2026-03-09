import { useParams, Link } from "react-router-dom"
import { students } from "@/db/student_db"
import { classes } from "@/db/class_db"
import { sections } from "@/db/section_db"
import {
    User,
    ArrowLeft,
    Phone,
    MapPin,
    BookOpen,
    ShieldAlert,
    Download,
    PenLine
} from "lucide-react"

export function StudentProfilePage() {
    const { id } = useParams()
    const student = students.find(s => s.student_id === id)

    if (!student) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-card border rounded-xl m-4">
                <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
                <p className="text-muted-foreground mb-6">We couldn't find a student with the ID provided.</p>
                <Link to="/student/details" className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                    Back to Student List
                </Link>
            </div>
        )
    }

    const className = classes.find(c => c.id === student.class_id)?.name || "Unknown"
    const sectionName = sections.find(s => s.id === student.section_id)?.name || "Unknown"

    return (
        <div className="flex flex-col gap-6 p-1 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/student/details" className="p-2 border rounded-md hover:bg-muted transition-colors">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Student Profile</h1>
                        <p className="text-sm text-muted-foreground">Managing {student.first_name}'s academic record</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors text-sm font-medium">
                        <Download className="w-4 h-4" />
                        ID Card
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium">
                        <PenLine className="w-4 h-4" />
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Basic Info Card */}
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col h-fit sticky top-6">
                    <div className="h-28 bg-gradient-to-br from-violet-600 to-purple-700"></div>
                    <div className="px-6 pb-6 flex flex-col items-center -mt-14">
                        <div className="w-28 h-28 rounded-2xl border-4 border-card bg-muted flex items-center justify-center text-4xl font-bold text-violet-600 dark:text-violet-400 shadow-xl overflow-hidden">
                            {student.photo ? <img src={student.photo} alt="Student" className="w-full h-full object-cover" /> : <span>{student.first_name.charAt(0)}{student.last_name.charAt(0)}</span>}
                        </div>
                        <h2 className="text-xl font-bold mt-4 text-center">{student.first_name} {student.last_name}</h2>
                        <p className="text-muted-foreground text-sm font-medium">{student.admission_number}</p>

                        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${student.enrollment_status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700'
                                }`}>
                                {student.enrollment_status}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400">
                                {student.gender}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Information Sections */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Academic Section */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-6 text-violet-600">
                            <BookOpen className="w-5 h-5" />
                            Academic Overview
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Class</p>
                                <p className="font-medium text-base">{className}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Section</p>
                                <p className="font-medium text-base">{sectionName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Roll Number</p>
                                <p className="font-medium text-base">{student.roll_number}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Academic Year</p>
                                <p className="font-medium text-base">{student.academic_year}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Admission Date</p>
                                <p className="font-medium text-base">{student.admission_date}</p>
                            </div>
                        </div>
                    </div>

                    {/* Personal & Contact Section */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-6 text-blue-600">
                            <User className="w-5 h-5" />
                            Personal & Contact
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Date of Birth</p>
                                    <p className="font-medium">{student.date_of_birth}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Address</p>
                                    <p className="font-medium leading-relaxed">
                                        {student.address_line1}<br />
                                        {student.city}, {student.state}<br />
                                        {student.country} - {student.postal_code}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1">
                                        <ShieldAlert className="w-3 h-3" />
                                        Emergency Contact
                                    </p>
                                    <p className="font-medium">{student.emergency_contact_name}</p>
                                    <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                                        <Phone className="w-3.5 h-3.5" />
                                        {student.emergency_contact_phone}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Medical Info</p>
                                    <p className="font-medium">{student.medical_info || "No records"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
