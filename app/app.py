import streamlit as st
from utils import load_data

# -------------------------------
# PAGE CONFIG
# -------------------------------
st.set_page_config(
    page_title="US Disaster Dashboard",
    layout="wide"
)

# -------------------------------
# CUSTOM CSS (Power BI Style UI)
# -------------------------------
st.markdown("""
<style>

/* Main background */
[data-testid="stAppViewContainer"] {
    background: linear-gradient(to right, #eef2f3, #ffffff);
}

/* Sidebar styling */
[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #0f172a, #1e293b);
    color: white;
}

/* Sidebar text */
[data-testid="stSidebar"] * {
    color: white !important;
}

/* Title styling */
h1 {
    font-size: 36px;
    font-weight: bold;
    color: #1e3a8a;
}

/* Card design */
.card {
    background-color: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
    text-align: center;
}

/* Metric cards */
[data-testid="metric-container"] {
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0px 2px 6px rgba(0,0,0,0.1);
}

/* Info box */
.stAlert {
    border-radius: 10px;
}

</style>
""", unsafe_allow_html=True)

# -------------------------------
# LOAD DATA
# -------------------------------
df = load_data()

# -------------------------------
# TITLE
# -------------------------------
st.title("📊 US Disaster Analytics Dashboard")

st.markdown("### 🔍 Explore disaster trends across time, geography, and incident types")

st.markdown("---")

# -------------------------------
# KPI CARDS
# -------------------------------
col1, col2, col3, col4 = st.columns(4)

col1.metric("📄 Total Records", len(df))
col2.metric("🌎 States", df['state'].nunique())
col3.metric("🔥 Incident Types", df['incidentType'].nunique())
col4.metric("📅 Years Covered", df['year'].nunique())

st.markdown("---")

# -------------------------------
# FEATURE CARDS
# -------------------------------
col1, col2, col3 = st.columns(3)

with col1:
    st.markdown("""
    <div class="card">
    <h4>📈 Temporal Analysis</h4>
    <p>Analyze disaster trends over years and identify patterns.</p>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown("""
    <div class="card">
    <h4>🌍 Geographic Insights</h4>
    <p>Understand which states are most affected by disasters.</p>
    </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown("""
    <div class="card">
    <h4>🔥 Incident Analysis</h4>
    <p>Explore distribution of disaster types and severity.</p>
    </div>
    """, unsafe_allow_html=True)

st.markdown("---")

# -------------------------------
# INFO SECTION
# -------------------------------
st.info("👈 Use the sidebar to navigate between different analysis modules.")

# -------------------------------
# FEATURES LIST
# -------------------------------
st.markdown("## 🚀 What You Can Do")

st.markdown("""
✔ Analyze disaster frequency trends  
✔ Identify high-risk states  
✔ Compare incident types  
✔ Explore assistance programs  
✔ Download filtered data  
""")

st.markdown("---")

# -------------------------------
# FOOTER
# -------------------------------
st.success("✅ Built using Streamlit | Data Science Project | Ready for Deployment")