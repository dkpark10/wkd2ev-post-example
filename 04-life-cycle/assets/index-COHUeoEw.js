var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function isRenderResultObject(obj) {
  return obj !== null && typeof obj === "object" && typeof obj.template === "string" && Array.isArray(obj.values);
}
function isEmpty(obj) {
  return Object.keys(obj).length <= 0;
}
function parse(renderResult, sequence) {
  let valueIndex = 0;
  let currentSequence = sequence;
  function convertNode(el) {
    if (!el) {
      return {
        type: "text",
        value: ""
      };
    }
    const attrs = {};
    for (const attr of el.attributes) {
      const { values } = renderResult;
      const nameMarker = attr.name.match(/^__marker_(\d+)__$/);
      if (nameMarker) {
        const value = values[valueIndex++];
        if (value && typeof value === "string") {
          attrs[value] = true;
        }
        continue;
      }
      const markers = attr.value.match(/__marker_(\d+)__/g);
      if (markers && markers.length >= 1) {
        if (typeof values[valueIndex] === "function") {
          attrs[attr.name] = values[valueIndex++];
        } else if (typeof values[valueIndex] === "object") {
          attrs[attr.name] = values[valueIndex++];
          console.warn(
            `${el.tagName.toLowerCase()} 엘리먼트에 ${attr.name} 속성에 ${values[valueIndex - 1]} 객체가 들어가 있습니다. 값이 맞는지 확인하세요.`
          );
        } else {
          attrs[attr.name] = attr.value.replace(/__marker_(\d+)__/g, () => {
            const v = values[valueIndex++];
            return v !== void 0 ? String(v) : "";
          });
        }
      } else {
        attrs[attr.name] = attr.value;
      }
    }
    const children = [];
    for (const child of el.childNodes) {
      const vnode = convertChild(child);
      if (vnode) {
        if (Array.isArray(vnode)) {
          const filteredEmptyTextValue = vnode.filter((node) => !!node).flat();
          children.push(...filteredEmptyTextValue);
        } else {
          children.push(vnode);
        }
      }
    }
    return {
      type: "element",
      tag: el.tagName.toLowerCase(),
      children,
      ...!isEmpty(attrs) && { attr: attrs }
    };
  }
  function convertChild(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent ?? "";
      if (/^\s*$/.test(text)) return null;
      const markers = text.match(/__marker_(\d+)__/g);
      if (markers && markers.length >= 1) {
        return markers.map(() => {
          const { values } = renderResult;
          const value = values[valueIndex];
          if (typeof value === "function" && value.__isCreateComponent) {
            const getInstance = value;
            const instance = getInstance(currentSequence);
            currentSequence++;
            valueIndex++;
            return {
              type: "component",
              instance
            };
          }
          if (isRenderResultObject(value)) {
            const vdom = parse(value);
            return vdom;
          }
          if (Array.isArray(value)) {
            const result = values[valueIndex++].map((value2) => {
              if (isRenderResultObject(value2)) {
                const vdom = parse(value2);
                return vdom;
              }
              if (typeof value2 === "function" && value2.__isCreateComponent) {
                const getInstance = value2;
                const instance = getInstance(currentSequence);
                currentSequence++;
                return {
                  type: "component",
                  instance
                };
              }
            });
            return result;
          }
          if (/__marker_(\d+)__/.test(text)) {
            text = replaceMarkers(text);
            return {
              type: "text",
              value: text
            };
          }
          return null;
        });
      }
      return {
        type: "text",
        value: text
      };
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      return convertNode(node);
    }
    return null;
  }
  function replaceMarkers(str) {
    const { values } = renderResult;
    return str.replace(/__marker_(\d+)__/g, () => {
      const v = values[valueIndex++];
      return v !== void 0 ? String(v) : "";
    });
  }
  const { template: t } = renderResult;
  const template = document.createElement("template");
  template.innerHTML = t.trim();
  if (template.content.childNodes.length > 1) {
    throw new Error("루트 엘리먼트는 1개여야 합니다.");
  }
  const firstChild = template.content.firstChild;
  if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
    const vDom = convertChild(firstChild);
    if (Array.isArray(vDom)) {
      return vDom.filter((v) => !!v)[0];
    }
    return vDom;
  }
  return convertNode(template.content.firstElementChild);
}
const instanceMap = /* @__PURE__ */ new WeakMap();
function getInstanceMap() {
  return instanceMap;
}
let currentInstance = null;
function getCurrentInstance() {
  return currentInstance;
}
class ComponentInstance {
  constructor(component, sequence) {
    /** @type {Array<unknown>} */
    __publicField(this, "states", []);
    /** @type {Array<() => void | (() => () => void)} */
    __publicField(this, "mountHooks", []);
    /** @type {Array<() => void} */
    __publicField(this, "unMountHooks", []);
    /** @type {Array<object} */
    __publicField(this, "updatedHooks", []);
    /** @type {HTMLElement | null} */
    __publicField(this, "parentElement");
    /** @type {Function} 함수 컴포넌트 */
    __publicField(this, "component");
    /** @type {Object | null} 이전 렌더링 페이즈의 가상돔 */
    __publicField(this, "prevVnodeTree");
    /** @type {Object | null} 현재 렌더링 페이즈의 가상돔 */
    __publicField(this, "nextVnodeTree");
    /** @type {HTMLElement | null} */
    __publicField(this, "currentDom");
    /** @type {Number} html 트리에서의 위치 */
    __publicField(this, "sequence");
    /** @type {Object | null} */
    __publicField(this, "props", {});
    __publicField(this, "hookIndex", 0);
    __publicField(this, "hookLimit", 0);
    __publicField(this, "stateHookIndex", 0);
    __publicField(this, "updatedHookIndex", 0);
    __publicField(this, "isMounted", false);
    this.component = component;
    this.sequence = sequence;
  }
  hookIndexInitialize() {
    this.stateHookIndex = 0;
    this.updatedHookIndex = 0;
  }
  render(parentElement, isRerender) {
    if (isRerender) {
      this.hookIndexInitialize();
    }
    currentInstance = this;
    const template = this.component(this.props);
    this.parentElement = parentElement;
    this.prevVnodeTree = parse(template, this.sequence + 1);
    this.currentDom = createDOM(this.prevVnodeTree, parentElement);
    parentElement.insertBefore(this.currentDom, null);
    this.runMount();
  }
  reRender() {
    this.hookIndexInitialize();
    currentInstance = this;
    const template = this.component(this.props);
    this.nextVnodeTree = parse(template, this.sequence + 1);
    this.runUnmount(this.prevVnodeTree, this.nextVnodeTree);
    const newDom = createDOM(this.nextVnodeTree, this.parentElement);
    this.currentDom.replaceWith(newDom);
    this.currentDom = newDom;
    this.prevVnodeTree = this.nextVnodeTree;
    this.runUpdate();
  }
  runMount() {
    if (this.isMounted) return;
    for (const fn of this.mountHooks) {
      const cleanUp = fn();
      if (cleanUp && typeof cleanUp === "function") {
        this.unMountHooks.push(cleanUp);
      }
    }
    this.isMounted = true;
    this.hookLimit = this.hookIndex;
    this.mountHooks = null;
  }
  runUpdate() {
    for (const hook of this.updatedHooks) {
      if (!hook) continue;
      const hasChanged = Object.keys(hook.data).some(
        (key) => hook.data[key] !== hook.prevSnapshot[key]
      );
      if (hasChanged) {
        hook.callback(hook.prevSnapshot);
        hook.prevSnapshot = { ...hook.data };
      }
    }
  }
  /** 
   * @param {import('./parser').VNode} prevVnode
   * @param {import('./parser').VNode} nextVnode 
   */
  runUnmount(prevVnode, nextVnode) {
    var _a, _b;
    const prevInstances = this.collectInstances(prevVnode);
    const nextInstances = this.collectInstances(nextVnode);
    for (const instance of prevInstances) {
      if (!nextInstances.has(instance)) {
        for (const fn of instance.unMountHooks) {
          fn();
        }
        const instanceMap2 = getInstanceMap();
        (_a = instanceMap2.get(instance.component)) == null ? void 0 : _a.delete(instance.sequence);
        if ((((_b = instanceMap2.get(instance.component)) == null ? void 0 : _b.size) || 0) <= 0) {
          instanceMap2.delete(instance.component);
        }
      }
    }
  }
  collectInstances(vnode, set = /* @__PURE__ */ new Set()) {
    if (!vnode) return set;
    switch (vnode.type) {
      case "component":
        set.add(vnode.instance);
        this.collectInstances(vnode.instance.prevVnodeTree, set);
        break;
      case "element":
        vnode.children.forEach((child) => this.collectInstances(child, set));
        break;
    }
    return set;
  }
}
const renderQueue = /* @__PURE__ */ new Set();
let rafId = null;
function update(instance) {
  renderQueue.add(instance);
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    try {
      renderQueue.forEach((instance2) => {
        instance2.reRender();
      });
    } finally {
      renderQueue.clear();
      rafId = null;
    }
  });
}
function isPrimitive(value) {
  return value === null || typeof value !== "object" && typeof value !== "function";
}
function checkInvalidHook(currentInstance2) {
  if (currentInstance2.isMounted && currentInstance2.hookIndex > currentInstance2.hookLimit) {
    throw new Error("훅은 함수 최상단에 선언해야 합니다.");
  }
  if (!currentInstance2.isMounted) {
    currentInstance2.hookIndex += 1;
  }
}
function state(initial) {
  const currentInstance2 = getCurrentInstance();
  if (currentInstance2 === null) {
    throw new Error("state 함수는 컴포넌트 내에서 선언해야 합니다.");
  }
  checkInvalidHook(currentInstance2);
  const stateIndex = currentInstance2.stateHookIndex++;
  if (currentInstance2.states[stateIndex]) {
    return currentInstance2.states[stateIndex];
  }
  if (initial && isPrimitive(initial)) {
    throw new Error("원시객체 입니다. 객체 형식으로 넣으세요.");
  }
  const data = new Proxy(initial, {
    get(target, key, receiver) {
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const prevValue = Reflect.get(receiver, key);
      const result = Reflect.set(target, key, value, receiver);
      if (prevValue !== value) {
        update(currentInstance2);
      }
      return result;
    }
  });
  currentInstance2.states[stateIndex] = data;
  return data;
}
function mounted(callback) {
  const currentInstance2 = getCurrentInstance();
  if (currentInstance2 === null) {
    throw new Error("mount 함수는 컴포넌트 내에서 선언해야 합니다.");
  }
  checkInvalidHook(currentInstance2);
  if (currentInstance2.isMounted) {
    return;
  }
  currentInstance2.mountHooks.push(callback);
}
function html(strings, ...values) {
  let idx = 0;
  const rawString = strings.join("%%identifier%%").replace(/%%identifier%%/g, () => `__marker_${idx++}__`);
  return { template: rawString, values };
}
function createComponent(component, options) {
  const instanceMap2 = getInstanceMap();
  const func = function getInstance(sequence) {
    let instanceDeps = instanceMap2.get(component);
    if (!instanceDeps) {
      instanceDeps = /* @__PURE__ */ new Map();
    }
    let instance = instanceDeps.get(sequence);
    if (!instance) {
      instance = new ComponentInstance(component, sequence);
      instanceDeps.set(sequence, instance);
      instanceMap2.set(component, instanceDeps);
    }
    if (options && options.props) {
      instance.props = options.props;
    }
    return instance;
  };
  func.__isCreateComponent = true;
  return func;
}
function rootRender(container, component, options) {
  if (!component) {
    throw new Error("컴포넌트가 없습니다.");
  }
  const getInstance = createComponent(component, {
    props: options == null ? void 0 : options.props
  });
  const instance = getInstance(0);
  instance.render(container);
  return instance;
}
function createDOM(vnode, parentElement) {
  var _a;
  if (vnode.type === "text") {
    return document.createTextNode(vnode.value);
  }
  if (vnode.type === "component") {
    const instance = vnode.instance;
    instance.render(parentElement, true);
    return null;
  }
  const el = document.createElement(vnode.tag);
  if (vnode.attr) {
    for (const [key, value] of Object.entries(vnode.attr)) {
      if (/@([^\s=/>]+)/.test(key) && typeof value === "function") {
        const eventName = key.slice(1);
        el.addEventListener(eventName, value);
      } else {
        el.setAttribute(key, value);
      }
    }
  }
  (_a = vnode.children) == null ? void 0 : _a.forEach((child) => {
    const c = createDOM(child, el);
    if (c) {
      el.appendChild(c);
    }
  });
  return el;
}
function Child({ value }) {
  mounted(() => {
    alert("mount child1");
    return () => {
      alert("unmount child1");
    };
  });
  return html`<div id="child1">${value}</div>`;
}
function Child2({ value }) {
  mounted(() => {
    alert("mount child2");
    return () => {
      alert("unmount child2");
    };
  });
  return html`<div id="child2">${value}</div>`;
}
function Condition() {
  const data = state({
    bool: true
  });
  const trigger = () => {
    data.bool = !data.bool;
  };
  return html`
    <div id="app">
      <button type="button" @click=${trigger}>trigger</button>
      ${data.bool ? createComponent(Child, {
    props: {
      value: "true 일 때 보여질 컴포넌트"
    }
  }) : createComponent(Child2, {
    props: {
      value: "false 일 때 다른 컴포넌트"
    }
  })}
    </div>
  `;
}
rootRender(document.getElementById("root"), Condition);
