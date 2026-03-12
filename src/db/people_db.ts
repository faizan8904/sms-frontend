import { v4 as uuidv4 } from "uuid"

import { classes } from "./class_db"
import { sections } from "./section_db"

export type PersonnelStatus = "Active" | "On Leave" | "Former"
export type Gender = "Male" | "Female" | "Other"

export interface PersonnelRecord {
    id: string
    employee_code: string
    first_name: string
    last_name: string
    gender: Gender
    phone: string
    email: string
    address: string
    city: string
    department: string
    designation: string
    qualification: string
    joining_date: string
    assigned_class_id: string
    assigned_section_id: string
    status: PersonnelStatus
}

const firstNames = [
    "Aarav",
    "Emma",
    "Noah",
    "Olivia",
    "Liam",
    "Sophia",
    "Mason",
    "Ava",
    "Ethan",
    "Mia",
    "Lucas",
    "Isabella",
]

const lastNames = [
    "Sharma",
    "Patel",
    "Khan",
    "Wilson",
    "Brown",
    "Davis",
    "Miller",
    "Anderson",
    "Taylor",
    "Garcia",
]

const cities = ["New York", "Chicago", "Dallas", "Austin", "Seattle", "Phoenix"]

function buildPersonnelRecords(prefix: string, count: number, department: string, designation: string) {
    return Array.from({ length: count }).map((_, index) => {
        const firstName = firstNames[index % firstNames.length]
        const lastName = lastNames[(index * 3) % lastNames.length]
        const assignedClass = classes[index % classes.length]
        const assignedSection = sections[index % sections.length]
        const status: PersonnelStatus =
            index % 9 === 0 ? "Former" : index % 7 === 0 ? "On Leave" : "Active"

        return {
            id: uuidv4(),
            employee_code: `${prefix}-${String(index + 1).padStart(4, "0")}`,
            first_name: firstName,
            last_name: lastName,
            gender: index % 2 === 0 ? "Female" : "Male",
            phone: `+1-202-555-${String(1000 + index).slice(-4)}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.edu`,
            address: `${200 + index} Cedar Avenue`,
            city: cities[index % cities.length],
            department,
            designation,
            qualification: index % 3 === 0 ? "M.Ed" : "B.Ed",
            joining_date: `202${index % 4}-0${(index % 8) + 1}-1${index % 9}`,
            assigned_class_id: assignedClass.id,
            assigned_section_id: assignedSection.id,
            status,
        } satisfies PersonnelRecord
    })
}

export const teachers: PersonnelRecord[] = buildPersonnelRecords("TCH", 48, "Academics", "Subject Teacher")
export const staffMembers: PersonnelRecord[] = buildPersonnelRecords("STF", 36, "Operations", "Administrator")
