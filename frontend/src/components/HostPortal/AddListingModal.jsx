import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Upload, Shield, Car, IndianRupee, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { CITIES } from '../Navbar';
import { useAuth } from '../../context/AuthContext';

export default function AddListingModal({ isOpen, onClose, onSubmitListing, isSubmitting }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
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
    hostPhone: user?.phone || '',

    // Step 2: India Regulatory & RTO
    registrationNumber: '',
    plateType: 'YELLOW_COMMERCIAL',
    insurancePolicyNumber: '',
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
    pincode: '',
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
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
    ],
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (cat) => {
    let defaultBrand = 'Honda';
    let defaultModel = 'Activa 6G';
    let defaultFuel = 'PETROL';
    let defaultTransmission = 'AUTOMATIC';
    let defaultHourly = 59;
    let defaultDaily = 449;
    let defaultDeposit = 500;
    let defaultSeats = 2;
    let defaultHelmets = 2;
    let defaultImg = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800';

    if (cat === 'BIKE') {
      defaultBrand = 'Royal Enfield';
      defaultModel = 'Hunter 350';
      defaultTransmission = 'MANUAL';
      defaultHourly = 110;
      defaultDaily = 899;
      defaultDeposit = 1500;
      defaultImg = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800';
    } else if (cat === 'HATCHBACK') {
      defaultBrand = 'Maruti Suzuki';
      defaultModel = 'Swift ZXi';
      defaultHourly = 140;
      defaultDaily = 1499;
      defaultDeposit = 2500;
      defaultSeats = 5;
      defaultHelmets = 0;
      defaultImg = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800';
    } else if (cat === 'SUV') {
      defaultBrand = 'Mahindra';
      defaultModel = 'Thar 4x4';
      defaultFuel = 'DIESEL';
      defaultHourly = 350;
      defaultDaily = 3499;
      defaultDeposit = 5000;
      defaultSeats = 4;
      defaultHelmets = 0;
      defaultImg = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800';
    } else if (cat === 'EV') {
      defaultBrand = 'Ather';
      defaultModel = '450X Gen 3';
      defaultFuel = 'ELECTRIC';
      defaultHourly = 79;
      defaultDaily = 599;
      defaultDeposit = 1000;
      defaultImg = 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800';
    }

    setFormData((prev) => ({
      ...prev,
      category: cat,
      brand: defaultBrand,
      modelName: defaultModel,
      title: `${defaultBrand} ${defaultModel} (${prev.year})`,
      fuelType: defaultFuel,
      transmission: defaultTransmission,
      hourlyRate: defaultHourly,
      dailyRate: defaultDaily,
      securityDeposit: defaultDeposit,
      seatingCapacity: defaultSeats,
      helmetsProvided: defaultHelmets,
      images: [defaultImg],
    }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.title) {
      setFormData((prev) => ({
        ...prev,
        title: `${prev.brand} ${prev.modelName} (${prev.year})`,
      }));
    }
    if (step === 2 && !formData.registrationNumber) {
      alert('Please enter a valid Indian Registration Number (e.g. KA-01-AB-1234)');
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalInput = {
      ...formData,
      title: formData.title || `${formData.brand} ${formData.modelName} (${formData.year})`,
      year: parseInt(formData.year),
      seatingCapacity: parseInt(formData.seatingCapacity),
      helmetsProvided: parseInt(formData.helmetsProvided),
      doorstepDeliveryFee: parseFloat(formData.doorstepDeliveryFee),
      hourlyRate: parseFloat(formData.hourlyRate),
      dailyRate: parseFloat(formData.dailyRate),
      securityDeposit: parseFloat(formData.securityDeposit),
      kmLimitPerDay: parseInt(formData.kmLimitPerDay),
      extraKmCharge: parseFloat(formData.extraKmCharge),
    };
    onSubmitListing(finalInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Step {step} of 5
              </span>
              <span className="text-xs text-slate-400">• MoRTH India Compliant Wizard</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">List Your Vehicle for Rent</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 h-1 bg-slate-800">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-full transition-all duration-300 ${
                i <= step ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-transparent'
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
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
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
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Brand / Make</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Honda, Ather, Royal Enfield"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Model Name</label>
                  <input
                    type="text"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Activa 6G, 450X, Hunter 350"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Manufacturing Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    min="2016"
                    max="2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Fuel Type</label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PETROL">Petrol</option>
                    <option value="ELECTRIC">Electric (EV)</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Transmission</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="AUTOMATIC">Automatic</option>
                    <option value="MANUAL">Manual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Owner Name</label>
                  <input
                    type="text"
                    name="hostName"
                    value={formData.hostName}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Owner Phone (WhatsApp / UPI)</label>
                  <input
                    type="text"
                    name="hostPhone"
                    value={formData.hostPhone}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: India Statutory & RTO Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Under Indian Motor Vehicles Act rules, your vehicle RC and insurance will be verified before making the listing live to renters.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Registration Number (RC) *
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="e.g. KA-01-MJ-4321, DL-01-AB-1234"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white uppercase font-mono tracking-wider focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Cross-checked with Parivahan Vahan registry</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Number Plate / Legal Mode
                  </label>
                  <select
                    name="plateType"
                    value={formData.plateType}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="YELLOW_COMMERCIAL">Commercial Yellow Plate (MoRTH Self-Drive)</option>
                    <option value="BLACK_YELLOW_RENTAL">Black-Yellow Plate (Rent-a-Cab/Motorcycle Scheme)</option>
                    <option value="PRIVATE_P2P_LEASE">Private Plate (P2P Bailment Lease Agreement)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Insurance Policy No.</label>
                  <input
                    type="text"
                    name="insurancePolicyNumber"
                    value={formData.insurancePolicyNumber}
                    onChange={handleChange}
                    placeholder="e.g. HDFC-2024-88910"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Insurer Name</label>
                  <input
                    type="text"
                    name="insuranceCompany"
                    value={formData.insuranceCompany}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Insurance Valid Until</label>
                  <input
                    type="date"
                    name="insuranceExpiry"
                    value={formData.insuranceExpiry}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">PUC Certificate Expiry Date</label>
                  <input
                    type="date"
                    name="pucExpiry"
                    value={formData.pucExpiry}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">CMVR mandatory (Exempt for EVs)</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">FASTag ID / Barcode (Cars)</label>
                  <input
                    type="text"
                    name="fastagId"
                    value={formData.fastagId}
                    onChange={handleChange}
                    placeholder="e.g. NPCI-FASTAG-9912-3344"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Two-Wheeler / Four-Wheeler Specific Checks */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                {['SCOOTY', 'BIKE'].includes(formData.category) ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">ISI Helmets Provided (BIS 4151)</p>
                      <p className="text-slate-400 text-[11px]">Mandatory for rider and pillion under MV Act</p>
                    </div>
                    <select
                      name="helmetsProvided"
                      value={formData.helmetsProvided}
                      onChange={handleChange}
                      className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs"
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
                      className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                    />
                    <span className="text-slate-300">
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
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                  />
                  <span className="text-slate-300">
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
                  <label className="block text-xs font-medium text-slate-400 mb-1">City Hub *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CITIES.filter((c) => c !== 'All Cities').map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Area / Landmark Hub *</label>
                  <input
                    type="text"
                    name="areaHub"
                    value={formData.areaHub}
                    onChange={handleChange}
                    placeholder="e.g. Indiranagar Metro, Calangute Beach, Cyber Hub"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Exact Pickup Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street / Building name where vehicle will be parked"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="doorstepDeliveryAvailable"
                    checked={formData.doorstepDeliveryAvailable}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs font-bold text-white">
                    Offer Doorstep Delivery to Renters (Airport / Hotel / Home)
                  </span>
                </label>

                {formData.doorstepDeliveryAvailable && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Doorstep Delivery Charge (₹)</label>
                    <input
                      type="number"
                      name="doorstepDeliveryFee"
                      value={formData.doorstepDeliveryFee}
                      onChange={handleChange}
                      className="w-36 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
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
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Daily Rate (₹/day) *
                  </label>
                  <input
                    type="number"
                    name="dailyRate"
                    value={formData.dailyRate}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Hourly Rate (₹/hr) *
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Refundable Deposit (₹) *
                  </label>
                  <input
                    type="number"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Free KM Allowance Per Day
                  </label>
                  <input
                    type="number"
                    name="kmLimitPerDay"
                    value={formData.kmLimitPerDay}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">e.g. 150 km/day (Enter 0 for Unlimited)</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Extra KM Charge (₹/km)
                  </label>
                  <input
                    type="number"
                    name="extraKmCharge"
                    value={formData.extraKmCharge}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Fuel / Charge Policy</label>
                <select
                  name="fuelPolicy"
                  value={formData.fuelPolicy}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
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
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Vehicle Image URL
                </label>
                <input
                  type="text"
                  value={formData.images[0] || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, images: [e.target.value] }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 mb-3"
                  placeholder="Paste vehicle image URL"
                />
                <div className="h-44 w-full rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative">
                  <img
                    src={formData.images[0]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-[11px] text-white font-mono">
                    {formData.registrationNumber || 'KA-XX-XX-XXXX'}
                  </div>
                </div>
              </div>

              {/* Review Summary */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="font-bold text-white">
                    {formData.brand} {formData.modelName} ({formData.year})
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{formData.registrationNumber}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Location:</span>
                  <span className="text-white">
                    {formData.areaHub}, {formData.city}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Pricing:</span>
                  <span className="text-white font-bold">
                    ₹{formData.dailyRate}/day • ₹{formData.hourlyRate}/hr (Deposit: ₹{formData.securityDeposit})
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Plate / Compliance:</span>
                  <span className="text-amber-300">{formData.plateType}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 text-xs font-extrabold flex items-center space-x-1.5 transition cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
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
