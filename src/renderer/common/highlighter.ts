
import { html } from 'lit';

import { Query } from 'common/query';

export function highlightTextUsingMatch(text?: string, query?: Query) {
    if (text && query) {
        return html`${query.matchGroups(text).map((group, i) => {
            if (i % 2 === 0) {
                return group;
            } else {
                return html`<strong>${group}</strong>`
            }
        })}`;
    } else {
        return text ?? '';
    }
}

