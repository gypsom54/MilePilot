# Copy Bible

Approved voice and wording for Pulse. **If it's not here or in the Brain, it doesn't ship.**

---

## Voice rules

- Write like a **calm, intelligent friend** — not a chatbot, not a corporation.
- Use **short sentences**. Leave breathing room.
- **Never rush.** Ellipses are allowed for pauses: `Hello...`
- **Personalise** with the user's first name when known.
- **No jargon**, no "Coming soon", no "Error 404" tone.
- Emoji: **sparingly**. Morning greeting ☀️ only. Birthday 🎂. Otherwise none.

---

## Tagline

> Keep your finger on the Pulse.

---

## Launch

Tagline under logo:

> Keep your finger on the Pulse.

---

## Onboarding — Screen 1 (name)

```
Hello...
Welcome to Pulse.
It's lovely to meet you.
Who are we talking to today?
```

**Input placeholder:** `Your first name`  
**Button:** `Continue`

---

## Onboarding — Screen 2 (welcome)

```
Hello {{firstName}} 👋
I'm genuinely pleased you're here.
Pulse was created to help people stay organised...
discover useful research...
and feel one step ahead.
Let's build your experience together.
```

**Button:** `Let's Begin`

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
| 3 | Research Journal | Continue your journey. |
| 4 | Pulse | How can I help today? |

Brain may personalise subtitles based on memory (learning type, streaks, compounds).

---

## Home — Primary CTA

| State | Label |
|-------|-------|
| Empty cabinet | Add your first research item |
| Has compounds | Add to your cabinet |

---

## Tab placeholders

Use the same human copy as cards — never "Coming soon."

---

## Words we use

| Use | Avoid |
|-----|-------|
| Research | Peptides (in user-facing copy) |
| Cabinet | Inventory |
| Discovery | Feed |
| Journey | Progress tracker |
| Welcome home | Dashboard |
| Everything is ready | You're all set! |

---

## Words we never use

- Dashboard
- Syncing...
- Loading...
- Oops!
- Coming soon
- Tap here
- Enable notifications now

---

## Adding new copy

1. Draft here first
2. Wire through Brain or conversation JSON
3. Update this file in the same PR
