"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Minimize2, Star, Calendar, CreditCard, MessageCircle, Zap, Shield, Globe, BarChart3, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: string;
  metadata?: Record<string, string | number | boolean>;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  message: string;
  type: 'question' | 'action';
}

const AdvancedChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm VelocityAI's assistant. I help businesses automate customer service, order processing, and appointments. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const quickActions: QuickAction[] = [
    { id: '1', label: 'Pricing', icon: <CreditCard className="w-4 h-4" />, message: 'What are your pricing plans?', type: 'question' },
    { id: '2', label: 'Demo', icon: <Star className="w-4 h-4" />, message: 'Schedule a demo', type: 'action' },
    { id: '3', label: 'Features', icon: <Bot className="w-4 h-4" />, message: 'What features do you offer?', type: 'question' },
    { id: '4', label: 'Industries', icon: <MessageCircle className="w-4 h-4" />, message: 'What industries do you work with?', type: 'question' },
  ];

  const getAIResponse = (message: string): { content: string; type?: string; metadata?: Record<string, string | number | boolean> } => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      return {
        content: "Here are our plans:\n\n**Starter** - $49/month\n• 1,000 conversations\n• Website chat only\n• Basic templates\n\n**Professional** - $149/month (Most Popular)\n• 5,000 conversations\n• Multi-channel (WhatsApp, SMS, Website)\n• Advanced AI training\n• Order processing + payments\n• Analytics dashboard\n\n**Business** - $299/month\n• Unlimited conversations\n• White-label options\n• API access\n• Priority support\n\nEarly customers get 50% off for 6 months!",
        metadata: { context: 'pricing_shown' }
      };
    }

    if (lowerMessage.includes('demo') || lowerMessage.includes('try') || lowerMessage.includes('see')) {
      return {
        content: "I'd love to show you a personalized demo! You're already talking to a simple version of our AI. The full platform can:\n\n• Work across WhatsApp, SMS, and your website\n• Process orders and payments\n• Book appointments automatically\n• Qualify leads intelligently\n• Provide detailed analytics\n\nShall I collect your details for a full demo?",
        type: 'action',
        metadata: { action: 'schedule_demo' }
      };
    }

    if (lowerMessage.includes('features') || lowerMessage.includes('what can') || lowerMessage.includes('capabilities')) {
      return {
        content: "VelocityAI can handle:\n\n**Customer Service**\n• Answer FAQs 24/7\n• Escalate complex issues to humans\n• Maintain conversation context\n\n**Order Management**\n• Take orders naturally\n• Process payments via Stripe\n• Send confirmations & tracking\n\n**Appointment Booking**\n• Check real-time availability\n• Book & confirm appointments\n• Send automated reminders\n\n**Lead Generation**\n• Qualify prospects intelligently\n• Capture contact information\n• Route to sales team\n\nWhich area interests you most?",
        metadata: { context: 'features_explained' }
      };
    }

    if (lowerMessage.includes('industries') || lowerMessage.includes('business type') || lowerMessage.includes('restaurant') || lowerMessage.includes('retail')) {
      return {
        content: "We specialize in several industries:\n\n**Restaurants & Food Service**\n• Take orders, handle dietary questions\n• Table reservations, delivery tracking\n• Menu recommendations\n\n**Professional Services**\n• Schedule consultations\n• Screen potential clients\n• Explain services & fees\n\n**E-commerce & Retail**\n• Product recommendations\n• Order tracking, returns\n• Inventory questions\n\n**Personal Services**\n• Appointment booking\n• Service explanations\n• Pricing inquiries\n\nWhat industry is your business in?",
        metadata: { context: 'industries_shown' }
      };
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('speak') || lowerMessage.includes('human')) {
      setShowContactForm(true);
      return {
        content: "I'd love to connect you with our team! They can provide a personalized demo and answer specific questions about your business needs.",
        type: 'action',
        metadata: { action: 'show_contact_form' }
      };
    }

    return {
      content: "That's a great question! While I'm a demo version, our full AI platform can handle much more sophisticated conversations. Would you like to see how it would work for your specific business?",
      metadata: { context: 'fallback_with_demo_offer' }
    };
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        isUser: false,
        timestamp: new Date(),
        type: response.type || 'text',
        metadata: response.metadata,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center space-x-2 p-3 bg-gray-100 rounded-2xl rounded-bl-md max-w-xs"
    >
      <Bot className="w-4 h-4 text-purple-600" />
      <div className="flex space-x-1">
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-purple-600 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay }}
          />
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isMinimized ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl border w-96 h-[500px] flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">VelocityAI</h3>
                  <p className="text-xs opacity-90">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.isUser ? 'bg-purple-600' : 'bg-white border-2 border-purple-200'
                    }`}>
                      {message.isUser ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div className={`rounded-2xl p-3 ${
                      message.isUser 
                        ? 'bg-purple-600 text-white rounded-br-md' 
                        : 'bg-white shadow-sm rounded-bl-md border'
                    }`}>
                      <div className="text-sm whitespace-pre-line">{message.content}</div>
                      <div className={`text-xs mt-1 opacity-70 ${message.isUser ? 'text-purple-100' : 'text-gray-500'}`}>
                        {isClient ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 2 && (
              <div className="p-3 bg-white border-t">
                <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => sendMessage(action.message)}
                      className="flex items-center space-x-2 p-2 bg-purple-50 text-purple-700 rounded-lg text-xs hover:bg-purple-100 transition-colors"
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-white border-t">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isTyping}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMinimized(false)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowContactForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Get Personalized Demo</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Business Type (e.g., Restaurant, Law Firm)"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                  placeholder="What would you like to automate?"
                  className="w-full p-3 border rounded-lg h-20 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowContactForm(false);
                      setTimeout(() => {
                        const successMessage: Message = {
                          id: Date.now().toString(),
                          content: "Perfect! Your demo request has been submitted. Our team will reach out within 24 hours. In the meantime, feel free to keep exploring!",
                          isUser: false,
                          timestamp: new Date(),
                        };
                        setMessages(prev => [...prev, successMessage]);
                      }, 500);
                    }}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Schedule Demo
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VelocityAILandingPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {isClient && (
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 4 + 2,
                  height: Math.random() * 4 + 2,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-bold mb-6"
            >
              VelocityAI ⚡
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl mb-4 opacity-90"
            >
              AI That Actually Runs Your Business
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl opacity-80 mb-8 leading-relaxed"
            >
              From customer service to order taking, appointment booking to lead generation - 
              our AI handles it all while you focus on growing. No more missed opportunities, 
              no more 9-to-5 limitations.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-6 mb-8"
            >
              <div className="text-center">
                <div className="text-4xl font-bold">24/7</div>
                <div className="opacity-80 text-sm">Always Available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">3x</div>
                <div className="opacity-80 text-sm">Faster Response</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">90%</div>
                <div className="opacity-80 text-sm">Cost Savings</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="space-y-4"
            >
              <button className="bg-white text-purple-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg shadow-lg mr-4">
                Try The Demo →
              </button>
              <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-purple-600 transition-colors text-lg">
                Watch Video
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Live Demo Below ↓</h3>
              <p className="text-white/80 mb-4">Try our AI assistant right now. Ask about features, pricing, or schedule a personalized demo!</p>
              <div className="flex items-center space-x-2 text-white/60 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>AI Assistant Active</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <Zap className="w-8 h-8 text-yellow-400 mb-2" />
                <h4 className="font-semibold text-white">Instant Setup</h4>
                <p className="text-white/80 text-sm">Live in 30 minutes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <Shield className="w-8 h-8 text-green-400 mb-2" />
                <h4 className="font-semibold text-white">Secure & Private</h4>
                <p className="text-white/80 text-sm">Enterprise-grade security</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <Globe className="w-8 h-8 text-blue-400 mb-2" />
                <h4 className="font-semibold text-white">Multi-Channel</h4>
                <p className="text-white/80 text-sm">Website, WhatsApp, SMS</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <BarChart3 className="w-8 h-8 text-purple-400 mb-2" />
                <h4 className="font-semibold text-white">Smart Analytics</h4>
                <p className="text-white/80 text-sm">Optimize performance</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              See What Our AI Can Do
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The chatbot you just tried is just a simple demo. Here's what the full platform delivers 
              for businesses like yours.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageCircle className="w-12 h-12 text-purple-600" />,
                title: "Customer Service",
                description: "Handle FAQs, complaints, and support tickets automatically. Escalate complex issues to humans when needed.",
                features: ["24/7 availability", "Context awareness", "Sentiment analysis", "Smart escalation"]
              },
              {
                icon: <CreditCard className="w-12 h-12 text-green-600" />,
                title: "Order Processing",
                description: "Take orders, process payments, manage inventory, and send confirmations - all through natural conversation.",
                features: ["Stripe integration", "Inventory sync", "Order tracking", "Payment reminders"]
              },
              {
                icon: <Calendar className="w-12 h-12 text-blue-600" />,
                title: "Appointment Booking",
                description: "Check availability, book appointments, send reminders, and handle rescheduling automatically.",
                features: ["Calendar sync", "Automated reminders", "Time zone handling", "Cancellation management"]
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8">Simple, Transparent Pricing</h2>
            <p className="text-xl opacity-90 mb-12">Choose the plan that fits your business. Upgrade or downgrade anytime.</p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "$49",
                  description: "Perfect for small businesses",
                  features: ["1,000 conversations/month", "Website chat only", "Basic templates", "Email support"],
                  popular: false
                },
                {
                  name: "Professional",
                  price: "$149",
                  description: "Most popular choice",
                  features: ["5,000 conversations/month", "Multi-channel support", "Advanced AI training", "Order processing", "Analytics dashboard", "Priority support"],
                  popular: true
                },
                {
                  name: "Business",
                  price: "$299",
                  description: "For growing enterprises",
                  features: ["Unlimited conversations", "White-label options", "API access", "Custom integrations", "Dedicated success manager", "24/7 phone support"],
                  popular: false
                }
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-2xl p-8 ${plan.popular ? 'bg-gradient-to-b from-purple-600 to-blue-600 scale-105 border-2 border-purple-400' : 'bg-gray-800'}`}
                >
                  {plan.popular && (
                    <div className="bg-yellow-400 text-black text-sm font-bold py-1 px-3 rounded-full inline-block mb-4">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-2">{plan.price}<span className="text-lg opacity-70">/month</span></div>
                  <p className="opacity-80 mb-6">{plan.description}</p>
                  <ul className="space-y-3 text-left mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular 
                      ? 'bg-white text-purple-600 hover:bg-gray-100' 
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}>
                    Start Free Trial
                  </button>
                </motion.div>
              ))}
            </div>

            <p className="text-sm opacity-75 mt-8">
              Launch Special: First 100 customers get 50% off for 6 months
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to Automate Your Business?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join hundreds of businesses already using VelocityAI to provide better customer service, 
              increase sales, and save time.
            </p>
            <div className="space-x-4">
              <button className="bg-purple-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-purple-700 transition-colors text-lg">
                Start Free Trial
              </button>
              <button className="border-2 border-purple-600 text-purple-600 font-bold py-4 px-8 rounded-lg hover:bg-purple-600 hover:text-white transition-colors text-lg">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <AdvancedChatbot />
    </div>
  );
};

export default VelocityAILandingPage;