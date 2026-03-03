export interface AtsResume {
  basics: {
    name: string;              // Nombre completo
    label: string;             // Cargo al que postula
    email: string;             // Email profesional
    phone?: string;            // Teléfono
    linkedin?: string;         // URL LinkedIn
    location: string;          // Ciudad, País
    summary: string;           // Resumen profesional (3-5 líneas)
  };
  skills: Array<{
    category: string;          // ej: "Technical Skills", "Soft Skills"
    keywords: string[];        // Lista plana de skills (keywords del JD)
    level?: string;            // Opcional: "Advanced", "Intermediate"
  }>;
  experience: Array<{
    position: string;          // Cargo (primero en ATS)
    company: string;           // Empresa
    location?: string;         // Ciudad
    startDate: string;         // YYYY-MM (ej: "2023-01")
    endDate?: string;          // YYYY-MM o vacío => actual
    summary?: string;          // Descripción breve
    highlights: string[];      // 3-5 bullets con verbos de acción + métricas
  }>;
  education: Array<{
    degree: string;            // ej: "Licenciatura en Ingeniería"
    institution: string;       // Universidad
    location?: string;
    startDate: string;         // YYYY-MM
    endDate?: string;
    gpa?: string;              // Opcional si relevante
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;              // YYYY-MM
    url?: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];    // Keywords técnicos
    url?: string;
    startDate?: string;
    endDate?: string;
  }>;
  languages?: Array<{
    name: string;
    fluency: string;           // "Native", "Fluent", "Intermediate"
  }>;
}
