# 🌪️ US Natural Disaster Declarations — Visual Analytics Project

A structured data analytics project exploring **FEMA's disaster declaration dataset** through time-series trends, geographic patterns, and incident-type breakdowns.

---

## 📁 Project Structure

```
US_Disaster_Visualization/
├── data/
│   ├── raw/            → Original FEMA CSV file (do not modify)
│   └── processed/      → Cleaned dataset output from Milestone 1
├── notebooks/
│   ├── 01_data_cleaning.ipynb      → Data loading, cleaning, EDA
│   ├── 02_temporal_analysis.ipynb  → Time trends & seasonality (Milestone 2)
│   └── 03_geo_analysis.ipynb       → Geographic mapping (Milestone 3)
├── src/                → Shared helper functions (if needed)
├── visualizations/     → Saved charts and maps (PNG / HTML)
├── reports/            → Final report and presentation deck
├── requirements.txt    → Python dependencies
└── README.md           → This file
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Add Raw Data
- Download the FEMA Disaster Declarations dataset (CSV) from [FEMA OpenData](https://www.fema.gov/openfema-data-page/disaster-declarations-summaries-v2)
- Place it inside `data/raw/`

### 3. Run Notebooks in Order
```
01_data_cleaning.ipynb      ← Start here
02_temporal_analysis.ipynb
03_geo_analysis.ipynb
```

---

## 📊 Milestones

| Milestone | Notebook | Description |
|-----------|----------|-------------|
| 1 | `01_data_cleaning.ipynb` | Data loading, cleaning, and initial EDA |
| 2 | `02_temporal_analysis.ipynb` | Yearly trends, seasonality, incident analysis |
| 3 | `03_geo_analysis.ipynb` | State-level and geographic mapping |

---

## 🛠️ Tech Stack

- **Python** 3.10+
- **Pandas / NumPy** — Data manipulation
- **Matplotlib / Seaborn** — Static visualizations
- **Plotly** — Interactive charts
- **Folium / GeoPandas** — Geospatial maps

---

## 👤 Author

> Infosys Project — US Disaster Visualization  
> Academic Submission | March 2026
