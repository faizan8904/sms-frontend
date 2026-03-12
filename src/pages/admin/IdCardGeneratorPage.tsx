import React, { useMemo, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import html2canvas from 'html2canvas';
import { Check, Download, Printer, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { classes } from '@/db/class_db';
import { sections } from '@/db/section_db';
import { students, type StudentRecord } from '@/db/student_db';
import { IdCardCanvas } from '@/features/id-cards/components/IdCardCanvas';
import { IdCardCustomizer } from '@/features/id-cards/components/IdCardCustomizer';
import type { IdCardTemplate, StudentData } from '@/features/id-cards/types/id-card.types';

const schoolProfile = {
    name: 'Crescent Heights Public School',
    tagline: 'Learn Boldly. Lead Brightly.',
    address: '24 Academy Avenue, Riverside District, Bengaluru 560043',
    phone: '+91 98765 32100',
    website: 'www.crescentheights.edu',
};

const defaultTemplate: IdCardTemplate = {
    id: 'student-id-template-1',
    schoolId: 'school-1',
    name: 'Aurora Student Card',
    cardSize: 'cr80',
    schoolName: schoolProfile.name,
    schoolTagline: schoolProfile.tagline,
    schoolAddress: schoolProfile.address,
    authorityLabel: 'Principal',
    primaryColor: '#0f766e',
    secondaryColor: '#e6fffb',
    surfaceColor: '#ffffff',
    backAccentColor: '#f3fffd',
    logo: undefined,
    principalSignature: undefined,
    photoShape: 'square',
    frontBackgroundImage: undefined,
    backBackgroundImage: undefined,
    fontFamily: 'Outfit, ui-sans-serif, system-ui, sans-serif',
    cardBorder: 'rounded',
    textColor: '#0f172a',
    accentColor: '#14b8a6',
    labelColor: '#0f766e',
    barcodeLabel: 'Barcode Access',
    supportPhone: schoolProfile.phone,
    website: schoolProfile.website,
    validityText: 'March 31, 2027',
    frontTitle: 'Student Smart ID',
    backTitle: 'Verification & Safety',
    showGuidelines: true,
    guidelinesText:
        'Carry this card during school hours.\nReturn to the school office if found.\nMisuse of this card is prohibited.',
    visibleFields: {
        fatherName: false,
        class: true,
        section: true,
        rollNo: true,
        session: false,
        dob: true,
        phoneNumber: true,
        address: true,
        validity: false,
        admissionNo: false,
        emergencyContact: false,
    },
    extraFieldLabel: '',
    extraFieldValue: '',
};

const formatDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(parsed);
};

const toIndianPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(-10);
    if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    return value;
};

const buildStudentData = (
    student: StudentRecord,
    className: string,
    sectionName: string,
    photoOverride?: string
): StudentData => ({
    id: student.student_id,
    name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
    fatherName: student.emergency_contact_name,
    rollNo: student.roll_number,
    class: className,
    section: sectionName,
    session: student.academic_year,
    phoneNumber: toIndianPhone(student.emergency_contact_phone),
    dob: formatDate(student.date_of_birth),
    address: [student.address_line1, student.address_line2, student.city, student.state, student.postal_code].filter(Boolean).join(', '),
    photo: photoOverride || student.photo || undefined,
    admissionNo: student.admission_number,
    bloodGroup: 'B+',
    emergencyContact: toIndianPhone(student.emergency_contact_phone),
    validUpto: '31 Mar 2027',
    schoolName: schoolProfile.name,
    schoolAddress: schoolProfile.address,
});

const cloneStyles = () =>
    Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map((node) => node.outerHTML)
        .join('\n');

const renderToCanvas = async (element: HTMLElement) =>
    html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });

const printMarkup = (markup: string, title: string) => {
    const printWindow = window.open('', '_blank', 'width=1200,height=900');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          ${cloneStyles()}
          <style>
            @page { size: A4 portrait; margin: 8mm; }
            body { margin: 0; padding: 0; background: white; }
            .sheet { page-break-after: always; break-after: page; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          </style>
        </head>
        <body>${markup}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 400);
};

const exportSheetsToPdf = async (sheetNodes: HTMLElement[], filename: string) => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    for (let index = 0; index < sheetNodes.length; index += 1) {
        const canvas = await renderToCanvas(sheetNodes[index]);
        const image = canvas.toDataURL('image/png');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 8;
        const width = pageWidth - margin * 2;
        const height = (canvas.height * width) / canvas.width;
        const y = Math.max(margin, (pageHeight - height) / 2);

        if (index > 0) pdf.addPage();
        pdf.addImage(image, 'PNG', margin, y, width, height);
    }

    pdf.save(filename);
};

const chunkStudents = (items: StudentData[], size: number) =>
    Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, index * size + size));

const printLayoutByCardSize: Record<IdCardTemplate['cardSize'], { columns: number; rows: number; gapX: number; gapY: number; sheetPadding: string }> = {
    cr80: { columns: 2, rows: 2, gapX: 28, gapY: 28, sheetPadding: 'p-8' },
    a7: { columns: 2, rows: 2, gapX: 28, gapY: 28, sheetPadding: 'p-8' },
};

const PrintGridPages = React.forwardRef<
    HTMLDivElement,
    { template: IdCardTemplate; students: StudentData[]; side: 'front' | 'back'; cardSize: IdCardTemplate['cardSize'] }
>(({ template, students, side, cardSize }, ref) => {
    const layout = printLayoutByCardSize[cardSize];
    const pages = chunkStudents(students, layout.columns * layout.rows);
    const printTemplate = { ...template, cardSize };

    return (
        <div ref={ref}>
            {pages.map((pageStudents, pageIndex) => (
                <div key={`${side}-${cardSize}-${pageIndex}`} className={`sheet mx-auto grid w-[794px] min-h-[1123px] bg-white text-black ${layout.sheetPadding}`}>
                    <div
                        className="grid content-start justify-items-center self-start"
                        style={{
                            gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
                            columnGap: `${layout.gapX}px`,
                            rowGap: `${layout.gapY}px`,
                        }}
                    >
                        {pageStudents.map((student) => (
                            <div key={`${student.id}-${side}`} className="flex justify-center">
                                <IdCardCanvas template={printTemplate} student={student} side={side} compact />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
});

PrintGridPages.displayName = 'PrintGridPages';

export const IdCardGeneratorPage: React.FC = () => {
    const classNameById = Object.fromEntries(classes.map((item) => [item.id, item.name]));
    const sectionNameById = Object.fromEntries(sections.map((item) => [item.id, item.name]));

    const [template, setTemplate] = useState<IdCardTemplate>(defaultTemplate);
    const [studentSearch, setStudentSearch] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    const [sectionFilter, setSectionFilter] = useState('all');
    const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.student_id ?? '');
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');
    const [printCardSize, setPrintCardSize] = useState<IdCardTemplate['cardSize']>('cr80');
    const [photoOverrides, setPhotoOverrides] = useState<Record<string, string>>({});

    const singleFrontPrintRef = useRef<HTMLDivElement>(null);
    const singleBackPrintRef = useRef<HTMLDivElement>(null);
    const bulkFrontPrintRef = useRef<HTMLDivElement>(null);
    const bulkBackPrintRef = useRef<HTMLDivElement>(null);

    const mappedStudents = useMemo(
        () =>
            students
                .filter((student) => student.enrollment_status === 'Active')
                .map((student) =>
                    buildStudentData(
                        student,
                        classNameById[student.class_id] ?? 'Unknown Class',
                        sectionNameById[student.section_id] ?? 'Unknown Section',
                        photoOverrides[student.student_id]
                    )
                ),
        [classNameById, photoOverrides, sectionNameById]
    );

    const filteredStudents = useMemo(() => {
        const value = studentSearch.toLowerCase();
        return mappedStudents.filter(
            (student) =>
                (student.name.toLowerCase().includes(value) ||
                    student.admissionNo.toLowerCase().includes(value) ||
                    student.id.toLowerCase().includes(value)) &&
                (classFilter === 'all' || student.class === classFilter) &&
                (sectionFilter === 'all' || student.section === sectionFilter)
        );
    }, [classFilter, mappedStudents, sectionFilter, studentSearch]);

    const selectedStudent =
        filteredStudents.find((student) => student.id === selectedStudentId) || filteredStudents[0] || mappedStudents[0];

    const batchMode = classFilter !== 'all' || sectionFilter !== 'all';
    const selectedBatchStudents = filteredStudents.filter((student) => selectedStudentIds.includes(student.id));
    const allBatchSelected = batchMode && filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length;

    const toggleStudentSelection = (studentId: string) => {
        setSelectedStudentIds((current) =>
            current.includes(studentId) ? current.filter((id) => id !== studentId) : [...current, studentId]
        );
    };

    const toggleSelectAll = () => {
        setSelectedStudentIds(allBatchSelected ? [] : filteredStudents.map((student) => student.id));
    };

    const handlePrintSelected = (side: 'front' | 'back') => {
        if (batchMode) {
            const ref = side === 'front' ? bulkFrontPrintRef : bulkBackPrintRef;
            if (!ref.current || selectedBatchStudents.length === 0) return;
            printMarkup(ref.current.innerHTML, `Student ID ${side === 'front' ? 'Front' : 'Back'} Sheets`);
            return;
        }

        const ref = side === 'front' ? singleFrontPrintRef : singleBackPrintRef;
        if (!selectedStudent || !ref.current) return;
        printMarkup(ref.current.innerHTML, `Student ID ${side === 'front' ? 'Front' : 'Back'} - ${selectedStudent.name}`);
    };

    const printSingleStudent = (student: StudentData, side: 'front' | 'back') => {
        const markup = renderToStaticMarkup(
            <PrintGridPages template={template} students={[student]} side={side} cardSize={printCardSize} />
        );
        printMarkup(markup, `Student ID ${side === 'front' ? 'Front' : 'Back'} - ${student.name}`);
    };

    const handlePdfSelected = async (side: 'front' | 'back' = 'front') => {
        if (batchMode) {
            const ref = side === 'front' ? bulkFrontPrintRef : bulkBackPrintRef;
            if (!ref.current || selectedBatchStudents.length === 0) return;
            const nodes = Array.from(ref.current.children) as HTMLElement[];
            await exportSheetsToPdf(nodes, `student-id-${side}-sheets.pdf`);
            return;
        }

        const ref = side === 'front' ? singleFrontPrintRef : singleBackPrintRef;
        if (!selectedStudent || !ref.current) return;
        const nodes = Array.from(ref.current.children) as HTMLElement[];
        await exportSheetsToPdf(nodes, `student-id-${side}-${selectedStudent.id}.pdf`);
    };

    const handlePhotoUpload = (studentId: string, file?: File | null) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoOverrides((current) => ({ ...current, [studentId]: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const printStudents = batchMode ? selectedBatchStudents : selectedStudent ? [selectedStudent] : [];

    return (
        <div className="min-h-[calc(100vh-80px)] bg-background p-6 text-foreground">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
                <Tabs defaultValue="print" className="w-full">
                    <TabsList className="h-auto w-full justify-start gap-2 rounded-xl border bg-card p-2">
                        <TabsTrigger value="print" className="rounded-lg px-4 py-2">
                            Print Card
                        </TabsTrigger>
                        <TabsTrigger value="design" className="rounded-lg px-4 py-2">
                            ID Design
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="print" className="mt-4">
                        <div className="rounded-xl border bg-card p-5">
                            <div className="grid gap-4">
                                <div className="grid gap-4 md:grid-cols-[1fr_180px_180px]">
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Search Student</p>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                className="pl-9"
                                                placeholder="Search by student name or id"
                                                value={studentSearch}
                                                onChange={(event) => setStudentSearch(event.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Class</p>
                                        <Select value={classFilter} onValueChange={setClassFilter}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Classes</SelectItem>
                                                {classes.map((item) => <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Section</p>
                                        <Select value={sectionFilter} onValueChange={setSectionFilter}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Sections</SelectItem>
                                                {sections.map((item) => <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-[180px_auto_auto_auto] md:items-end">
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Print Ratio</p>
                                        <Select value={printCardSize} onValueChange={(value) => setPrintCardSize(value as IdCardTemplate['cardSize'])}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cr80">CR80</SelectItem>
                                                <SelectItem value="a7">A7</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button onClick={() => handlePdfSelected('front')}>
                                        <Download className="mr-2 h-4 w-4" />
                                        PDF Front
                                    </Button>
                                    <Button variant="outline" onClick={() => handlePrintSelected('front')}>
                                        <Printer className="mr-2 h-4 w-4" />
                                        Print Front
                                    </Button>
                                    <Button variant="outline" onClick={() => handlePrintSelected('back')}>
                                        <Printer className="mr-2 h-4 w-4" />
                                        Print Back
                                    </Button>
                                </div>
                            </div>

                            {batchMode ? (
                                <div className="mt-6 overflow-hidden rounded-xl border">
                                    <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
                                        <button
                                            type="button"
                                            onClick={toggleSelectAll}
                                            className="inline-flex items-center gap-2 text-sm font-medium"
                                        >
                                            <span className={`flex h-5 w-5 items-center justify-center rounded border ${allBatchSelected ? 'border-purple-600 bg-purple-600 text-white' : 'border-border bg-background'}`}>
                                                {allBatchSelected ? <Check className="h-3.5 w-3.5" /> : null}
                                            </span>
                                            Select All
                                        </button>
                                        <p className="text-sm text-muted-foreground">{selectedStudentIds.length} selected</p>
                                    </div>
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-muted/30 text-muted-foreground">
                                            <tr>
                                                <th className="px-4 py-3">Select</th>
                                                <th className="px-4 py-3">Roll No</th>
                                                <th className="px-4 py-3">Name</th>
                                                <th className="px-4 py-3">Class</th>
                                                <th className="px-4 py-3">Print</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudents.map((student) => {
                                                const checked = selectedStudentIds.includes(student.id);
                                                return (
                                                <tr key={student.id} className="border-t">
                                                        <td className="px-4 py-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleStudentSelection(student.id)}
                                                                className={`flex h-5 w-5 items-center justify-center rounded border ${checked ? 'border-purple-600 bg-purple-600 text-white' : 'border-border bg-background'}`}
                                                            >
                                                                {checked ? <Check className="h-3.5 w-3.5" /> : null}
                                                            </button>
                                                        </td>
                                                        <td className="px-4 py-3 cursor-pointer" onClick={() => setSelectedStudentId(student.id)}>{student.rollNo}</td>
                                                        <td className="px-4 py-3 cursor-pointer font-medium" onClick={() => setSelectedStudentId(student.id)}>{student.name}</td>
                                                        <td className="px-4 py-3 cursor-pointer" onClick={() => setSelectedStudentId(student.id)}>{student.class}</td>
                                                        <td className="px-4 py-3">
                                                            <Button variant="ghost" size="icon" onClick={() => printSingleStudent(student, 'front')}>
                                                                <Printer className="h-4 w-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="mt-6 overflow-hidden rounded-xl border">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-muted/30 text-muted-foreground">
                                            <tr>
                                                <th className="px-4 py-3">Student Name</th>
                                                <th className="px-4 py-3">Class</th>
                                                <th className="px-4 py-3">Section</th>
                                                <th className="px-4 py-3">Print</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudents.map((student) => (
                                                <tr key={student.id} className="border-t">
                                                    <td className="px-4 py-3 cursor-pointer font-medium" onClick={() => setSelectedStudentId(student.id)}>{student.name}</td>
                                                    <td className="px-4 py-3 cursor-pointer" onClick={() => setSelectedStudentId(student.id)}>{student.class}</td>
                                                    <td className="px-4 py-3 cursor-pointer" onClick={() => setSelectedStudentId(student.id)}>{student.section}</td>
                                                    <td className="px-4 py-3">
                                                        <Button variant="ghost" size="icon" onClick={() => printSingleStudent(student, 'front')}>
                                                            <Printer className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="design" className="mt-4">
                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
                            <section className="rounded-xl border bg-card p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Card Preview</p>
                                        <h2 className="text-2xl font-bold">Single Side Preview</h2>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant={previewSide === 'front' ? 'default' : 'outline'} onClick={() => setPreviewSide('front')}>
                                            Front View
                                        </Button>
                                        <Button variant={previewSide === 'back' ? 'default' : 'outline'} onClick={() => setPreviewSide('back')}>
                                            Back View
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-center rounded-xl border bg-muted/30 p-6">
                                    {selectedStudent ? <IdCardCanvas template={template} student={selectedStudent} side={previewSide} /> : null}
                                </div>

                                {selectedStudent ? (
                                    <div className="mt-4 rounded-xl border bg-background p-4">
                                        <p className="text-sm font-medium">Preview student</p>
                                        <p className="mt-1 text-muted-foreground">{selectedStudent.name} • {selectedStudent.class} • Section {selectedStudent.section}</p>
                                        <Input className="mt-3" type="file" accept="image/*" onChange={(event) => handlePhotoUpload(selectedStudent.id, event.target.files?.[0])} />
                                    </div>
                                ) : null}
                            </section>

                            <section className="min-h-[760px]">
                                <IdCardCustomizer template={template} onChange={setTemplate} onReset={() => setTemplate(defaultTemplate)} />
                            </section>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="absolute -left-[99999px] top-0">
                    <div ref={singleFrontPrintRef}>
                        {selectedStudent ? <PrintGridPages template={template} students={[selectedStudent]} side="front" cardSize={printCardSize} /> : null}
                    </div>
                    <div ref={singleBackPrintRef}>
                        {selectedStudent ? <PrintGridPages template={template} students={[selectedStudent]} side="back" cardSize={printCardSize} /> : null}
                    </div>
                    <div ref={bulkFrontPrintRef}>
                        {printStudents.length ? <PrintGridPages template={template} students={printStudents} side="front" cardSize={printCardSize} /> : null}
                    </div>
                    <div ref={bulkBackPrintRef}>
                        {printStudents.length ? <PrintGridPages template={template} students={printStudents} side="back" cardSize={printCardSize} /> : null}
                    </div>
                </div>
            </div>
        </div>
    );
};
