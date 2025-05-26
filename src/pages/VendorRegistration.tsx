import React, { useState, useCallback, useEffect, ChangeEvent, DragEvent, FormEvent } from 'react';
import { motion, AnimatePresence, useAnimation, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Upload, Check, FileText, Building, User, Phone, Mail, Briefcase, CheckCircle, Globe, X, AlertCircle, Loader2, ChevronRight, ArrowRight, TrendingUp, ShieldCheck, Award, Plus
} from 'lucide-react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealText from '@/components/ui/RevealText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { cn, formatFileSize, generateReferenceId } from '@/lib/utils';
import { generateFAQSchema, generateBreadcrumbSchema, generateOrganizationSchema } from '@/lib/schema';
import { OptimizedImage } from '@/lib/imageOptimizer';
import api from '../config/api';

// --- Constants and Types ---
interface VendorFormData {
  name: string;
  designation: string;
  companyName: string;
  firmType: string;
  vendorType: string; // domestic or global
  country: string;
  website?: string;
  contactNo: string;
  email: string;
  category: string;
  productDescription: string;
  majorClients?: string;
  turnover: string;
  turnoverCurrency: string; // 'INR' or 'USD'
  gstNumber?: string; // GST Registration Number (optional)
  terms: boolean;
}

const firmTypes = [
  { id: 'manufacturer', label: 'MANUFACTURER/OEM' },
  { id: 'dealer', label: 'DEALER/TRADER' },
  { id: 'oem-distributor', label: 'OEM AUTHORISED DISTRIBUTER' },
  { id: 'service', label: 'SERVICE COMPANY' },
  { id: 'consultant', label: 'CONSULTANT/AGENCY' },
];

const categories = [
  { id: 'stationary-computer', label: 'Stationary, Computer & Computer Accessories' },
  { id: 'cloth-textiles', label: 'Cloth, Textiles' },
  { id: 'rubber-pvc-belts', label: 'Rubber, PVC, Conveyor Belts, V Belts, Tyre' },
  { id: 'safety-fire-service', label: 'Safety Items & Fire Service' },
  { id: 'paint-abrasive-hardware', label: 'Paint, Abrasive, Hardware' },
  { id: 'pipe-building-material', label: 'Pipe, Pipe Fitting, Building Material & Sanitary' },
  { id: 'packing-materials', label: 'Packing Materials' },
  { id: 'chemicals', label: 'Chemicals' },
  { id: 'gases', label: 'Gases' },
  { id: 'petroleum-lubricants', label: 'Petrol, Oils, Lubricant & HSD' },
  { id: 'refractory-basic-mcb', label: 'Refractory - Basic, MCB' },
  { id: 'refractory-castables', label: 'Refractory - Castables & other Bricks' },
  { id: 'raw-materials', label: 'Raw Materials' },
  { id: 'instrumentation-electronics', label: 'Instrumentation & Electronics items' },
  { id: 'bearings-cutting-tools', label: 'Bearings, cutting tools' },
  { id: 'fastener-nut-bolts', label: 'Fastener, Nut & Bolts' },
  { id: 'tools-lifting-equipment', label: 'Tools & Tackles & Lifting Equipment' },
  { id: 'electrical-spares', label: 'Electrical Spares' },
  { id: 'cable-winding-wires', label: 'Cable, Cabling Accessories & Winding Wires' },
  { id: 'electrical-consumables', label: 'Electrical Consumables' },
  { id: 'motors-spares', label: 'Motors & Motor Spares' },
  { id: 'electrical-welding-equipment', label: 'Electrical Equ & Welding Equ' },
  { id: 'fluxes-electrodes', label: 'Fluxes & Electrodes' },
  { id: 'rolls-roll-chocks', label: 'Rolls & Roll Chocks' },
  { id: 'minor-raw-materials', label: 'Minor Raw Materials, Ferron Alloys' },
  { id: 'amc-civil', label: 'AMC-Civil' },
  { id: 'amc-electrical', label: 'AMC-electrical' },
  { id: 'amc-mechanical', label: 'AMC-Mechanical' },
  { id: 'amc-others', label: 'AMC-others (IT, rent, HR related, Mrk related etc)' },
  { id: 'material-handling-rental', label: 'Material Handling equip Rental' },
  { id: 'logistics', label: 'Logistics (sea, CHAs)' }
];

// Countries data for the dropdown
const sortableCountries = [
  { code: "in", name: "India", countryCode: "+91" },
  { code: "ae", name: "United Arab Emirates", countryCode: "+971" },
  { code: "au", name: "Australia", countryCode: "+61" },
  { code: "bg", name: "Bangladesh", countryCode: "+880" },
  { code: "bt", name: "Bhutan", countryCode: "+975" },
  { code: "ca", name: "Canada", countryCode: "+1" },
  { code: "cn", name: "China", countryCode: "+86" },
  { code: "de", name: "Germany", countryCode: "+49" },
  { code: "fr", name: "France", countryCode: "+33" },
  { code: "gb", name: "United Kingdom", countryCode: "+44" },
  { code: "id", name: "Indonesia", countryCode: "+62" },
  { code: "it", name: "Italy", countryCode: "+39" },
  { code: "jp", name: "Japan", countryCode: "+81" },
  { code: "kr", name: "South Korea", countryCode: "+82" },
  { code: "lk", name: "Sri Lanka", countryCode: "+94" },
  { code: "my", name: "Malaysia", countryCode: "+60" },
  { code: "np", name: "Nepal", countryCode: "+977" },
  { code: "nz", name: "New Zealand", countryCode: "+64" },
  { code: "qa", name: "Qatar", countryCode: "+974" },
  { code: "ru", name: "Russia", countryCode: "+7" },
  { code: "sa", name: "Saudi Arabia", countryCode: "+966" },
  { code: "sg", name: "Singapore", countryCode: "+65" },
  { code: "th", name: "Thailand", countryCode: "+66" },
  { code: "us", name: "United States", countryCode: "+1" },
  { code: "za", name: "South Africa", countryCode: "+27" },
].sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name

// Add "Others" at the end, after sorting
const countries = [
  ...sortableCountries,
  { code: "others", name: "Others", countryCode: "" },
];

// Allowed file types and size limits
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// --- Helper Components ---
interface FormFieldProps {
  id: keyof VendorFormData | string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, required, children, error, className }) => (
  <div className={cn("space-y-2", className)}>
    <Label htmlFor={id as string} className="text-sm font-medium text-muted-foreground/90">
      {label} {required && <span className="text-rashmi-red">*</span>}
    </Label>
    {children}
    {error && <p className="text-xs text-destructive flex items-center gap-1 pt-1"><AlertCircle size={13} /> {error}</p>}
  </div>
);

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, description }) => (
  <div className="mb-6">
    <div className="flex items-center mb-2">
       <span className="p-2 bg-rashmi-red/10 rounded-full mr-3">
         <Icon className="h-5 w-5 text-rashmi-red" />
       </span>
       <h3 className="text-xl font-semibold text-foreground tracking-tight">
        {title}
      </h3>
    </div>
    {description && <p className="text-sm text-muted-foreground ml-12 -mt-1">{description}</p>}
    <div className="mt-3 ml-12 h-[1px] bg-gradient-to-r from-rashmi-red/30 via-border to-transparent w-2/3"></div>
  </div>
);

// --- Animation Variants ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const shimmerVariants: Variants = {
  initial: { backgroundPosition: '200% 0' },
  animate: {
    backgroundPosition: '-200% 0',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// --- Main Component ---
const VendorRegistration: React.FC = () => {
  // State variables
  const [files, setFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [customCountry, setCustomCountry] = useState('');
  const [customCountryCode, setCustomCountryCode] = useState('');

  // Form setup
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<VendorFormData>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      designation: '',
      companyName: '',
      firmType: '',
      vendorType: 'domestic',
      country: 'in',
      website: '',
      contactNo: '+91 ',
      email: '',
      category: '',
      productDescription: '',
      majorClients: '',
      turnover: '',
      turnoverCurrency: 'INR',
      gstNumber: '',
      terms: false,
    }
  });

  const heroControls = useAnimation();
  const formControls = useAnimation();

  // Animations on mount
  useEffect(() => {
    heroControls.start("visible");
    formControls.start("visible");
  }, [heroControls, formControls]);

  // File handling functions
  const clearAllFiles = () => {
    setFiles([]);
    setFileNames([]);
    setFilePreviews([]);
    setFileTypes([]);
    setFileErrors([]);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const clearFile = (index?: number, e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (index !== undefined) {
      // Revoke object URL if it exists
      if (filePreviews[index] && filePreviews[index].startsWith('blob:')) {
        URL.revokeObjectURL(filePreviews[index]);
      }

      // Remove the file at the specified index
      setFiles(prev => prev.filter((_, i) => i !== index));
      setFileNames(prev => prev.filter((_, i) => i !== index));
      setFilePreviews(prev => prev.filter((_, i) => i !== index));
      setFileTypes(prev => prev.filter((_, i) => i !== index));
      setFileErrors(prev => prev.filter((_, i) => i !== index));
    } else {
      // Clear all files if no index is provided
      filePreviews.forEach(preview => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
      clearAllFiles();
    }
  };

  const handleFileValidation = (selectedFile: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      return false;
    }
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      return false;
    }
    return true;
  };

  // Process files for upload
  const processFiles = (selectedFiles: FileList) => {
    // Check if adding these files would exceed the limit
    if (files.length + selectedFiles.length > 3) {
      setFileErrors(prev => [...prev, `Maximum 3 files allowed. You can select ${3 - files.length} more.`]);
      return;
    }

    // Process each file
    Array.from(selectedFiles).forEach(file => {
      if (!handleFileValidation(file)) {
        const errorMessage = file.size > MAX_FILE_SIZE_BYTES
          ? `File "${file.name}" is too large (Max ${MAX_FILE_SIZE_MB}MB).`
          : `File "${file.name}" has an invalid format. Only PDF and Word documents (DOC/DOCX) are allowed.`;

        setFileErrors(prev => [...prev, errorMessage]);
        return;
      }

      // Valid file, add it to our states
      setFiles(prev => [...prev, file]);
      setFileNames(prev => [...prev, file.name]);
      setFileTypes(prev => [...prev, file.type]);
      setFileErrors(prev => [...prev]);

      const newIndex = files.length;

      // Create preview based on file type
      if (file.type.startsWith('image/')) {
        // For images, use FileReader for preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews(prev => {
            const updated = [...prev];
            updated[newIndex] = reader.result as string;
            return updated;
          });
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        // For PDFs, create object URL for browser's native PDF viewer
        const objectUrl = URL.createObjectURL(file);
        setFilePreviews(prev => {
          const updated = [...prev];
          updated[newIndex] = objectUrl;
          return updated;
        });
      } else {
        // For Word docs, just set an empty preview string
        setFilePreviews(prev => {
          const updated = [...prev];
          updated[newIndex] = '';
          return updated;
        });
      }
    });
  };

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [files.length]);

  // Form submission handler
  const onSubmit: SubmitHandler<VendorFormData> = async (data) => {
    try {
      // Start progress bar
      setUploadProgress(20);

      // Prepare form data
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
          if(typeof value === 'boolean') {
              formData.append(key, String(value));
          } else if(value !== undefined && value !== null && value !== '') { // Avoid sending empty optional fields
              formData.append(key, value);
          }
      });

      // Add any custom country information if applicable
      if (isOtherCountry && customCountry) {
        formData.append('customCountry', customCountry);
      }
      
      if (isOtherCountry && customCountryCode) {
        formData.append('customCountryCode', customCountryCode);
      }

      // Change to use a SINGLE field name for all files instead of dynamic names
      files.forEach((file) => {
        formData.append('supportingDocuments', file);
      });

      // Debug log form data
      console.log('Form Data Contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value}`);
      }

      // Send data to backend using axios
      const response = await api.post('/vendors', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for file uploads
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(20 + (percentCompleted * 0.6)); // Scale to 20-80% range
        }
      });

      setUploadProgress(80);

      // Process response
      const responseData = response.data;

      if (responseData.success) {
        setUploadProgress(100);

        // Smoothly scroll to top before showing success state
        await new Promise<void>((resolve) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          // Wait for scroll to complete before showing success state
          setTimeout(() => {
            setIsSubmitted(true);
            reset();
            clearAllFiles();
            resolve();
          }, 500); // Give time for scroll to finish
        });
      } else {
        throw new Error(responseData.message || 'Failed to submit vendor registration');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFileErrors(prev => [...prev,
        error instanceof Error
          ? `Submission failed: ${error.message}`
          : 'Submission failed. Please check your connection and try again.'
      ]);
    } finally {
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // Parallax effect
  useEffect(() => {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    let ticking = false;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      lastScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          parallaxElements.forEach((element) => {
            const el = element as HTMLElement;
            const speed = parseFloat(el.dataset.speed || '0.3');
            el.style.transform = `translateY(${lastScrollY * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Derived values
  const selectedCountry = countries.find(c => c.code === watch('country'));
  const isOtherCountry = watch('country') === 'others';
  const isDomesticVendor = watch('vendorType') === 'domestic';
  const countryCode = isDomesticVendor ? '+91' : (isOtherCountry ? customCountryCode : (selectedCountry ? selectedCountry.countryCode : ''));
  const shouldShowCountryCodeBadge = (watch('vendorType') === 'global' || watch('country') === 'others') && countryCode && !isDomesticVendor;
  const contactPlaceholder = isDomesticVendor ? 'XXXXXXXXXX' : (shouldShowCountryCodeBadge ? '123456789' : (countryCode ? `${countryCode} 123456789` : '+__ 123456789'));

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      filePreviews.forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [filePreviews]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-50 to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/30">
      <Header />

      {/* Hero Section */}
      <motion.section
        className="pt-48 pb-32 relative isolate overflow-hidden"
        initial="hidden"
        animate={heroControls}
        variants={staggerContainer}
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
        aria-labelledby="vendor-registration-heading"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 z-[-10] opacity-50">
           {/* Subtle Grid Pattern */}
           <svg className="absolute inset-0 h-full w-full stroke-gray-300/30 dark:stroke-neutral-700/30 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]" aria-hidden="true">
            <defs>
                <pattern id="hero-pattern" width="80" height="80" x="50%" y="-1" patternUnits="userSpaceOnUse">
                <path d="M.5 200V.5H200" fill="none"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth="0" fill="url(#hero-pattern)"/>
           </svg>
           {/* Gradient Shapes */}
           <div className="absolute -right-[15%] top-[5%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-rashmi-red/15 via-rashmi-red/5 to-transparent blur-3xl opacity-70 parallax-bg" data-speed="-0.2"></div>
           <div className="absolute -left-[10%] bottom-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-blue-500/15 via-blue-500/5 to-transparent blur-3xl opacity-60 parallax-bg" data-speed="0.15"></div>
           {/* Main Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background z-[-5]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
             {/* Enhanced Breadcrumb */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center text-sm text-muted-foreground/80 mb-6 self-start w-full"
            >
              <Link to="/" className="hover:text-rashmi-red transition-colors duration-200 group flex items-center gap-1" aria-label="Return to homepage">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home text-muted-foreground/60 group-hover:text-rashmi-red transition-colors"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Home
              </Link>
              <ChevronRight className="mx-1.5 h-4 w-4 text-muted-foreground/40" aria-hidden="true" />
              <span className="font-medium text-foreground">Vendor Profile Submission</span>
            </motion.div>

            {/* Main Title with Animated Reveal */}
            <div className="mb-6 overflow-hidden">
              <motion.h1
                id="vendor-registration-heading"
                className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tighter text-foreground leading-tight"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }} // Smoother ease
              >
                Share Your Profile, <br className="hidden md:block" /> Partner with <span className="text-rashmi-red relative inline-block px-2">
                    Rashmi
                    {/* Underline Effect */}
                    <motion.span
                       initial={{ scaleX: 0 }}
                       animate={{ scaleX: 1 }}
                       transition={{ duration: 0.7, delay: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                       className="absolute -bottom-2 left-0 w-full h-1.5 bg-rashmi-red/80 rounded-full origin-left"
                       aria-hidden="true"
                    ></motion.span>
                 </span> Metaliks.
              </motion.h1>
            </div>

            {/* Enhanced Description */}
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-6 leading-relaxed"
            >
              This is your digital window to share your company profile with us. Our procurement team will review your submission before proceeding with the formal vendor registration process.
            </motion.p>

            {/* Important Registration Note */}
            <motion.div
              variants={fadeInUp}
              className="w-full max-w-3xl mx-auto mb-10 mt-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl px-6 py-5 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 to-amber-500"></div>
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-1.5">Important Notice</h4>
                  <p className="text-amber-700/90 dark:text-amber-300/90 text-sm leading-relaxed">
                    We do not charge any registration amount. Please avoid online transaction of money. Interested vendor/supplier can send company profile & details by courier or postal to above address or upload Company Profile online. You will be contacted by our central Procurement team (Corporate) directly.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Enhanced CTA Button */}
            <motion.div variants={fadeInUp}>
              <a
                href="#registration-form"
                className="group inline-flex items-center justify-center gap-2.5 py-3.5 px-8 bg-gradient-to-r from-rashmi-red to-red-700 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-rashmi-red/30 focus:outline-none focus:ring-4 focus:ring-rashmi-red/40 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
              >
                 {/* Shimmer Effect */}
                 <motion.span
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    style={{ backgroundSize: '200% 100%' }}
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                 ></motion.span>
                 <span className="relative z-10">Submit Your Profile</span>
                 <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5 relative z-10" />
              </a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Registration Form Section */}
      <motion.section
        id="registration-form"
        className="py-24 relative isolate"
        initial="hidden"
        animate={formControls}
        variants={fadeInUp}
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
        aria-labelledby="form-heading"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 z-[-1] pointer-events-none">
          <div className="absolute -left-[20%] top-[15%] w-[40%] h-[50%] rounded-full bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent blur-3xl opacity-60 parallax-bg" data-speed="0.2"></div>
          <div className="absolute -right-[10%] bottom-[5%] w-[35%] h-[40%] rounded-full bg-gradient-to-tl from-rashmi-red/10 via-rashmi-red/5 to-transparent blur-3xl opacity-50 parallax-bg" data-speed="-0.1"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <AnimatePresence mode="wait" initial={false}>
            {isSubmitted ? (
              // --- Enhanced Success State ---
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-2xl mx-auto text-center p-10 md:p-16 bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-green-950/30 dark:via-neutral-900 dark:to-green-950/30 rounded-3xl border border-green-300/50 dark:border-green-700/30 shadow-2xl shadow-green-200/30 dark:shadow-green-900/30 relative overflow-hidden"
              >
                 {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    {/* Example: Dashed lines pattern */}
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="dashed-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 0 10 L 10 10 M 10 0 L 10 10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dashed-pattern)" className="text-green-500 dark:text-green-400"/>
                    </svg>
                </div>

                 {/* Animated Checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30"
                >
                  <Check className="w-10 h-10 text-white stroke-[3]" />
                </motion.div>

                {/* Success Message */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-bold mb-4 text-emerald-800 dark:text-emerald-200 tracking-tight"
                >
                  Profile Submitted Successfully!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="text-muted-foreground dark:text-neutral-300 mb-10 leading-relaxed text-lg"
                >
                  Thank you for your interest! We've received your company profile and our procurement team will review your details. If your profile meets our requirements, we'll contact you to proceed with the formal vendor registration process.
                </motion.p>

                {/* Button to Reset */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Button
                     variant="outline"
                     size="lg"
                     onClick={() => setIsSubmitted(false)}
                     className="rounded-full px-8 py-3 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 hover:border-emerald-400 dark:hover:border-emerald-600 focus:ring-emerald-500/30 transition-all duration-300 group flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-ccw opacity-70 group-hover:rotate-[-90deg] transition-transform"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
                    Submit Another Profile
                  </Button>
                </motion.div>

                {/* Confetti (Kept simple CSS version for performance) */}
                <div className="success-confetti">
                  {[...Array(25)].map((_, i) => ( <div key={i} className={`confetti-item confetti-item-${i % 5}`}></div> ))}
                </div>
              </motion.div>
            ) : (
              // --- Form and Video Grid ---
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                {/* Video Column - Replace regular video with optimized version */}
                <div
                  className="lg:order-1 lg:sticky lg:top-24 flex flex-col items-center"
                >
                  {/* Single container for both video and text */}
                  <div className="flex flex-col items-center bg-background/90 dark:bg-neutral-900/90 rounded-2xl p-4 border border-border/10 w-full max-w-sm mx-auto">
                    {/* Video container */}
                    <div className="aspect-[9/16] w-full rounded-xl overflow-hidden shadow-xl mb-6">
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        aria-label="Business partnership and vendor registration process visualization"
                        poster="https://res.cloudinary.com/dada5hjp3/image/upload/v1744700600/vendor-registration-poster.jpg"
                        preload="metadata"
                      >
                        <source
                          src="https://res.cloudinary.com/dada5hjp3/video/upload/v1744700600/0_Business_Agreement_1080x1920_tzq7hk.mp4"
                          type="video/mp4"
                        />
                        <track
                          kind="descriptions"
                          src="/lovable-uploads/captions/vendor-registration-desc.vtt"
                          label="English descriptions"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    {/* Text container */}
                    <div className="text-center w-full">
                      <h3 className="text-2xl font-semibold text-foreground mb-2">Why Submit Your Profile?</h3>
                      <p className="text-muted-foreground">
                        Sharing your profile is the first step to potential business opportunities with <Link to="/" className="text-rashmi-red hover:underline">Rashmi Metaliks</Link>, the world's 2nd largest DI pipe manufacturer. Our procurement team reviews each submission to match vendors with our needs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Column - Optimize for accessible forms and SEO */}
                <motion.div
                  key="form"
                  className="lg:order-2" // Form on right on large screens
                  initial={{ opacity: 0, x: 30 }} // Keep animation for form column itself
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <Card className="w-full overflow-hidden shadow-xl dark:shadow-blue-950/10 border border-border/40 dark:border-neutral-800/60 rounded-2xl bg-card/80 dark:bg-neutral-900/80 backdrop-blur-lg">
                    {/* Gradient Top Border */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rashmi-red/80 via-blue-500/70 to-rashmi-red/80" aria-hidden="true"></div>
                    <CardHeader className="bg-muted/30 dark:bg-neutral-800/30 border-b border-border/30 dark:border-neutral-800/50 p-8">
                      <CardTitle id="form-heading" className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">Submit your vendor profile</CardTitle>
                      <CardDescription className="text-base text-muted-foreground/90 mt-1">
                        Share your details to initiate the review process. Fields marked <span className="text-rashmi-red font-medium">*</span> are required.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 md:p-10">
                      <form
                        className="space-y-12"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmit(onSubmit)(e);
                        }}
                        noValidate
                      >
                        {/* Contact Person Details */}
                        <div className="space-y-6">
                          <SectionHeader icon={User} title="Contact Person Details" description="Primary contact for communication" />
                          <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                            <FormField label="Full Name" required id="name" error={errors.name?.message}>
                              <Input
                                id="name"
                                placeholder="e.g., John Smith"
                                className="bg-background/70"
                                {...register("name", { required: "Full name is required" })}
                                aria-invalid={errors.name ? "true" : "false"}
                              />
                            </FormField>
                            <FormField label="Designation" required id="designation" error={errors.designation?.message}>
                              <Input
                                id="designation"
                                placeholder="e.g., Procurement Manager"
                                className="bg-background/70"
                                {...register("designation", { required: "Designation is required" })}
                                aria-invalid={errors.designation ? "true" : "false"}
                              />
                            </FormField>
                          </div>
                        </div>

                        {/* Company Information */}
                        <div className="space-y-6">
                          <SectionHeader icon={Building} title="Company Information" description="Details about your organization" />
                          <FormField label="Company/Firm Name" required id="companyName" error={errors.companyName?.message}>
                            <Input
                              id="companyName"
                              placeholder="Your company's registered name"
                              className="bg-background/70"
                              {...register("companyName", { required: "Company name is required" })}
                              aria-invalid={errors.companyName ? "true" : "false"}
                            />
                          </FormField>

                          {/* GST Number - only for domestic vendors */}
                          {watch('vendorType') === 'domestic' && (
                            <FormField label="GST Number (Optional)" id="gstNumber" error={errors.gstNumber?.message}>
                              <div className="relative">
                                <Input
                                  id="gstNumber"
                                  placeholder="e.g., 22AAAAA0000A1Z5"
                                  className="bg-background/70 uppercase"
                                  {...register("gstNumber", {
                                    pattern: {
                                      value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                                      message: "Please enter a valid GST Number format (e.g., 22AAAAA0000A1Z5)"
                                    }
                                  })}
                                  aria-invalid={errors.gstNumber ? "true" : "false"}
                                  maxLength={15}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-background/90 px-1 rounded">
                                  15 characters
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Adding your GST number helps expedite the vendor verification process
                              </p>
                            </FormField>
                          )}

                          <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                            <FormField label="Type of Firm" required id="firmType" error={errors.firmType?.message}>
                              <Controller
                                name="firmType"
                                control={control}
                                rules={{ required: "Please select a firm type" }}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <SelectTrigger
                                      id="firmType"
                                      aria-invalid={errors.firmType ? "true" : "false"}
                                      className="bg-background/70"
                                    >
                                      <SelectValue placeholder="Select firm type..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {firmTypes.map(type => (
                                        <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </FormField>
                            <FormField label="Company Website" id="website" error={errors.website?.message}>
                              <Input
                                id="website"
                                type="url"
                                placeholder="https://example.com"
                                className="bg-background/70"
                                {...register("website")}
                                aria-invalid={errors.website ? "true" : "false"}
                              />
                            </FormField>
                          </div>

                          {/* Vendor Type and Country */}
                          <div className="space-y-5">
                            <FormField
                              label="Vendor Type"
                              required
                              id="vendorType"
                              error={errors.vendorType?.message}
                              className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4 bg-muted/30"
                            >
                              <div className="space-y-0.5">
                                <Label className="text-base">
                                  {watch('vendorType') === 'domestic' ? 'Domestic Vendor' : 'Global Vendor'}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {watch('vendorType') === 'domestic'
                                    ? 'For vendors based in India'
                                    : 'For international vendors outside India'}
                                </p>
                              </div>
                              <Controller
                                name="vendorType"
                                control={control}
                                rules={{ required: "Vendor type is required" }}
                                render={({ field }) => (
                                  <Switch
                                    checked={field.value === 'global'}
                                    onCheckedChange={(checked) => {
                                      const newValue = checked ? 'global' : 'domestic';
                                      field.onChange(newValue);

                                      if (newValue === 'domestic') {
                                        setValue('country', 'in');
                                        setValue('contactNo', '+91 ');
                                      } else {
                                        const usCountry = sortableCountries.find(c => c.code === 'us');
                                        if (usCountry) {
                                          setValue('country', usCountry.code);
                                        }
                                        setValue('contactNo', '');
                                      }
                                    }}
                                    className="data-[state=checked]:bg-blue-600"
                                  />
                                )}
                              />
                            </FormField>

                            <FormField
                              label="Country"
                              required
                              id="country"
                              error={errors.country?.message}
                            >
                              <Controller
                                name="country"
                                control={control}
                                rules={{ required: "Country is required" }}
                                render={({ field }) => (
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                    disabled={watch('vendorType') === 'domestic'}
                                  >
                                    <SelectTrigger
                                      id="country"
                                      aria-invalid={errors.country ? "true" : "false"}
                                      className={cn(
                                        "bg-background/70",
                                        watch('vendorType') === 'domestic' && "opacity-80"
                                      )}
                                    >
                                      <SelectValue placeholder="Select country..." />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-80">
                                      {countries.map(country => (
                                        <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                              {watch('country') === 'others' && (
                                <div className="mt-3 flex flex-col gap-2">
                                  <Input
                                    placeholder="Enter your country name"
                                    value={customCountry}
                                    onChange={e => setCustomCountry(e.target.value)}
                                    className="bg-background/70"
                                  />
                                  <Input
                                    placeholder="Enter country code (e.g. +975)"
                                    value={customCountryCode}
                                    onChange={e => setCustomCountryCode(e.target.value)}
                                    className="bg-background/70"
                                  />
                                </div>
                              )}
                            </FormField>
                          </div>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-6">
                          <SectionHeader icon={Phone} title="Contact Details" description="How we can reach you" />
                          <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                            <FormField label="Contact Number" required id="contactNo" error={errors.contactNo?.message}>
                              <Input
                                id="contactNo"
                                type="tel"
                                placeholder={contactPlaceholder}
                                className="bg-background/70"
                                {...register("contactNo", { required: "Contact number is required" })}
                                aria-invalid={errors.contactNo ? "true" : "false"}
                              />
                            </FormField>
                            <FormField label="Email Address" required id="email" error={errors.email?.message}>
                              <Input
                                id="email"
                                type="email"
                                placeholder="contact@yourcompany.com"
                                className="bg-background/70"
                                {...register("email", {
                                  required: "Email is required",
                                  pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address format"
                                  }
                                })}
                                aria-invalid={errors.email ? "true" : "false"}
                              />
                            </FormField>
                          </div>
                        </div>

                        {/* Product/Service Information */}
                        <div className="space-y-6">
                          <SectionHeader icon={Briefcase} title="Product/Service Information" description="Details about what you offer" />
                          <FormField label="Primary Category" required id="category" error={errors.category?.message}>
                            <Controller
                              name="category"
                              control={control}
                              rules={{ required: "Please select a category" }}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                  <SelectTrigger
                                    id="category"
                                    aria-invalid={errors.category ? "true" : "false"}
                                    className="bg-background/70"
                                  >
                                    <SelectValue placeholder="Select primary category..." />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-80">
                                    {categories.map(cat => (
                                      <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </FormField>
                          <FormField label="Product/Service Description" required id="productDescription" error={errors.productDescription?.message}>
                            <Textarea
                              id="productDescription"
                              rows={4}
                              placeholder="Describe your core offerings, key features, and capabilities."
                              className="bg-background/70 resize-y"
                              {...register("productDescription", {
                                required: "Description is required",
                                minLength: { value: 20, message: "Please provide a more detailed description (min 20 chars)." }
                              })}
                              aria-invalid={errors.productDescription ? "true" : "false"}
                            />
                          </FormField>
                          <FormField label="Major Clients or Projects (Optional)" id="majorClients">
                            <Textarea
                              id="majorClients"
                              rows={3}
                              placeholder="List key clients, projects, or industries you serve."
                              className="bg-background/70 resize-y"
                              {...register("majorClients")}
                            />
                          </FormField>

                          {/* Turnover Section */}
                          <div className="mt-6">
                            <FormField label="Last Year Turnover" required id="turnover" error={errors.turnover?.message}>
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <Input
                                    id="turnover"
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    placeholder="Enter turnover value"
                                    className="bg-background/70"
                                    {...register("turnover", { required: "Turnover value is required" })}
                                    aria-invalid={errors.turnover ? "true" : "false"}
                                  />
                                </div>
                                <div className="w-40">
                                  <Controller
                                    name="turnoverCurrency"
                                    control={control}
                                    rules={{ required: "Currency is required" }}
                                    render={({ field }) => (
                                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <SelectTrigger id="turnoverCurrency" className="bg-background/70">
                                          <SelectValue placeholder="Currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="INR">Rs (in Cr)</SelectItem>
                                          <SelectItem value="USD">USD (in Million)</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    )}
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {watch('turnoverCurrency') === 'INR'
                                  ? 'Enter value in Crores (e.g., 10.5 for ₹10.5 Crores)'
                                  : 'Enter value in Millions (e.g., 2.5 for $2.5 Million)'}
                              </p>
                            </FormField>
                          </div>
                        </div>

                        {/* File Upload */}
                        <div className="space-y-3 pt-4">
                          <Label htmlFor="file-upload" className="flex items-center text-lg font-semibold text-foreground tracking-tight">
                            <Upload className="mr-2 h-5 w-5 text-rashmi-red" />
                            Supporting Documents (Optional)
                          </Label>
                          <p className="text-sm text-muted-foreground/90 mb-3">
                            Upload up to 3 files: company profile, brochures, certifications, etc. in PDF or Word format only (Max {MAX_FILE_SIZE_MB}MB each)
                          </p>

                          {/* File Counter */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">
                              {files.length > 0 ? `${files.length} of 3 files selected` : 'No files selected'}
                            </span>
                            {files.length > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => clearAllFiles()}
                                className="text-sm text-muted-foreground hover:text-destructive"
                                disabled={isSubmitting}
                              >
                                Clear all
                              </Button>
                            )}
                          </div>

                          {/* File Drop Area */}
                          <div
                            className={cn(
                              "relative flex flex-col items-center justify-center w-full min-h-[12rem] border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ease-in-out group",
                              isDragging ? "border-rashmi-red bg-rashmi-red/10 scale-[1.02] shadow-lg" : "border-border/60 hover:border-rashmi-red/50 hover:bg-muted/30 bg-muted/20",
                              fileErrors.length > 0 ? "border-destructive bg-destructive/10" : "",
                              files.length > 0 || isSubmitting ? "border-solid" : ""
                            )}
                            onDrop={handleFileDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => files.length < 3 && document.getElementById('file-upload')?.click()}
                          >
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              multiple
                              className="sr-only"
                              onChange={handleFileChange}
                              accept={ALLOWED_FILE_TYPES.join(',')}
                              disabled={files.length >= 3 || isSubmitting}
                            />

                            {files.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-4">
                                {files.map((file, index) => (
                                  <div
                                    key={index}
                                    className="relative flex flex-col items-center p-3 bg-card/90 backdrop-blur-sm rounded-lg border border-border/30"
                                  >
                                    {/* File Icon */}
                                    <div className="mb-2 relative w-full h-24 flex items-center justify-center">
                                      <FileText className="h-10 w-10 text-rashmi-red/80" />
                                    </div>

                                    {/* File Name and Size */}
                                    <div className="text-center w-full">
                                      <p className="text-xs font-medium text-foreground truncate max-w-full px-1">
                                        {fileNames[index]}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>

                                    {/* Remove Button */}
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => clearFile(index, e)}
                                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-card/90 border border-border/50 hover:bg-destructive/10 hover:text-destructive"
                                      disabled={isSubmitting}
                                    >
                                      <X size={12} />
                                    </Button>
                                  </div>
                                ))}

                                {/* Add More Placeholder */}
                                {files.length < 3 && (
                                  <div
                                    className="flex flex-col items-center justify-center p-3 bg-muted/30 backdrop-blur-sm rounded-lg border border-dashed border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                  >
                                    <Plus className="h-10 w-10 text-muted-foreground/50 mb-2" />
                                    <p className="text-xs text-muted-foreground">Add file</p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center p-6 flex flex-col items-center justify-center">
                                <Upload className={cn("h-14 w-14 mb-4 transition-colors", isDragging ? "text-rashmi-red" : "text-muted-foreground/60")} />
                                <p className="font-semibold text-lg text-foreground">
                                  {isDragging ? "Drop files here!" : <> <span className="text-rashmi-red">Click to upload</span> or drag & drop</>}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1.5">
                                  PDF or Word documents only (up to 3 files)
                                </p>
                              </div>
                            )}

                            {/* Upload Progress Overlay */}
                            {isSubmitting && uploadProgress > 0 && (
                              <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center rounded-xl p-4">
                                <div className="w-full max-w-xs text-center">
                                  <Loader2 className="h-8 w-8 text-rashmi-red animate-spin mx-auto mb-3" />
                                  <p className="text-sm font-medium text-foreground mb-2">Uploading...</p>
                                  <Progress value={uploadProgress} className="h-2" />
                                  <p className="text-xs text-muted-foreground mt-1">{uploadProgress}%</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Error Messages */}
                          {fileErrors.length > 0 && (
                            <div className="mt-2">
                              {fileErrors.map((error, index) => (
                                <p key={index} className="text-sm text-destructive flex items-center gap-1 mb-1">
                                  <AlertCircle size={14} /> {error}
                                </p>
                              ))}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setFileErrors([])}
                                className="text-xs text-muted-foreground mt-1 hover:text-foreground p-0 h-auto"
                              >
                                Clear errors
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Terms and Submit */}
                        <div className="pt-6 space-y-8">
                          {/* Terms Checkbox */}
                          <div className="flex items-start space-x-3 rounded-lg border border-border/50 p-4 bg-muted/20">
                            <Controller
                              name="terms"
                              control={control}
                              rules={{ required: "You must agree to the terms and conditions" }}
                              render={({ field }) => (
                                <Checkbox
                                  id="terms"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  aria-invalid={errors.terms ? "true" : "false"}
                                  className={cn(
                                    "mt-0.5 data-[state=checked]:bg-rashmi-red data-[state=checked]:border-rashmi-red border-muted-foreground/50",
                                    errors.terms ? "border-destructive" : ""
                                  )}
                                />
                              )}
                            />
                            <div className="grid gap-1.5 leading-none flex-1">
                              <Label htmlFor="terms" className="text-sm font-medium text-foreground/90 cursor-pointer">
                                I confirm all information is accurate and consent to having my profile reviewed for potential vendor registration.
                                <span className="text-destructive">*</span>
                              </Label>
                              {errors.terms && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={13} /> {errors.terms.message}</p>}
                            </div>
                          </div>

                          {/* Submit Button */}
                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-rashmi-red to-red-700 hover:from-rashmi-red/90 hover:to-red-700/90 text-white py-6 text-lg font-semibold rounded-xl"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center">
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing Submission...
                              </span>
                            ) : (
                              <span className="flex items-center">
                                Submit Profile
                                <Check className="ml-2 h-5 w-5" />
                              </span>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <section
        className="py-24 relative bg-gradient-to-b from-blue-50/20 to-background dark:from-blue-950/20 dark:to-neutral-950 overflow-hidden"
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
        aria-labelledby="benefits-heading"
      >
        {/* Background elements */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
          <div className="absolute -right-[5%] top-[10%] w-1/3 h-1/2 bg-rashmi-red/5 dark:bg-rashmi-red/10 rounded-full blur-3xl opacity-50 parallax-bg" data-speed="0.1"></div>
          <div className="absolute -left-[10%] bottom-[5%] w-1/2 h-1/2 bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-3xl opacity-40 parallax-bg" data-speed="-0.15"></div>
          {/* Grid Pattern */}
          <svg className="absolute inset-0 h-full w-full stroke-gray-300/20 dark:stroke-neutral-700/20 [mask-image:radial-gradient(100%_100%_at_center_center,white,transparent)]" aria-hidden="true">
            <defs>
              <pattern id="benefits-pattern" width="60" height="60" x="50%" y="-1" patternUnits="userSpaceOnUse">
                <path d="M.5 60 V.5 H60" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth="0" fill="url(#benefits-pattern)"/>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-3">
              <span className="inline-block bg-rashmi-red/10 text-rashmi-red px-3 py-1 rounded-full text-sm font-medium tracking-wide">
                Review Process
              </span>
            </motion.div>
            <motion.h2
              id="benefits-heading"
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-foreground"
            >
              Why Submit Your Profile?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground/90 dark:text-neutral-300 leading-relaxed">
              Your profile submission is the first step towards becoming a registered vendor with <Link to="/" className="text-rashmi-red hover:underline">Rashmi Metaliks</Link>, the world's 2nd largest <Link to="/di-pipes" className="text-rashmi-red hover:underline">DI pipe manufacturer</Link>. Our procurement team carefully reviews each submission to ensure alignment with our quality standards and business needs.
            </motion.p>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Expand Your Reach",
                description: "Access new markets and large-scale projects through our extensive network and ongoing tenders for ductile iron pipes and infrastructure projects.",
                icon: TrendingUp,
                color: "from-blue-500/10 to-blue-600/5 dark:from-blue-800/20 dark:to-blue-900/10",
                ariaLabel: "Expand market reach with Rashmi Metaliks"
              },
              {
                title: "Streamlined Procurement",
                description: "Experience efficient digital processes, clear communication, and a dedicated vendor portal with our world-class procurement team.",
                icon: CheckCircle,
                color: "from-rashmi-red/10 to-red-600/5 dark:from-rashmi-red/20 dark:to-red-900/10",
                ariaLabel: "Streamlined procurement processes"
              },
              {
                title: "Reliable & Timely Payments",
                description: "Benefit from structured payment cycles and financial predictability with Rashmi Metaliks, fostering a stable partnership for long-term growth.",
                icon: ShieldCheck,
                color: "from-emerald-500/10 to-green-600/5 dark:from-emerald-800/20 dark:to-green-900/10",
                ariaLabel: "Reliable payment structure for vendors"
              },
              {
                title: "Long-Term Growth",
                description: "Become a preferred partner and scale your business alongside our expanding operations and projects in the steel and iron industry.",
                icon: Award,
                color: "from-amber-500/10 to-yellow-600/5 dark:from-amber-800/20 dark:to-yellow-900/10",
                ariaLabel: "Growth opportunities for vendors"
              },
              {
                title: "Innovation Synergy",
                description: "Collaborate on new steel and iron solutions, gain early access to requirements, and contribute to DI pipe and infrastructure advancements.",
                icon: Upload,
                color: "from-indigo-500/10 to-purple-600/5 dark:from-indigo-800/20 dark:to-purple-900/10",
                ariaLabel: "Innovation and collaboration with vendors"
              },
              {
                title: "Sustainable Partnership",
                description: "Align with our commitment to responsible sourcing, ethical practices, and environmental stewardship in the metals manufacturing industry.",
                icon: CheckCircle,
                color: "from-teal-500/10 to-cyan-600/5 dark:from-teal-800/20 dark:to-cyan-900/10",
                ariaLabel: "Sustainable business partnerships"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.2 } }}
                className="bg-card/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-border/30 dark:border-neutral-700/50 rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 group"
                aria-labelledby={`benefit-title-${index}`}
              >
                {/* Colored Gradient Blur Effect */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${benefit.color} rounded-full blur-3xl -z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-300`} aria-hidden="true"></div>

                <div className="p-6 pb-8 flex-grow relative z-10 flex flex-col">
                  {/* Enhanced Icon with Aria Label */}
                  <div
                    className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-background to-muted/60 dark:from-neutral-700 dark:to-neutral-800/50 shadow-md border border-border/20 dark:border-neutral-600/50"
                    aria-hidden="true"
                    role="img"
                    aria-label={benefit.ariaLabel}
                  >
                    <benefit.icon className="h-7 w-7 text-rashmi-red" />
                  </div>
                  {/* Text Content */}
                  <h3 id={`benefit-title-${index}`} className="text-xl font-semibold mb-2.5 text-foreground dark:text-neutral-100">{benefit.title}</h3>
                  <p className="text-muted-foreground dark:text-neutral-300 text-sm leading-relaxed flex-grow">{benefit.description}</p>
                  {/* Bottom Line - subtle */}
                  <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-rashmi-red/40 via-border/50 to-transparent" aria-hidden="true"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call-to-action to Scroll back to Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-16"
          >
            <a
              href="#registration-form"
              className="inline-flex items-center justify-center gap-2 py-3 px-7 bg-background/80 dark:bg-neutral-800/80 text-foreground border border-border/50 dark:border-neutral-700 rounded-full hover:border-rashmi-red/60 hover:text-rashmi-red dark:hover:border-rashmi-red/70 dark:hover:text-rashmi-red backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
              aria-label="Return to registration form"
            >
              Ready to Partner? Register Now
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* =========================
          Additional CSS Styles
      ========================= */}
      <style>{`
        /* Use a more modern display font if available */
        /* @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lexend:wght@600;700;800&display=swap'); */
        .font-display {
          font-family: 'Lexend', sans-serif; /* Example: Use Lexend or your brand's display font */
        }
        /* Fallback */
        :root {
          --font-display: 'Lexend', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        body {
           font-family: var(--font-sans);
        }
        h1, h2, h3, .font-display {
           font-family: var(--font-display);
        }

        /* Enhanced Shimmer Effect (moved from inline style for reuse) */
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
            /* Applied via framer-motion variants now for better control */
        }

        /* Parallax optimizations */
        .parallax-bg {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-perspective: 1000;
          -webkit-backface-visibility: hidden;
        }

        /* Enhanced Confetti Animation */
        .success-confetti {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; overflow: hidden; z-index: 20;
        }
        .confetti-item {
          position: absolute;
          width: 8px; height: 12px; /* Rectangular confetti */
          border-radius: 2px;
          opacity: 0;
          animation: confetti-fall 3.5s ease-in-out forwards;
          transform-origin: center;
        }
        @keyframes confetti-fall {
          0% {
            transform: translateY(-150px) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100% + 150px)) rotate(720deg) scale(0.5); /* Fade out and shrink */
            opacity: 0;
          }
        }
        /* Diverse Colors and Delays */
        .confetti-item-0 { left: 10%; background-color: #EF4444; /* Red */ animation-delay: 0.1s; animation-duration: 3s; }
        .confetti-item-1 { left: 25%; background-color: #3B82F6; /* Blue */ animation-delay: 0.4s; animation-duration: 3.8s; }
        .confetti-item-2 { left: 45%; background-color: #10B981; /* Emerald */ animation-delay: 0.2s; animation-duration: 3.2s; }
        .confetti-item-3 { left: 65%; background-color: #F59E0B; /* Amber */ animation-delay: 0.6s; animation-duration: 4s; }
        .confetti-item-4 { left: 85%; background-color: #8B5CF6; /* Violet */ animation-delay: 0.3s; animation-duration: 3.5s; }
        /* Add more variations for better effect */
         .confetti-item:nth-child(5n+1) { left: 15%; animation-delay: 0.5s; background-color: #EC4899; }
         .confetti-item:nth-child(5n+2) { left: 35%; animation-delay: 0.7s; background-color: #6366F1; }
         .confetti-item:nth-child(5n+3) { left: 55%; animation-delay: 0.9s; background-color: #22C55E; }
         .confetti-item:nth-child(5n+4) { left: 75%; animation-delay: 0.15s; background-color: #F97316; }
         .confetti-item:nth-child(5n+5) { left: 95%; animation-delay: 0.55s; background-color: #0EA5E9; }

        /* Smooth Scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom Scrollbar (Optional, subtle) */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background-color: hsl(var(--border) / 0.5);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: hsl(var(--border));
        }

         /* Ensure shadcn SelectContent appears above other elements */
        [data-radix-select-content] {
            z-index: 50; /* Or higher if needed */
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default VendorRegistration; 