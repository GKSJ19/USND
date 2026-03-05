import pandas as pd
import matplotlib.pyplot as plt

# Load dataset
df = pd.read_csv("data/disasters.csv")

# print(df.head())


############################################ STEP-1 ####################################
# Check current dtype 
print(df['Declaration Date'].dtype)
# Converting into datetime format
df['Declaration Date'] = pd.to_datetime(df['Declaration Date'], errors='coerce')
print(df['Declaration Date'].dtype)

# Count missing dates
missing_dates = df['Declaration Date'].isna().sum()
print("Missing/Invalid dates:", missing_dates)

# Checking Logical Date Range
print("Earliest date:", df['Declaration Date'].min())
print("Latest date:", df['Declaration Date'].max())

# Checking year month distribution
df['year'] = df['Declaration Date'].dt.year
df['month'] = df['Declaration Date'].dt.month

print(df['year'].value_counts().sort_index().head())
print(df['month'].value_counts().sort_index())



################################################## STEP-2 ######################################

# Year Extracting
df['year'] = df['Declaration Date'].dt.year

# Group data by year
yearly_counts = df.groupby('year').size()
print(yearly_counts.head())

# Line chart
plt.figure()
plt.plot(yearly_counts.index, yearly_counts.values)

plt.xlabel("Year")
plt.ylabel("Number of Disasters")
plt.title("Yearly Disaster Declarations in the US")
plt.show()


################################################## STEP-3 ################################################

# Group by year + incident type and count
incident_trends = df.groupby(['year', 'Disaster Type']).size()

# Converting into table format
incident_trends = incident_trends.unstack(fill_value=0)
print(incident_trends.head())

# Multi-line chart
plt.figure()

for incident in incident_trends.columns:
    plt.plot(incident_trends.index, incident_trends[incident], label=incident)

plt.xlabel("Year")
plt.ylabel("Count")
plt.title("Disaster Declarations by Incident Type Over Time")
plt.legend(title="Incident Type", bbox_to_anchor=(1.05, 1), loc='upper left')

plt.show()


################################################ STEP-4 ####################################################################

# Extract month
df['month'] = df['Declaration Date'].dt.month

# Group by month and count
monthly_counts = df.groupby('month').size().sort_index()
print(monthly_counts)

# Bar chart
plt.figure()
plt.bar(monthly_counts.index, monthly_counts.values)

plt.xlabel("Month")
plt.ylabel("Count")
plt.title("Monthly Disaster Declarations (Seasonality)")
plt.xticks(range(1, 13))

plt.show()


######################################## STEP-5 ##################################################################

# Yearly disaster counts
yearly_counts = df.groupby('year').size()

# 3-year moving average
rolling_3 = yearly_counts.rolling(window=3).mean()

# 5-year moving average
rolling_5 = yearly_counts.rolling(window=5).mean()

# Year-over-Year % Change of growth rate
growth_rate = yearly_counts.pct_change() * 100
print(growth_rate.head())

# Identify Top 5 peak years
top_years = yearly_counts.sort_values(ascending=False).head(5)
print("Top 5 Peak Disaster Years:", top_years)

