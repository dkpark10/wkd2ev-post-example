import { html, state, createComponent } from '../core';
import Child from './child';
import Child2 from './child2';

export default function Condition() {
  const data = state({
    bool: true,
  });

  const trigger = () => {
    data.bool = !data.bool;
  };

  return html`
    <div id="app">
      <button type="button" @click=${trigger}>trigger</button>
      ${data.bool ?
        createComponent(Child, {
          props: {
            value: 'true 일 때 보여질 컴포넌트',
          },
        })
        : createComponent(Child2, {
          props: {
            value: 'false 일 때 다른 컴포넌트',
          },
        })
      }
    </div>
  `;
}
