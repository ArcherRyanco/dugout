# Dugout — Product Specification

## Overview
Dugout is a mobile-first web app for youth baseball/softball coaches to manage their team and provide structured skill development homework for players' parents.

## Target Users

### Primary: Coaches
- Manage team roster (players + parents)
- Assign homework drills to individuals or whole team
- Plan practices with drag-drop drill builder
- Access curated drill library

### Secondary: Parents
- Log in via team code + magic link
- View assigned homework for their player(s)
- Access fundamentals library (videos, guides)
- Mark homework as complete

## Core Features (MVP)

### 1. Authentication
- **Team Code**: 6-character alphanumeric code to find team
- **Magic Link**: Email-based passwordless auth for parents
- **Coach Auth**: Email/password or magic link with elevated permissions

### 2. Team Management (Coach)
- Create/edit team (name, age group, season)
- Add/remove players
- Link parents to players (multiple parents per player OK)
- Generate/regenerate team code

### 3. Player Roster
- Player name, number, position preferences
- Parent contact info (email, phone)
- Notes field for coach

### 4. Drill Library
- Curated drills organized by skill category:
  - Throwing
  - Catching
  - Batting
  - Fielding (ground balls, fly balls)
  - Base running
  - Coach Pitch specific
- Each drill has:
  - Title
  - Description
  - Difficulty level (beginner/intermediate/advanced)
  - Duration estimate
  - Equipment needed
  - Video embed (YouTube/Vimeo) or image
  - Step-by-step instructions
- Coaches can add custom drills

### 5. Homework Assignments
- Coach assigns drills to:
  - Entire team
  - Individual players
  - Position groups
- Assignment includes:
  - Drill(s) to complete
  - Due date (optional)
  - Reps/duration target
  - Coach notes
- Parents see assignments on their dashboard
- Mark as complete with optional notes/feedback

### 6. Practice Planner (v1.1)
- Drag-drop drill builder
- Time allocation per drill
- Pre-built practice templates by focus area
- Print/share practice plan

### 7. Fundamentals Guides (v1.1)
- Static content pages for core skills
- Written guides with images
- Embedded video tutorials
- Age-appropriate progressions

## Data Model

```
Team
├── id
├── name
├── code (6-char unique)
├── ageGroup (enum: tball, coachpitch, minors, majors, etc.)
├── season
├── coachId (FK)
└── createdAt

Player
├── id
├── teamId (FK)
├── firstName
├── lastName
├── number
├── positions[]
├── notes
└── createdAt

Parent
├── id
├── email
├── firstName
├── lastName
├── phone
└── createdAt

PlayerParent (junction)
├── playerId (FK)
└── parentId (FK)

Drill
├── id
├── title
├── description
├── category (enum)
├── difficulty (enum)
├── durationMinutes
├── equipment[]
├── instructions (markdown)
├── videoUrl
├── imageUrl
├── isCustom
├── createdBy (FK, nullable)
└── createdAt

Assignment
├── id
├── teamId (FK)
├── drillId (FK)
├── assignedTo (enum: team, player, position)
├── targetPlayerId (FK, nullable)
├── targetPosition (nullable)
├── dueDate (nullable)
├── reps (nullable)
├── durationMinutes (nullable)
├── notes
├── createdAt
└── createdBy (FK)

Completion
├── id
├── assignmentId (FK)
├── playerId (FK)
├── completedAt
├── parentNotes
└── verified (boolean)
```

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (Postgres)
- **Auth**: Supabase Auth (magic link)
- **Hosting**: Vercel
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Server Components + Server Actions

## Design Principles
1. **Mobile-first**: Parents use this at the field on their phones
2. **Fast**: Minimal loading, offline-capable where possible
3. **Simple**: Parents shouldn't need a tutorial
4. **Encouraging**: Positive language, celebrate completions

## Content Sources for Drill Library
- Little League official resources
- USA Baseball
- Positive Coaching Alliance
- YouTube coaching channels
- Original content

## Future Features (Post-MVP)
- Push notifications for new assignments
- Photo/video upload for completion proof
- Team chat/announcements
- Game schedule integration
- Stats tracking (optional)
- Multi-team support for coaches
- White-label for leagues
