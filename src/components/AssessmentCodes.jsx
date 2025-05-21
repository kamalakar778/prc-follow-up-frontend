import React from 'react';

const codes = [
"HEADACHE/NECK",
"Atypical Facial Pain – G50.1",
"Facial Nerve Disorder – G51.8",
"Migraine – Chronic – G43.709",
"Occipital Neuralgia – G54.81",
"Trigeminal Neuralgia – G50.0",
"Tension Headache – G44.209",
"CERVICAL",
"Facet Arthropathy – M46.92",
"Spondylosis-Cervical – M47.812",
"Cervicalgia – M54.2",
"DJD-Cervical– M50.30",
"Herniated/Bulging disc – Cervical – M50.20",
"Stenosis – Cervical – M48.02",
"Scoliosis & Kyphoscoliosis – M41.9",
"Post – Laminectomy – Cervical – M96.4",
"Radiculopathy – Cervical – M54.12",
"UPPER EXTREMITY",
"Shoulder-Right Bursitis – M75.51",
"Shoulder-Left Bursitis – M75.52",
"Shoulder DJD Right – M19.011",
"Shoulder DJD Left – M19.012",
"Humerus (Arm) Pain (R & L) – M79.609",
"Elbow Lateral Epicondylitis (R & L) – M77.10",
"Elbow Medial Epicondylitis (R & L) – M77.00",
"Radial/Ulnar (forearm) Pain (R & L) – M79.609",
"Wrist Pain – Right – M25.531",
"Wrist Pain - Left – M25.532",
"Hand Pain – Left – M79.642",
"Hand Pain – Right – M79.641",
"Finger Pai Right – M79.644",
"Finger Pain Left – M79.645",
"Carpal Tunnel Right – G56.01",
"Carpal Tunnel Left – G56.02",
"THORACIC",
"Facet Arthropathy Thoracic – M46.94",
"Facet Spondylosis Thoracic – M47.814",
"Thoracic Spine Pain – M54.6",
"DDD Thoracic – M51.34",
"Herniated/Bulging disc – M51.24",
"Stenosis – Thoracic – M48.04",
"Scoliosis & Kyphoscoliosis – M41.9",
"Post – Laminectomy – Thoracic – M96.1",
"Thoracic Radiculopathy – M54.14",
"LUMBAR",
"Facet Arthropathy, Lumbar – M46.96",
"Facet Spondylosis – M47.816",
"Lumbago NOS/Low Back Pain – M54.50",
"DDD-Lumbar – M51.36",
"Herniated / Bulging disc lumbar – M51.26",
"Stenosis – Lumbosacral – M48.07",
"Scoliosis & Kyphoscoliosis – M41.9",
"Post Laminectomy Lumbar – M96.1",
"Radiculopathy-Lumbar – M54.16",
"LOWER EXTREMITY",
"Hip Trochanteric Bursitis Right – M70.61",
"Hip Trochanteric Bursitis Left – M70.62",
"Hip DJD Right – M16.11",
"Hip DJD Left – M16.12",
"Femur (thigh) Pain (R &/or Left ) – M79.659",
"Knee Pain Right – M25.561",
"Knee Pain Left – M25.562",
"Knee DJD Right – M17.11",
"Knee DJD Left – M17.12",
"Tibia (leg) pain (Right &/or Left ) – M79.669",
"Ankle Pain Right – M25.571",
"Ankle Pain Left – M25.572",
"Foot Pain Right – M79.671",
"Foot Pain Left – M79.672",
"Toe Pain (Right &/or Left ) – M79.676",
"SACRUM/COCCYX",
"Sacroilitis (Right and/or left) – M46.1",
"SIJ Arthropathy (Right and/or left) – M46.98",
"SIJ Pain (Right and/or left) – M53.3",
"Coccydynia – M53.3",
"MISCELLANEOUS",
"Abdominal Pain – R10.9",
"Anxiety – F41.9",
"Arthritis-Rheumatoid – M06.9",
"Arthritis, Osteo – M15.9",
"Chest Wall Pain – R07.89",
"Chest Pain – Musculoskeletal – R07.1",
"Chest Pain – Unspecified – R07.9",
"Chronic Pain – G89.29",
"Coccydynia – M53.3",
"Depression – F32.9",
"Diabetes 1 – with issues (eg neuropathy)– E10.9",
"Diabetes 2 – with issues (eg neuropathy)– E11.8",
"Fibromyalgia – M79.7",
"Myalgia (Myofascial) Pain – M79.18",
"Obesity – E66.9",
"Obesity, Morbid – E66.01",
"Pelvic Pain – R10.2",
"Opioid Use Disorder in Remission – F11.21",
"Alcohol Dependence in Remission – F10.21",
"Opioid Use Disorder (moderate/severe) – F11.20",
"Encounter for drug Monitoring – Z51.81",
"NERVE",
"Neuralgia / Neuritis (any location) – M79.2",
"Neuropathy – Peripheral – G60.9",
"Phantom Limb with Pain – G54.6",
"Herpes Zoster (any location) – B02.9",
"PHN (Post Herpetic Neuralgia ) – B02.29",
"Meralgia Paresthetica – Left – G57.12",
"Meralgia Paresthetica – Right – G57.11",
"Mononeuropathy RLE/LLE – G57.91/2",
"Mononeuropathy RUE/LUE – G56.91/2",
"Neuropathy – peripheral – G60.9",
"Neuropathy-Unsp – G58.9",


];



const AssessmentCodes = ({ selected, setSelected }) => {
  const toggleItem = (item) => {
    const newSelected = new Set(selected);
    if (newSelected.has(item)) {
      newSelected.delete(item);
    } else {
      newSelected.add(item);
    }
    setSelected(newSelected);
  };

  return (
    <div>
      {/* <h2>Assessment Codes (click to select/deselect)</h2> */}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {codes.map((item, idx) => {
          const isSelected = selected.has(item);
          return (
            <li
              key={idx}
              onClick={() => toggleItem(item)}
              style={{
                cursor: "pointer",
                color: isSelected ? "red" : "black",
                fontWeight: isSelected ? "bold" : "normal",
                margin: "4px 0",
                userSelect: "none",
              }}
              title={isSelected ? "Click to remove" : "Click to add"}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AssessmentCodes;
