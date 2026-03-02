import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { Download, FileText } from 'lucide-react';
import type { AtsResume } from '../types';



interface DownloadButtonsProps {
  previewId?: string;
  resume: AtsResume;  // ← NUEVO: recibe el estado para metadata
}


// Helper: determina si el CV está listo para descargar (progreso completo)
function isResumeComplete(resume: AtsResume): boolean {
  // Básicos: solo campos requeridos, ignora undefined
  const basics = resume.basics || {};
  const basicsOk = Boolean(basics.name && basics.email && basics.location && basics.summary);
  // Skills: al menos 1 skill con keywords (ignora si skills es undefined)
  const skillsArr = Array.isArray(resume.skills) ? resume.skills : [];
  const skillsOk = skillsArr.length > 0 && skillsArr.some(s => Array.isArray(s.keywords) && s.keywords.length > 0);
  // Experiencia: al menos 1 con position, company, startDate
  const expArr = Array.isArray(resume.experience) ? resume.experience : [];
  const expOk = expArr.length > 0 && expArr.some(e => e.position && e.company && e.startDate);
  // Educación: al menos 1 con degree, institution, startDate
  const eduArr = Array.isArray(resume.education) ? resume.education : [];
  const eduOk = eduArr.length > 0 && eduArr.some(e => e.degree && e.institution && e.startDate);
  return basicsOk && skillsOk && expOk && eduOk;
}

export default function DownloadButtons({ previewId = 'ats-preview', resume }: DownloadButtonsProps) {
  const [downloading, setDownloading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const disabled = downloading || !isResumeComplete(resume);

  const handlePDF = async () => {
    if (downloading) return;
    setDownloading(true);
    setExporting(true);

    const preview = document.getElementById(previewId);
    if (!preview) {
      setDownloading(false);
      return;
    }
      // Oculta los botones antes de exportar
      const btns = preview.querySelectorAll('.no-print');
      btns.forEach(el => (el as HTMLElement).style.display = 'none');

    // ATS Metadata [web:29][web:36]
    const skillsArr = Array.isArray(resume.skills) ? resume.skills : [];
    const keywords = skillsArr
      .flatMap(s => s.keywords)
      .slice(0, 7)  // Max 7 para ATS
      .join(', ');

    const canvas = await html2canvas(preview, { 
      backgroundColor: '#FFFFFF', 
      scale: 2,
      useCORS: true 
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    
    // ← CAMBIO CLAVE: setProperties ANTES de addImage
    pdf.setProperties({
      title: `${resume.basics.name} - Software Architect`,  // Personaliza con cargo
      author: resume.basics.name,
      subject: `CV ATS - ${resume.basics.location}`,
      keywords: keywords,  // Skills del JD
      creator: 'ATSForge v1.0'
    });

    // Multi-página mejorada
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth * 0.95;  // Márgenes ATS
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position + 10, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${resume.basics.name.replace(/\s+/g, '_')}_CV_ATS.pdf`);
    // Restaura los botones después de exportar
    btns.forEach(el => (el as HTMLElement).style.display = '');
    setDownloading(false);
    setExporting(false);
  };

  const handleWord = async () => {
    if (downloading) return;
    setDownloading(true);
    setExporting(true);

    const preview = document.getElementById(previewId);
    if (!preview) {
      setDownloading(false);
      return;
    }
      // Oculta los botones antes de exportar
      const btns = preview.querySelectorAll('.no-print');
      btns.forEach(el => (el as HTMLElement).style.display = 'none');

    // Mejora Word: preserva estructura básica (headings, bullets)
    const lines = preview.innerText.split('\n').filter(l => l.trim());
    const children: Paragraph[] = [];

    lines.forEach(line => {
      if (line.match(/^(Experience|Skills|Education)/i)) {
        children.push(new Paragraph({
          text: line,
          heading: HeadingLevel.HEADING_2,  // Headings para ATS
          spacing: { after: 200 }
        }));
      } else if (line.startsWith('•') || line.startsWith('-')) {
        children.push(new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun(line.slice(1).trim())]
        }));
      } else {
        children.push(new Paragraph({ children: [new TextRun(line)] }));
      }
    });

    const doc = new Document({
      sections: [{ children }]
    });

    Packer.toBlob(doc).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.basics.name.replace(/\s+/g, '_')}_CV_ATS.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloading(false);
      setExporting(false);
      // Restaura los botones después de exportar
      btns.forEach(el => (el as HTMLElement).style.display = '');
    });
  };

  if (exporting) return null;
  return (
    <div className="flex gap-2 mt-2 no-print">
      <button 
        onClick={handlePDF} 
        disabled={disabled}
        className="flex items-center gap-1 border border-gray-700 px-3 py-1.5 text-sm bg-white text-black hover:bg-gray-50 disabled:opacity-50"
        title={!isResumeComplete(resume) ? 'Completa todas las secciones para habilitar la descarga' : ''}
      >
        <Download size={14} />
        PDF ATS
      </button>
      <button 
        onClick={handleWord}
        disabled={disabled}
        className="flex items-center gap-1 border border-gray-700 px-3 py-1.5 text-sm bg-white text-black hover:bg-gray-50 disabled:opacity-50"
        title={!isResumeComplete(resume) ? 'Completa todas las secciones para habilitar la descarga' : ''}
      >
        <FileText size={14} />
        Word ATS
      </button>
    </div>
  );
}