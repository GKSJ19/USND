import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from utils import load_data, apply_filters

st.set_page_config(page_title="Insights", layout="wide")

# Load data
df = load_data()
df = apply_filters(df)

st.title("🧠 Final Insights Dashboard")

# -------------------------------
# 🔹 Insight 1: Temporal Trend
# -------------------------------
st.subheader("📈 Disaster Frequency Over Time")

yearly = df.groupby('year').size()

fig1, ax1 = plt.subplots(figsize=(10,5))
yearly.plot(ax=ax1)
ax1.set_title("Year-wise Disaster Count")
ax1.set_xlabel("Year")
ax1.set_ylabel("Number of Disasters")

st.pyplot(fig1)

st.success("Insight: Disaster frequency is increasing over time.")

# -------------------------------
# 🔹 Insight 2: Geographic Pattern
# -------------------------------
st.subheader("🌍 Top 10 Disaster-Prone States")

state_counts = df['state'].value_counts().head(10)

fig2, ax2 = plt.subplots(figsize=(10,5))
sns.barplot(x=state_counts.values, y=state_counts.index, ax=ax2)
ax2.set_title("Top 10 States by Disaster Count")
ax2.set_xlabel("Number of Disasters")
ax2.set_ylabel("State")

st.pyplot(fig2)

st.info("Insight: Certain states consistently experience more disasters.")

# -------------------------------
# 🔹 Insight 3: Incident Types
# -------------------------------
st.subheader("🔥 Incident Type Distribution")

incident_counts = df['incidentType'].value_counts().head(10)

fig3, ax3 = plt.subplots(figsize=(10,5))
sns.barplot(x=incident_counts.values, y=incident_counts.index, ax=ax3)
ax3.set_title("Top Incident Types")
ax3.set_xlabel("Count")
ax3.set_ylabel("Incident Type")

st.pyplot(fig3)

st.warning("Insight: Storms, floods, and hurricanes are the most common disaster types.")

# -------------------------------
# 🔹 Insight 4: Heatmap (Advanced)
# -------------------------------
st.subheader("📊 State vs Incident Type Heatmap")

pivot = pd.crosstab(df['state'], df['incidentType'])

# Reduce size (top 10 states & incidents)
pivot = pivot.loc[pivot.sum(axis=1).nlargest(10).index,
                  pivot.sum().nlargest(5).index]

fig4, ax4 = plt.subplots(figsize=(10,6))
sns.heatmap(pivot, cmap="coolwarm", annot=True, fmt="d", ax=ax4)

st.pyplot(fig4)

st.markdown("Insight: Specific disaster types dominate in certain states.")

# -------------------------------
# 🔹 Final Summary
# -------------------------------
st.markdown("---")

st.subheader("📌 Key Conclusions")

st.markdown("""
- Disaster frequency is increasing over time  
- Certain states are more vulnerable  
- Storms and floods dominate disaster types  
- Disaster patterns vary across regions  
""")

st.success("✅ Final Insight: Combining time, geography, and incident type provides a complete understanding of disaster patterns.")