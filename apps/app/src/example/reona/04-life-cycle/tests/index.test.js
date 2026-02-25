import { expect, test, beforeEach, afterEach } from 'vitest';
import { rootRender } from '../core/runtime-dom';
import { createComponent, state, html, mounted, updated } from '../core';

const flushRaf = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));

beforeEach(() => {
  const div = document.createElement('div');
  div.id = 'root';
  document.body.appendChild(div);
});

afterEach(() => {
  if (document.getElementById('root')) {
    document.body.removeChild(document.getElementById('root'));
  }
});

test('리렌더링 되어도 마운트 훅 실행은 1번이 보장 되어야 한다.', async () => {
  const mountFn = vi.fn();

  function Component() {
    const data = state({
      bool: true,
    });

    mounted(mountFn);

    const trigger = () => {
      data.bool = !data.bool;
    };

    return html`
      <div id="app">
        <button type="button" @click=${trigger}>trigger</button>
      </div>
      `;
  }
  rootRender(document.getElementById('root'), Component);

  document.querySelector('button')?.click();
  await flushRaf();
  expect(mountFn).toHaveBeenCalledOnce();

  document.querySelector('button')?.click();
  await flushRaf();
  expect(mountFn).toHaveBeenCalledOnce();
});

test('조건부 렌더링에 따라 각 컴포넌트 마다 mount, unmount 함수가 실행되어야 한다.', async () => {
  const unMountFn1 = vi.fn(() => {
    console.log('unmount1');
  });
  const mountFn1 = vi.fn(() => {
    console.log('mount1');
    return unMountFn1;
  });
  const unMountFn2 = vi.fn(() => {
    console.log('unmount2');
  });
  const mountFn2 = vi.fn(() => {
    console.log('mount2');
    return unMountFn2;
  });

  function Child({ value }) {
    mounted(mountFn1);
    return html`<div id="child1">${value}</div>`;
  }

  function Child2({ value }) {
    mounted(mountFn2);
    return html`<div id="child2">${value}</div>`;
  }

  function App() {
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
            value: '1',
          },
        })
        : createComponent(Child2, {
          props: {
            value: '2',
          },
        })
      }
      </div>
    `;
  }

  rootRender(document.getElementById('root'), App);

  expect(document.getElementById('child1')).toBeInTheDocument();
  expect(document.getElementById('child1')?.textContent).toBe('1');

  document.querySelector('button')?.click();
  await flushRaf();
  expect(unMountFn1).toHaveBeenCalled();
  expect(mountFn2).toHaveBeenCalled();
  expect(document.getElementById('child2')).toBeInTheDocument();
  expect(document.getElementById('child2')?.textContent).toBe('2');

  document.querySelector('button')?.click();
  await flushRaf();
  expect(unMountFn2).toHaveBeenCalled();
  expect(mountFn1).toHaveBeenCalled();
  expect(document.getElementById('child1')).toBeInTheDocument();
  expect(document.getElementById('child1')?.textContent).toBe('1');

  document.querySelector('button')?.click();
  await flushRaf();
  expect(unMountFn1).toHaveBeenCalled();
  expect(mountFn2).toHaveBeenCalled();
  expect(document.getElementById('child2')).toBeInTheDocument();
  expect(document.getElementById('child2')?.textContent).toBe('2');

  document.querySelector('button')?.click();
  await flushRaf();
  expect(unMountFn2).toHaveBeenCalled();
  expect(mountFn1).toHaveBeenCalled();
  expect(document.getElementById('child1')).toBeInTheDocument();
  expect(document.getElementById('child1')?.textContent).toBe('1');
});

test('데이터 변경 시 업데이트 훅 실행이 되야 한다.', async () => {
  let expectedValue;
  const updatedFn = vi.fn((prev) => {
    expectedValue = prev;
  });

  function Component() {
    const data = state({
      value: 1,
    });

    updated(data, updatedFn);

    const trigger = () => {
      data.value += 1;
    };

    return html`
      <div id="app">
        <button type="button" @click=${trigger}>trigger</button>
      </div>
      `;
  }
  rootRender(document.getElementById('root'), Component);

  document.querySelector('button')?.click();
  await flushRaf();
  expect(updatedFn).toHaveBeenCalledTimes(1);
  expect(expectedValue).toEqual({ value: 1 });

  document.querySelector('button')?.click();
  await flushRaf();
  expect(updatedFn).toHaveBeenCalledTimes(2);
  expect(expectedValue).toEqual({ value: 2 });
});

test('데이터 미변경 시 업데이트 훅 실행이 되서는 아니된다.', async () => {
  let expectedValue;
  const updatedFn = vi.fn((prev) => {
    expectedValue = prev;
  });

  function Component() {
    const data = state({
      value: 1,
    });

    updated(data, updatedFn);

    const noop = () => {
      data.value = data.value;
    };

    return html`
      <div id="app">
        <button type="button" @click=${noop}>noop</button>
      </div>
      `;
  }
  rootRender(document.getElementById('root'), Component);

  document.querySelector('button')?.click();
  await flushRaf();
  expect(updatedFn).not.toHaveBeenCalled();
  expect(expectedValue).toBeUndefined();

  document.querySelector('button')?.click();
  await flushRaf();
  expect(updatedFn).not.toHaveBeenCalled();
  expect(expectedValue).toBeUndefined();
});
