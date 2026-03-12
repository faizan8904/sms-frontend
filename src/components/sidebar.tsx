import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ChevronDown, PanelLeftClose, PanelLeft, X } from "lucide-react"
import {
    LayoutDashboard,
    GraduationCap,
    Users,
    UserCog,
    DollarSign,
    Receipt,
    ClipboardList,
    CalendarCheck,
    BookOpen,
    UserCheck,
    Megaphone,
    PenLine,
    Library,
    Package,
    Award,
    BarChart3,
    ScrollText,
} from "lucide-react"

export interface MenuItem {
    label: string
    icon: React.ComponentType<{ className?: string }>
    path?: string
    children?: { label: string; path: string }[]
}

// eslint-disable-next-line react-refresh/only-export-components
export const menuItems: MenuItem[] = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/",
    },
    {
        label: "Student",
        icon: GraduationCap,
        children: [
            { label: "Student Details", path: "/student/details" },
            { label: "Student Admission", path: "/student/admission" },
            { label: "Former Students", path: "/student/former" },
            { label: "Bulk Delete", path: "/student/bulk-delete" },
            { label: "Edit Student", path: "/student/edit" },
        ],
    },
    {
        label: "Teacher",
        icon: Users,
        children: [
            { label: "Teacher Details", path: "/teacher/details" },
            { label: "Teacher Admission", path: "/teacher/admission" },
            { label: "Former Teachers", path: "/teacher/former" },
            { label: "Bulk Delete", path: "/teacher/bulk-delete" },
            { label: "Edit Teacher", path: "/teacher/edit" },
        ],
    },
    {
        label: "Staff",
        icon: UserCog,
        children: [
            { label: "Staff Details", path: "/staff/details" },
            { label: "Add Staff", path: "/staff/add" },
            { label: "Former Staff", path: "/staff/former" },
            { label: "Bulk Delete", path: "/staff/bulk-delete" },
            { label: "Edit Staff", path: "/staff/edit" },
        ],
    },
    {
        label: "Fees",
        icon: DollarSign,
        children: [
            { label: "Collect Fee", path: "/fees/collect" },
            { label: "Demand Bill Print", path: "/fees/demand-bill" },
            { label: "Offline Bank Payment", path: "/fees/offline-payment" },
            { label: "Search", path: "/fees/search" },
            { label: "Expenses", path: "/fees/expenses" },
            { label: "Fees Discount", path: "/fees/discount" },
            { label: "Fee Structure", path: "/fees/structure" },
            { label: "Search Due Fees", path: "/fees/search-due" },
            { label: "Fees Carry Forward", path: "/fees/carry-forward" },
        ],
    },
    {
        label: "Expense",
        icon: Receipt,
        children: [
            { label: "Add Expense", path: "/expense/add" },
            { label: "Search Expense", path: "/expense/search" },
            { label: "Expense Head", path: "/expense/head" },
        ],
    },
    {
        label: "Examination",
        icon: ClipboardList,
        children: [
            { label: "Exam Type", path: "/examination/type" },
            { label: "Exam Schedule", path: "/examination/schedule" },
            { label: "Exam Result", path: "/examination/result" },
            { label: "Design Admit Card", path: "/examination/design-admit-card" },
            { label: "Print Admit Card", path: "/examination/print-admit-card" },
            { label: "Design Marksheet", path: "/examination/design-marksheet" },
            { label: "Print Marksheet", path: "/examination/print-marksheet" },
            { label: "Print Marksheet Report", path: "/examination/print-marksheet-report" },
            { label: "Marks Grade", path: "/examination/marks-grade" },
            { label: "Mark Division", path: "/examination/mark-division" },
        ],
    },
    {
        label: "Attendance",
        icon: CalendarCheck,
        children: [
            { label: "Student Attendance", path: "/attendance/student" },
            { label: "Leave", path: "/attendance/leave" },
            { label: "Attendance By Date", path: "/attendance/by-date" },
        ],
    },
    {
        label: "Academics",
        icon: BookOpen,
        children: [
            { label: "Class Timetable", path: "/academics/class-timetable" },
            { label: "Teacher Timetable", path: "/academics/teacher-timetable" },
            { label: "Assign Class Teacher", path: "/academics/assign-class-teacher" },
            { label: "Promote Students", path: "/academics/promote-students" },
            { label: "Subject Group", path: "/academics/subject-group" },
            { label: "Subject", path: "/academics/subject" },
            { label: "Class", path: "/academics/class" },
            { label: "Sections", path: "/academics/sections" },
        ],
    },
    {
        label: "Human Resource",
        icon: UserCheck,
        children: [
            { label: "Staff Directory", path: "/hr/staff-directory" },
            { label: "Staff Attendance", path: "/hr/staff-attendance" },
            { label: "Payroll", path: "/hr/payroll" },
            { label: "Approve Leave Request", path: "/hr/approve-leave" },
            { label: "Apply Leave", path: "/hr/apply-leave" },
            { label: "Designation", path: "/hr/designation" },
            { label: "Department", path: "/hr/department" },
            { label: "Disabled Staff", path: "/hr/disabled-staff" },
            { label: "Teacher Rating", path: "/hr/teacher-rating" },
        ],
    },
    {
        label: "Communicate",
        icon: Megaphone,
        children: [
            { label: "Notice Board", path: "/communicate/notice-board" },
            { label: "Send Email", path: "/communicate/send-email" },
            { label: "Send SMS", path: "/communicate/send-sms" },
            { label: "Email Template", path: "/communicate/email-template" },
            { label: "SMS Template", path: "/communicate/sms-template" },
        ],
    },
    {
        label: "Homework",
        icon: PenLine,
        children: [
            { label: "Add Homework", path: "/homework/add" },
            { label: "Daily Assignment", path: "/homework/daily-assignment" },
        ],
    },
    {
        label: "Library",
        icon: Library,
        children: [
            { label: "Book List", path: "/library/book-list" },
            { label: "Issue And Return", path: "/library/issue-return" },
            { label: "Add Student Member", path: "/library/add-student-member" },
            { label: "Add Staff Member", path: "/library/add-staff-member" },
        ],
    },
    {
        label: "Inventory",
        icon: Package,
        children: [
            { label: "Item Category", path: "/inventory/item-category" },
            { label: "Item", path: "/inventory/item" },
            { label: "Invoice List", path: "/inventory/invoice-list" },
        ],
    },
    {
        label: "Certificate",
        icon: Award,
        children: [
            { label: "Student Certificate", path: "/certificate/student-certificate" },
            { label: "Generate Certificate", path: "/certificate/generate-certificate" },
            { label: "Student ID Card", path: "/certificate/student-id-card" },
            { label: "Generate ID Card", path: "/certificate/generate-id-card" },
            { label: "Staff ID Card", path: "/certificate/staff-id-card" },
            { label: "Generate Staff ID Card", path: "/certificate/generate-staff-id-card" },
        ],
    },
    {
        label: "Reports",
        icon: BarChart3,
        children: [
            { label: "Student Information", path: "/reports/student-information" },
            { label: "Examination", path: "/reports/examination" },
            { label: "Attendance", path: "/reports/attendance" },
            { label: "Homework", path: "/reports/homework" },
        ],
    },
    {
        label: "Logs",
        icon: ScrollText,
        path: "/logs",
    },
]

// ─── Shared nav content (used by both desktop and mobile) ──────────────

interface NavContentProps {
    collapsed: boolean
    onLinkClick?: () => void
}

function NavContent({ collapsed, onLinkClick }: NavContentProps) {
    const location = useLocation()
    const [openMenus, setOpenMenus] = useState<string[]>([])

    const toggleMenu = (label: string) => {
        setOpenMenus((prev) =>
            prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
        )
    }

    const isChildActive = (children?: { path: string }[]) => {
        if (!children) return false
        return children.some((child) => location.pathname === child.path)
    }

    return (
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
            {menuItems.map((item) => {
                const Icon = item.icon
                const hasChildren = item.children && item.children.length > 0
                const isOpen = openMenus.includes(item.label)
                const isActive = item.path
                    ? location.pathname === item.path
                    : isChildActive(item.children)

                if (!hasChildren) {
                    return (
                        <NavLink
                            key={item.label}
                            to={item.path!}
                            onClick={onLinkClick}
                            className={({ isActive: linkActive }) =>
                                cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    linkActive
                                        ? "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )
                            }
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                        </NavLink>
                    )
                }

                return (
                    <div key={item.label}>
                        <button
                            onClick={() => {
                                if (collapsed) return
                                toggleMenu(item.label)
                            }}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            {!collapsed && (
                                <>
                                    <span className="flex-1 truncate text-left">
                                        {item.label}
                                    </span>
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 shrink-0 transition-transform duration-200",
                                            isOpen && "rotate-180"
                                        )}
                                    />
                                </>
                            )}
                        </button>

                        {/* Submenu */}
                        {!collapsed && (
                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-200 ease-in-out",
                                    isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                                )}
                            >
                                <div className="ml-4 border-l pl-4 py-1 space-y-0.5">
                                    {item.children!.map((child) => (
                                        <NavLink
                                            key={child.path}
                                            to={child.path}
                                            onClick={onLinkClick}
                                            className={({ isActive: linkActive }) =>
                                                cn(
                                                    "block rounded-md px-3 py-1.5 text-sm transition-colors",
                                                    linkActive
                                                        ? "bg-violet-100 text-violet-700 font-medium dark:bg-violet-500/10 dark:text-violet-400"
                                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                                )
                                            }
                                        >
                                            {child.label}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </nav>
    )
}

// ─── Logo ──────────────────────────────────────────────────────────────

function Logo({ collapsed }: { collapsed: boolean }) {
    return (
        <div className="flex h-16 items-center border-b px-4 gap-2">
            {!collapsed && (
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <span className="text-lg font-bold whitespace-nowrap bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                        SMS
                    </span>
                </div>
            )}
            {collapsed && (
                <div className="mx-auto h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                </div>
            )}
        </div>
    )
}

// ─── Desktop sidebar ──────────────────────────────────────────────────

interface SidebarProps {
    collapsed: boolean
    onToggle: () => void
    mobileOpen: boolean
    onMobileClose: () => void
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
    return (
        <>
            {/* ── Desktop sidebar (hidden on mobile) ── */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 hidden md:flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
                    collapsed ? "w-16" : "w-64"
                )}
            >
                <Logo collapsed={collapsed} />

                {/* Collapse toggle pill */}
                <button
                    onClick={onToggle}
                    className="absolute -right-3 top-20 z-50 h-6 w-6 flex items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent transition-colors"
                >
                    {collapsed ? (
                        <PanelLeft className="h-3 w-3" />
                    ) : (
                        <PanelLeftClose className="h-3 w-3" />
                    )}
                </button>

                <NavContent collapsed={collapsed} />
            </aside>

            {/* ── Mobile full-screen slide-in overlay ── */}
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 md:hidden",
                    mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onMobileClose}
            />

            {/* Panel */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-background shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header with close button */}
                <div className="flex h-16 items-center justify-between border-b px-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                            SMS
                        </span>
                    </div>
                    <button
                        onClick={onMobileClose}
                        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <NavContent collapsed={false} onLinkClick={onMobileClose} />
            </aside>
        </>
    )
}
