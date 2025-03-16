import { useEffect, useState } from "react";

export default function PrintCostCalculator() {
  const [theme, setTheme] = useState("light");
  const [filamentWeight, setFilamentWeight] = useState(5);
  const [filamentCostPerKg, setFilamentCostPerKg] = useState(600);
  const [powerConsumption, setPowerConsumption] = useState(100);
  const [electricityRate, setElectricityRate] = useState(1.25);
  const [printTime, setPrintTime] = useState(1);
  const [colorChanges, setColorChanges] = useState(2);
  const [manualColorChangeTime, setManualColorChangeTime] = useState(5);
  const [laborCost, setLaborCost] = useState(150);
  const [printerCost, setPrinterCost] = useState(15000);
  const [printerLifespan, setPrinterLifespan] = useState(2000);
  const [includeDepreciation, setIncludeDepreciation] = useState(true);
  const [itemCount, setItemCount] = useState(1);
  const [requiresModification, setRequiresModification] = useState(false);

  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(darkModeQuery.matches ? "dark" : "light");
    const handleChange = (e) => setTheme(e.matches ? "dark" : "light");
    darkModeQuery.addEventListener("change", handleChange);
    return () => darkModeQuery.removeEventListener("change", handleChange);
  }, []);

  const filamentCostPerGram = filamentCostPerKg / 1000;
  const filamentCost = filamentWeight * filamentCostPerGram * itemCount;
  const energyCost = (powerConsumption * printTime) / 1000 * electricityRate * itemCount;
  const machineDepreciation = includeDepreciation ? (printerCost / printerLifespan) * printTime * itemCount : 0;
  const colorChangeCost = colorChanges * ((manualColorChangeTime / 60) * laborCost) * itemCount;
  const designModificationCost = requiresModification ? 50 : 0;
  const totalCost = filamentCost + energyCost + machineDepreciation + colorChangeCost + designModificationCost;

  return (
    <div className={`p-6 max-w-xl mx-auto shadow-lg rounded-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <h2 className="text-xl font-bold mb-4">3D Print Cost Calculator (EGP)</h2>
      <div className="grid gap-3">
        {[ 
          { label: "Number of Items", value: itemCount, setter: setItemCount },
          { label: "Filament Weight (g)", value: filamentWeight, setter: setFilamentWeight },
          { label: "Filament Cost per Kg (EGP)", value: filamentCostPerKg, setter: setFilamentCostPerKg },
          { label: "Printer Power (W)", value: powerConsumption, setter: setPowerConsumption },
          { label: "Electricity Rate (EGP/kWh)", value: electricityRate, setter: setElectricityRate },
          { label: "Print Time (hr)", value: printTime, setter: setPrintTime },
          { label: "Color Changes", value: colorChanges, setter: setColorChanges },
          { label: "Manual Color Change Time (min)", value: manualColorChangeTime, setter: setManualColorChangeTime },
          { label: "Labor Cost (EGP/hr)", value: laborCost, setter: setLaborCost },
          { label: "Printer Cost (EGP)", value: printerCost, setter: setPrinterCost },
          { label: "Printer Lifespan (hrs)", value: printerLifespan, setter: setPrinterLifespan }
        ].map(({ label, value, setter }, index) => (
          <div key={index} className="flex justify-between items-center">
            <label className="font-medium">{label}</label>
            <input 
              type="number" 
              value={value} 
              onChange={(e) => setter(parseFloat(e.target.value) || 0)}
              className="border p-1 rounded w-20 text-right"
            />
          </div>
        ))}
        <div className="flex justify-between items-center">
          <label className="font-medium">Requires Design Modification?</label>
          <input 
            type="checkbox" 
            checked={requiresModification} 
            onChange={(e) => setRequiresModification(e.target.checked)}
          />
        </div>
        <div className="flex justify-between items-center">
          <label className="font-medium">Include Printer Depreciation?</label>
          <input 
            type="checkbox" 
            checked={includeDepreciation} 
            onChange={(e) => setIncludeDepreciation(e.target.checked)}
          />
        </div>
      </div>
      <h3 className="text-lg font-semibold mt-4">Cost Breakdown</h3>
      <table className="w-full border mt-2">
        <tbody>
          {[ 
            { label: "Filament Cost", value: filamentCost },
            { label: "Energy Cost", value: energyCost },
            { label: "Machine Depreciation", value: machineDepreciation },
            { label: "Manual Color Change Cost", value: colorChangeCost },
            { label: "Design Modification Cost", value: designModificationCost },
            { label: "Total Cost", value: totalCost }
          ].map(({ label, value }, index) => (
            <tr key={index} className="border-t">
              <td className="p-2 font-medium">{label}</td>
              <td className="p-2 text-right">EGP {value.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
