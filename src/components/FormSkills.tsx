
import { useForm, useFieldArray } from 'react-hook-form';
import { useResumeStore } from '../stores/resumeStore';
import type { AtsResume } from '../types/index.ts';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function FormSkills() {
    const { resume, updateSection } = useResumeStore();
    const { control, register, handleSubmit, formState: { isDirty } } = useForm<{ skills: AtsResume['skills'] }>({
        defaultValues: { skills: resume.skills },
        mode: 'onBlur',
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'skills',
    });
    const [saved, setSaved] = useState(false);

    const onSubmit = (data: { skills: AtsResume['skills'] }) => {
        // Convert keywords from string to array
        const skills = data.skills.map((s: { category: string; keywords: string | string[]; level?: string }) => ({
            ...s,
            keywords: typeof s.keywords === 'string' ? s.keywords.split(',').map(k => k.trim()).filter(Boolean) : s.keywords,
        }));
        updateSection('skills', skills);
        setSaved(true);
        setTimeout(() => setSaved(false), 1200);
    };

    // Progress: at least one skill with category and keywords
    const validSkills = resume.skills.filter(s => s.category && s.keywords && s.keywords.length > 0);
    const progress = validSkills.length > 0 ? 100 : 0;

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
                            <span className="font-semibold">Categoría *</span>
                            <input className="border border-gray-700 bg-white px-3 py-2 rounded text-base" placeholder="Ej: Technical Skills" {...register(`skills.${idx}.category`, { required: true })} />
                        </label>
                        <label className="flex flex-col gap-1 text-sm">
                            <span className="font-semibold">Nivel</span>
                            <select className="border border-gray-700 bg-white px-3 py-2 rounded text-base" {...register(`skills.${idx}.level`)}>
                                <option value="">Selecciona</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Intermediate">Intermediate</option>
                            </select>
                        </label>
                        <label className="flex flex-col gap-1 text-sm md:col-span-2">
                            <span className="font-semibold">Palabras clave *</span>
                            <input className="border border-gray-700 bg-white px-3 py-2 rounded text-base" placeholder="Ej: React, TypeScript, Node.js" {...register(`skills.${idx}.keywords`, { required: true })} />
                            <span className="text-xs text-gray-600 mt-1">Separa las skills con coma. Ejemplo: React, TypeScript, Node.js</span>
                        </label>
                        <div className="md:col-span-2 flex justify-end mt-2">
                            <button type="button" onClick={() => remove(idx)} className="bg-gray-700 text-white hover:text-white flex items-center gap-1 px-2 py-1">
                                <Trash2 size={18} /> Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-3 mt-2">
                <button type="button" onClick={() => append({ category: '', keywords: [], level: '' })} className="flex items-center gap-1 text-sm text-black border border-gray-700 px-3 py-2 rounded bg-white"><Plus size={16} />Añadir skill</button>
                <button type="submit" className="bg-black text-white px-6 py-2 rounded text-sm font-semibold disabled:opacity-60" disabled={!isDirty && progress !== 100}>Guardar</button>
                {saved && <span className="text-xs text-green-700">¡Guardado!</span>}
            </div>
        </form>
    );
}
