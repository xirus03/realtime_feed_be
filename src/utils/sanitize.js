export const sanitizeContent = (content) => {
  if (content === undefined || content === null) {
    return "";
  }

  let sanitized = String(content).trim();

  // Remove null bytes and control characters that can be used to bypass filters.
  sanitized = sanitized.replace(/\0/g, "");
  sanitized = sanitized.replace(/[\x00-\x1f\x7f]/g, "");

  // Remove dangerous HTML tags that can introduce XSS payloads.
  const blockedTags = [
    "script",
    "iframe",
    "object",
    "embed",
    "link",
    "meta",
    "style",
    "base",
    "form",
    "input",
    "button",
    "textarea",
    "select",
    "option",
  ];

  const blockedTagsPattern = new RegExp(
    `<\\s*(?:${blockedTags.join("|")})[^>]*>.*?<\\s*\\/\\s*(?:${blockedTags.join("|")})\\s*>`,
    "gi"
  );
  sanitized = sanitized.replace(blockedTagsPattern, "");
  sanitized = sanitized.replace(
    new RegExp(`<\\s*(?:${blockedTags.join("|")})[^>]*\\/\\s*>`, "gi"),
    ""
  );

  // Remove inline event handlers and dangerous URI schemes.
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  sanitized = sanitized.replace(/javascript\s*:/gi, "");
  sanitized = sanitized.replace(/data\s*:/gi, "");
  sanitized = sanitized.replace(/vbscript\s*:/gi, "");

  // Neutralize HTML characters by escaping.
  sanitized = sanitized.replace(/&/g, "&amp;");
  sanitized = sanitized.replace(/</g, "&lt;");
  sanitized = sanitized.replace(/>/g, "&gt;");
  sanitized = sanitized.replace(/"/g, "&quot;");
  sanitized = sanitized.replace(/'/g, "&#39;");
  sanitized = sanitized.replace(/`/g, "&#96;");

  return sanitized;
};