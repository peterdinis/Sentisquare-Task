# TextRazor Dashboard

📊 **TextRazor Dashboard** is a web application for uploading text files, analyzing text using the [TextRazor API](https://www.textrazor.com/), visualizing entities, and displaying statistics.  

Users can upload a `.txt` file, the app extracts entities (people, organizations, locations, dates, etc.), highlights them in the text, and displays charts of entity frequencies.

---

## Features

- Upload `.txt` files with multiple lines
- Asynchronous analysis of each line via TextRazor API (entities only)
- Display results:
  - Statistics: total entities, most frequent entity type, total lines
  - Charts showing frequency of each entity type
  - Highlighted entities directly in the text
- Toast notifications for success or errors
- Smooth animations for a better UX (Framer Motion)

---

## Technology Stack

- **Next.js** 13+ (App Router)
- **React** 18+ with new JSX transform
- **TypeScript**
- **React-Bootstrap** for layout and UI components
- **Framer Motion** for animations
- **React Hook Form + Zod** for file upload validation
- **TextRazor API** for entity extraction
- **Vitest** for component testing

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/text-razor-dashboard.git
   cd text-razor-dashboard
```

2. Add .env.local with your TextRazor API key:
```bash
   TEXT_RAZOR_API_KEY=your_api_key
```

3. Install dependencies
```bash
   pnpm install
```

4. Run the server
```bash
   pnpm run dev
```
