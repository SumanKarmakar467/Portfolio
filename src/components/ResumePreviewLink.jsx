import React from 'react';
import './ResumePreviewLink.css';

export default function ResumePreviewLink({
  children = 'Resume',
  className = 'btn btn-outline',
  previewPosition = 'bottom',
  onClick,
}) {
  return (
    <span className={`resume-preview-link resume-preview-link--${previewPosition}`}>
      <a href="/resume.pdf" className={className} download onClick={onClick}>
        {children}
      </a>
      <span className="resume-preview" aria-hidden="true">
        <span className="resume-preview__label">Resume Preview</span>
        <iframe
          className="resume-preview__frame"
          src="/resume.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
          title="Resume preview"
          loading="lazy"
        />
      </span>
    </span>
  );
}
