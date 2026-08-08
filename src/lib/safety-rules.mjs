const criticalPattern = /(chest pain|breathless|unconscious|fell|fall|bleeding|twice|double|extra dose|two doses)/i;
const attentionPattern = /(missed|forgot|dizzy|weak|fever|medicine|medication|dose)/i;

export function classifyRisk(text) {
  const critical = criticalPattern.test(text);
  const attention = attentionPattern.test(text);
  const level = critical ? "CRITICAL" : attention ? "ATTENTION" : "STABLE";
  const reason = critical ? "Urgent safety or medication concern" : attention ? "Medication or symptom follow-up required" : "Routine care question";
  return { level, reason };
}
