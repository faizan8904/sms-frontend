import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { CardBorderStyle, CardSize, IdCardTemplate, StudentData } from '../types/id-card.types';

interface IdCardCanvasProps {
    template: IdCardTemplate;
    student: StudentData;
    side: 'front' | 'back';
    className?: string;
    compact?: boolean;
}

const sizeConfig: Record<CardSize, { width: number; height: number }> = {
    cr80: { width: 540, height: 340 },
    a7: { width: 410, height: 580 },
};

const defaultLogo =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
            <rect width="160" height="160" rx="28" fill="#0f766e"/>
            <circle cx="80" cy="58" r="22" fill="white"/>
            <path d="M44 118h72L80 80Z" fill="white"/>
        </svg>
    `);

const createInitials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');

const createInitialBadge = (name: string, primaryColor: string) =>
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 260">
            <rect width="220" height="260" rx="22" fill="#ffffff"/>
            <rect x="10" y="10" width="200" height="240" rx="18" fill="${primaryColor}" opacity="0.1"/>
            <circle cx="110" cy="96" r="62" fill="${primaryColor}" opacity="0.18"/>
            <text x="110" y="116" text-anchor="middle" font-size="48" font-family="Arial, sans-serif" font-weight="700" fill="${primaryColor}">
                ${createInitials(name)}
            </text>
        </svg>
    `);

const getPhotoShapeClass = (shape: IdCardTemplate['photoShape']) => {
    if (shape === 'circle') return 'rounded-full';
    if (shape === 'hexagon') return '[clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0_50%)]';
    return 'rounded-xl';
};

const getBorderClass = (border: CardBorderStyle) => {
    if (border === 'none') return '';
    if (border === 'dashed') return 'border-2 border-dashed';
    if (border === 'rounded') return 'border';
    return 'border-2';
};

const InfoBlock = ({ label, value, color, center = false }: { label: string; value: string; color: string; center?: boolean }) => (
    <div className={`rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 ${center ? 'text-center' : ''}`}>
        <p className="text-[9px] uppercase tracking-[0.14em]" style={{ color }}>
            {label}
        </p>
        <p className="text-[12px] font-semibold leading-tight text-slate-900">{value}</p>
    </div>
);

const SignatureBlock = ({ template, compact = false }: { template: IdCardTemplate; compact?: boolean }) => (
    <div className="text-center">
        {template.principalSignature ? (
            <img
                src={template.principalSignature}
                alt="Principal signature"
                className={`mx-auto object-contain ${compact ? 'h-8 max-w-[100px]' : 'h-10 max-w-[120px]'}`}
            />
        ) : (
            <div className={`mx-auto border-b border-slate-400 ${compact ? 'h-8 w-24' : 'h-10 w-28'}`} />
        )}
        <p className="mt-1 text-sm font-semibold text-slate-900">Principal</p>
    </div>
);

export const IdCardCanvas = React.forwardRef<HTMLDivElement, IdCardCanvasProps>(({ template, student, side, className, compact = false }, ref) => {
    const size = sizeConfig[template.cardSize];
    const scale = compact ? (template.cardSize === 'a7' ? 0.44 : 0.6) : 1;
    const width = Math.round(size.width * scale);
    const height = Math.round(size.height * scale);
    const isPortrait = template.cardSize === 'a7';
    const photoSrc = student.photo || createInitialBadge(student.name, template.primaryColor);
    const backgroundImage = side === 'front' ? template.frontBackgroundImage : template.backBackgroundImage;

    return (
        <div
            ref={ref}
            className={className}
            style={{
                width,
                height,
                minWidth: width,
            }}
        >
            <div
                className={[
                    'relative overflow-hidden',
                    template.cardBorder === 'rounded' ? 'rounded-2xl' : 'rounded-lg',
                    getBorderClass(template.cardBorder),
                ].join(' ')}
                style={{
                    width: size.width,
                    height: size.height,
                    minWidth: size.width,
                    fontFamily: template.fontFamily,
                    borderColor: template.primaryColor,
                    color: template.textColor,
                    backgroundColor: '#ffffff',
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                }}
            >
                {backgroundImage ? (
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                ) : null}

                {side === 'front' ? (
                    <div className="relative flex h-full flex-col bg-white">
                    <div className="flex items-center gap-3 px-4 py-3 text-white" style={{ backgroundColor: template.primaryColor }}>
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white p-1">
                            <img src={template.logo || defaultLogo} alt="School logo" className="h-full w-full rounded-md object-cover" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="truncate text-base font-bold uppercase leading-tight text-white">{template.schoolName}</h3>
                            <p className="truncate text-[11px] text-white/90">{template.schoolTagline}</p>
                        </div>
                    </div>

                    {isPortrait ? (
                        <div className="flex flex-1 flex-col px-4 py-4">
                            <div className="grid grid-cols-2 items-start gap-3">
                                <div className="flex justify-center">
                                    <div
                                        className={`overflow-hidden border-2 border-slate-200 bg-slate-50 ${getPhotoShapeClass(template.photoShape)}`}
                                        style={{ width: 118, height: 138 }}
                                    >
                                        <img src={photoSrc} alt={student.name} className="h-full w-full object-cover" />
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="rounded-lg border border-slate-200 bg-white p-2">
                                        <QRCodeSVG value={student.id} size={100} bgColor="#ffffff" fgColor={template.primaryColor} level="M" includeMargin={false} />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <InfoBlock label="Name" value={student.name} color={template.labelColor} center />
                                <InfoBlock label="Session" value={student.session} color={template.labelColor} center />
                                <InfoBlock label="Class" value={student.class} color={template.labelColor} center />
                                <InfoBlock label="Section" value={student.section} color={template.labelColor} center />
                                <InfoBlock label="Roll No" value={student.rollNo} color={template.labelColor} center />
                                <InfoBlock label="Date of Birth" value={student.dob} color={template.labelColor} center />
                                <InfoBlock label="Father Name" value={student.fatherName} color={template.labelColor} center />
                                <InfoBlock label="Phone Number" value={student.phoneNumber} color={template.labelColor} center />
                                <div className="col-span-2">
                                    <InfoBlock label="Address" value={student.address} color={template.labelColor} center />
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="grid flex-1 grid-cols-[28%_72%] gap-3 px-3 py-3 pr-4">
                            <div className="flex flex-col">
                                <div className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center">
                                    <p className="text-[9px] uppercase tracking-[0.14em]" style={{ color: template.labelColor }}>
                                        Session
                                    </p>
                                    <p className="truncate text-[12px] font-semibold text-slate-900">{student.session}</p>
                                </div>

                                <div className="mt-2 flex justify-center">
                                    <div
                                        className={`overflow-hidden border-2 border-slate-200 bg-slate-50 ${getPhotoShapeClass(template.photoShape)}`}
                                        style={{ width: 88, height: 96 }}
                                    >
                                        <img src={photoSrc} alt={student.name} className="h-full w-full object-cover" />
                                    </div>
                                </div>

                                <div className="mt-2 flex justify-center">
                                    <div className="rounded-lg border border-slate-200 bg-white p-2">
                                        <QRCodeSVG value={student.id} size={70} bgColor="#ffffff" fgColor={template.primaryColor} level="M" includeMargin={false} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex min-w-0 flex-col">
                                <h2 className="truncate text-[1.1rem] font-bold uppercase leading-tight" style={{ color: template.primaryColor }}>
                                    {student.name}
                                </h2>

                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <InfoBlock label="Class" value={student.class} color={template.labelColor} />
                                    <InfoBlock label="Section" value={student.section} color={template.labelColor} />
                                    <InfoBlock label="Father Name" value={student.fatherName} color={template.labelColor} />
                                    <InfoBlock label="Roll No" value={student.rollNo} color={template.labelColor} />
                                    <InfoBlock label="Date of Birth" value={student.dob} color={template.labelColor} />
                                    <InfoBlock label="Phone Number" value={student.phoneNumber} color={template.labelColor} />
                                    <div className="col-span-2">
                                        <InfoBlock label="Address" value={student.address} color={template.labelColor} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
                ) : (
                    <div className="relative flex h-full flex-col bg-white">
                    <div className="flex items-center gap-3 px-4 py-3 text-white" style={{ backgroundColor: template.primaryColor }}>
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white p-1">
                            <img src={template.logo || defaultLogo} alt="School logo" className="h-full w-full rounded-md object-cover" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="truncate text-base font-bold uppercase leading-tight text-white">{template.schoolName}</h3>
                            <p className="truncate text-[11px] text-white/90">{template.schoolTagline}</p>
                        </div>
                    </div>

                    {isPortrait ? (
                        <div className="flex flex-1 flex-col px-4 py-4">
                            <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                                <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: template.labelColor }}>
                                    School Address
                                </p>
                                <p className="text-[13px] leading-5 text-slate-900">{template.schoolAddress}</p>
                                <p className="mt-2 text-[13px] font-semibold text-slate-900">{template.supportPhone}</p>
                            </div>

                            {template.showGuidelines ? (
                                <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-3">
                                    <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: template.labelColor }}>
                                        Instructions
                                    </p>
                                    <p className="mt-2 whitespace-pre-line text-[12px] leading-5 text-slate-900">{template.guidelinesText}</p>
                                </div>
                            ) : null}

                            <div className="mt-auto pb-2 pt-3">
                                <SignatureBlock template={template} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col gap-3 px-4 py-4">
                            <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                                <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: template.labelColor }}>
                                    School Address
                                </p>
                                <p className="text-[13px] leading-5 text-slate-900">{template.schoolAddress}</p>
                            </div>

                            {template.showGuidelines ? (
                                <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                                    <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: template.labelColor }}>
                                        Instructions
                                    </p>
                                    <p className="mt-2 whitespace-pre-line text-[12px] leading-5 text-slate-900">{template.guidelinesText}</p>
                                </div>
                            ) : null}

                            <div className="mt-auto flex justify-end pt-2">
                                <SignatureBlock template={template} compact />
                            </div>
                        </div>
                    )}
                    </div>
                )}
            </div>
        </div>
    );
});

IdCardCanvas.displayName = 'IdCardCanvas';
