import parse from './parser';
import { createDOM } from './runtime-dom';

/**
 * @typedef {Map<number, ComponentInstance>} InstanceMapValue
 */

/** 
 * @description 마운트 되고 있는 컴포넌트 리스트
 * @type {WeakMap<Function, InstanceMapValue>}
 */
const instanceMap = new WeakMap();
export function getInstanceMap() {
  return instanceMap;
}

/** @description 현재 렌더링 되고 있는 컴포넌트 */
let currentInstance = null;
export function getCurrentInstance() {
  return currentInstance;
}

/** @description 컴포넌트 인스턴스 - 상태, Props, 생명주기, VNode 트리, DOM 참조를 관리 */
export default class ComponentInstance {
  /** @type {Array<unknown>} */
  states = [];

  /** @type {Array<() => void | (() => () => void)} */
  mountHooks = [];
  
  /** @type {Array<() => void} */
  unMountHooks = [];

  /** @type {Array<object} */
  updatedHooks = [];

  /** @type {HTMLElement | null} */
  parentElement;

  /** @type {Function} 함수 컴포넌트 */
  component;

  /** @type {Object | null} 이전 렌더링 페이즈의 가상돔 */
  prevVnodeTree;

  /** @type {Object | null} 현재 렌더링 페이즈의 가상돔 */
  nextVnodeTree;

  /** @type {HTMLElement | null} */
  currentDom;

  /** @type {Number} html 트리에서의 위치 */
  sequence;

  /** @type {Object | null} */
  props = {};

  hookIndex = 0;

  hookLimit = 0;

  stateHookIndex = 0;

  updatedHookIndex = 0;

  isMounted = false;

  constructor(component, sequence) {
    this.component = component;
    /** @description 해당 컴포넌트가 트리에서 어디에 위치해 있는지 식별하는 넘버 */
    this.sequence = sequence;
  }

  hookIndexInitialize() {
    this.stateHookIndex = 0;
    this.updatedHookIndex = 0;
  }

  render(parentElement, isRerender) {
    // 부모 리렌더링으로 인한 자식 리렌더링이라면
    if (isRerender) {
      this.hookIndexInitialize();
    }

    /** @description 현재 렌더링 되고 있는 컴포넌트를 할당 */
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

    // 새로운 값들을 이전 변수에 할당
    this.currentDom = newDom;
    this.prevVnodeTree = this.nextVnodeTree;
    this.runUpdate();
  }

  runMount() {
    if (this.isMounted) return;

    for (const fn of this.mountHooks) {
      const cleanUp = fn();
      if (cleanUp && typeof cleanUp === 'function') {
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

      // 값이 변경되었다면
      if (hasChanged) {
        hook.callback(hook.prevSnapshot);
        // 이전 스냅샷을 저장
        hook.prevSnapshot = { ...hook.data };
      }
    }
  }

  /** 
   * @param {import('./parser').VNode} prevVnode
   * @param {import('./parser').VNode} nextVnode 
   */
  runUnmount(prevVnode, nextVnode) {
    const prevInstances = this.collectInstances(prevVnode);
    const nextInstances = this.collectInstances(nextVnode);

    for (const instance of prevInstances) {
      if (!nextInstances.has(instance)) {
        for (const fn of instance.unMountHooks) {
          fn();
        }

        const instanceMap = getInstanceMap();
        instanceMap.get(instance.component)?.delete(instance.sequence);
        if ((instanceMap.get(instance.component)?.size || 0) <= 0) {
          instanceMap.delete(instance.component);
        }
      }
    }
  }

  collectInstances(
    vnode,
    set = new Set()
  ) {
    if (!vnode) return set;
    switch (vnode.type) {
      case 'component':
        set.add(vnode.instance);
        this.collectInstances(vnode.instance.prevVnodeTree, set);
        break;
      case 'element':
        vnode.children.forEach((child) => this.collectInstances(child, set));
        break;
      case 'text':
        break;
    }
    return set;
  }
}
