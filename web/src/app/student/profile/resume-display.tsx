'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Badge, Spinner } from '@/components/ui';
import { Download, Upload, Eye, Share2 } from 'lucide-react';

interface ResumeDisplayProps {
  resumePath?: string;
  fullName: string;
  isOwnProfile: boolean;
  onUploadResume?: (file: File) => Promise<void>;
}

export function ResumeDisplay({
  resumePath,
  fullName,
  isOwnProfile,
  onUploadResume
}: ResumeDisplayProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(resumePath);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
      alert('Please upload a PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      await onUploadResume?.(file);
      setUploadedUrl(URL.createObjectURL(file));
    } catch (error) {
      alert('Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadResume = () => {
    if (!uploadedUrl) return;
    const a = document.createElement('a');
    a.href = uploadedUrl;
    a.download = `${fullName}_resume.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card className="border-2 border-primary-100">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-primary-600" />
            <h2 className="font-bold text-gray-900">Resume</h2>
          </div>
          {uploadedUrl && (
            <Badge variant="success">Uploaded</Badge>
          )}
        </div>
      </CardHeader>

      <CardBody className="space-y-6">
        {/* Resume Preview */}
        {uploadedUrl ? (
          <div className="space-y-4">
            {/* PDF Embed */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <iframe
                src={uploadedUrl}
                className="w-full h-96 sm:h-[600px]"
                title="Resume Preview"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                className="flex-1 h-11 flex items-center justify-center gap-2"
                onClick={downloadResume}
              >
                <Download className="w-5 h-5" />
                Download Resume
              </Button>

              <Button
                variant="outline"
                className="flex-1 h-11 flex items-center justify-center gap-2"
                onClick={() => {
                  const url = new URL(uploadedUrl, window.location.origin);
                  window.open(url, '_blank');
                }}
              >
                <Share2 className="w-5 h-5" />
                Open in New Tab
              </Button>
            </div>

            {/* Replace Resume (Own Profile Only) */}
            {isOwnProfile && (
              <div>
                <label className="block">
                  <Button
                    variant="outline"
                    className="w-full h-11 flex items-center justify-center gap-2 cursor-pointer"
                    disabled={isUploading}
                  >
                    <Upload className="w-5 h-5" />
                    {isUploading ? 'Uploading...' : 'Update Resume'}
                  </Button>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        ) : (
          // No Resume State
          <div className="py-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-10 h-10 text-gray-400" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">No Resume Uploaded</h3>
              <p className="text-sm text-gray-600 mb-4">
                {isOwnProfile
                  ? "Upload your resume to complete your profile and stand out to trainers."
                  : "This student hasn't uploaded a resume yet."}
              </p>
            </div>

            {isOwnProfile && (
              <label className="block">
                <Button
                  variant="primary"
                  className="mx-auto flex items-center justify-center gap-2 cursor-pointer"
                  disabled={isUploading}
                >
                  <Upload className="w-5 h-5" />
                  {isUploading ? 'Uploading...' : 'Upload Resume'}
                </Button>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}

        {/* Upload Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>📄 Tip:</strong> Use a well-formatted PDF resume. Maximum file size is 5MB.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
