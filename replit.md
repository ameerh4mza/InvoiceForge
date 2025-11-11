# Receipt Generator Application

## Overview

A modern SaaS receipt management system for generating, tracking, and analyzing business receipts. The application provides a professional dashboard for managing products, creating receipts with detailed line items, and viewing analytics on sales performance. Built with a clean, business-focused interface inspired by Linear, Stripe, and Notion design patterns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**Routing**: Client-side routing implemented with Wouter, a lightweight React router alternative.

**UI Component System**: shadcn/ui component library built on Radix UI primitives, providing accessible, customizable components with Tailwind CSS styling. The design system follows a "New York" style variant with neutral base colors and consistent spacing/typography patterns.

**State Management**: 
- React Query (TanStack Query) for server state management, data fetching, and cache invalidation
- Local React state (useState) for component-level UI state
- No global state management library needed due to React Query handling server data

**Styling Approach**: 
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theme customization (light/dark mode support)
- Custom spacing units (2, 4, 6, 8) for consistent layouts
- Typography system using Inter/SF Pro for UI and JetBrains Mono for data/numbers

**Layout Pattern**: Sidebar navigation with collapsible functionality, main content area with responsive grids for forms and analytics cards.

### Backend Architecture

**Runtime**: Node.js with Express.js server framework.

**API Design**: RESTful API endpoints following resource-based URL patterns:
- `/api/products` - Product CRUD operations
- `/api/receipts` - Receipt generation and retrieval
- `/api/analytics` - Dashboard analytics aggregation

**Validation**: Zod schema validation for request payloads, integrated with Drizzle ORM schema definitions.

**Request Logging**: Custom middleware for logging API requests with duration tracking and response capture.

### Data Storage

**Database**: PostgreSQL configured through Drizzle ORM with Neon Database serverless driver (@neondatabase/serverless).

**ORM Strategy**: Drizzle ORM for type-safe database operations with schema-first approach. Schema definitions in `shared/schema.ts` are used for both database migrations and runtime validation.

**Schema Design**:
- `products` table: Product catalog with name, description, price
- `receipts` table: Receipt headers with metadata, totals, and serialized line items (stored as JSON text)
- UUID primary keys generated via PostgreSQL's `gen_random_uuid()`

**Data Model Philosophy**: Receipt items are stored as JSON text rather than normalized tables for simplicity and flexibility. This allows receipts to maintain historical product information even if products are modified or deleted.

**Fallback Storage**: In-memory storage implementation (MemStorage) for development/testing without database dependency. Includes seed data for initial product catalog.

### External Dependencies

**Database Services**:
- Neon Database (PostgreSQL serverless platform) via `@neondatabase/serverless` driver
- Connection configured through `DATABASE_URL` environment variable
- Drizzle Kit for schema migrations and database management

**UI Component Libraries**:
- Radix UI primitives (@radix-ui/* packages) for accessible, unstyled component foundations
- shadcn/ui component system built on top of Radix UI
- Lucide React for consistent iconography

**PDF Generation**:
- jsPDF library for client-side receipt PDF generation
- PDF structure includes company header, receipt metadata, line items table, and totals

**Development Tools**:
- Replit-specific plugins for runtime error handling, dev banners, and code mapping
- TypeScript for type safety across frontend and backend
- ESBuild for backend bundling in production builds

**Styling & Utilities**:
- Tailwind CSS with PostCSS for processing
- class-variance-authority (CVA) for component variant management
- clsx and tailwind-merge for conditional class composition

**Form Handling**:
- React Hook Form for form state management
- @hookform/resolvers for Zod schema integration
- Zod for runtime validation and TypeScript type inference

**Date Handling**:
- date-fns library for date formatting and manipulation

**Session Management**:
- connect-pg-simple for PostgreSQL session storage (configured but not actively used in current implementation)