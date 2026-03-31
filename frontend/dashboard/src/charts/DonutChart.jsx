useEffect(() => {
  loadCSVData().then((res) => {
    console.log(res);   // 👈 ADD THIS
    const processed = getIncidentDistribution(res);
    setData(processed);
  });
}, []);