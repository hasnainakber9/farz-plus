"use client";

import { useCallback, useEffect, useState } from "react";
import type { MedicationStatus, PlatformEvent, PlatformSnapshot } from "@/lib/platform-types";

export function useCareOperations() {
  const [snapshot, setSnapshot] = useState<PlatformSnapshot | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/platform/snapshot", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: PlatformSnapshot) => {
        if (active) setSnapshot(data);
      })
      .catch(() => {
        if (active) setError("Care operations are temporarily unavailable.");
      });

    const source = new EventSource("/api/platform/events");
    source.onopen = () => {
      if (active) setConnected(true);
    };
    source.onmessage = (message) => {
      if (!active) return;
      const event = JSON.parse(message.data) as PlatformEvent;
      setSnapshot(event.snapshot);
      setConnected(true);
    };
    source.onerror = () => {
      if (active) setConnected(false);
    };

    return () => {
      active = false;
      source.close();
    };
  }, []);

  const updateCase = useCallback(
    async (
      caseId: string,
      input: {
        action: "APPROVE" | "ESCALATE" | "DOCTOR_REVIEW";
        draftedResponse?: string;
        note?: string;
      },
    ) => {
      const response = await fetch(`/api/platform/cases/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Case update failed.");
      setSnapshot(payload.snapshot);
      return payload;
    },
    [],
  );

  const updateMedication = useCallback(async (medicationId: string, status: MedicationStatus) => {
    const response = await fetch(`/api/platform/medications/${medicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? "Medication update failed.");
    setSnapshot(payload.snapshot);
    return payload;
  }, []);

  const triggerEmergency = useCallback(async () => {
    const response = await fetch("/api/platform/emergency", { method: "POST" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? "Emergency request failed.");
    setSnapshot(payload.snapshot);
    return payload;
  }, []);

  return {
    snapshot,
    connected,
    error,
    updateCase,
    updateMedication,
    triggerEmergency,
  };
}
