 US Natural Disaster Analysis Dashboard

📌 Project Overview
This project focuses on analyzing natural disaster declarations across the United States using data analytics and visualization techniques. The goal is to identify trends, patterns, and insights related to disaster frequency, geographical distribution, incident types, and assistance programs.

The project is divided into four milestones, each addressing a specific stage of data analysis.

---

 🎯 Objectives
- Analyze disaster trends over time
- Identify disaster-prone states and regions
- Understand the distribution of disaster types
- Examine the relationship between disasters and assistance programs
- Build an interactive dashboard for decision-making

---
📊 Dataset Source
- FEMA Open Data: https://www.fema.gov/openfema-data-page/disaster-declarations-summaries
 📂 Dataset
The dataset used for this project is available in this repository:
👉 [Download Dataset](./usnd_cleaned.csv)
- Contains:
  - State
  - Incident Type
  - Year & Month
  - Declaration Dates
  - Assistance Program Indicators (IH & PA)

---

## 🚀 Milestone Breakdown

---

### 🔹 Milestone 1: Data Acquisition & Cleaning
- Loaded dataset using Pandas
- Handled missing values
- Converted date columns into proper format
- Standardized categorical columns
- Performed initial exploratory data analysis (EDA)

📊 Outputs:
- Summary statistics
- Missing value analysis
- Basic visualizations

---

### 🔹 Milestone 2: Temporal Analysis
- Extracted time-based features (year, month)
- Analyzed disaster trends over time
- Created time-series visualizations

📊 Key Insights:
- Disaster frequency has increased over the years
- Certain years show spikes in disaster declarations

---

### 🔹 Milestone 3: Geographical Analysis
- Aggregated disaster data by state
- Identified disaster-prone regions
- Created map-based visualizations

📊 Key Insights:
- Southern states like Texas and Florida have higher disaster frequency
- Geographic clustering of disasters is observed

---

### 🔹 Milestone 4: Incident Type Analysis
- Analyzed distribution of disaster types
- Compared disaster types across states
- Evaluated relationship with assistance programs

📊 Key Insights:
- Severe storms, hurricanes, and floods are the most common disasters
- Assistance programs are highly activated for major disaster types
- Certain states are prone to specific disaster categories

---

## 📊 Dashboard (Power BI)
An interactive dashboard was developed to integrate all insights from the four milestones.
Download Power BI Dashboard:
👉 [Download PBIX File](./USND%20dashboard.pbix)

### Dashboard Features:
- KPI Cards (Total Disasters, States, Assistance)
- Time Trend Analysis (Line Chart)
- Geographic Distribution (Map Visualization)
- Incident Type Distribution (Donut / Treemap)
- State vs Incident Analysis (Stacked Bar Chart)
- Assistance Program Analysis
- Filters for dynamic exploration

---
## 📁 Project Files

- [Milestone 1 Notebook](./Milestone1.ipynb)
- [Milestone 2 Notebook](./Milestone%202%20Shreyanka%20Y%20h.ipynb)
- [Milestone 3 Notebook](./milestone3.ipynb)
- [Milestone 4 Notebook](./milestone4.ipynb)

## 🧠 Key Insights (Final Conclusion)
- Disaster occurrences are increasing over time
- Southern and coastal states are more vulnerable
- Severe storms and hurricanes dominate disaster types
- Assistance programs are strongly linked to high-impact disasters
- Clear patterns exist across time, geography, and incident types

---

## 🛠️ Tools & Technologies Used
- Python (Pandas, NumPy)
- Data Visualization (Matplotlib, Seaborn, Plotly)
- Power BI (Dashboard Development)
- Jupyter Notebook
- Git & GitHub

---


