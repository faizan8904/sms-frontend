import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { classes } from "@/db/class_db"
import { sections } from "@/db/section_db"
import { Save, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

const studentSchema = z.object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    middle_name: z.string().optional(),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    date_of_birth: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender is required" }),
    roll_number: z.string().min(1, "Roll number is required"),
    class_id: z.string().min(1, "Class is required"),
    section_id: z.string().min(1, "Section is required"),
    academic_year: z.string().min(1, "Academic year is required"),
    admission_date: z.string().min(1, "Admission date is required"),
    address_line1: z.string().min(1, "Address is required"),
    address_line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    emergency_contact_name: z.string().min(1, "Emergency contact name is required"),
    emergency_contact_phone: z.string().min(1, "Emergency contact phone is required"),
    medical_info: z.string().optional(),
    enrollment_status: z.enum(["Active", "Inactive", "Graduated"]).default("Active")
})

type StudentFormValues = z.infer<typeof studentSchema>

export function StudentAdmissionPage() {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<StudentFormValues>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            academic_year: "2023-2024",
            enrollment_status: "Active",
            country: "India"
        }
    })

    const onSubmit = (data: StudentFormValues) => {
        console.log("Adding Student:", data)
        alert("Student added successfully to the local database!")
        navigate("/student/details")
    }

    return (
        <div className="flex flex-col gap-6 p-1 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Link to="/student/details" className="p-2 border rounded-md hover:bg-muted transition-colors">
                    <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Student Admission</h1>
                    <p className="text-sm text-muted-foreground mt-1">Fill out the form below to enroll a new student</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-6 border-b pb-2 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-violet-600 rounded-full"></div>
                        Personal Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">First Name <span className="text-red-500">*</span></label>
                            <input {...register("first_name")} className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" placeholder="Enter first name" />
                            {errors.first_name && <p className="text-xs text-red-500">{errors.first_name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Middle Name</label>
                            <input {...register("middle_name")} className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" placeholder="Enter middle name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Last Name <span className="text-red-500">*</span></label>
                            <input {...register("last_name")} className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" placeholder="Enter last name" />
                            {errors.last_name && <p className="text-xs text-red-500">{errors.last_name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date of Birth <span className="text-red-500">*</span></label>
                            <input type="date" {...register("date_of_birth")} className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                            {errors.date_of_birth && <p className="text-xs text-red-500">{errors.date_of_birth.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Gender <span className="text-red-500">*</span></label>
                            <select {...register("gender")} className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Academic Information */}
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-6 border-b pb-2 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-violet-600 rounded-full"></div>
                        Academic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Class <span className="text-red-500">*</span></label>
                            <select {...register("class_id")} className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                                <option value="">Select Class</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.class_id && <p className="text-xs text-red-500">{errors.class_id.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Section <span className="text-red-500">*</span></label>
                            <select {...register("section_id")} className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                                <option value="">Select Section</option>
                                {sections.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            {errors.section_id && <p className="text-xs text-red-500">{errors.section_id.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Roll Number <span className="text-red-500">*</span></label>
                            <input {...register("roll_number")} className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" placeholder="Enter roll number" />
                            {errors.roll_number && <p className="text-xs text-red-500">{errors.roll_number.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Academic Year <span className="text-red-500">*</span></label>
                            <input {...register("academic_year")} className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                            {errors.academic_year && <p className="text-xs text-red-500">{errors.academic_year.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Admission Date <span className="text-red-500">*</span></label>
                            <input type="date" {...register("admission_date")} className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                            {errors.admission_date && <p className="text-xs text-red-500">{errors.admission_date.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-6 border-b pb-2 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-violet-600 rounded-full"></div>
                        Address & Contact
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Address Line 1 <span className="text-red-500">*</span></label>
                            <input {...register("address_line1")} className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" placeholder="Street address, P.O. box, etc." />
                            {errors.address_line1 && <p className="text-xs text-red-500">{errors.address_line1.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">City <span className="text-red-500">*</span></label>
                            <input {...register("city")} className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" placeholder="City" />
                            {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">State <span className="text-red-500">*</span></label>
                            <input {...register("state")} className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" placeholder="State/Province" />
                            {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Emergency Contact Name <span className="text-red-500">*</span></label>
                            <input {...register("emergency_contact_name")} className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" placeholder="Full name of contact" />
                            {errors.emergency_contact_name && <p className="text-xs text-red-500">{errors.emergency_contact_name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Emergency Contact Phone <span className="text-red-500">*</span></label>
                            <input {...register("emergency_contact_phone")} className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" placeholder="Phone number" />
                            {errors.emergency_contact_phone && <p className="text-xs text-red-500">{errors.emergency_contact_phone.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pb-10">
                    <button type="button" onClick={() => reset()} className="px-6 py-2 border rounded-lg hover:bg-muted font-medium transition-colors">
                        Reset Form
                    </button>
                    <button type="submit" className="flex items-center gap-2 px-8 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors shadow-sm">
                        <Save className="w-4 h-4" />
                        Complete Admission
                    </button>
                </div>
            </form>
        </div>
    )
}
