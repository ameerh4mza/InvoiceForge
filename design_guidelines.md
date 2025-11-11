# Receipt Generator Design Guidelines

## Design Approach
**System:** Modern SaaS Dashboard Pattern inspired by Linear, Stripe, and Notion
**Rationale:** Business productivity tool requiring clean data presentation, efficient workflows, and professional aesthetics for receipt management and analytics.

## Core Design Principles
1. **Clarity First:** Information hierarchy that makes receipt generation and data review effortless
2. **Efficient Workflows:** Minimize clicks between common actions (generate receipt → view history → analytics)
3. **Data Confidence:** Clear visual feedback for all transactions and calculations
4. **Professional Polish:** Clean, trustworthy interface suitable for business environments

## Typography System
- **Primary Font:** Inter or SF Pro (Google Fonts via CDN)
- **Monospace Font:** JetBrains Mono for receipt numbers, prices, totals
- **Hierarchy:**
  - Page titles: text-2xl to text-3xl, font-semibold
  - Section headers: text-lg, font-medium
  - Body/labels: text-sm to text-base, font-normal
  - Data/numbers: text-base, font-mono
  - Helper text: text-xs to text-sm, muted styling

## Layout System
**Spacing Units:** Tailwind units of 2, 4, 6, and 8 (p-4, m-6, gap-8, etc.)
**Grid Structure:** 
- Sidebar navigation (w-64) + Main content area (flex-1)
- Two-column layouts for forms (lg:grid-cols-2)
- Three-column cards for analytics (lg:grid-cols-3)
**Container Widths:** max-w-7xl for dashboards, max-w-2xl for forms

## Core Application Sections

### 1. Navigation
**Sidebar Layout:**
- Logo/brand at top (h-16)
- Primary nav items with icons (Heroicons): Dashboard, Generate Receipt, Receipt History, Products, Analytics
- Active state: subtle background treatment
- Bottom section: User profile, settings

### 2. Receipt Generation Form
**Layout:** Centered card (max-w-2xl) with generous padding (p-8)
**Components:**
- Date/time display (auto-filled, editable)
- Product selector: searchable dropdown with item prices visible
- Item table: Product | Quantity | Price | Subtotal columns
- Add/remove item buttons with icons
- Payment method toggle: Cash/Card (pill-style toggle group)
- Subtotal, Tax (if applicable), Total in prominent display (text-2xl for total)
- Action buttons: Generate PDF (primary), Save & Print (secondary)

### 3. Products Management
**Layout:** Table view with add product button (top-right)
**Table Structure:**
- Columns: Name | Description | Price | Actions
- Inline editing capability
- Search/filter bar above table
- Add product: modal or slide-over panel with form fields

### 4. Receipt History/Inventory
**Layout:** Full-width data table with filters panel
**Filter Panel:** (sticky top or left sidebar)
- Date range picker (start/end dates)
- Payment method filter (All/Cash/Card)
- Search by receipt number
- Quick filters: Today, This Week, This Month

**Receipt Table:**
- Columns: Receipt # | Date | Items Count | Payment Method | Total | Actions
- Row click: expands to show full receipt details
- Actions: View PDF, Print, Delete (icon buttons)
- Pagination at bottom

### 5. Analytics Dashboard
**Layout:** Grid of metric cards + charts
**Metric Cards:** (grid-cols-1 md:grid-cols-3, gap-6)
- Daily Income
- Weekly Income  
- Monthly Income
Each card: Large number (text-4xl, font-mono), label, trend indicator

**Charts Section:**
- Income over time (line/bar chart)
- Cash vs Card breakdown (pie/donut chart)
- Top selling items (horizontal bar chart)

**Chart Library:** Use Chart.js or Recharts via CDN

## Component Library

### Buttons
- **Primary:** Solid style, rounded-lg, px-4 py-2, font-medium
- **Secondary:** Outline style, same padding
- **Icon buttons:** p-2, rounded-md for actions in tables

### Form Inputs
- **Text inputs:** border, rounded-lg, px-4 py-2.5, focus ring treatment
- **Select dropdowns:** Consistent styling with inputs, down arrow icon
- **Date pickers:** Calendar icon, clean date selection UI
- All form fields: Proper labels (text-sm, font-medium), helper text when needed

### Cards
- Border or subtle shadow treatment
- Rounded corners (rounded-xl)
- Padding: p-6 to p-8
- Used for: Receipt form, analytics metrics, product details

### Tables
- Header: font-medium, uppercase tracking-wide text-xs
- Rows: Alternating background for readability, hover state
- Cell padding: px-6 py-4
- Borders: Subtle horizontal dividers

### Modals/Dialogs
- Overlay with backdrop blur
- Centered card (max-w-lg to max-w-2xl)
- Header with title and close button
- Content area with proper spacing
- Footer with action buttons aligned right

### Icons
**Library:** Heroicons (via CDN)
**Usage:**
- Navigation items (20x20)
- Buttons (16x16 or 20x20)
- Table actions (16x16)
- Form field indicators (20x20)

## PDF Receipt Design
**Format:** 
- Company header with name/logo placeholder
- Receipt number, date, time
- Items table: clean rows with borders
- Payment method badge
- Totals section: prominent, right-aligned
- Footer: Thank you message, contact info

## Animations
**Minimal, Purposeful:**
- Page transitions: simple fade
- Filter/sort: brief loading state
- Success actions: subtle checkmark animation
- Avoid distracting motion

## Responsive Behavior
- **Desktop (lg:)** Full sidebar + multi-column layouts
- **Tablet (md:)** Collapsible sidebar, 2-column grids reduce to 1
- **Mobile (base):** Hamburger menu, stacked layouts, simplified tables (cards on mobile)

## Accessibility
- Proper form labels and ARIA attributes
- Keyboard navigation for all interactive elements
- Focus indicators on all focusable elements
- Sufficient contrast ratios throughout
- Screen reader friendly table headers