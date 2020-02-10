import { PiletMetadata } from '../types';

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

export function gotoRoute(route: string) {
  injectScript(`
    (function() {
      const dp = window['dbg:piral'];
      const deps = dp.pilets.getDependencies();
      const { useEffect } = deps['react'];
      const { useHistory } = deps['react-router-dom'];
      const ctx = dp.instance.context;
      const GoToComponent = () => {
        const history = useHistory();
        useEffect(() => {
          history.push(${JSON.stringify(route)});
          return () => {};
        }, []);
        return null;
      };
      ctx.setComponent('Debug', GoToComponent);
    })();
  `);
}

export function getRoutes() {
  injectScript(`
    (function() {
      const dp = window['dbg:piral'];
      const ctx = dp.instance.context;
      const registeredRoutes = ctx.readState(state => Object.keys(state.registry.pages));
      const componentRoutes = ctx.readState(state => Object.keys(state.routes));
      const ev = new CustomEvent('piral-routes', {
        detail: { routes: [...componentRoutes, ...registeredRoutes] },
      });
      window.dispatchEvent(ev);
    })();
  `);
}

export function appendPilet(meta: PiletMetadata) {
  injectScript(`
    (function() {
      const dp = window['dbg:piral'];
      const ctx = dp.instance.context;
      const { createApi, loadPilet, getDependencies } = dp.pilets;
      const meta = ${JSON.stringify(meta)};
      const fetcher = url =>
        fetch(url, {
          method: 'GET',
          cache: 'reload',
        }).then(m => m.text());
      loadPilet(meta, getDependencies, fetcher).then(pilet => {
        try {
          const newApi = createApi(pilet);
          ctx.injectPilet(pilet);
          pilet.setup(newApi);
        } catch (error) {
          console.error(error);
        }
      });
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
              pilets: JSON.parse(JSON.stringify(current.modules)),
            },
          });
          window.dispatchEvent(ev);
        }

        if (current.registry.pages !== previous.registry.pages || current.routes !== previous.routes) {
          const ev = new CustomEvent('piral-routes', {
            detail: {
              routes: [...Object.keys(current.registry.pages), ...Object.keys(current.routes)],
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
