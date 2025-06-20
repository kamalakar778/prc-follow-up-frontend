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
    // Duration: {
    //   Continue: "Continue",
    //   Start: "Start",
    //   Change: "Change",
    //   Later: "Later",
    //   "StartNVisit": "Start next visit",
    //   "D/C": "D/C",
    //   hold: "hold",
    // },

    "List 1": {
      gabapentin: "Gabapentin",
      mobic: "Mobic",
      ibuprofen: "Ibuprofen",
      diclofenac: "Diclofenac",
      flexeril: "Flexeril",
      hydroxyzine: "hydroxyzine",
      norco: "Norco",
      Elavil: "Elavil",
      lyrica: "Lyrica",
    },
    "List 2": {
      baclofen: "Baclofen",
      celebrex: "Celebrex",
      clonazepam: "Clonazepam",
      cymbalta: "cymbalta",
      dilaudid: "Dilaudid",
      diazepam: "Diazepam",
      percocet: "Percocet",
      xanax: "xanax",
      zanaflex: "Zanaflex",
    },
    "List 3": {
      lorazepam: "Lorazepam",
      Eliquis: "Eliquis",
      meloxicam: "Meloxicam",
      morphine: "Morphine",
      methadone: "Methadone",
      ultram: "Ultram",
      prednisone: "Prednisone",
      Zolpidem: "Zolpidem",
      zofran: "Zofran",
    },
    "List 4": {
      
      oxycodone: "Oxycodone",
      oxycontin: "Oxycontin",
      robaxin: "Robaxin",
      Relistor:"Relistor",
      suboxone: "Suboxone",
      Seroquel: "Seroquel",
      tizanidine: "Tizanidine",
      tramadol: "Tramadol",
      trazodone: "Trazodone",
    },
    "List 5": {
      aspirin: "Aspirin",
      naproxen: "Naproxen",
      Amitriptyline: "Amitriptyline",
      quetiapine: "Quetiapine",
      soma: "Soma",
      codeine: "Codeine",
      "vynase": "Vynase",
      Alprazolam: "Alprazolam",
      fentanyl: "Fentanyl",
    },
    "List 6": {
      "medrol-dose": "Medrol-Dose Pak",
      "voltaren Gel": "Voltaren Gel",
      "Compound Cream": "Compound Cream",
      "lido Patch": "Lidoderm Patch",
      temazepam: "Temazepam",
    },
    "Abbrev-1": {
      "No NSAIDs": "No NSAIDs",
      "GERD": "GERD",
      Anticoagulants: "Anticoagulants",
      PCP: "PCP",
      PCM: "PCM",
      "1-2 tabs": "1-2 tabs",
      "12 hours on/off": "12 hours on/off",
    },

    "Abbrev-2": {
      "q.d": "q.d",
      "p.o": "p.o",
      "b.i.d": "b.i.d",
      "q.i.d": "q.i.d",
      "q.h.s": "q.h.s",
      "p.r.n": "p.r.n",
      "t.i.d": "t.i.d",
    },
    // "Abbrev-2": {
    //   tid: "t.i.d",
    //   qid: "q.i.d",
    //   qhs: "q.h.s",
    //   prn: "p.r.n"
    // },

  };


  const predefinedDosages = {
    gabapentin: ["100 mg", "300 mg", "400 mg", "600 mg", "800 mg"],
    mobic: ["7.5 mg", "15 mg",],
    norco: ["5 mg", "7.5 mg", "10 mg"],
    robaxin: ["500 mg", "800 mg"],
    vynase: [""],
    hydroxyzine: [""],
    tizanidine: ["2 mg","4 mg"],
    percocet: ["5 mg"],
    lyrica: ["50 mg", "75 mg", "100 mg", "150 mg", "200 mg"],
    cymbalta: ["30 mg", "60 mg"],
    Elavil:["10 mg"],
    Relistor:["150 mg"],

    diclofenac: ["gel", "50 mg", "75 mg"],
    ibuprofen: ["200 mg", "400 mg", "600 mg"],
    celebrex: ["100 mg", "200 mg"],
    tramadol: ["50 mg", "100 mg"],
    meloxicam: ["7.5 mg", "15 mg"],
    baclofen: ["10 mg", "20 mg"],
    prednisone: ["5 mg", "10 mg", "20 mg"],
    clonazepam: ["0.5 mg", "1 mg", "2 mg"],
    zanaflex: ["2 mg", "4 mg"],
    zofran: ["4 mg"],
    zolpidem: ["5 mg", "10 mg"],
    trazodone: ["50 mg", "100 mg"],
    "lido Patch": ["1 patch", "2 patches"],
    "voltaren Gel": ["1%", "3%"],
    "medrol-dose pak": ["4 mg"],
    suboxone: ["2 mg/0.5 mg", "8 mg/2 mg"],
    methadone: ["5 mg", "10 mg"],
    ultram: ["50 mg", "100 mg"],
    flexeril: ["5 mg", "10 mg"],
    diazepam: ["5 mg", "10 mg"],
    alprazolam: ["0.25 mg", "0.5 mg", "1 mg"],
    lorazepam: ["1 mg", "2 mg"],
    oxycodone: ["5 mg", "10 mg"],
    amitriptyline: ["10 mg", "25 mg", "50 mg"],
    oxycontin: ["10 mg", "20 mg"],
    morphine: ["15 mg", "30 mg"],
    dilaudid: ["2 mg", "4 mg"],

    naproxen: ["250 mg", "500 mg"],
    aspirin: ["81 mg", "325 mg"],
    skelaxin: ["400 mg", "800 mg"],
    soma: ["250 mg", "350 mg"],
    oxazepam: ["10 mg", "15 mg", "30 mg"],
    temazepam: ["15 mg", "30 mg"],
    flurazepam: ["15 mg", "30 mg"],
    eszopiclone: ["1 mg", "2 mg", "3 mg"],
    quetiapine: ["25 mg", "50 mg", "100 mg"],
    fentanyl: ["25 mcg/hr", "50 mcg/hr"],
    opana: ["5 mg", "10 mg"],
    demerol: ["50 mg", "100 mg"],
    butrans: ["5 mcg/hr", "10 mcg/hr"],
    nucynta: ["50 mg", "100 mg"],
    codeine: ["15 mg", "30 mg"],
    darvocet: ["65 mg"],
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
