import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import dash
from dash import dcc, html, Input, Output, dash_table
import dash_bootstrap_components as dbc
import plotly.io as pio

pio.templates.default = "plotly_white"

def style_fig(fig):
    fig.update_layout(
        margin=dict(l=20, r=20, t=50, b=20),
        font=dict(family="Segoe UI, Tahoma, Geneva, Verdana, sans-serif", color="#2c3e50"),
        plot_bgcolor="white",
        paper_bgcolor="white",
        hoverlabel=dict(bgcolor="white", font_size=13, font_family="Segoe UI"),
        coloraxis_colorbar=dict(thicknessmode="pixels", thickness=15, lenmode="pixels", len=200)
    )
    fig.update_xaxes(showgrid=True, gridwidth=1, gridcolor='#f0f0f0', zeroline=False)
    fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor='#f0f0f0', zeroline=False)
    return fig

try:
    df = pd.read_csv('data/processed/usnd_cleaned.csv')
    df['declarationDate'] = pd.to_datetime(df['declarationDate'])
    
    incident_counts = df['incidentType'].value_counts().reset_index()
    incident_counts.columns = ['Incident Type', 'Count']
    top_incidents_list = incident_counts['Incident Type'].head(10).tolist()
    
    time_incident_df = df.groupby(['year', 'incidentType']).size().reset_index(name='Count')
    
    df['IH_numeric'] = df['ihProgramDeclared'].map({'Yes': 1, 'No': 0}).fillna(0)
    df['PA_numeric'] = df['paProgramDeclared'].map({'Yes': 1, 'No': 0}).fillna(0)
    
    recent_df = df[['declarationDate', 'state', 'incidentType', 'ihProgramDeclared', 'paProgramDeclared']].sort_values('declarationDate', ascending=False).head(100)
    recent_df['declarationDate'] = recent_df['declarationDate'].dt.strftime('%Y-%m-%d')

except Exception as e:
    print(f"Error loading data: {e}")
    df = pd.DataFrame()

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.LUX, dbc.icons.FONT_AWESOME], suppress_callback_exceptions=True)
server = app.server  # Expose the underlying Flask server for deployment

SIDEBAR_STYLE = {
    "position": "fixed", "top": 0, "left": 0, "bottom": 0, "width": "16rem",
    "padding": "2rem 1.5rem", "backgroundColor": "#ffffff", "borderRight": "1px solid #e9ecef"
}
CONTENT_STYLE = {
    "marginLeft": "16rem", "padding": "2rem 3rem", "backgroundColor": "#f4f6f9", "minHeight": "100vh"
}

sidebar = html.Div(
    [
        html.H4("USND Analytics", className="text-primary fw-bold mb-0", style={"letterSpacing": "1px"}),
        html.Hr(style={'borderColor': '#dee2e6'}),
        dbc.Nav(
            [
                dbc.NavLink([html.I(className="fa-solid fa-square-poll-vertical me-2"), " Dashboard"], href="/", active="exact", className="mb-2 rounded"),
                dbc.NavLink([html.I(className="fa-solid fa-file-invoice me-2"), " Briefing"], href="/story", active="exact", className="mb-2 rounded"),
                dbc.NavLink([html.I(className="fa-solid fa-book-open me-2"), " Data Story"], href="/narrative", active="exact", className="mb-2 rounded"),
                dbc.NavLink([html.I(className="fa-solid fa-timeline me-2"), " Temporal"], href="/temporal", active="exact", className="mb-2 rounded"),
                dbc.NavLink([html.I(className="fa-solid fa-earth-americas me-2"), " Spatial"], href="/geographic", active="exact", className="mb-2 rounded"),
                dbc.NavLink([html.I(className="fa-solid fa-chart-pie me-2"), " Relief & Aid"], href="/incident", active="exact", className="rounded"),
            ],
            vertical=True, pills=True,
        ),
    ],
    style=SIDEBAR_STYLE,
)

content = html.Div(id="page-content", style=CONTENT_STYLE)
app.layout = html.Div([dcc.Location(id="url"), sidebar, content])

@app.callback(Output("page-content", "children"), [Input("url", "pathname")])
def render_page_content(pathname):
    if df.empty:
        return html.H4("Data file missing. Please ensure usnd_cleaned.csv is present.", className="text-danger mt-4")

    if pathname == "/":
        fig_treemap = px.treemap(incident_counts.head(10), path=['Incident Type'], values='Count', color='Count', color_continuous_scale='Blues')
        fig_treemap.update_layout(title="Volume by Incident Type (Top 10)")
        
        return html.Div([
            html.H3("Enterprise Dashboard", className="mb-4 text-dark fw-bold"),
            dbc.Row([
                dbc.Col(dbc.Card(dbc.CardBody([
                    html.H6("TOTAL DECLARATIONS", className="text-muted fw-bold mb-1", style={"fontSize": "0.75rem"}), 
                    html.H3(f"{len(df):,}", className="text-dark mb-0")
                ]), className="shadow-sm border-0 border-start border-primary border-4 rounded-3 mb-4")),
                dbc.Col(dbc.Card(dbc.CardBody([
                    html.H6("IMPACTED STATES", className="text-muted fw-bold mb-1", style={"fontSize": "0.75rem"}), 
                    html.H3(f"{df['state'].nunique()}", className="text-dark mb-0")
                ]), className="shadow-sm border-0 border-start border-info border-4 rounded-3 mb-4")),
                dbc.Col(dbc.Card(dbc.CardBody([
                    html.H6("MAX INCIDENT: " + incident_counts.iloc[0]['Incident Type'].upper(), className="text-muted fw-bold mb-1", style={"fontSize": "0.75rem"}), 
                    html.H3(f"{incident_counts.iloc[0]['Count']:,}", className="text-dark mb-0")
                ]), className="shadow-sm border-0 border-start border-danger border-4 rounded-3 mb-4")),
            ]),
            dbc.Row([
                dbc.Col(dbc.Card(dbc.CardBody(dcc.Graph(figure=style_fig(fig_treemap))), className="shadow-sm border-0 rounded-3 mb-4"), width=6),
                dbc.Col(dbc.Card(dbc.CardBody([
                    html.H5("Recent Declarations Ledger", className="mb-3 fw-bold text-dark"),
                    dash_table.DataTable(
                        data=recent_df.to_dict('records'),
                        columns=[{"name": i, "id": i} for i in recent_df.columns],
                        page_size=10,
                        style_as_list_view=True,
                        style_table={'overflowX': 'auto'},
                        style_header={
                            'backgroundColor': 'white', 
                            'fontWeight': 'bold', 
                            'borderBottom': '2px solid #3498db',
                            'fontSize': '12px'
                        },
                        style_cell={
                            'padding': '8px', 
                            'textAlign': 'left', 
                            'fontFamily': 'Segoe UI', 
                            'borderBottom': '1px solid #e9ecef',
                            'fontSize': '12px',
                            'whiteSpace': 'normal',
                            'height': 'auto'
                        },
                    )
                ]), className="shadow-sm border-0 rounded-3 mb-4"), width=6)
            ])
        ])

    elif pathname == "/story":
        time_df = df.groupby('year').size().reset_index(name='Count')
        fig_story1 = px.line(time_df, x='year', y='Count')
        fig_story1.update_traces(line=dict(color="#3498db", width=3), fill='tozeroy', fillcolor='rgba(52, 152, 219, 0.1)')
        
        fig_bar = px.bar(incident_counts.head(5), x='Count', y='Incident Type', orientation='h')
        fig_bar.update_traces(marker_color='#2c3e50')
        fig_bar.update_layout(yaxis={'categoryorder':'total ascending'})

        return html.Div([
            html.H3("Executive Briefing", className="mb-4 text-dark fw-bold"),
            dbc.Row([
                dbc.Col([
                    html.Div([
                        html.H5("Macro Trends & Frequencies", className="text-dark fw-bold"),
                        html.P("Federal disaster declarations exhibit a distinct upward trajectory spanning the last 70 years. This suggests an increasing intersection of severe climate behavior, widening infrastructure footprints, and evolving federal response mandates.", className="text-muted"),
                    ], className="mb-5"),
                    html.Div([
                        html.H5("Risk Concentration", className="text-dark fw-bold"),
                        html.P("Flood and storm-based events represent the overwhelming majority of incidents. Geographically, coastal borders bear the heaviest financial and physical impacts due to combined hurricane and localized flooding phenomena.", className="text-muted"),
                    ])
                ], width=5, className="pe-5"),
                dbc.Col([
                    dbc.Card(dbc.CardBody([html.H6("Historical Climb", className="fw-bold"), dcc.Graph(figure=style_fig(fig_story1), style={"height": "250px"})]), className="shadow-sm border-0 rounded-3 mb-4"),
                    dbc.Card(dbc.CardBody([html.H6("Leading Risk Factors", className="fw-bold"), dcc.Graph(figure=style_fig(fig_bar), style={"height": "250px"})]), className="shadow-sm border-0 rounded-3")
                ], width=7)
            ])
        ])

    elif pathname == "/narrative":
        top3_inc = incident_counts['Incident Type'].head(3).tolist()
        story_area_df = time_incident_df[time_incident_df['incidentType'].isin(top3_inc)]
        
        fig_area = px.area(story_area_df, x='year', y='Count', color='incidentType', title='The Triple Threat: Flood, Fire, & Storms', color_discrete_sequence=px.colors.qualitative.Pastel)
        
        focus_states = ['TX', 'CA', 'FL']
        state_focus_df = df[df['state'].isin(focus_states)].groupby(['state', 'incidentType']).size().reset_index(name='Count')
        fig_state_focus = px.bar(state_focus_df, x='Count', y='state', color='incidentType', orientation='h', title='The Frontlines: TX, CA, & FL Incident Breakdown')

        return html.Div([
            html.H3("The Story of US Disasters", className="mb-4 text-dark fw-bold"),
            
            dbc.Row(dbc.Col(html.Div([
                html.P("Every data point is a community impacted. Since 1953, the United States has faced an escalating battle against nature. This isn't just about rising numbers; it's a story of changing climates, expanding coastlines, and a shifting federal landscape.", className="lead text-muted fst-italic border-start border-4 border-primary ps-4 py-2 bg-white rounded-end mb-4 shadow-sm")
            ]))),
            
            html.H4("Chapter 1: The Rising Threat", className="text-primary fw-bold mt-4"),
            html.P("Looking back, it becomes undeniably clear that Floods, Fires, and Severe Storms are driving the national disaster count. As temperatures rise and weather patterns shift, what used to be 'once-in-a-century' occurrences are becoming annual expectations. The area chart below visualizes how these top three disaster types have aggressively grown over the decades.", className="text-secondary"),
            dbc.Card(dbc.CardBody(dcc.Graph(figure=style_fig(fig_area))), className="shadow-sm border-0 rounded-3 mb-5"),
            
            html.H4("Chapter 2: The Frontline Capitals", className="text-primary fw-bold"),
            html.P("Disasters don't hit evenly. Texas, California, and Florida represent the 'Big Three' disaster capitals of the United States. Texas battles an exhausting combination of Gulf hurricanes and deep-freeze storms. California wages a war against both the earth (earthquakes) and raging wildfires. Meanwhile, Florida remains the primary target for Atlantic hurricane activity, dealing with extreme cyclical flooding.", className="text-secondary"),
            dbc.Card(dbc.CardBody(dcc.Graph(figure=style_fig(fig_state_focus))), className="shadow-sm border-0 rounded-3 mb-5"),
            
            html.H4("Chapter 3: The Cost of Survival", className="text-primary fw-bold"),
            html.P("When nature strikes, the federal government acts as the insurer of last resort. Examining Public Assistance (PA) programs reveals that almost every major incident shatters local infrastructure—requiring federal tax dollars to rebuild roads, bridges, and power lines. Individual Housing (IH) assistance tells an even more tragic story: it signifies instances where homes were utterly destroyed, leaving citizens displaced and entirely reliant on immediate federal shelter intervention.", className="text-secondary mb-5")
        ])

    elif pathname == "/temporal":
        return html.Div([
            html.H3("Interactive Temporal Diagnostics", className="mb-4 text-dark fw-bold"),
            dbc.Card(dbc.CardBody([
                html.Label("Filter Timeline (Years)", className="fw-bold mb-3"),
                dcc.RangeSlider(
                    id='year-slider', min=int(df['year'].min()), max=int(df['year'].max()), 
                    step=1, value=[1990, int(df['year'].max())],
                    marks={i: str(i) for i in range(1960, 2030, 10)},
                    tooltip={"placement": "bottom", "always_visible": True}
                )
            ]), className="shadow-sm border-0 rounded-3 mb-4"),
            dbc.Row([
                dbc.Col(dbc.Card(dbc.CardBody(dcc.Graph(id='temp-bar')), className="shadow-sm border-0 rounded-3 mb-4"), width=12),
                dbc.Col(dbc.Card(dbc.CardBody(dcc.Graph(id='temp-line')), className="shadow-sm border-0 rounded-3"), width=12)
            ])
        ])

    elif pathname == "/geographic":
        return html.Div([
            html.H3("Interactive Spatial Matrix", className="mb-4 text-dark fw-bold"),
            dbc.Card(dbc.CardBody([
                html.Label("Isolate by Incident Type", className="fw-bold mb-2"),
                dcc.Dropdown(
                    id='incident-dropdown',
                    options=[{'label': 'All Disasters', 'value': 'All'}] + [{'label': i, 'value': i} for i in top_incidents_list],
                    value='All', clearable=False,
                    style={"width": "50%"}
                )
            ]), className="shadow-sm border-0 rounded-3 mb-4"),
            dbc.Row([
                dbc.Col(dbc.Card(dbc.CardBody(dcc.Graph(id='spatial-map')), className="shadow-sm border-0 rounded-3"), width=7),
                dbc.Col(dbc.Card(dbc.CardBody(dcc.Graph(id='spatial-bar')), className="shadow-sm border-0 rounded-3"), width=5)
            ])
        ])

    elif pathname == "/incident":
        assistance_df = df.groupby('incidentType')[['IH_numeric', 'PA_numeric']].sum().reset_index()
        assistance_df = assistance_df.melt(id_vars='incidentType', value_vars=['IH_numeric', 'PA_numeric'], var_name='Program', value_name='Count')
        assistance_df['Program'] = assistance_df['Program'].map({'IH_numeric': 'Individual Housing (IH)', 'PA_numeric': 'Public Assistance (PA)'})

        fig_assist = px.bar(assistance_df, x='incidentType', y='Count', color='Program', barmode='group', 
                            title='Assistance Program Activation Rates (PA vs IH)', 
                            color_discrete_map={'Public Assistance (PA)': '#2c3e50', 'Individual Housing (IH)': '#3498db'})

        state_inc_df = df.groupby(['state', 'incidentType']).size().reset_index(name='Count')
        fig_stacked = px.bar(
            state_inc_df,
            x='state',
            y='Count',
            color='incidentType',
            title='State-Level Archetype Breakdown',
            barmode='stack',
            color_discrete_sequence=px.colors.qualitative.Safe
        )

        heatmap_data = state_inc_df.pivot(index='state', columns='incidentType', values='Count').fillna(0)
        fig_heat = px.imshow(
            heatmap_data,
            labels=dict(x='Incident Type', y='State', color='Count'),
            title='State vs Incident Type Heatmap',
            aspect='auto',
            color_continuous_scale='Turbo'
        )

        top_incident_types = df['incidentType'].value_counts().head(5).index
        incident_trend_df = df[df['incidentType'].isin(top_incident_types)].groupby(['year', 'incidentType']).size().reset_index(name='Count')
        fig_incident_trend = px.line(
            incident_trend_df,
            x='year',
            y='Count',
            color='incidentType',
            title='Incident Type Trends Over Time (Top 5)'
        )
        fig_incident_trend.update_traces(line=dict(width=2.5))

        return html.Div([
            html.H3("Relief & Aid Diagnostics", className="mb-4 text-dark fw-bold"),
            dbc.Row([
                dbc.Col(dbc.Card(dbc.CardBody(dcc.Graph(figure=style_fig(fig_assist))), className="shadow-sm border-0 rounded-3 mb-4"), width=12)
            ]),
            dbc.Row([
                dbc.Col(dbc.Card(dbc.CardBody(dcc.Graph(figure=style_fig(fig_stacked))), className="shadow-sm border-0 rounded-3 mb-4"), width=12)
            ]),
            dbc.Row([
                dbc.Col(dbc.Card(dbc.CardBody(dcc.Graph(figure=style_fig(fig_heat))), className="shadow-sm border-0 rounded-3 mb-4"), width=12)
            ]),
            dbc.Row([
                dbc.Col(dbc.Card(dbc.CardBody(dcc.Graph(figure=style_fig(fig_incident_trend))), className="shadow-sm border-0 rounded-3"), width=12)
            ])
        ])
    
    return html.Div([html.H3("404: Page Not Found", className="text-secondary")])

@app.callback(
    [Output('temp-bar', 'figure'), Output('temp-line', 'figure')],
    [Input('year-slider', 'value')]
)
def update_temporal(year_range):
    if df.empty: return go.Figure(), go.Figure()
    dff = df[(df['year'] >= year_range[0]) & (df['year'] <= year_range[1])]
    
    t_df = dff.groupby('year').size().reset_index(name='Count')
    fig1 = px.bar(t_df, x='year', y='Count', title=f'Annual Frequency ({year_range[0]} - {year_range[1]})')
    fig1.update_traces(marker_color='#3498db', marker_line_color='#2980b9', marker_line_width=1)
    
    t_inc_df = dff.groupby(['year', 'incidentType']).size().reset_index(name='Count')
    top_inc = dff['incidentType'].value_counts().head(5).index
    fig2 = px.line(t_inc_df[t_inc_df['incidentType'].isin(top_inc)], x='year', y='Count', color='incidentType', title='Top 5 Incident Trends for Selected Period')
    fig2.update_traces(line=dict(width=2.5))
    
    return style_fig(fig1), style_fig(fig2)

@app.callback(
    [Output('spatial-map', 'figure'), Output('spatial-bar', 'figure')],
    [Input('incident-dropdown', 'value')]
)
def update_spatial(inc_type):
    if df.empty: return go.Figure(), go.Figure()
    
    dff = df if inc_type == "All" else df[df['incidentType'] == inc_type]
    map_title = "Overall Incident Density" if inc_type == "All" else f"{inc_type} Density Map"
        
    g_df = dff.groupby('state').size().reset_index(name='Count')
    
    fig_map = px.choropleth(g_df, locations='state', locationmode='USA-states', color='Count', scope='usa', title=map_title, color_continuous_scale='Blues')
    fig_map.update_geos(showcoastlines=True, coastlinecolor="LightBlue", projection_type="albers usa")
    
    st_df = g_df.sort_values('Count', ascending=False).head(10)
    fig_bar = px.bar(st_df, x='Count', y='state', orientation='h', title=f"Top 10 States")
    fig_bar.update_layout(yaxis={'categoryorder':'total ascending'})
    fig_bar.update_traces(marker_color='#2c3e50')
    
    return style_fig(fig_map), style_fig(fig_bar)

if __name__ == '__main__':
    app.run(debug=True, port=8050)
