import { useState } from 'react';
import { useResumeStore } from './stores/resumeStore';
import FormBasics from './components/FormBasics';
import FormSkills from './components/FormSkills';
import FormExperience from './components/FormExperience';
import FormEducation from './components/FormEducation';
import FormCertifications from './components/FormCertifications';
import FormProjects from './components/FormProjects';
import FormLanguages from './components/FormLanguages';
import AtsPreview from './components/AtsPreview';
import DownloadButtons from './components/DownloadButtons';
// Import or define the AtsResume type
// ...existing code...

const TABS = [
  { key: 'basics', label: 'Basics' },
  { key: 'skills', label: 'Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'projects', label: 'Projects' },
  { key: 'languages', label: 'Languages' },
];


export default function App() {
  const [tab, setTab] = useState('basics');
  const [showPreview, setShowPreview] = useState(true);
  const resume = useResumeStore(state => state.resume);

  return (
    <div className="m-5 flex flex-col md:flex-row bg-white text-black font-sans items-stretch">
      {/* Sidebar */}
      <aside className="border-r border-gray-100 bg-white flex flex-col h-full min-h-screen shadow-none z-10">
        <nav className="flex flex-row border-b md:border-b-0 md:border-r border-gray-100">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`px-4 py-3 text-left text-sm font-semibold border-b md:border-b-0 md:border-r-0 md:border-l-4 transition-colors duration-150 ${tab === t.key
                ? 'md:border-l-black bg-black text-white'
                : 'md:border-l-transparent bg-white text-gray-900 hover:bg-gray-100'}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="flex-1 overflow-y-auto">
          {tab === 'basics' && <FormBasics />}
          {tab === 'skills' && <FormSkills />}
          {tab === 'experience' && <FormExperience />}
          {tab === 'education' && <FormEducation />}
          {tab === 'certifications' && <FormCertifications />}
          {tab === 'projects' && <FormProjects />}
          {tab === 'languages' && <FormLanguages />}
        </div>
        <button
          className="m-4 border border-gray-700 px-4 py-2 text-black bg-white text-xs font-semibold hover:bg-gray-100"
          onClick={() => setShowPreview(true)}
        >
          Preview
        </button>
      </aside>
      {/* Preview */}
      <main className="flex-1 flex flex-col justify-center items-center bg-white min-h-screen overflow-y-auto min-w-0">
        {showPreview && (
          <div className="w-full max-w-2xl p-4 flex flex-col" id="ats-preview">
            <AtsPreview />
            {/* Los botones deben estar DENTRO del previewId para ser ocultados */}
            <div>
              <DownloadButtons previewId="ats-preview" resume={resume} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
