import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, User, Mail, Phone, Lock, Briefcase, MapPin, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import Input from '../../components/Common/Input';
import Select from '../../components/Common/Select';
import Textarea from '../../components/Common/Textarea';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { showToast } = useApp();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    primaryService: '',
    secondarySkills: '',
    experienceYears: '',
    serviceArea: '',
    hourlyRate: '',
    bio: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const serviceOptions = [
    { value: 'electrician', label: 'Electrician' },
    { value: 'plumber', label: 'Plumber' },
    { value: 'cleaner', label: 'Cleaning Services' },
    { value: 'carpenter', label: 'Carpenter' },
    { value: 'mechanic', label: 'Mechanic' },
    { value: 'painter', label: 'Painter' },
    { value: 'appliance_repair', label: 'Appliance Repair' },
    { value: 'gardener', label: 'Gardener & Landscaper' },
    { value: 'hvac', label: 'AC & HVAC Technician' },
    { value: 'pest_control', label: 'Pest Control' },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!formData.primaryService) errs.primaryService = 'Please select your primary trade';
    if (!formData.serviceArea.trim()) errs.serviceArea = 'Service area is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please check your inputs and fill in all required fields.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        ...formData,
        experienceYears: Number(formData.experienceYears) || 1,
        hourlyRate: Number(formData.hourlyRate) || 300,
        secondarySkills: formData.secondarySkills
          ? formData.secondarySkills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      });

      setIsSuccess(true);
      showToast('Registration submitted successfully!', 'success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Bar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            SkillBridge
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="max-w-2xl mx-auto w-full my-auto">
        <Card className="p-6 sm:p-10 shadow-xl border-slate-200/80 dark:border-slate-800">
          {isSuccess ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-5 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Registration Successful!
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Redirecting to your Worker Dashboard...
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8 text-center sm:text-left">
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900 uppercase tracking-wider mb-2.5 inline-block">
                  Worker Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Join as a Professional
                </h1>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                  Create your SkillBridge worker account and start receiving local service requests.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Step 1: Personal Credentials */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> 1. Personal & Contact Info
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="e.g. Rajesh Kumar"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      error={errors.fullName}
                      required
                      icon={User}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="worker@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      error={errors.email}
                      required
                      icon={Mail}
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      error={errors.phone}
                      required
                      icon={Phone}
                    />
                    <Input
                      label="Service Area / City"
                      placeholder="e.g. South Delhi, Indirapuram"
                      value={formData.serviceArea}
                      onChange={(e) => handleChange('serviceArea', e.target.value)}
                      error={errors.serviceArea}
                      required
                      icon={MapPin}
                    />
                  </div>
                </div>

                {/* Step 2: Trade & Skills */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5" /> 2. Profession & Experience
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Primary Profession / Service"
                      options={serviceOptions}
                      value={formData.primaryService}
                      onChange={(e) => handleChange('primaryService', e.target.value)}
                      placeholder="Select your trade"
                      error={errors.primaryService}
                      required
                    />
                    <Input
                      label="Experience (Years)"
                      type="number"
                      min="0"
                      max="50"
                      placeholder="e.g. 5"
                      value={formData.experienceYears}
                      onChange={(e) => handleChange('experienceYears', e.target.value)}
                      icon={Award}
                    />
                    <Input
                      label="Standard Hourly / Base Rate (₹)"
                      type="number"
                      min="0"
                      placeholder="e.g. 350"
                      value={formData.hourlyRate}
                      onChange={(e) => handleChange('hourlyRate', e.target.value)}
                    />
                    <Input
                      label="Additional Skills (Comma separated)"
                      placeholder="e.g. Wiring, Inverter Repair, Fuse Fixes"
                      value={formData.secondarySkills}
                      onChange={(e) => handleChange('secondarySkills', e.target.value)}
                    />
                  </div>

                  <div className="mt-4">
                    <Textarea
                      label="Professional Bio"
                      placeholder="Briefly describe your expertise, certifications, and work experience..."
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                    />
                  </div>
                </div>

                {/* Step 3: Security */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" /> 3. Account Password
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      error={errors.password}
                      required
                      icon={Lock}
                    />
                    <Input
                      label="Confirm Password"
                      type="password"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      error={errors.confirmPassword}
                      required
                      icon={Lock}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full shadow-lg shadow-blue-600/20"
                    isLoading={isSubmitting}
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Complete Registration
                  </Button>
                </div>

                <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed">
                  By continuing, you agree to SkillBridge Worker Terms of Service and Privacy Policy.
                </p>

                <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">
                  Already registered as a worker?{' '}
                  <Link
                    to="/login"
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    Sign in here
                  </Link>
                </div>
              </form>
            </>
          )}
        </Card>
      </div>

      <footer className="text-center text-xs text-slate-400 dark:text-slate-600 py-4">
        © {new Date().getFullYear()} SkillBridge. All rights reserved.
      </footer>
    </div>
  );
}
