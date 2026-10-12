import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Candidate } from '../../types';
import { candidateService } from '../../services/candidateService';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
  onUploaded: (updated: Candidate) => void;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onUploaded,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedSnippet, setExtractedSnippet] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select a valid PDF file (.pdf)');
        setFile(null);
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        setError('File size must not exceed 10MB');
        setFile(null);
        return;
      }
      setError(null);
      setFile(selected);
      setExtractedSnippet(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await candidateService.uploadResume(candidate.id, file);
      setExtractedSnippet(updated.resumeText ? updated.resumeText.substring(0, 400) + '...' : 'Text parsed successfully');
      onUploaded(updated);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload and parse resume file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Upload Resume for ${candidate.fullName}`}
      description="Upload a PDF resume. The system will extract text content with Apache PDFBox and update AI matching criteria."
      maxWidth="lg"
    >
      <div className="space-y-4">
        {error && (
          <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {extractedSnippet ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Resume uploaded and text extracted successfully!</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Extracted Text Preview
              </label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                {extractedSnippet}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-brand-500 transition-colors bg-slate-50/50">
              <input
                type="file"
                id="resume-file-input"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="resume-file-input"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium text-slate-800">
                  {file ? file.name : 'Click to select or drag and drop PDF resume'}
                </div>
                <p className="text-xs text-slate-500">PDF up to 10MB supported</p>
              </label>
            </div>

            {file && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-brand-600 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800 truncate max-w-xs">{file.name}</p>
                    <p className="text-[11px] text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!file || loading}
                onClick={handleUpload}
                className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing PDF...' : 'Upload & Extract'}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
