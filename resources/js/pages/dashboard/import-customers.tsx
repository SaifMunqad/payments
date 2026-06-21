import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Page } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { AppShell } from '@/components/app-shell';
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Customer {
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface Props {
    previewData?: (string | number)[][];
    file?: File;
}

const ImportCustomers: Page<Props> = ({ previewData, file }) => {
    const { auth } = usePage().props;
    const [selectedFile, setSelectedFile] = useState<File | null>(file || null);
    const [preview, setPreview] = useState<(string | number)[][]>(previewData || []);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (previewData) {
            setPreview(previewData);
        }
    }, [previewData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file type
            const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
            if (!allowedTypes.includes(file.type)) {
                setError('Invalid file type. Please upload a CSV or Excel file.');
                return;
            }

            // Check file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size exceeds 5MB limit.');
                return;
            }

            // Set file and clear error
            setSelectedFile(file);
            setError('');
            setSuccess('');
            setPreview([]);
            setUploadProgress(0);

            // Preview the file
            previewFile(file);
        }
    };

    const previewFile = (file: File) => {
        if (file.type === 'text/csv') {
            // Process CSV file
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const rows = text.split('\n').slice(0, 5);
                const data = rows.map(row => row.split(','));
                setPreview(data);
            };
            
            reader.readAsText(file);
        } else {
            // Process Excel file
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheet];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                setPreview(json.slice(0, 5) as (string | number)[][]);
            };
            
            reader.readAsArrayBuffer(file);
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedFile) {
            setError('Please select a file to upload');
            return;
        }
        
        setIsUploading(true);
        setUploadProgress(0);
        setError('');
        setSuccess('');
        
        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setSuccess(`Successfully imported ${selectedFile.name}`);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    return (
        <AppShell>
            <AppHeader title="Import Customers" />
            <AppContent>
                <div className="max-w-3xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Import Customers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-2">File Upload</h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Upload a CSV or Excel file containing customer data. The file must contain the following columns:
                                        name, email, phone, address
                                    </p>
                                    
                                    <div 
                                        className={`border-2 border-dashed rounded-lg p-8 text-center ${
                                            error ? 'border-red-500 bg-red-50' : 
                                            isUploading ? 'border-blue-500 bg-blue-50' : 
                                            'border-gray-300'
                                        }`}
                                        onDragEnter={(e) => e.preventDefault()}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDragLeave={(e) => e.preventDefault()}
                                        onDrop={handleFileChange}
                                    >
                                        <input
                                            type="file"
                                            id="file-upload"
                                            name="file"
                                            accept=".csv,.xlsx,.xls"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        
                                        <label 
                                            htmlFor="file-upload" 
                                            className="cursor-pointer flex flex-col items-center"
                                        >
                                            <svg
                                                className="w-12 h-12 text-gray-400 mb-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M9 13h6m-3-3v6m5 0h.01M12 21a9 9 0 01-9-9h-1a9 9 0 019-9m-9 9a9 9 0 019 9m-9-9h1a9 9 0 019 9"
                                                />
                                            </svg>
                                            <span className="text-sm text-gray-500 mb-4">
                                                {selectedFile
                                                    ? `Selected file: ${selectedFile.name}`
                                                    : 'Drag and drop a file here, or click to select a file'
                                                }
                                            </span>
                                        </label>
                                    </div>
                                    
                                    {error && (
                                        <Alert variant="destructive" className="mt-4">
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {preview.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">File Preview</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full table-auto">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="px-4 py-2">Name</th>
                                                        <th className="px-4 py-2">Email</th>
                                                        <th className="px-4 py-2">Phone</th>
                                                        <th className="px-4 py-2">Address</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {preview.map((row, index) => (
                                                        <tr key={index} className="border-t hover:bg-gray-50">
                                                            {row.map((cell, cellIndex) => (
                                                                <td key={cellIndex} className="px-4 py-2">
                                                                    {cell}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/customers">Cancel</Link>
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={!selectedFile || isUploading}
                                        onClick={handleUpload}
                                    >
                                        {isUploading ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12s5.373 12 12 12-12-5.373-12-12z"
                                                    />
                                                </svg>
                                                Uploading...
                                            </>
                                        ) : 'Import Customers'}
                                    </Button>
                                </div>
                                
                                {isUploading && (
                                    <div className="mt-4">
                                        <div className="relative pt-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                                    {uploadProgress}%
                                                </div>
                                            </div>
                                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                                <div
                                                    style={{ width: `${uploadProgress}%` }}
                                                    className="shadow-none flex flex-col text-center whitespace-nowrap bg-blue-500 justify-center transition-all duration-300"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {success && (
                                    <div className="mt-4">
                                        <Alert variant="success">
                                            <AlertDescription>{success}</AlertDescription>
                                        </Alert>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppContent>
        </AppShell>
    );
};

ImportCustomers.layout = page => <AppLayout children={page} />;

export default ImportCustomers;