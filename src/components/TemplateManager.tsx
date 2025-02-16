import React from 'react';
import { useTemplates } from '../hooks/useTemplates';
import { QuoteSettings } from '../types';
import { Save, Trash, Plus } from 'lucide-react';

interface TemplateManagerProps {
  currentTemplate: QuoteSettings;
  onLoadTemplate: (template: QuoteSettings) => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  currentTemplate,
  onLoadTemplate,
}) => {
  const { templates, saveTemplate, deleteTemplate } = useTemplates();
  const [isOpen, setIsOpen] = React.useState(false);
  const [templateName, setTemplateName] = React.useState('');

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    
    saveTemplate({
      ...currentTemplate,
      name: templateName,
      id: `template-${Date.now()}`
    });
    
    setTemplateName('');
  };

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template name..."
            className="flex-1 px-3 py-1.5 bg-surface-light rounded-lg border border-border text-white"
          />
          <button
            onClick={handleSaveTemplate}
            disabled={!templateName.trim()}
            className="p-2 rounded-lg bg-primary hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Save current template"
          >
            <Save size={18} />
          </button>
        </div>

        <div className="space-y-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-3 bg-surface-light rounded-lg hover:bg-opacity-80 transition-colors"
            >
              <button
                onClick={() => onLoadTemplate(template)}
                className="flex-1 text-left text-gray-200 hover:text-white"
              >
                {template.name}
              </button>
              <button
                onClick={() => deleteTemplate(template.id)}
                className="p-1.5 text-gray-400 hover:text-error transition-colors"
                title="Delete template"
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
          
          {templates.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Plus size={32} className="mx-auto mb-2 opacity-50" />
              <p>Save your first template</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};