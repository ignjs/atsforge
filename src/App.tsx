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
    <>
      <header className="w-full bg-black text-white py-4 mb-5">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide">ATSForge - ATS Generator</h1>
        </div>
      </header>
      <div className="m-0 md:m-5 flex flex-col md:flex-row bg-white text-black font-sans items-stretch min-h-screen">
        {/* Sidebar */}
        <aside className="border-b md:border-b-0 md:border-r border-gray-100 bg-white flex flex-col h-auto md:h-full min-h-0 md:min-h-screen shadow-none z-10 w-full md:w-auto">
          <nav className="grid grid-cols-2 gap-2 p-2 md:flex md:flex-row md:gap-2 md:p-4 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50 md:bg-white">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`w-full md:w-auto px-2 md:px-4 py-2 md:py-3 text-center text-xs md:text-sm font-semibold transition-all duration-200 mb-0.5 md:mb-0 md:mb-2
                  border border-transparent md:border-0
                  md:rounded-xl
                  md:shadow-sm
                  md:transition-all md:duration-200
                  md:hover:bg-gray-100
                  md:hover:text-black
                  ${tab === t.key
                    ? 'bg-black text-white md:bg-black md:text-white md:shadow-lg md:scale-105 md:border md:border-black md:rounded-xl'
                    : 'bg-white text-gray-900 md:bg-white md:text-black md:hover:bg-gray-100 md:hover:text-black'}
                `}
                style={{marginBottom: 0}}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="flex-1 overflow-y-auto min-h-0">
            {tab === 'basics' && <FormBasics />}
            {tab === 'skills' && <FormSkills />}
            {tab === 'experience' && <FormExperience />}
            {tab === 'education' && <FormEducation />}
            {tab === 'certifications' && <FormCertifications />}
            {tab === 'projects' && <FormProjects />}
            {tab === 'languages' && <FormLanguages />}
          </div>
          <button
            className="m-2 md:m-4 border border-gray-700 px-4 py-2 text-black bg-white text-xs font-semibold hover:bg-gray-100"
            onClick={() => setShowPreview(true)}
          >
            Preview
          </button>
        </aside>
        {/* Preview */}
        <main className="flex-1 flex flex-col justify-center items-center bg-white min-h-screen overflow-y-auto min-w-0">
          {showPreview && (
            <div className="w-full max-w-2xl p-2 sm:p-4 flex flex-col" id="ats-preview">
              <AtsPreview />
              {/* Los botones deben estar DENTRO del previewId para ser ocultados */}
              <div>
                <DownloadButtons previewId="ats-preview" resume={resume} />
              </div>
            </div>
          )}
        </main>
      </div>
      <footer className="w-full bg-black text-white py-3 mt-5">
        <div className="max-w-7xl mx-auto px-4">
          <p className="italic text-xs sm:text-sm text-gray-200">Powered by Copilot &amp; IGNJS. Not much, but it may help someone who needs it.</p>
        </div>
      </footer>
    </>
  );
}
