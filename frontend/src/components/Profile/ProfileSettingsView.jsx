import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Lock,
  KeyRound,
  Check,
  AlertCircle,
  Sparkles,
  Camera,
  FileCheck,
  Calendar,
  UploadCloud,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CITIES } from '../Navbar';

export default function ProfileSettingsView() {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('profile'); // 'profile' | 'security'

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'Bengaluru');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [dlNumber, setDlNumber] = useState(user?.dlNumber || '');
  const [dlCategory, setDlCategory] = useState(user?.dlCategory || 'MCWG_LMV');
  const [aadhaarMasked, setAadhaarMasked] = useState(user?.aadhaarMasked || '');

  // Password Change Form States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status Feedback States
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [profileError, setProfileError] = useState(null);

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const avatarInputRef = useRef(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setProfileError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setProfileError('Avatar photo exceeds the 10MB size limit.');
      return;
    }
    setIsUploadingAvatar(true);
    setProfileError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload server error');
      const data = await res.json();
      if (data.url) {
        setAvatarUrl(data.url);
      }
    } catch (err) {
      console.warn('Backend upload fallback to base64:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileMessage(null);
    setProfileSaving(true);

    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        avatarUrl: avatarUrl.trim(),
        dlNumber: dlNumber.trim().toUpperCase(),
        dlCategory: dlCategory.trim(),
        aadhaarMasked: aadhaarMasked.trim(),
      });
      setProfileMessage('Profile details updated successfully!');
      setTimeout(() => setProfileMessage(null), 4000);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile details.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (!oldPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setPasswordSaving(true);

    try {
      await changePassword(oldPassword, newPassword);
      setPasswordMessage('Password changed successfully! Keep your new password secure.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(null), 5000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password. Please check your current password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Profile Summary Strip */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={
                avatarUrl ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'User')}`
              }
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover bg-muted border-2 border-primary/20 shadow-glow"
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-foreground font-display">{user?.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent text-accent-foreground border border-primary/20 uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-2">
              <span>{user?.email}</span>
              <span>•</span>
              <span>{user?.phone || 'No phone set'}</span>
              <span>•</span>
              <span>{user?.city || 'Bengaluru'}</span>
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-muted p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'profile'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveSubTab('security')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'security'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Password & Security
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: PROFILE DETAILS */}
      {activeSubTab === 'profile' && (
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card">
          <div className="mb-6 pb-4 border-b border-border">
            <h3 className="text-lg font-bold text-foreground font-display">Personal & Statutory Profile</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your contact info and MoRTH-compliant driving credentials.
            </p>
          </div>

          {profileError && (
            <div className="mb-5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          {profileMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{profileMessage}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Legal Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground shadow-xs font-medium"
                  />
                </div>
              </div>

              {/* Email (Readonly) */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Email Address (Primary Account Key)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-input bg-muted/60 text-muted-foreground cursor-not-allowed shadow-xs"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Mobile Number (WhatsApp & UPI Payouts)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground shadow-xs font-medium"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Operating Hub City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground shadow-xs font-medium cursor-pointer"
                  >
                    {CITIES.filter((c) => c !== 'All Cities').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Avatar Photo & URL */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                Profile Photo / Avatar
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Avatar Preview */}
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/20 bg-muted shrink-0 shadow-xs">
                  <img
                    src={
                      avatarUrl ||
                      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.email || 'vahaan')}`
                    }
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    </div>
                  )}
                </div>

                {/* Upload Button & URL field */}
                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFile}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploadingAvatar}
                      onClick={() => avatarInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold border border-border flex items-center space-x-1.5 cursor-pointer transition shadow-xs disabled:opacity-60"
                    >
                      {isUploadingAvatar ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5 text-primary" />
                          <span>Upload from Device</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-muted-foreground">or edit image URL below:</span>
                  </div>

                  <div className="relative">
                    <Camera className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... or /uploads/..."
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground shadow-xs font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Statutory DigiLocker & DL Section */}
            <div className="pt-5 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    DigiLocker & Parivahan Driving License
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  MoRTH Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Driving License (DL) Number
                  </label>
                  <input
                    type="text"
                    value={dlNumber}
                    onChange={(e) => setDlNumber(e.target.value)}
                    placeholder="e.g. KA0420210087462"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-card font-mono text-foreground uppercase shadow-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    DL Authorized Category
                  </label>
                  <select
                    value={dlCategory}
                    onChange={(e) => setDlCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-card text-foreground shadow-xs font-medium cursor-pointer"
                  >
                    <option value="MCWG_LMV">MCWG + LMV (Bikes & Cars)</option>
                    <option value="MCWOG">MCWOG (Gearless Scooters)</option>
                    <option value="MCWG">MCWG (Motorcycles with Gear)</option>
                    <option value="LMV">LMV (Light Motor Vehicle - Cars)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Masked Aadhaar (eKYC)
                  </label>
                  <input
                    type="text"
                    value={aadhaarMasked}
                    onChange={(e) => setAadhaarMasked(e.target.value)}
                    placeholder="XXXX-XXXX-4421"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-card font-mono text-foreground shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={profileSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-glow hover:opacity-95 transition cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{profileSaving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 2: SECURITY & PASSWORD CHANGE */}
      {activeSubTab === 'security' && (
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card max-w-xl mx-auto">
          <div className="mb-6 pb-4 border-b border-border">
            <h3 className="text-lg font-bold text-foreground font-display">Change Your Password</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ensure your account uses a strong password with at least 6 characters.
            </p>
          </div>

          {passwordError && (
            <div className="mb-5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{passwordMessage}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground shadow-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-glow hover:opacity-95 transition cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-1.5"
            >
              <Lock className="w-4 h-4" />
              <span>{passwordSaving ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
