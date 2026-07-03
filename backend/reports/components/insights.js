/**
 * AI Business Insights cards.
 */
export function drawInsightsSection(doc, insights, margin, y, contentW, theme) {
  doc.fillColor(theme.textMuted).font("Helvetica").fontSize(9).text(
    `Confidence score: ${insights.confidence}% — based on GPS coverage, journey volume, and pattern consistency.`,
    margin,
    y,
    { width: contentW }
  );
  y += 22;

  const cardW = (contentW - 12) / 2;
  const cardH = 62;

  insights.cards.forEach((card, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = margin + col * (cardW + 12);
    const cy = y + row * (cardH + 10);

    const toneColor =
      card.tone === "positive" ? theme.green : card.tone === "warn" ? theme.amber : card.tone === "info" ? theme.blue : theme.textMuted;

    doc.roundedRect(x, cy, cardW, cardH, 12).fillAndStroke(theme.panelSoft, theme.cardBorder);
    doc.circle(x + 16, cy + 18, 3).fill(toneColor);
    doc.fillColor(theme.text).font("Helvetica-Bold").fontSize(9).text(card.title, x + 26, cy + 14, { width: cardW - 36 });
    doc.fillColor(theme.textMuted).font("Helvetica").fontSize(8).text(card.body, x + 26, cy + 28, { width: cardW - 36, lineGap: 1.2 });
  });

  const rows = Math.ceil(insights.cards.length / 2);
  return y + rows * (cardH + 10) + 8;
}
