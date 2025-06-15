// src/components/context/MedicationContext.jsx
import React, { createContext, useState } from "react";

export const MedicationContext = createContext();

export const MedicationProvider = ({ children }) => {
  const [medicationInput, setMedicationInput] = useState("");
  const [medicationSelected, setMedicationSelected] = useState(new Set());

  const [addMedication, setAddMedication] = useState(() => () => { }); // ✅ New line

  const appendToMedicationInput = (text) => {
    setMedicationInput((prev) => (prev ? `${prev} ${text}`.trim() : text));
  };

  const groupedMedications = {
    Duration: {
      Continue: "Continue",
      Start: "Start",
      Change: "Change",
      Later: "Later",
      "StartNVisit": "Start next visit",
      "D/C": "D/C",
      hold: "hold",
    },

    "List 1": {
      baclofen: "Baclofen",
      celebrex: "Celebrex",
      clonazepam: "Clonazepam",
      cymbalta: "cymbalta",
      dilaudid: "Hydromorphone",
      diazepam: "Diazepam",
      
    },
    "List 2": {
      gabapentin: "Gabapentin",
      mobic:"Mobic",
      ibuprofen: "Ibuprofen",
      diclofenac: "Diclofenac",
      flexeril: "Flexeril",
      lorazepam: "Lorazepam",
      hydroxyzine:"hydroxyzine",
      },
      "List 3": {
      lyrica: "Lyrica",
      meloxicam: "Meloxicam",
      morphine: "Morphine",
      methadone: "Methadone",
      naproxen: "Naproxen",
      norco: "Norco",
    },
    "List 4":{
      oxycodone: "Oxycodone",
      "lido Patch": "Lidoderm Patch",
      ultram: "Ultram",
      zanaflex: "Zanaflex",
      oxazepam: "Oxazepam",
      oxycontin: "Oxycontin",
          },
    "List 5": {

      quetiapine: "Quetiapine",
      robaxin: "Robaxin",
      tizanidine:"Tizanidine",
      tramadol: "Tramadol",
      trazodone: "Trazodone",
      suboxone: "Suboxone",
      prednisone: "Prednisone",
          },
    "List 6": {
      "vynase":"Vynase",
      "medrol-dose": "Medrol-Dose Pak",
      skelaxin: "Skelaxin",
      soma: "Soma",
      "voltaren Gel": "Voltaren Gel",

    },
    "List 7":{
      Amitriptyline: "Amitriptyline",
      eszopiclone: "Eszopiclone",
      flurazepam: "Flurazepam",
      opana: "Oxymorphone",
      demerol: "Meperidine",
      butrans: "Buprenorphine",
      nucynta: "Tapentadol",
      darvocet: "Darvocet",
    },
    "List 8": {
      "Compound Cream":"Compound Cream",
      aspirin: "Aspirin",
      Alprazolam: "Alprazolam",
      codeine: "Codeine",
      fentanyl: "Fentanyl",
      temazepam: "Temazepam",
      xanax:"xanax",
      zolpidem: "Zolpidem",
      Zolpidem: "Zolpidem",
    },
    "Abbrev-1": {
      "No NSAIDs": "No NSAIDs",
      "GERD": "GERD",
      "b.i.d":"b.i.d",
       "t.i.d": "t.i.d",
      "q.i.d": "q.i.d",
      "q.h.s": "q.h.s",
      "p.r.n": "p.r.n",
      "1-2 tabs":"1-2 tabs",
      "q.d":"q.d",
    },
    // "Abbrev-2": {
    //   tid: "t.i.d",
    //   qid: "q.i.d",
    //   qhs: "q.h.s",
    //   prn: "p.r.n"
    // },

  };


  const predefinedDosages = {
    gabapentin: ["100 mg", "300 mg", "400 mg","600 mg", "800 mg"],
    mobic:["15 mg",],
    norco: ["5 mg","7.5 mg","10 mg"],
    robaxin: ["500 mg", "800 mg"],
    vynase:[""],
    hydroxyzine:[""],
    tizanidine:["4 mg"],
    
    lyrica: ["75 mg", "150 mg"],
    diclofenac: ["50 mg", "75 mg"],
    naproxen: ["250 mg", "500 mg"],
    ibuprofen: ["200 mg", "400 mg", "600 mg"],
    celebrex: ["100 mg", "200 mg"],
    meloxicam: ["7.5 mg", "15 mg"],
    aspirin: ["81 mg", "325 mg"],
    tramadol: ["50 mg", "100 mg"],
    flexeril: ["5 mg", "10 mg"],
    skelaxin: ["400 mg", "800 mg"],
    zanaflex: ["2 mg", "4 mg"],
    soma: ["250 mg", "350 mg"],
    baclofen: ["10 mg", "20 mg"],
    prednisone: ["5 mg", "10 mg", "20 mg"],
    "medrol-dose pak": ["4 mg"],
    suboxone: ["2 mg/0.5 mg", "8 mg/2 mg"],
    trazodone: ["50 mg", "100 mg"],
    diazepam: ["5 mg", "10 mg"],
    alprazolam: ["0.25 mg", "0.5 mg", "1 mg"],
    lorazepam: ["1 mg", "2 mg"],
    oxazepam: ["10 mg", "15 mg", "30 mg"],
    clonazepam: ["0.5 mg", "1 mg", "2 mg"],
    temazepam: ["15 mg", "30 mg"],
    flurazepam: ["15 mg", "30 mg"],
    zolpidem: ["5 mg", "10 mg"],
    eszopiclone: ["1 mg", "2 mg", "3 mg"],
    quetiapine: ["25 mg", "50 mg", "100 mg"],
    amitriptyline: ["10 mg", "25 mg", "50 mg"],
    "lido Patch": ["1 patch", "2 patches"],
    "voltaren Gel": ["1%", "3%"],
    oxycodone: ["5 mg", "10 mg"],
    oxycontin: ["10 mg", "20 mg"],
    morphine: ["15 mg", "30 mg"],
    fentanyl: ["25 mcg/hr", "50 mcg/hr"],
    opana: ["5 mg", "10 mg"],
    dilaudid: ["2 mg", "4 mg"],
    methadone: ["5 mg", "10 mg"],
    demerol: ["50 mg", "100 mg"],
    butrans: ["5 mcg/hr", "10 mcg/hr"],
    nucynta: ["50 mg", "100 mg"],
    codeine: ["15 mg", "30 mg"],
    darvocet: ["65 mg"],
    ultram: ["50 mg", "100 mg"],
    cymbalta: ["30 mg", "60 mg"]
  };


  const flatMedications = Object.fromEntries(
    Object.entries(groupedMedications).flatMap(([_, group]) =>
      Object.entries(group)
    )
  );

  return (
    <MedicationContext.Provider
      value={{
        groupedMedications,
        flatMedications,
        medicationSelected,
        setMedicationSelected,
        medicationInput,
        setMedicationInput,
        appendToMedicationInput,
        predefinedDosages,
        addMedication,          // ✅ Needed by MedicationManagement
        setAddMedication        // ✅ Needed to register handler
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};
