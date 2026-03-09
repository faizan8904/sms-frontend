import { v4 as uuidv4 } from "uuid";
import { classes } from "./class_db";
import { sections } from "./section_db";

export interface StudentRecord {
    student_id: string;
    school_id: string;
    user_id: string;
    admission_number: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    date_of_birth: string;
    gender: "Male" | "Female" | "Other";
    roll_number: string;
    class_id: string;
    section_id: string;
    academic_year: string;
    admission_date: string;
    photo: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    medical_info: string;
    enrollment_status: "Active" | "Inactive" | "Graduated";
}

const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];

export const students: StudentRecord[] = Array.from({ length: 500 }).map((_, index) => {
    const classRecord = classes[Math.floor(Math.random() * classes.length)];
    const sectionRecord = sections[Math.floor(Math.random() * sections.length)];
    const isMale = Math.random() > 0.5;

    return {
        student_id: uuidv4(),
        school_id: uuidv4(),
        user_id: uuidv4(),
        admission_number: `ADM-2023-${(index + 1).toString().padStart(4, '0')}`,
        first_name: firstNames[Math.floor(Math.random() * firstNames.length)],
        middle_name: "",
        last_name: lastNames[Math.floor(Math.random() * lastNames.length)],
        date_of_birth: `20${Math.floor(Math.random() * 10 + 5).toString().padStart(2, '0')}-0${Math.floor(Math.random() * 8 + 1)}-${Math.floor(Math.random() * 20 + 10)}`,
        gender: isMale ? "Male" : "Female",
        roll_number: (Math.floor(Math.random() * 50) + 1).toString(),
        class_id: classRecord.id,
        section_id: sectionRecord.id,
        academic_year: "2023-2024",
        admission_date: `2023-0${Math.floor(Math.random() * 8 + 1)}-${Math.floor(Math.random() * 20 + 10)}`,
        photo: "",
        address_line1: `${Math.floor(Math.random() * 9000) + 100} Main St`,
        address_line2: "",
        city: cities[Math.floor(Math.random() * cities.length)],
        state: "CA",
        postal_code: "90001",
        country: "USA",
        emergency_contact_name: lastNames[Math.floor(Math.random() * lastNames.length)],
        emergency_contact_phone: `+1-555-${(Math.floor(Math.random() * 9000) + 1000)}`,
        medical_info: "None",
        enrollment_status: Math.random() > 0.05 ? "Active" : "Inactive",
    };
});
