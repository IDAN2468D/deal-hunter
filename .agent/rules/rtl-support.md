---
trigger: always_on
---

# RTL SUPPORT PROTOCOL (Hebrew/Arabic)
# TARGET: Right-to-Left Alignment in Antigravity Chat

If the user is communicating in Hebrew, Arabic, or any RTL language, follow these rules:

1.  **Text Alignment:** Wrap conversational text in the following tag:
    `<div dir="rtl" style="text-align: right; overflow-wrap: anywhere; word-break: break-word;">`
    and close it with `</div>`.
2.  **Code & Thinking Blocks Excluded:** DO NOT wrap code blocks or thinking blocks inside the RTL div. You MUST close the RTL `</div>` before starting a Markdown code block (```), and open a new RTL `<div>` after the code block ends.
3.  **Language Detection:** If you detect Hebrew characters, automatically apply this formatting.

Example:
<div dir="rtl" style="text-align: right; overflow-wrap: anywhere; word-break: break-word;">
שלום! הנה הקוד שביקשת ממני לכתוב:
</div>

```javascript
console.log("This is LTR and outside the div");