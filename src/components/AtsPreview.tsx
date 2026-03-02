import { useResumeStore } from '../stores/resumeStore';

function formatDate(date?: string) {
  if (!date) return '';
  const [y, m] = date.split('-');
  return m ? `${y}/${m}` : y;
}

export default function AtsPreview() {
  const { resume } = useResumeStore();
  const { basics, skills, experience, education, certifications, projects, languages } = resume;

  return (
    <div className="font-sans bg-white text-black p-8 w-full max-w-2xl mx-auto text-sm">
      <h1 className="text-2xl font-bold mb-1">{basics.name}</h1>
      <div className="mb-2 text-xs text-gray-700">
        {basics.email} {basics.phone && <>| {basics.phone}</>} {basics.linkedin && <>| {basics.linkedin}</>}<br />
        {basics.location}
      </div>
      <div className="mb-4 text-gray-900 whitespace-pre-line">{basics.summary}</div>

      {skills && skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base font-bold border-b border-gray-100 mb-1">Skills</h2>
          <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
            {skills.flatMap(s => s.keywords).map((kw, i) => (
              <li key={i} className="text-xs px-2 py-1 bg-gray-100 rounded-none border border-gray-100 text-black">{kw}</li>
            ))}
          </ul>
        </section>
      )}

      {experience && experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base font-bold border-b border-gray-100 mb-1">Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} className="mb-2">
              <div className="flex flex-wrap gap-2 font-semibold">
                <span>{exp.position}</span>
                <span className="font-normal">@ {exp.company}</span>
                {exp.location && <span className="text-xs">({exp.location})</span>}
                <span className="ml-auto text-xs">{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Actual'}</span>
              </div>
              {exp.summary && <div className="text-xs text-gray-900 mb-1">{exp.summary}</div>}
              <ul className="list-disc pl-5 text-xs">
                {exp.highlights?.filter(Boolean).map((h, j) => (
                  <li key={j} className="mb-0.5">- {h}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base font-bold border-b border-gray-100 mb-1">Education</h2>
          {education.map((ed, i) => (
            <div key={i} className="mb-2">
              <div className="flex flex-wrap gap-2 font-semibold">
                <span>{ed.degree}</span>
                <span className="font-normal">@ {ed.institution}</span>
                {ed.location && <span className="text-xs">({ed.location})</span>}
                <span className="ml-auto text-xs">{formatDate(ed.startDate)} - {ed.endDate ? formatDate(ed.endDate) : 'Actual'}</span>
              </div>
              {ed.gpa && <div className="text-xs text-gray-900">GPA: {ed.gpa}</div>}
            </div>
          ))}
        </section>
      )}

      {certifications && certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base font-bold border-b border-gray-100 mb-1">Certifications</h2>
          <ul className="list-disc pl-5 text-xs">
            {certifications.map((c, i) => (
              <li key={i} className="mb-0.5">{c.name} - {c.issuer} ({formatDate(c.date)}) {c.url && <span className="text-xs">[{c.url}]</span>}</li>
            ))}
          </ul>
        </section>
      )}

      {projects && projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base font-bold border-b border-gray-100 mb-1">Projects</h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-2">
              <div className="flex flex-wrap gap-2 font-semibold">
                <span>{p.name}</span>
                <span className="ml-auto text-xs">{p.startDate ? formatDate(p.startDate) : ''}{p.endDate ? ` - ${formatDate(p.endDate)}` : ''}</span>
              </div>
              <div className="text-xs text-gray-900 mb-1">{p.description}</div>
              <div className="text-xs">{p.technologies?.join(', ')}</div>
              {p.url && <div className="text-xs">{p.url}</div>}
            </div>
          ))}
        </section>
      )}

      {languages && languages.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base font-bold border-b border-gray-100 mb-1">Languages</h2>
          <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
            {languages.map((l, i) => (
              <li key={i} className="text-xs px-2 py-1 bg-gray-100 border border-gray-100 text-black">{l.name} ({l.fluency})</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
