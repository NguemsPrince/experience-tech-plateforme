import React, { useState } from 'react';
import {
  PlayIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ClockIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

const CourseCurriculumSidebar = ({
  course,
  enrollment,
  currentLesson,
  onLessonClick,
  completedLessons = new Set(),
  onLessonComplete
}) => {
  const [expandedSections, setExpandedSections] = useState(new Set([0])); // Première section ouverte par défaut

  const toggleSection = (sectionIndex) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionIndex)) {
      newExpanded.delete(sectionIndex);
    } else {
      newExpanded.add(sectionIndex);
    }
    setExpandedSections(newExpanded);
  };

  const handleLessonClick = (lesson) => {
    if (enrollment || lesson.isPreview) {
      onLessonClick(lesson);
    } else {
      // Le parent gérera l'affichage du message
      onLessonClick(lesson);
    }
  };

  const getLessonIcon = (lesson) => {
    switch (lesson.type) {
      case 'video':
        return <VideoCameraIcon className="w-4 h-4" />;
      case 'text':
        return <DocumentTextIcon className="w-4 h-4" />;
      case 'quiz':
        return <AcademicCapIcon className="w-4 h-4" />;
      case 'assignment':
        return <DocumentArrowDownIcon className="w-4 h-4" />;
      default:
        return <PlayIcon className="w-4 h-4" />;
    }
  };

  const getLessonStatus = (lesson) => {
    if (completedLessons.has(lesson._id || lesson.title)) {
      return 'completed';
    }
    if (enrollment) {
      return 'available';
    }
    if (lesson.isPreview) {
      return 'preview';
    }
    if (lesson.isLocked) {
      return 'locked';
    }
    return 'locked';
  };

  const calculateTotalDuration = () => {
    if (!course?.curriculum) return '0h';
    let totalSeconds = 0;
    course.curriculum.forEach(section => {
      section.lessons?.forEach(lesson => {
        if (lesson.durationSeconds) {
          totalSeconds += lesson.durationSeconds;
        } else if (lesson.duration) {
          // Parser la durée (ex: "15:30" ou "2h 30min")
          const match = lesson.duration.match(/(\d+)h|(\d+):(\d+)/);
          if (match) {
            if (match[1]) {
              totalSeconds += parseInt(match[1]) * 3600;
            } else if (match[2] && match[3]) {
              totalSeconds += parseInt(match[2]) * 60 + parseInt(match[3]);
            }
          }
        }
      });
    });
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  };

  const countLessons = () => {
    if (!course?.curriculum) return 0;
    return course.curriculum.reduce((total, section) => {
      return total + (section.lessons?.length || 0);
    }, 0);
  };

  const countCompletedLessons = () => {
    return completedLessons.size;
  };

  const calculateProgress = () => {
    const total = countLessons();
    if (total === 0) return 0;
    return Math.round((countCompletedLessons() / total) * 100);
  };

  if (!course?.curriculum || course.curriculum.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-500 text-sm">Aucun contenu disponible</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-bold text-lg text-gray-900 mb-2">Contenu du cours</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{countLessons()} leçons</span>
          <span>{calculateTotalDuration()}</span>
        </div>
        {enrollment && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progression</span>
              <span>{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Curriculum List */}
      <div className="max-h-[600px] overflow-y-auto">
        {course.curriculum.map((section, sectionIndex) => {
          const sectionLessons = section.lessons || [];
          const isExpanded = expandedSections.has(sectionIndex);
          const completedInSection = sectionLessons.filter(lesson =>
            completedLessons.has(lesson._id || lesson.title)
          ).length;

          return (
            <div key={sectionIndex} className="border-b border-gray-200 last:border-b-0">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(sectionIndex)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center flex-1">
                  {isExpanded ? (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{section.section}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {sectionLessons.length} leçons
                      {enrollment && completedInSection > 0 && (
                        <span className="ml-2 text-purple-600">
                          {completedInSection}/{sectionLessons.length} complétées
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </button>

              {/* Section Lessons */}
              {isExpanded && (
                <div className="bg-gray-50">
                  {sectionLessons.map((lesson, lessonIndex) => {
                    const status = getLessonStatus(lesson);
                    const isCurrentLesson = currentLesson?.title === lesson.title || 
                                          currentLesson?._id === lesson._id;
                    const isCompleted = completedLessons.has(lesson._id || lesson.title);

                    return (
                      <div
                        key={lessonIndex}
                        className={`flex items-start p-3 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
                          isCurrentLesson
                            ? 'bg-purple-50 border-l-4 border-l-purple-600'
                            : 'hover:bg-white'
                        } ${
                          status === 'locked' && !lesson.isPreview
                            ? 'opacity-60 cursor-not-allowed'
                            : ''
                        }`}
                        onClick={() => handleLessonClick(lesson)}
                      >
                        {/* Lesson Icon */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                          isCompleted
                            ? 'bg-green-100 text-green-600'
                            : isCurrentLesson
                            ? 'bg-purple-100 text-purple-600'
                            : status === 'preview'
                            ? 'bg-green-100 text-green-600'
                            : status === 'locked'
                            ? 'bg-gray-200 text-gray-400'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {isCompleted ? (
                            <CheckCircleSolidIcon className="w-5 h-5" />
                          ) : status === 'locked' && !lesson.isPreview ? (
                            <LockClosedIcon className="w-4 h-4" />
                          ) : (
                            getLessonIcon(lesson)
                          )}
                        </div>

                        {/* Lesson Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center flex-wrap gap-2">
                                <h5 className={`text-sm font-medium ${
                                  isCurrentLesson ? 'text-purple-900' : 'text-gray-900'
                                }`}>
                                  {lesson.title}
                                </h5>
                                {lesson.isPreview && (
                                  <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded font-semibold">
                                    Échantillon gratuit
                                  </span>
                                )}
                                {status === 'locked' && !lesson.isPreview && (
                                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                    Verrouillé
                                  </span>
                                )}
                              </div>
                              {lesson.description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {lesson.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <ClockIcon className="w-3 h-3 mr-1" />
                                  {lesson.duration || 'N/A'}
                                </div>
                                {lesson.resources && lesson.resources.length > 0 && (
                                  <div className="flex items-center">
                                    <DocumentArrowDownIcon className="w-3 h-3 mr-1" />
                                    {lesson.resources.length} ressource(s)
                                  </div>
                                )}
                                {lesson.type === 'quiz' && (
                                  <div className="flex items-center">
                                    <AcademicCapIcon className="w-3 h-3 mr-1" />
                                    Quiz
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      {!enrollment && (
        <div className="p-4 bg-purple-50 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            <LockClosedIcon className="w-4 h-4 inline mr-1" />
            Achetez le cours pour accéder à toutes les leçons
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseCurriculumSidebar;

