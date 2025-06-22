import React, { useState, useEffect } from "react";

// Sections
const sections = [
  { id: "demography", label: "Demography" },
  { id: "chief-complaint", label: "Chief Complaint" },
  { id: "history-of-present-illness", label: "History of Present Illness" },
  { id: "characteristics-of-pain", label: "Pain Characteristics" },
  { id: "review-of-systems", label: "Review of Systems" },
  { id: "compliance", label: "Compliance" },
  { id: "physical-examination", label: "Physical Examination" },
  { id: "earlier-followups", label: "Earlier Followups" },
  { id: "established-complaints", label: "Established Complaints" },
  { id: "assessment-codes", label: "Assessment Codes" },
  { id: "follow-up-plan", label: "Follow-Up Plan" },
  { id: "medication-management", label: "Medication Management" },
  { id: "injections-list", label: "Injections List" },
  { id: "signature-line", label: "Signature Line" },
];

// Styles
const styles = {
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "200px",
    height: "100vh",
    overflowY: "auto",
    padding: "1rem",
    backgroundColor: "#f4f4f4",
    borderRight: "1px solid #ccc",
    zIndex: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "1rem",
  },
  listItem: {
    marginBottom: "0.5rem",
  },
  button: (isActive) => ({
    width: "100%",
    padding: "0.5rem",
    backgroundColor: isActive ? "#4CAF50" : "#fff",
    color: isActive ? "#fff" : "#000",
    border: "none",
    borderRadius: "4px",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: "500",
  }),
  toggleButton: {
    marginTop: "1rem",
    padding: "0.4rem 0.8rem",
    border: "1px solid #4CAF50",
    borderRadius: "4px",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontWeight: "500",
    color: "#4CAF50",
  },
};

const SidebarNav = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [trackingEnabled, setTrackingEnabled] = useState(false); // Default OFF

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (!trackingEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [trackingEnabled]);

  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.header}>Sections</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {sections.map((section) => (
          <li key={section.id} style={styles.listItem}>
            <button
              onClick={() => scrollToSection(section.id)}
              style={styles.button(
                trackingEnabled ? activeSection === section.id : false
              )}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setTrackingEnabled((prev) => !prev)}
        style={{
          ...styles.toggleButton,
          backgroundColor: trackingEnabled ? "#4CAF50" : "#fff",
          color: trackingEnabled ? "#fff" : "#4CAF50",
        }}
      >
        {trackingEnabled ? "Disable Auto Highlight" : "Enable Auto Highlight"}
      </button>
    </aside>
  );
};

export default SidebarNav;
