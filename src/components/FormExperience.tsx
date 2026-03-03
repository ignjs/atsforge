
import { useForm, useFieldArray } from 'react-hook-form';
import { useResumeStore } from '../stores/resumeStore';
import type { AtsResume } from '../types/index.ts';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function FormExperience() {
    const { resume, updateSection } = useResumeStore();
    const { control, register, handleSubmit, watch, formState: { isDirty, errors } } = useForm<{ experience: AtsResume['experience'] }>({
        defaultValues: { experience: resume.experience },
        mode: 'onBlur',
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'experience',
    });
    const [saved, setSaved] = useState(false);

    const onSubmit = (data: { experience: AtsResume['experience'] }) => {
        updateSection('experience', data.experience);
        setSaved(true);
        setTimeout(() => setSaved(false), 1200);
    };

    // Progress: at least one experience with position, company, startDate
    const validExp = resume.experience.filter(e => e.position && e.company && e.startDate);
    const progress = validExp.length > 0 ? 100 : 0;

    // refs y estado para focus reactivo
    const [dateErrorIdx, setDateErrorIdx] = useState<number | null>(null);

    // Memorizar fechas para dependencias
    const today = useRef(new Date());
    today.current.setHours(0,0,0,0);
    const minStart = useRef(new Date(today.current));
    minStart.current.setFullYear(today.current.getFullYear() - 10);

    // Validación robusta para string | undefined
    const validateDates = (value: string | undefined, idx: number, field: 'start' | 'end') => {
        const start = watch(`experience.${idx}.startDate`) as string | undefined;
        const end = watch(`experience.${idx}.endDate`) as string | undefined;
        if (field === 'start') {
            if (!value) return 'Fecha inicio requerida';
            if (new Date(value) > today.current) return 'Fecha inicio no puede ser futura';
            if (new Date(value) < minStart.current) return 'Máximo 10 años atrás';
            if (end && value > end) return 'Inicio > Fin';
        }
        if (field === 'end') {
            if (value && new Date(value) > today.current) return 'Fecha fin no puede ser futura';
            if (start && value && value < start) return 'Fin < Inicio';
        }
        return true;
    };

    useEffect(() => {
        if (dateErrorIdx !== null) {
            const input = document.querySelector<HTMLInputElement>(`input[type="date"][data-idx='${dateErrorIdx}']`);
            if (input) input.focus();
        }
    }, [dateErrorIdx]);

    useEffect(() => {
        const idx = fields.findIndex((_, i) => {
            const start = watch(`experience.${i}.startDate`) as string | undefined;
            const end = watch(`experience.${i}.endDate`) as string | undefined;
            if (start && end && end < start) return true;
            if (start && new Date(start) > today.current) return true;
            if (start && new Date(start) < minStart.current) return true;
            if (end && new Date(end) > today.current) return true;
            return false;
        });
        setDateErrorIdx(idx !== -1 ? idx : null);
    }, [fields, watch, today, minStart]);

    const hasDateError = dateErrorIdx !== null;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-4">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-700">Progreso sección</span>
                <div className="flex-1 h-2 bg-gray-100 rounded">
                    <div className="h-2 bg-black rounded transition-all" style={{ width: `${progress}%` }} />
                </div>
                {progress === 100 && <CheckCircle size={18} className="text-black ml-2" />}
            </div>
            <div className="flex flex-col gap-4">
                {fields.map((field, idx) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 pb-4 relative group">
                        <label className="flex flex-col gap-1 text-sm">
                            <span className="font-semibold">Cargo *</span>
                            <input className="border border-gray-700 bg-white px-3 py-2 rounded text-base" placeholder="Ej: Desarrollador Frontend" {...register(`experience.${idx}.position`, { required: true })} />
                        </label>
                        <label className="flex flex-col gap-1 text-sm">
                            <span className="font-semibold">Empresa *</span>
                            <input className="border border-gray-700 bg-white px-3 py-2 rounded text-base" placeholder="Ej: Acme Corp" {...register(`experience.${idx}.company`, { required: true })} />
                        </label>
                        <label className="flex flex-col gap-1 text-sm">
                            <span className="font-semibold">Ciudad</span>
                            <input className="border border-gray-700 bg-white px-3 py-2 rounded text-base" placeholder="Ej: Madrid" {...register(`experience.${idx}.location`)} />
                        </label>
                        <div className="flex gap-2">
                            <label className="flex flex-col gap-1 text-sm w-1/2">
                                <span className="font-semibold">Inicio *</span>
                                <input
                                    type="date"
                                    className="border px-3 py-2 rounded text-base border-gray-700 bg-white"
                                    {...register(`experience.${idx}.startDate`, {
                                        validate: value => validateDates(value, idx, 'start')
                                    })}
                                />
                                {errors?.experience?.[idx]?.startDate && (
                                    <span className="text-xs text-red-600 mt-1">{errors.experience[idx].startDate.message}</span>
                                )}
                            </label>
                            <label className="flex flex-col gap-1 text-sm w-1/2">
                                <span className="font-semibold">Fin</span>
                                <input
                                    type="date"
                                    className="border px-3 py-2 rounded text-base border-gray-700 bg-white"
                                    {...register(`experience.${idx}.endDate`, {
                                        validate: value => validateDates(value, idx, 'end')
                                    })}
                                    data-idx={idx}
                                />
                                {errors?.experience?.[idx]?.endDate && (
                                    <span className="text-xs text-red-600 mt-1">{errors.experience[idx].endDate.message}</span>
                                )}
                            </label>
                        </div>
                        <label className="flex flex-col gap-1 text-sm md:col-span-2">
                            <span className="font-semibold">Descripción breve</span>
                            <textarea className="border border-gray-700 bg-white px-3 py-2 rounded text-base min-h-[40px]" placeholder="Responsabilidades, logros, tecnologías..." {...register(`experience.${idx}.summary`)} />
                        </label>
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <span className="text-xs font-semibold">Highlights (3-5 bullets) *</span>
                            {[0, 1, 2, 3, 4].map(i => (
                                <input key={i} className="border border-gray-700 bg-white px-3 py-2 rounded text-base mb-1" placeholder={`- Bullet ${i + 1}`} {...register(`experience.${idx}.highlights.${i}`)} />
                            ))}
                            <span className="text-xs text-gray-600 mt-1">Ejemplo: Lideré migración a React, reduciendo bugs en 30%.</span>
                        </div>
                        <div className="md:col-span-2 flex justify-end mt-2">
                            <button type="button" onClick={() => remove(idx)} className="bg-gray-700 text-white hover:text-white flex items-center gap-1 px-2 py-1">
                                <Trash2 size={18} /> Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-3 mt-2">
                <button type="button" onClick={() => append({ position: '', company: '', startDate: '', highlights: [] })} className="flex items-center gap-1 text-sm text-black border border-gray-700 px-3 py-2 rounded bg-white"><Plus size={16} />Añadir experiencia</button>
                <button type="submit" className="bg-black text-white px-6 py-2 rounded text-sm font-semibold disabled:opacity-60" disabled={!isDirty && progress !== 100 || hasDateError}>Guardar</button>
                {saved && <span className="text-xs text-green-700">¡Guardado!</span>}
            </div>
        </form>
    );
}
