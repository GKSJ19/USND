import streamlit as st
import pandas as pd
from utils.data_loader import load_data

# ================= CONFIG =================
st.set_page_config(page_title="Disaster Dashboard", layout="wide")

# ================= LOAD DATA =================
df = load_data()
df["date"] = pd.to_datetime(df["date"])
df["year"] = df["date"].dt.year

# ================= DERIVED METRICS =================
total_records = len(df)
num_states = df["state"].nunique()
num_types = df["incidentType"].nunique()
num_years = df["year"].nunique()

start_year = df["year"].min()
end_year = df["year"].max()

incident_counts = df["incidentType"].value_counts()
top_disaster = incident_counts.idxmax()
top_disaster_count = incident_counts.max()

state_counts = df["state"].value_counts()
top_state = state_counts.idxmax()
top_state_count = state_counts.max()

top3_states = state_counts.head(3)

# ================= STYLE =================
st.markdown("""
<style>
.block-container {
    padding-top: 2rem;
    padding-bottom: 2rem;
}

/* Title */
.title {
    font-size: 38px;
    font-weight: 600;
    margin-bottom: 5px;
}

/* Subtitle */
.subtitle {
    color: #9aa0a6;
    margin-bottom: 25px;
}

/* KPI */
.kpi {
    background: #1A1C24;
    padding: 18px;
    border-radius: 12px;
    text-align: center;
    border: 1px solid #2a2d3a;
}

/* Cards */
.card {
    background:#1A1C24;
    padding:20px;
    border-radius:12px;
    border:1px solid #2a2d3a;
    height:160px;

    display:flex;
    flex-direction:column;
    justify-content:space-between;
}

/* Navigation Cards */
.nav {
    background:#1A1C24;
    padding:20px;
    border-radius:12px;
    border:1px solid #2a2d3a;
    text-align:center;
    transition: 0.3s;
    cursor: pointer;
}
            
.card:hover {
    border:1px solid #4CAF50;
    transform: translateY(-3px);
    box-shadow: 0 4px 20px rgba(76, 175, 80, 0.15);
}
.nav:hover {
    border:1px solid #4CAF50;
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(76, 175, 80, 0.2);
}
            
button[kind="secondary"] {
    background: #1A1C24 !important;
    border: 1px solid #2a2d3a !important;
    border-radius: 12px !important;
    padding: 20px !important;
    text-align: center !important;
    height: 100px !important;
    font-size: 16px !important;
    transition: 0.3s !important;
}

button[kind="secondary"]:hover {
    border:1px solid #4CAF50 !important;
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(76, 175, 80, 0.2);
}
</style>
""", unsafe_allow_html=True)

# ================= HERO =================
st.markdown("<div class='title'>U.S. Natural Disaster Dashboard</div>", unsafe_allow_html=True)
st.markdown("<div class='subtitle'>Key insights from disaster data across time, location, and type</div>", unsafe_allow_html=True)

st.markdown("---")

# ================= KPIs =================
c1, c2, c3, c4 = st.columns(4)

c1.markdown(f"<div class='kpi'><b>Total Records</b><br><h2>{total_records:,}</h2></div>", unsafe_allow_html=True)
c2.markdown(f"<div class='kpi'><b>States</b><br><h2>{num_states}</h2></div>", unsafe_allow_html=True)
c3.markdown(f"<div class='kpi'><b>Incident Types</b><br><h2>{num_types}</h2></div>", unsafe_allow_html=True)
c4.markdown(f"<div class='kpi'><b>Years</b><br><h2>{num_years}</h2></div>", unsafe_allow_html=True)

st.markdown("---")

# ================= INSIGHTS =================
# ================= INSIGHTS =================
st.markdown("## 🔍 Key Insights")

col1, col2 = st.columns(2)

# -------- TIME --------
with col1:
    st.markdown(f"""
<div class='card'>
    <div><b>📅 Time Coverage</b></div>
    <div style='font-size:22px; font-weight:600;'>{start_year} – {end_year}</div>
    <div style='color:#aaa;'>Covers {num_years} years</div>
</div>
""", unsafe_allow_html=True)

# -------- DISASTER --------
with col2:
    st.markdown(f"""
<div class='card'>
    <div><b>🌪 Most Frequent Disaster</b></div>
    <div style='font-size:22px; font-weight:600;'>{top_disaster}</div>
    <div style='color:#aaa;'>{top_disaster_count:,} incidents</div>
</div>
""", unsafe_allow_html=True)

col3, col4 = st.columns(2)

# -------- STATE --------
with col3:
    st.markdown(f"""
<div class='card'>
    <div><b>🌍 Most Affected State</b></div>
    <div style='font-size:22px; font-weight:600;'>{top_state}</div>
    <div style='color:#aaa;'>{top_state_count:,} incidents</div>
</div>
""", unsafe_allow_html=True)

# -------- TOP 3 --------
with col4:
   st.markdown(f"""
<div class='card'>
    <div><b>📊 High Risk States</b></div>
    <div style='line-height:1.8;'>
        1. {top3_states.index[0]} <span style='color:#aaa;'>({top3_states.iloc[0]:,})</span><br>
        2. {top3_states.index[1]} <span style='color:#aaa;'>({top3_states.iloc[1]:,})</span><br>
        3. {top3_states.index[2]} <span style='color:#aaa;'>({top3_states.iloc[2]:,})</span>
    </div>
    <div></div>
</div>
""", unsafe_allow_html=True)
# ================= NAVIGATION =================
# ================= NAVIGATION =================
st.markdown("## 🚀 Navigate")

n1, n2 = st.columns(2)
n3, n4 = st.columns(2)

def nav_card(title, subtitle, page, key):
    if st.button(f"{title}\n{subtitle}", key=key, use_container_width=True):
        st.switch_page(page)

# ROW 1
with n1:
    nav_card("📊 Data Overview", "Cleaned dataset summary", "pages/1_Data_Overview.py", "nav1")

with n2:
    nav_card("📅 Temporal Analysis", "Time-based patterns", "pages/2_Temporal_Analysis.py", "nav2")

# ROW 2
with n3:
    nav_card("🌍 Geographical Analysis", "State-wise insights", "pages/3_Geographical_Analysis.py", "nav3")

with n4:
    nav_card("📦 Incident Analysis", "Disaster type analysis", "pages/4_Incident_Type_Analysis.py", "nav4")