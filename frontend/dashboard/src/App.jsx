import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import Overview from "./pages/Overview";
import Approach from "./pages/Approach";
import Temporal from "./pages/Temporal";
import Geographic from "./pages/Geographic";
import IncidentType from "./pages/IncidentType";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* MAIN LAYOUT WRAPPER */}
        <Route path="/" element={<MainLayout />}>

          {/* DEFAULT PAGE */}
          <Route index element={<Overview />} />

          <Route path="approach" element={<Approach />} />
          <Route path="temporal" element={<Temporal />} />
          <Route path="geographic" element={<Geographic />} />
          <Route path="incident" element={<IncidentType />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;