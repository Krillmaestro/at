# AlpineVideo - Video Analysis for Ski Racing

A simplified video analysis platform built specifically for alpine skiing coaches and athletes. Compare runs side-by-side, analyze technique frame-by-frame, and help your athletes improve.

![AlpineVideo](https://via.placeholder.com/800x400/0D0D0D/FF6B00?text=AlpineVideo)

## Features

- **Frame-by-Frame Playback** - Analyze every movement with 0.25x, 0.5x, 0.75x, 1x speed control
- **Side-by-Side Comparison** - Compare two runs with synchronized playback
- **Easy Video Upload** - Drag & drop with automatic compression
- **Video Library** - Filter by athlete, date, discipline
- **Mobile Responsive** - Works on phone, tablet, and desktop
- **Dark Theme** - Professional design with orange accents (inspired by Dartfish)

## Quick Start

### 1. Install Dependencies

```bash
# Make setup script executable and run it
chmod +x setup.sh
./setup.sh
```

Or manually:

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your Supabase credentials
```

Get your Supabase credentials from:
1. Go to https://app.supabase.com
2. Create a new project (or use existing)
3. Go to Settings > API
4. Copy the URL and anon key

### 3. Set Up Database

1. Go to your Supabase project
2. Open the SQL Editor
3. Copy the contents of `database/schema.sql`
4. Run the SQL to create tables

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── components/
│   ├── layout/          # Navbar, Sidebar, Layout
│   ├── ui/              # Button, Card, Input, Modal, Icons
│   ├── upload/          # UploadZone, Progress, MetadataForm
│   └── video/           # VideoPlayer, ComparisonView, Thumbnail
├── database/
│   └── schema.sql       # Supabase database schema
├── hooks/
│   ├── useVideoPlayer.js    # Video player logic
│   └── useKeyboardShortcuts.js
├── lib/
│   └── supabaseClient.js
├── pages/
│   ├── index.js         # Landing page
│   ├── login.js         # Login page
│   ├── signup.js        # Signup page
│   ├── dashboard.js     # Video library
│   ├── upload.js        # Upload new video
│   ├── compare.js       # Side-by-side comparison
│   └── watch/[id].js    # Single video player
├── styles/
│   └── globals.css      # Design system & styles
└── public/              # Static assets
```

## Keyboard Shortcuts (Video Player)

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` / `→` | Step frame backward/forward |
| `Shift + ←/→` | Skip 5 seconds |
| `J` / `L` | Skip 5 seconds back/forward |
| `S` | Cycle playback speed |
| `1-4` | Set speed (0.25x, 0.5x, 0.75x, 1x) |
| `M` | Toggle mute |
| `F` | Toggle fullscreen |

## Design System

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| Background Primary | `#0D0D0D` | Main background |
| Background Secondary | `#1A1A1A` | Cards, panels |
| Orange 500 | `#FF6B00` | Primary accent, buttons |
| Text Primary | `#FFFFFF` | Headings |
| Text Secondary | `#A3A3A3` | Body text |

### Components

The design system includes reusable components:

- `Button` - Primary, secondary, ghost variants
- `Card` - With hover states and sections
- `Input` - Text, select, textarea with labels
- `Modal` - Responsive dialog
- `VideoPlayer` - Full-featured player
- `ComparisonView` - Side-by-side player

## Tech Stack

- **Framework**: Next.js 15, React 19
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage

## Demo Mode

The app includes demo videos for testing. When you log in, you'll see sample videos in the library. These use public sample videos for demonstration.

## Next Steps (Future Development)

1. **Video Compression** - Add FFmpeg server-side compression
2. **Drawing Tools** - Add annotation/drawing on videos
3. **Team Management** - Invite athletes, manage roles
4. **Analytics** - Track viewing stats
5. **Export** - Download comparison clips

## License

Built for alpine ski teams.

---

Made with speed in mind.
