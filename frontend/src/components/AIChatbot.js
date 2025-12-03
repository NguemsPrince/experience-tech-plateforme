import React, { useState, useEffect, useRef } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  UserIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const AIChatbot = ({ darkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  // Base de connaissances pour le chatbot
  const knowledgeBase = {
    greetings: [
      "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
      "Salut ! Je suis là pour vous assister.",
      "Hello ! Que puis-je faire pour vous ?"
    ],
    services: [
      "Nous proposons plusieurs services :",
      "• Développement web et mobile",
      "• Formations en informatique",
      "• Maintenance et support technique",
      "• Impression et design",
      "• Solutions e-commerce"
    ],
    formations: [
      "Nos formations incluent :",
      "• Programmation (Python, JavaScript, PHP)",
      "• Design graphique",
      "• Administration réseau",
      "• Maintenance informatique",
      "• Certifications professionnelles"
    ],
    contact: [
      "Vous pouvez nous contacter :",
      "📞 Téléphone : +235 60 29 05 10",
      "📱 WhatsApp : +235 62 40 20 51",
      "📧 Email : Contact@experiencetech-tchad.com",
      "📍 Adresse : Avenue Mareshal Idriss Deby Itno, Abéché"
    ],
    pricing: [
      "Nos tarifs varient selon le service :",
      "• Formations : 25,000 - 150,000 FCFA",
      "• Développement web : Sur devis",
      "• Maintenance : Abonnements mensuels",
      "• Impression : Tarifs à la demande"
    ],
    hours: [
      "Nous sommes ouverts :",
      "🕐 Lundi - Vendredi : 8h00 - 18h00",
      "🕐 Samedi : 8h00 - 14h00",
      "🕐 Dimanche : Fermé",
      "Service 24h/7j pour le support technique"
    ]
  };

  useEffect(() => {
    // Initialiser la conversation
    if (isOpen && messages.length === 0) {
      addMessage('bot', getRandomGreeting());
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getRandomGreeting = () => {
    const greetings = knowledgeBase.greetings;
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const processMessage = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Analyse de l'intention
    let response = '';
    
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      response = getRandomGreeting();
    } else if (lowerMessage.includes('service') || lowerMessage.includes('que faites-vous')) {
      response = knowledgeBase.services.join('\n');
    } else if (lowerMessage.includes('formation') || lowerMessage.includes('cours') || lowerMessage.includes('apprendre')) {
      response = knowledgeBase.formations.join('\n');
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('téléphone') || lowerMessage.includes('adresse')) {
      response = knowledgeBase.contact.join('\n');
    } else if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('coût')) {
      response = knowledgeBase.pricing.join('\n');
    } else if (lowerMessage.includes('heure') || lowerMessage.includes('ouvert') || lowerMessage.includes('fermé')) {
      response = knowledgeBase.hours.join('\n');
    } else if (lowerMessage.includes('merci') || lowerMessage.includes('aide')) {
      response = "De rien ! N'hésitez pas si vous avez d'autres questions. 😊";
    } else {
      // Réponse par défaut avec suggestions
      response = "Je ne suis pas sûr de comprendre votre question. Voici ce que je peux vous aider avec :\n\n• Nos services\n• Nos formations\n• Nos coordonnées\n• Nos tarifs\n• Nos horaires\n\nPouvez-vous reformuler votre question ?";
    }
    
    return response;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Ajouter le message utilisateur
    addMessage('user', userMessage);
    
    // Simuler la frappe
    setIsTyping(true);
    
    // Traitement avec délai pour simuler l'IA
    setTimeout(async () => {
      try {
        const response = await processMessage(userMessage);
        addMessage('bot', response);
      } catch (error) {
        addMessage('bot', "Désolé, une erreur s'est produite. Veuillez réessayer.");
      } finally {
        setIsTyping(false);
      }
    }, 1000 + Math.random() * 2000); // Délai variable entre 1-3 secondes
  };

  const addMessage = (sender, content) => {
    const newMessage = {
      id: Date.now(),
      sender,
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Bouton de chat flottant */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 z-50"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        </button>
      )}

      {/* Interface du chatbot */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <CpuChipIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Assistant IA</h3>
                <p className="text-xs text-blue-100">Expérience Tech</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CpuChipIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Indicateur de frappe */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <CpuChipIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* Suggestions rapides */}
            <div className="mt-2 flex flex-wrap gap-2">
              {['Services', 'Formations', 'Contact', 'Tarifs'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputMessage(suggestion)}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
