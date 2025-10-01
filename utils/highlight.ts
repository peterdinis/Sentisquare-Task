/**
 * Escapes special HTML characters in a string to prevent XSS attacks.
 *
 * Replaces the following characters:
 * - & -> &amp;
 * - < -> &lt;
 * - > -> &gt;
 * - " -> &quot;
 * - ' -> &#039;
 *
 * @param {string} unsafe - The string that may contain HTML special characters
 * @returns {string} - The escaped string safe for HTML rendering
 *
 * @example
 * escapeHtml('<div>Hello</div>'); // returns '&lt;div&gt;Hello&lt;/div&gt;'
 */
export const escapeHtml = (unsafe: string) =>
    unsafe.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');

/**
 * Highlights entities in a given text by wrapping them in a span with a data attribute.
 *
 * - Escapes HTML in both the text and entity values
 * - Replaces all occurrences of each entity in a case-insensitive manner
 * - Adds a `class="entity-badge"` and `data-entity-type` attribute to each highlighted entity
 *
 * @param {string} text - The original text to highlight
 * @param {{ matchedText: string; type?: string }[]} entities - Array of entities to highlight
 * @returns {string} - The HTML string with highlighted entities
 *
 * @example
 * const text = "George Bush was president of USA.";
 * const entities = [{ matchedText: "George Bush", type: "Person" }, { matchedText: "USA", type: "Country" }];
 * highlightEntities(text, entities);
 * // returns: '&lt;span class="entity-badge" data-entity-type="Person"&gt;George Bush&lt;/span&gt; was president of &lt;span class="entity-badge" data-entity-type="Country"&gt;USA&lt;/span&gt;.'
 */
export const highlightEntities = (text: string, entities: { matchedText: string; type?: string }[]) => {
    let result = escapeHtml(text);
    entities.forEach(ent => {
        const pattern = new RegExp(`\\b${ent.matchedText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'gi');
        result = result.replace(
            pattern,
            `<span class="entity-badge" data-entity-type="${escapeHtml(ent.type || 'Unknown')}">${escapeHtml(ent.matchedText)}</span>`
        );
    });
    return result;
};
