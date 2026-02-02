# Marks Visualizer

A dashboard for visualizing 5th semester CSE student performance data.

## Features

- **Overview** — Class statistics, grade distribution, top performers
- **Subject Analysis** — Per-subject distributions, rankings with pagination
- **Student Lookup** — Search by name/USN, view individual profiles with radar charts
- **Elective Comparison** — Compare Cloud Computing, NLP, and Quantum Computing
- **Correlation Analysis** — Subject correlation matrix and scatter plots
- **Distribution** — Cumulative and percentile distributions

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- shadcn/ui components
- Recharts for data visualization
- Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

Place your Excel data file at `data/marks.xlsx`.
