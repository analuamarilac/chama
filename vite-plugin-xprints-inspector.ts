import type { Plugin } from "vite";

const INSPECTOR_SCRIPT = `
<script>
    (function () {
      function buildLabel(el) {
        const tsdSource = el.getAttribute('data-tsd-source');
        if (tsdSource) return tsdSource;

        const tag = el.tagName.toLowerCase();
        const id = el.id ? '#' + el.id : '';
        const classes = Array.from(el.classList).slice(0, 2).map(function(c) { return '.' + c; }).join('');
        return tag + id + classes;
      }

      function notifyRouteChange() {
        if (window.parent === window) return;
        window.parent.postMessage({ type: 'xprints:routeChange', url: window.location.href }, '*');
      }

      // cobre navigate(), <Link> e redirect() — TanStack Router e React Router usam pushState/replaceState internamente
      var originalPush = history.pushState.bind(history);
      history.pushState = function () {
        originalPush.apply(history, arguments);
        notifyRouteChange();
      };

      var originalReplace = history.replaceState.bind(history);
      history.replaceState = function () {
        originalReplace.apply(history, arguments);
        notifyRouteChange();
      };

      // cobre botão voltar/avançar do browser
      window.addEventListener('popstate', notifyRouteChange);

      window.addEventListener('message', function (event) {
        var data = event.data;
        var source = event.source;
        if (!data || typeof data !== 'object' || !source) return;

        if (data.type === 'xprints:getElementAt') {
          var el = document.elementFromPoint(data.x, data.y);
          if (!el) { source.postMessage({ type: 'xprints:noElement' }, event.origin || '*'); return; }
          var r = el.getBoundingClientRect();
          source.postMessage({ type: 'xprints:elementInfo', rect: { top: r.top, left: r.left, width: r.width, height: r.height }, label: buildLabel(el) }, event.origin || '*');
        }

        if (data.type === 'xprints:refreshRects') {
          var results = data.labels.map(function(label) {
            var el = null;
            try { el = document.querySelector('[data-tsd-source="' + CSS.escape(label) + '"]') || document.querySelector(label); } catch (_) {}
            if (!el) return { label: label, rect: null };
            var r = el.getBoundingClientRect();
            return { label: label, rect: { top: r.top, left: r.left, width: r.width, height: r.height } };
          });
          window.parent.postMessage({ type: 'xprints:rectsRefreshed', results: results }, '*');
        }
      });
    })();
    </script>`;

function xprintsInspectorPlugin(): Plugin {
  return {
    name: "xprints-inspector",
    apply: "serve",
    transformIndexHtml(html) {
      return html.replace("</head>", `${INSPECTOR_SCRIPT}\n</head>`);
    },
  };
}

export { xprintsInspectorPlugin };
