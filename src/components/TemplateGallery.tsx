import React, { useState, useEffect } from 'react';
import { QuoteTemplate, TemplateCategory } from '../types';
import { Search, Tag, Filter, X, Download, Upload, Plus } from 'lucide-react';
import { PulseCard } from './ui/PulseCard';

interface TemplateGalleryProps {
  templates: QuoteTemplate[];
  onSelectTemplate: (template: QuoteTemplate) => void;
  onImportTemplate: (template: QuoteTemplate) => void;
  onExportTemplate: (templateId: string) => void;
  onCreateTemplate: () => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  templates,
  onSelectTemplate,
  onImportTemplate,
  onExportTemplate,
  onCreateTemplate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredTemplates, setFilteredTemplates] = useState(templates);

  // Extract all unique categories and tags
  const categories: TemplateCategory[] = [
    { id: 'all', name: 'All Templates', icon: 'grid' },
    { id: 'inspirational', name: 'Inspirational', icon: 'lightbulb' },
    { id: 'quotes', name: 'Famous Quotes', icon: 'quote' },
    { id: 'minimal', name: 'Minimal', icon: 'circle' },
    { id: 'colorful', name: 'Colorful', icon: 'palette' },
    { id: 'business', name: 'Business', icon: 'briefcase' },
    { id: 'social', name: 'Social Media', icon: 'instagram' },
  ];

  const allTags = Array.from(
    new Set(
      templates
        .filter(t => t.tags)
        .flatMap(t => t.tags || [])
    )
  );

  // Filter templates based on search query, category, and tags
  useEffect(() => {
    let filtered = [...templates];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        template => 
          template.name.toLowerCase().includes(query) ||
          (template.category && template.category.toLowerCase().includes(query)) ||
          (template.tags && template.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(
        template => selectedTags.every(tag => template.tags?.includes(tag))
      );
    }
    
    setFilteredTemplates(filtered);
  }, [searchQuery, selectedCategory, selectedTags, templates]);

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTags([]);
  };

  const handleImportTemplate = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files?.length) return;
      
      const file = target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const template = JSON.parse(content) as QuoteTemplate;
          onImportTemplate(template);
        } catch (error) {
          console.error('Failed to import template:', error);
          alert('Failed to import template. The file format may be invalid.');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  return (
    <div className="template-gallery">
      <div className="controls flex flex-col space-y-4 mb-4">
        <div className="search-container relative">
          <input
            type="text"
            className="search-input w-full py-2 px-10 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery('')}
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="category-tabs flex-1 overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex space-x-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-tab whitespace-nowrap px-3 py-1 rounded-full text-sm
                    ${selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                  onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          <button
            className={`filter-button ml-2 p-2 rounded-full ${showFilters ? 'bg-blue-100 text-blue-500 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
          </button>
        </div>
        
        {showFilters && (
          <div className="filter-panel bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Filter by Tags</h3>
              {selectedTags.length > 0 && (
                <button
                  className="text-xs text-blue-500 hover:text-blue-600"
                  onClick={() => setSelectedTags([])}
                >
                  Clear Tags
                </button>
              )}
            </div>
            
            <div className="tags-container flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`tag-button px-2 py-1 rounded-full text-xs flex items-center
                    ${selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                  onClick={() => handleTagClick(tag)}
                >
                  <Tag size={12} className="mr-1" />
                  {tag}
                </button>
              ))}
              
              {allTags.length === 0 && (
                <p className="text-xs text-gray-500">No tags available</p>
              )}
            </div>
            
            {(searchQuery || selectedCategory || selectedTags.length > 0) && (
              <div className="flex justify-end mt-3">
                <button
                  className="clear-filters-button text-xs text-gray-500 hover:text-gray-700 flex items-center"
                  onClick={clearFilters}
                >
                  <X size={12} className="mr-1" />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {filteredTemplates.length > 0 ? (
        <div className="templates-grid grid grid-cols-2 gap-4">
          {/* Create New Template Card */}
          <PulseCard
            key="create-new"
            onClick={onCreateTemplate}
            icon={<Plus size={20} />}
            title="Create New"
            description="Start with a blank template"
            variant="blue"
            size="md"
            glowEffect={true}
            interactive={true}
            showGridLines={true}
            hoverScale={1.03}
          />
          
          {/* Import Template Card */}
          <PulseCard
            key="import"
            onClick={handleImportTemplate}
            icon={<Upload size={20} />}
            title="Import Template"
            description="Import from JSON file"
            variant="purple"
            size="md"
            glowEffect={true}
            interactive={true}
            showGridLines={true}
            hoverScale={1.03}
          />
        
          {filteredTemplates.map(template => (
            <div key={template.id} className="template-card relative">
              <div 
                className="template-preview h-40 rounded-lg mb-2 overflow-hidden cursor-pointer"
                style={{ 
                  backgroundColor: template.backgroundColor,
                  background: template.backgroundGradient ? 
                    `linear-gradient(${template.backgroundGradient.angle || 45}deg, ${template.backgroundGradient.colors.join(', ')})` :
                    undefined
                }}
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex h-full items-center justify-center p-4 text-center"
                  style={{ 
                    color: template.textColor,
                    fontFamily: template.fontFamily,
                    fontSize: '16px'
                  }}
                >
                  {template.name}
                </div>
              </div>
              
              <div className="template-info flex justify-between items-center">
                <h3 className="template-name text-sm font-medium truncate">{template.name}</h3>
                
                <button
                  className="export-button p-1 text-gray-500 hover:text-blue-500"
                  onClick={() => onExportTemplate(template.id)}
                  title="Export template"
                >
                  <Download size={16} />
                </button>
              </div>
              
              {template.tags && template.tags.length > 0 && (
                <div className="template-tags flex flex-wrap gap-1 mt-1">
                  {template.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag} 
                      className="tag text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="tag text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results flex flex-col items-center justify-center p-8">
          <div className="icon-container mb-4 p-4 rounded-full bg-gray-100 dark:bg-gray-800">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No templates found</h3>
          <p className="text-gray-500 text-center mb-4">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button
            className="reset-button px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            onClick={clearFilters}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
