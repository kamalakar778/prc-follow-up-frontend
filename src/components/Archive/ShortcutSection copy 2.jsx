// components/ShortcutSection.jsx
import React, { useContext } from "react";
import { ShortcutContext } from "../components/context/ShortcutContext";

const styles = {
  section: {
    marginBottom: "20px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "6px",
  },
  groupContainer: {
    display: "flex",
    gap: "12px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  groupLabel: {
    fontWeight: "500",
    fontSize: "13px",
    marginBottom: "4px",
    color: "#333",
    textTransform: "capitalize",
  },
  button: {
    padding: "4px 8px",
    fontSize: "12px",
    border: "1px solid #888",
    borderRadius: "4px",
    backgroundColor: "#F5F5F5",
    color: "#333",
    cursor: "pointer",
    margin: "4px",
  },
  selectedButton: {
    backgroundColor: "#E0F0FF",
    color: "#0066cc",
    borderColor: "#0066cc",
  },
  copyButton: {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
    color: "#155724",
    marginTop: "8px",
  },
};

const ShortcutSection = () => {
  const {
    groupedPainLocation,
    painSelected,
    setPainSelected,
    abbrSelected,
    setAbbrSelected,
    abbreviations,
  } = useContext(ShortcutContext);

  const sections = [
    {
      type: "pain",
      title: "Quick‑Select Pain Descriptors",
      entries: groupedPainLocation,
      selectedSet: painSelected,
      setSelected: setPainSelected,
      labelKey: "label",
    },
    {
      type: "abbreviation",
      title: "Quick‑Select Abbreviations",
      entries: { Abbreviations: abbreviations },
      selectedSet: abbrSelected,
      setSelected: setAbbrSelected,
      labelKey: "key",
    },
  ];

  return (
    <>
      {sections.map(({ type, title, entries, selectedSet, setSelected }) => {
        const isPain = type === "pain";
        return (
          <div key={type} style={styles.section}>
            <h2 style={styles.title}>{title}</h2>
            <div
              style={{
                ...styles.groupContainer,
                flexDirection: "row",
                flexWrap: isPain ? "wrap" : "nowrap",
                overflowX: isPain ? "visible" : "auto",
              }}
            >
              {Object.entries(entries).map(([groupKey, group]) =>
                isPain ? (
                  <div key={groupKey} style={styles.column}>
                    <div style={styles.groupLabel}>{groupKey}</div>
                    {Object.entries(group).map(([key, label]) => {
                      const isSelected = selectedSet.has(key);
                      return (
                        <button
                          key={key}
                          type="button"
                          style={{
                            ...styles.button,
                            ...(isSelected ? styles.selectedButton : {}),
                          }}
                          onClick={() => {
                            setSelected((prev) => {
                              const updated = new Set(prev);
                              updated.has(key)
                                ? updated.delete(key)
                                : updated.add(key);
                              return updated;
                            });
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  Object.entries(group).map(([key, label]) => {
                    const isSelected = selectedSet.has(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        style={{
                          ...styles.button,
                          ...(isSelected ? styles.selectedButton : {}),
                        }}
                        onClick={() => {
                          setSelected((prev) => {
                            const updated = new Set(prev);
                            updated.has(key)
                              ? updated.delete(key)
                              : updated.add(key);
                            return updated;
                          });
                        }}
                      >
                        {key}
                      </button>
                    );
                  })
                )
              )}
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <button
                type="button"
                style={{ ...styles.button, ...styles.copyButton }}
                onClick={() => {
                  const allEntries = isPain
                    ? Object.assign({}, ...Object.values(groupedPainLocation))
                    : abbreviations;
                  const copied = [...selectedSet]
                    .map((k) => allEntries[k])
                    .join(", ");
                  if (copied) {
                    navigator.clipboard.writeText(copied);
                    setSelected(new Set());
                  }
                }}
              >
                📋 Copy
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ShortcutSection;
