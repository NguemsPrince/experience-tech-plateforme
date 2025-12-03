import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  SparklesIcon,
  MicrophoneIcon,
  StopIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  StarIcon,
  CogIcon,
  AcademicCapIcon,
  CubeIcon,
  PhoneIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  LightBulbIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ChatBubbleBottomCenterTextIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const Chatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [messageHistory, setMessageHistory] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [conversationFlow, setConversationFlow] = useState('initial');
  const [userInfo, setUserInfo] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [chatMode, setChatMode] = useState('general'); // general, support, sales
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const predefinedQuestions = [
    {
      id: 1,
      text: "Quels sont vos services ?",
      category: "services",
      icon: "🔧",
      description: "Découvrez nos services numériques, formations, impression et plus"
    },
    {
      id: 2,
      text: "Comment puis-je vous contacter ?",
      category: "contact",
      icon: "📞",
      description: "Nos coordonnées et moyens de contact"
    },
    {
      id: 3,
      text: "Proposez-vous des formations ?",
      category: "training",
      icon: "🎓",
      description: "Formations professionnelles et certifications"
    },
    {
      id: 4,
      text: "Quels sont vos tarifs ?",
      category: "pricing",
      icon: "💰",
      description: "Informations sur nos tarifs et devis"
    },
    {
      id: 5,
      text: "Où êtes-vous situés ?",
      category: "location",
      icon: "📍",
      description: "Notre localisation et adresse"
    },
    {
      id: 6,
      text: "Avez-vous des certifications ?",
      category: "certifications",
      icon: "🏆",
      description: "Nos certifications et accréditations"
    },
    {
      id: 7,
      text: "Comment obtenir un devis ?",
      category: "quote",
      icon: "📋",
      description: "Processus de demande de devis"
    },
    {
      id: 8,
      text: "Quels sont vos horaires ?",
      category: "hours",
      icon: "🕒",
      description: "Nos heures d'ouverture"
    }
  ];

  const quickActions = [
    { 
      id: 1, 
      text: "Demander un devis", 
      action: "quote", 
      icon: DocumentTextIcon,
      color: "blue",
      description: "Obtenez un devis personnalisé"
    },
    { 
      id: 2, 
      text: "Prendre RDV", 
      action: "appointment", 
      icon: ClockIcon,
      color: "green",
      description: "Planifier une rencontre"
    },
    { 
      id: 3, 
      text: "Support technique", 
      action: "support", 
      icon: CogIcon,
      color: "orange",
      description: "Assistance technique"
    },
    { 
      id: 4, 
      text: "Nos formations", 
      action: "training", 
      icon: AcademicCapIcon,
      color: "purple",
      description: "Découvrir nos formations"
    },
    { 
      id: 5, 
      text: "Nos services", 
      action: "services", 
      icon: CubeIcon,
      color: "indigo",
      description: "Voir tous nos services"
    },
    { 
      id: 6, 
      text: "Nous contacter", 
      action: "contact", 
      icon: PhoneIcon,
      color: "red",
      description: "Coordonnées et contact"
    }
  ];

  const chatModes = [
    { id: 'general', name: 'Général', icon: ChatBubbleLeftRightIcon, color: 'blue' },
    { id: 'support', name: 'Support', icon: CogIcon, color: 'orange' },
    { id: 'sales', name: 'Commercial', icon: CurrencyDollarIcon, color: 'green' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      status: 'delivered'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setConnectionStatus('typing');

    // Simulate connection issues occasionally
    if (Math.random() < 0.1) {
      setTimeout(() => {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: 'Désolé, je rencontre des difficultés de connexion. Veuillez réessayer.',
          timestamp: new Date(),
          status: 'error'
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
        setConnectionStatus('online');
        return;
      }, 2000);
      return;
    }

    try {
      // Check if it's a predefined question
      const predefinedQuestion = predefinedQuestions.find(q => 
        q.text.toLowerCase() === message.toLowerCase()
      );

      let botResponse;

      if (predefinedQuestion) {
        // Get enhanced response based on category
        const responses = {
          services: {
            title: "Nos Services",
            content: `🔧 **Services Numériques**\n• Développement Web & Mobile\n• Logiciels sur mesure\n• Maintenance IT\n• Conseil Technologique\n\n🎓 **Formations**\n• Formations IT\n• Bureautique\n• Certifications\n• Formations sur mesure\n\n🖨️ **Impression & Design**\n• Affiches & Banderoles\n• Cartes de visite\n• Brochures\n• Emballages\n\n🚚 **Commerce & Import-Export**\n• Import équipements IT\n• Distribution\n• Conseil commercial\n• Logistique\n\n🌐 **Réseaux & Connectivité**\n• Configuration réseaux\n• Supervision\n• Maintenance\n• Sécurité`,
            followUpQuestions: [
              { id: 1, text: "Demander un devis", category: "quote", icon: "📋" },
              { id: 2, text: "En savoir plus sur les formations", category: "training", icon: "🎓" },
              { id: 3, text: "Nous contacter", category: "contact", icon: "📞" }
            ]
          },
          contact: {
            title: "Nous Contacter",
            content: `📞 **Coordonnées**\n• Téléphone : +235 60 29 05 10\n• Email : contact@experiencetech-tchad.com\n• WhatsApp : +235 60 29 05 10\n\n📍 **Adresse**\nAvenue Charles de Gaulle\nN'Djamena, Tchad\n\n🕒 **Horaires**\nLundi - Vendredi : 8h00 - 18h00\nSamedi : 8h00 - 12h00\nDimanche : Fermé`,
            followUpQuestions: [
              { id: 1, text: "Prendre un rendez-vous", category: "appointment", icon: "📅" },
              { id: 2, text: "Demander un devis", category: "quote", icon: "📋" },
              { id: 3, text: "Support technique", category: "support", icon: "🛠️" }
            ]
          },
          training: {
            title: "Nos Formations",
            content: `🎓 **Formations Professionnelles**\n\n**Développement Web**\n• HTML, CSS, JavaScript\n• React, Vue.js\n• PHP, Laravel\n• Node.js\n\n**Bureautique**\n• Microsoft Office\n• LibreOffice\n• Gestion de projets\n• Communication digitale\n\n**Certifications**\n• CompTIA A+\n• Microsoft Certified\n• Cisco CCNA\n• Google Analytics\n\n**Formations sur mesure**\n• Adaptées à vos besoins\n• En entreprise\n• En ligne ou présentiel`,
            followUpQuestions: [
              { id: 1, text: "S'inscrire à une formation", category: "enrollment", icon: "📝" },
              { id: 2, text: "Voir les tarifs", category: "pricing", icon: "💰" },
              { id: 3, text: "Demander un devis", category: "quote", icon: "📋" }
            ]
          },
          pricing: {
            title: "Nos Tarifs",
            content: `💰 **Tarifs Transparents**\n\n**Services Numériques**\n• Site web : 150,000 - 2,000,000 FCFA\n• Application mobile : 300,000 - 5,000,000 FCFA\n• Logiciel sur mesure : Sur devis\n\n**Formations**\n• Formation individuelle : 50,000 FCFA/jour\n• Formation groupe : 30,000 FCFA/personne/jour\n• Certification : 100,000 - 300,000 FCFA\n\n**Impression**\n• Cartes de visite : 1,000 FCFA/100\n• Affiches : 2,000 FCFA/m²\n• Brochures : Sur devis\n\n*Tous les prix sont indicatifs. Devis gratuit sur demande.*`,
            followUpQuestions: [
              { id: 1, text: "Demander un devis personnalisé", category: "quote", icon: "📋" },
              { id: 2, text: "Voir nos services", category: "services", icon: "🔧" },
              { id: 3, text: "Nous contacter", category: "contact", icon: "📞" }
            ]
          },
          location: {
            title: "Notre Localisation",
            content: `📍 **Expérience Tech**\nAvenue Charles de Gaulle\nN'Djamena, Tchad\n\n🚗 **Accès**\n• Facilement accessible en voiture\n• Parking disponible\n• Proche du centre-ville\n• Transport public à proximité\n\n🗺️ **Plan d'accès**\nSitué sur l'Avenue Charles de Gaulle, nous sommes facilement repérables avec notre enseigne distinctive.\n\n⏰ **Horaires d'ouverture**\nLundi - Vendredi : 8h00 - 18h00\nSamedi : 8h00 - 12h00`,
            followUpQuestions: [
              { id: 1, text: "Prendre un rendez-vous", category: "appointment", icon: "📅" },
              { id: 2, text: "Nous appeler", category: "call", icon: "📞" },
              { id: 3, text: "Demander un devis", category: "quote", icon: "📋" }
            ]
          },
          certifications: {
            title: "Nos Certifications",
            content: `🏆 **Certifications & Accréditations**\n\n**Certifications Techniques**\n• Microsoft Certified Partner\n• Cisco Certified Partner\n• Google Partner\n• CompTIA Authorized Partner\n\n**Accréditations**\n• Centre de formation agréé\n• Partenaire officiel Microsoft\n• Certifié ISO 9001\n• Membre de l'AFDIT (Association Française pour le Développement de l'Informatique au Tchad)\n\n**Reconnaissance**\n• 8+ années d'expérience\n• 1000+ clients satisfaits\n• 500+ projets réalisés\n• 50+ certifications délivrées`,
            followUpQuestions: [
              { id: 1, text: "Voir nos formations", category: "training", icon: "🎓" },
              { id: 2, text: "Demander un devis", category: "quote", icon: "📋" },
              { id: 3, text: "Nous contacter", category: "contact", icon: "📞" }
            ]
          },
          quote: {
            title: "Demande de Devis",
            content: `📋 **Processus de Devis**\n\n**Étape 1 : Consultation**\n• Analyse de vos besoins\n• Évaluation des exigences\n• Proposition de solutions\n\n**Étape 2 : Devis Détaillé**\n• Tarification transparente\n• Délais de réalisation\n• Garanties incluses\n\n**Étape 3 : Validation**\n• Révision du devis\n• Ajustements si nécessaire\n• Signature du contrat\n\n**Avantages**\n✅ Devis gratuit et sans engagement\n✅ Réponse sous 24h\n✅ Tarifs compétitifs\n✅ Suivi personnalisé`,
            followUpQuestions: [
              { id: 1, text: "Demander un devis maintenant", category: "request_quote", icon: "📝" },
              { id: 2, text: "Nous contacter", category: "contact", icon: "📞" },
              { id: 3, text: "Voir nos services", category: "services", icon: "🔧" }
            ]
          },
          hours: {
            title: "Nos Horaires",
            content: `🕒 **Horaires d'Ouverture**\n\n**Lundi - Vendredi**\n8h00 - 18h00\n\n**Samedi**\n8h00 - 12h00\n\n**Dimanche**\nFermé\n\n**Services d'Urgence**\n• Support technique 24/7\n• Hotline : +235 60 29 05 10\n• Email : support@experiencetech-tchad.com\n\n**Rendez-vous**\n• Sur rendez-vous uniquement\n• Réservation en ligne disponible\n• Confirmation par SMS/Email`,
            followUpQuestions: [
              { id: 1, text: "Prendre un rendez-vous", category: "appointment", icon: "📅" },
              { id: 2, text: "Nous contacter", category: "contact", icon: "📞" },
              { id: 3, text: "Support d'urgence", category: "emergency", icon: "🚨" }
            ]
          }
        };

        const response = responses[predefinedQuestion.category] || {
          title: predefinedQuestion.text,
          content: "Voici les informations demandées...",
          followUpQuestions: []
        };

        botResponse = {
          title: response.title,
          content: response.content,
          category: predefinedQuestion.category,
          status: 'success',
          followUpQuestions: response.followUpQuestions
        };
      } else {
        // Handle custom questions with enhanced responses
        const customResponses = {
          bonjour: {
            title: "Salutation",
            content: `Bonjour ! 👋\n\nJe suis ravi de vous accueillir chez Expérience Tech. Comment puis-je vous aider aujourd'hui ?\n\nJe peux vous aider avec :\n• 🔧 Nos services\n• 🎓 Nos formations\n• 📋 Demandes de devis\n• 🛠️ Support technique\n• 📞 Prise de rendez-vous`,
            followUpQuestions: [
              { id: 1, text: "Découvrir vos services", category: "services", icon: "🔧" },
              { id: 2, text: "En savoir plus sur vos formations", category: "training", icon: "🎓" },
              { id: 3, text: "Obtenir un devis", category: "quote", icon: "📋" }
            ]
          },
          merci: {
            title: "De rien !",
            content: `De rien ! 😊\n\nC'est un plaisir de vous aider. N'hésitez pas si vous avez d'autres questions !\n\nJe reste à votre disposition pour :\n• Toute information sur nos services\n• Des conseils personnalisés\n• L'assistance technique\n• La prise de rendez-vous`,
            followUpQuestions: [
              { id: 1, text: "Autre question", category: "general", icon: "❓" },
              { id: 2, text: "Nous contacter", category: "contact", icon: "📞" }
            ]
          }
        };

        // Check for common greetings and responses
        const lowerMessage = message.toLowerCase();
        let foundResponse = null;

        for (const [key, response] of Object.entries(customResponses)) {
          if (lowerMessage.includes(key)) {
            foundResponse = response;
            break;
          }
        }

        if (foundResponse) {
          botResponse = {
            title: foundResponse.title,
            content: foundResponse.content,
            status: 'success',
            followUpQuestions: foundResponse.followUpQuestions
          };
        } else {
          // Default enhanced response for custom questions
          botResponse = {
            title: "Question reçue",
            content: `Merci pour votre question : "${message}"\n\n✅ Votre demande a été enregistrée\n📋 Statut : En cours de traitement\n⏰ Réponse estimée : Sous 24h\n\n📝 Prochaines étapes :\n• Analyse de votre demande\n• Préparation d'une réponse personnalisée\n• Contact par notre équipe\n\n💡 En attendant, je peux vous aider avec :\n• Informations sur nos services\n• Détails sur nos formations\n• Processus de devis\n• Prise de rendez-vous`,
            status: 'success',
            followUpQuestions: [
              { id: 1, text: "Voir nos services", category: "services", icon: "🔧" },
              { id: 2, text: "Nos formations", category: "training", icon: "🎓" },
              { id: 3, text: "Nous contacter", category: "contact", icon: "📞" }
            ]
          };
        }
      }

      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse.content,
        title: botResponse.title,
        timestamp: new Date(),
        status: 'delivered',
        category: botResponse.category,
        followUpQuestions: botResponse.followUpQuestions || []
      };

      setMessages(prev => [...prev, botMessage]);
      setConnectionStatus('online');
      
      // Save to history
      setMessageHistory(prev => [...prev, { user: message, bot: botResponse.content }]);
      
      // Save conversation to backend
      try {
        await api.post('/chatbot/conversation', {
          sessionId: sessionId || Date.now().toString(),
          userMessage: message,
          botResponse: botResponse.content,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          mode: chatMode
        });
      } catch (error) {
        console.log('Failed to save conversation:', error);
      }

    } catch (error) {
      console.error('Chatbot error:', error);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Désolé, je rencontre une erreur technique. Veuillez réessayer plus tard.',
        timestamp: new Date(),
        status: 'error'
      };

      setMessages(prev => [...prev, botMessage]);
      toast.error('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsTyping(false);
    }
  };

  const handlePredefinedQuestion = (question) => {
    handleSendMessage(question.text);
  };

  const handleFollowUpQuestion = (question) => {
    handleSendMessage(question.text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const getWelcomeMessage = () => {
    const userName = user?.firstName ? ` ${user.firstName}` : '';
    const timeOfDay = new Date().getHours();
    let greeting = "Bonjour";
    
    if (timeOfDay < 12) greeting = "Bonjour";
    else if (timeOfDay < 18) greeting = "Bon après-midi";
    else greeting = "Bonsoir";

    return {
      id: Date.now(),
      type: 'bot',
      content: `${greeting}${userName} ! 👋\n\nJe suis l'assistant virtuel d'Expérience Tech. Je suis là pour vous aider avec :\n\n• 🔧 Nos services numériques\n• 🎓 Nos formations professionnelles\n• 📋 Demandes de devis\n• 🛠️ Support technique\n• 📞 Prise de rendez-vous\n\nComment puis-je vous aider aujourd'hui ?`,
      timestamp: new Date(),
      followUpQuestions: [
        {
          id: 1,
          text: "Découvrir vos services",
          category: "services",
          icon: "🔧"
        },
        {
          id: 2,
          text: "En savoir plus sur vos formations",
          category: "training",
          icon: "🎓"
        },
        {
          id: 3,
          text: "Obtenir un devis",
          category: "quote",
          icon: "💰"
        },
        {
          id: 4,
          text: "Nous contacter",
          category: "contact",
          icon: "📞"
        }
      ]
    };
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Add personalized welcome message when opening
      const welcomeMessage = getWelcomeMessage();
      setMessages([welcomeMessage]);
      setConversationFlow('active');
      setShowQuickActions(true);
    } else {
      // Reset conversation when closing
      setMessages([]);
      setConversationFlow('initial');
      setSessionId(null);
      setShowQuickActions(true);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleModeChange = (mode) => {
    setChatMode(mode);
    const modeMessages = {
      general: "Mode général activé. Je peux vous aider avec toutes vos questions.",
      support: "Mode support activé. Je vais vous aider avec vos problèmes techniques.",
      sales: "Mode commercial activé. Je peux vous aider avec nos services et tarifs."
    };
    
    const modeMessage = {
      id: Date.now(),
      type: 'bot',
      content: modeMessages[mode],
      timestamp: new Date(),
      status: 'info'
    };
    
    setMessages(prev => [...prev, modeMessage]);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={toggleChatbot}
        data-chatbot-button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        )}
      </motion.button>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            data-chatbot-modal
            className={`fixed bottom-24 right-6 z-40 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 ${
              isMinimized ? 'h-16' : 'h-[600px]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Assistant Expérience Tech</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-xs opacity-90">En ligne</p>
                    </div>
                    {user && (
                      <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                        {user.firstName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMinimize}
                  className="text-white hover:text-gray-200 transition-colors p-1"
                  title={isMinimized ? "Agrandir" : "Réduire"}
                >
                  {isMinimized ? <ArrowPathIcon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors p-1"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode Selector */}
            {!isMinimized && (
              <div className="bg-gray-50 p-3 border-b border-gray-200">
                <div className="flex space-x-2">
                  {chatModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => handleModeChange(mode.id)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        chatMode === mode.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <mode.icon className="w-3 h-3" />
                      <span>{mode.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : message.status === 'info'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.title && (
                        <div className="font-semibold mb-2 text-sm flex items-center">
                          {message.type === 'bot' && <SparklesIcon className="w-4 h-4 mr-2" />}
                          {message.title}
                        </div>
                      )}
                      <div className="whitespace-pre-line text-sm">
                        {message.content}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        {message.status && (
                          <div className="flex items-center space-x-1">
                            {message.status === 'delivered' && <CheckCircleIcon className="w-3 h-3 text-green-500" />}
                            {message.status === 'error' && <ExclamationTriangleIcon className="w-3 h-3 text-red-500" />}
                            {message.status === 'info' && <InformationCircleIcon className="w-3 h-3 text-blue-500" />}
                          </div>
                        )}
                      </div>
                      
                      {/* Follow-up Questions */}
                      {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="text-xs font-medium text-gray-600 mb-2">
                            Questions suggérées :
                          </div>
                          {message.followUpQuestions.map((question) => (
                            <button
                              key={question.id}
                              onClick={() => handleFollowUpQuestion(question)}
                              className="block w-full text-left p-2 text-xs bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                            >
                              <span className="mr-2">{question.icon}</span>
                              {question.text}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Quick Actions */}
            {!isMinimized && showQuickActions && messages.length <= 1 && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-gray-500">Actions rapides :</div>
                  <button
                    onClick={() => setShowQuickActions(false)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Masquer
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.slice(0, 4).map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleSendMessage(action.text)}
                      className={`flex items-center p-2 text-xs rounded-lg transition-colors border ${
                        action.color === 'blue' ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700' :
                        action.color === 'green' ? 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700' :
                        action.color === 'orange' ? 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700' :
                        action.color === 'purple' ? 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700' :
                        action.color === 'indigo' ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700' :
                        'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
                      }`}
                    >
                      <action.icon className="w-3 h-3 mr-2" />
                      <span className="truncate">{action.text}</span>
                    </button>
                  ))}
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">Questions fréquentes :</div>
                  <div className="grid grid-cols-1 gap-2">
                    {predefinedQuestions.slice(0, 3).map((question) => (
                      <button
                        key={question.id}
                        onClick={() => handlePredefinedQuestion(question)}
                        className="text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <span className="mr-2">{question.icon}</span>
                        <span className="truncate">{question.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Input */}
            {!isMinimized && (
              <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={`Posez votre question en mode ${chatMode}...`}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setInputValue('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => {
                        // Toggle recording functionality
                        setIsRecording(!isRecording);
                        toast.info(isRecording ? 'Arrêt de l\'enregistrement' : 'Début de l\'enregistrement');
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        isRecording 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={isRecording ? 'Arrêter l\'enregistrement' : 'Enregistrer un message vocal'}
                    >
                      {isRecording ? <StopIcon className="w-4 h-4" /> : <MicrophoneIcon className="w-4 h-4" />}
                    </button>
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    >
                      <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Input suggestions */}
                {inputValue.length > 0 && inputValue.length < 3 && (
                  <div className="mt-2 text-xs text-gray-500">
                    💡 Astuce : Tapez plus de caractères pour des suggestions
                  </div>
                )}
                
                {/* Connection status */}
                <div className="flex items-center justify-between mt-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      connectionStatus === 'online' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-gray-500">
                      {connectionStatus === 'online' ? 'Connecté' : 'Hors ligne'}
                    </span>
                  </div>
                  <div className="text-gray-400">
                    {inputValue.length}/500
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;