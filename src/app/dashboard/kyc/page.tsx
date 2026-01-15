'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  IdentificationIcon, 
  ArrowUpTrayIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  MapPinIcon,
  CameraIcon,
  DocumentTextIcon,
  UserCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const DOC_TYPES = [
    { id: 'gh_card', label: 'Ghana Card' },
    { id: 'passport', label: 'Passport' },
    { id: 'drivers_license', label: "Driver's License" }
];

const STEPS = [
    { id: 1, title: 'Document Details', icon: DocumentTextIcon },
    { id: 2, title: 'Upload ID', icon: IdentificationIcon },
    { id: 3, title: 'Selfie', icon: CameraIcon }
];

export default function KycPage() {
  const { kycStatus, checkKycStatus } = useAuth();
  
  // Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [docType, setDocType] = useState('gh_card');
  const [docNumber, setDocNumber] = useState('');
  
  // Files
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const validateStep = (step: number) => {
      setError('');
      if (step === 1) {
          if (!docNumber) { setError('Please enter your document number.'); return false; }
          return true;
      }
      if (step === 2) {
          if (!frontImage) { setError('Front of ID is required.'); return false; }
          if (docType !== 'passport' && !backImage) { setError('Back of ID is required.'); return false; }
          return true;
      }
      if (step === 3) {
           if (!selfieImage) { setError('Selfie is required.'); return false; }
           return true;
      }
      return true;
  };

  const handleNext = () => {
      if (validateStep(currentStep)) {
          setCurrentStep(prev => Math.min(prev + 1, 3));
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return; // Validates selfie step before final submission check

    // Final validation of all required
    if (!docNumber || !frontImage || (docType !== 'passport' && !backImage) || !selfieImage) {
        setError('Please complete all required fields in the Identity Verification steps.');
        return;
    }

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('document_type', docType);
    formData.append('document_number', docNumber);
    formData.append('front_image', frontImage);
    if (backImage) formData.append('back_image', backImage);
    formData.append('selfie_image', selfieImage);
    if (proofOfAddress) formData.append('proof_of_address', proofOfAddress);

    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/kyc/submit`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.status) {
            setSuccess('KYC documents submitted successfully.');
            // Reset
            setFrontImage(null);
            setBackImage(null);
            setSelfieImage(null);
            setProofOfAddress(null);
            setDocNumber('');
            setCurrentStep(1);
            await checkKycStatus(); 
        } else {
            setError(data.message || 'Failed to submit documents.');
        }

    } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const FileUpload = ({ label, file, onChange, icon: Icon = ArrowUpTrayIcon, required = false }: any) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-xl hover:border-red-400 dark:hover:border-red-500 transition-colors group bg-gray-50 dark:bg-gray-800/30">
            <div className="space-y-1 text-center">
                <Icon className="mx-auto h-12 w-12 text-gray-400 group-hover:text-red-500 transition-colors" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                    <label className="relative cursor-pointer rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none">
                        <span>Upload file</span>
                        <input type="file" className="sr-only" accept="image/*,.pdf" onChange={onChange} />
                    </label>
                </div>
                <p className="text-xs text-gray-500 truncate max-w-[200px]">
                    {file ? <span className="text-emerald-600 font-semibold">{file.name}</span> : 'PNG, JPG, PDF up to 10MB'}
                </p>
            </div>
        </div>
    </div>
  );

  const StepIndicator = () => (
      <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                  <div key={step.id} className="flex flex-col items-center relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isActive ? 'bg-red-600 text-white shadow-lg shadow-red-500/30 ring-4 ring-red-100 dark:ring-red-900/30' : 
                          isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                      }`}>
                          {isCompleted ? <CheckCircleIcon className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${isActive ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>
                          {step.title}
                      </span>
                  </div>
              )
          })}
          {/* Progress Line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 -z-0">
             <div 
                className="h-full bg-red-600 transition-all duration-500" 
                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
             ></div>
          </div>
      </div>
  );

  const renderStatus = () => {
    if (kycStatus === 'verified') {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900 mb-8 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mb-4">
                    <CheckCircleIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">Verified</h2>
                <p className="text-emerald-600 dark:text-emerald-400 mt-2 text-center">Your identity has been verified.</p>
            </div>
        );
    }
    if (kycStatus === 'pending') {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900 mb-8 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mb-4">
                    <ClockIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">Pending Review</h2>
                <p className="text-blue-600 dark:text-blue-400 mt-2 text-center">Your documents are under review.</p>
            </div>
        );
    }
    return null;
  };

  if (!kycStatus) return null;

  return (
    <div className="max-w-7xl mx-auto py-8 animate-slide-in-up space-y-8">
      <div className="text-center md:text-left border-b border-gray-100 dark:border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 justify-center md:justify-start">
          <IdentificationIcon className="w-8 h-8 text-red-600" />
          Verification Center
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
            Complete your profile to unlock all features.
        </p>
      </div>

      {renderStatus()}

      {(kycStatus === 'unsubmitted' || kycStatus === 'rejected') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT COLUMN: IDENTITY STEPPER */}
            <div className="lg:col-span-2 space-y-6">
                 {kycStatus === 'rejected' && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900 flex items-center gap-3 text-red-700 dark:text-red-400">
                        <XCircleIcon className="w-6 h-6 shrink-0" />
                        <div>
                            <p className="font-semibold">Verification Rejected</p>
                            <p className="text-sm">Please review and resubmit.</p>
                        </div>
                    </div>
                 )}

                 <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
                     <div className="mb-8 relative">
                         <StepIndicator />
                     </div>
                     
                     <form onSubmit={(e) => e.preventDefault()} className="space-y-6 min-h-[300px]">
                         {currentStep === 1 && (
                             <div className="space-y-6 animate-fade-in">
                                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">Document Information</h2>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Document Type</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {DOC_TYPES.map((type) => (
                                                <div 
                                                    key={type.id}
                                                    onClick={() => setDocType(type.id)}
                                                    className={`cursor-pointer px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                                                        docType === type.id 
                                                        ? 'border-red-600 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400' 
                                                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                                                    }`}
                                                >
                                                    <span className="font-medium">{type.label}</span>
                                                    {docType === type.id && <CheckCircleIcon className="w-5 h-5 text-red-600" />}
                                                </div>
                                            ))}
                                        </div>
                                     </div>
                                     <div className="space-y-2">
                                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Document Number</label>
                                         <Input 
                                             value={docNumber} 
                                             onChange={(e) => setDocNumber(e.target.value)} 
                                             placeholder="Enter ID Number"
                                             className="uppercase"
                                         />
                                     </div>
                                 </div>
                             </div>
                         )}

                         {currentStep === 2 && (
                             <div className="space-y-6 animate-fade-in">
                                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Identification</h2>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                     <FileUpload 
                                        label="Front of ID" 
                                        file={frontImage} 
                                        onChange={handleFileChange(setFrontImage)} 
                                        required 
                                        icon={IdentificationIcon}
                                     />
                                     {docType !== 'passport' && (
                                         <FileUpload 
                                            label="Back of ID" 
                                            file={backImage} 
                                            onChange={handleFileChange(setBackImage)} 
                                            required 
                                            icon={IdentificationIcon}
                                         />
                                     )}
                                 </div>
                             </div>
                         )}

                         {currentStep === 3 && (
                             <div className="space-y-6 animate-fade-in">
                                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">Take a Selfie</h2>
                                 <div className="max-w-sm mx-auto">
                                     <FileUpload 
                                        label="Upload Selfie" 
                                        file={selfieImage} 
                                        onChange={handleFileChange(setSelfieImage)} 
                                        required 
                                        icon={CameraIcon}
                                     />
                                     <p className="text-xs text-center text-gray-500 mt-2">
                                         Ensure good lighting and that your face is clearly visible.
                                     </p>
                                 </div>
                             </div>
                         )}
                         
                         {error && <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/10 p-2 rounded-lg">{error}</div>}

                         <div className="flex justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                             <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
                                disabled={currentStep === 1}
                             >
                                 Back
                             </Button>
                             {currentStep < 3 ? (
                                 <Button type="button" onClick={handleNext}>
                                     Next Step <ChevronRightIcon className="w-4 h-4 ml-2" />
                                 </Button>
                             ) : (
                                 <div className="text-sm text-gray-500 flex items-center">
                                     Continue to Address Verification below needed.
                                 </div>
                             )}
                         </div>
                     </form>
                 </div>
            </div>

            {/* RIGHT COLUMN: ADDRESS & SUBMIT */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                     <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <MapPinIcon className="w-5 h-5 text-gray-400" />
                        Proof of Address
                     </h2>
                     <p className="text-sm text-gray-500 mb-6">
                         Utility Bill, Bank Statement, or Tenancy Agreement. (Optional)
                     </p>
                     
                     <FileUpload 
                        label="Upload Document" 
                        file={proofOfAddress} 
                        onChange={handleFileChange(setProofOfAddress)} 
                        icon={DocumentTextIcon}
                     />
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                     <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Review & Submit</h3>
                     <ul className="space-y-2 text-sm text-gray-500 mb-6">
                         <li className="flex items-center justify-between">
                             <span>Identity Info</span>
                             {currentStep > 1 ? <CheckCircleIcon className="w-5 h-5 text-emerald-500"/> : <div className="w-2 h-2 rounded-full bg-gray-300"/>}
                         </li>
                         <li className="flex items-center justify-between">
                             <span>ID Images</span>
                             {currentStep > 2 ? <CheckCircleIcon className="w-5 h-5 text-emerald-500"/> : <div className="w-2 h-2 rounded-full bg-gray-300"/>}
                         </li>
                         <li className="flex items-center justify-between">
                             <span>Selfie</span>
                             {selfieImage ? <CheckCircleIcon className="w-5 h-5 text-emerald-500"/> : <div className="w-2 h-2 rounded-full bg-gray-300"/>}
                         </li>
                         <li className="flex items-center justify-between">
                             <span>Address</span>
                             {proofOfAddress ? <CheckCircleIcon className="w-5 h-5 text-emerald-500"/> : <span className="text-xs text-gray-400">Optional</span>}
                         </li>
                     </ul>

                     {success && <div className="text-emerald-600 text-sm mb-4">{success}</div>}

                     <Button 
                         type="button" // This is triggered by onClick, not form submit
                         fullWidth 
                         size="lg"
                         onClick={handleSubmit}
                         isLoading={isSubmitting}
                         // Only enable if step 3 (Selfie) is validated/active or done.
                         // Actually, we can just let handleButton check validation.
                     >
                         Submit Verification
                     </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
