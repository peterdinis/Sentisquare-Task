export const escapeHtml = (unsafe: string) =>
    unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');


export const highlightEntities = (text: string, entities: { matchedText: string; type?: string }[]) => {
    let result = escapeHtml(text);
    entities.forEach(ent => {
        const pattern = new RegExp(`\\b${ent.matchedText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'gi');
        result = result.replace(pattern, `<span class="entity-badge" data-entity-type="${escapeHtml(ent.type || 'Unknown')}">${escapeHtml(ent.matchedText)}</span>`);
    });
    return result;
};