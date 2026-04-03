import streamlit as st
import pandas as pd
import plotly.express as px
from utils.data_loader import load_data

# ================= CONFIG =================
st.set_page_config(page_title="Temporal Analysis", layout="wide")
def add_space(height=30):
    st.markdown(f"<div style='height:{height}px'></div>", unsafe_allow_html=True)
# ================= LOAD =================
df = load_data()
df["date"] = pd.to_datetime(df["date"])
df["year"] = df["date"].dt.year
df["month"] = df["date"].dt.month

month_order = ["Jan","Feb","Mar","Apr","May","Jun",
               "Jul","Aug","Sep","Oct","Nov","Dec"]

# ================= STYLE =================
st.markdown("""
<style>
.block-container {
    padding-top: 1.5rem;
    padding-bottom: 2rem;
}

/* Headings */
h1 {
    text-align: center;
    font-size: 36px;
    margin-bottom: 5px;
}
h2 {
    margin-top: 25px;
    margin-bottom: 5px;
}
h3 {
    margin-top: 5px;
    margin-bottom: 8px;
}

/* Chart container */
[data-testid="stPlotlyChart"] {
    background: #1A1C24;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #2a2d3a;
}

/* KPI cards */
.metric-box {
    background:#1A1C24;
    padding:18px;
    border-radius:12px;
    border:1px solid #2a2d3a;
    height:110px;

    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    text-align:center;
}

.metric-box h3 {
    margin:5px 0 0 0;
    font-size:22px;
}

.metric-box:hover {
    border:1px solid #4CAF50;
    transform: translateY(-3px);
    transition:0.3s;
}
</style>
""", unsafe_allow_html=True)

# ================= HEADER =================
st.markdown("<h1>📅 Temporal Analysis</h1>", unsafe_allow_html=True)

# ================= FILTER =================
st.sidebar.header("📆 Filter")

year_range = st.sidebar.slider(
    "Select Year Range",
    int(df["year"].min()),
    int(df["year"].max()),
    (int(df["year"].min()), int(df["year"].max()))
)

df = df[df["year"].between(year_range[0], year_range[1])]

# ================= TREND =================
st.markdown("## 📈 Trend Analysis")

col1, col2 = st.columns(2, gap="large")

with col1:
    st.markdown("### Yearly Disaster Trend")
    
    yearly = df.groupby("year").size().reset_index(name="Count")
    fig1 = px.line(yearly, x="year", y="Count")
    fig1.update_traces(line=dict(width=3))
    
    st.plotly_chart(fig1, use_container_width=True)

with col2:
    st.markdown("### Incident Type Trend")
    
    incident_trend = df.groupby(["year", "incidentType"]).size().reset_index(name="Count")
    fig2 = px.line(incident_trend, x="year", y="Count", color="incidentType")
    
    st.plotly_chart(fig2, use_container_width=True)
add_space(10)
# ================= SEASONAL =================
st.markdown("## 📅 Seasonal & Pattern Analysis")

col3, col4 = st.columns(2, gap="large")

with col3:
    st.markdown("### Monthly Seasonality")
    
    monthly = df.groupby("month").size().reset_index(name="Count")
    monthly = monthly.sort_values("month")
    monthly["month_name"] = monthly["month"].apply(lambda x: month_order[x-1])
    
    fig3 = px.bar(monthly, x="month_name", y="Count")
    
    st.plotly_chart(fig3, use_container_width=True)

with col4:
    st.markdown("### Rolling Average (3-Year)")
    
    yearly["Rolling"] = yearly["Count"].rolling(window=3).mean()
    fig4 = px.line(yearly, x="year", y=["Count", "Rolling"])
    
    st.plotly_chart(fig4, use_container_width=True)
add_space(10)
# ================= GROWTH =================
st.markdown("## 📊 Growth Analysis")

yearly["Growth"] = yearly["Count"].pct_change() * 100
fig5 = px.line(yearly, x="year", y="Growth")

st.plotly_chart(fig5, use_container_width=True)
add_space(10)
# ================= INSIGHTS =================
st.markdown("## 🔍 Key Insights")

# Calculations
peak_year = yearly.loc[yearly["Count"].idxmax()]
trend_text = "increasing" if yearly["Count"].iloc[-1] > yearly["Count"].iloc[0] else "decreasing"

mean = yearly["Count"].mean()
std = yearly["Count"].std()
spikes = yearly[yearly["Count"] > mean + 2*std]

top_month = monthly.loc[monthly["Count"].idxmax()]
growth_peak = yearly.loc[yearly["Growth"].idxmax()]

# KPI CARDS
c1, c2, c3, c4 = st.columns(4, gap="medium")

c1.markdown(f"<div class='metric-box'><b>Peak Year</b><h3>{int(peak_year['year'])}</h3></div>", unsafe_allow_html=True)
c2.markdown(f"<div class='metric-box'><b>Trend</b><h3>{trend_text.capitalize()}</h3></div>", unsafe_allow_html=True)
c3.markdown(f"<div class='metric-box'><b>Top Month</b><h3>{top_month['month_name']}</h3></div>", unsafe_allow_html=True)
c4.markdown(f"<div class='metric-box'><b>Max Growth</b><h3>{growth_peak['Growth']:.1f}%</h3></div>", unsafe_allow_html=True)

# SPIKE MESSAGE (CENTERED CLEAN)
