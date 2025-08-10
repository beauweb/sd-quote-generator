# SD Quote Generator

A modern, feature-rich quote generator built with React, TypeScript, and Tailwind CSS. Create beautiful, customizable quotes with advanced typography, effects, and export options.

## ✨ Features

### 🎨 Design & Customization
- **Advanced Typography**: Multiple fonts, text effects, shadows, and outlines
- **Gradient Backgrounds**: Linear and radial gradients with angle control
- **Background Images**: Upload and customize background images with blend modes
- **Color Management**: Advanced color picker with contrast analysis
- **Text Effects**: Text shadows, outlines, gradients, and transforms
- **Pattern Overlays**: Dots, lines, and wave patterns

### 📱 Mobile-First Design
- **Touch-Friendly**: All controls optimized for mobile devices
- **Responsive Layout**: Seamless experience across all screen sizes
- **Swipe Gestures**: Intuitive mobile navigation
- **iOS Optimized**: Prevents unwanted zoom and provides native feel

### 🚀 Export & Sharing
- **Multiple Formats**: PNG, JPEG, SVG with quality controls
- **Social Media Ready**: Presets for Instagram, Facebook, Twitter, LinkedIn, YouTube, Pinterest, TikTok
- **Custom Sizes**: User-defined dimensions for any use case
- **High Resolution**: Support for HD, 2K, and 4K exports
- **Batch Export**: Export multiple formats simultaneously

### 🎯 Advanced Features
- **Template Management**: Save, load, and organize custom templates
- **Undo/Redo**: Complete history management for all changes
- **Keyboard Shortcuts**: Power user shortcuts for faster workflow
- **Real-time Preview**: Live preview of all changes
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/sd-quote-generator.git
cd sd-quote-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 📖 Usage Guide

### Creating Your First Quote

1. **Enter Text**: Type your quote in the text area
2. **Choose Font**: Select from a variety of beautiful fonts
3. **Customize Colors**: Pick text and background colors
4. **Add Effects**: Apply shadows, outlines, or gradients
5. **Export**: Choose your preferred format and size

### Mobile Usage

- **Touch Controls**: All buttons are optimized for touch
- **Swipe Navigation**: Swipe between different control panels
- **Collapsible Sections**: Tap to expand/collapse control groups
- **Upload Images**: Tap the upload area to add background images

### Advanced Features

#### Background Images
- Upload JPG, PNG, GIF, or WebP files
- Adjust opacity, position, and size
- Choose from 16 blend modes
- Set repeat patterns

#### Text Effects
- **Shadows**: Add depth with customizable shadows
- **Outlines**: Create text outlines with custom colors
- **Gradients**: Apply gradient effects to text
- **Transforms**: Uppercase, lowercase, or title case

#### Export Options
- **Social Media**: Pre-configured sizes for all platforms
- **Custom Sizes**: Define your own dimensions
- **Multiple Formats**: Export as PNG, JPEG, or SVG
- **Quality Control**: Adjust export quality and transparency

## 🛠️ Technical Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **State Management**: Custom hooks with localStorage
- **UI Components**: Lucide React icons, Framer Motion
- **Export**: html2canvas, html-to-image
- **Fonts**: WebFontLoader with Google Fonts

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Controls.tsx     # Main control panel
│   ├── QuoteCanvas.tsx  # Canvas rendering
│   ├── ExportOptions.tsx # Export functionality
│   └── ...
├── contexts/           # React contexts
├── hooks/             # Custom React hooks
├── types.ts           # TypeScript definitions
├── theme.ts           # Theme configuration
└── utils/             # Utility functions
```

## 🎨 Customization

### Adding New Fonts

1. Add font to Google Fonts or include in CSS
2. Update the font options in `types.ts`
3. Add font loading in the main component

### Creating Custom Templates

1. Design your quote with desired settings
2. Click "Save Template" in the template manager
3. Give it a descriptive name
4. Access it later from the template gallery

### Custom Export Presets

Add new social media presets in `ExportOptions.tsx`:

```typescript
const newPreset: SocialMediaPreset = {
  id: 'custom-platform',
  name: 'Custom Platform',
  width: 1200,
  height: 630,
  description: 'Custom dimensions',
  icon: 'custom'
};
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Comprehensive linting rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standard commit message format

### Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests for new features
- Update documentation for any API changes
- Ensure mobile responsiveness for all new features
- Maintain accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide React](https://lucide.dev/) - Icon library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [html2canvas](https://html2canvas.hertzen.com/) - Canvas export

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/sd-quote-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/sd-quote-generator/discussions)
- **Email**: support@sdquote.com

## 🗺️ Roadmap

### v1.3.0 (Q2 2024)
- [ ] AI-powered color suggestions
- [ ] Advanced text path effects
- [ ] Real-time collaboration
- [ ] Template marketplace

### v2.0.0 (Q3 2024)
- [ ] Video export capabilities
- [ ] 3D text effects
- [ ] Mobile app (React Native)
- [ ] API for third-party integration

---

**Made with ❤️ by the SD Quote Generator team** 