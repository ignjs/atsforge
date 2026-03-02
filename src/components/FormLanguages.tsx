
import { useForm, useFieldArray } from 'react-hook-form';
import { useResumeStore } from '../stores/resumeStore';
import type { AtsResume } from '../types/index.ts';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FormLanguages() {

    const { resume, updateSection } = useResumeStore();
    const { control, register, handleSubmit, watch } = useForm<{ languages: AtsResume['languages'] }>({
        defaultValues: { languages: resume.languages || [] },
        mode: 'onChange',
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'languages',
    });
    const [saved, setSaved] = useState(false);

    // Guardado automático en cada cambio
    const watchedLanguages = watch('languages');
    // Solo actualiza si cambia realmente
    useEffect(() => {
        updateSection('languages', watchedLanguages);
    }, [watchedLanguages, updateSection]);

    const onSubmit = (data: { languages: AtsResume['languages'] }) => {
        updateSection('languages', data.languages);
        setSaved(true);
        setTimeout(() => setSaved(false), 1200);
    };

    // Progress: at least one language with name and fluency
    const validLang = (watchedLanguages || []).filter(l => l.name && l.fluency);
    const progress = validLang.length > 0 ? 100 : 0;

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
                            <span className="font-semibold">Idioma *</span>
                            <input className="border border-gray-700 bg-white px-3 py-2 rounded text-base" placeholder="Ej: Inglés" {...register(`languages.${idx}.name`, { required: true })} />
                        </label>
                        <label className="flex flex-col gap-1 text-sm">
                            <span className="font-semibold">Fluidez *</span>
                            <select className="border border-gray-700 bg-white px-3 py-2 rounded text-base" {...register(`languages.${idx}.fluency`, { required: true })}>
                                <option value="">Selecciona</option>
                                <option value="Native">Native</option>
                                <option value="Fluent">Fluent</option>
                                <option value="Intermediate">Intermediate</option>
                            </select>
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
                <button type="button" onClick={() => append({ name: '', fluency: '' })} className="flex items-center gap-1 text-sm text-black border border-gray-700 px-3 py-2 rounded bg-white"><Plus size={16} />Añadir idioma</button>
                <button type="submit" className="bg-black text-white px-6 py-2 rounded text-sm font-semibold disabled:opacity-60" disabled={progress !== 100}>Guardar</button>
                {saved && <span className="text-xs text-green-700">¡Guardado!</span>}
            </div>
        </form>
    );
}
