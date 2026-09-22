/**
 * BloomNest 2.0 Phase 1 Memory Foundation & Tool Verification Test Suite
 */

import { describe, it, expect, beforeAll } from "vitest";
import { MaternalMemoryService } from "../src/services/maternalMemoryService";
import { AGENT_TOOLS } from "../src/services/agentTools";
import { evaluateHealthVital } from "../src/services/healthVitalsService";

describe("MaternalMemoryService & Clinical Safety Verification", () => {
  const testUserId = `test_user_${Date.now()}`;
  let savedMemId: string;

  it("1. User & JourneyProfile creation and retrieval", async () => {
    const user = await MaternalMemoryService.getUserProfile(testUserId);
    expect(user.id).toBe(testUserId);
    expect(user.journeyProfile).not.toBeNull();
  });

  it("2. JourneyProfile week/trimester persistence", async () => {
    const journey = await MaternalMemoryService.getJourneyProfile(testUserId);
    expect(journey.currentWeek).toBe(24);
    expect(journey.trimester).toBe(2);
  });

  it("3. Vital entry persistence & normalization", async () => {
    const vitalResult = await MaternalMemoryService.logVitalEntry(testUserId, {
      systolicBp: 120,
      diastolicBp: 78,
      weightKg: 65.0,
      glucoseMgDl: 90,
      glucoseContext: "fasting"
    });
    expect(vitalResult.vitalLog.systolicBp).toBe(120);
    expect(vitalResult.evaluation.overallStatus).toBe("NORMAL");
  });

  it("4. Vital trend calculation", async () => {
    await MaternalMemoryService.logVitalEntry(testUserId, { systolicBp: 140, diastolicBp: 88 });
    const trends = await MaternalMemoryService.getVitalTrends(testUserId, 10);
    expect(trends.totalLogs).toBeGreaterThanOrEqual(2);
    expect(trends.averageSystolic).toBe(130);
  });

  it("5. Agent memory save & retrieval", async () => {
    const savedMem = await MaternalMemoryService.saveMemory(testUserId, {
      memoryType: "PREFERENCE",
      summary: "Prefers high-protein vegetarian lunches (Palak Paneer, Ragi Dosa)",
      source: "USER_INPUT"
    });
    expect(savedMem.memoryType).toBe("PREFERENCE");
    expect(savedMem.id).toBeDefined();
    savedMemId = savedMem.id;
  });

  it("6. Memory deduplication policy (returns identical ID)", async () => {
    const dupMem = await MaternalMemoryService.saveMemory(testUserId, {
      memoryType: "PREFERENCE",
      summary: "Prefers high-protein vegetarian lunches (Palak Paneer, Ragi Dosa)",
      source: "USER_INPUT"
    });
    expect(dupMem.id).toBe(savedMemId);
  });

  it("7. Security Policy Enforcement: rejects API keys and credentials", async () => {
    let threwKeyErr = false;
    try {
      await MaternalMemoryService.saveMemory(testUserId, {
        memoryType: "CARE_CONTEXT",
        summary: "API_KEY = sk-123456789 secret password"
      });
    } catch (e: any) {
      threwKeyErr = e.message.includes("Security Policy Rejection");
    }
    expect(threwKeyErr).toBe(true);
  });

  it("8. Privacy Policy Enforcement: rejects emergency phone PII", async () => {
    let threwPhoneErr = false;
    try {
      await MaternalMemoryService.saveMemory(testUserId, {
        memoryType: "CARE_CONTEXT",
        summary: "Emergency Phone contact 9876543210"
      });
    } catch (e: any) {
      threwPhoneErr = e.message.includes("Privacy Policy Rejection");
    }
    expect(threwPhoneErr).toBe(true);
  });

  it("9. Clinical Safety Policy Enforcement: rejects diagnostic claims", async () => {
    let threwDiagErr = false;
    try {
      await MaternalMemoryService.saveMemory(testUserId, {
        memoryType: "CARE_CONTEXT",
        summary: "You have preeclampsia diagnosis"
      });
    } catch (e: any) {
      threwDiagErr = e.message.includes("Clinical Safety Policy Rejection");
    }
    expect(threwDiagErr).toBe(true);
  });

  it("10. AgentRun audit log persistence", async () => {
    const runAudit = await MaternalMemoryService.saveAgentRun({
      userId: testUserId,
      message: "Can I eat raw papaya?",
      intent: "FOOD_SAFETY",
      agentsInvolved: ["WELLNESS", "ORCHESTRATOR"],
      safetyLevel: "ATTENTION",
      requiresHumanReview: false,
      toolCalls: [{ toolName: "check_food_safety", success: true }]
    });
    expect(runAudit).not.toBeNull();
    expect(runAudit?.intent).toBe("FOOD_SAFETY");
  });

  it("11. Agent Tool get_maternal_memory execution", async () => {
    const memToolRes = await AGENT_TOOLS.get_maternal_memory.handler({}, { userId: testUserId } as any);
    expect(memToolRes.count).toBeGreaterThanOrEqual(1);
  });

  it("12. Agent Tool get_vital_trends execution", async () => {
    const trendToolRes = await AGENT_TOOLS.get_vital_trends.handler({}, { userId: testUserId } as any);
    expect(trendToolRes.success).toBe(true);
    expect(trendToolRes.trends.totalLogs).toBeGreaterThanOrEqual(2);
  });

  it("13. Deterministic safety engine verification (165/112 mmHg = SEVERE)", () => {
    const sysSevereEval = evaluateHealthVital({ systolicBp: 165, diastolicBp: 112 });
    expect(sysSevereEval.overallStatus).toBe("SEVERE");
    expect(sysSevereEval.requiresUrgentAttention).toBe(true);
  });
});
