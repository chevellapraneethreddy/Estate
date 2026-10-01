import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Property, INITIAL_PROPERTIES } from '../data/properties';
import { generateHouseSplat } from '../utils/splatGenerator';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  budget: string;
  preferredType: string;
  moveTimeline: string;
  familySize: number;
  preferredLocation: string;
  intentScore: number;
  readinessScore: number;
  conversionProbability: number;
  classification: 'hot' | 'warm' | 'cold';
  stage: 'new' | 'contacted' | 'qualified' | 'visit' | 'negotiation' | 'closed';
  notes: string;
  createdAt: string;
}

export interface SiteVisit {
  id: string;
  leadId?: string;
  leadName: string;
  leadPhone: string;
  propertyName: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'cancelled' | 'pending';
}

export interface WhatsAppSequence {
  id: string;
  name: string;
  triggerEvent: string;
  delayText: string;
  messageTemplate: string;
  isActive: boolean;
}

export interface WhatsAppMessage {
  id: string;
  phone: string;
  text: string;
  timestamp: string;
  type: 'sent' | 'received'; // sent: from agent to buyer, received: from buyer back to agent
  documentName?: string;
  documentType?: 'pdf' | 'mp4';
}

export type UserRole = 'admin' | 'builder' | 'agent' | 'customer';
export type AppView = 'landing' | 'dashboard' | 'property-landing' | 'auth-login' | 'auth-signup' | 'auth-reset' | 'editor';

interface AppContextProps {
  properties: Property[];
  addProperty: (property: Property) => void;
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLeadStage: (leadId: string, newStage: Lead['stage']) => void;
  updateLeadNotes: (leadId: string, notes: string) => void;
  siteVisits: SiteVisit[];
  bookVisit: (visit: Omit<SiteVisit, 'id'>) => void;
  updateVisitStatus: (visitId: string, status: SiteVisit['status']) => void;
  whatsappSequences: WhatsAppSequence[];
  toggleSequenceActive: (id: string) => void;
  updateSequenceTemplate: (id: string, newText: string) => void;
  whatsappMessages: WhatsAppMessage[];
  sendWhatsAppMessage: (phone: string, text: string, type: 'sent' | 'received', docName?: string, docType?: 'pdf' | 'mp4') => void;
  activePropertyId: string;
  setActivePropertyId: (id: string) => void;
  activeInteriorStyle: string;
  setActiveInteriorStyle: (style: string) => void;
  activePreviewMode: 'furnished' | 'empty';
  setActivePreviewMode: (mode: 'furnished' | 'empty') => void;
  activeTimeMode: 'day' | 'night';
  setActiveTimeMode: (mode: 'day' | 'night') => void;
  activeViewType: 'interior' | 'exterior';
  setActiveViewType: (type: 'interior' | 'exterior') => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  viewingPropertyId: string | null;
  setViewingPropertyId: (id: string | null) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [activePropertyId, setActivePropertyId] = useState<string>('emerald-bay');
  const [activeInteriorStyle, setActiveInteriorStyle] = useState<string>('modern');
  const [activePreviewMode, setActivePreviewMode] = useState<'furnished' | 'empty'>('furnished');
  const [activeTimeMode, setActiveTimeMode] = useState<'day' | 'night'>('day');
  const [activeViewType, setActiveViewType] = useState<'interior' | 'exterior'>('interior');

  const [userRole, setUserRole] = useState<UserRole>('builder');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [viewingPropertyId, setViewingPropertyId] = useState<string | null>(null);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  // Seed Leads
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'lead-1',
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      phone: '+91 98765 43210',
      budget: '$600,000 - $700,000',
      preferredType: 'Apartment',
      moveTimeline: 'Within 3 Months',
      familySize: 3,
      preferredLocation: 'Marina District',
      intentScore: 88,
      readinessScore: 92,
      conversionProbability: 85,
      classification: 'hot',
      stage: 'visit',
      notes: 'Interested in the water-facing view. Wants to verify balcony spacing. Site visit scheduled for Sunday.',
      createdAt: '2026-06-18T10:30:00Z'
    },
    {
      id: 'lead-2',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      phone: '+1 415 555 2671',
      budget: '$1,500,000 - $2,000,000',
      preferredType: 'Villa',
      moveTimeline: 'Immediate',
      familySize: 4,
      preferredLocation: 'Hillside Meadows',
      intentScore: 95,
      readinessScore: 98,
      conversionProbability: 92,
      classification: 'hot',
      stage: 'negotiation',
      notes: 'Premium buyer. Highly qualified. Enquired about custom Traditional Indian decor options in the villa.',
      createdAt: '2026-06-15T14:22:00Z'
    },
    {
      id: 'lead-3',
      name: 'Ananya Iyer',
      email: 'ananya.iyer@example.com',
      phone: '+91 87654 32109',
      budget: '$500,000 - $650,000',
      preferredType: 'Apartment',
      moveTimeline: '6 Months',
      familySize: 2,
      preferredLocation: 'Marina District',
      intentScore: 65,
      readinessScore: 50,
      conversionProbability: 58,
      classification: 'warm',
      stage: 'contacted',
      notes: 'First time buyer. Moving from Bangalore. Reviewing brochures and pricing plans.',
      createdAt: '2026-06-19T08:15:00Z'
    },
    {
      id: 'lead-4',
      name: 'Michael Chang',
      email: 'm.chang@example.com',
      phone: '+1 212 555 0192',
      budget: '$700,000 - $900,000',
      preferredType: 'Apartment',
      moveTimeline: 'Flexible',
      familySize: 1,
      preferredLocation: 'Downtown Core',
      intentScore: 40,
      readinessScore: 35,
      conversionProbability: 30,
      classification: 'cold',
      stage: 'new',
      notes: 'Left message requesting overall pricing structure. Cold lead for now.',
      createdAt: '2026-06-20T02:10:00Z'
    }
  ]);

  // Seed Site Visits
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>([
    {
      id: 'visit-1',
      leadId: 'lead-1',
      leadName: 'Rohan Sharma',
      leadPhone: '+91 98765 43210',
      propertyName: 'Emerald Bay Suite',
      date: '2026-06-22',
      timeSlot: '11:00 AM - 12:00 PM',
      status: 'confirmed'
    },
    {
      id: 'visit-2',
      leadId: 'lead-3',
      leadName: 'Ananya Iyer',
      leadPhone: '+91 87654 32109',
      propertyName: 'Emerald Bay Suite',
      date: '2026-06-24',
      timeSlot: '03:00 PM - 04:00 PM',
      status: 'pending'
    }
  ]);

  // Seed WhatsApp Sequences
  const [whatsappSequences, setWhatsappSequences] = useState<WhatsAppSequence[]>([
    {
      id: 'seq-1',
      name: 'Brochure Dispatch',
      triggerEvent: 'Lead Capture Form Submit',
      delayText: 'Instant (1 minute)',
      messageTemplate: 'Hi {name}! Thanks for checking out {property}. We have generated a personalized 3D tour brochure for you. Click here to download: {brochure_url}',
      isActive: true
    },
    {
      id: 'seq-2',
      name: 'Walkthrough Video Follow-up',
      triggerEvent: '3D Tour Exit',
      delayText: '1 Hour After Tour',
      messageTemplate: 'Hello {name}, did you like the {style} design of {property}? Here is a cinematic walkthrough video of the layout: {video_url}',
      isActive: true
    },
    {
      id: 'seq-3',
      name: 'Booking Confirmation',
      triggerEvent: 'Site Visit Booked',
      delayText: 'Instant',
      messageTemplate: 'Hey {name}! Your site visit to {property} is confirmed for {date} at {time}. Our executive will contact you at {phone}. Direction link: {map_url}',
      isActive: true
    },
    {
      id: 'seq-4',
      name: '24-Hour Visit Reminder',
      triggerEvent: '24 Hours Before Visit',
      delayText: '24 Hours Prior',
      messageTemplate: 'Reminder: Hi {name}, we look forward to meeting you tomorrow at {property} at {time}. Let us know if you need to reschedule.',
      isActive: true
    }
  ]);

  // Seed WhatsApp Messages log for simulator
  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>([
    {
      id: 'wm-1',
      phone: '+91 98765 43210',
      text: 'Hi Rohan Sharma! Thanks for checking out Emerald Bay Suite. We have generated a personalized 3D tour brochure for you.',
      timestamp: '2026-06-18T10:31:00Z',
      type: 'sent',
      documentName: 'emerald_bay_brochure.pdf',
      documentType: 'pdf'
    },
    {
      id: 'wm-2',
      phone: '+91 98765 43210',
      text: 'Thanks! The 3D view is incredible. Can I book a site visit to check the balcony view physically?',
      timestamp: '2026-06-18T10:45:00Z',
      type: 'received'
    },
    {
      id: 'wm-3',
      phone: '+91 98765 43210',
      text: 'Hey Rohan! Your site visit to Emerald Bay Suite is confirmed for 2026-06-22 at 11:00 AM - 12:00 PM.',
      timestamp: '2026-06-18T10:46:00Z',
      type: 'sent'
    }
  ]);

  const setTheme = (selectedTheme: 'light' | 'dark') => {
    setThemeState(selectedTheme);
    document.documentElement.setAttribute('data-theme', selectedTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    // Programmatically generate and write seed Gaussian Splats to server disk
    const emeraldBaySplat = generateHouseSplat("Emerald Bay Suite");
    const royalVillaSplat = generateHouseSplat("The Royal Villa");
    const sampleSplat = generateHouseSplat("Sample Model");

    fetch('/api/save-model?filename=emerald-bay.ply', { method: 'POST', body: emeraldBaySplat })
      .catch(err => console.error("Error writing emerald-bay.ply", err));
    fetch('/api/save-model?filename=royal-villa.ply', { method: 'POST', body: royalVillaSplat })
      .catch(err => console.error("Error writing royal-villa.ply", err));
    fetch('/api/save-model?filename=sample.ply', { method: 'POST', body: sampleSplat })
      .catch(err => console.error("Error writing sample.ply", err));
  }, []);

  const addProperty = (property: Property) => {
    setProperties((prev) => [property, ...prev]);
    setActivePropertyId(property.id);
  };

  const addLead = (lead: Lead) => {
    setLeads((prev) => [lead, ...prev]);
  };

  const updateLeadStage = (leadId: string, newStage: Lead['stage']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
    );
  };

  const updateLeadNotes = (leadId: string, notes: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, notes } : l))
    );
  };

  const bookVisit = (visit: Omit<SiteVisit, 'id'>) => {
    const newVisit: SiteVisit = {
      ...visit,
      id: `visit-${Date.now()}`
    };
    setSiteVisits((prev) => [...prev, newVisit]);

    // Automatically update lead stage to 'visit' if it exists
    const matchingLead = leads.find((l) => l.phone === visit.leadPhone || l.name === visit.leadName);
    if (matchingLead) {
      updateLeadStage(matchingLead.id, 'visit');
    } else {
      // Create new lead if they book without filling general form first
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        name: visit.leadName,
        email: `${visit.leadName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        phone: visit.leadPhone,
        budget: 'Not Specified',
        preferredType: 'Apartment',
        moveTimeline: 'Within 3 Months',
        familySize: 2,
        preferredLocation: 'Not Specified',
        intentScore: 75,
        readinessScore: 80,
        conversionProbability: 70,
        classification: 'warm',
        stage: 'visit',
        notes: `Automatically qualified. Booked a site visit for ${visit.date} at ${visit.timeSlot}.`,
        createdAt: new Date().toISOString()
      };
      addLead(newLead);
    }

    // Trigger confirmation WhatsApp message simulation if sequence is active
    const confSeq = whatsappSequences.find(s => s.id === 'seq-3');
    if (confSeq && confSeq.isActive) {
      setTimeout(() => {
        sendWhatsAppMessage(
          visit.leadPhone,
          `Hey ${visit.leadName}! Your site visit to ${visit.propertyName} is confirmed for ${visit.date} at ${visit.timeSlot}. Direction link: https://maps.google.com/?q=${encodeURIComponent(visit.propertyName)}`,
          'sent'
        );
      }, 1000);
    }
  };

  const updateVisitStatus = (visitId: string, status: SiteVisit['status']) => {
    setSiteVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, status } : v))
    );
  };

  const toggleSequenceActive = (id: string) => {
    setWhatsappSequences((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const updateSequenceTemplate = (id: string, newText: string) => {
    setWhatsappSequences((prev) =>
      prev.map((s) => (s.id === id ? { ...s, messageTemplate: newText } : s))
    );
  };

  const sendWhatsAppMessage = (phone: string, text: string, type: 'sent' | 'received', docName?: string, docType?: 'pdf' | 'mp4') => {
    const newMsg: WhatsAppMessage = {
      id: `wm-${Date.now()}`,
      phone,
      text,
      timestamp: new Date().toISOString(),
      type,
      documentName: docName,
      documentType: docType
    };
    setWhatsappMessages((prev) => [...prev, newMsg]);
  };

  return (
    <AppContext.Provider
      value={{
        properties,
        addProperty,
        leads,
        addLead,
        updateLeadStage,
        updateLeadNotes,
        siteVisits,
        bookVisit,
        updateVisitStatus,
        whatsappSequences,
        toggleSequenceActive,
        updateSequenceTemplate,
        whatsappMessages,
        sendWhatsAppMessage,
        activePropertyId,
        setActivePropertyId,
        activeInteriorStyle,
        setActiveInteriorStyle,
        activePreviewMode,
        setActivePreviewMode,
        activeTimeMode,
        setActiveTimeMode,
        activeViewType,
        setActiveViewType,
        userRole,
        setUserRole,
        isLoggedIn,
        setIsLoggedIn,
        currentView,
        setCurrentView,
        viewingPropertyId,
        setViewingPropertyId,
        theme,
        setTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
