function injectScript(content: string) {
  const script = document.createElement('script');
  script.textContent = content;
  document.head.appendChild(script);
  script.remove();
}

export function runCommand(method: string, args: Array<any>) {
  injectScript(`
    (function() {
      const dp = window['dbg:piral'];
      const f = dp.${method};
      f.apply(f, ${JSON.stringify(args)});
    })();
  `);
}

export function runQuery(id: string, value: string) {
  injectScript(`
    (function() {
      const dp = window['dbg:piral'];
      const result = dp.${value};
      const ev = new CustomEvent('piral-result', {
        detail: {
          id: ${JSON.stringify(id)},
          result,
        },
      });
      window.dispatchEvent(ev);
    })();
  `);
}

export function getPilets() {
  injectScript(`
    (function() {
      const dp = window['dbg:piral'];
      const ctx = dp.instance.context;
      const pilets = ctx.readState(state => state.modules);
      const ev = new CustomEvent('piral-pilets', {
        detail: { pilets },
      });
      window.dispatchEvent(ev);
    })();
  `);
}

export function removePilet(name: string) {
  injectScript(`
    (function() {
      const dp = window['dbg:piral'];
      const ctx = dp.instance.context;
      ctx.injectPilet({ name: ${JSON.stringify(name)} });
      ctx.dispatch(state => ({
        ...state,
        modules: state.modules.filter(m => m.name !== ${JSON.stringify(name)}),
      }));
    })();
  `);
}

export function supervise() {
  injectScript(`
    (function() {
      const dp = window['dbg:piral'];
      const deps = dp.pilets.getDependencies();
      const ctx = dp.instance.context;
      const { addChangeHandler } = deps['@dbeining/react-atom'];

      addChangeHandler(ctx.state, 'inspector', ({ current, previous }) => {
        if (current.modules !== previous.modules) {
          const ev = new CustomEvent('piral-pilets', {
            detail: {
              pilets: current.modules,
            },
          });
          window.dispatchEvent(ev);
        }
      });
    })();
  `);
}

export function check() {
  injectScript(`
    if ('dbg:piral' in window) {
      const dp = window['dbg:piral'];
      const ev = new CustomEvent('piral-found', {
        detail: {
          kind: dp.debug,
          name: dp.instance.name,
          version: dp.instance.version,
        },
      });
      window.dispatchEvent(ev);
    }
  `);
}
