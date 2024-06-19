import { getCurrentInstance, onMounted } from 'vue';

export function exposeOnCustomElementHost(functions: Record<string, Function>) {
  onMounted(() => {
    const instance = getCurrentInstance();
    const rootEl = instance.root.vnode.el as HTMLElement;
    const shadowRoot = rootEl.getRootNode();
    if (!(shadowRoot instanceof ShadowRoot)) throw 'Invalid Root Node: ShadowRoot expected';

    for (const name in functions) {
      Object.defineProperty(shadowRoot.host, name, {
        get() {
          return functions[name];
        },
      });
    }
  });
}
