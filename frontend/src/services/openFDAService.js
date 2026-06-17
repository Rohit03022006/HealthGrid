const FDA_BASE = "https://api.fda.gov/drug/label.json";

// Generic name extract kara medicine string se
// "Paracetamol 500mg" → "Paracetamol"
const extractGenericName = (medicineName) => {
  return medicineName
    .split(" ")[0] // Pehla word lo
    .toLowerCase()
    .trim();
};

// Single medicine ka FDA data fetch kara
export const fetchDrugInfo = async (medicineName) => {
  const generic = extractGenericName(medicineName);

  try {
    const res = await fetch(
      `${FDA_BASE}?search=openfda.generic_name:"${generic}"&limit=1`,
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.results?.[0] || null;
  } catch {
    return null;
  }
};

// Multiple medicines ke interactions check kara
export const checkDrugInteractions = async (medicines) => {
  if (!medicines || medicines.length < 2) return [];

  const warnings = [];

  // Har medicine ka data fetch kara parallel
  const drugDataList = await Promise.all(
    medicines.map(async (med) => ({
      name: med.name,
      data: await fetchDrugInfo(med.name),
    })),
  );

  // Har drug ki warnings check kara
  drugDataList.forEach(({ name, data }) => {
    if (!data) return;

    // FDA warnings field
    const warningText = [
      data.warnings?.join(" ") || "",
      data.drug_interactions?.join(" ") || "",
      data.warnings_and_cautions?.join(" ") || "",
    ]
      .join(" ")
      .toLowerCase();

    if (!warningText) return;

    // Doosri medicines ke saath check kara
    drugDataList.forEach(({ name: otherName }) => {
      if (name === otherName) return;

      const otherGeneric = extractGenericName(otherName).toLowerCase();

      if (warningText.includes(otherGeneric)) {
        // Duplicate warning avoid kara
        const alreadyAdded = warnings.some(
          (w) => w.drugs.includes(name) && w.drugs.includes(otherName),
        );

        if (!alreadyAdded) {
          warnings.push({
            drugs: [name, otherName],
            severity: getSeverity(warningText, otherGeneric),
            message: `Potential interaction between ${name} and ${otherName}`,
            source: "OpenFDA",
          });
        }
      }
    });
  });

  return warnings;
};

// Severity determine kara warning text se
const getSeverity = (warningText, drugName) => {
  const context =
    warningText.split(drugName)[1]?.substring(0, 100)?.toLowerCase() || "";

  if (
    context.includes("contraindicated") ||
    context.includes("fatal") ||
    context.includes("death") ||
    context.includes("severe")
  )
    return "HIGH";

  if (
    context.includes("caution") ||
    context.includes("monitor") ||
    context.includes("reduce")
  )
    return "MEDIUM";

  return "LOW";
};
