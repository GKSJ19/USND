import NarrativeDashboard from '../components/NarrativeDashboard';

export const metadata = {
  title: 'US Disaster Command Center — FEMA Declarations',
  description: 'An interactive exploration of 70 years of federally declared natural disasters across the United States.',
};

export default function Home() {
  return (
    <main>
      <NarrativeDashboard />
    </main>
  );
}
