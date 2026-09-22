import { describe, it, expect } from "vitest";
import {
  calculatePostpartumDay,
  calculatePostpartumWeek,
  formatPostpartumTime,
  getRecoveryStage,
  formatDeliveryType,
  getPostpartumContext,
} from "../postpartumUtils";
import { PostpartumProfile } from "../../types";

describe("Postpartum Utilities", () => {
  const deliveryDate = "2026-09-01";

  it("calculates postpartum days correctly", () => {
    expect(calculatePostpartumDay(deliveryDate, "2026-09-01")).toBe(0);
    expect(calculatePostpartumDay(deliveryDate, "2026-09-02")).toBe(1);
    expect(calculatePostpartumDay(deliveryDate, "2026-09-07")).toBe(6);
    expect(calculatePostpartumDay(deliveryDate, "2026-09-08")).toBe(7);
    expect(calculatePostpartumDay(deliveryDate, "2026-09-13")).toBe(12);
    expect(calculatePostpartumDay(deliveryDate, "2026-09-15")).toBe(14);
    expect(calculatePostpartumDay(deliveryDate, "2026-10-13")).toBe(42);
    expect(calculatePostpartumDay(deliveryDate, "2026-10-14")).toBe(43);
  });

  it("calculates postpartum weeks correctly", () => {
    expect(calculatePostpartumWeek(0)).toBe(1);
    expect(calculatePostpartumWeek(6)).toBe(1);
    expect(calculatePostpartumWeek(7)).toBe(2);
    expect(calculatePostpartumWeek(13)).toBe(2);
    expect(calculatePostpartumWeek(14)).toBe(3);
    expect(calculatePostpartumWeek(20)).toBe(3);
    expect(calculatePostpartumWeek(21)).toBe(4);
    expect(calculatePostpartumWeek(42)).toBe(7);
  });

  it("classifies recovery stages correctly", () => {
    expect(getRecoveryStage(0).key).toBe("immediate_recovery");
    expect(getRecoveryStage(6).key).toBe("immediate_recovery");
    expect(getRecoveryStage(7).key).toBe("early_recovery");
    expect(getRecoveryStage(14).key).toBe("early_recovery");
    expect(getRecoveryStage(15).key).toBe("ongoing_recovery");
    expect(getRecoveryStage(42).key).toBe("ongoing_recovery");
    expect(getRecoveryStage(43).key).toBe("extended_postpartum");
  });

  it("formats postpartum time correctly", () => {
    const timeFormat12 = formatPostpartumTime(12);
    expect(timeFormat12.formatted).toBe("1 week + 5 days postpartum");
  });

  it("creates accurate postpartum context", () => {
    const mockProfile: PostpartumProfile = {
      deliveryDate: "2026-09-01",
      deliveryType: "c_section",
      numberOfBabies: 1,
      hospital: "Apollo Maternity",
      healthcareProvider: "Dr. Ananya Sharma",
    };
    const ctx = getPostpartumContext(mockProfile);
    expect(ctx.deliveryType).toBe("c_section");
  });
});
