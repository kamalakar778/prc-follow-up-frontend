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

const SidebarNav = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const styles = {
    sidebar: {
      position: "fixed",
      top: 0,
      left: 0,
      width: isCollapsed ? "0" : "180px",
      height: "100vh",
      overflowY: isCollapsed ? "hidden" : "auto",
      padding: isCollapsed ? "0" : "1rem",
      backgroundColor: "#f4f4f4",
      borderRight: isCollapsed ? "none" : "1px solid #ccc",
      zIndex: 10,
      transition: "all 0.3s ease-in-out",
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
      padding: "0.4rem",
      backgroundColor: isActive ? "#4CAF50" : "#fff",
      color: isActive ? "#fff" : "#000",
      border: "none",
      borderRadius: "4px",
      textAlign: "left",
      cursor: "pointer",
      fontWeight: "400",
    }),
    toggleButton: {
      position: "fixed",
      top: "1rem",
      left: isCollapsed ? "1rem" : "210px",
      zIndex: 20,
      padding: "0.4rem 0.8rem",
      border: "1px solid #4CAF50",
      borderRadius: "4px",
      backgroundColor: "#fff",
      cursor: "pointer",
      fontWeight: "500",
      color: "#4CAF50",
      transition: "left 0.3s ease-in-out",
    },
  };

  return (
    <>
      <aside style={styles.sidebar}>
        {!isCollapsed && (
          <>
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
                ...styles.button(false),
                marginTop: "1rem",
                backgroundColor: trackingEnabled ? "#4CAF50" : "#fff",
                color: trackingEnabled ? "#fff" : "#4CAF50",
              }}
            >
              {trackingEnabled
                ? "Disable Auto Highlight"
                : "Enable Auto Highlight"}
            </button>
          </>
        )}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          style={styles.toggleButton}
        >
          {isCollapsed ? "☰" : "×"}
        </button>
      </aside>


    </>
  );
};

export default SidebarNav;
