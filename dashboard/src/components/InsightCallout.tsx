interface InsightCalloutProps {
  title: string;
  description: string;
}

const InsightCallout = ({ title, description }: InsightCalloutProps) => (
  <div className="rounded-lg p-6" style={{ background: "linear-gradient(135deg, hsl(20 80% 45%), hsl(35 90% 55%))" }}>
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-foreground/90 leading-relaxed">{description}</p>
  </div>
);

export default InsightCallout;
