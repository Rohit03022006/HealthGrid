const DANGEROUS_COMBOS = [
  {
    drugs:   ["Warfarin", "Aspirin"],
    warning: "Increased bleeding risk",
  },
  {
    drugs:   ["Metformin", "Alcohol"],
    warning: "Risk of lactic acidosis",
  },
];

const DrugWarningAlert = ({ medicines }) => {
  const names = medicines.map((m) => m.name.toLowerCase());

  const warnings = DANGEROUS_COMBOS.filter((combo) =>
    combo.drugs.every((drug) =>
      names.some((n) => n.includes(drug.toLowerCase()))
    )
  );

  if (warnings.length === 0) return null;

  return (
    <div>
      {warnings.map((w, i) => (
        <p key={i}>⚠️ {w.warning}: {w.drugs.join(" + ")}</p>
      ))}
    </div>
  );
};

export default DrugWarningAlert;