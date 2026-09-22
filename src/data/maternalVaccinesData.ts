export interface MaternalVaccine {
  id: string;
  code: string;
  name: string;
  fullTitle: string;
  category: "routine" | "conditional";
  targetDisease: string;
  recommendedTiming: string;
  recommendedWeeksStart: number;
  recommendedWeeksEnd: number;
  isMandatory: boolean;
  priority: "high" | "standard" | "critical";
  summary: string;
  clinicalRationale: string;
  fetalBenefit: string;
  safetyProfile: string;
  dosingSchedule: string;
  guidelineSource: string;
  rhNegativeOnly?: boolean;
}

export interface ContraindicatedVaccine {
  id: string;
  name: string;
  type: string;
  contraindicationReason: string;
  postpartumCatchUp: string;
  riskLevel: "STRICTLY_CONTRAINDICATED" | "GENERALLY_AVOIDED";
}

export const MATERNAL_VACCINE_DEFINITIONS: MaternalVaccine[] = [
  {
    id: "mat_vac_tdap",
    code: "Tdap",
    name: "Tdap Vaccine (Whooping Cough & Tetanus)",
    fullTitle: "Tetanus Toxoid, Reduced Diphtheria Toxoid, and Acellular Pertussis Vaccine",
    category: "routine",
    targetDisease: "Pertussis (Whooping Cough), Tetanus, Diphtheria",
    recommendedTiming: "Weeks 27 – 36 (Optimal: Weeks 27 – 32)",
    recommendedWeeksStart: 27,
    recommendedWeeksEnd: 36,
    isMandatory: true,
    priority: "critical",
    summary: "Every pregnant woman should receive 1 dose of Tdap during EACH pregnancy, ideally between 27 and 36 weeks of gestation.",
    clinicalRationale: "Administration in early 3rd trimester stimulates peak maternal IgG antibody production. These antibodies actively cross the syncytiotrophoblast placental barrier, providing robust passive immunity to the newborn against life-threatening pertussis during their first 6-8 weeks of life before their own pediatric primary series.",
    fetalBenefit: "Reduces infant pertussis hospitalization and mortality by over 90% in the vulnerable first 2 months of life.",
    safetyProfile: "Proven exceptionally safe across millions of pregnancies worldwide. Inactivated toxoid/acellular formulation with no risk of congenital infection.",
    dosingSchedule: "Single 0.5 mL intramuscular (IM) injection in the deltoid muscle during the third trimester of every pregnancy, regardless of previous vaccination history.",
    guidelineSource: "ACOG Practice Advisory / CDC ACIP / FOGSI Maternal Immunization Protocol",
  },
  {
    id: "mat_vac_tt1",
    code: "TT-1 / Td-1",
    name: "Tetanus Toxoid / Adult Td (Dose 1)",
    fullTitle: "Tetanus Toxoid or Tetanus-Diphtheria (Td) First Dose",
    category: "routine",
    targetDisease: "Maternal & Neonatal Tetanus",
    recommendedTiming: "First Trimester / As soon as pregnancy is confirmed",
    recommendedWeeksStart: 6,
    recommendedWeeksEnd: 16,
    isMandatory: true,
    priority: "high",
    summary: "First foundational tetanus protection dose administered as early as possible after pregnancy confirmation.",
    clinicalRationale: "Protects the pregnant mother and developing baby from Clostridium tetani infection during delivery, particularly against contamination of the umbilical cord stump (neonatal tetanus).",
    fetalBenefit: "Transfers maternal tetanus antitoxin antibodies to ensure zero risk of tetanus neonatorum at birth.",
    safetyProfile: "Decades of proven safety globally. Inactivated toxoid safe in any trimester.",
    dosingSchedule: "0.5 mL IM in the deltoid muscle as soon as pregnancy is confirmed (Weeks 6-16).",
    guidelineSource: "National Health Mission (NHM) India / WHO / FOGSI Guidelines",
  },
  {
    id: "mat_vac_tt2",
    code: "TT-2 / Td-2 (or Booster)",
    name: "Tetanus Toxoid / Adult Td (Dose 2)",
    fullTitle: "Tetanus Toxoid or Td Second Dose (or Booster Dose)",
    category: "routine",
    targetDisease: "Maternal & Neonatal Tetanus",
    recommendedTiming: "4 Weeks after Dose 1 (or single Booster if pregnant within 3 years)",
    recommendedWeeksStart: 16,
    recommendedWeeksEnd: 26,
    isMandatory: true,
    priority: "high",
    summary: "Second dose administered 4 weeks after TT-1. If previously fully vaccinated within 3 years, only a single booster is required.",
    clinicalRationale: "Drives hyper-immunization and sustains high serum antitoxin titers throughout late gestation and the postpartum peripartum window.",
    fetalBenefit: "Maintains high protective antibody levels through labor and puerperium.",
    safetyProfile: "Well-tolerated with minor localized arm tenderness.",
    dosingSchedule: "0.5 mL IM at least 4 weeks after TT-1/Td-1.",
    guidelineSource: "National Health Mission (NHM) India / FOGSI",
  },
  {
    id: "mat_vac_flu",
    code: "Influenza (Flu)",
    name: "Inactivated Influenza Vaccine",
    fullTitle: "Quadrivalent Inactivated Influenza Vaccine (IIV4)",
    category: "routine",
    targetDisease: "Seasonal Influenza (Flu A & B viruses)",
    recommendedTiming: "Any Trimester (Ideally before or during seasonal flu peak / Monsoon / Winter)",
    recommendedWeeksStart: 1,
    recommendedWeeksEnd: 40,
    isMandatory: false,
    priority: "high",
    summary: "Pregnancy alters maternal cardiac, respiratory, and immune dynamics, significantly increasing vulnerability to severe influenza pneumonia and ICU admission.",
    clinicalRationale: "Inactivated flu vaccine prevents severe maternal acute respiratory infection, maternal febrile episodes (which can trigger preterm labor), and hospital admissions.",
    fetalBenefit: "Protects the newborn infant against flu hospitalizations for the first 6 months of life via transplacental maternal antibodies (infants cannot receive flu vaccines before 6 months).",
    safetyProfile: "Inactivated (injectable) formulation is 100% non-replicating and safe across all three trimesters. Note: Live attenuated nasal spray (LAIV) is contraindicated.",
    dosingSchedule: "Single 0.5 mL IM dose annually during seasonal flu circulation.",
    guidelineSource: "WHO / ACOG Committee Opinion No. 732 / FOGSI",
  },
  {
    id: "mat_vac_rhogam",
    code: "Anti-D / RhoGAM",
    name: "Rh(D) Immune Globulin Prophylaxis",
    fullTitle: "Human Anti-D (Rh) Immunoglobulin (for Rh-Negative Mothers)",
    category: "conditional",
    targetDisease: "Rh Isoimmunization & Hemolytic Disease of the Fetus and Newborn (HDFN)",
    recommendedTiming: "Week 28 (and within 72 hours post-delivery if baby is Rh-positive)",
    recommendedWeeksStart: 28,
    recommendedWeeksEnd: 28,
    isMandatory: false,
    priority: "critical",
    rhNegativeOnly: true,
    summary: "Mandatory prophylaxis for Rh-negative pregnant women (blood group ending in '-', e.g., O-, A-, B-, AB-) to prevent alloimmunization.",
    clinicalRationale: "If fetal red blood cells (which may be Rh-positive from the father) enter maternal circulation during fetomaternal hemorrhage or delivery, an unsensitized Rh-negative mother may develop anti-D antibodies. Administering anti-D at 28 weeks neutralizes fetal D-antigen cells before maternal immune recognition occurs.",
    fetalBenefit: "Completely prevents fetal hemolysis, hydrops fetalis, severe neonatal jaundice, and kernicterus in current and future pregnancies.",
    safetyProfile: "Sterile human polyclonal IgG preparation; highly purified with decades of exceptional safety.",
    dosingSchedule: "300 mcg (1500 IU) IM injection at 28 weeks gestation, with additional dose given within 72 hours of delivery if infant is confirmed Rh-positive.",
    guidelineSource: "ACOG Practice Bulletin No. 181 / FOGSI Clinical Guideline",
  },
  {
    id: "mat_vac_covid",
    code: "COVID-19",
    name: "Updated COVID-19 Vaccine / Booster",
    fullTitle: "Updated Monovalent COVID-19 mRNA / Inactivated Vaccine",
    category: "conditional",
    targetDisease: "SARS-CoV-2 (COVID-19)",
    recommendedTiming: "Any Trimester (If due for annual booster or unimmunized)",
    recommendedWeeksStart: 1,
    recommendedWeeksEnd: 40,
    isMandatory: false,
    priority: "standard",
    summary: "Recommended for pregnant individuals to guard against severe infection, preeclampsia risk, and preterm labor.",
    clinicalRationale: "COVID-19 infection during pregnancy carries elevated risks of ICU admission, mechanical ventilation, and placental vascular malperfusion. Vaccination confers strong maternal immunity.",
    fetalBenefit: "Transfers anti-spike IgG to cord blood, providing early infant protection in the initial months after birth.",
    safetyProfile: "Extensive worldwide pregnancy registries (CDC v-safe, UK Health Security Agency) confirm zero increased risk of miscarriage, congenital anomalies, or stillbirth.",
    dosingSchedule: "Single intramuscular dose as advised by your obstetrician based on local variant guidance.",
    guidelineSource: "ACOG Practice Advisory / CDC / FOGSI",
  },
];

export const CONTRAINDICATED_VACCINES: ContraindicatedVaccine[] = [
  {
    id: "contra_mmr",
    name: "MMR (Measles, Mumps, Rubella)",
    type: "Live Attenuated Viral Vaccine",
    contraindicationReason: "Theoretical risk of live rubella virus crossing the placenta and causing Congenital Rubella Syndrome (CRS) or fetal teratogenicity.",
    postpartumCatchUp: "Administer immediately postpartum (before hospital discharge) if maternal rubella IgG titer is non-immune or negative.",
    riskLevel: "STRICTLY_CONTRAINDICATED",
  },
  {
    id: "contra_varicella",
    name: "Varicella (Chickenpox)",
    type: "Live Attenuated Viral Vaccine",
    contraindicationReason: "Theoretical risk of transmission of vaccine virus to fetus and congenital varicella syndrome.",
    postpartumCatchUp: "Administer dose 1 before discharge postpartum, with dose 2 given 4-8 weeks later.",
    riskLevel: "STRICTLY_CONTRAINDICATED",
  },
  {
    id: "contra_opv",
    name: "Oral Polio Vaccine (OPV)",
    type: "Live Attenuated Viral Vaccine",
    contraindicationReason: "Live virus vaccine excreted in stool with remote mucosal dissemination risk. If polio vaccination is urgently required, Inactivated Polio Vaccine (IPV) is used instead.",
    postpartumCatchUp: "Reserved for infant schedule at birth; mothers receive IPV if indicated.",
    riskLevel: "STRICTLY_CONTRAINDICATED",
  },
  {
    id: "contra_yellow_fever",
    name: "Yellow Fever Vaccine",
    type: "Live Attenuated Vaccine (17D strain)",
    contraindicationReason: "Live virus vaccine generally avoided during pregnancy unless unavoidable travel to high-risk endemic transmission zones.",
    postpartumCatchUp: "Travel should be postponed; if strictly necessary postpartum, can be administered after lactation review.",
    riskLevel: "GENERALLY_AVOIDED",
  },
  {
    id: "contra_hpv",
    name: "HPV (Human Papillomavirus)",
    type: "Recombinant VLP Vaccine",
    contraindicationReason: "Not recommended during pregnancy due to limited safety data, though accidental administration is not an indication for intervention.",
    postpartumCatchUp: "Resume HPV multi-dose series postpartum.",
    riskLevel: "GENERALLY_AVOIDED",
  },
  {
    id: "contra_bcg",
    name: "BCG (Bacillus Calmette–Guérin)",
    type: "Live Attenuated Bacterial Vaccine",
    contraindicationReason: "Live attenuated bacterial vaccine contraindicated during pregnancy. Scheduled for the newborn infant at birth.",
    postpartumCatchUp: "Not indicated for adults in pregnancy; administered to infant at birth.",
    riskLevel: "STRICTLY_CONTRAINDICATED",
  },
];
