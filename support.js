/*
 * support.js — minimal local runtime for Claude "Design Container" (.dc.html) files.
 *
 * The .dc.html format uses:
 *   - a <helmet> block (fonts / global styles) inside <x-dc>
 *   - a declarative template with <sc-if>, <sc-for> and {{ path }} bindings
 *   - a <script type="text/x-dc" data-dc-script> that defines
 *       class Component extends DCLogic { state = {...}; renderVals() {...} ... }
 *
 * This file provides the DCLogic base class and a tiny reactive renderer so the
 * document can be opened locally in a browser (served over http://) without the
 * proprietary Claude Design runtime.
 */
(function () {
  "use strict";

  // ---- DCLogic base class (what Component extends) -------------------------
  class DCLogic {
    setState(updater) {
      const partial =
        typeof updater === "function" ? updater(this.state) : updater;
      this.state = Object.assign({}, this.state, partial);
      if (this.__scheduleRender) this.__scheduleRender();
    }
    forceUpdate() {
      if (this.__scheduleRender) this.__scheduleRender();
    }
  }
  window.DCLogic = DCLogic;

  // ---- expression helpers --------------------------------------------------
  // All bindings in these files are simple identifiers or single-dot paths,
  // plus the literals true/false. Resolve a dotted path against a scope object
  // (scope uses a prototype chain so loop variables see outer values too).
  function resolvePath(expr, scope) {
    expr = (expr || "").trim();
    if (expr === "true") return true;
    if (expr === "false") return false;
    if (expr === "") return undefined;
    const parts = expr.split(".");
    let cur = scope;
    for (let i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i].trim()];
    }
    return cur;
  }

  const BINDING_RE = /\{\{([^}]*)\}\}/g;
  const SVG_NS = "http://www.w3.org/2000/svg";

  function interpolate(str, scope) {
    if (str.indexOf("{{") === -1) return str;
    return str.replace(BINDING_RE, function (_, e) {
      const v = resolvePath(e, scope);
      return v == null ? "" : String(v);
    });
  }

  // return the inner expression of a `{{ ... }}` attribute value
  function exprOf(v) {
    const m = v && v.match(/\{\{([^}]*)\}\}/);
    return m ? m[1] : v;
  }

  // return a function if the attribute value is a single `{{ handler }}`
  function fnOf(v, scope) {
    const m = v && v.match(/^\s*\{\{([^}]*)\}\}\s*$/);
    if (!m) return null;
    const val = resolvePath(m[1], scope);
    return typeof val === "function" ? val : null;
  }

  // ---- behaviour (event handlers + hover styles) ---------------------------
  const HANDLER_PROPS = [
    "onclick",
    "onpointerdown",
    "onpointermove",
    "onpointerup",
    "oninput",
    "onchange",
    "onkeydown",
    "onmouseenter",
    "onmouseleave",
    "onblur",
    "onfocus",
    "onsubmit",
    "onwheel",
  ];

  function applyBehaviors(el) {
    for (let i = 0; i < HANDLER_PROPS.length; i++) el[HANDLER_PROPS[i]] = null;
    if (el._ev) {
      for (const t in el._ev) el["on" + t] = el._ev[t];
    }
    if (el._hover) {
      el.onmouseenter = function () {
        el._hovering = true;
        el.style.cssText = (el._baseStyle || "") + ";" + el._hover;
      };
      el.onmouseleave = function () {
        el._hovering = false;
        el.style.cssText = el._baseStyle || "";
      };
    }
  }

  // ---- build a live DOM subtree from a template node -----------------------
  function buildNodes(tpl, scope, out) {
    // Text node
    if (tpl.nodeType === 3) {
      out.push(document.createTextNode(interpolate(tpl.nodeValue, scope)));
      return out;
    }
    // Comment / other non-elements: skip
    if (tpl.nodeType !== 1) return out;

    const tag = tpl.tagName;
    // Inside SVG (foreign content) the parser does NOT upper-case tag names,
    // so <sc-if>/<sc-for> come through as "sc-if"/"sc-for". Normalise.
    const tagUpper = tag.toUpperCase();

    if (tagUpper === "SC-IF") {
      const cond = resolvePath(exprOf(tpl.getAttribute("value")), scope);
      if (cond) buildChildren(tpl, scope, out);
      return out;
    }

    if (tagUpper === "SC-FOR") {
      const list = resolvePath(exprOf(tpl.getAttribute("list")), scope) || [];
      const asName = tpl.getAttribute("as");
      for (let i = 0; i < list.length; i++) {
        const child = Object.create(scope);
        child[asName] = list[i];
        child.$index = i;
        buildChildren(tpl, child, out);
      }
      return out;
    }

    // Regular element. The HTML parser already namespaces <svg> and its
    // descendants, so honour that (SVG elements must be created via
    // createElementNS or they render as inert unknown HTML elements).
    const el =
      tpl.namespaceURI === SVG_NS
        ? document.createElementNS(SVG_NS, tpl.localName)
        : document.createElement(tag);
    let ev = null;
    const attrs = tpl.attributes;
    for (let i = 0; i < attrs.length; i++) {
      const name = attrs[i].name;
      const val = attrs[i].value;
      if (name.indexOf("hint-placeholder") === 0) continue; // design-time hint
      if (name === "style-hover") {
        el._hover = interpolate(val, scope);
        continue;
      }
      if (name.indexOf("on") === 0 && name.length > 2) {
        const fn = fnOf(val, scope);
        if (fn) (ev || (ev = {}))[name.slice(2)] = fn;
        continue;
      }
      const resolved = interpolate(val, scope);
      el.setAttribute(name, resolved);
      if (name === "style") el._baseStyle = resolved;
    }
    el._ev = ev;
    applyBehaviors(el);

    const kids = [];
    buildChildren(tpl, scope, kids);
    for (let i = 0; i < kids.length; i++) el.appendChild(kids[i]);

    out.push(el);
    return out;
  }

  function buildChildren(tpl, scope, out) {
    const kids = tpl.childNodes;
    for (let i = 0; i < kids.length; i++) buildNodes(kids[i], scope, out);
    return out;
  }

  // ---- morph the live tree towards freshly built nodes ---------------------
  function morph(parent, newNodes) {
    for (let i = 0; i < newNodes.length; i++) {
      const nn = newNodes[i];
      const on = parent.childNodes[i];
      if (!on) {
        parent.appendChild(nn);
        continue;
      }
      morphNode(on, nn, parent);
    }
    while (parent.childNodes.length > newNodes.length) {
      parent.removeChild(parent.lastChild);
    }
  }

  function morphNode(on, nn, parent) {
    if (
      on.nodeType !== nn.nodeType ||
      (on.nodeType === 1 && on.tagName !== nn.tagName)
    ) {
      parent.replaceChild(nn, on);
      return;
    }
    if (on.nodeType === 3) {
      if (on.nodeValue !== nn.nodeValue) on.nodeValue = nn.nodeValue;
      return;
    }
    if (on.nodeType !== 1) return;

    syncAttrs(on, nn);
    on._ev = nn._ev;
    on._hover = nn._hover;
    applyBehaviors(on);
    if (on._hovering && on._hover) {
      on.style.cssText = (on._baseStyle || "") + ";" + on._hover;
    }
    morph(on, Array.prototype.slice.call(nn.childNodes));
  }

  function syncAttrs(on, nn) {
    const na = nn.attributes;
    for (let i = 0; i < na.length; i++) {
      const name = na[i].name;
      const val = na[i].value;
      if (on.getAttribute(name) !== val) on.setAttribute(name, val);
      if (name === "style") on._baseStyle = val;
    }
    const oa = on.attributes;
    for (let i = oa.length - 1; i >= 0; i--) {
      const name = oa[i].name;
      if (!nn.hasAttribute(name)) on.removeAttribute(name);
    }
  }

  // ---- boot ----------------------------------------------------------------
  function showError(err) {
    console.error("[support.js]", err);
    const box = document.createElement("pre");
    box.style.cssText =
      "position:fixed;left:0;right:0;bottom:0;margin:0;padding:16px;" +
      "background:#2a0d0d;color:#ffb4b4;font:12px/1.5 monospace;" +
      "white-space:pre-wrap;z-index:99999;max-height:40vh;overflow:auto;";
    box.textContent =
      "support.js runtime error:\n" + (err && err.stack ? err.stack : err);
    document.body.appendChild(box);
  }

  function boot() {
    const xdc = document.querySelector("x-dc");
    if (!xdc) {
      console.warn("[support.js] no <x-dc> root found");
      return;
    }

    // Move <helmet> contents (fonts + global styles) into <head>.
    const helmet = xdc.querySelector("helmet");
    if (helmet) {
      const nodes = Array.prototype.slice.call(helmet.childNodes);
      for (let i = 0; i < nodes.length; i++) document.head.appendChild(nodes[i]);
      helmet.remove();
    }

    // Snapshot the (now helmet-free) template, then use <x-dc> as mount root.
    const templateNodes = Array.prototype.slice
      .call(xdc.childNodes)
      .map(function (n) {
        return n.cloneNode(true);
      });
    while (xdc.firstChild) xdc.removeChild(xdc.firstChild);
    xdc.style.display = "block";

    // Read + evaluate the component script.
    const scriptEl = document.querySelector(
      'script[type="text/x-dc"][data-dc-script], script[data-dc-script]'
    );
    if (!scriptEl) {
      showError(new Error("no <script data-dc-script> component found"));
      return;
    }

    let ComponentClass;
    try {
      ComponentClass = new Function(
        "DCLogic",
        scriptEl.textContent + "\n;return Component;"
      )(DCLogic);
    } catch (e) {
      showError(e);
      return;
    }

    let inst;
    try {
      inst = new ComponentClass();
    } catch (e) {
      showError(e);
      return;
    }

    // Optional deep-link for local testing: #m=<module>&s=<section>
    try {
      const h = (location.hash || "").replace(/^#/, "");
      if (h && inst.state) {
        const q = {};
        h.split("&").forEach(function (p) {
          const kv = p.split("=");
          q[kv[0]] = kv[1];
        });
        if (q.m != null) inst.state.mi = parseInt(q.m, 10) || 0;
        if (q.s != null) inst.state.si = parseInt(q.s, 10) || 0;
      }
    } catch (e) {}

    let scheduled = false;
    inst.__scheduleRender = function () {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        render();
      });
    };

    function render() {
      let out;
      try {
        out = inst.renderVals();
      } catch (e) {
        showError(e);
        return;
      }
      const newNodes = [];
      for (let i = 0; i < templateNodes.length; i++) {
        buildNodes(templateNodes[i], out, newNodes);
      }
      try {
        morph(xdc, newNodes);
      } catch (e) {
        showError(e);
      }
    }

    render();
    if (typeof inst.componentDidMount === "function") {
      try {
        inst.componentDidMount();
      } catch (e) {
        console.error("[support.js] componentDidMount", e);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
