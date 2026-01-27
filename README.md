# Distribuidora Mauri - Dynamic Catalog Engine

This project is a high-performance, web-based automation system designed to generate large-scale commercial catalogs. It represents a complete migration from a legacy desktop-based workflow (Adobe InDesign/ExtendScript) to a modern **PDF-as-Code** architecture.

## 🛠 The Problem & The Solution

Managing a catalog of **500+ products** with shifting prices and real-time offers used to be a manual, error-prone process. By moving the logic to a React + TypeScript environment, I achieved:

- **Zero-Error Production:** Data is pulled directly from CSV sources, eliminating manual typing errors.
- **Efficiency:** Production time reduced from hours to seconds.
- **Dynamic Logic:** Automatic visual highlighting for products on sale.
- **Scalability:** A cloud-native approach that works on any browser without third-party software dependencies.

## 🏗 Tech Stack

- **Frontend:** React.js + Vite (for high-speed development and rendering).
- **Language:** TypeScript (type safety for complex data structures).
- **PDF Engine:** `@react-pdf/renderer` (PDF-as-Code maquetation).
- **PDF Manipulation:** `pdf-lib` (Merging of dynamic content with static marketing assets).
- **Styling:** Tailwind CSS.

## 🌟 Key Features

### 1. PDF-as-Code Architecture
The layout is defined programmatically. Global design changes (typography, margins, branding) are applied instantly across several pages by modifying a single component.

### 2. Intelligent Data Merging
The engine processes **CSV data sources** and maps them to specialized UI components. It handles conditional rendering for:
- Standard unit/wholesale price layouts.
- Promotional "Offer" layouts with prioritized pricing and badges.

### 3. Multi-source PDF Integration
Using `pdf-lib`, the system automatically merges the dynamically generated product pages with static assets (Covers, Special Event Flyers), producing a single, professional-grade marketing file.

---

## 🚀 How to Run

1. **Install dependencies:**
   ```bash
   npm install

2. **Data Preparation (Python):** Before the React engine renders the PDF, a Python-based automation layer prepares the data source. To run the update-catalog scripts, ensure you have installed the requirements:
   pip install -r requirements.txt

3. **Run development server:**
   npm run dev

4. **Data Management:** Update the product database by modifying the CSV file in the data directory data_csv.

Developed by Nahuel Sanchez Freelance Web Developer & Automation Specialist - Jardín América, Misiones, Argentina.