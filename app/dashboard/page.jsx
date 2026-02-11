'use client';

import React, { useState } from 'react';
import Upload from '@/components/Upload';
import DataModel from '@/components/dataModel';
import { Spinner } from '@/components/ui/spinner';

export default function DashboardPage() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = (data) => {
    setIsLoading(true);
  };

  const handleAnalysisComplete = (data) => {
    setAnalysisResult(data);
    setIsLoading(false);
  };

  return (
    <>
      <main style={styles.mainUpload}>
        <Upload onUpload={handleUpload} onAnalysisComplete={handleAnalysisComplete} />
      </main>

      {isLoading && (
        <main style={styles.mainLoading}>
          <div style={styles.spinnerContainer}>
            <Spinner className="size-12" />
            <p style={styles.loadingText}>Analyzing your blueprint...</p>
          </div>
        </main>
      )}

      {analysisResult && !isLoading && (
        <main style={styles.mainData}>
          <DataModel apiData={analysisResult} />
        </main>
      )}
    </>
  );
}

const styles = {
  mainUpload: {
    minHeight: 'calc(100vh - 75px)',
    backgroundColor: '#f9fafb',
    padding: '2rem 1rem',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  mainLoading: {
    minHeight: 'calc(100vh - 75px)',
    backgroundColor: '#f9fafb',
    padding: '2rem 1rem',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  spinnerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  loadingText: {
    fontSize: '1.125rem',
    color: '#6b7280',
    fontWeight: '500',
  },
  mainData: {
    minHeight: 'calc(100vh - 135px)',
    backgroundColor: '#f9fafb',
    padding: '2rem 1rem',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
};
