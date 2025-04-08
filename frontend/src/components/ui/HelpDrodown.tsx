import React from 'react';
import { 
  DocumentTextIcon, 
  BookOpenIcon, 
  AcademicCapIcon, 
  ChatBubbleLeftRightIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

interface HelpDropdownProps {
  onClose: () => void;
}

const HelpDropdown: React.FC<HelpDropdownProps> = ({ onClose }) => {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.help-dropdown')) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const helpOptions = [
    {
      id: 'documentation',
      label: 'Documentation',
      description: 'View detailed product documentation',
      icon: <DocumentTextIcon className="h-5 w-5" />
    },
    {
      id: 'guides',
      label: 'User Guides',
      description: 'Step-by-step guides for common tasks',
      icon: <BookOpenIcon className="h-5 w-5" />
    },
    {
      id: 'tutorials',
      label: 'Video Tutorials',
      description: 'Watch helpful video tutorials',
      icon: <VideoCameraIcon className="h-5 w-5" />
    },
    {
      id: 'faqs',
      label: 'FAQs',
      description: 'Frequently asked questions',
      icon: <AcademicCapIcon className="h-5 w-5" />
    },
    {
      id: 'support',
      label: 'Contact Support',
      description: 'Get help from our support team',
      icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />
    }
  ];

  const handleHelpOptionClick = (id: string) => {
    console.log(`Help option clicked: ${id}`);
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg py-1 z-50 help-dropdown">
      <div className="px-4 py-2 border-b border-gray-700">
        <h3 className="text-sm font-medium text-white">Help & Resources</h3>
      </div>
      
      <div className="py-1">
        {helpOptions.map(option => (
          <button
            key={option.id}
            className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-start"
            onClick={() => handleHelpOptionClick(option.id)}
          >
            <span className="text-accent-teal mt-0.5 mr-3">
              {option.icon}
            </span>
            <div>
              <p className="text-sm font-medium text-white">{option.label}</p>
              <p className="text-xs text-gray-400">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    
      <div className="px-4 py-3 border-t border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search help topics..."
            className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-accent-teal focus:border-accent-teal"
          />
        </div>
      </div>
    </div>
  );
};

export default HelpDropdown;