'use client'

import React, { useEffect, useState } from 'react'
import type { Certificate } from '@/lib/types'

interface CertificateViewerProps {
  onUpload?: () => void
}

export function CertificateViewer({ onUpload }: CertificateViewerProps) {
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/certificate')
      .then((res) => res.json())
      .then((data) => {
        setCertificate(data.certificate || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const body = {
            name: file.name,
            fileBase64: reader.result as string,
          }
          const res = await fetch('/api/certificate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Upload failed')
          setCertificate(data.certificate)
          setDownloadUrl('/api/certificate?download=1')
        } catch (err: any) {
          setError(err.message || 'Upload failed')
        } finally {
          setUploading(false)
        }
      }
      reader.readAsDataURL(file)
    } catch {
      setError('Failed to read file')
      setUploading(false)
    }
  }

  const resetUpload = () => {
    setCertificate(null)
    setDownloadUrl(null)
    setError('')
    if (document.querySelector('input[type="file"]')) {
      (document.querySelector('input[type="file"]') as HTMLInputElement).value = ''
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading certificate…</p>
  }

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Upload Prop Firm Certificate</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Upload a screenshot or PDF of your prop firm challenge pass/certificate to keep it handy in your journal.
        </p>
        {error && <p className="text-sm text-danger mb-3">{error}</p>}
        <label className="btn btn-secondary">
          Choose File
          <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={handleFileChange} className="hidden" />
        </label>
        {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading…</p>}
      </div>

      {certificate ? (
        <>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">{certificate.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Uploaded {new Date(certificate.uploadedAt).toLocaleString()}
            </p>
            {certificate.fileBase64 ? (
              <div className="bg-black/5 rounded-lg p-3">
                <img
                  src={certificate.fileBase64}
                  alt="Certificate"
                  className="max-w-full max-h-96 rounded"
                />
              </div>
            ) : certificate.link ? (
              <a
                href={certificate.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block btn btn-primary"
              >
                View certificate
              </a>
            ) : null}
            {downloadUrl && (
              <a href={downloadUrl} download className="mt-3 inline-block btn btn-secondary">
                Download original file
              </a>
            )}
            <button
              onClick={resetUpload}
              className="mt-3 text-sm text-danger hover:underline"
            >
              Remove certificate
            </button>
          </div>
          {onUpload && (
            <button onClick={onUpload} className="btn btn-secondary">
              Replace certificate
            </button>
          )}
        </>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-muted-foreground text-sm">No certificate uploaded yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Upload your prop firm certificate to have it attached to your journal.</p>
        </div>
      )}
    </div>
  )
}
