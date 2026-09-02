import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Award,
  Star,
  CheckCircle2,
  ShieldCheck,
  Edit3,
  X,
  Save,
  Radio,
  Calendar,
  DollarSign,
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import Select from '../../components/Common/Select';
import Textarea from '../../components/Common/Textarea';
import RatingStars from '../../components/RatingStars/RatingStars';
import ToggleSwitch from '../../components/Common/ToggleSwitch';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { t, isAvailable, toggleAvailability, isUpdatingAvailability, showToast } = useApp();
  const { worker, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    fullName: worker?.fullName || '',
    email: worker?.email || '',
    phone: worker?.phone || '',
    primaryService: worker?.primaryService || 'electrician',
    secondarySkills: Array.isArray(worker?.secondarySkills)
      ? worker.secondarySkills.join(', ')
      : '',
    experienceYears: worker?.experienceYears || 5,
    serviceArea: worker?.serviceArea || '',
    hourlyRate: worker?.hourlyRate || 350,
    bio: worker?.bio || '',
  });

  const serviceOptions = [
    { value: 'electrician', label: t('services.electrician') },
    { value: 'plumber', label: t('services.plumber') },
    { value: 'cleaner', label: t('services.cleaner') },
    { value: 'carpenter', label: t('services.carpenter') },
    { value: 'mechanic', label: t('services.mechanic') },
    { value: 'painter', label: t('services.painter') },
    { value: 'appliance_repair', label: t('services.appliance_repair') },
    { value: 'gardener', label: t('services.gardener') },
    { value: 'hvac', label: t('services.hvac') },
    { value: 'pest_control', label: t('services.pest_control') },
  ];

  const handleStartEdit = () => {
    setEditForm({
      fullName: worker?.fullName || '',
      email: worker?.email || '',
      phone: worker?.phone || '',
      primaryService: worker?.primaryService || 'electrician',
      secondarySkills: Array.isArray(worker?.secondarySkills)
        ? worker.secondarySkills.join(', ')
        : '',
      experienceYears: worker?.experienceYears || 5,
      serviceArea: worker?.serviceArea || '',
      hourlyRate: worker?.hourlyRate || 350,
      bio: worker?.bio || '',
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateProfile({
        ...editForm,
        experienceYears: Number(editForm.experienceYears) || 1,
        hourlyRate: Number(editForm.hourlyRate) || 300,
        secondarySkills: editForm.secondarySkills
          ? editForm.secondarySkills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      });
      showToast(t('profile.savedSuccess'), 'success');
      setIsEditing(false);
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('profile.title')}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('profile.subtitle')}
          </p>
        </div>

        {!isEditing && (
          <Button
            variant="primary"
            size="md"
            onClick={handleStartEdit}
            icon={Edit3}
            className="shrink-0 font-bold"
          >
            {t('profile.editProfile')}
          </Button>
        )}
      </div>

      {isEditing ? (
        /* Edit Profile Form */
        <Card className="p-6 sm:p-8 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Edit Professional Profile
            </h2>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveEdit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('auth.fullName')}
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                required
                icon={User}
              />
              <Input
                label={t('auth.email')}
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
                icon={Mail}
              />
              <Input
                label={t('auth.phone')}
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                required
                icon={Phone}
              />
              <Input
                label={t('auth.serviceArea')}
                value={editForm.serviceArea}
                onChange={(e) => setEditForm({ ...editForm, serviceArea: e.target.value })}
                required
                icon={MapPin}
              />
              <Select
                label={t('auth.primaryService')}
                options={serviceOptions}
                value={editForm.primaryService}
                onChange={(e) => setEditForm({ ...editForm, primaryService: e.target.value })}
                required
              />
              <Input
                label={t('auth.experienceYears')}
                type="number"
                value={editForm.experienceYears}
                onChange={(e) => setEditForm({ ...editForm, experienceYears: e.target.value })}
                icon={Award}
              />
              <Input
                label={t('auth.hourlyRate')}
                type="number"
                value={editForm.hourlyRate}
                onChange={(e) => setEditForm({ ...editForm, hourlyRate: e.target.value })}
              />
              <Input
                label={t('auth.secondarySkills')}
                value={editForm.secondarySkills}
                onChange={(e) => setEditForm({ ...editForm, secondarySkills: e.target.value })}
              />
            </div>

            <Textarea
              label={t('auth.bio')}
              rows={4}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="md"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                icon={Save}
              >
                {t('common.saveChanges')}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        /* View Profile Mode */
        <div className="space-y-6">
          
          {/* Main Worker Hero Card */}
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-lg shadow-blue-500/25 border-4 border-white dark:border-slate-800">
                  {worker?.fullName ? worker.fullName.charAt(0) : 'W'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                      {worker?.fullName || 'Worker Name'}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {t('profile.verifiedWorker')}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 capitalize mt-0.5">
                    {worker?.primaryService ? t(`services.${worker.primaryService}`) || worker.primaryService : 'Electrician'}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {worker?.serviceArea || 'Service Area'}
                  </p>
                </div>
              </div>

              {/* Rating & Jobs Summary Box */}
              <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="text-center">
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {worker?.rating || '5.0'}
                  </div>
                  <RatingStars rating={worker?.rating || 5.0} size="xs" showScore={false} />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {worker?.reviewsCount || 0} reviews
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                <div className="text-center">
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {worker?.completedJobsCount || 0}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                    {t('profile.completedServices')}
                  </span>
                </div>
              </div>
            </div>

            {/* Availability Toggle Section */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-blue-50/40 dark:bg-slate-800/40 border border-blue-100 dark:border-slate-700/60">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  {t('profile.availabilityStatus')}:{' '}
                  <span className={isAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                    {isAvailable ? t('common.available') : t('common.unavailable')}
                  </span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isAvailable ? t('profile.availableDesc') : t('profile.unavailableDesc')}
                </p>
              </div>

              <ToggleSwitch
                checked={isAvailable}
                onChange={toggleAvailability}
                disabled={isUpdatingAvailability}
                label={isAvailable ? 'Accepting Requests' : 'Offline'}
              />
            </div>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Professional Info & Bio */}
            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> {t('profile.experienceAndBio')}
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">
                    {t('profile.yearsExperience')}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {worker?.experienceYears || 1} Years in Professional Trade
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-1">
                    Standard Base Rate
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {t('common.currencySymbol')}{worker?.hourlyRate || 350} / hour
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-1">
                    About Professional
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    {worker?.bio || 'No professional bio provided yet.'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Skills & Contact */}
            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4" /> {t('profile.servicesInfo')}
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400 block mb-2">
                    Primary & Specialization Skills
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-xs">
                      {worker?.primaryService ? t(`services.${worker.primaryService}`) || worker.primaryService : 'Electrician'}
                    </span>
                    {(worker?.secondarySkills || []).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 block mb-2">
                    Contact & Coverage
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{worker?.email || 'worker@skillbridge.pro'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{worker?.phone || '+91 98765 43210'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{worker?.serviceArea || 'South Delhi & NCR'} (Radius: {worker?.serviceRadiusKm || 15} km)</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
