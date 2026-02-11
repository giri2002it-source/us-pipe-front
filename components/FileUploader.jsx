'use client';

import React, { useState, useRef } from 'react';
import { X, Download } from 'lucide-react';
import './FileUploadModal.css';

export default function FileUploader({ onUpload }) {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
      e.target.value = '';
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFiles = (newFiles) => {
    const validFiles = newFiles.filter((file) => {
      const validExtensions = ['pdf', 'jpg', 'jpeg'];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const isValidExt = validExtensions.includes(ext);
      const isValidSize = file.size <= 25 * 1024 * 1024;

      if (!isValidExt) {
        alert(`File "${file.name}" has an unsupported format. Only PDF and JPG files are allowed.`);
      }
      if (!isValidSize) {
        alert(`File "${file.name}" exceeds the 25MB size limit.`);
      }

      return isValidExt && isValidSize;
    });

    if (validFiles.length === 0) return;

    const newFileObjects = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      progress: 100,
      file,
    }));

    setFiles((prev) => [...prev, ...newFileObjects]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const icons = {
      pdf: '📄',
      jpg: '🖼️',
      jpeg: '🖼️',
    };
    return icons[ext] || '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const removeFile = (id) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload file</h2>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".pdf,.jpg,.jpeg"
        multiple
        style={{ display: 'none' }}
      />

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`upload-drop-zone ${dragActive ? 'drag-active' : ''}`}
        style={{ cursor: 'pointer' }}
      >
        <div className="upload-drop-zone-content">
          <div className="upload-drop-zone-icon">
            <Download size={24} />
          </div>
          <p className="upload-drop-zone-text">Drag and Drop file here or <span style={{ color: '#3b82f6', textDecoration: 'underline' }}>Browse</span></p>
        </div>
      </div>

      {/* Supported Formats */}
      <div className="upload-formats-info">
        <span>Supported formats: PDF, JPG</span>
        <span>Maximum size: 25MB</span>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="upload-file-list">
          {files.map((file) => (
            <div key={file.id} className="upload-file-item">
              <div className="upload-file-item-content">
                <div className="upload-file-icon">{getFileIcon(file.name)}</div>
                <div className="upload-file-details">
                  <div className="upload-file-name-container">
                    <p className="upload-file-name">{file.name}</p>
                  </div>
                  <p className="upload-file-size">{formatFileSize(file.size)}</p>
                  <div className="upload-file-progress-bar">
                    <div
                      className="upload-file-progress-fill"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="upload-file-actions">
                <span className="upload-file-progress-text">{file.progress}%</span>
                <button
                  onClick={() => removeFile(file.id)}
                  className="upload-file-remove-btn"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Buttons */}
      <div style={styles.footer}>
        <button style={styles.helpLink}>
          <span style={styles.helpIcon}>❓</span>
          <span>Help Center</span>
        </button>
        <div style={styles.buttonGroup}>
          <button style={styles.cancelBtn}>Cancel</button>
          <button
            onClick={() => {
              if (onUpload) onUpload(files);
              setFiles([]);
            }}
            disabled={files.length === 0}
            style={files.length > 0 ? styles.nextBtnEnabled : styles.nextBtn}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    maxWidth: '40rem',
    margin: '0 auto',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '1.5rem',
    margin: 0,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e5e7eb',
  },
  helpLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#4b5563',
    fontSize: '0.875rem',
    transition: 'color 0.2s ease',
  },
  helpIcon: {
    fontSize: '1.25rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.75rem',
  },
  cancelBtn: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#ffffff',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
  nextBtn: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#d1d5db',
    color: '#9ca3af',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'not-allowed',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
  nextBtnEnabled: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
};
