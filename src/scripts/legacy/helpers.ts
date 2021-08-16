import { PiletMetadata, PiralDebugSettings } from '../../types';

function injectScript(content: string) {
  const script = document.createElement('script');
  script.textContent = `
    (function() {
      if ('dbg:piral' in window) {
        ${content}
      }
    })();
  `;
  document.head.appendChild(script);
  script.remove();
}

export function runCommand(method: string, args: Array<any>) {
  injectScript(`
    const dp = window['dbg:piral'];
    const f = dp.${method};
    f.apply(f, ${JSON.stringify(args)});
  `);
}

export function runQuery(id: string, value: string) {
  injectScript(`
    const dp = window['dbg:piral'];
    const result = dp.${value};
    const ev = new CustomEvent('piral-result', {
      detail: {
        id: ${JSON.stringify(id)},
        result,
      },
    });
    window.dispatchEvent(ev);
  `);
}

const getPiletsEvent = `
  new CustomEvent('piral-pilets', {
    detail: {
      pilets: pilets.map(pilet => ({
        name: pilet.name,
        version: pilet.version,
        disabled: pilet.disabled,
      })),
    },
  })
`;

export function getPilets() {
  injectScript(`
    const dp = window['dbg:piral'];
    const ctx = dp.instance.context;
    const pilets = ctx.readState(state => state.modules);
    window.dispatchEvent(${getPiletsEvent});
  `);
}

export function sendEvent(name: string, args: any) {
  injectScript(`
    const dp = window['dbg:piral'];
    const ctx = dp.instance.context;
    ctx.emit(${JSON.stringify(name)}, ${JSON.stringify(args)});
  `);
}

export function sendVisualizeAll() {
  injectScript(`
    const ev = new CustomEvent('visualize-all');
    document.body.dispatchEvent(ev);
  `);
}

export function getSettings() {
  injectScript(`
    const viewState = sessionStorage.getItem('dbg:view-state') !== 'off';
    const loadPilets = sessionStorage.getItem('dbg:load-pilets') === 'on';
    const hardRefresh = sessionStorage.getItem('dbg:hard-refresh') === 'on';
    const viewOrigins = sessionStorage.getItem('dbg:view-origins') === 'on';

    const ev = new CustomEvent('piral-settings', {
      detail: {
        settings: {
          viewState: {
            value: viewState,
            type: 'boolean',
            label: 'State container logging',
          },
          loadPilets: {
            value: loadPilets,
            type: 'boolean',
            label: 'Load available pilets',
          },
          hardRefresh: {
            value: hardRefresh,
            type: 'boolean',
            label: 'Full refresh on change',
          },
          viewOrigins: {
            value: viewOrigins,
            type: 'boolean',
            label: 'Visualize component origins',
          },
        },
      },
    });

    window.dispatchEvent(ev);
  `);
}

export function setSettings(settings: PiralDebugSettings) {
  const viewState = JSON.stringify(settings.viewState ? 'on' : 'off');
  const loadPilets = JSON.stringify(settings.loadPilets ? 'on' : 'off');
  const hardRefresh = JSON.stringify(settings.hardRefresh ? 'on' : 'off');
  const viewOrigins = JSON.stringify(settings.viewOrigins ? 'on' : 'off');
  injectScript(`
    sessionStorage.setItem('dbg:view-state', ${viewState});
    sessionStorage.setItem('dbg:load-pilets', ${loadPilets});
    sessionStorage.setItem('dbg:hard-refresh', ${hardRefresh});
    sessionStorage.setItem('dbg:view-origins', ${viewOrigins});

    const dp = window['dbg:piral'];
    const deps = dp.pilets.getDependencies();
    const r = deps.react;
    const ctx = dp.instance.context;
    ctx.includeProvider(r.createElement(props => props.children));
  `);
  getSettings();
}

export function gotoRoute(route: string) {
  injectScript(`
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
  `);
}

export function getRoutes() {
  injectScript(`
    const dp = window['dbg:piral'];
    const ctx = dp.instance.context;
    const registeredRoutes = ctx.readState(state => Object.keys(state.registry.pages));
    const componentRoutes = ctx.readState(state => Object.keys(state.routes));
    const ev = new CustomEvent('piral-routes', {
      detail: { routes: [...componentRoutes, ...registeredRoutes] },
    });
    window.dispatchEvent(ev);
  `);
}

export function appendPilet(meta: PiletMetadata) {
  injectScript(`
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
  `);
}

export function listenToEvents() {
  injectScript(`
    const _ = document.body.dispatchEvent;
    document.body.dispatchEvent = function (e) {
      _.call(this, e);

      if (e.type.startsWith('piral-')) {
        const ev = new CustomEvent('piral-event', {
          detail: {
            name: e.type.replace('piral-', ''),
            args: e.detail.arg,
          },
        });

        window.dispatchEvent(ev);
      }
    };
  `);
}

export function togglePilet(name: string) {
  injectScript(`
    const dp = window['dbg:piral'];
    const ctx = dp.instance.context;
    const [pilet] = ctx.readState(state => state.modules).filter(m => m.name === ${JSON.stringify(name)});

    if (pilet.disabled) {
      try {
        const { createApi } = dp.pilets;
        const newApi = createApi(pilet);
        ctx.injectPilet(pilet.original);
        pilet.original.setup(newApi);
      } catch (error) {
        console.error(error);
      }
    } else {
      ctx.injectPilet({ name: ${JSON.stringify(name)}, disabled: true, original: pilet });
    }
  `);
}

export function removePilet(name: string) {
  injectScript(`
    const dp = window['dbg:piral'];
    const ctx = dp.instance.context;
    ctx.injectPilet({ name: ${JSON.stringify(name)} });
    ctx.dispatch(state => ({
      ...state,
      modules: state.modules.filter(m => m.name !== ${JSON.stringify(name)}),
    }));
  `);
}

export function supervise() {
  injectScript(`
    const dp = window['dbg:piral'];
    const deps = dp.pilets.getDependencies();
    const ctx = dp.instance.context;
    const { addChangeHandler } = deps['@dbeining/react-atom'];
    const rect = {
      border: '1px solid red',
      display: 'none',
      position: 'absolute',
      top: 0, bottom: 0, right: 0, left: 0,
      zIndex: 99999999999,
      pointerEvents: 'none',
    };
    const info = {
      background: 'red',
      color: 'white',
      position: 'absolute',
      right: 0,
      top: 0,
      fontSize: '8px',
    };
    const colors = [
      '#001F3F',
      '#0074D9',
      '#7FDBFF',
      '#39CCCC',
      '#3D9970',
      '#2ECC40',
      '#01FF70',
      '#FFDC00',
      '#FF851B',
      '#FF4136',
      '#85144B',
      '#F012BE',
      '#B10DC9',
    ];
    const moduleColor = {};
    const visualizer = props => {
      const r = deps.react;
      const location = deps['react-router-dom'].useLocation();
      const container = r.useRef(null);
      const title = props.pilet;
      const color = moduleColor[title] || (moduleColor[title] = colors[Object.keys(moduleColor).length % colors.length]);
      const active = sessionStorage.getItem('dbg:view-origins') === 'on';

      r.useEffect(() => {
        let sibling = container.current && container.current.nextElementSibling;

        if (sibling && active) {
          const style = container.current.style;
          const target = container.current.parentNode;
          const observer = new MutationObserver(changes => {
            for (let change of changes) {
              const newSibling = container.current.nextElementSibling;

              if (newSibling !== sibling) {
                sibling = newSibling;
                sibling.addEventListener('mouseover', mouseIn);
                sibling.addEventListener('mouseout', mouseOut);
              }
            }
          });

          const mouseIn = () => {
            style.display = 'block';
            style.left = '0px';
            style.top = '0px';
            style.bottom = '0px';
            style.right = '0px';
            const targetRect = sibling.getBoundingClientRect();
            const sourceRect = container.current.getBoundingClientRect();
            style.left = (targetRect.left - sourceRect.left) + 'px';
            style.top = (targetRect.top - sourceRect.top) + 'px';
            style.bottom = -(targetRect.bottom - sourceRect.bottom) + 'px';
            style.right = -(targetRect.right - sourceRect.right) + 'px';
          };
          const mouseOut = () => {
            style.display = 'none';
          };
          const forcedVisualize = () => {
            mouseIn();
            setTimeout(mouseOut, 5000);
          };

          document.body.addEventListener('visualize-all', forcedVisualize);
          sibling.addEventListener('mouseover', mouseIn);
          sibling.addEventListener('mouseout', mouseOut);
          observer.observe(target, { childList: true });

          return () => {
            document.body.removeEventListener('visualize-all', forcedVisualize);
            sibling.removeEventListener('mouseover', mouseIn);
            sibling.removeEventListener('mouseout', mouseOut);
            observer.disconnect();
          };
        }
      }, [location.key, active]);

      if (active) {
        return r.createElement('div',
          { style: { ...rect, borderColor: color }, ref: container },
          r.createElement('div', { style: { ...info, background: color } }, title));
      }

      return null;
    };
    const triggerUpdate = (current) => {
      const { portals, routes, registry, ...state } = current;
      const newRegistry = { ...registry };
      let requireChange = false;

      window.dispatchEvent(new CustomEvent('piral-container', {
        detail: {
          container: JSON.parse(JSON.stringify(state)),
        },
      }));

      Object.keys(registry).forEach(key => {
        const items = registry[key];
        const newItems = { ...items };

        Object.keys(items).forEach(name => {
          const item = items[name];
          const fn = item.component;

          if (fn && !fn.$visual) {
            requireChange = true;
            const component = function(props) {
              const r = deps.react;
              return r.createElement(
                r.Fragment, undefined,
                  r.createElement(visualizer, { name, pilet: item.pilet }),
                  r.createElement(fn, props)
              );
            };
            component.$visual = true;
            newItems[name] = {
              ...item,
              component,
            };
          } else {
            newItems[name] = item;
          }
        });

        newRegistry[key] = newItems;
      });

      if (requireChange) {
        ctx.dispatch(state => ({
          ...state,
          registry: newRegistry,
        }));
      }
    };

    triggerUpdate(ctx.readState(state => state));

    addChangeHandler(ctx.state, 'inspector', ({ current, previous }) => {
      if (current.modules !== previous.modules) {
        const pilets = current.modules;
        window.dispatchEvent(${getPiletsEvent});
      }

      if (current.registry.pages !== previous.registry.pages || current.routes !== previous.routes) {
        const ev = new CustomEvent('piral-routes', {
          detail: {
            routes: [...Object.keys(current.registry.pages), ...Object.keys(current.routes)],
          },
        });
        window.dispatchEvent(ev);
      }

      triggerUpdate(current);
    });
  `);
}

export function check() {
  injectScript(`
    const dp = window['dbg:piral'];

    const ev = new CustomEvent('piral-found', {
      detail: {
        kind: dp.debug,
        name: dp.instance.name,
        version: dp.instance.version,
        capabilities: ["events", "container", "routes", "pilets", "settings"],
      },
    });
    window.dispatchEvent(ev);
  `);
}
