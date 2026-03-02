
import { useForm, useFieldArray } from 'react-hook-form';
import { useResumeStore } from '../stores/resumeStore';
import type { AtsResume } from '../types/index.ts';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function FormCertifications() {
    const { resume, updateSection } = useResumeStore();
    const { control, register, handleSubmit, formState: { isDirty, errors } } = useForm<{ certifications: AtsResume['certifications'] }>({
        defaultValues: { certifications: resume.certifications || [] },
        mode: 'onBlur',
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'certifications',
    });
    const [saved, setSaved] = useState(false);

    const onSubmit = (data: { certifications: AtsResume['certifications'] }) => {
        updateSection('certifications', data.certifications);
        setSaved(true);
        setTimeout(() => setSaved(false), 1200);
    };

    // Progress: at least one certification with name, issuer, date
    const validCert = (resume.certifications || []).filter(c => c.name && c.issuer && c.date);
    const progress = validCert.length > 0 ? 100 : 0;

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
                            <span className="font-semibold">Certificación *</span>
                            <input className="border border-gray-700 bg-white px-3 py-2 rounded text-base" placeholder="Ej: PMP" {...register(`certifications.${idx}.name`, { required: true })} />
                        </label>
                        <label className="flex flex-col gap-1 text-sm">
                            <span className="font-semibold">Entidad *</span>
                            <input className="border border-gray-700 bg-white px-3 py-2 rounded text-base" placeholder="Ej: PMI" {...register(`certifications.${idx}.issuer`, { required: true })} />
                        </label>
                        <label className="flex flex-col gap-1 text-sm">
                            <span className="font-semibold">Fecha *</span>
                              <input type="date" className="border border-gray-700 bg-white px-3 py-2 rounded text-base" {...register(`certifications.${idx}.date`, { required: true })} />
                        </label>
                        <label className="flex flex-col gap-1 text-sm">
                            <span className="font-semibold">URL</span>
                            <input
                                className="border border-gray-700 bg-white px-3 py-2 rounded text-base"
                                type="url"
                                {...register(`certifications.${idx}.url`, {
                                    pattern: {
                                        value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/i,
                                        message: 'URL inválida',
                                    },
                                })}
                                placeholder="https://..."
                            />
                            {errors?.certifications?.[idx]?.url && (
                                <span className="text-xs text-red-600">{errors.certifications[idx]?.url?.message as string}</span>
                            )}
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
                <button type="button" onClick={() => append({ name: '', issuer: '', date: '' })} className="flex items-center gap-1 text-sm text-black border border-gray-700 px-3 py-2 rounded bg-white"><Plus size={16} />Añadir certificación</button>
                <button type="submit" className="bg-black text-white px-6 py-2 rounded text-sm font-semibold disabled:opacity-60" disabled={!isDirty && progress !== 100}>Guardar</button>
                {saved && <span className="text-xs text-green-700">¡Guardado!</span>}
            </div>
        </form>
    );
}
