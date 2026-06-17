import { useState, useEffect, useRef } from "react";
import { checkDrugInteractions } from "@/services/openFDAService";

export const useDrugInteraction = (medicines) => {
  const [warnings, setWarnings] = useState([]);
  const [checking, setChecking] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    // Min 2 medicines chahiye
    const validMeds = medicines.filter((m) => m.name.trim().length > 2);
    if (validMeds.length < 2) {
      setWarnings([]);
      return;
    }

    // Debounce — doctor type karta rahe
    // har keystroke pe API call nahi
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setChecking(true);
      try {
        const results = await checkDrugInteractions(validMeds);
        setWarnings(results);
      } catch {
        setWarnings([]);
      } finally {
        setChecking(false);
      }
    }, 1000); // 1 second wait

    return () => clearTimeout(debounceRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // Medicines names change hone pe check karo
    medicines.map((m) => m.name).join(","),
  ]);

  return { warnings, checking };
};
export default useDrugInteraction;