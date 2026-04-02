import Papa from 'papaparse';

export interface DisasterRecord {
  declarationNumber: string;
  declarationType: string;
  declarationDate: string;
  state: string;
  county: string;
  disasterType: string;
  disasterTitle: string;
  startDate: string;
  endDate: string;
  closeDate: string;
  individualAssistance: boolean;
  ihp: boolean;
  publicAssistance: boolean;
  hazardMitigation: boolean;
  year: number;
  month: number;
}

export async function loadDisasterData(): Promise<DisasterRecord[]> {
  const response = await fetch('/data/usnd_cleaned.csv');
  const text = await response.text();
  
  const result = Papa.parse(text, { header: true, skipEmptyLines: true });
  
  return result.data.map((row: any) => ({
    declarationNumber: row['Declaration Number'] || '',
    declarationType: row['Declaration Type'] || '',
    declarationDate: row['Declaration Date'] || '',
    state: row['State'] || '',
    county: row['County'] || '',
    disasterType: row['Disaster Type'] || '',
    disasterTitle: row['Disaster Title'] || '',
    startDate: row['Start Date'] || '',
    endDate: row['End Date'] || '',
    closeDate: row['Close Date'] || '',
    individualAssistance: row['Individual Assistance Program'] === 'Yes',
    ihp: row['Individuals & Households Program'] === 'Yes',
    publicAssistance: row['Public Assistance Program'] === 'Yes',
    hazardMitigation: row['Hazard Mitigation Program'] === 'Yes',
    year: parseInt(row['year']) || 0,
    month: parseInt(row['month']) || 0,
  }));
}

export const CHART_COLORS = [
  'hsl(199, 89%, 48%)',   // primary cyan
  'hsl(160, 84%, 39%)',   // accent green
  'hsl(38, 92%, 50%)',    // warning amber
  'hsl(280, 65%, 60%)',   // purple
  'hsl(0, 72%, 51%)',     // red
  'hsl(199, 89%, 68%)',   // light cyan
  'hsl(160, 84%, 59%)',   // light green
  'hsl(38, 92%, 70%)',    // light amber
  'hsl(320, 65%, 55%)',   // pink
  'hsl(220, 60%, 55%)',   // blue
];

export const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia', PR: 'Puerto Rico', VI: 'Virgin Islands', GU: 'Guam',
  AS: 'American Samoa', MP: 'Northern Mariana Islands',
};

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
