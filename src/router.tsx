import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import { DashboardPage } from "./pages/dashboard"
import { PlaceholderPage } from "./pages/placeholder-page"
import { ClassPage } from "./pages/academics/class"
import { SectionsPage } from "./pages/academics/sections"
import { IdCardGeneratorPage } from "./pages/admin/IdCardGeneratorPage"
import {
    AdmissionPage,
    BulkDeletePage,
    DirectoryPage,
    EditPage,
    FormerRecordsPage,
    StudentProfilePage,
} from "./features/people/pages"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <DashboardPage /> },

            // Student
            { path: "student/details", element: <DirectoryPage entity="student" /> },
            { path: "student/view/:id", element: <StudentProfilePage /> },
            { path: "student/admission", element: <AdmissionPage entity="student" /> },
            { path: "student/former", element: <FormerRecordsPage entity="student" /> },
            { path: "student/bulk-delete", element: <BulkDeletePage entity="student" /> },
            { path: "student/edit", element: <EditPage entity="student" /> },
            { path: "student/edit/:id", element: <EditPage entity="student" /> },

            // Teacher
            { path: "teacher/details", element: <DirectoryPage entity="teacher" /> },
            { path: "teacher/admission", element: <AdmissionPage entity="teacher" /> },
            { path: "teacher/former", element: <FormerRecordsPage entity="teacher" /> },
            { path: "teacher/bulk-delete", element: <BulkDeletePage entity="teacher" /> },
            { path: "teacher/edit", element: <EditPage entity="teacher" /> },
            { path: "teacher/edit/:id", element: <EditPage entity="teacher" /> },

            // Staff
            { path: "staff/details", element: <DirectoryPage entity="staff" /> },
            { path: "staff/add", element: <AdmissionPage entity="staff" /> },
            { path: "staff/former", element: <FormerRecordsPage entity="staff" /> },
            { path: "staff/bulk-delete", element: <BulkDeletePage entity="staff" /> },
            { path: "staff/edit", element: <EditPage entity="staff" /> },
            { path: "staff/edit/:id", element: <EditPage entity="staff" /> },

            // Fees
            { path: "fees/collect", element: <PlaceholderPage title="Collect Fee" /> },
            { path: "fees/demand-bill", element: <PlaceholderPage title="Demand Bill Print" /> },
            { path: "fees/offline-payment", element: <PlaceholderPage title="Offline Bank Payment" /> },
            { path: "fees/search", element: <PlaceholderPage title="Search Fees" /> },
            { path: "fees/expenses", element: <PlaceholderPage title="Expenses" /> },
            { path: "fees/discount", element: <PlaceholderPage title="Fees Discount" /> },
            { path: "fees/structure", element: <PlaceholderPage title="Fee Structure" /> },
            { path: "fees/search-due", element: <PlaceholderPage title="Search Due Fees" /> },
            { path: "fees/carry-forward", element: <PlaceholderPage title="Fees Carry Forward" /> },

            // Expense
            { path: "expense/add", element: <PlaceholderPage title="Add Expense" /> },
            { path: "expense/search", element: <PlaceholderPage title="Search Expense" /> },
            { path: "expense/head", element: <PlaceholderPage title="Expense Head" /> },

            // Examination
            { path: "examination/type", element: <PlaceholderPage title="Exam Type" /> },
            { path: "examination/schedule", element: <PlaceholderPage title="Exam Schedule" /> },
            { path: "examination/result", element: <PlaceholderPage title="Exam Result" /> },
            { path: "examination/design-admit-card", element: <PlaceholderPage title="Design Admit Card" /> },
            { path: "examination/print-admit-card", element: <PlaceholderPage title="Print Admit Card" /> },
            { path: "examination/design-marksheet", element: <PlaceholderPage title="Design Marksheet" /> },
            { path: "examination/print-marksheet", element: <PlaceholderPage title="Print Marksheet" /> },
            { path: "examination/print-marksheet-report", element: <PlaceholderPage title="Print Marksheet Report" /> },
            { path: "examination/marks-grade", element: <PlaceholderPage title="Marks Grade" /> },
            { path: "examination/mark-division", element: <PlaceholderPage title="Mark Division" /> },

            // Attendance
            { path: "attendance/student", element: <PlaceholderPage title="Student Attendance" /> },
            { path: "attendance/leave", element: <PlaceholderPage title="Leave" /> },
            { path: "attendance/by-date", element: <PlaceholderPage title="Attendance By Date" /> },

            // Academics
            { path: "academics/class-timetable", element: <PlaceholderPage title="Class Timetable" /> },
            { path: "academics/teacher-timetable", element: <PlaceholderPage title="Teacher Timetable" /> },
            { path: "academics/assign-class-teacher", element: <PlaceholderPage title="Assign Class Teacher" /> },
            { path: "academics/promote-students", element: <PlaceholderPage title="Promote Students" /> },
            { path: "academics/subject-group", element: <PlaceholderPage title="Subject Group" /> },
            { path: "academics/subject", element: <PlaceholderPage title="Subject" /> },
            { path: "academics/class", element: <ClassPage /> },
            { path: "academics/sections", element: <SectionsPage /> },

            // Human Resource
            { path: "hr/staff-directory", element: <PlaceholderPage title="Staff Directory" /> },
            { path: "hr/staff-attendance", element: <PlaceholderPage title="Staff Attendance" /> },
            { path: "hr/payroll", element: <PlaceholderPage title="Payroll" /> },
            { path: "hr/approve-leave", element: <PlaceholderPage title="Approve Leave Request" /> },
            { path: "hr/apply-leave", element: <PlaceholderPage title="Apply Leave" /> },
            { path: "hr/designation", element: <PlaceholderPage title="Designation" /> },
            { path: "hr/department", element: <PlaceholderPage title="Department" /> },
            { path: "hr/disabled-staff", element: <PlaceholderPage title="Disabled Staff" /> },
            { path: "hr/teacher-rating", element: <PlaceholderPage title="Teacher Rating" /> },

            // Communicate
            { path: "communicate/notice-board", element: <PlaceholderPage title="Notice Board" /> },
            { path: "communicate/send-email", element: <PlaceholderPage title="Send Email" /> },
            { path: "communicate/send-sms", element: <PlaceholderPage title="Send SMS" /> },
            { path: "communicate/email-template", element: <PlaceholderPage title="Email Template" /> },
            { path: "communicate/sms-template", element: <PlaceholderPage title="SMS Template" /> },

            // Homework
            { path: "homework/add", element: <PlaceholderPage title="Add Homework" /> },
            { path: "homework/daily-assignment", element: <PlaceholderPage title="Daily Assignment" /> },

            // Library
            { path: "library/book-list", element: <PlaceholderPage title="Book List" /> },
            { path: "library/issue-return", element: <PlaceholderPage title="Issue And Return" /> },
            { path: "library/add-student-member", element: <PlaceholderPage title="Add Student Member" /> },
            { path: "library/add-staff-member", element: <PlaceholderPage title="Add Staff Member" /> },

            // Inventory
            { path: "inventory/item-category", element: <PlaceholderPage title="Item Category" /> },
            { path: "inventory/item", element: <PlaceholderPage title="Item" /> },
            { path: "inventory/invoice-list", element: <PlaceholderPage title="Invoice List" /> },

            // Certificate
            { path: "certificate/student-certificate", element: <PlaceholderPage title="Student Certificate" /> },
            { path: "certificate/generate-certificate", element: <PlaceholderPage title="Generate Certificate" /> },
            { path: "certificate/student-id-card", element: <PlaceholderPage title="Student ID Card" /> },
            { path: "certificate/generate-id-card", element: <IdCardGeneratorPage /> },
            { path: "certificate/staff-id-card", element: <PlaceholderPage title="Staff ID Card" /> },
            { path: "certificate/generate-staff-id-card", element: <PlaceholderPage title="Generate Staff ID Card" /> },

            // Reports
            { path: "reports/student-information", element: <PlaceholderPage title="Student Information Report" /> },
            { path: "reports/examination", element: <PlaceholderPage title="Examination Report" /> },
            { path: "reports/attendance", element: <PlaceholderPage title="Attendance Report" /> },
            { path: "reports/homework", element: <PlaceholderPage title="Homework Report" /> },

            // Logs
            { path: "logs", element: <PlaceholderPage title="Logs" /> },
        ],
    },
])
