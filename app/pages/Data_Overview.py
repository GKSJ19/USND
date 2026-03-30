import streamlit as st
from utils import load_data, apply_filters

df = load_data()
df = apply_filters(df)

st.title("📊 Data Overview")

col1, col2, col3, col4 = st.columns(4)

col1.metric("Total Records", len(df))
col2.metric("States", df['state'].nunique())
col3.metric("Incident Types", df['incidentType'].nunique())
col4.metric("Years", df['year'].nunique())

st.markdown("---")

st.subheader("Sample Data")
st.dataframe(df.head())

st.subheader("Missing Values")
st.write(df.isnull().sum())