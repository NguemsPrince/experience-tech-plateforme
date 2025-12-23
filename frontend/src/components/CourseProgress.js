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
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

const CourseProgress = ({ 
  course, 
  enrollment, 
  onLessonClick, 
  currentLesson, 
  compact = false 
}) => {
  const [expandedSections, setExpandedSections] = useState(new Set([0]));
  const [completedLessons, setCompletedLessons] = useState(new Set());

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
      // Afficher un message si la leçon est verrouillée
      onLessonClick(lesson); // Le parent gérera l'affichage du message
    }
  };

  const markLessonComplete = (lessonId, e) => {
    e.stopPropagation();
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(lessonId)) {
      newCompleted.delete(lessonId);
    } else {
      newCompleted.add(lessonId);
    }
    setCompletedLessons(newCompleted);
  };

  const getLessonIcon = (lesson) => {
    switch (lesson.type) {
      case 'video':
        return <VideoCameraIcon className="w-4 h-4" />;
      case 'text':
        return <DocumentTextIcon className="w-4 h-4" />;
      case 'quiz':
        return <AcademicCapIcon className="w-4 h-4" />;
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

  const calculateProgress = () => {
    if (!course.curriculum) return 0;
    
    const totalLessons = course.curriculum.reduce((acc, section) => acc + section.lessons.length, 0);
    const completedCount = completedLessons.size;
    
    return Math.round((completedCount / totalLessons) * 100);
  };

  const progress = calculateProgress();

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progression du cours</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Quick Access */}
        <div>
          <h4 className="font-semibold mb-3">Contenu du cours</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {course.curriculum?.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <div 
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => toggleSection(sectionIndex)}
                >
                  <div className="flex items-center">
                    {expandedSections.has(sectionIndex) ? (
                      <ChevronDownIcon className="w-4 h-4 mr-2" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4 mr-2" />
                    )}
                    <span className="font-medium text-sm">{section.section}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {section.lessons.length} leçons
                  </span>
                </div>

                {expandedSections.has(sectionIndex) && (
                  <div className="ml-4 space-y-1">
                    {section.lessons.map((lesson, lessonIndex) => {
                      const status = getLessonStatus(lesson);
                      const isCurrentLesson = currentLesson?.title === lesson.title;
                      
                      return (
                        <div
                          key={lessonIndex}
                          className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                            isCurrentLesson ? 'bg-blue-100 border-l-2 border-blue-500' : 'hover:bg-gray-50'
                          } ${
                            status === 'locked' ? 'cursor-not-allowed opacity-60' : ''
                          }`}
                          onClick={() => handleLessonClick(lesson)}
                        >
                          <div className="flex items-center flex-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              status === 'completed' ? 'bg-green-100 text-green-600' :
                              status === 'current' ? 'bg-blue-100 text-blue-600' :
                              status === 'preview' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-gray-100 text-gray-400'
                            }`}>
                              {status === 'completed' ? (
                                <CheckCircleSolidIcon className="w-4 h-4" />
                              ) : status === 'locked' ? (
                                <LockClosedIcon className="w-4 h-4" />
                              ) : (
                                getLessonIcon(lesson)
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="text-sm font-medium">{lesson.title}</span>
                                {lesson.isPreview && (
                                  <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded font-semibold">
                                    Échantillon gratuit
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <ClockIcon className="w-3 h-3 mr-1" />
                                {lesson.duration}
                              </div>
                            </div>
                          </div>

                          {enrollment && status !== 'locked' && (
                            <button
                              onClick={(e) => markLessonComplete(lesson._id || lesson.title, e)}
                              className={`p-1 rounded ${
                                completedLessons.has(lesson._id || lesson.title)
                                  ? 'text-green-600 hover:text-green-700'
                                  : 'text-gray-400 hover:text-green-600'
                              }`}
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Programme du cours</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Progression:</span>
            <span className="font-semibold text-blue-600">{progress}%</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <span>{completedLessons.size} leçons terminées</span>
          <span>{course.lessons} leçons au total</span>
        </div>
      </div>

      {/* Course Curriculum */}
      <div className="space-y-4">
        {course.curriculum?.map((section, sectionIndex) => (
          <div key={sectionIndex} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Section Header */}
            <div 
              className="bg-gray-50 px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleSection(sectionIndex)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {expandedSections.has(sectionIndex) ? (
                    <ChevronDownIcon className="w-5 h-5 mr-3 text-gray-600" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5 mr-3 text-gray-600" />
                  )}
                  <h4 className="font-semibold text-lg">{section.section}</h4>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {section.lessons.length} leçons
                  </span>
                  <span className="text-sm text-gray-600">
                    {section.lessons.reduce((acc, lesson) => {
                      const duration = lesson.duration ? lesson.duration.split(':') : [0, 0];
                      return acc + parseInt(duration[0]) * 60 + parseInt(duration[1]);
                    }, 0)} min
                  </span>
                </div>
              </div>
            </div>

            {/* Lessons List */}
            {expandedSections.has(sectionIndex) && (
              <div className="divide-y divide-gray-200">
                {section.lessons.map((lesson, lessonIndex) => {
                  const status = getLessonStatus(lesson);
                  const isCurrentLesson = currentLesson?.title === lesson.title;
                  
                  return (
                    <div
                      key={lessonIndex}
                      className={`p-4 cursor-pointer transition-colors ${
                        isCurrentLesson ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                      } ${
                        status === 'locked' ? 'cursor-not-allowed opacity-60' : ''
                      }`}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                            status === 'completed' ? 'bg-green-100 text-green-600' :
                            status === 'current' ? 'bg-blue-100 text-blue-600' :
                            status === 'preview' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-gray-100 text-gray-400'
                          }`}>
                            {status === 'completed' ? (
                              <CheckCircleSolidIcon className="w-5 h-5" />
                            ) : status === 'locked' ? (
                              <LockClosedIcon className="w-5 h-5" />
                            ) : (
                              getLessonIcon(lesson)
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                              {lesson.isPreview && (
                                <span className="ml-3 text-xs bg-green-500 text-white px-2 py-1 rounded font-semibold">
                                  Échantillon gratuit
                                </span>
                              )}
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-600">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              <span>{lesson.duration}</span>
                              <span className="mx-2">•</span>
                              <span className="capitalize">{lesson.type}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {enrollment && status !== 'locked' && (
                            <button
                              onClick={(e) => markLessonComplete(lesson._id || lesson.title, e)}
                              className={`p-2 rounded-full transition-colors ${
                                completedLessons.has(lesson._id || lesson.title)
                                  ? 'text-green-600 hover:bg-green-100'
                                  : 'text-gray-400 hover:text-green-600 hover:bg-gray-100'
                              }`}
                              title="Marquer comme terminé"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Course Stats */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">Résumé du cours</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{course.lessons}</div>
            <div className="text-sm text-blue-800">Leçons</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{course.totalHours}h</div>
            <div className="text-sm text-blue-800">Contenu vidéo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{progress}%</div>
            <div className="text-sm text-blue-800">Terminé</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {enrollment ? 'Accès à vie' : 'Non inscrit'}
            </div>
            <div className="text-sm text-blue-800">Accès</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
