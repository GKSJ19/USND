import streamlit as st
import pandas as pd
import plotly.express as px

# ================= CONFIG =================
st.set_page_config(page_title="Overview", layout="wide")

# ================= STYLE =================
st.markdown("""
<style>
.block-container {
    padding-top: 1.5rem;
    padding-bottom: 2rem;
}

/* SECTION SPACING */
.section {
    margin-top: 35px;
    margin-bottom: 10px;
}

/* KPI */
.metric-box {
    background: linear-gradient(135deg, #1f1c2c, #928dab);
    padding: 18px;
    border-radius: 12px;
    text-align: center;
    color: white;
    height: 110px;

    display:flex;
    flex-direction:column;
    justify-content:center;
}

/* CARD */
.card {
    background:#1A1C24;
    padding:18px;
    border-radius:12px;
    border:1px solid #2a2d3a;

    height:120px;

    display:flex;
    flex-direction:column;
    justify-content:center;
    gap:6px;
}

/* TITLE INSIDE CARD */
.card-title {
    font-weight:600;
    font-size:16px;
}

/* DESCRIPTION */
.card-desc {
    color:#aaa;
    font-size:13px;
}

/* Charts */
[data-testid="stPlotlyChart"] {
    background: #1A1C24;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #2a2d3a;
    margin-top:10px;
}
</style>
""", unsafe_allow_html=True)

# ================= LOAD DATA =================
raw_df = pd.read_csv("database.csv")              # before cleaning
clean_df = pd.read_csv("usnd_cleaned.csv")        # after cleaning

clean_df["date"] = pd.to_datetime(clean_df["date"])
clean_df["year"] = clean_df["date"].dt.year

# ================= HEADER =================
st.markdown("<h1 style='text-align:center;'>📊 Disaster Dataset Overview</h1>", unsafe_allow_html=True)

# ================= FILTER =================
st.sidebar.header("📆 Filter")

year_range = st.sidebar.slider(
    "Select Year Range",
    int(clean_df["year"].min()),
    int(clean_df["year"].max()),
    (int(clean_df["year"].min()), int(clean_df["year"].max()))
)

clean_df = clean_df[clean_df["year"].between(year_range[0], year_range[1])]

# ================= DATASET SUMMARY =================
st.markdown("<div class='section'></div>", unsafe_allow_html=True)
st.markdown("## 📦 Dataset Summary")

c1, c2, c3, c4 = st.columns(4)

c1.markdown(f"<div class='metric-box'><b>Total Records</b><h3>{len(clean_df):,}</h3></div>", unsafe_allow_html=True)
c2.markdown(f"<div class='metric-box'><b>States</b><h3>{clean_df['state'].nunique()}</h3></div>", unsafe_allow_html=True)
c3.markdown(f"<div class='metric-box'><b>Incident Types</b><h3>{clean_df['incidentType'].nunique()}</h3></div>", unsafe_allow_html=True)
c4.markdown(f"<div class='metric-box'><b>Years Covered</b><h3>{clean_df['year'].nunique()}</h3></div>", unsafe_allow_html=True)

# ================= DATA CLEANING =================
st.markdown("<div class='section'></div>", unsafe_allow_html=True)
st.markdown("## 🧹 Data Cleaning Process")

col1, col2 = st.columns(2)

# ---------- COLUMN 1 ----------
with col1:
    st.markdown("""
    <div class='card'>
        <div><b>✔ Missing Values Handling</b></div>
        <div style='color:#aaa;'>Removed or handled null values in key columns.</div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class='card'>
        <div><b>✔ Data Type Conversion</b></div>
        <div style='color:#aaa;'>Converted date column into datetime format.</div>
    </div>
    """, unsafe_allow_html=True)

# ---------- COLUMN 2 ----------
with col2:
    st.markdown("""
    <div class='card'>
        <div><b>✔ Feature Engineering</b></div>
        <div style='color:#aaa;'>Extracted year and month from date.</div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class='card'>
        <div><b>✔ Data Consistency</b></div>
        <div style='color:#aaa;'>Standardized state names and incident categories.</div>
    </div>
    """, unsafe_allow_html=True)

# ================= BEFORE vs AFTER =================
# ================= INSIGHT VISUALS =================
st.markdown("<div class='section'></div>", unsafe_allow_html=True)
st.markdown("## 📊 Insight Visuals")

col1, col2 = st.columns(2)

# -------- TOP DISASTER TYPES --------
with col1:
    st.markdown("### 🌪 Top Disaster Types")

    top_disasters = (
        clean_df["incidentType"]
        .value_counts()
        .nlargest(7)
        .reset_index()
    )
    top_disasters.columns = ["Disaster", "Count"]

    fig1 = px.bar(
        top_disasters,
        x="Count",
        y="Disaster",
        orientation="h",
        color="Count"
    )

    fig1.update_layout(yaxis=dict(autorange="reversed"))

    st.plotly_chart(fig1, use_container_width=True)

# -------- TOP STATES --------
with col2:
    st.markdown("### 🌍 Most Affected States")

    top_states = (
        clean_df["state"]
        .value_counts()
        .nlargest(7)
        .reset_index()
    )
    top_states.columns = ["State", "Count"]

    fig2 = px.bar(
        top_states,
        x="State",
        y="Count",
        color="Count"
    )

    st.plotly_chart(fig2, use_container_width=True)

# -------- DISTRIBUTION --------



