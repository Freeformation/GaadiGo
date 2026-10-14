import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Plus,
  Image as ImageIcon,
  UploadCloud,
  Camera,
  Trash2,
  Star,
  CheckCircle2,
  Loader2,
  Link as LinkIcon,
} from 'lucide-react';
import { CITIES } from '../Navbar';
import { useAuth } from '../../context/AuthContext';

const CATEGORY_DEFAULTS = {
  SCOOTY: {
    brand: 'Honda',
    modelName: 'Activa 6G',
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC',
    hourlyRate: 59,
    dailyRate: 449,
    securityDeposit: 500,
    seatingCapacity: 2,
    helmetsProvided: 2,
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&auto=format&fit=crop&q=80',
    ],
  },
  BIKE: {
    brand: 'Royal Enfield',
    modelName: 'Hunter 350',
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    hourlyRate: 110,
    dailyRate: 899,
    securityDeposit: 1500,
    seatingCapacity: 2,
    helmetsProvided: 2,
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
    ],
  },
  HATCHBACK: {
    brand: 'Maruti Suzuki',
    modelName: 'Swift ZXi',
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC',
    hourlyRate: 140,
    dailyRate: 1499,
    securityDeposit: 2500,
    seatingCapacity: 5,
    helmetsProvided: 0,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    ],
  },
  SUV: {
    brand: 'Mahindra',
    modelName: 'Thar 4x4',
    fuelType: 'DIESEL',
    transmission: 'AUTOMATIC',
    hourlyRate: 350,
    dailyRate: 3499,
    securityDeposit: 5000,
    seatingCapacity: 4,
    helmetsProvided: 0,
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    ],
  },
  EV: {
    brand: 'Ather',
    modelName: '450X Gen 3',
    fuelType: 'ELECTRIC',
    transmission: 'AUTOMATIC',
    hourlyRate: 89,
    dailyRate: 649,
    securityDeposit: 1000,
    seatingCapacity: 2,
    helmetsProvided: 2,
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    ],
  },
};

export default function AddListingModal({ isOpen, onClose, onSubmitListing, isSubmitting }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    // Step 1: Basics
    title: '',
    category: 'SCOOTY',
    brand: 'Honda',
    modelName: 'Activa 6G',
    year: 2024,
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC',
    seatingCapacity: 2,
    hostName: user?.name || '',
    hostPhone: user?.phone || '+91 98450 12345',

    // Step 2: India Regulatory & RTO
    registrationNumber: '',
    plateType: 'YELLOW_COMMERCIAL',
    insurancePolicyNumber: 'HDFC-MOT-2024-88912',
    insuranceCompany: 'HDFC ERGO General Insurance',
    insuranceExpiry: '2027-12-31',
    pucExpiry: '2026-12-31',
    fastagId: '',
    speedGovernorFitted: false,
    helmetsProvided: 2,
    gpsTracked: true,

    // Step 3: Location Hub
    city: user?.city || 'Bengaluru',
    areaHub: '',
    pincode: '560038',
    address: '',
    doorstepDeliveryAvailable: true,
    doorstepDeliveryFee: 149,

    // Step 4: Pricing
    hourlyRate: 59,
    dailyRate: 449,
    securityDeposit: 500,
    kmLimitPerDay: 150,
    extraKmCharge: 4,
    fuelPolicy: 'SAME_TO_SAME',

    // Step 5: Media
    images: CATEGORY_DEFAULTS.SCOOTY.images,
  });

  // Keep host name & phone in sync with authenticated user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        hostName: prev.hostName || user.name || '',
        hostPhone: prev.hostPhone || user.phone || '+91 98450 12345',
        city: prev.city || user.city || 'Bengaluru',
      }));
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (cat) => {
    const defaults = CATEGORY_DEFAULTS[cat] || CATEGORY_DEFAULTS.SCOOTY;
    setFormData((prev) => ({
      ...prev,
      category: cat,
      brand: defaults.brand,
      modelName: defaults.modelName,
      fuelType: defaults.fuelType,
      transmission: defaults.transmission,
      hourlyRate: defaults.hourlyRate,
      dailyRate: defaults.dailyRate,
      securityDeposit: defaults.securityDeposit,
      seatingCapacity: defaults.seatingCapacity,
      helmetsProvided: defaults.helmetsProvided,
      images: [...defaults.images],
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.brand.trim() || !formData.modelName.trim()) {
        alert('Please specify the Brand and Model name.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.registrationNumber.trim()) {
        alert('Vehicle Registration Number (RC) is mandatory.');
        return;
      }
    }
    if (step === 3) {
      if (!formData.areaHub.trim()) {
        alert('Please specify your Area / Landmark Hub (e.g. Indiranagar, Calangute).');
        return;
      }
    }
    if (step === 4) {
      if (Number(formData.dailyRate) <= 0 || Number(formData.hourlyRate) <= 0) {
        alert('Please set valid daily and hourly rental rates.');
        return;
      }
    }
    setStep((s) => Math.min(5, s + 1));
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);

    const fileList = Array.from(files);
    const validFiles = fileList.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setUploadError(`File "${file.name}" is not an image.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`File "${file.name}" exceeds the 10MB limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    try {
      const uploadFormData = new FormData();
      if (validFiles.length === 1) {
        uploadFormData.append('file', validFiles[0]);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        if (!res.ok) throw new Error('Upload server error');
        const data = await res.json();
        if (data.url) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, data.url],
          }));
        }
      } else {
        validFiles.forEach((f) => uploadFormData.append('files', f));
        const res = await fetch('/api/upload/multiple', {
          method: 'POST',
          body: uploadFormData,
        });
        if (!res.ok) throw new Error('Upload server error');
        const data = await res.json();
        if (data.urls && data.urls.length > 0) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...data.urls],
          }));
        }
      }
    } catch (err) {
      console.warn('Backend upload fallback to base64 data URLs:', err);
      const readPromises = validFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });
      const dataUrls = await Promise.all(readPromises);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...dataUrls],
      }));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSetCoverPhoto = (idx) => {
    if (idx === 0) return;
    setFormData((prev) => {
      const copy = [...prev.images];
      const [chosen] = copy.splice(idx, 1);
      copy.unshift(chosen);
      return { ...prev, images: copy };
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!formData.registrationNumber.trim()) {
      alert('Vehicle Registration Number (RC) is mandatory.');
      setStep(2);
      return;
    }
    if (!formData.areaHub.trim()) {
      alert('Area / Landmark Hub is mandatory.');
      setStep(3);
      return;
    }
    const finalInput = {
      ...formData,
      hostId: user?.id || undefined,
      hostName: (formData.hostName || user?.name || 'Verified Host').trim(),
      hostPhone: (formData.hostPhone || user?.phone || '+91 98450 12345').trim(),
      registrationNumber: formData.registrationNumber.trim().toUpperCase(),
      title: formData.title || `${formData.brand} ${formData.modelName} (${formData.year})`,
      year: parseInt(formData.year) || 2024,
      seatingCapacity: parseInt(formData.seatingCapacity) || 2,
      helmetsProvided: parseInt(formData.helmetsProvided) || 0,
      doorstepDeliveryFee: parseFloat(formData.doorstepDeliveryFee) || 0,
      hourlyRate: parseFloat(formData.hourlyRate) || 99,
      dailyRate: parseFloat(formData.dailyRate) || 699,
      securityDeposit: parseFloat(formData.securityDeposit) || 1000,
      kmLimitPerDay: parseInt(formData.kmLimitPerDay) || 150,
      extraKmCharge: parseFloat(formData.extraKmCharge) || 5,
      images:
        formData.images && formData.images.filter(Boolean).length > 0
          ? formData.images.filter(Boolean)
          : CATEGORY_DEFAULTS[formData.category].images,
    };
    onSubmitListing(finalInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-foreground bg-accent px-2 py-0.5 rounded border border-primary/20">
                Step {step} of 5
              </span>
              <span className="text-xs text-muted-foreground font-medium">• MoRTH India Compliant Wizard</span>
            </div>
            <h2 className="text-xl font-bold text-foreground mt-1 font-display">List Your Vehicle for Rent</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 h-1 bg-muted">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-full transition-all duration-300 ${
                i <= step ? 'bg-gradient-primary' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: Vehicle Basics */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Select Vehicle Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'SCOOTY', label: '🛵 Scooty / Activa' },
                    { id: 'BIKE', label: '🏍️ Motorcycle' },
                    { id: 'HATCHBACK', label: '🚗 Hatchback' },
                    { id: 'SUV', label: '🚙 SUV / 4x4' },
                    { id: 'EV', label: '⚡ Electric (EV)' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                        formData.category === cat.id
                          ? 'bg-accent text-accent-foreground border-primary shadow-xs'
                          : 'bg-muted/40 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Brand / Make</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                    placeholder="e.g. Honda, Ather, Royal Enfield"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Model Name</label>
                  <input
                    type="text"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                    placeholder="e.g. Activa 6G, 450X, Hunter 350"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Manufacturing Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                    min="2016"
                    max="2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Fuel Type</label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs cursor-pointer"
                  >
                    <option value="PETROL">Petrol</option>
                    <option value="ELECTRIC">Electric (EV)</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Transmission</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs cursor-pointer"
                  >
                    <option value="AUTOMATIC">Automatic</option>
                    <option value="MANUAL">Manual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Owner Name</label>
                  <input
                    type="text"
                    name="hostName"
                    value={formData.hostName}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Owner Phone (WhatsApp / UPI)</label>
                  <input
                    type="text"
                    name="hostPhone"
                    value={formData.hostPhone}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: India Statutory & RTO Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 bg-accent/40 border border-primary/20 rounded-xl text-xs text-accent-foreground flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                <span>
                  Under Indian Motor Vehicles Act rules, your vehicle RC and insurance will be verified before making the listing live to renters.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                    Registration Number (RC) *
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="e.g. KA-01-MJ-4321, DL-01-AB-1234"
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Cross-checked with Parivahan Vahan registry</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                    Number Plate / Legal Mode
                  </label>
                  <select
                    name="plateType"
                    value={formData.plateType}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs cursor-pointer"
                  >
                    <option value="YELLOW_COMMERCIAL">Commercial Yellow Plate (MoRTH Self-Drive)</option>
                    <option value="BLACK_YELLOW_RENTAL">Black-Yellow Plate (Rent-a-Cab/Motorcycle Scheme)</option>
                    <option value="PRIVATE_P2P_LEASE">Private Plate (P2P Bailment Lease Agreement)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Insurance Policy No.</label>
                  <input
                    type="text"
                    name="insurancePolicyNumber"
                    value={formData.insurancePolicyNumber}
                    onChange={handleChange}
                    placeholder="e.g. HDFC-2024-88910"
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Insurer Name</label>
                  <input
                    type="text"
                    name="insuranceCompany"
                    value={formData.insuranceCompany}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Insurance Valid Until</label>
                  <input
                    type="date"
                    name="insuranceExpiry"
                    value={formData.insuranceExpiry}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">PUC Certificate Expiry Date</label>
                  <input
                    type="date"
                    name="pucExpiry"
                    value={formData.pucExpiry}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">CMVR mandatory (Exempt for EVs)</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">FASTag ID / Barcode (Cars)</label>
                  <input
                    type="text"
                    name="fastagId"
                    value={formData.fastagId}
                    onChange={handleChange}
                    placeholder="e.g. NPCI-FASTAG-9912-3344"
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                </div>
              </div>

              {/* Two-Wheeler / Four-Wheeler Specific Checks */}
              <div className="p-4 bg-muted/40 rounded-xl border border-border space-y-3 text-xs">
                {['SCOOTY', 'BIKE'].includes(formData.category) ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground">ISI Helmets Provided (BIS 4151)</p>
                      <p className="text-muted-foreground text-[11px]">Mandatory for rider and pillion under MV Act</p>
                    </div>
                    <select
                      name="helmetsProvided"
                      value={formData.helmetsProvided}
                      onChange={handleChange}
                      className="bg-card border border-input text-foreground rounded-lg px-2.5 py-1 text-xs focus:outline-none shadow-xs cursor-pointer"
                    >
                      <option value="1">1 Helmet</option>
                      <option value="2">2 Helmets (Recommended)</option>
                    </select>
                  </div>
                ) : (
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="speedGovernorFitted"
                      checked={formData.speedGovernorFitted}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-primary border-input focus:ring-primary"
                    />
                    <span className="text-foreground">
                      Fitted with 80 km/h commercial speed limiter (MoRTH guideline for cabs/rentals)
                    </span>
                  </label>
                )}

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="gpsTracked"
                    checked={formData.gpsTracked}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-primary border-input focus:ring-primary"
                  />
                  <span className="text-foreground">
                    Vehicle is equipped with an active GPS tracker for security
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Location Hub */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">City Hub *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs cursor-pointer"
                  >
                    {CITIES.filter((c) => c !== 'All Cities').map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Area / Landmark Hub *</label>
                  <input
                    type="text"
                    name="areaHub"
                    value={formData.areaHub}
                    onChange={handleChange}
                    placeholder="e.g. Indiranagar Metro, Calangute Beach, Cyber Hub"
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Exact Pickup Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street / Building name where vehicle will be parked"
                  className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                />
              </div>

              <div className="p-4 bg-muted/40 rounded-xl border border-border space-y-3">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="doorstepDeliveryAvailable"
                    checked={formData.doorstepDeliveryAvailable}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-primary border-input focus:ring-primary"
                  />
                  <span className="text-xs font-bold text-foreground">
                    Offer Doorstep Delivery to Renters (Airport / Hotel / Home)
                  </span>
                </label>

                {formData.doorstepDeliveryAvailable && (
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 font-semibold">Doorstep Delivery Charge (₹)</label>
                    <input
                      type="number"
                      name="doorstepDeliveryFee"
                      value={formData.doorstepDeliveryFee}
                      onChange={handleChange}
                      className="w-36 bg-card border border-input rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs font-bold"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Pricing & Security Deposit */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                    Daily Rate (₹/day) *
                  </label>
                  <input
                    type="number"
                    name="dailyRate"
                    value={formData.dailyRate}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                    Hourly Rate (₹/hr) *
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                    Refundable Deposit (₹) *
                  </label>
                  <input
                    type="number"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Free KM Allowance Per Day
                  </label>
                  <input
                    type="number"
                    name="kmLimitPerDay"
                    value={formData.kmLimitPerDay}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">e.g. 150 km/day (Enter 0 for Unlimited)</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Extra KM Charge (₹/km)
                  </label>
                  <input
                    type="number"
                    name="extraKmCharge"
                    value={formData.extraKmCharge}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Fuel / Charge Policy</label>
                <select
                  name="fuelPolicy"
                  value={formData.fuelPolicy}
                  onChange={handleChange}
                  className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs cursor-pointer"
                >
                  <option value="SAME_TO_SAME">Same-to-Same (Return with identical fuel level)</option>
                  <option value="FULL_CHARGE">100% Full Charge Provided (For EVs)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 5: Photos & Final Review */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                      Vehicle Photo Gallery ({formData.images.length} photos)
                    </label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      First photo is automatically displayed as the main listing cover card.
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        const defaults = CATEGORY_DEFAULTS[formData.category] || CATEGORY_DEFAULTS.SCOOTY;
                        setFormData((prev) => ({ ...prev, images: [...defaults.images] }));
                      }}
                      className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Reset to Presets
                    </button>
                    {formData.images.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, images: [] }))}
                        className="text-[11px] text-rose-500 hover:underline font-semibold cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* Drag & Drop Upload Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative p-5 border-2 border-dashed rounded-2xl text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 group ${
                    dragActive
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                      : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                  />

                  {isUploading ? (
                    <div className="py-4 flex flex-col items-center space-y-2">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <p className="text-xs font-bold text-foreground">Uploading and optimizing photos...</p>
                      <p className="text-[10px] text-muted-foreground">Generating high-speed previews</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          Click to browse or drag & drop vehicle photos
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Supports PNG, JPG, WebP up to 10MB each • Upload exterior, side & dashboard angles
                        </p>
                      </div>
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground group-hover:border-primary/40 shadow-xs">
                        <Camera className="w-3.5 h-3.5 text-primary" />
                        <span>Select Photos from Device</span>
                      </div>
                    </>
                  )}
                </div>

                {uploadError && (
                  <div className="mt-2 p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Thumbnails Grid */}
                {formData.images.length > 0 && (
                  <div className="mt-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative h-28 rounded-xl overflow-hidden border group bg-muted ${
                            idx === 0 ? 'border-primary ring-2 ring-primary/30 shadow-xs' : 'border-border'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Vehicle Photo ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />

                          {/* Hover Actions Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2 p-2">
                            {idx > 0 && (
                              <button
                                type="button"
                                title="Make this the Cover Photo"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetCoverPhoto(idx);
                                }}
                                className="px-2 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition shadow-xs"
                              >
                                <Star className="w-3 h-3 fill-current" />
                                <span>Make Cover</span>
                              </button>
                            )}
                            <button
                              type="button"
                              title="Delete photo"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData((prev) => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== idx),
                                }));
                              }}
                              className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition shadow-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Cover Photo Badge or Index Badge */}
                          {idx === 0 ? (
                            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-600/90 backdrop-blur-xs text-[10px] text-white font-bold flex items-center space-x-1 shadow-xs">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>Cover Photo</span>
                            </span>
                          ) : (
                            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] text-white font-medium">
                              Photo {idx + 1}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collapsible Add Image by URL */}
                <div className="mt-3 pt-1">
                  {!showUrlInput ? (
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(true)}
                      className="text-[11px] text-muted-foreground hover:text-foreground font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <LinkIcon className="w-3 h-3 text-primary" />
                      <span>Or paste an external image URL</span>
                    </button>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] text-muted-foreground font-semibold flex items-center space-x-1">
                          <LinkIcon className="w-3 h-3 text-primary" />
                          <span>Paste image URL (HTTPS)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowUrlInput(false)}
                          className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="url"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="flex-1 bg-card border border-input rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newImageUrl.trim()) {
                              setFormData((prev) => ({
                                ...prev,
                                images: [...prev.images, newImageUrl.trim()],
                              }));
                              setNewImageUrl('');
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center space-x-1 cursor-pointer transition shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Summary */}
              <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-2 text-xs">
                <div className="flex justify-between text-foreground">
                  <span className="font-bold text-foreground">
                    {formData.brand} {formData.modelName} ({formData.year})
                  </span>
                  <span className="font-mono text-emerald-600 font-bold">{formData.registrationNumber}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Location:</span>
                  <span className="text-foreground font-medium">
                    {formData.areaHub}, {formData.city}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Pricing:</span>
                  <span className="text-foreground font-bold">
                    ₹{formData.dailyRate}/day • ₹{formData.hourlyRate}/hr (Deposit: ₹{formData.securityDeposit})
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Plate / Compliance:</span>
                  <span className="text-primary font-semibold">{formData.plateType}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-border flex items-center justify-between bg-muted/20">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-glow hover:opacity-95"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-xs font-extrabold flex items-center space-x-1.5 transition cursor-pointer shadow-glow hover:opacity-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting to MongoDB...' : 'Submit Listing to Admin'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
