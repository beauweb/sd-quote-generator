import { useState, useEffect } from 'react';
import { QuoteTemplate } from '../types';

export interface TemplateManager {
  templates: QuoteTemplate[];
  saveTemplate: (template: QuoteTemplate) => void;
  deleteTemplate: (templateId: string) => void;
  loadTemplate: (templateId: string) => QuoteTemplate | null;
}

export function useTemplates(): TemplateManager {
  const [templates, setTemplates] = useState<QuoteTemplate[]>(() => {
    const saved = localStorage.getItem('quote-templates');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('quote-templates', JSON.stringify(templates));
  }, [templates]);

  const saveTemplate = (template: QuoteTemplate) => {
    const templateWithId = {
      ...template,
      id: template.id || `template-${Date.now()}`
    };
    
    setTemplates(prevTemplates => {
      const existingIndex = prevTemplates.findIndex(t => t.id === templateWithId.id);
      if (existingIndex >= 0) {
        const newTemplates = [...prevTemplates];
        newTemplates[existingIndex] = templateWithId;
        return newTemplates;
      }
      return [...prevTemplates, templateWithId];
    });
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prevTemplates => 
      prevTemplates.filter(template => template.id !== templateId)
    );
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template || null;
  };

  return {
    templates,
    saveTemplate,
    deleteTemplate,
    loadTemplate
  };
}