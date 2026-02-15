'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import LocationSelector from '@/components/forms/LocationSelector';
import { useAuth } from '@/context/AuthContext';
import { getProfile, updateProfile, resetPassword } from '@/services/profile.service';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    companyName: '', companyAddress: '', country: '', state: '', city: '', zipCode: '',
    contactFirstName: '', contactLastName: '', contactEmail: '', contactPhone: '',
  });

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user) fetchProfile();
  }, [user, authLoading, router]);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      if (response.success) {
        const { buyer } = response.data;
        if (buyer) {
          setProfileData({
            companyName: buyer.companyName || '', companyAddress: buyer.companyAddress || '',
            country: buyer.country || '', state: buyer.state || '', city: buyer.city || '', zipCode: buyer.zipCode || '',
            contactFirstName: buyer.contactPerson?.firstName || '', contactLastName: buyer.contactPerson?.lastName || '',
            contactEmail: buyer.contactPerson?.email || '', contactPhone: buyer.contactPerson?.phone || '',
          });
        }
      }
    } catch (err) { console.error('Failed to fetch profile:', err); }
    finally { setLoading(false); }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    setError(''); setSuccess('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setError(''); setSuccess('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const updateData = {
        companyName: profileData.companyName, companyAddress: profileData.companyAddress,
        country: profileData.country, state: profileData.state, city: profileData.city, zipCode: profileData.zipCode,
        contactPerson: { firstName: profileData.contactFirstName, lastName: profileData.contactLastName, email: profileData.contactEmail, phone: profileData.contactPhone },
      };
      const response = await updateProfile(updateData);
      if (response.success) { setSuccess('Profile updated successfully'); if (response.data) updateUser(response.data); }
      else { setError(response.message || 'Failed to update profile'); }
    } catch (err) { setError('An error occurred while updating profile'); }
    finally { setSaving(false); }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    if (passwordData.newPassword.length < 8) { setError('New password must be at least 8 characters'); setSaving(false); return; }
    if (passwordData.newPassword !== passwordData.confirmPassword) { setError('New passwords do not match'); setSaving(false); return; }
    try {
      const response = await resetPassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      if (response.success) { setSuccess('Password changed successfully'); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
      else { setError(response.message || 'Failed to change password'); }
    } catch (err) { setError('An error occurred while changing password'); }
    finally { setSaving(false); }
  };

  const PasswordInput = ({ label, name, value, show, onToggle }) => (
    <div>
      <label className="block text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-1.5">{label}</label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} name={name} value={value} onChange={handlePasswordChange} required
          placeholder={`Enter ${label.toLowerCase()}`}
          className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-gray-50 dark:bg-slate-800 text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none pr-12" />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light" tabIndex={-1}>
          <span className="material-icons-outlined text-xl">{show ? 'visibility_off' : 'visibility'}</span>
        </button>
      </div>
    </div>
  );

  if (authLoading || loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Spinner size="lg" /></div></DashboardLayout>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Profile Settings</h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-light dark:border-border-dark">
        <nav className="flex space-x-8">
          <button onClick={() => setActiveTab('profile')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:border-gray-300'
              }`}>
            <span className="material-icons-outlined text-lg">person</span>
            Profile Information
          </button>
          <button onClick={() => setActiveTab('password')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'password' ? 'border-primary text-primary' : 'border-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:border-gray-300'
              }`}>
            <span className="material-icons-outlined text-lg">lock</span>
            Change Password
          </button>
        </nav>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
          <span className="material-icons-outlined text-red-500 text-xl flex-shrink-0 mt-0.5">error</span>
          <p className="text-sm font-medium text-red-800 dark:text-red-200 flex-1">{error}</p>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 flex-shrink-0">
            <span className="material-icons-outlined text-lg">close</span>
          </button>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3">
          <span className="material-icons-outlined text-green-500 text-xl flex-shrink-0 mt-0.5">check_circle</span>
          <p className="text-sm font-medium text-green-800 dark:text-green-200 flex-1">{success}</p>
          <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-600 flex-shrink-0">
            <span className="material-icons-outlined text-lg">close</span>
          </button>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* Account Info */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center gap-2">
              <span className="material-icons-outlined text-primary">email</span>
              <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Account Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Email Address" type="email" value={user?.email || ''} disabled className="bg-gray-50 dark:bg-slate-800" />
              <Input label="Account Type" value={user?.role === 'buyer' ? 'Buyer Account' : user?.role} disabled className="bg-gray-50 dark:bg-slate-800" />
            </div>
          </div>

          {/* Company Profile */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center gap-2">
              <span className="material-icons-outlined text-primary">business</span>
              <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Company Profile</h2>
            </div>
            <div className="p-6 space-y-6">
              <Input label="Company Name" name="companyName" value={profileData.companyName} onChange={handleProfileChange} placeholder="Enter company name" />
              <Input label="Company Address" name="companyAddress" value={profileData.companyAddress} onChange={handleProfileChange} placeholder="Enter company address" />
              <LocationSelector
                country={profileData.country} state={profileData.state} city={profileData.city}
                onCountryChange={(value) => handleProfileChange({ target: { name: 'country', value } })}
                onStateChange={(value) => handleProfileChange({ target: { name: 'state', value } })}
                onCityChange={(value) => handleProfileChange({ target: { name: 'city', value } })}
              />
              <Input label="Zip Code" name="zipCode" value={profileData.zipCode} onChange={handleProfileChange} placeholder="Enter zip code" />
            </div>
          </div>

          {/* Contact Person */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center gap-2">
              <span className="material-icons-outlined text-primary">phone</span>
              <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Contact Person</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First Name" name="contactFirstName" value={profileData.contactFirstName} onChange={handleProfileChange} placeholder="First name" />
                <Input label="Last Name" name="contactLastName" value={profileData.contactLastName} onChange={handleProfileChange} placeholder="Last name" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Contact Email" type="email" name="contactEmail" value={profileData.contactEmail} onChange={handleProfileChange} placeholder="Contact email" />
                <Input label="Contact Phone" type="tel" name="contactPhone" value={profileData.contactPhone} onChange={handleProfileChange} placeholder="Contact phone" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving}
              className="px-6 py-3 bg-primary hover:bg-blue-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
              {saving ? <Spinner size="sm" color="white" /> : <span className="material-icons-outlined text-lg">save</span>}
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center gap-2">
            <span className="material-icons-outlined text-primary">lock</span>
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Change Password</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
              <PasswordInput label="Current Password" name="currentPassword" value={passwordData.currentPassword}
                show={showPasswords.current} onToggle={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))} />
              <PasswordInput label="New Password" name="newPassword" value={passwordData.newPassword}
                show={showPasswords.new} onToggle={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))} />
              <PasswordInput label="Confirm New Password" name="confirmPassword" value={passwordData.confirmPassword}
                show={showPasswords.confirm} onToggle={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))} />
              <button type="submit" disabled={saving}
                className="px-6 py-3 bg-primary hover:bg-blue-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                {saving ? <Spinner size="sm" color="white" /> : <span className="material-icons-outlined text-lg">lock</span>}
                Change Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
