import { useState } from "react";
import {
  createTemplateAPI,
  deleteTemplateAPI,
} from "@/services/templateService";

const TemplateSelector = ({ templates, onLoad, onRefresh }) => {
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [currentMedicines, setCurrentMedicines] = useState([]);

  const handleSaveAsTemplate = async (medicines, advice) => {
    if (!newName.trim()) return;
    setSaving(true);

    try {
      await createTemplateAPI({
        name: newName.trim(),
        medicines,
        advice,
      });
      setNewName("");
      onRefresh(); // Parent se templates reload karo
    } catch (err) {
      console.error("Template save failed:", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (templateId) => {
    try {
      await deleteTemplateAPI(templateId);
      onRefresh();
    } catch (err) {
      console.error("Template delete failed:", err.message);
    }
  };

  return (
    <div>
      {/* Load Template */}
      <select onChange={(e) => onLoad(e.target.value)}>
        <option value="">Load Template...</option>
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* Delete Template */}
      {templates.map((t) => (
        <div key={t.id}>
          <span>{t.name}</span>
          <button onClick={() => handleDelete(t.id)}>Delete</button>
        </div>
      ))}

      {/* Save Current As Template */}
      <input
        placeholder="Template name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <button disabled={saving}>
        {saving ? "Saving..." : "Save as Template"}
      </button>
    </div>
  );
};

export default TemplateSelector;
