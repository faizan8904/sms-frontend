export type PhotoShape = 'circle' | 'square' | 'hexagon';
export type CardBorderStyle = 'none' | 'solid' | 'dashed' | 'rounded';
export type CardSize = 'cr80' | 'a7';

export interface IdCardVisibleFields {
    fatherName: boolean;
    class: boolean;
    section: boolean;
    rollNo: boolean;
    session: boolean;
    dob: boolean;
    phoneNumber: boolean;
    address: boolean;
    validity: boolean;
    admissionNo: boolean;
    emergencyContact: boolean;
}

export interface IdCardTemplate {
    id: string;
    schoolId: string;
    name: string;
    cardSize: CardSize;
    schoolName: string;
    schoolTagline: string;
    schoolAddress: string;
    authorityLabel: string;
    primaryColor: string;
    secondaryColor: string;
    surfaceColor: string;
    backAccentColor: string;
    logo?: string;
    principalSignature?: string;
    photoShape: PhotoShape;
    frontBackgroundImage?: string;
    backBackgroundImage?: string;
    fontFamily: string;
    cardBorder: CardBorderStyle;
    textColor: string;
    accentColor: string;
    labelColor: string;
    barcodeLabel: string;
    supportPhone: string;
    website: string;
    validityText: string;
    frontTitle: string;
    backTitle: string;
    showGuidelines: boolean;
    guidelinesText: string;
    visibleFields: IdCardVisibleFields;
    extraFieldLabel: string;
    extraFieldValue: string;
}

export interface StudentData {
    id: string;
    name: string;
    fatherName: string;
    rollNo: string;
    class: string;
    section: string;
    session: string;
    phoneNumber: string;
    dob: string;
    address: string;
    photo?: string;
    admissionNo: string;
    bloodGroup?: string;
    emergencyContact?: string;
    validUpto?: string;
    schoolName: string;
    schoolAddress: string;
}
