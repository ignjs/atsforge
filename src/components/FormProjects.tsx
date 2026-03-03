
import { useForm, useFieldArray } from 'react-hook-form';
import { useResumeStore } from '../stores/resumeStore';
import type { AtsResume } from '../types/index.ts';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function FormProjects() {
    const { resume, updateSection } = useResumeStore();
    const { control, register, handleSubmit, watch, formState: { isDirty, errors } } = useForm<{ projects: AtsResume['projects'] }>({
        defaultValues: { projects: resume.projects || [] },
        mode: 'onBlur',
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'projects',
    });
    // refs y estado para focus reactivo
    const [dateErrorIdx, setDateErrorIdx] = useState<number | null>(null);

    // Memorizar fechas para dependencias
    const today = useRef(new Date());
    today.current.setHours(0,0,0,0);
    const minStart = useRef(new Date(today.current));
    minStart.current.setFullYear(today.current.getFullYear() - 10);

    // Validación robusta para string | undefined
    const validateDates = (value: string | undefined, idx: number, field: 'start' | 'end') => {
        const start = watch(`projects.${idx}.startDate`) as string | undefined;
        const end = watch(`projects.${idx}.endDate`) as string | undefined;
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
            const start = watch(`projects.${i}.startDate`) as string | undefined;
            const end = watch(`projects.${i}.endDate`) as string | undefined;
            if (start && end && end < start) return true;
            if (start && new Date(start) > today.current) return true;
            if (start && new Date(start) < minStart.current) return true;
            if (end && new Date(end) > today.current) return true;
            return false;
        });
        setDateErrorIdx(idx !== -1 ? idx : null);
    }, [fields, watch, today, minStart]);

    const hasDateError = dateErrorIdx !== null;
    const [saved, setSaved] = useState(false);

    const onSubmit = (data: { projects: AtsResume['projects'] }) => {
        // Convert technologies from string to array
        const projects = (data.projects ?? []).map(p => ({
            ...p,
            technologies: typeof p.technologies === 'string'
                ? (p.technologies as string).split(',').map(t => t.trim()).filter(Boolean)
                : Array.isArray(p.technologies)
                    ? p.technologies
                    : [],
        }));
        updateSection('projects', projects);
        setSaved(true);
        setTimeout(() => setSaved(false), 1200);
    };

    // Progress: at least one project with name, description, technologies
    const validProj = (resume.projects || []).filter(p => p.name && p.description && p.technologies && p.technologies.length > 0);
    const progress = validProj.length > 0 ? 100 : 0;

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
                            <span className="font-semibold">Proyecto *</span>
                            <input className="border border-gray-700 bg-white px-3 py-2 rounded text-base" placeholder="Ej: Web corporativa" {...register(`projects.${idx}.name`, { required: true })} />
                        </label>
                        <label className="flex flex-col gap-1 text-sm">
                            <span className="font-semibold">Tecnologías *</span>
                            <input className="border border-gray-700 bg-white px-3 py-2 rounded text-base" placeholder="Ej: React, Node.js" {...register(`projects.${idx}.technologies`, { required: true })} />
                            <span className="text-xs text-gray-600 mt-1">Separa las tecnologías con coma.</span>
                        </label>
                        <label className="flex flex-col gap-1 text-sm md:col-span-2">
                            <span className="font-semibold">Descripción *</span>
                            <textarea className="border border-gray-700 bg-white px-3 py-2 rounded text-base min-h-[40px]" placeholder="Breve descripción del proyecto" {...register(`projects.${idx}.description`, { required: true })} />
                        </label>
                        <div className="flex gap-2 md:col-span-2">
                            <label className="flex flex-col gap-1 text-sm w-1/2">
                                <span className="font-semibold">Inicio *</span>
                                <input
                                    type="date"
                                    className="border px-3 py-2 rounded text-base border-gray-700 bg-white"
                                    {...register(`projects.${idx}.startDate`, {
                                        validate: value => validateDates(value, idx, 'start')
                                    })}
                                />
                                {errors?.projects?.[idx]?.startDate && (
                                    <span className="text-xs text-red-600 mt-1">{errors.projects[idx].startDate.message}</span>
                                )}
                            </label>
                            <label className="flex flex-col gap-1 text-sm w-1/2">
                                <span className="font-semibold">Fin</span>
                                <input
                                    type="date"
                                    data-idx={idx}
                                    className="border px-3 py-2 rounded text-base border-gray-700 bg-white"
                                    {...register(`projects.${idx}.endDate`, {
                                        validate: value => validateDates(value, idx, 'end')
                                    })}
                                />
                                {errors?.projects?.[idx]?.endDate && (
                                    <span className="text-xs text-red-600 mt-1">{errors.projects[idx].endDate.message}</span>
                                )}
                            </label>
                            <label className="flex flex-col gap-1 text-sm w-full">
                                <span className="font-semibold">URL</span>
                                <input
                                    className="border border-gray-700 bg-white px-3 py-2 rounded text-base"
                                    type="url"
                                    {...register(`projects.${idx}.url`, {
                                        pattern: {
                                            value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/i,
                                            message: 'URL inválida',
                                        },
                                    })}
                                    placeholder="https://..."
                                />
                                {errors?.projects?.[idx]?.url && (
                                    <span className="text-xs text-red-600">{errors.projects[idx]?.url?.message as string}</span>
                                )}
                            </label>
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
                <button type="button" onClick={() => append({ name: '', description: '', technologies: [] })} className="flex items-center gap-1 text-sm text-black border border-gray-700 px-3 py-2 rounded bg-white"><Plus size={16} />Añadir proyecto</button>
                <button type="submit" className="bg-black text-white px-6 py-2 rounded text-sm font-semibold disabled:opacity-60" disabled={!isDirty && progress !== 100 || hasDateError}>Guardar</button>
                {saved && <span className="text-xs text-green-700">¡Guardado!</span>}
            </div>
        </form>
    );
}
