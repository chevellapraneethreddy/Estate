import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import type { Lead } from '../../context/AppContext';
import { ChatIcon, MicIcon, SendIcon } from '../Common/Icons';

interface PropertyAssistantProps {
  leadPhone?: string;
  leadName?: string;
  onQualificationChange?: (metrics: Partial<Lead>) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'buyer';
  text: string;
  timestamp: Date;
}

export const PropertyAssistant: React.FC<PropertyAssistantProps> = ({ 
  onQualificationChange 
}) => {
  const { properties, activePropertyId, activeInteriorStyle } = useApp();
  const property = properties.find(p => p.id === activePropertyId) || properties[0];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `Hello! I am your PropVision AI assistant for ${property.name}. I can answer questions about specifications, amenities, pricing, or help you schedule a site visit. What would you like to know?`,
      timestamp: new Date()
    }
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Qualification dialog state
  const [qualStep, setQualStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Web Speech API references
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Initialize Web Speech APIs
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputText(transcript);
            handleSendMessage(transcript);
          }
        };
        recognitionRef.current = recognition;
      }
      synthRef.current = window.speechSynthesis;
    }
  }, [activePropertyId]);

  // Clean speech when switching or unmounting
  useEffect(() => {
    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel(); // stop previous speech

    const cleanText = text.replace(/\{.*\}/g, '').replace(/https?:\/\/\S+/g, 'link');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    // Choose a nice sounding default voice if possible
    const voices = synthRef.current.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    synthRef.current.speak(utterance);
  };

  const toggleListen = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition API is not supported in this browser. Please type your query.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (synthRef.current) synthRef.current.cancel();
      recognitionRef.current.start();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    // Clear input
    setInputText('');

    const newBuyerMsg: Message = {
      id: `msg-${Date.now()}-buyer`,
      sender: 'buyer',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newBuyerMsg]);

    // Generate response in a brief delay to simulate thinking
    setTimeout(() => {
      generateAIResponse(text);
    }, 800);
  };

  const generateAIResponse = (buyerText: string) => {
    const lowerText = buyerText.toLowerCase();
    let reply = "";

    // Step-by-step query matching
    if (lowerText.includes('bedroom') || lowerText.includes('bhk') || lowerText.includes('rooms')) {
      reply = `This property, ${property.name}, features exactly ${property.bedrooms} bedrooms with separate attached bathrooms and individual wardrobe alcoves.`;
    } else if (lowerText.includes('bath') || lowerText.includes('washroom') || lowerText.includes('toilet')) {
      reply = `It includes ${property.bathrooms} premium bathrooms fitted with water-efficient chrome or brass hardware. The master ensuite bathroom has designer vanity lights.`;
    } else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('payment') || lowerText.includes('pricing')) {
      reply = `The pricing for ${property.name} is listed at ${property.price}. We offer developer-backed financing plans with only a 10% downpayment booking fee.`;
    } else if (lowerText.includes('amenit') || lowerText.includes('pool') || lowerText.includes('gym') || lowerText.includes('clubhouse') || lowerText.includes('parking')) {
      reply = `You get premium facilities including: ${property.amenities.join(', ')}. Security is monitored 24/7.`;
    } else if (lowerText.includes('area') || lowerText.includes('sqft') || lowerText.includes('dimension') || lowerText.includes('size')) {
      reply = `The total built-up area is ${property.area}. The Great Living room alone is ${property.rooms.find(r => r.id === 'living')?.dimensions || 'spacious'}.`;
    } else if (lowerText.includes('location') || lowerText.includes('address') || lowerText.includes('where')) {
      reply = `${property.name} is situated in the premium locality of ${property.location}, which has close access to highways and shopping centers.`;
    } else if (lowerText.includes('visit') || lowerText.includes('book') || lowerText.includes('schedule') || lowerText.includes('tour')) {
      reply = `I would love to help you book a physical walkthrough! Please choose your preferred date and slot in the booking panel below and I will immediately confirm it.`;
    } else {
      reply = `That is an interesting question about ${property.name}. It is crafted with top-tier concrete core structural elements and customizable ${activeInteriorStyle} interior layouts. Is there anything else about this specific project I can check for you?`;
    }

    // Embed qualification checks organic dialogues
    let qualificationFollowUp = "";
    if (qualStep === 0) {
      qualificationFollowUp = " By the way, what budget range are you looking at for your property search?";
      setQualStep(1);
    } else if (qualStep === 1) {
      // Save budget answer
      const updatedAnswers = { ...answers, budget: buyerText };
      setAnswers(updatedAnswers);
      analyzeQualification(updatedAnswers);
      
      qualificationFollowUp = " Excellent. And what is your expected move-in timeline (e.g. immediate, within 3 months, or just exploring)?";
      setQualStep(2);
    } else if (qualStep === 2) {
      const updatedAnswers = { ...answers, timeline: buyerText };
      setAnswers(updatedAnswers);
      analyzeQualification(updatedAnswers);
      
      qualificationFollowUp = " Got it. Finally, how many family members will be residing in the home?";
      setQualStep(3);
    } else if (qualStep === 3) {
      const updatedAnswers = { ...answers, familySize: buyerText };
      setAnswers(updatedAnswers);
      analyzeQualification(updatedAnswers);
      setQualStep(4); // Completed dialog
    }

    const finalReply = reply + (qualificationFollowUp ? `\n\n${qualificationFollowUp}` : "");

    const newAIMsg: Message = {
      id: `msg-${Date.now()}-ai`,
      sender: 'ai',
      text: finalReply,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newAIMsg]);
    
    // Auto-read response out loud
    speakText(finalReply);
  };

  const analyzeQualification = (currentAnswers: Record<string, string>) => {
    if (!onQualificationChange) return;

    let intentScore = 40;
    let readinessScore = 30;
    let classification: Lead['classification'] = 'cold';
    
    // 1. Analyze budget
    if (currentAnswers.budget) {
      const bText = currentAnswers.budget.toLowerCase();
      if (bText.includes('k') || bText.includes('000') || bText.includes('million') || bText.includes('lakh') || bText.includes('cr') || bText.includes('$')) {
        intentScore += 20;
      }
    }

    // 2. Analyze timeline
    if (currentAnswers.timeline) {
      const tText = currentAnswers.timeline.toLowerCase();
      if (tText.includes('immediate') || tText.includes('now') || tText.includes('1') || tText.includes('asap')) {
        readinessScore += 50;
        intentScore += 20;
      } else if (tText.includes('3') || tText.includes('month')) {
        readinessScore += 35;
        intentScore += 15;
      } else {
        readinessScore += 10;
      }
    }

    // 3. Analyze family size
    let familySize = 2;
    if (currentAnswers.familySize) {
      const numMatch = currentAnswers.familySize.match(/\d+/);
      if (numMatch) {
        familySize = parseInt(numMatch[0]);
      }
      intentScore += 10;
    }

    const convProbability = Math.round((intentScore + readinessScore) / 2);
    if (convProbability >= 75) {
      classification = 'hot';
    } else if (convProbability >= 45) {
      classification = 'warm';
    }

    onQualificationChange({
      budget: currentAnswers.budget || 'Not specified',
      moveTimeline: currentAnswers.timeline || 'Flexible',
      familySize: familySize,
      intentScore: Math.min(intentScore, 100),
      readinessScore: Math.min(readinessScore, 100),
      conversionProbability: Math.min(convProbability, 100),
      classification
    });
  };

  const suggestions = [
    `How many bedrooms?`,
    `What are the amenities?`,
    `What is the pricing plan?`,
    `Schedule a site visit`
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '400px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      {/* Header of Assistant */}
      <div style={{
        padding: '16px',
        background: 'var(--color-primary-light)',
        color: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'var(--color-primary)',
            color: '#fff',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ChatIcon size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>AI Property Assistant</h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Online | Voice-Enabled</span>
          </div>
        </div>
        {isSpeaking && (
          <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
            <span style={{ width: '4px', height: '12px', background: 'var(--color-primary)', borderRadius: '2px', animation: 'walkBob 0.8s infinite ease-in-out' }} />
            <span style={{ width: '4px', height: '18px', background: 'var(--color-primary)', borderRadius: '2px', animation: 'walkBob 0.8s infinite ease-in-out', animationDelay: '0.2s' }} />
            <span style={{ width: '4px', height: '10px', background: 'var(--color-primary)', borderRadius: '2px', animation: 'walkBob 0.8s infinite ease-in-out', animationDelay: '0.4s' }} />
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flexGrow: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxHeight: '380px'
      }}>
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isAI ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isAI ? 'flex-start' : 'flex-end',
                gap: '4px'
              }}
            >
              <div
                style={{
                  background: isAI ? 'var(--bg-tertiary)' : 'var(--color-primary)',
                  color: isAI ? 'var(--text-primary)' : '#ffffff',
                  padding: '10px 14px',
                  borderRadius: isAI ? '0px 14px 14px 14px' : '14px 14px 0px 14px',
                  fontSize: '0.85rem',
                  whiteSpace: 'pre-line',
                  lineHeight: '1.4',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {msg.text}
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {suggestions.map((sug, idx) => (
          <button
            key={idx}
            onClick={() => handleSuggestionClick(sug)}
            style={{
              padding: '6px 12px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input panel with Voice button */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-tertiary)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <button
          onClick={toggleListen}
          style={{
            background: isListening ? 'var(--color-danger)' : 'var(--color-primary-light)',
            color: isListening ? '#ffffff' : 'var(--color-primary)',
            border: 'none',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            boxShadow: isListening ? '0 0 10px rgba(239, 68, 68, 0.4)' : 'none'
          }}
          title={isListening ? "Stop listening" : "Talk to assistant"}
        >
          <MicIcon size={18} />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isListening ? "Listening..." : "Ask the AI assistant..."}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          style={{
            flexGrow: 1,
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-full)',
            padding: '10px 16px',
            fontSize: '0.85rem',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            outline: 'none'
          }}
          disabled={isListening}
        />

        <button
          onClick={() => handleSendMessage()}
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
          title="Send inquiry"
        >
          <SendIcon size={18} />
        </button>
      </div>

    </div>
  );
};
