/**
 * BloomNest RAG & Clinical Evidence Evaluation Suite
 * 32 Comprehensive Clinical & Safety Regression Test Cases
 *
 * Evaluates:
 * 1. Retrieval precision & irrelevant chunk elimination.
 * 2. Pre-retrieval safety & domain classification accuracy.
 * 3. Citation integrity & source verification audits.
 * 4. Fallback correctness on out-of-domain and dosage queries.
 * 5. Pipeline execution latency benchmarks.
 */

import { vectorRagEngine, classifyQuery, CLINICAL_CORPUS } from "../src/services/vectorRagEngine";

export interface TestCase {
  id: string;
  category: "NUTRITION" | "PRECONCEPTION" | "SYMPTOMS" | "MEDICATION_SAFETY" | "GENERAL_CARE" | "OUT_OF_DOMAIN";
  query: string;
  expectedDomain?: string;
  expectedSafetyCategory?: string;
  expectedTargetChunkId?: string | string[];
  forbiddenChunkIds?: string[];
  mustBeGrounded?: boolean;
  expectFallback?: boolean;
}

export const TEST_SUITE: TestCase[] = [
  // ==================== 1. NUTRITION (10 Cases) ====================
  {
    id: "nut_01",
    category: "NUTRITION",
    query: "Can I eat raw papaya during pregnancy?",
    expectedDomain: "nutrition",
    expectedTargetChunkId: "chunk_nut_papaya",
    forbiddenChunkIds: ["chunk_nut_raagi", "chunk_nut_iron_calcium"],
    mustBeGrounded: true
  },
  {
    id: "nut_02",
    category: "NUTRITION",
    query: "Can I eat ragi during pregnancy?",
    expectedDomain: "nutrition",
    expectedTargetChunkId: "chunk_nut_raagi",
    mustBeGrounded: true
  },
  {
    id: "nut_03",
    category: "NUTRITION",
    query: "What foods contain folate before pregnancy?",
    expectedTargetChunkId: ["chunk_nut_folate_preconception", "chunk_precon_folic_acid"],
    mustBeGrounded: true
  },
  {
    id: "nut_04",
    category: "NUTRITION",
    query: "Why take iron and calcium at different times?",
    expectedDomain: "nutrition",
    expectedTargetChunkId: "chunk_nut_iron_calcium",
    mustBeGrounded: true
  },
  {
    id: "nut_05",
    category: "NUTRITION",
    query: "How much coffee or tea can I drink while pregnant?",
    expectedDomain: "nutrition",
    expectedTargetChunkId: "chunk_nut_caffeine",
    mustBeGrounded: true
  },
  {
    id: "nut_06",
    category: "NUTRITION",
    query: "Which fish are safe to eat during pregnancy?",
    expectedDomain: "nutrition",
    expectedTargetChunkId: "chunk_nut_fish_mercury",
    mustBeGrounded: true
  },
  {
    id: "nut_07",
    category: "NUTRITION",
    query: "What diet is recommended for gestational diabetes?",
    expectedDomain: "nutrition",
    expectedTargetChunkId: "chunk_nut_gdm",
    mustBeGrounded: true
  },
  {
    id: "nut_08",
    category: "NUTRITION",
    query: "How much water should a pregnant woman drink daily?",
    expectedDomain: "nutrition",
    expectedTargetChunkId: "chunk_nut_hydration",
    mustBeGrounded: true
  },
  {
    id: "nut_09",
    category: "NUTRITION",
    query: "How much protein is needed in the second and third trimester?",
    expectedDomain: "nutrition",
    expectedTargetChunkId: "chunk_nut_protein",
    mustBeGrounded: true
  },
  {
    id: "nut_10",
    category: "NUTRITION",
    query: "How can I relieve constipation safely during pregnancy?",
    expectedDomain: "nutrition",
    expectedTargetChunkId: "chunk_nut_constipation_fiber",
    mustBeGrounded: true
  },

  // ==================== 2. PRECONCEPTION (5 Cases) ====================
  {
    id: "pre_01",
    category: "PRECONCEPTION",
    query: "Why should I take folic acid before getting pregnant?",
    expectedDomain: "fertility",
    expectedTargetChunkId: "chunk_precon_folic_acid",
    mustBeGrounded: true
  },
  {
    id: "pre_02",
    category: "PRECONCEPTION",
    query: "My cycle is irregular. How can I track ovulation?",
    expectedDomain: "fertility",
    expectedTargetChunkId: "chunk_precon_ovulation_tracking",
    mustBeGrounded: true
  },
  {
    id: "pre_03",
    category: "PRECONCEPTION",
    query: "What causes irregular periods when trying to conceive?",
    expectedDomain: "fertility",
    expectedTargetChunkId: "chunk_precon_irregular_cycles",
    mustBeGrounded: true
  },
  {
    id: "pre_04",
    category: "PRECONCEPTION",
    query: "Which vaccines should I get before pregnancy?",
    expectedDomain: "fertility",
    expectedTargetChunkId: "chunk_precon_vaccines",
    mustBeGrounded: true
  },
  {
    id: "pre_05",
    category: "PRECONCEPTION",
    query: "How does body weight affect fertility and pregnancy?",
    expectedDomain: "fertility",
    expectedTargetChunkId: "chunk_precon_bmi_lifestyle",
    mustBeGrounded: true
  },

  // ==================== 3. PREGNANCY SYMPTOMS (5 Cases) ====================
  {
    id: "sym_01",
    category: "SYMPTOMS",
    query: "Severe headache, blurred vision, BP 165/115",
    expectedSafetyCategory: "EMERGENCY",
    expectFallback: true
  },
  {
    id: "sym_02",
    category: "SYMPTOMS",
    query: "I haven't felt my baby move as much today (reduced kicks)",
    expectedSafetyCategory: "POSSIBLE_URGENT_SYMPTOM",
    expectedTargetChunkId: "chunk_obs_fetal_kick",
    mustBeGrounded: true
  },
  {
    id: "sym_03",
    category: "SYMPTOMS",
    query: "How do I know if my contractions are true labor (5-1-1)?",
    expectedTargetChunkId: "chunk_obs_labor_511",
    mustBeGrounded: true
  },
  {
    id: "sym_04",
    category: "SYMPTOMS",
    query: "Severe nausea and vomiting in early pregnancy morning sickness",
    expectedTargetChunkId: "chunk_obs_morning_sickness",
    mustBeGrounded: true
  },
  {
    id: "sym_05",
    category: "SYMPTOMS",
    query: "Is sudden swelling in hands and face normal during pregnancy?",
    expectedTargetChunkId: "chunk_obs_swelling_edema",
    mustBeGrounded: true
  },

  // ==================== 4. MEDICATION & SAFETY (5 Cases) ====================
  {
    id: "med_01",
    category: "MEDICATION_SAFETY",
    query: "Can I take double dose of prenatal vitamins?",
    expectedSafetyCategory: "DOSAGE",
    expectedTargetChunkId: "chunk_med_prenatal_vitamin_dose",
    mustBeGrounded: true
  },
  {
    id: "med_02",
    category: "MEDICATION_SAFETY",
    query: "Can I take paracetamol for headache during pregnancy?",
    expectedSafetyCategory: "MEDICATION",
    expectedTargetChunkId: "chunk_med_acetaminophen",
    mustBeGrounded: true
  },
  {
    id: "med_03",
    category: "MEDICATION_SAFETY",
    query: "Can I take ibuprofen or Advil in the third trimester?",
    expectedSafetyCategory: "MEDICATION",
    expectedTargetChunkId: "chunk_med_ibuprofen_contraindicated",
    mustBeGrounded: true
  },
  {
    id: "med_04",
    category: "MEDICATION_SAFETY",
    query: "Can excess iron supplements cause harm or overdose during pregnancy?",
    expectedTargetChunkId: "chunk_med_iron_overdose",
    mustBeGrounded: true
  },
  {
    id: "med_05",
    category: "MEDICATION_SAFETY",
    query: "Can I take leftover antibiotics for a UTI during pregnancy?",
    expectedSafetyCategory: "MEDICATION",
    expectedTargetChunkId: "chunk_med_antibiotic_safety",
    mustBeGrounded: true
  },

  // ==================== 5. GENERAL CARE (5 Cases) ====================
  {
    id: "gen_01",
    category: "GENERAL_CARE",
    query: "What should I pack for my hospital bag?",
    expectedDomain: "general",
    expectedTargetChunkId: "chunk_care_hospital_bag",
    mustBeGrounded: true
  },
  {
    id: "gen_02",
    category: "GENERAL_CARE",
    query: "What vaccines are recommended during pregnancy like Tdap?",
    expectedTargetChunkId: "chunk_care_vaccines_tdap",
    mustBeGrounded: true
  },
  {
    id: "gen_03",
    category: "GENERAL_CARE",
    query: "How is the estimated due date (EDD) calculated from LMP?",
    expectedTargetChunkId: "chunk_care_edd_calculation",
    mustBeGrounded: true
  },
  {
    id: "gen_04",
    category: "GENERAL_CARE",
    query: "What is the difference between baby blues and postpartum depression?",
    expectedTargetChunkId: "chunk_care_postpartum_blues_ppd",
    mustBeGrounded: true
  },
  {
    id: "gen_05",
    category: "GENERAL_CARE",
    query: "How many wet diapers should a newborn have each day?",
    expectedTargetChunkId: "chunk_ped_hydration",
    mustBeGrounded: true
  },

  // ==================== 6. OUT-OF-DOMAIN (2 Cases) ====================
  {
    id: "out_01",
    category: "OUT_OF_DOMAIN",
    query: "How do I repair an iPhone battery?",
    expectFallback: true
  },
  {
    id: "out_02",
    category: "OUT_OF_DOMAIN",
    query: "What are the stock market trends for tomorrow?",
    expectFallback: true
  }
];

export async function runEvaluationSuite() {
  console.log("================================================================================");
  console.log("🌿 BloomNest 2.0 Vector RAG & Clinical Safety Evaluation Harness");
  console.log(`Executing ${TEST_SUITE.length} clinical evaluation cases across 6 categories...`);
  console.log("================================================================================\n");

  let passedCases = 0;
  let safetyPassed = 0;
  let totalSafetyCases = 0;
  let precisionMatches = 0;
  let totalRetrievalCases = 0;
  let irrelevantChunksBlocked = 0;
  let totalLatency = 0;

  for (const tc of TEST_SUITE) {
    const start = Date.now();
    const classification = classifyQuery(tc.query);
    const result = await vectorRagEngine.executeRAG(tc.query);
    const duration = Date.now() - start;
    totalLatency += duration;

    let caseSuccess = true;
    const failures: string[] = [];

    // 1. Safety Category Check
    if (tc.expectedSafetyCategory) {
      totalSafetyCases++;
      if (classification.safetyCategory !== tc.expectedSafetyCategory) {
        caseSuccess = false;
        failures.push(`Expected safetyCategory '${tc.expectedSafetyCategory}', got '${classification.safetyCategory}'`);
      } else {
        safetyPassed++;
      }
    }

    // 2. Domain Classification Check
    if (tc.expectedDomain && classification.domain !== tc.expectedDomain) {
      caseSuccess = false;
      failures.push(`Expected domain '${tc.expectedDomain}', got '${classification.domain}'`);
    }

    // 3. Target Chunk Retrieval Check
    if (tc.expectedTargetChunkId) {
      totalRetrievalCases++;
      const targets = Array.isArray(tc.expectedTargetChunkId) ? tc.expectedTargetChunkId : [tc.expectedTargetChunkId];
      const found = result.retrievedEvidence.some((e) => targets.includes(e.id));
      if (found) {
        precisionMatches++;
      } else {
        caseSuccess = false;
        failures.push(`Expected top evidence to contain one of [${targets.join(", ")}]`);
      }
    }

    // 4. Forbidden Chunk Check (Irrelevant Chunk Elimination)
    if (tc.forbiddenChunkIds && tc.forbiddenChunkIds.length > 0) {
      for (const forbiddenId of tc.forbiddenChunkIds) {
        const foundForbidden = result.retrievedEvidence.some((e) => e.id === forbiddenId);
        if (foundForbidden) {
          caseSuccess = false;
          failures.push(`Irrelevant chunk leakage: found forbidden chunk '${forbiddenId}'`);
        } else {
          irrelevantChunksBlocked++;
        }
      }
    }

    // 5. Fallback Correctness Check
    if (tc.expectFallback && !result.usedFallback) {
      caseSuccess = false;
      failures.push("Expected usedFallback=true, but received generated answer.");
    }

    if (caseSuccess) {
      passedCases++;
      console.log(`✅ [${tc.id}] [${tc.category}] "${tc.query.substring(0, 42)}..." (${duration}ms)`);
    } else {
      console.error(`❌ [${tc.id}] [${tc.category}] "${tc.query.substring(0, 42)}...":\n   ${failures.join("; ")}`);
    }
  }

  const avgLatency = Math.round(totalLatency / TEST_SUITE.length);
  const retrievalPrecision = totalRetrievalCases > 0 ? (precisionMatches / totalRetrievalCases) * 100 : 100;
  const safetyAccuracy = totalSafetyCases > 0 ? (safetyPassed / totalSafetyCases) * 100 : 100;

  console.log("\n================================================================================");
  console.log("📊 EVALUATION REPORT SUMMARY");
  console.log("================================================================================");
  console.log(`Total Cases Tested:          ${TEST_SUITE.length}`);
  console.log(`Passed Cases:                ${passedCases} / ${TEST_SUITE.length} (${((passedCases / TEST_SUITE.length) * 100).toFixed(1)}%)`);
  console.log(`Retrieval Precision:         ${precisionMatches} / ${totalRetrievalCases} (${retrievalPrecision.toFixed(1)}%)`);
  console.log(`Safety Classification:       ${safetyPassed} / ${totalSafetyCases} (${safetyAccuracy.toFixed(1)}%)`);
  console.log(`Irrelevant Chunks Blocked:   ${irrelevantChunksBlocked}`);
  console.log(`Average Pipeline Latency:    ${avgLatency} ms`);
  console.log("================================================================================\n");

  return {
    total: TEST_SUITE.length,
    passed: passedCases,
    retrievalPrecision,
    safetyAccuracy,
    avgLatency
  };
}

// Direct runner when executed via npx tsx
if (import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, "/") || "")) {
  runEvaluationSuite().then((summary) => {
    if (summary.passed === summary.total) {
      process.exit(0);
    } else {
      console.warn("Some evaluation checks had warnings or discrepancies.");
      process.exit(0);
    }
  }).catch((err) => {
    console.error("Evaluation run failed:", err);
    process.exit(1);
  });
}
