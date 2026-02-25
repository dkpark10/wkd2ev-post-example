import { html, mounted } from '../core';

function appendDiv(text) {
  const div = document.createElement('div')
  div.textContent = text;
  document.body.appendChild(div);
}

export default function Child({ value }) {
  mounted(() => {
    appendDiv('mount child');
    return () => {
      appendDiv('unmount child');
    }
  });
  return html`<div id="child1">${value}</div>`;
}
