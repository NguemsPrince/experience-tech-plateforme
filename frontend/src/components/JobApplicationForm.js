import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';

const JobApplicationForm = ({ isOpen, onClose, jobTitle = "Poste" }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    experience: '',
    education: '',
    skills: '',
    motivation: '',
    cv: null,
    coverLetter: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        cv: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('jobTitle', jobTitle);
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('education', formData.education);
      formDataToSend.append('skills', formData.skills);
      formDataToSend.append('motivation', formData.motivation);
      formDataToSend.append('coverLetter', formData.coverLetter);
      
      if (formData.cv) {
        formDataToSend.append('cv', formData.cv);
      }

      // Submit application
      await api.post('/careers/apply', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        experience: '',
        education: '',
        skills: '',
        motivation: '',
        cv: null,
        coverLetter: ''
      });

      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Candidature pour {jobTitle}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Remplissez le formulaire ci-dessous pour postuler
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Informations personnelles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className={labelClasses}>
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className={inputClasses}
                      placeholder="Votre prénom"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className={labelClasses}>
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className={inputClasses}
                      placeholder="Votre nom"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className={labelClasses}>
                      Email *
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`${inputClasses} pl-10`}
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className={labelClasses}>
                      Téléphone *
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className={`${inputClasses} pl-10`}
                        placeholder="+237 XX XX XX XX"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="address" className={labelClasses}>
                      Adresse
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Votre adresse"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className={labelClasses}>
                      Ville *
                    </label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className={`${inputClasses} pl-10`}
                        placeholder="Yaoundé, Douala, etc."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BriefcaseIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Informations professionnelles
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="experience" className={labelClasses}>
                      Expérience professionnelle *
                    </label>
                    <textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className={inputClasses}
                      placeholder="Décrivez votre expérience professionnelle..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="education" className={labelClasses}>
                      Formation et diplômes *
                    </label>
                    <textarea
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className={inputClasses}
                      placeholder="Vos diplômes et formations..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="skills" className={labelClasses}>
                      Compétences techniques *
                    </label>
                    <textarea
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className={inputClasses}
                      placeholder="Listez vos compétences techniques..."
                    />
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AcademicCapIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Motivation
                </h3>
                
                <div>
                  <label htmlFor="motivation" className={labelClasses}>
                    Pourquoi souhaitez-vous rejoindre Expérience Tech ? *
                  </label>
                  <textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className={inputClasses}
                    placeholder="Expliquez votre motivation..."
                  />
                </div>
              </div>

              {/* Documents */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DocumentTextIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Documents
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cv" className={labelClasses}>
                      CV (PDF, DOC, DOCX) *
                    </label>
                    <input
                      type="file"
                      id="cv"
                      name="cv"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Formats acceptés: PDF, DOC, DOCX (max 5MB)
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="coverLetter" className={labelClasses}>
                      Lettre de motivation
                    </label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      rows={4}
                      className={inputClasses}
                      placeholder="Votre lettre de motivation (optionnelle)..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Status */}
              {submitStatus && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitStatus === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {submitStatus === 'success' ? (
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      Candidature envoyée avec succès ! Nous vous contacterons bientôt.
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-red-600 mr-2">✗</span>
                      Erreur lors de l'envoi. Veuillez réessayer.
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer la candidature'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobApplicationForm;
