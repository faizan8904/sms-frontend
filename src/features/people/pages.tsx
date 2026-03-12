import { useMemo, useState, type ReactNode } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    LayoutGrid,
    List,
    Mail,
    PenLine,
    Plus,
    Search,
    ShieldAlert,
    Trash2,
    UserRound,
    Users,
    XCircle,
} from "lucide-react"

import { students, type StudentRecord } from "@/db/student_db"
import { teachers, staffMembers, type PersonnelRecord } from "@/db/people_db"
import { classes } from "@/db/class_db"
import { sections } from "@/db/section_db"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type EntityType = "student" | "teacher" | "staff"
type RecordStatus = "active" | "former" | "on-leave"

interface DirectoryRecord {
    id: string
    code: string
    firstName: string
    lastName: string
    gender: "Male" | "Female" | "Other"
    primaryMeta: string
    secondaryMeta: string
    phone: string
    email?: string
    joinedOn: string
    location: string
    status: RecordStatus
}

interface EntityMeta {
    entity: EntityType
    singular: string
    plural: string
    basePath: string
    accent: string
}

const entityMeta: Record<EntityType, EntityMeta> = {
    student: {
        entity: "student",
        singular: "Student",
        plural: "Students",
        basePath: "/student",
        accent: "bg-sky-600",
    },
    teacher: {
        entity: "teacher",
        singular: "Teacher",
        plural: "Teachers",
        basePath: "/teacher",
        accent: "bg-emerald-600",
    },
    staff: {
        entity: "staff",
        singular: "Staff",
        plural: "Staff",
        basePath: "/staff",
        accent: "bg-amber-600",
    },
}

function getClassName(id: string) {
    return classes.find((item) => item.id === id)?.name ?? "Unknown Class"
}

function getSectionName(id: string) {
    return sections.find((item) => item.id === id)?.name ?? "Section"
}

function normalizeStudents() {
    return students.map(
        (student): DirectoryRecord => ({
            id: student.student_id,
            code: student.admission_number,
            firstName: student.first_name,
            lastName: student.last_name,
            gender: student.gender,
            primaryMeta: `${getClassName(student.class_id)} / ${getSectionName(student.section_id)}`,
            secondaryMeta: `Roll ${student.roll_number}`,
            phone: student.emergency_contact_phone,
            email: undefined,
            joinedOn: student.admission_date,
            location: student.city,
            status:
                student.enrollment_status === "Active"
                    ? "active"
                    : student.enrollment_status === "Inactive"
                        ? "former"
                        : "former",
        })
    )
}

function normalizePersonnel(records: PersonnelRecord[]) {
    return records.map(
        (person): DirectoryRecord => ({
            id: person.id,
            code: person.employee_code,
            firstName: person.first_name,
            lastName: person.last_name,
            gender: person.gender,
            primaryMeta: person.designation,
            secondaryMeta: `${getClassName(person.assigned_class_id)} / ${getSectionName(person.assigned_section_id)}`,
            phone: person.phone,
            email: person.email,
            joinedOn: person.joining_date,
            location: person.city,
            status:
                person.status === "Active"
                    ? "active"
                    : person.status === "Former"
                        ? "former"
                        : "on-leave",
        })
    )
}

const studentDirectoryRecords = normalizeStudents()
const teacherDirectoryRecords = normalizePersonnel(teachers)
const staffDirectoryRecords = normalizePersonnel(staffMembers)

function getRecordsByEntity(entity: EntityType) {
    if (entity === "student") return studentDirectoryRecords
    if (entity === "teacher") return teacherDirectoryRecords
    return staffDirectoryRecords
}

function statusLabel(status: RecordStatus) {
    if (status === "active") return "Active"
    if (status === "former") return "Former"
    return "On Leave"
}

function statusStyles(status: RecordStatus) {
    if (status === "active") return "bg-emerald-50 text-emerald-700 border-emerald-200"
    if (status === "former") return "bg-rose-50 text-rose-700 border-rose-200"
    return "bg-amber-50 text-amber-700 border-amber-200"
}

function getPageData(entity: EntityType) {
    const records = getRecordsByEntity(entity)
    const meta = entityMeta[entity]

    return { records, meta }
}

function PageIntro({
    title,
    description,
    action,
}: {
    title: string
    description: string
    action?: ReactNode
}) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {action}
        </div>
    )
}

function SummaryCards({ records, meta }: { records: DirectoryRecord[]; meta: EntityMeta }) {
    const active = records.filter((record) => record.status === "active").length
    const former = records.filter((record) => record.status === "former").length
    const female = records.filter((record) => record.gender === "Female").length

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
                { label: `Total ${meta.plural}`, value: records.length, icon: Users },
                { label: "Active", value: active, icon: CheckCircle2 },
                { label: "Former", value: former, icon: XCircle },
                { label: "Female", value: female, icon: UserRound },
            ].map((item) => {
                const Icon = item.icon

                return (
                    <div key={item.label} className="rounded-2xl border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{item.label}</p>
                                <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                            </div>
                            <div className={cn("rounded-2xl p-3 text-white", meta.accent)}>
                                <Icon className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function DirectoryToolbar({
    search,
    onSearchChange,
    viewMode,
    onViewModeChange,
    actionHref,
    actionLabel,
}: {
    search: string
    onSearchChange: (value: string) => void
    viewMode: "list" | "grid"
    onViewModeChange: (value: "list" | "grid") => void
    actionHref: string
    actionLabel: string
}) {
    return (
        <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search by name, code, city or class"
                        className="pl-9"
                    />
                </div>
                <div className="inline-flex w-fit rounded-xl border bg-muted/40 p-1">
                    <Button
                        type="button"
                        size="sm"
                        variant={viewMode === "list" ? "default" : "ghost"}
                        onClick={() => onViewModeChange("list")}
                    >
                        <List className="mr-2 h-4 w-4" />
                        List
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        onClick={() => onViewModeChange("grid")}
                    >
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        Grid
                    </Button>
                </div>
            </div>
            <Button asChild>
                <Link to={actionHref}>
                    <Plus className="mr-2 h-4 w-4" />
                    {actionLabel}
                </Link>
            </Button>
        </div>
    )
}

function DirectoryGrid({
    records,
    meta,
}: {
    records: DirectoryRecord[]
    meta: EntityMeta
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {records.map((record) => (
                <article key={record.id} className="rounded-2xl border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-semibold text-white", meta.accent)}>
                                {record.firstName.charAt(0)}
                            </div>
                            <div>
                                <h2 className="font-semibold">
                                    {record.firstName} {record.lastName}
                                </h2>
                                <p className="text-sm text-muted-foreground">{record.code}</p>
                            </div>
                        </div>
                        <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", statusStyles(record.status))}>
                            {statusLabel(record.status)}
                        </span>
                    </div>
                    <div className="mt-5 grid gap-3 text-sm">
                        <div className="rounded-xl bg-muted/40 p-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Assignment</p>
                            <p className="mt-1 font-medium">{record.primaryMeta}</p>
                            <p className="text-muted-foreground">{record.secondaryMeta}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border p-3">
                                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Contact</p>
                                <p className="mt-1 font-medium">{record.phone}</p>
                            </div>
                            <div className="rounded-xl border p-3">
                                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Joined</p>
                                <p className="mt-1 font-medium">{record.joinedOn}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                        <Button asChild size="sm" variant="outline">
                            <Link to={`${meta.basePath}/edit/${record.id}`}>
                                <PenLine className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        {meta.entity === "student" && (
                            <Button asChild size="sm" variant="ghost">
                                <Link to={`/student/view/${record.id}`}>Open Profile</Link>
                            </Button>
                        )}
                    </div>
                </article>
            ))}
        </div>
    )
}

function DirectoryTable({
    records,
    meta,
}: {
    records: DirectoryRecord[]
    meta: EntityMeta
}) {
    return (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-muted/40 text-muted-foreground">
                        <tr>
                            <th className="px-5 py-4 font-medium">Name</th>
                            <th className="px-5 py-4 font-medium">Code</th>
                            <th className="px-5 py-4 font-medium">Assignment</th>
                            <th className="px-5 py-4 font-medium">Status</th>
                            <th className="px-5 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record.id} className="border-t">
                                <td className="px-5 py-4">
                                    <div className="font-medium">
                                        {record.firstName} {record.lastName}
                                    </div>
                                    <div className="text-muted-foreground">{record.location}</div>
                                </td>
                                <td className="px-5 py-4">{record.code}</td>
                                <td className="px-5 py-4">
                                    <div>{record.primaryMeta}</div>
                                    <div className="text-muted-foreground">{record.secondaryMeta}</div>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", statusStyles(record.status))}>
                                        {statusLabel(record.status)}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        <Button asChild size="sm" variant="outline">
                                            <Link to={`${meta.basePath}/edit/${record.id}`}>Edit</Link>
                                        </Button>
                                        {meta.entity === "student" && (
                                            <Button asChild size="sm" variant="ghost">
                                                <Link to={`/student/view/${record.id}`}>Profile</Link>
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export function DirectoryPage({ entity }: { entity: EntityType }) {
    const { records, meta } = getPageData(entity)
    const [search, setSearch] = useState("")
    const [viewMode, setViewMode] = useState<"list" | "grid">("list")

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return records

        return records.filter((record) =>
            [
                record.firstName,
                record.lastName,
                record.code,
                record.primaryMeta,
                record.secondaryMeta,
                record.location,
            ]
                .join(" ")
                .toLowerCase()
                .includes(query)
        )
    }, [records, search])

    return (
        <div className="space-y-6">
            <PageIntro
                title={`${meta.singular} Details`}
                description={`Responsive ${meta.singular.toLowerCase()} directory with list and card layouts for fast scanning.`}
                action={
                    <Button asChild variant="outline">
                        <Link to={`${meta.basePath}/former`}>Former {meta.plural}</Link>
                    </Button>
                }
            />
            <SummaryCards records={records} meta={meta} />
            <DirectoryToolbar
                search={search}
                onSearchChange={setSearch}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                actionHref={`${meta.basePath}/${entity === "staff" ? "add" : "admission"}`}
                actionLabel={entity === "staff" ? "Add Staff" : `Add ${meta.singular}`}
            />
            {viewMode === "grid" ? (
                <DirectoryGrid records={filtered} meta={meta} />
            ) : (
                <DirectoryTable records={filtered} meta={meta} />
            )}
        </div>
    )
}

export function FormerRecordsPage({ entity }: { entity: EntityType }) {
    const { records, meta } = getPageData(entity)
    const formerRecords = useMemo(
        () => records.filter((record) => record.status === "former"),
        [records]
    )

    return (
        <div className="space-y-6">
            <PageIntro
                title={`Former ${meta.plural}`}
                description={`Archived ${meta.singular.toLowerCase()} records kept accessible without cluttering the active directory.`}
                action={
                    <Button asChild variant="outline">
                        <Link to={`${meta.basePath}/details`}>Back to {meta.plural}</Link>
                    </Button>
                }
            />
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Archived records</p>
                        <p className="text-3xl font-semibold">{formerRecords.length}</p>
                    </div>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Keep former {meta.plural.toLowerCase()} searchable for documentation, reporting, and reactivation flows.
                    </p>
                </div>
            </div>
            <DirectoryGrid records={formerRecords} meta={meta} />
        </div>
    )
}

function buildStudentDefaults(student?: StudentRecord) {
    return {
        first_name: student?.first_name ?? "",
        last_name: student?.last_name ?? "",
        gender: student?.gender ?? "Male",
        class_id: student?.class_id ?? classes[0]?.id ?? "",
        section_id: student?.section_id ?? sections[0]?.id ?? "",
        phone: student?.emergency_contact_phone ?? "",
        city: student?.city ?? "",
        admission_date: student?.admission_date ?? "",
    }
}

function buildPersonnelDefaults(person?: PersonnelRecord) {
    return {
        first_name: person?.first_name ?? "",
        last_name: person?.last_name ?? "",
        gender: person?.gender ?? "Male",
        department: person?.department ?? "",
        designation: person?.designation ?? "",
        phone: person?.phone ?? "",
        email: person?.email ?? "",
        joining_date: person?.joining_date ?? "",
    }
}

const studentFormSchema = z.object({
    first_name: z.string().min(2),
    last_name: z.string().min(2),
    gender: z.enum(["Male", "Female", "Other"]),
    class_id: z.string().min(1),
    section_id: z.string().min(1),
    phone: z.string().min(5),
    city: z.string().min(2),
    admission_date: z.string().min(1),
})

const personnelFormSchema = z.object({
    first_name: z.string().min(2),
    last_name: z.string().min(2),
    gender: z.enum(["Male", "Female", "Other"]),
    department: z.string().min(2),
    designation: z.string().min(2),
    phone: z.string().min(5),
    email: z.string().email(),
    joining_date: z.string().min(1),
})

function FormField({
    id,
    label,
    error,
    children,
}: {
    id: string
    label: string
    error?: string
    children: ReactNode
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    )
}

function EntityFormBody({
    entity,
    studentForm,
    personnelForm,
}: {
    entity: EntityType
    studentForm: ReturnType<typeof useForm<z.infer<typeof studentFormSchema>>>
    personnelForm: ReturnType<typeof useForm<z.infer<typeof personnelFormSchema>>>
}) {
    if (entity === "student") {
        return (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <FormField id="student-first-name" label="First Name" error={studentForm.formState.errors.first_name?.message}>
                    <Input id="student-first-name" {...studentForm.register("first_name")} />
                </FormField>
                <FormField id="student-last-name" label="Last Name" error={studentForm.formState.errors.last_name?.message}>
                    <Input id="student-last-name" {...studentForm.register("last_name")} />
                </FormField>
                <FormField id="student-gender" label="Gender" error={studentForm.formState.errors.gender?.message}>
                    <select id="student-gender" {...studentForm.register("gender")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </FormField>
                <FormField id="student-class" label="Class" error={studentForm.formState.errors.class_id?.message}>
                    <select id="student-class" {...studentForm.register("class_id")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm">
                        {classes.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </FormField>
                <FormField id="student-section" label="Section" error={studentForm.formState.errors.section_id?.message}>
                    <select id="student-section" {...studentForm.register("section_id")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm">
                        {sections.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </FormField>
                <FormField id="student-admission-date" label="Admission Date" error={studentForm.formState.errors.admission_date?.message}>
                    <Input id="student-admission-date" type="date" {...studentForm.register("admission_date")} />
                </FormField>
                <FormField id="student-phone" label="Guardian Phone" error={studentForm.formState.errors.phone?.message}>
                    <Input id="student-phone" {...studentForm.register("phone")} />
                </FormField>
                <FormField id="student-city" label="City" error={studentForm.formState.errors.city?.message}>
                    <Input id="student-city" {...studentForm.register("city")} />
                </FormField>
            </div>
        )
    }

    return (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <FormField id={`${entity}-first-name`} label="First Name" error={personnelForm.formState.errors.first_name?.message}>
                <Input id={`${entity}-first-name`} {...personnelForm.register("first_name")} />
            </FormField>
            <FormField id={`${entity}-last-name`} label="Last Name" error={personnelForm.formState.errors.last_name?.message}>
                <Input id={`${entity}-last-name`} {...personnelForm.register("last_name")} />
            </FormField>
            <FormField id={`${entity}-gender`} label="Gender" error={personnelForm.formState.errors.gender?.message}>
                <select id={`${entity}-gender`} {...personnelForm.register("gender")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </FormField>
            <FormField id={`${entity}-department`} label="Department" error={personnelForm.formState.errors.department?.message}>
                <Input id={`${entity}-department`} {...personnelForm.register("department")} />
            </FormField>
            <FormField id={`${entity}-designation`} label="Designation" error={personnelForm.formState.errors.designation?.message}>
                <Input id={`${entity}-designation`} {...personnelForm.register("designation")} />
            </FormField>
            <FormField id={`${entity}-joining-date`} label="Joining Date" error={personnelForm.formState.errors.joining_date?.message}>
                <Input id={`${entity}-joining-date`} type="date" {...personnelForm.register("joining_date")} />
            </FormField>
            <FormField id={`${entity}-phone`} label="Phone" error={personnelForm.formState.errors.phone?.message}>
                <Input id={`${entity}-phone`} {...personnelForm.register("phone")} />
            </FormField>
            <FormField id={`${entity}-email`} label="Email" error={personnelForm.formState.errors.email?.message}>
                <Input id={`${entity}-email`} type="email" {...personnelForm.register("email")} />
            </FormField>
        </div>
    )
}

export function AdmissionPage({ entity }: { entity: EntityType }) {
    return <EntityFormPage entity={entity} mode="create" />
}

function EntityFormPage({
    entity,
    mode,
    student,
    person,
}: {
    entity: EntityType
    mode: "create" | "edit"
    student?: StudentRecord
    person?: PersonnelRecord
}) {
    const meta = entityMeta[entity]
    const navigate = useNavigate()

    const studentForm = useForm<z.infer<typeof studentFormSchema>>({
        resolver: zodResolver(studentFormSchema),
        defaultValues: buildStudentDefaults(student),
    })

    const personnelForm = useForm<z.infer<typeof personnelFormSchema>>({
        resolver: zodResolver(personnelFormSchema),
        defaultValues: buildPersonnelDefaults(person),
    })

    const isStudent = entity === "student"
    const form = isStudent ? studentForm : personnelForm

    const submit = form.handleSubmit(() => {
        navigate(`${meta.basePath}/details`)
    })

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <PageIntro
                title={
                    mode === "edit"
                        ? `Edit ${meta.singular}`
                        : entity === "staff"
                            ? "Add Staff"
                            : `${meta.singular} Admission`
                }
                description={`Clean mobile-friendly form layout for ${meta.singular.toLowerCase()} ${mode === "edit" ? "updates" : "onboarding"}.`}
                action={
                    <Button asChild variant="outline">
                        <Link to={`${meta.basePath}/details`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                }
            />
            <form onSubmit={submit} className="space-y-6">
                <section className="rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <div className={cn("h-10 w-10 rounded-2xl text-white flex items-center justify-center", meta.accent)}>
                            <UserRound className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="font-semibold">Core Information</h2>
                            <p className="text-sm text-muted-foreground">Only high-signal fields are shown to keep the form fast.</p>
                        </div>
                    </div>
                    <EntityFormBody entity={entity} studentForm={studentForm} personnelForm={personnelForm} />
                </section>
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                        Reset
                    </Button>
                    <Button type="submit">
                        {entity === "staff" ? "Save Staff" : `Save ${meta.singular}`}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export function BulkDeletePage({ entity }: { entity: EntityType }) {
    const { records, meta } = getPageData(entity)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [search, setSearch] = useState("")

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        return records.filter((record) =>
            [record.firstName, record.lastName, record.code, record.primaryMeta]
                .join(" ")
                .toLowerCase()
                .includes(query)
        )
    }, [records, search])

    const allVisibleSelected = filtered.length > 0 && filtered.every((record) => selectedIds.includes(record.id))

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <PageIntro
                title={`Bulk Delete ${meta.plural}`}
                description={`Optimized selection flow to review and remove multiple ${meta.plural.toLowerCase()} at once.`}
            />
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
                <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 h-5 w-5 text-destructive" />
                    <div>
                        <p className="font-medium text-destructive">Destructive action</p>
                        <p className="text-sm text-muted-foreground">
                            Keep this page lean and explicit. Large row counts remain stable because filtering and selection are memoized against the rendered list.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={`Search ${meta.plural.toLowerCase()}`}
                        className="pl-9"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <p className="text-sm font-medium">{selectedIds.length} selected</p>
                    <Button variant="destructive" disabled={selectedIds.length === 0}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Selected
                    </Button>
                </div>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-5 py-4">
                                    <input
                                        type="checkbox"
                                        checked={allVisibleSelected}
                                        onChange={(event) =>
                                            setSelectedIds(
                                                event.target.checked ? filtered.map((record) => record.id) : []
                                            )
                                        }
                                    />
                                </th>
                                <th className="px-5 py-4 font-medium">Name</th>
                                <th className="px-5 py-4 font-medium">Code</th>
                                <th className="px-5 py-4 font-medium">Assignment</th>
                                <th className="px-5 py-4 font-medium">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((record) => {
                                const selected = selectedIds.includes(record.id)
                                return (
                                    <tr key={record.id} className={cn("border-t", selected && "bg-destructive/5")}>
                                        <td className="px-5 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                onChange={(event) =>
                                                    setSelectedIds((current) =>
                                                        event.target.checked
                                                            ? [...current, record.id]
                                                            : current.filter((item) => item !== record.id)
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-5 py-4">
                                            {record.firstName} {record.lastName}
                                        </td>
                                        <td className="px-5 py-4">{record.code}</td>
                                        <td className="px-5 py-4">{record.primaryMeta}</td>
                                        <td className="px-5 py-4">{record.joinedOn}</td>
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

export function EditPage({ entity }: { entity: EntityType }) {
    const { id } = useParams()
    const student = entity === "student" ? students.find((item) => item.student_id === id) ?? students[0] : undefined
    const person =
        entity === "teacher"
            ? teachers.find((item) => item.id === id) ?? teachers[0]
            : entity === "staff"
                ? staffMembers.find((item) => item.id === id) ?? staffMembers[0]
                : undefined

    return <EntityFormPage entity={entity} mode="edit" student={student} person={person} />
}

export function StudentProfilePage() {
    const { id } = useParams()
    const student = students.find((item) => item.student_id === id)

    if (!student) {
        return (
            <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
                <p className="text-lg font-semibold">Student not found</p>
                <Button asChild className="mt-4">
                    <Link to="/student/details">Back to Students</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <PageIntro
                title="Student Profile"
                description="Compact profile view with academic and emergency details."
                action={
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link to="/student/details">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link to={`/student/edit/${student.student_id}`}>
                                <PenLine className="mr-2 h-4 w-4" />
                                Edit Student
                            </Link>
                        </Button>
                    </div>
                }
            />
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                <aside className="rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-600 p-6 text-white">
                        <p className="text-sm uppercase tracking-[0.22em] text-white/70">Student card</p>
                        <p className="mt-6 text-3xl font-semibold">
                            {student.first_name} {student.last_name}
                        </p>
                        <p className="mt-1 text-sm text-white/80">{student.admission_number}</p>
                    </div>
                    <div className="mt-5 grid gap-3 text-sm">
                        <div className="rounded-xl border p-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Class</p>
                            <p className="mt-1 font-medium">
                                {getClassName(student.class_id)} / {getSectionName(student.section_id)}
                            </p>
                        </div>
                        <div className="rounded-xl border p-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Status</p>
                            <p className="mt-1 font-medium">{student.enrollment_status}</p>
                        </div>
                    </div>
                </aside>
                <section className="grid gap-6">
                    <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-sky-600" />
                            <h2 className="font-semibold">Academic Snapshot</h2>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <InfoBlock label="Roll Number" value={student.roll_number} />
                            <InfoBlock label="Academic Year" value={student.academic_year} />
                            <InfoBlock label="Admission Date" value={student.admission_date} />
                            <InfoBlock label="Date of Birth" value={student.date_of_birth} />
                        </div>
                    </div>
                    <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <Mail className="h-5 w-5 text-sky-600" />
                            <h2 className="font-semibold">Contact Details</h2>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoBlock label="Emergency Contact" value={student.emergency_contact_name} />
                            <InfoBlock label="Phone" value={student.emergency_contact_phone} />
                            <InfoBlock label="City" value={student.city} />
                            <InfoBlock label="Address" value={student.address_line1} />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
            <p className="mt-1 font-medium">{value}</p>
        </div>
    )
}
