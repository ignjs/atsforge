
import { useForm } from 'react-hook-form';
import { useResumeStore } from '../stores/resumeStore';
import type { AtsResume } from '../types/index.ts';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function FormBasics() {
  const { resume, updateSection } = useResumeStore();
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<AtsResume['basics']>({
    defaultValues: resume.basics,
    mode: 'onBlur',
  });
  const [saved, setSaved] = useState(false);

  const onSubmit = (data: AtsResume['basics']) => {
    updateSection('basics', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  // Progress: count filled required fields
  const requiredFields = ['name', 'email', 'location', 'summary'];
  const filled = requiredFields.filter(f => resume.basics[f as keyof AtsResume['basics']]);
  const progress = Math.round((filled.length / requiredFields.length) * 100);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-700">Progreso sección</span>
        <div className="flex-1 h-2 bg-gray-100 rounded">
          <div className="h-2 bg-black rounded transition-all" style={{ width: `${progress}%` }} />
        </div>
        {progress === 100 && <CheckCircle size={18} className="text-black ml-2" />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold">Nombre completo *</span>
          <input className="border border-gray-700 bg-white px-3 py-2 rounded text-base" {...register('name', { required: true })} placeholder="Ej: Juan Pérez" />
          {errors.name && <span className="text-xs text-gray-700">Requerido</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold">Email profesional *</span>
          <input
            className="border border-gray-700 bg-white px-3 py-2 rounded text-base"
            type="email"
            {...register('email', {
              required: 'Requerido',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email inválido',
              },
            })}
            placeholder="Ej: juan@email.com"
          />
          {errors.email && <span className="text-xs text-red-600">{errors.email.message as string}</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold">Teléfono</span>
          <input className="border border-gray-700 bg-white px-3 py-2 rounded text-base" {...register('phone')} placeholder="Ej: +34 600 000 000" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold">LinkedIn</span>
          <input
            className="border border-gray-700 bg-white px-3 py-2 rounded text-base"
            type="url"
            {...register('linkedin', {
              pattern: {
                value: /^(https?:\/\/)?([\w]+\.)?linkedin\.com\/.*$/i,
                message: 'URL de LinkedIn inválida',
              },
            })}
            placeholder="linkedin.com/in/usuario"
          />
          {errors.linkedin && <span className="text-xs text-red-600">{errors.linkedin.message as string}</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm md:col-span-2">
          <span className="font-semibold">Ubicación *</span>
          <input className="border border-gray-700 bg-white px-3 py-2 rounded text-base" {...register('location', { required: true })} placeholder="Ciudad, País" />
          {errors.location && <span className="text-xs text-gray-700">Requerido</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm md:col-span-2">
          <span className="font-semibold">Resumen profesional *</span>
          <textarea className="border border-gray-700 bg-white px-3 py-2 rounded text-base min-h-[60px]" {...register('summary', { required: true })} placeholder="3-5 líneas sobre tu perfil, logros y valor." />
          {errors.summary && <span className="text-xs text-gray-700">Requerido</span>}
          <span className="text-xs text-gray-600 mt-1">Ejemplo: Ingeniero con 5+ años de experiencia en desarrollo web, especializado en React y TypeScript. Orientado a resultados y mejora continua.</span>
        </label>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <button type="submit" className="bg-black text-white px-6 py-2 rounded text-sm font-semibold disabled:opacity-60" disabled={!isDirty && progress !== 100}>Guardar</button>
        {saved && <span className="text-xs text-green-700">¡Guardado!</span>}
      </div>
    </form>
  );
}
