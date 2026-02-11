'use client';

import React, { useState, useRef } from 'react';
import { X, Download } from 'lucide-react';
import './FileUploadModal.css';

export default function FileUploadModal({ isOpen, onClose, onUpload }) {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const SUPPORTED_FORMATS = ['pdf', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!SUPPORTED_FORMATS.includes(fileExtension)) {
      alert(`File type .${fileExtension} is not supported`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 25MB limit');
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const processFiles = (fileList) => {
    fileList.forEach((file) => {
      if (validateFile(file)) {
        const fileObj = {
          id: Math.random(),
          name: file.name,
          size: file.size,
          progress: Math.floor(Math.random() * 60) + 20, // Simulate progress
          file: file,
        };
        setFiles((prev) => [...prev, fileObj]);

        // Simulate upload progress
        const interval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id && f.progress < 100
                ? { ...f, progress: f.progress + Math.random() * 30 }
                : f
            )
          );
        }, 500);

        setTimeout(() => clearInterval(interval), 3000);
      }
    });
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes, k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return '🖼️';
    }
    if (extension === 'pdf') {
      return '📄';
    }
    return '📊';
  };

  if (!isOpen) return null;

  return (
    <div className="upload-modal-overlay">
      <div className="upload-modal-container">
        {/* Header */}
        <div className="upload-modal-header">
          <h2 className="upload-modal-title">Upload file</h2>
          <button
            onClick={onClose}
            className="upload-modal-close-btn"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="upload-modal-content">
          {/* Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`upload-drop-zone ${dragActive ? 'drag-active' : ''}`}
          >
            <div className="upload-drop-zone-content">
              <div className="upload-drop-zone-icon">
                <Download size={24} />
              </div>
              <p className="upload-drop-zone-text">
                Drag and Drop file here
              </p>
            </div>
          </div>

          {/* Supported Formats */}
          <div className="upload-formats-info">
            <span>Supported formats: PDF, XLS, XLSX, JPG, PNG, GIF, BMP, WEBP</span>
            <span>Maximum size: 25MB</span>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="upload-file-list">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="upload-file-item"
                >
                  <div className="upload-file-item-content">
                    <div className="upload-file-icon">{getFileIcon(file.name)}</div>
                    <div className="upload-file-details">
                      <div className="upload-file-name-container">
                        <p className="upload-file-name">
                          {file.name}
                        </p>
                      </div>
                      <p className="upload-file-size">
                        {formatFileSize(file.size)}
                      </p>
                      <div className="upload-file-progress-bar">
                        <div
                          className="upload-file-progress-fill"
                          style={{ width: `${Math.min(file.progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="upload-file-actions">
                    <span className="upload-file-progress-text">
                      {Math.round(Math.min(file.progress, 100))}%
                    </span>
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
        </div>

        {/* Footer */}
        <div className="upload-modal-footer">
          <button className="upload-help-link">
            <span className="upload-help-icon">❓</span>
            <span>Help Center</span>
          </button>
          <div className="upload-button-group">
            <button
              onClick={onClose}
              className="upload-cancel-btn"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (onUpload) onUpload(files);
                setFiles([]);
              }}
              className="upload-next-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
