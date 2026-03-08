import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import { DashboardPage } from "./pages/dashboard"
import { PlaceholderPage } from "./pages/placeholder-page"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <DashboardPage /> },

            // Student
            { path: "student/details", element: <PlaceholderPage title="Student Details" /> },
            { path: "student/admission", element: <PlaceholderPage title="Student Admission" /> },
            { path: "student/disabled", element: <PlaceholderPage title="Disabled Students" /> },
            { path: "student/bulk-delete", element: <PlaceholderPage title="Bulk Delete Students" /> },
            { path: "student/edit", element: <PlaceholderPage title="Edit Student" /> },

            // Teacher
            { path: "teacher/details", element: <PlaceholderPage title="Teacher Details" /> },
            { path: "teacher/admission", element: <PlaceholderPage title="Teacher Admission" /> },
            { path: "teacher/disabled", element: <PlaceholderPage title="Disabled Teachers" /> },
            { path: "teacher/bulk-delete", element: <PlaceholderPage title="Bulk Delete Teachers" /> },
            { path: "teacher/edit", element: <PlaceholderPage title="Edit Teacher" /> },

            // Staff
            { path: "staff/details", element: <PlaceholderPage title="Staff Details" /> },
            { path: "staff/add", element: <PlaceholderPage title="Add Staff" /> },
            { path: "staff/disabled", element: <PlaceholderPage title="Disabled Staff" /> },
            { path: "staff/bulk-delete", element: <PlaceholderPage title="Bulk Delete Staff" /> },
            { path: "staff/edit", element: <PlaceholderPage title="Edit Staff" /> },

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
            { path: "academics/class", element: <PlaceholderPage title="Class" /> },
            { path: "academics/sections", element: <PlaceholderPage title="Sections" /> },

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
            { path: "certificate/generate-id-card", element: <PlaceholderPage title="Generate ID Card" /> },
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
