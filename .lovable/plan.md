

# Plan: Add Itinerary & Important Notes + Redesign Trek Detail Sections

## Problem Identified

The `TrekDetail.tsx` page is **missing two sections entirely**:
1. **Itinerary** -- the data exists in the database (day-wise breakdown with titles and descriptions) but is never rendered on the page
2. **Important Notes** -- also stored in the database but has no UI section

Additionally, the existing sections (Highlights, Inclusions, Exclusions, Things to Carry) use a basic card layout that needs a modern refresh.

## What Will Change

### 1. Add Missing Sections

**Itinerary Section** -- A vertical timeline-style layout showing each day (Day 0 for pickup points, Day 1, Day 2, etc.) with titles and descriptions. Each day will be an expandable accordion item so users can browse without scrolling through walls of text.

**Important Notes Section** -- A highlighted callout box with an alert/info icon displaying the admin-entered notes text.

### 2. Redesign Existing Sections

All sections will get a cohesive modern treatment:

- **Highlights** -- Glassmorphism cards with hover glow effects, staggered fade-in animations, and numbered indicators instead of plain checkmarks
- **Inclusions / Exclusions** -- Side-by-side cards with gradient top borders (green for included, red for excluded), hover-lift effects, and smooth entry animations
- **Things to Carry** -- Grid of pill-style badges with hover scale effects instead of a plain list
- **Quick Info Cards** -- Add hover-glow and subtle scale animations to the stats cards at the top
- **Itinerary (new)** -- Accordion-based timeline with a vertical line connector, day number circles, and smooth expand/collapse animations
- **Important Notes (new)** -- Warning-style callout card with left border accent and info icon

### 3. Animation Details

- Sections will use staggered `animate-fade-in` on scroll entry
- Cards use `card-hover` and `hover-lift` utility classes already defined in the CSS
- Accordion uses existing `accordion-down` / `accordion-up` animations from the Radix accordion component
- Interactive hover effects: scale, glow, and shadow transitions

---

## Technical Details

### File Modified

| File | Change |
|------|--------|
| `src/pages/TrekDetail.tsx` | Add Itinerary and Important Notes sections; redesign all content sections with modern styling and animations |

### New Imports Needed

```typescript
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar, AlertTriangle, Star, Sparkles, Info } from 'lucide-react';
```

### Section Ordering (top to bottom in main content area)

1. Quick Info Cards (Duration, Altitude, Distance, Price) -- with hover effects
2. About This Trek (description)
3. Highlights -- redesigned grid with glassmorphism
4. Itinerary -- **NEW** accordion timeline
5. Inclusions and Exclusions -- redesigned side-by-side cards
6. Things to Carry -- redesigned pill/badge grid
7. Important Notes -- **NEW** callout card

### Itinerary Rendering Logic

```typescript
{trek.itinerary && trek.itinerary.length > 0 && (
  <div>
    <h2>Day-wise Itinerary</h2>
    <Accordion type="single" collapsible defaultValue="day-0">
      {trek.itinerary.map((day, index) => (
        <AccordionItem key={index} value={`day-${index}`}>
          <AccordionTrigger>
            <span className="day-badge">Day {day.day}</span>
            <span>{day.title}</span>
          </AccordionTrigger>
          <AccordionContent>
            {/* Render description with line breaks preserved */}
            {day.description.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
)}
```

### Important Notes Rendering Logic

```typescript
{trek.important_notes && (
  <Card className="border-l-4 border-l-primary bg-primary/5">
    <CardContent className="flex gap-3 pt-5">
      <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold mb-1">Important Notes</h3>
        <p className="text-sm text-muted-foreground">{trek.important_notes}</p>
      </div>
    </CardContent>
  </Card>
)}
```

### Design Enhancements Applied to Each Section

- **Quick Info Cards**: Add `group hover-lift` classes, icon gets `group-hover:scale-110 transition-transform`
- **Highlights**: Each item gets `hover:bg-primary/5 transition-all duration-300 hover:shadow-md` with a numbered circle badge
- **Inclusions Card**: Green gradient top border, `hover-lift` class, items get `hover:translate-x-1 transition-transform`
- **Exclusions Card**: Red gradient top border, same hover treatment
- **Things to Carry**: Items rendered as interactive badges/pills with `hover:scale-105` and `hover:bg-warning/20`
- **Itinerary Accordion**: Custom styled with day-number circles connected by a vertical timeline line, smooth open/close animation

