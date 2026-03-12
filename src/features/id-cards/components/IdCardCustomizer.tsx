import React, { useState } from 'react';
import type { IdCardTemplate, IdCardVisibleFields } from '../types/id-card.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IdCardCustomizerProps {
    template: IdCardTemplate;
    onChange: (updated: IdCardTemplate) => void;
    onReset: () => void;
}

const fonts = [
    { label: 'Outfit', value: 'Outfit, ui-sans-serif, system-ui, sans-serif' },
    { label: 'Poppins', value: 'Poppins, ui-sans-serif, system-ui, sans-serif' },
    { label: 'Manrope', value: 'Manrope, ui-sans-serif, system-ui, sans-serif' },
    { label: 'Merriweather', value: 'Merriweather, serif' },
];

const colorPalettes = [
    {
        name: 'Campus Teal',
        primaryColor: '#0f766e',
        accentColor: '#14b8a6',
        secondaryColor: '#e6fffb',
        surfaceColor: '#ffffff',
        backAccentColor: '#f0fdfa',
        textColor: '#0f172a',
        labelColor: '#0f766e',
    },
    {
        name: 'Royal Blue',
        primaryColor: '#1d4ed8',
        accentColor: '#3b82f6',
        secondaryColor: '#e8f1ff',
        surfaceColor: '#ffffff',
        backAccentColor: '#eff6ff',
        textColor: '#0f172a',
        labelColor: '#1d4ed8',
    },
    {
        name: 'Emerald Mint',
        primaryColor: '#047857',
        accentColor: '#10b981',
        secondaryColor: '#ecfdf5',
        surfaceColor: '#ffffff',
        backAccentColor: '#f0fdf4',
        textColor: '#111827',
        labelColor: '#047857',
    },
    {
        name: 'Sunset Coral',
        primaryColor: '#c2410c',
        accentColor: '#f97316',
        secondaryColor: '#fff2e8',
        surfaceColor: '#ffffff',
        backAccentColor: '#fff7ed',
        textColor: '#1f2937',
        labelColor: '#c2410c',
    },
    {
        name: 'Berry Plum',
        primaryColor: '#9d174d',
        accentColor: '#db2777',
        secondaryColor: '#fdf2f8',
        surfaceColor: '#ffffff',
        backAccentColor: '#fce7f3',
        textColor: '#1f172a',
        labelColor: '#9d174d',
    },
    {
        name: 'Midnight Gold',
        primaryColor: '#1e293b',
        accentColor: '#d4a017',
        secondaryColor: '#f8fafc',
        surfaceColor: '#ffffff',
        backAccentColor: '#f8fafc',
        textColor: '#0f172a',
        labelColor: '#334155',
    },
    {
        name: 'Lavender Sky',
        primaryColor: '#6d28d9',
        accentColor: '#8b5cf6',
        secondaryColor: '#f5f3ff',
        surfaceColor: '#ffffff',
        backAccentColor: '#ede9fe',
        textColor: '#1f2937',
        labelColor: '#6d28d9',
    },
    {
        name: 'Slate Rose',
        primaryColor: '#334155',
        accentColor: '#e11d48',
        secondaryColor: '#fff1f2',
        surfaceColor: '#ffffff',
        backAccentColor: '#f8fafc',
        textColor: '#111827',
        labelColor: '#475569',
    },
];

const fieldLabels: Record<keyof IdCardVisibleFields, string> = {
    fatherName: 'Guardian',
    class: 'Class',
    section: 'Section',
    rollNo: 'Roll No',
    session: 'Session',
    dob: 'Date of Birth',
    phoneNumber: 'Phone',
    address: 'Address',
    validity: 'Validity',
    admissionNo: 'Admission No',
    emergencyContact: 'Emergency Contact',
};

const uploadLimits = {
    logo: 1024 * 1024,
    principalSignature: 1024 * 1024,
    frontBackgroundImage: 2 * 1024 * 1024,
    backBackgroundImage: 2 * 1024 * 1024,
};

export const IdCardCustomizer: React.FC<IdCardCustomizerProps> = ({ template, onChange, onReset }) => {
    const [uploadError, setUploadError] = useState('');

    const handleFieldChange = (name: keyof IdCardTemplate, value: string | boolean | IdCardVisibleFields) => {
        onChange({ ...template, [name]: value });
    };

    const handleVisibleFieldChange = (name: keyof IdCardVisibleFields, checked: boolean) => {
        onChange({
            ...template,
            visibleFields: {
                ...template.visibleFields,
                [name]: checked,
            },
        });
    };

    const handleFileUpload = (field: 'logo' | 'principalSignature' | 'frontBackgroundImage' | 'backBackgroundImage', file?: File | null) => {
        if (!file) return;

        const maxSize = uploadLimits[field];
        if (file.size > maxSize) {
            setUploadError(
                field === 'logo' || field === 'principalSignature'
                    ? 'Logo image must be 1MB or smaller.'
                    : 'Background image must be 2MB or smaller.'
            );
            return;
        }

        setUploadError('');
        const reader = new FileReader();
        reader.onloadend = () => {
            onChange({ ...template, [field]: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-card text-card-foreground shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="border-b border-border px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Student ID Design</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground">Card Controls</h2>
                <p className="mt-1 text-sm text-muted-foreground">Choose ratio, upload artwork, and tune visible fields.</p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
                <Tabs defaultValue="branding" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-muted">
                        <TabsTrigger value="branding">Branding</TabsTrigger>
                        <TabsTrigger value="appearance">Appearance</TabsTrigger>
                        <TabsTrigger value="fields">Fields</TabsTrigger>
                        <TabsTrigger value="back">Back View</TabsTrigger>
                    </TabsList>

                    <TabsContent value="branding" className="space-y-5">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Card Ratio</Label>
                                <Select value={template.cardSize} onValueChange={(value) => handleFieldChange('cardSize', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cr80">CR80 3.375 x 2.125 in</SelectItem>
                                        <SelectItem value="a7">A7 2.9 x 4.1 in</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="template-name">Template Name</Label>
                                <Input
                                    id="template-name"
                                    value={template.name}
                                    onChange={(event) => handleFieldChange('name', event.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="school-name">School Name</Label>
                                <Input
                                    id="school-name"
                                    value={template.schoolName}
                                    onChange={(event) => handleFieldChange('schoolName', event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="school-tagline">Tagline</Label>
                                <Input
                                    id="school-tagline"
                                    value={template.schoolTagline}
                                    onChange={(event) => handleFieldChange('schoolTagline', event.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="school-address">School Address</Label>
                            <textarea
                                id="school-address"
                                className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={template.schoolAddress}
                                onChange={(event) => handleFieldChange('schoolAddress', event.target.value)}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="front-title">Front Label</Label>
                                <Input
                                    id="front-title"
                                    value={template.frontTitle}
                                    onChange={(event) => handleFieldChange('frontTitle', event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="authority-label">Authority Name</Label>
                                <Input
                                    id="authority-label"
                                    value={template.authorityLabel}
                                    onChange={(event) => handleFieldChange('authorityLabel', event.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label>School Logo Upload</Label>
                                <Input type="file" accept="image/*" onChange={(event) => handleFileUpload('logo', event.target.files?.[0])} />
                                <p className="text-xs text-muted-foreground">Maximum 1MB</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Principal Signature</Label>
                                <Input type="file" accept="image/*" onChange={(event) => handleFileUpload('principalSignature', event.target.files?.[0])} />
                                <p className="text-xs text-muted-foreground">Maximum 1MB</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Front Background Upload</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => handleFileUpload('frontBackgroundImage', event.target.files?.[0])}
                                />
                                <p className="text-xs text-muted-foreground">Maximum 2MB</p>
                            </div>
                        </div>

                        {uploadError ? <p className="text-sm font-medium text-red-600">{uploadError}</p> : null}
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-5">
                        <div className="space-y-3">
                            <Label>Color Palette</Label>
                            <div className="grid gap-3 md:grid-cols-2">
                                {colorPalettes.map((palette) => (
                                    <button
                                        key={palette.name}
                                        type="button"
                                        onClick={() =>
                                            onChange({
                                                ...template,
                                                primaryColor: palette.primaryColor,
                                                accentColor: palette.accentColor,
                                                secondaryColor: palette.secondaryColor,
                                                surfaceColor: palette.surfaceColor,
                                                backAccentColor: palette.backAccentColor,
                                                textColor: palette.textColor,
                                                labelColor: palette.labelColor,
                                            })
                                        }
                                        className="rounded-xl border border-border bg-background p-3 text-left transition hover:border-purple-400 hover:shadow-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            {[
                                                palette.primaryColor,
                                                palette.accentColor,
                                                palette.secondaryColor,
                                                palette.backAccentColor,
                                            ].map((color) => (
                                                <span
                                                    key={color}
                                                    className="h-6 w-6 rounded-full border border-slate-200"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                        <p className="mt-3 font-semibold text-foreground">{palette.name}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">Apply a complete modern card theme.</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Photo Shape</Label>
                                <Select value={template.photoShape} onValueChange={(value) => handleFieldChange('photoShape', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="circle">Circle</SelectItem>
                                        <SelectItem value="square">Rounded Square</SelectItem>
                                        <SelectItem value="hexagon">Hexagon</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Border Style</Label>
                                <Select value={template.cardBorder} onValueChange={(value) => handleFieldChange('cardBorder', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="solid">Solid</SelectItem>
                                        <SelectItem value="dashed">Dashed</SelectItem>
                                        <SelectItem value="rounded">Rounded</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Font Family</Label>
                                <Select value={template.fontFamily} onValueChange={(value) => handleFieldChange('fontFamily', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fonts.map((font) => (
                                            <SelectItem key={font.value} value={font.value}>
                                                {font.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="validity-text">Validity Text</Label>
                                <Input
                                    id="validity-text"
                                    value={template.validityText}
                                    onChange={(event) => handleFieldChange('validityText', event.target.value)}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="fields" className="space-y-5">
                        <div className="grid gap-3 md:grid-cols-2">
                            {(Object.keys(template.visibleFields) as Array<keyof IdCardVisibleFields>).map((field) => (
                                <div key={field} className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
                                    <div>
                                        <p className="font-semibold text-foreground">{fieldLabels[field]}</p>
                                        <p className="text-sm text-muted-foreground">Show or hide this field</p>
                                    </div>
                                    <Switch
                                        checked={template.visibleFields[field]}
                                        onCheckedChange={(checked) => handleVisibleFieldChange(field, checked)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="extra-field-label">Extra Field Label</Label>
                                <Input
                                    id="extra-field-label"
                                    value={template.extraFieldLabel}
                                    onChange={(event) => handleFieldChange('extraFieldLabel', event.target.value)}
                                    placeholder="Transport"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="extra-field-value">Extra Field Value</Label>
                                <Input
                                    id="extra-field-value"
                                    value={template.extraFieldValue}
                                    onChange={(event) => handleFieldChange('extraFieldValue', event.target.value)}
                                    placeholder="Route 04"
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="back" className="space-y-5">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Back Background Upload</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => handleFileUpload('backBackgroundImage', event.target.files?.[0])}
                                />
                                <p className="text-xs text-muted-foreground">Maximum 2MB</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Back Accent Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        className="h-10 w-14 p-1"
                                        value={template.backAccentColor}
                                        onChange={(event) => handleFieldChange('backAccentColor', event.target.value)}
                                    />
                                    <Input
                                        value={template.backAccentColor}
                                        onChange={(event) => handleFieldChange('backAccentColor', event.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="back-title">Back Title</Label>
                                <Input
                                    id="back-title"
                                    value={template.backTitle}
                                    onChange={(event) => handleFieldChange('backTitle', event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="support-phone">Support Phone</Label>
                                <Input
                                    id="support-phone"
                                    value={template.supportPhone}
                                    onChange={(event) => handleFieldChange('supportPhone', event.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                value={template.website}
                                onChange={(event) => handleFieldChange('website', event.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                            <div>
                                <p className="font-semibold text-slate-900">Guidelines Block</p>
                                <p className="text-sm text-muted-foreground">Show instructions on the back of the card.</p>
                            </div>
                            <Switch
                                checked={template.showGuidelines}
                                onCheckedChange={(checked) => handleFieldChange('showGuidelines', checked)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="guidelines-text">Back Instructions</Label>
                            <textarea
                                id="guidelines-text"
                                className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={template.guidelinesText}
                                onChange={(event) => handleFieldChange('guidelinesText', event.target.value)}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
                <div className="text-xs text-muted-foreground">Logo limit 1MB. Background limits 2MB each.</div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onReset}>
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
};
