import { html, mounted } from '../core';

function appendDiv(text) {
  const div = document.createElement('div')
  div.textContent = text;
  document.body.appendChild(div);
}

export default function Child2({ value }) {
  mounted(() => {
    appendDiv('mount child2');
    return () => {
      appendDiv('unmount child2');
    }
  });
  return html`<div id="child2">${value}</div>`;
}
