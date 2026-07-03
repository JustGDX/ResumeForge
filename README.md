# 📄 ResumeForge — Advanced Resume Builder

A modern, feature-rich resume builder designed for fast resume creation, beautiful layouts, and pixel-perfect exports.

Built with a clean UI, live preview, and full customization for job seekers, professionals, and creatives who want to stand out.

---

## 🚀 Live Demo

🌐 [Try ResumeForge](https://rf-resumeforge.netlify.app/)

---

## ✨ Features

### 📐 Professional Resume Layouts

Choose from multiple professionally designed templates:

* ⭐ **Classic** — Traditional top-header layout (Best for corporate resumes)
* 💻 **Modern** — Sidebar with contact and skills section (Recommended for tech)
* 🎓 **Elegant** — Centered serif design (Academic use)
* 💼 **Compact** — Two-column structure (Experienced professionals)
* 🎨 **Creative** — Bold accent styling (Design-focused resumes)

Additional functionality:

* Interactive layout selector
* Smart layout recommendations
* Instant template switching

---

### 🎨 Deep Customization

#### Colors

* Accent color picker
* HEX color input
* Preset color swatches
* Separate text color controls

#### Typography

Customize:

* Header
* Section titles
* Body text
* Contact section
* Skills section
* Declaration section

#### Font Sizes

* Small
* Medium
* Large

#### Spacing

* Tight
* Normal
* Relaxed

#### Included Fonts

* Inter
* Montserrat
* Merriweather
* Playfair Display
* Plus additional Google Fonts

#### Themes

* 🌙 Dark Mode
* ☀️ Light Mode
* Smooth theme transitions

---

### 📝 Resume Sections

Supported section types:

* Summary
* Experience
* Education
* Skills
* Certifications
* Projects
* Languages
* Awards
* Volunteering
* Interests
* References
* Custom Sections

Features:

* Reordering controls
* Collapsible editing cards
* Dynamic section creation

---

### 🖼️ Media & Personalization

#### Profile Photo Shapes

* Circle
* Rounded
* Square
* Hexagon

Additional support:

* Certification badge upload
* Verification URLs
* Signature upload
* Adjustable signature size
* Optional declaration section

---

### 📤 Export Options

#### PDF

* One-click export
* Pixel-perfect A4 output

#### Print

* Browser print support
* Save as PDF

#### PNG

* High-resolution rendering
* Fixed dimensions: `794 × 1123`
* `2x` rendering scale

Exports preserve:

* Colors
* Layouts
* Fonts
* Gradients

---

### ⚡ Smart Workflow

* Live preview updates
* Save & Load progress
* Local storage support
* Zoom controls
* Responsive design
* Mobile Edit ⇄ Preview toggle
* Floating "Back to Edit" button

---

## 🧠 How It Works

1. Select a resume layout
2. Fill in personal information
3. Add resume sections
4. Customize colors and fonts
5. Preview updates in real time
6. Export your final resume

---

## ⚠️ Notes

* All information stays in your browser
* No data is uploaded to external servers
* Enable **Background Graphics** in print settings for colored PDF exports
* PNG signature transparency works best with PNG files
* Recommended profile photo size: **200×200px minimum**

---

## 🚀 Tech Stack

### Frontend

* HTML5
* CSS3
* Flexbox
* CSS Grid
* CSS Custom Properties
* Vanilla JavaScript

### Libraries

* html2canvas
* jsPDF
* FileSaver.js
* Font Awesome 6
* Google Fonts

---

## 🧱 Project Structure

```bash
ResumeForge-Pro/
│
├── index.html
├── css/
│   └── styles.css
│
├── js/
│   └── app.js
│
└── assets/
```

---

## 📁 File Overview

### `index.html`

Main application structure:

* Resume editor
* Live preview panel
* Layout chooser
* Modals
* Font settings panel

### `css/styles.css`

Contains:

* Theme variables
* Light/Dark mode
* Responsive breakpoints
* Layout styling
* Resume templates

### `js/app.js`

Handles:

* Application state management
* Resume rendering
* CRUD operations
* Export functions
* Local storage system
* Mobile responsiveness

---

## 📝 Usage

### For Users

1. Open the application
2. Choose a layout
3. Enter resume information
4. Customize fonts and colors
5. Download or print

---

### For Developers

#### 🎨 Customize Theme

```css
:root{
    --ac:#2563eb;
    --acd:#1d4ed8;
    --fc:#1f2937;
    --bg:#f3f4f6;
    --sf:#ffffff;
}
```

#### ⚙️ Modify Application Logic

**Resume Rendering**

```javascript
render()
buildResumeHTML()
```

**Section Definitions**

```javascript
CFG
```

**Layout Styles**

```css
.layout-*
```

**Export Functions**

```javascript
downloadPDF()
doPrint()
downloadPNG()
```

---

## 🖼️ Rendering System

* HTML-based live preview
* Offscreen rendering for exports
* Fixed A4 dimensions
* Zoom using CSS transforms
* Pixel-perfect rendering

---

## 🌐 Browser Support

| Browser | Support |
| ------- | ------- |
| Chrome  | ✅       |
| Firefox | ✅       |
| Edge    | ✅       |
| Safari  | ✅       |
| Opera   | ✅       |

---

## 📌 Future Improvements

* Multi-page resume support
* Cover letter builder
* Cloud sync
* AI-powered suggestions
* Additional templates
* LinkedIn import
* Multi-language support
* Resume analytics
* ATS score checker
* Public resume sharing
* PWA support

---

## 👤 Author

**GDX**
