# Copy Bible

Approved voice and wording for Pulse. **If it's not here or in the Brain, it doesn't ship.**

---

## Voice rules

- Write like a **calm, intelligent friend** — not a chatbot, not a corporation.
- Use **short sentences**. Leave breathing room.
- **Never rush.** Ellipses are allowed for pauses: `Hello...`
- **Personalise** with the user's first name when known.
- **No jargon**, no "Coming soon", no "Error 404" tone.
- **Be clear about what Pulse does within 10 seconds** — peptide research companion.
- Emoji: **sparingly**. Morning greeting ☀️ only. Birthday 🎂. Otherwise none.

## Compliance — never use

- dosing advice
- take your dose
- medical guidance
- treatment
- weight loss
- human use

## Use instead

- research planning
- inventory estimates
- research cabinet
- educational resources
- research journal
- planned usage rate

---

## Tagline

> Keep your finger on the Pulse.

---

## Launch (Screen 1)

Full animated PULSE wordmark reveal.

---

## Positioning (Screen 2)

```
PULSE

The beating heart of organised peptide research.

Track inventory.
Estimate remaining supply.
Discover trusted education.
Stay one step ahead.

Keep your finger on the Pulse.
```

**Button:** `Get Started`

---

## Name (Screen 3)

```
Who are we talking to today?
```

**Input placeholder:** `Your first name`  
**Button:** `Continue` — glows first, then breathes when name entered.

---

## Personalise (Screen 4)

```
Hello {{firstName}} 👋
Let's personalise Pulse around your research.
```

**Button:** `Continue`

---

## Help focus (Screen 5)

```
What would you like help with most?
```

**Cards:**
- Track my peptide inventory
- Estimate remaining supply
- Learn from trusted resources
- Keep a research journal
- Use smart research tools
- Everything

**Button:** `Continue`

---

## Promise (Screen 6)

```
Perfect.
I'll build Pulse around what matters to you.

You'll be able to:
Keep your research cabinet organised
Estimate when supply may run low
Save useful papers, videos and podcasts
Keep notes in one place
Get gentle reminders when helpful
```

**Button:** `Build My Pulse`

---

## Home preview (Screen 7)

```
Welcome home, {{firstName}}.
Your research cabinet is ready.
```

**Button:** `Enter Pulse`

---

## Conversational loading (never "Loading…")

| Moment | Copy |
|--------|------|
| App ready | Just getting everything ready... |
| Fetching data | Looking after your latest progress... |
| Saving | Your research has been safely saved. |

---

## Home — Headlines (Brain-driven)

| Context | Greeting | Welcome | Subtitle |
|---------|----------|---------|----------|
| Morning | `Good morning {name} ☀️` | Welcome home. | Everything is ready. |
| Afternoon | `Good afternoon {name}` | Welcome home. | Everything is ready. |
| Evening | `Good evening {name}` | Welcome home. | A calm evening awaits. |
| Birthday | `Happy birthday {name} 🎂` | Today is yours. | Everything is ready whenever you are. |
| Anniversary | `Happy Pulse anniversary {name}` | Welcome home. | Thank you for being here. |

**Never hardcode these in widgets.** `GreetingEngine` owns this logic.

---

## Home — Cards

| Card | Title | Default subtitle |
|------|-------|------------------|
| 1 | Research Cabinet | Ready whenever you are. |
| 2 | Today's Discovery | I've found something interesting for you. |
| 3 | Research Journal | Your notes are right here. |
