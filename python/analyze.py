"""
Step 1: Data Analysis Script
Reads disasters.csv, computes all aggregations, outputs data.json
Run: python python/analyze.py
"""
import csv
import json
from collections import Counter, defaultdict
from pathlib import Path

BASE   = Path(__file__).parent.parent
INPUT  = BASE / "data" / "disasters.csv"
OUTPUT = BASE / "output" / "data.json"

def main():
    rows = []
    with open(INPUT) as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    print(f"Loaded {len(rows):,} records")

    # ── Milestone 1: Validation ──────────────────────────────────────
    total         = len(rows)
    missing_dates = sum(1 for r in rows if not r.get('Declaration Date'))
    missing_state = sum(1 for r in rows if not r.get('State'))
    disaster_types = list(set(r['Disaster Type'] for r in rows))
    states         = list(set(r['State'] for r in rows))

    validation = {
        'total_records': total,
        'missing_dates': missing_dates,
        'missing_state': missing_state,
        'unique_types':  len(disaster_types),
        'unique_states': len(states),
        'year_range':    [1953, 2017]
    }

    # ── Milestone 2: Temporal ────────────────────────────────────────
    year_counts  = defaultdict(int)
    month_counts = defaultdict(int)
    for r in rows:
        try:
            parts = r['Declaration Date'].split('/')
            year_counts[int(parts[2])]  += 1
            month_counts[int(parts[0])] += 1
        except:
            pass

    # Rolling 5-year average
    ys      = sorted(year_counts)
    rolling = {}
    for i, y in enumerate(ys):
        win       = [year_counts[ys[j]] for j in range(max(0, i - 4), i + 1)]
        rolling[y] = round(sum(win) / len(win))

    # Type by year (top 6 types)
    top_types = ['Storm', 'Flood', 'Hurricane', 'Fire', 'Tornado', 'Snow']
    type_year = defaultdict(lambda: defaultdict(int))
    for r in rows:
        try:
            y = int(r['Declaration Date'].split('/')[2])
            t = r['Disaster Type']
            if t in top_types:
                type_year[t][y] += 1
        except:
            pass

    # ── Milestone 3: Geographic ──────────────────────────────────────
    abbr_to_name = {
        'AL':'Alabama',    'AK':'Alaska',        'AZ':'Arizona',
        'AR':'Arkansas',   'CA':'California',    'CO':'Colorado',
        'CT':'Connecticut','DE':'Delaware',       'FL':'Florida',
        'GA':'Georgia',    'HI':'Hawaii',         'ID':'Idaho',
        'IL':'Illinois',   'IN':'Indiana',        'IA':'Iowa',
        'KS':'Kansas',     'KY':'Kentucky',       'LA':'Louisiana',
        'ME':'Maine',      'MD':'Maryland',       'MA':'Massachusetts',
        'MI':'Michigan',   'MN':'Minnesota',      'MS':'Mississippi',
        'MO':'Missouri',   'MT':'Montana',        'NE':'Nebraska',
        'NV':'Nevada',     'NH':'New Hampshire',  'NJ':'New Jersey',
        'NM':'New Mexico', 'NY':'New York',       'NC':'North Carolina',
        'ND':'North Dakota','OH':'Ohio',           'OK':'Oklahoma',
        'OR':'Oregon',     'PA':'Pennsylvania',   'RI':'Rhode Island',
        'SC':'South Carolina','SD':'South Dakota','TN':'Tennessee',
        'TX':'Texas',      'UT':'Utah',           'VT':'Vermont',
        'VA':'Virginia',   'WA':'Washington',     'WV':'West Virginia',
        'WI':'Wisconsin',  'WY':'Wyoming',        'DC':'District of Columbia',
        'PR':'Puerto Rico','GU':'Guam',           'VI':'Virgin Islands',
        'AS':'American Samoa'
    }

    state_counts = Counter(r['State'] for r in rows)
    top_states   = [s for s, _ in state_counts.most_common(12)]
    top6         = ['Storm', 'Flood', 'Hurricane', 'Snow', 'Fire', 'Tornado']

    state_type = defaultdict(lambda: defaultdict(int))
    for r in rows:
        state_type[r['State']][r['Disaster Type']] += 1

    all_state_counts = {
        abbr_to_name.get(k, k): v
        for k, v in state_counts.items()
        if k in abbr_to_name
    }

    # ── Milestone 4: Incident ────────────────────────────────────────
    type_counts = Counter(r['Disaster Type'] for r in rows)
    decl_types  = Counter(r['Declaration Type'] for r in rows)

    assist = defaultdict(lambda: {'ih': 0, 'pa': 0, 'total': 0})
    for r in rows:
        t = r['Disaster Type']
        assist[t]['total'] += 1
        if r.get('Individuals & Households Program') == 'Yes':
            assist[t]['ih'] += 1
        if r.get('Public Assistance Program') == 'Yes':
            assist[t]['pa'] += 1

    # ── Assemble & write output ──────────────────────────────────────
    data = {
        'validation':      validation,
        'year_counts':     dict(sorted(year_counts.items())),
        'rolling_avg':     dict(sorted(rolling.items())),
        'month_counts':    dict(sorted(month_counts.items())),
        'type_counts':     dict(type_counts.most_common(10)),
        'type_year':       {t: dict(sorted(type_year[t].items())) for t in top_types},
        'state_counts':    dict(state_counts.most_common(12)),
        'state_type':      {s: {t: state_type[s].get(t, 0) for t in top6} for s in top_states},
        'all_state_counts': all_state_counts,
        'assist':          {t: dict(v) for t, v in assist.items()},
        'decl_types':      dict(decl_types),
    }

    OUTPUT.parent.mkdir(exist_ok=True)
    with open(OUTPUT, 'w') as f:
        json.dump(data, f, indent=2)

    print(f"Output written to {OUTPUT}")
    print(f"Validation: {validation}")

if __name__ == '__main__':
    main()
