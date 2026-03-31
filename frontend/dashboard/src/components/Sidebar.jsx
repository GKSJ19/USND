import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="p-4 text-white">

      <h1 className="text-xl font-bold mb-6">Disaster Analytics</h1>

      <ul className="space-y-4">
        <li><Link to="/">Overview</Link></li>
        <li><Link to="/approach">Approach</Link></li>
        <li><Link to="/temporal">Temporal</Link></li>
        <li><Link to="/geographic">Geographic</Link></li>
        <li><Link to="/incident">Incident Type</Link></li>
      </ul>

    </div>
  );
}