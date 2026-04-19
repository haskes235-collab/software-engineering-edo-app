var Sn = Object.defineProperty;
var Dn = (d, f, h) => f in d ? Sn(d, f, { enumerable: !0, configurable: !0, writable: !0, value: h }) : d[f] = h;
var Z = (d, f, h) => Dn(d, typeof f != "symbol" ? f + "" : f, h);
import { app as dt, BrowserWindow as Ar, ipcMain as ht } from "electron";
import { fileURLToPath as Ln } from "node:url";
import ot from "node:path";
import In from "node:fs";
import kn from "node:crypto";
import Mn from "path";
import Ae from "fs";
import Or from "crypto";
const ct = {
  DOCUMENTS: {
    GET_ALL: "documents:getAll",
    GET_BY_ID: "documents:getById",
    CREATE: "documents:create",
    UPDATE: "documents:update",
    DELETE: "documents:delete",
    GET_VERSIONS: "documents:getVersions"
  }
};
function qn(d) {
  return d && d.__esModule && Object.prototype.hasOwnProperty.call(d, "default") ? d.default : d;
}
var Rr = { exports: {} };
(function(d, f) {
  var h = void 0, b = function(E) {
    return h || (h = new Promise(function($, st) {
      var ar, lr, fr, hr, cr;
      var k = typeof E < "u" ? E : {}, Se = k.onAbort;
      k.onAbort = function(t) {
        st(new Error(t)), Se && Se(t);
      }, k.postRun = k.postRun || [], k.postRun.push(function() {
        $(k);
      }), d = void 0;
      var u;
      u || (u = typeof k < "u" ? k : {});
      var Ir = !!globalThis.window, Zt = !!globalThis.WorkerGlobalScope, Ot = ((lr = (ar = globalThis.process) == null ? void 0 : ar.versions) == null ? void 0 : lr.node) && ((fr = globalThis.process) == null ? void 0 : fr.type) != "renderer";
      u.onRuntimeInitialized = function() {
        function t(o, l) {
          switch (typeof l) {
            case "boolean":
              On(o, l ? 1 : 0);
              break;
            case "number":
              Tn(o, l);
              break;
            case "string":
              Nn(o, l, -1, -1);
              break;
            case "object":
              if (l === null) yr(o);
              else if (l.length != null) {
                var m = Wt(l.length);
                D.set(l, m), An(o, m, l.length, -1), gt(m);
              } else Qt(o, "Wrong API use : tried to return a value of an unknown type (" + l + ").", -1);
              break;
            default:
              yr(o);
          }
        }
        function e(o, l) {
          for (var m = [], p = 0; p < o; p += 1) {
            var _ = z(l + 4 * p, "i32"), T = yn(_);
            if (T === 1 || T === 2) _ = gn(_);
            else if (T === 3) _ = _n(_);
            else if (T === 4) {
              T = _, _ = vn(T), T = En(T);
              for (var C = new Uint8Array(_), F = 0; F < _; F += 1) C[F] = D[T + F];
              _ = C;
            } else _ = null;
            m.push(_);
          }
          return m;
        }
        function r(o, l) {
          this.Qa = o, this.db = l, this.Oa = 1, this.mb = [];
        }
        function n(o, l) {
          if (this.db = l, this.fb = Vt(o), this.fb === null) throw Error("Unable to allocate memory for the SQL string");
          this.lb = this.fb, this.$a = this.sb = null;
        }
        function i(o) {
          if (this.filename = "dbfile_" + (4294967295 * Math.random() >>> 0), o != null) {
            var l = this.filename, m = "/", p = l;
            if (m && (m = typeof m == "string" ? m : he(m), p = l ? ae(m + "/" + l) : m), l = Ce(!0, !0), p = $r(
              p,
              l
            ), o) {
              if (typeof o == "string") {
                m = Array(o.length);
                for (var _ = 0, T = o.length; _ < T; ++_) m[_] = o.charCodeAt(_);
                o = m;
              }
              Ft(p, l | 146), m = ft(p, 577), er(m, o, 0, o.length, 0), we(m), Ft(p, l);
            }
          }
          this.handleError(w(this.filename, s)), this.db = z(s, "i32"), _r(this.db), this.gb = {}, this.Sa = {};
        }
        var s = nt(4), a = u.cwrap, w = a("sqlite3_open", "number", ["string", "number"]), g = a("sqlite3_close_v2", "number", ["number"]), v = a("sqlite3_exec", "number", ["number", "string", "number", "number", "number"]), O = a("sqlite3_changes", "number", ["number"]), L = a(
          "sqlite3_prepare_v2",
          "number",
          ["number", "string", "number", "number", "number"]
        ), dr = a("sqlite3_sql", "string", ["number"]), tn = a("sqlite3_normalized_sql", "string", ["number"]), mr = a("sqlite3_prepare_v2", "number", ["number", "number", "number", "number", "number"]), en = a("sqlite3_bind_text", "number", ["number", "number", "number", "number", "number"]), pr = a("sqlite3_bind_blob", "number", ["number", "number", "number", "number", "number"]), rn = a("sqlite3_bind_double", "number", ["number", "number", "number"]), nn = a("sqlite3_bind_int", "number", [
          "number",
          "number",
          "number"
        ]), on = a("sqlite3_bind_parameter_index", "number", ["number", "string"]), sn = a("sqlite3_step", "number", ["number"]), un = a("sqlite3_errmsg", "string", ["number"]), an = a("sqlite3_column_count", "number", ["number"]), ln = a("sqlite3_data_count", "number", ["number"]), fn = a("sqlite3_column_double", "number", ["number", "number"]), br = a("sqlite3_column_text", "string", ["number", "number"]), hn = a("sqlite3_column_blob", "number", ["number", "number"]), cn = a("sqlite3_column_bytes", "number", ["number", "number"]), dn = a(
          "sqlite3_column_type",
          "number",
          ["number", "number"]
        ), mn = a("sqlite3_column_name", "string", ["number", "number"]), pn = a("sqlite3_reset", "number", ["number"]), bn = a("sqlite3_clear_bindings", "number", ["number"]), wn = a("sqlite3_finalize", "number", ["number"]), wr = a("sqlite3_create_function_v2", "number", "number string number number number number number number number".split(" ")), yn = a("sqlite3_value_type", "number", ["number"]), vn = a("sqlite3_value_bytes", "number", ["number"]), _n = a("sqlite3_value_text", "string", ["number"]), En = a(
          "sqlite3_value_blob",
          "number",
          ["number"]
        ), gn = a("sqlite3_value_double", "number", ["number"]), Tn = a("sqlite3_result_double", "", ["number", "number"]), yr = a("sqlite3_result_null", "", ["number"]), Nn = a("sqlite3_result_text", "", ["number", "string", "number", "number"]), An = a("sqlite3_result_blob", "", ["number", "number", "number", "number"]), On = a("sqlite3_result_int", "", ["number", "number"]), Qt = a("sqlite3_result_error", "", ["number", "string", "number"]), vr = a("sqlite3_aggregate_context", "number", ["number", "number"]), _r = a(
          "RegisterExtensionFunctions",
          "number",
          ["number"]
        ), Er = a("sqlite3_update_hook", "number", ["number", "number", "number"]);
        r.prototype.bind = function(o) {
          if (!this.Qa) throw "Statement closed";
          return this.reset(), Array.isArray(o) ? this.Gb(o) : o != null && typeof o == "object" ? this.Hb(o) : !0;
        }, r.prototype.step = function() {
          if (!this.Qa) throw "Statement closed";
          this.Oa = 1;
          var o = sn(this.Qa);
          switch (o) {
            case 100:
              return !0;
            case 101:
              return !1;
            default:
              throw this.db.handleError(o);
          }
        }, r.prototype.Ab = function(o) {
          return o == null && (o = this.Oa, this.Oa += 1), fn(this.Qa, o);
        }, r.prototype.Ob = function(o) {
          if (o == null && (o = this.Oa, this.Oa += 1), o = br(this.Qa, o), typeof BigInt != "function") throw Error("BigInt is not supported");
          return BigInt(o);
        }, r.prototype.Tb = function(o) {
          return o == null && (o = this.Oa, this.Oa += 1), br(this.Qa, o);
        }, r.prototype.getBlob = function(o) {
          o == null && (o = this.Oa, this.Oa += 1);
          var l = cn(this.Qa, o);
          o = hn(this.Qa, o);
          for (var m = new Uint8Array(l), p = 0; p < l; p += 1) m[p] = D[o + p];
          return m;
        }, r.prototype.get = function(o, l) {
          l = l || {}, o != null && this.bind(o) && this.step(), o = [];
          for (var m = ln(this.Qa), p = 0; p < m; p += 1) switch (dn(this.Qa, p)) {
            case 1:
              var _ = l.useBigInt ? this.Ob(p) : this.Ab(p);
              o.push(_);
              break;
            case 2:
              o.push(this.Ab(p));
              break;
            case 3:
              o.push(this.Tb(p));
              break;
            case 4:
              o.push(this.getBlob(p));
              break;
            default:
              o.push(null);
          }
          return o;
        }, r.prototype.qb = function() {
          for (var o = [], l = an(this.Qa), m = 0; m < l; m += 1) o.push(mn(this.Qa, m));
          return o;
        }, r.prototype.zb = function(o, l) {
          o = this.get(o, l), l = this.qb();
          for (var m = {}, p = 0; p < l.length; p += 1) m[l[p]] = o[p];
          return m;
        }, r.prototype.Sb = function() {
          return dr(this.Qa);
        }, r.prototype.Pb = function() {
          return tn(this.Qa);
        }, r.prototype.run = function(o) {
          return o != null && this.bind(o), this.step(), this.reset();
        }, r.prototype.wb = function(o, l) {
          l == null && (l = this.Oa, this.Oa += 1), o = Vt(o), this.mb.push(o), this.db.handleError(en(this.Qa, l, o, -1, 0));
        }, r.prototype.Fb = function(o, l) {
          l == null && (l = this.Oa, this.Oa += 1);
          var m = Wt(o.length);
          D.set(o, m), this.mb.push(m), this.db.handleError(pr(this.Qa, l, m, o.length, 0));
        }, r.prototype.vb = function(o, l) {
          l == null && (l = this.Oa, this.Oa += 1), this.db.handleError((o === (o | 0) ? nn : rn)(
            this.Qa,
            l,
            o
          ));
        }, r.prototype.Ib = function(o) {
          o == null && (o = this.Oa, this.Oa += 1), pr(this.Qa, o, 0, 0, 0);
        }, r.prototype.xb = function(o, l) {
          switch (l == null && (l = this.Oa, this.Oa += 1), typeof o) {
            case "string":
              this.wb(o, l);
              return;
            case "number":
              this.vb(o, l);
              return;
            case "bigint":
              this.wb(o.toString(), l);
              return;
            case "boolean":
              this.vb(o + 0, l);
              return;
            case "object":
              if (o === null) {
                this.Ib(l);
                return;
              }
              if (o.length != null) {
                this.Fb(o, l);
                return;
              }
          }
          throw "Wrong API use : tried to bind a value of an unknown type (" + o + ").";
        }, r.prototype.Hb = function(o) {
          var l = this;
          return Object.keys(o).forEach(function(m) {
            var p = on(l.Qa, m);
            p !== 0 && l.xb(o[m], p);
          }), !0;
        }, r.prototype.Gb = function(o) {
          for (var l = 0; l < o.length; l += 1) this.xb(o[l], l + 1);
          return !0;
        }, r.prototype.reset = function() {
          return this.freemem(), bn(this.Qa) === 0 && pn(this.Qa) === 0;
        }, r.prototype.freemem = function() {
          for (var o; (o = this.mb.pop()) !== void 0; ) gt(o);
        }, r.prototype.Ya = function() {
          this.freemem();
          var o = wn(this.Qa) === 0;
          return delete this.db.gb[this.Qa], this.Qa = 0, o;
        }, n.prototype.next = function() {
          if (this.fb === null) return { done: !0 };
          if (this.$a !== null && (this.$a.Ya(), this.$a = null), !this.db.db) throw this.ob(), Error("Database closed");
          var o = zt(), l = nt(4);
          yt(s), yt(l);
          try {
            this.db.handleError(mr(this.db.db, this.lb, -1, s, l)), this.lb = z(l, "i32");
            var m = z(s, "i32");
            return m === 0 ? (this.ob(), { done: !0 }) : (this.$a = new r(m, this.db), this.db.gb[m] = this.$a, { value: this.$a, done: !1 });
          } catch (p) {
            throw this.sb = S(this.lb), this.ob(), p;
          } finally {
            Xt(o);
          }
        }, n.prototype.ob = function() {
          gt(this.fb), this.fb = null;
        }, n.prototype.Qb = function() {
          return this.sb !== null ? this.sb : S(this.lb);
        }, typeof Symbol == "function" && typeof Symbol.iterator == "symbol" && (n.prototype[Symbol.iterator] = function() {
          return this;
        }), i.prototype.run = function(o, l) {
          if (!this.db) throw "Database closed";
          if (l) {
            o = this.tb(o, l);
            try {
              o.step();
            } finally {
              o.Ya();
            }
          } else this.handleError(v(this.db, o, 0, 0, s));
          return this;
        }, i.prototype.exec = function(o, l, m) {
          if (!this.db) throw "Database closed";
          var p = null, _ = null, T = null;
          try {
            T = _ = Vt(o);
            var C = nt(4);
            for (o = []; z(T, "i8") !== 0; ) {
              yt(s), yt(C), this.handleError(mr(this.db, T, -1, s, C));
              var F = z(
                s,
                "i32"
              );
              if (T = z(C, "i32"), F !== 0) {
                var P = null;
                for (p = new r(F, this), l != null && p.bind(l); p.step(); ) P === null && (P = { columns: p.qb(), values: [] }, o.push(P)), P.values.push(p.get(null, m));
                p.Ya();
              }
            }
            return o;
          } catch (j) {
            throw p && p.Ya(), j;
          } finally {
            _ && gt(_);
          }
        }, i.prototype.Mb = function(o, l, m, p, _) {
          typeof l == "function" && (p = m, m = l, l = void 0), o = this.tb(o, l);
          try {
            for (; o.step(); ) m(o.zb(null, _));
          } finally {
            o.Ya();
          }
          if (typeof p == "function") return p();
        }, i.prototype.tb = function(o, l) {
          if (yt(s), this.handleError(L(this.db, o, -1, s, 0)), o = z(s, "i32"), o === 0) throw "Nothing to prepare";
          var m = new r(o, this);
          return l != null && m.bind(l), this.gb[o] = m;
        }, i.prototype.Ub = function(o) {
          return new n(o, this);
        }, i.prototype.Nb = function() {
          Object.values(this.gb).forEach(function(l) {
            l.Ya();
          }), Object.values(this.Sa).forEach(G), this.Sa = {}, this.handleError(g(this.db));
          var o = Qr(this.filename);
          return this.handleError(w(this.filename, s)), this.db = z(s, "i32"), _r(this.db), o;
        }, i.prototype.close = function() {
          this.db !== null && (Object.values(this.gb).forEach(function(o) {
            o.Ya();
          }), Object.values(this.Sa).forEach(G), this.Sa = {}, this.Za && (G(this.Za), this.Za = void 0), this.handleError(g(this.db)), He("/" + this.filename), this.db = null);
        }, i.prototype.handleError = function(o) {
          if (o === 0) return null;
          throw o = un(this.db), Error(o);
        }, i.prototype.Rb = function() {
          return O(this.db);
        }, i.prototype.Kb = function(o, l) {
          Object.prototype.hasOwnProperty.call(this.Sa, o) && (G(this.Sa[o]), delete this.Sa[o]);
          var m = Et(function(p, _, T) {
            _ = e(_, T);
            try {
              var C = l.apply(null, _);
            } catch (F) {
              Qt(p, F, -1);
              return;
            }
            t(p, C);
          }, "viii");
          return this.Sa[o] = m, this.handleError(wr(
            this.db,
            o,
            l.length,
            1,
            0,
            m,
            0,
            0,
            0
          )), this;
        }, i.prototype.Jb = function(o, l) {
          var m = l.init || function() {
            return null;
          }, p = l.finalize || function(P) {
            return P;
          }, _ = l.step;
          if (!_) throw "An aggregate function must have a step function in " + o;
          var T = {};
          Object.hasOwnProperty.call(this.Sa, o) && (G(this.Sa[o]), delete this.Sa[o]), l = o + "__finalize", Object.hasOwnProperty.call(this.Sa, l) && (G(this.Sa[l]), delete this.Sa[l]);
          var C = Et(function(P, j, Ne) {
            var it = vr(P, 1);
            Object.hasOwnProperty.call(T, it) || (T[it] = m()), j = e(j, Ne), j = [T[it]].concat(j);
            try {
              T[it] = _.apply(null, j);
            } catch (Rn) {
              delete T[it], Qt(P, Rn, -1);
            }
          }, "viii"), F = Et(function(P) {
            var j = vr(P, 1);
            try {
              var Ne = p(T[j]);
            } catch (it) {
              delete T[j], Qt(P, it, -1);
              return;
            }
            t(P, Ne), delete T[j];
          }, "vi");
          return this.Sa[o] = C, this.Sa[l] = F, this.handleError(wr(this.db, o, _.length - 1, 1, 0, 0, C, F, 0)), this;
        }, i.prototype.Zb = function(o) {
          return this.Za && (Er(this.db, 0, 0), G(this.Za), this.Za = void 0), o ? (this.Za = Et(function(l, m, p, _, T) {
            switch (m) {
              case 18:
                l = "insert";
                break;
              case 23:
                l = "update";
                break;
              case 9:
                l = "delete";
                break;
              default:
                throw "unknown operationCode in updateHook callback: " + m;
            }
            if (p = S(p), _ = S(_), T > Number.MAX_SAFE_INTEGER) throw "rowId too big to fit inside a Number";
            o(l, p, _, Number(T));
          }, "viiiij"), Er(this.db, this.Za, 0), this) : this;
        }, r.prototype.bind = r.prototype.bind, r.prototype.step = r.prototype.step, r.prototype.get = r.prototype.get, r.prototype.getColumnNames = r.prototype.qb, r.prototype.getAsObject = r.prototype.zb, r.prototype.getSQL = r.prototype.Sb, r.prototype.getNormalizedSQL = r.prototype.Pb, r.prototype.run = r.prototype.run, r.prototype.reset = r.prototype.reset, r.prototype.freemem = r.prototype.freemem, r.prototype.free = r.prototype.Ya, n.prototype.next = n.prototype.next, n.prototype.getRemainingSQL = n.prototype.Qb, i.prototype.run = i.prototype.run, i.prototype.exec = i.prototype.exec, i.prototype.each = i.prototype.Mb, i.prototype.prepare = i.prototype.tb, i.prototype.iterateStatements = i.prototype.Ub, i.prototype.export = i.prototype.Nb, i.prototype.close = i.prototype.close, i.prototype.handleError = i.prototype.handleError, i.prototype.getRowsModified = i.prototype.Rb, i.prototype.create_function = i.prototype.Kb, i.prototype.create_aggregate = i.prototype.Jb, i.prototype.updateHook = i.prototype.Zb, u.Database = i;
      };
      var Jt = "./this.program", Rt = (t, e) => {
        throw e;
      }, Kt = (cr = (hr = globalThis.document) == null ? void 0 : hr.currentScript) == null ? void 0 : cr.src;
      typeof __filename < "u" ? Kt = __filename : Zt && (Kt = self.location.href);
      var St = "", te, Dt;
      if (Ot) {
        var ee = In;
        St = __dirname + "/", Dt = (t) => (t = It(t) ? new URL(t) : t, ee.readFileSync(t)), te = async (t) => (t = It(t) ? new URL(t) : t, ee.readFileSync(t, void 0)), 1 < process.argv.length && (Jt = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2), d.exports = u, Rt = (t, e) => {
          throw process.exitCode = t, e;
        };
      } else if (Ir || Zt) {
        try {
          St = new URL(".", Kt).href;
        } catch {
        }
        Zt && (Dt = (t) => {
          var e = new XMLHttpRequest();
          return e.open("GET", t, !1), e.responseType = "arraybuffer", e.send(null), new Uint8Array(e.response);
        }), te = async (t) => {
          if (It(t)) return new Promise((r, n) => {
            var i = new XMLHttpRequest();
            i.open("GET", t, !0), i.responseType = "arraybuffer", i.onload = () => {
              i.status == 200 || i.status == 0 && i.response ? r(i.response) : n(i.status);
            }, i.onerror = n, i.send(null);
          });
          var e = await fetch(t, { credentials: "same-origin" });
          if (e.ok) return e.arrayBuffer();
          throw Error(e.status + " : " + e.url);
        };
      }
      var re = console.log.bind(console), J = console.error.bind(console), mt, Lt = !1, ne, It = (t) => t.startsWith("file://"), D, M, pt, R, N, ie, oe, B;
      function De() {
        var t = $t.buffer;
        D = new Int8Array(t), pt = new Int16Array(t), M = new Uint8Array(t), R = new Int32Array(t), N = new Uint32Array(t), ie = new Float32Array(t), oe = new Float64Array(t), B = new BigInt64Array(t), new BigUint64Array(t);
      }
      function bt(t) {
        var e;
        throw (e = u.onAbort) == null || e.call(u, t), t = "Aborted(" + t + ")", J(t), Lt = !0, new WebAssembly.RuntimeError(t + ". Build with -sASSERTIONS for more info.");
      }
      var se;
      async function kr(t) {
        if (!mt) try {
          var e = await te(t);
          return new Uint8Array(e);
        } catch {
        }
        if (t == se && mt) t = new Uint8Array(mt);
        else if (Dt) t = Dt(t);
        else throw "both async and sync fetching of the wasm failed";
        return t;
      }
      async function Mr(t, e) {
        try {
          var r = await kr(t);
          return await WebAssembly.instantiate(r, e);
        } catch (n) {
          J(`failed to asynchronously prepare wasm: ${n}`), bt(n);
        }
      }
      async function qr(t) {
        var e = se;
        if (!mt && !It(e) && !Ot) try {
          var r = fetch(e, { credentials: "same-origin" });
          return await WebAssembly.instantiateStreaming(r, t);
        } catch (n) {
          J(`wasm streaming compile failed: ${n}`), J("falling back to ArrayBuffer instantiation");
        }
        return Mr(e, t);
      }
      class ue {
        constructor(e) {
          Z(this, "name", "ExitStatus");
          this.message = `Program terminated with exit(${e})`, this.status = e;
        }
      }
      var Le = (t) => {
        for (; 0 < t.length; ) t.shift()(u);
      }, Ie = [], ke = [], Ur = () => {
        var t = u.preRun.shift();
        ke.push(t);
      }, K = 0, wt = null;
      function z(t, e = "i8") {
        switch (e.endsWith("*") && (e = "*"), e) {
          case "i1":
            return D[t];
          case "i8":
            return D[t];
          case "i16":
            return pt[t >> 1];
          case "i32":
            return R[t >> 2];
          case "i64":
            return B[t >> 3];
          case "float":
            return ie[t >> 2];
          case "double":
            return oe[t >> 3];
          case "*":
            return N[t >> 2];
          default:
            bt(`invalid type for getValue: ${e}`);
        }
      }
      var kt = !0;
      function yt(t) {
        var e = "i32";
        switch (e.endsWith("*") && (e = "*"), e) {
          case "i1":
            D[t] = 0;
            break;
          case "i8":
            D[t] = 0;
            break;
          case "i16":
            pt[t >> 1] = 0;
            break;
          case "i32":
            R[t >> 2] = 0;
            break;
          case "i64":
            B[t >> 3] = BigInt(0);
            break;
          case "float":
            ie[t >> 2] = 0;
            break;
          case "double":
            oe[t >> 3] = 0;
            break;
          case "*":
            N[t >> 2] = 0;
            break;
          default:
            bt(`invalid type for setValue: ${e}`);
        }
      }
      var Me = new TextDecoder(), qe = (t, e, r, n) => {
        if (r = e + r, n) return r;
        for (; t[e] && !(e >= r); ) ++e;
        return e;
      }, S = (t, e, r) => t ? Me.decode(M.subarray(t, qe(M, t, e, r))) : "", Ue = (t, e) => {
        for (var r = 0, n = t.length - 1; 0 <= n; n--) {
          var i = t[n];
          i === "." ? t.splice(n, 1) : i === ".." ? (t.splice(n, 1), r++) : r && (t.splice(n, 1), r--);
        }
        if (e) for (; r; r--) t.unshift("..");
        return t;
      }, ae = (t) => {
        var e = t.charAt(0) === "/", r = t.slice(-1) === "/";
        return (t = Ue(t.split("/").filter((n) => !!n), !e).join("/")) || e || (t = "."), t && r && (t += "/"), (e ? "/" : "") + t;
      }, Pe = (t) => {
        var e = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(t).slice(1);
        return t = e[0], e = e[1], !t && !e ? "." : (e && (e = e.slice(0, -1)), t + e);
      }, Mt = (t) => t && t.match(/([^\/]+|\/)\/*$/)[1], Pr = () => {
        if (Ot) {
          var t = kn;
          return (e) => t.randomFillSync(e);
        }
        return (e) => crypto.getRandomValues(e);
      }, xe = (t) => {
        (xe = Pr())(t);
      }, xr = (...t) => {
        for (var e = "", r = !1, n = t.length - 1; -1 <= n && !r; n--) {
          if (r = 0 <= n ? t[n] : "/", typeof r != "string") throw new TypeError("Arguments to path.resolve must be strings");
          if (!r) return "";
          e = r + "/" + e, r = r.charAt(0) === "/";
        }
        return e = Ue(e.split("/").filter((i) => !!i), !r).join("/"), (r ? "/" : "") + e || ".";
      }, qt = (t) => {
        var e = qe(t, 0);
        return Me.decode(t.buffer ? t.subarray(0, e) : new Uint8Array(t.slice(0, e)));
      }, le = [], ut = (t) => {
        for (var e = 0, r = 0; r < t.length; ++r) {
          var n = t.charCodeAt(r);
          127 >= n ? e++ : 2047 >= n ? e += 2 : 55296 <= n && 57343 >= n ? (e += 4, ++r) : e += 3;
        }
        return e;
      }, W = (t, e, r, n) => {
        if (!(0 < n)) return 0;
        var i = r;
        n = r + n - 1;
        for (var s = 0; s < t.length; ++s) {
          var a = t.codePointAt(s);
          if (127 >= a) {
            if (r >= n) break;
            e[r++] = a;
          } else if (2047 >= a) {
            if (r + 1 >= n) break;
            e[r++] = 192 | a >> 6, e[r++] = 128 | a & 63;
          } else if (65535 >= a) {
            if (r + 2 >= n) break;
            e[r++] = 224 | a >> 12, e[r++] = 128 | a >> 6 & 63, e[r++] = 128 | a & 63;
          } else {
            if (r + 3 >= n) break;
            e[r++] = 240 | a >> 18, e[r++] = 128 | a >> 12 & 63, e[r++] = 128 | a >> 6 & 63, e[r++] = 128 | a & 63, s++;
          }
        }
        return e[r] = 0, r - i;
      }, Fe = [];
      function Be(t, e) {
        Fe[t] = { input: [], output: [], eb: e }, pe(t, Fr);
      }
      var Fr = { open(t) {
        var e = Fe[t.node.rdev];
        if (!e) throw new c(43);
        t.tty = e, t.seekable = !1;
      }, close(t) {
        t.tty.eb.fsync(t.tty);
      }, fsync(t) {
        t.tty.eb.fsync(t.tty);
      }, read(t, e, r, n) {
        if (!t.tty || !t.tty.eb.Bb) throw new c(60);
        for (var i = 0, s = 0; s < n; s++) {
          try {
            var a = t.tty.eb.Bb(t.tty);
          } catch {
            throw new c(29);
          }
          if (a === void 0 && i === 0) throw new c(6);
          if (a == null) break;
          i++, e[r + s] = a;
        }
        return i && (t.node.atime = Date.now()), i;
      }, write(t, e, r, n) {
        if (!t.tty || !t.tty.eb.ub) throw new c(60);
        try {
          for (var i = 0; i < n; i++) t.tty.eb.ub(t.tty, e[r + i]);
        } catch {
          throw new c(29);
        }
        return n && (t.node.mtime = t.node.ctime = Date.now()), i;
      } }, Br = { Bb() {
        var i;
        t: {
          if (!le.length) {
            var t = null;
            if (Ot) {
              var e = Buffer.alloc(256), r = 0, n = process.stdin.fd;
              try {
                r = ee.readSync(n, e, 0, 256);
              } catch (s) {
                if (s.toString().includes("EOF")) r = 0;
                else throw s;
              }
              0 < r && (t = e.slice(0, r).toString("utf-8"));
            } else (i = globalThis.window) != null && i.prompt && (t = window.prompt("Input: "), t !== null && (t += `
`));
            if (!t) {
              t = null;
              break t;
            }
            e = Array(ut(t) + 1), t = W(t, e, 0, e.length), e.length = t, le = e;
          }
          t = le.shift();
        }
        return t;
      }, ub(t, e) {
        e === null || e === 10 ? (re(qt(t.output)), t.output = []) : e != 0 && t.output.push(e);
      }, fsync(t) {
        var e;
        0 < ((e = t.output) == null ? void 0 : e.length) && (re(qt(t.output)), t.output = []);
      }, hc() {
        return { bc: 25856, dc: 5, ac: 191, cc: 35387, $b: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
      }, ic() {
        return 0;
      }, jc() {
        return [24, 80];
      } }, Cr = { ub(t, e) {
        e === null || e === 10 ? (J(qt(t.output)), t.output = []) : e != 0 && t.output.push(e);
      }, fsync(t) {
        var e;
        0 < ((e = t.output) == null ? void 0 : e.length) && (J(qt(t.output)), t.output = []);
      } }, y = { Wa: null, Xa() {
        return y.createNode(null, "/", 16895, 0);
      }, createNode(t, e, r, n) {
        if ((r & 61440) === 24576 || (r & 61440) === 4096) throw new c(63);
        return y.Wa || (y.Wa = { dir: { node: { Ta: y.La.Ta, Ua: y.La.Ua, lookup: y.La.lookup, ib: y.La.ib, rename: y.La.rename, unlink: y.La.unlink, rmdir: y.La.rmdir, readdir: y.La.readdir, symlink: y.La.symlink }, stream: { Va: y.Ma.Va } }, file: { node: { Ta: y.La.Ta, Ua: y.La.Ua }, stream: { Va: y.Ma.Va, read: y.Ma.read, write: y.Ma.write, jb: y.Ma.jb, kb: y.Ma.kb } }, link: { node: { Ta: y.La.Ta, Ua: y.La.Ua, readlink: y.La.readlink }, stream: {} }, yb: { node: { Ta: y.La.Ta, Ua: y.La.Ua }, stream: zr } }), r = Xe(t, e, r, n), U(r.mode) ? (r.La = y.Wa.dir.node, r.Ma = y.Wa.dir.stream, r.Na = {}) : (r.mode & 61440) === 32768 ? (r.La = y.Wa.file.node, r.Ma = y.Wa.file.stream, r.Ra = 0, r.Na = null) : (r.mode & 61440) === 40960 ? (r.La = y.Wa.link.node, r.Ma = y.Wa.link.stream) : (r.mode & 61440) === 8192 && (r.La = y.Wa.yb.node, r.Ma = y.Wa.yb.stream), r.atime = r.mtime = r.ctime = Date.now(), t && (t.Na[e] = r, t.atime = t.mtime = t.ctime = r.atime), r;
      }, fc(t) {
        return t.Na ? t.Na.subarray ? t.Na.subarray(0, t.Ra) : new Uint8Array(t.Na) : new Uint8Array(0);
      }, La: {
        Ta(t) {
          var e = {};
          return e.dev = (t.mode & 61440) === 8192 ? t.id : 1, e.ino = t.id, e.mode = t.mode, e.nlink = 1, e.uid = 0, e.gid = 0, e.rdev = t.rdev, U(t.mode) ? e.size = 4096 : (t.mode & 61440) === 32768 ? e.size = t.Ra : (t.mode & 61440) === 40960 ? e.size = t.link.length : e.size = 0, e.atime = new Date(t.atime), e.mtime = new Date(t.mtime), e.ctime = new Date(t.ctime), e.blksize = 4096, e.blocks = Math.ceil(e.size / e.blksize), e;
        },
        Ua(t, e) {
          for (var r of ["mode", "atime", "mtime", "ctime"]) e[r] != null && (t[r] = e[r]);
          e.size !== void 0 && (e = e.size, t.Ra != e && (e == 0 ? (t.Na = null, t.Ra = 0) : (r = t.Na, t.Na = new Uint8Array(e), r && t.Na.set(r.subarray(0, Math.min(e, t.Ra))), t.Ra = e)));
        },
        lookup() {
          throw y.nb || (y.nb = new c(44), y.nb.stack = "<generic error, no stack>"), y.nb;
        },
        ib(t, e, r, n) {
          return y.createNode(t, e, r, n);
        },
        rename(t, e, r) {
          try {
            var n = tt(e, r);
          } catch {
          }
          if (n) {
            if (U(t.mode)) for (var i in n.Na) throw new c(55);
            de(n);
          }
          delete t.parent.Na[t.name], e.Na[r] = t, t.name = r, e.ctime = e.mtime = t.parent.ctime = t.parent.mtime = Date.now();
        },
        unlink(t, e) {
          delete t.Na[e], t.ctime = t.mtime = Date.now();
        },
        rmdir(t, e) {
          var r = tt(t, e), n;
          for (n in r.Na) throw new c(55);
          delete t.Na[e], t.ctime = t.mtime = Date.now();
        },
        readdir(t) {
          return [".", "..", ...Object.keys(t.Na)];
        },
        symlink(t, e, r) {
          return t = y.createNode(t, e, 41471, 0), t.link = r, t;
        },
        readlink(t) {
          if ((t.mode & 61440) !== 40960) throw new c(28);
          return t.link;
        }
      }, Ma: { read(t, e, r, n, i) {
        var s = t.node.Na;
        if (i >= t.node.Ra) return 0;
        if (t = Math.min(t.node.Ra - i, n), 8 < t && s.subarray) e.set(s.subarray(i, i + t), r);
        else for (n = 0; n < t; n++) e[r + n] = s[i + n];
        return t;
      }, write(t, e, r, n, i, s) {
        if (e.buffer === D.buffer && (s = !1), !n) return 0;
        if (t = t.node, t.mtime = t.ctime = Date.now(), e.subarray && (!t.Na || t.Na.subarray)) {
          if (s) return t.Na = e.subarray(r, r + n), t.Ra = n;
          if (t.Ra === 0 && i === 0) return t.Na = e.slice(r, r + n), t.Ra = n;
          if (i + n <= t.Ra) return t.Na.set(e.subarray(r, r + n), i), n;
        }
        s = i + n;
        var a = t.Na ? t.Na.length : 0;
        if (a >= s || (s = Math.max(s, a * (1048576 > a ? 2 : 1.125) >>> 0), a != 0 && (s = Math.max(s, 256)), a = t.Na, t.Na = new Uint8Array(s), 0 < t.Ra && t.Na.set(a.subarray(0, t.Ra), 0)), t.Na.subarray && e.subarray) t.Na.set(e.subarray(r, r + n), i);
        else for (s = 0; s < n; s++) t.Na[i + s] = e[r + s];
        return t.Ra = Math.max(t.Ra, i + n), n;
      }, Va(t, e, r) {
        if (r === 1 ? e += t.position : r === 2 && (t.node.mode & 61440) === 32768 && (e += t.node.Ra), 0 > e) throw new c(28);
        return e;
      }, jb(t, e, r, n, i) {
        if ((t.node.mode & 61440) !== 32768) throw new c(43);
        if (t = t.node.Na, i & 2 || !t || t.buffer !== D.buffer) {
          i = !0, n = 65536 * Math.ceil(e / 65536);
          var s = sr(65536, n);
          if (s && M.fill(0, s, s + n), n = s, !n) throw new c(48);
          t && ((0 < r || r + e < t.length) && (t.subarray ? t = t.subarray(r, r + e) : t = Array.prototype.slice.call(t, r, r + e)), D.set(t, n));
        } else i = !1, n = t.byteOffset;
        return { Xb: n, Eb: i };
      }, kb(t, e, r, n) {
        return y.Ma.write(t, e, 0, n, r, !1), 0;
      } } }, Ce = (t, e) => {
        var r = 0;
        return t && (r |= 365), e && (r |= 146), r;
      }, fe = null, je = {}, at = [], jr = 1, Q = null, Ve = !1, We = !0, c = class {
        constructor(t) {
          Z(this, "name", "ErrnoError");
          this.Pa = t;
        }
      }, Vr = class {
        constructor() {
          Z(this, "hb", {});
          Z(this, "node", null);
        }
        get flags() {
          return this.hb.flags;
        }
        set flags(t) {
          this.hb.flags = t;
        }
        get position() {
          return this.hb.position;
        }
        set position(t) {
          this.hb.position = t;
        }
      }, Wr = class {
        constructor(t, e, r, n) {
          Z(this, "La", {});
          Z(this, "Ma", {});
          Z(this, "bb", null);
          t || (t = this), this.parent = t, this.Xa = t.Xa, this.id = jr++, this.name = e, this.mode = r, this.rdev = n, this.atime = this.mtime = this.ctime = Date.now();
        }
        get read() {
          return (this.mode & 365) === 365;
        }
        set read(t) {
          t ? this.mode |= 365 : this.mode &= -366;
        }
        get write() {
          return (this.mode & 146) === 146;
        }
        set write(t) {
          t ? this.mode |= 146 : this.mode &= -147;
        }
      };
      function x(t, e = {}) {
        if (!t) throw new c(44);
        e.pb ?? (e.pb = !0), t.charAt(0) === "/" || (t = "//" + t);
        var r = 0;
        t: for (; 40 > r; r++) {
          t = t.split("/").filter((w) => !!w);
          for (var n = fe, i = "/", s = 0; s < t.length; s++) {
            var a = s === t.length - 1;
            if (a && e.parent) break;
            if (t[s] !== ".") if (t[s] === "..") if (i = Pe(i), n === n.parent) {
              t = i + "/" + t.slice(s + 1).join("/"), r--;
              continue t;
            } else n = n.parent;
            else {
              i = ae(i + "/" + t[s]);
              try {
                n = tt(n, t[s]);
              } catch (w) {
                if ((w == null ? void 0 : w.Pa) === 44 && a && e.Wb) return { path: i };
                throw w;
              }
              if (!n.bb || a && !e.pb || (n = n.bb.root), (n.mode & 61440) === 40960 && (!a || e.ab)) {
                if (!n.La.readlink) throw new c(52);
                n = n.La.readlink(n), n.charAt(0) === "/" || (n = Pe(i) + "/" + n), t = n + "/" + t.slice(s + 1).join("/");
                continue t;
              }
            }
          }
          return { path: i, node: n };
        }
        throw new c(32);
      }
      function he(t) {
        for (var e; ; ) {
          if (t === t.parent) return t = t.Xa.Db, e ? t[t.length - 1] !== "/" ? `${t}/${e}` : t + e : t;
          e = e ? `${t.name}/${e}` : t.name, t = t.parent;
        }
      }
      function ce(t, e) {
        for (var r = 0, n = 0; n < e.length; n++) r = (r << 5) - r + e.charCodeAt(n) | 0;
        return (t + r >>> 0) % Q.length;
      }
      function de(t) {
        var e = ce(t.parent.id, t.name);
        if (Q[e] === t) Q[e] = t.cb;
        else for (e = Q[e]; e; ) {
          if (e.cb === t) {
            e.cb = t.cb;
            break;
          }
          e = e.cb;
        }
      }
      function tt(t, e) {
        var r = U(t.mode) ? (r = lt(t, "x")) ? r : t.La.lookup ? 0 : 2 : 54;
        if (r) throw new c(r);
        for (r = Q[ce(t.id, e)]; r; r = r.cb) {
          var n = r.name;
          if (r.parent.id === t.id && n === e) return r;
        }
        return t.La.lookup(t, e);
      }
      function Xe(t, e, r, n) {
        return t = new Wr(t, e, r, n), e = ce(t.parent.id, t.name), t.cb = Q[e], Q[e] = t;
      }
      function U(t) {
        return (t & 61440) === 16384;
      }
      function lt(t, e) {
        return We ? 0 : e.includes("r") && !(t.mode & 292) || e.includes("w") && !(t.mode & 146) || e.includes("x") && !(t.mode & 73) ? 2 : 0;
      }
      function ze(t, e) {
        if (!U(t.mode)) return 54;
        try {
          return tt(t, e), 20;
        } catch {
        }
        return lt(t, "wx");
      }
      function $e(t, e, r) {
        try {
          var n = tt(t, e);
        } catch (i) {
          return i.Pa;
        }
        if (t = lt(t, "wx")) return t;
        if (r) {
          if (!U(n.mode)) return 54;
          if (n === n.parent || he(n) === "/") return 10;
        } else if (U(n.mode)) return 31;
        return 0;
      }
      function Ut(t) {
        if (!t) throw new c(63);
        return t;
      }
      function q(t) {
        if (t = at[t], !t) throw new c(8);
        return t;
      }
      function Qe(t, e = -1) {
        if (t = Object.assign(new Vr(), t), e == -1) t: {
          for (e = 0; 4096 >= e; e++) if (!at[e]) break t;
          throw new c(33);
        }
        return t.fd = e, at[e] = t;
      }
      function Xr(t, e = -1) {
        var r, n;
        return t = Qe(t, e), (n = (r = t.Ma) == null ? void 0 : r.ec) == null || n.call(r, t), t;
      }
      function me(t, e, r) {
        var n = t == null ? void 0 : t.Ma.Ua;
        t = n ? t : e, n ?? (n = e.La.Ua), Ut(n), n(t, r);
      }
      var zr = { open(t) {
        var e, r;
        t.Ma = je[t.node.rdev].Ma, (r = (e = t.Ma).open) == null || r.call(e, t);
      }, Va() {
        throw new c(70);
      } };
      function pe(t, e) {
        je[t] = { Ma: e };
      }
      function Ye(t, e) {
        var r = e === "/";
        if (r && fe) throw new c(10);
        if (!r && e) {
          var n = x(e, { pb: !1 });
          if (e = n.path, n = n.node, n.bb) throw new c(10);
          if (!U(n.mode)) throw new c(54);
        }
        e = { type: t, kc: {}, Db: e, Vb: [] }, t = t.Xa(e), t.Xa = e, e.root = t, r ? fe = t : n && (n.bb = e, n.Xa && n.Xa.Vb.push(e));
      }
      function Pt(t, e, r) {
        var n = x(t, { parent: !0 }).node;
        if (t = Mt(t), !t) throw new c(28);
        if (t === "." || t === "..") throw new c(20);
        var i = ze(n, t);
        if (i) throw new c(i);
        if (!n.La.ib) throw new c(63);
        return n.La.ib(n, t, e, r);
      }
      function $r(t, e = 438) {
        return Pt(t, e & 4095 | 32768, 0);
      }
      function X(t, e = 511) {
        return Pt(t, e & 1023 | 16384, 0);
      }
      function xt(t, e, r) {
        typeof r > "u" && (r = e, e = 438), Pt(t, e | 8192, r);
      }
      function be(t, e) {
        if (!xr(t)) throw new c(44);
        var r = x(e, { parent: !0 }).node;
        if (!r) throw new c(44);
        e = Mt(e);
        var n = ze(r, e);
        if (n) throw new c(n);
        if (!r.La.symlink) throw new c(63);
        r.La.symlink(r, e, t);
      }
      function Ge(t) {
        var e = x(t, { parent: !0 }).node;
        t = Mt(t);
        var r = tt(e, t), n = $e(e, t, !0);
        if (n) throw new c(n);
        if (!e.La.rmdir) throw new c(63);
        if (r.bb) throw new c(10);
        e.La.rmdir(e, t), de(r);
      }
      function He(t) {
        var e = x(t, { parent: !0 }).node;
        if (!e) throw new c(44);
        t = Mt(t);
        var r = tt(e, t), n = $e(e, t, !1);
        if (n) throw new c(n);
        if (!e.La.unlink) throw new c(63);
        if (r.bb) throw new c(10);
        e.La.unlink(e, t), de(r);
      }
      function vt(t, e) {
        return t = x(t, { ab: !e }).node, Ut(t.La.Ta)(t);
      }
      function Ze(t, e, r, n) {
        me(t, e, { mode: r & 4095 | e.mode & -4096, ctime: Date.now(), Lb: n });
      }
      function Ft(t, e) {
        t = typeof t == "string" ? x(t, { ab: !0 }).node : t, Ze(null, t, e);
      }
      function Je(t, e, r) {
        if (U(e.mode)) throw new c(31);
        if ((e.mode & 61440) !== 32768) throw new c(28);
        var n = lt(e, "w");
        if (n) throw new c(n);
        me(t, e, { size: r, timestamp: Date.now() });
      }
      function ft(t, e, r = 438) {
        if (t === "") throw new c(44);
        if (typeof e == "string") {
          var n = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }[e];
          if (typeof n > "u") throw Error(`Unknown file open mode: ${e}`);
          e = n;
        }
        if (r = e & 64 ? r & 4095 | 32768 : 0, typeof t == "object") n = t;
        else {
          var i = t.endsWith("/"), s = x(t, { ab: !(e & 131072), Wb: !0 });
          n = s.node, t = s.path;
        }
        if (s = !1, e & 64) if (n) {
          if (e & 128) throw new c(20);
        } else {
          if (i) throw new c(31);
          n = Pt(t, r | 511, 0), s = !0;
        }
        if (!n) throw new c(44);
        if ((n.mode & 61440) === 8192 && (e &= -513), e & 65536 && !U(n.mode)) throw new c(54);
        if (!s && (n ? (n.mode & 61440) === 40960 ? i = 32 : (i = ["r", "w", "rw"][e & 3], e & 512 && (i += "w"), i = U(n.mode) && (i !== "r" || e & 576) ? 31 : lt(n, i)) : i = 44, i)) throw new c(i);
        return e & 512 && !s && (i = n, i = typeof i == "string" ? x(i, { ab: !0 }).node : i, Je(null, i, 0)), e = Qe({ node: n, path: he(n), flags: e & -131713, seekable: !0, position: 0, Ma: n.Ma, Yb: [], error: !1 }), e.Ma.open && e.Ma.open(e), s && Ft(n, r & 511), e;
      }
      function we(t) {
        if (t.fd === null) throw new c(8);
        t.rb && (t.rb = null);
        try {
          t.Ma.close && t.Ma.close(t);
        } catch (e) {
          throw e;
        } finally {
          at[t.fd] = null;
        }
        t.fd = null;
      }
      function Ke(t, e, r) {
        if (t.fd === null) throw new c(8);
        if (!t.seekable || !t.Ma.Va) throw new c(70);
        if (r != 0 && r != 1 && r != 2) throw new c(28);
        t.position = t.Ma.Va(t, e, r), t.Yb = [];
      }
      function tr(t, e, r, n, i) {
        if (0 > n || 0 > i) throw new c(28);
        if (t.fd === null) throw new c(8);
        if ((t.flags & 2097155) === 1) throw new c(8);
        if (U(t.node.mode)) throw new c(31);
        if (!t.Ma.read) throw new c(28);
        var s = typeof i < "u";
        if (!s) i = t.position;
        else if (!t.seekable) throw new c(70);
        return e = t.Ma.read(t, e, r, n, i), s || (t.position += e), e;
      }
      function er(t, e, r, n, i) {
        if (0 > n || 0 > i) throw new c(28);
        if (t.fd === null) throw new c(8);
        if (!(t.flags & 2097155)) throw new c(8);
        if (U(t.node.mode)) throw new c(31);
        if (!t.Ma.write) throw new c(28);
        t.seekable && t.flags & 1024 && Ke(t, 0, 2);
        var s = typeof i < "u";
        if (!s) i = t.position;
        else if (!t.seekable) throw new c(70);
        return e = t.Ma.write(t, e, r, n, i, void 0), s || (t.position += e), e;
      }
      function Qr(t) {
        var e = e || 0;
        e = ft(t, e), t = vt(t).size;
        var r = new Uint8Array(t);
        return tr(e, r, 0, t, 0), we(e), r;
      }
      function Y(t, e, r) {
        t = ae("/dev/" + t);
        var n = Ce(!!e, !!r);
        Y.Cb ?? (Y.Cb = 64);
        var i = Y.Cb++ << 8 | 0;
        pe(i, { open(s) {
          s.seekable = !1;
        }, close() {
          var s;
          (s = r == null ? void 0 : r.buffer) != null && s.length && r(10);
        }, read(s, a, w, g) {
          for (var v = 0, O = 0; O < g; O++) {
            try {
              var L = e();
            } catch {
              throw new c(29);
            }
            if (L === void 0 && v === 0) throw new c(6);
            if (L == null) break;
            v++, a[w + O] = L;
          }
          return v && (s.node.atime = Date.now()), v;
        }, write(s, a, w, g) {
          for (var v = 0; v < g; v++) try {
            r(a[w + v]);
          } catch {
            throw new c(29);
          }
          return g && (s.node.mtime = s.node.ctime = Date.now()), v;
        } }), xt(t, n, i);
      }
      var A = {};
      function et(t, e, r) {
        if (e.charAt(0) === "/") return e;
        if (t = t === -100 ? "/" : q(t).path, e.length == 0) {
          if (!r) throw new c(44);
          return t;
        }
        return t + "/" + e;
      }
      function Bt(t, e) {
        N[t >> 2] = e.dev, N[t + 4 >> 2] = e.mode, N[t + 8 >> 2] = e.nlink, N[t + 12 >> 2] = e.uid, N[t + 16 >> 2] = e.gid, N[t + 20 >> 2] = e.rdev, B[t + 24 >> 3] = BigInt(e.size), R[t + 32 >> 2] = 4096, R[t + 36 >> 2] = e.blocks;
        var r = e.atime.getTime(), n = e.mtime.getTime(), i = e.ctime.getTime();
        return B[t + 40 >> 3] = BigInt(Math.floor(r / 1e3)), N[t + 48 >> 2] = r % 1e3 * 1e6, B[t + 56 >> 3] = BigInt(Math.floor(n / 1e3)), N[t + 64 >> 2] = n % 1e3 * 1e6, B[t + 72 >> 3] = BigInt(Math.floor(i / 1e3)), N[t + 80 >> 2] = i % 1e3 * 1e6, B[t + 88 >> 3] = BigInt(e.ino), 0;
      }
      var Ct = void 0, jt = () => {
        var t = R[+Ct >> 2];
        return Ct += 4, t;
      }, ye = 0, Yr = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Gr = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], _t = {}, rr = (t) => {
        var e;
        ne = t, kt || 0 < ye || ((e = u.onExit) == null || e.call(u, t), Lt = !0), Rt(t, new ue(t));
      }, Hr = (t) => {
        if (!Lt) try {
          t();
        } catch (e) {
          e instanceof ue || e == "unwind" || Rt(1, e);
        } finally {
          if (!(kt || 0 < ye)) try {
            ne = t = ne, rr(t);
          } catch (e) {
            e instanceof ue || e == "unwind" || Rt(1, e);
          }
        }
      }, ve = {}, nr = () => {
        var n;
        if (!_e) {
          var t = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (((n = globalThis.navigator) == null ? void 0 : n.language) ?? "C").replace("-", "_") + ".UTF-8", _: Jt || "./this.program" }, e;
          for (e in ve) ve[e] === void 0 ? delete t[e] : t[e] = ve[e];
          var r = [];
          for (e in t) r.push(`${e}=${t[e]}`);
          _e = r;
        }
        return _e;
      }, _e, Zr = (t, e, r, n) => {
        var i = { string: (v) => {
          var O = 0;
          if (v != null && v !== 0) {
            O = ut(v) + 1;
            var L = nt(O);
            W(v, M, L, O), O = L;
          }
          return O;
        }, array: (v) => {
          var O = nt(v.length);
          return D.set(v, O), O;
        } };
        t = u["_" + t];
        var s = [], a = 0;
        if (n) for (var w = 0; w < n.length; w++) {
          var g = i[r[w]];
          g ? (a === 0 && (a = zt()), s[w] = g(n[w])) : s[w] = n[w];
        }
        return r = t(...s), r = function(v) {
          return a !== 0 && Xt(a), e === "string" ? S(v) : e === "boolean" ? !!v : v;
        }(r);
      }, Vt = (t) => {
        var e = ut(t) + 1, r = Wt(e);
        return r && W(t, M, r, e), r;
      }, rt, Ee = [], G = (t) => {
        rt.delete(H.get(t)), H.set(t, null), Ee.push(t);
      }, ir = (t) => {
        const e = t.length;
        return [e % 128 | 128, e >> 7, ...t];
      }, Jr = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 }, or = (t) => ir(Array.from(t, (e) => Jr[e])), Et = (t, e) => {
        if (!rt) {
          rt = /* @__PURE__ */ new WeakMap();
          var r = H.length;
          if (rt) for (var n = 0; n < 0 + r; n++) {
            var i = H.get(n);
            i && rt.set(i, n);
          }
        }
        if (r = rt.get(t) || 0) return r;
        r = Ee.length ? Ee.pop() : H.grow(1);
        try {
          H.set(r, t);
        } catch (s) {
          if (!(s instanceof TypeError)) throw s;
          e = Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0, 1, ...ir([1, 96, ...or(e.slice(1)), ...or(e[0] === "v" ? "" : e[0])]), 2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0), e = new WebAssembly.Module(e), e = new WebAssembly.Instance(e, { e: { f: t } }).exports.f, H.set(r, e);
        }
        return rt.set(t, r), r;
      };
      if (Q = Array(4096), Ye(y, "/"), X("/tmp"), X("/home"), X("/home/web_user"), function() {
        X("/dev"), pe(259, { read: () => 0, write: (n, i, s, a) => a, Va: () => 0 }), xt("/dev/null", 259), Be(1280, Br), Be(1536, Cr), xt("/dev/tty", 1280), xt("/dev/tty1", 1536);
        var t = new Uint8Array(1024), e = 0, r = () => (e === 0 && (xe(t), e = t.byteLength), t[--e]);
        Y("random", r), Y("urandom", r), X("/dev/shm"), X("/dev/shm/tmp");
      }(), function() {
        X("/proc");
        var t = X("/proc/self");
        X("/proc/self/fd"), Ye({ Xa() {
          var e = Xe(t, "fd", 16895, 73);
          return e.Ma = { Va: y.Ma.Va }, e.La = { lookup(r, n) {
            r = +n;
            var i = q(r);
            return r = { parent: null, Xa: { Db: "fake" }, La: { readlink: () => i.path }, id: r + 1 }, r.parent = r;
          }, readdir() {
            return Array.from(at.entries()).filter(([, r]) => r).map(([r]) => r.toString());
          } }, e;
        } }, "/proc/self/fd");
      }(), u.noExitRuntime && (kt = u.noExitRuntime), u.print && (re = u.print), u.printErr && (J = u.printErr), u.wasmBinary && (mt = u.wasmBinary), u.thisProgram && (Jt = u.thisProgram), u.preInit) for (typeof u.preInit == "function" && (u.preInit = [u.preInit]); 0 < u.preInit.length; ) u.preInit.shift()();
      u.stackSave = () => zt(), u.stackRestore = (t) => Xt(t), u.stackAlloc = (t) => nt(t), u.cwrap = (t, e, r, n) => {
        var i = !r || r.every((s) => s === "number" || s === "boolean");
        return e !== "string" && i && !n ? u["_" + t] : (...s) => Zr(t, e, r, s);
      }, u.addFunction = Et, u.removeFunction = G, u.UTF8ToString = S, u.stringToNewUTF8 = Vt, u.writeArrayToMemory = (t, e) => {
        D.set(t, e);
      };
      var Wt, gt, sr, ur, Xt, nt, zt, $t, H, Kr = {
        a: (t, e, r, n) => bt(`Assertion failed: ${S(t)}, at: ` + [e ? S(e) : "unknown filename", r, n ? S(n) : "unknown function"]),
        i: function(t, e) {
          try {
            return t = S(t), Ft(t, e), 0;
          } catch (r) {
            if (typeof A > "u" || r.name !== "ErrnoError") throw r;
            return -r.Pa;
          }
        },
        L: function(t, e, r) {
          try {
            if (e = S(e), e = et(t, e), r & -8) return -28;
            var n = x(e, { ab: !0 }).node;
            return n ? (t = "", r & 4 && (t += "r"), r & 2 && (t += "w"), r & 1 && (t += "x"), t && lt(n, t) ? -2 : 0) : -44;
          } catch (i) {
            if (typeof A > "u" || i.name !== "ErrnoError") throw i;
            return -i.Pa;
          }
        },
        j: function(t, e) {
          try {
            var r = q(t);
            return Ze(r, r.node, e, !1), 0;
          } catch (n) {
            if (typeof A > "u" || n.name !== "ErrnoError") throw n;
            return -n.Pa;
          }
        },
        h: function(t) {
          try {
            var e = q(t);
            return me(e, e.node, { timestamp: Date.now(), Lb: !1 }), 0;
          } catch (r) {
            if (typeof A > "u" || r.name !== "ErrnoError") throw r;
            return -r.Pa;
          }
        },
        b: function(t, e, r) {
          Ct = r;
          try {
            var n = q(t);
            switch (e) {
              case 0:
                var i = jt();
                if (0 > i) break;
                for (; at[i]; ) i++;
                return Xr(n, i).fd;
              case 1:
              case 2:
                return 0;
              case 3:
                return n.flags;
              case 4:
                return i = jt(), n.flags |= i, 0;
              case 12:
                return i = jt(), pt[i + 0 >> 1] = 2, 0;
              case 13:
              case 14:
                return 0;
            }
            return -28;
          } catch (s) {
            if (typeof A > "u" || s.name !== "ErrnoError") throw s;
            return -s.Pa;
          }
        },
        g: function(t, e) {
          try {
            var r = q(t), n = r.node, i = r.Ma.Ta;
            t = i ? r : n, i ?? (i = n.La.Ta), Ut(i);
            var s = i(t);
            return Bt(e, s);
          } catch (a) {
            if (typeof A > "u" || a.name !== "ErrnoError") throw a;
            return -a.Pa;
          }
        },
        H: function(t, e) {
          e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
          try {
            if (isNaN(e)) return -61;
            var r = q(t);
            if (0 > e || !(r.flags & 2097155)) throw new c(28);
            return Je(r, r.node, e), 0;
          } catch (n) {
            if (typeof A > "u" || n.name !== "ErrnoError") throw n;
            return -n.Pa;
          }
        },
        G: function(t, e) {
          try {
            if (e === 0) return -28;
            var r = ut("/") + 1;
            return e < r ? -68 : (W("/", M, t, e), r);
          } catch (n) {
            if (typeof A > "u" || n.name !== "ErrnoError") throw n;
            return -n.Pa;
          }
        },
        K: function(t, e) {
          try {
            return t = S(t), Bt(e, vt(t, !0));
          } catch (r) {
            if (typeof A > "u" || r.name !== "ErrnoError") throw r;
            return -r.Pa;
          }
        },
        C: function(t, e, r) {
          try {
            return e = S(e), e = et(t, e), X(e, r), 0;
          } catch (n) {
            if (typeof A > "u" || n.name !== "ErrnoError") throw n;
            return -n.Pa;
          }
        },
        J: function(t, e, r, n) {
          try {
            e = S(e);
            var i = n & 256;
            return e = et(t, e, n & 4096), Bt(r, i ? vt(e, !0) : vt(e));
          } catch (s) {
            if (typeof A > "u" || s.name !== "ErrnoError") throw s;
            return -s.Pa;
          }
        },
        x: function(t, e, r, n) {
          Ct = n;
          try {
            e = S(e), e = et(t, e);
            var i = n ? jt() : 0;
            return ft(e, r, i).fd;
          } catch (s) {
            if (typeof A > "u" || s.name !== "ErrnoError") throw s;
            return -s.Pa;
          }
        },
        v: function(t, e, r, n) {
          try {
            if (e = S(e), e = et(t, e), 0 >= n) return -28;
            var i = x(e).node;
            if (!i) throw new c(44);
            if (!i.La.readlink) throw new c(28);
            var s = i.La.readlink(i), a = Math.min(n, ut(s)), w = D[r + a];
            return W(
              s,
              M,
              r,
              n + 1
            ), D[r + a] = w, a;
          } catch (g) {
            if (typeof A > "u" || g.name !== "ErrnoError") throw g;
            return -g.Pa;
          }
        },
        u: function(t) {
          try {
            return t = S(t), Ge(t), 0;
          } catch (e) {
            if (typeof A > "u" || e.name !== "ErrnoError") throw e;
            return -e.Pa;
          }
        },
        f: function(t, e) {
          try {
            return t = S(t), Bt(e, vt(t));
          } catch (r) {
            if (typeof A > "u" || r.name !== "ErrnoError") throw r;
            return -r.Pa;
          }
        },
        r: function(t, e, r) {
          try {
            if (e = S(e), e = et(t, e), r) if (r === 512) Ge(e);
            else return -28;
            else He(e);
            return 0;
          } catch (n) {
            if (typeof A > "u" || n.name !== "ErrnoError") throw n;
            return -n.Pa;
          }
        },
        q: function(t, e, r) {
          try {
            e = S(e), e = et(t, e, !0);
            var n = Date.now(), i, s;
            if (r) {
              var a = N[r >> 2] + 4294967296 * R[r + 4 >> 2], w = R[r + 8 >> 2];
              w == 1073741823 ? i = n : w == 1073741822 ? i = null : i = 1e3 * a + w / 1e6, r += 16, a = N[r >> 2] + 4294967296 * R[r + 4 >> 2], w = R[r + 8 >> 2], w == 1073741823 ? s = n : w == 1073741822 ? s = null : s = 1e3 * a + w / 1e6;
            } else s = i = n;
            if ((s ?? i) !== null) {
              t = i;
              var g = x(e, { ab: !0 }).node;
              Ut(g.La.Ua)(g, { atime: t, mtime: s });
            }
            return 0;
          } catch (v) {
            if (typeof A > "u" || v.name !== "ErrnoError") throw v;
            return -v.Pa;
          }
        },
        m: () => bt(""),
        l: () => {
          kt = !1, ye = 0;
        },
        A: function(t, e) {
          t = -9007199254740992 > t || 9007199254740992 < t ? NaN : Number(t), t = new Date(1e3 * t), R[e >> 2] = t.getSeconds(), R[e + 4 >> 2] = t.getMinutes(), R[e + 8 >> 2] = t.getHours(), R[e + 12 >> 2] = t.getDate(), R[e + 16 >> 2] = t.getMonth(), R[e + 20 >> 2] = t.getFullYear() - 1900, R[e + 24 >> 2] = t.getDay();
          var r = t.getFullYear();
          R[e + 28 >> 2] = (r % 4 !== 0 || r % 100 === 0 && r % 400 !== 0 ? Gr : Yr)[t.getMonth()] + t.getDate() - 1 | 0, R[e + 36 >> 2] = -(60 * t.getTimezoneOffset()), r = new Date(t.getFullYear(), 6, 1).getTimezoneOffset();
          var n = new Date(t.getFullYear(), 0, 1).getTimezoneOffset();
          R[e + 32 >> 2] = (r != n && t.getTimezoneOffset() == Math.min(n, r)) | 0;
        },
        y: function(t, e, r, n, i, s, a) {
          i = -9007199254740992 > i || 9007199254740992 < i ? NaN : Number(i);
          try {
            var w = q(n);
            if (e & 2 && !(r & 2) && (w.flags & 2097155) !== 2) throw new c(2);
            if ((w.flags & 2097155) === 1) throw new c(2);
            if (!w.Ma.jb) throw new c(43);
            if (!t) throw new c(28);
            var g = w.Ma.jb(w, t, i, e, r), v = g.Xb;
            return R[s >> 2] = g.Eb, N[a >> 2] = v, 0;
          } catch (O) {
            if (typeof A > "u" || O.name !== "ErrnoError") throw O;
            return -O.Pa;
          }
        },
        z: function(t, e, r, n, i, s) {
          s = -9007199254740992 > s || 9007199254740992 < s ? NaN : Number(s);
          try {
            var a = q(i);
            if (r & 2) {
              if (r = s, (a.node.mode & 61440) !== 32768) throw new c(43);
              if (!(n & 2)) {
                var w = M.slice(t, t + e);
                a.Ma.kb && a.Ma.kb(a, w, r, e, n);
              }
            }
          } catch (g) {
            if (typeof A > "u" || g.name !== "ErrnoError") throw g;
            return -g.Pa;
          }
        },
        n: (t, e) => {
          if (_t[t] && (clearTimeout(_t[t].id), delete _t[t]), !e) return 0;
          var r = setTimeout(() => {
            delete _t[t], Hr(() => ur(t, performance.now()));
          }, e);
          return _t[t] = { id: r, lc: e }, 0;
        },
        B: (t, e, r, n) => {
          var i = (/* @__PURE__ */ new Date()).getFullYear(), s = new Date(i, 0, 1).getTimezoneOffset();
          i = new Date(i, 6, 1).getTimezoneOffset(), N[t >> 2] = 60 * Math.max(s, i), R[e >> 2] = +(s != i), e = (a) => {
            var w = Math.abs(a);
            return `UTC${0 <= a ? "-" : "+"}${String(Math.floor(w / 60)).padStart(2, "0")}${String(w % 60).padStart(2, "0")}`;
          }, t = e(s), e = e(i), i < s ? (W(t, M, r, 17), W(e, M, n, 17)) : (W(t, M, n, 17), W(e, M, r, 17));
        },
        d: () => Date.now(),
        s: () => 2147483648,
        c: () => performance.now(),
        o: (t) => {
          var e = M.length;
          if (t >>>= 0, 2147483648 < t) return !1;
          for (var r = 1; 4 >= r; r *= 2) {
            var n = e * (1 + 0.2 / r);
            n = Math.min(n, t + 100663296);
            t: {
              n = (Math.min(2147483648, 65536 * Math.ceil(Math.max(
                t,
                n
              ) / 65536)) - $t.buffer.byteLength + 65535) / 65536 | 0;
              try {
                $t.grow(n), De();
                var i = 1;
                break t;
              } catch {
              }
              i = void 0;
            }
            if (i) return !0;
          }
          return !1;
        },
        E: (t, e) => {
          var r = 0, n = 0, i;
          for (i of nr()) {
            var s = e + r;
            N[t + n >> 2] = s, r += W(i, M, s, 1 / 0) + 1, n += 4;
          }
          return 0;
        },
        F: (t, e) => {
          var r = nr();
          N[t >> 2] = r.length, t = 0;
          for (var n of r) t += ut(n) + 1;
          return N[e >> 2] = t, 0;
        },
        e: function(t) {
          try {
            var e = q(t);
            return we(e), 0;
          } catch (r) {
            if (typeof A > "u" || r.name !== "ErrnoError") throw r;
            return r.Pa;
          }
        },
        p: function(t, e) {
          try {
            var r = q(t);
            return D[e] = r.tty ? 2 : U(r.mode) ? 3 : (r.mode & 61440) === 40960 ? 7 : 4, pt[e + 2 >> 1] = 0, B[e + 8 >> 3] = BigInt(0), B[e + 16 >> 3] = BigInt(0), 0;
          } catch (n) {
            if (typeof A > "u" || n.name !== "ErrnoError") throw n;
            return n.Pa;
          }
        },
        w: function(t, e, r, n) {
          try {
            t: {
              var i = q(t);
              t = e;
              for (var s, a = e = 0; a < r; a++) {
                var w = N[t >> 2], g = N[t + 4 >> 2];
                t += 8;
                var v = tr(i, D, w, g, s);
                if (0 > v) {
                  var O = -1;
                  break t;
                }
                if (e += v, v < g) break;
                typeof s < "u" && (s += v);
              }
              O = e;
            }
            return N[n >> 2] = O, 0;
          } catch (L) {
            if (typeof A > "u" || L.name !== "ErrnoError") throw L;
            return L.Pa;
          }
        },
        D: function(t, e, r, n) {
          e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
          try {
            if (isNaN(e)) return 61;
            var i = q(t);
            return Ke(i, e, r), B[n >> 3] = BigInt(i.position), i.rb && e === 0 && r === 0 && (i.rb = null), 0;
          } catch (s) {
            if (typeof A > "u" || s.name !== "ErrnoError") throw s;
            return s.Pa;
          }
        },
        I: function(t) {
          var r, n;
          try {
            var e = q(t);
            return (n = (r = e.Ma) == null ? void 0 : r.fsync) == null ? void 0 : n.call(r, e);
          } catch (i) {
            if (typeof A > "u" || i.name !== "ErrnoError") throw i;
            return i.Pa;
          }
        },
        t: function(t, e, r, n) {
          try {
            t: {
              var i = q(t);
              t = e;
              for (var s, a = e = 0; a < r; a++) {
                var w = N[t >> 2], g = N[t + 4 >> 2];
                t += 8;
                var v = er(i, D, w, g, s);
                if (0 > v) {
                  var O = -1;
                  break t;
                }
                if (e += v, v < g) break;
                typeof s < "u" && (s += v);
              }
              O = e;
            }
            return N[n >> 2] = O, 0;
          } catch (L) {
            if (typeof A > "u" || L.name !== "ErrnoError") throw L;
            return L.Pa;
          }
        },
        k: rr
      };
      function ge() {
        function t() {
          var i;
          if (u.calledRun = !0, !Lt) {
            if (!u.noFSInit && !Ve) {
              var e, r;
              Ve = !0, e ?? (e = u.stdin), r ?? (r = u.stdout), n ?? (n = u.stderr), e ? Y("stdin", e) : be("/dev/tty", "/dev/stdin"), r ? Y("stdout", null, r) : be("/dev/tty", "/dev/stdout"), n ? Y("stderr", null, n) : be("/dev/tty1", "/dev/stderr"), ft("/dev/stdin", 0), ft("/dev/stdout", 1), ft("/dev/stderr", 1);
            }
            if (Te.N(), We = !1, (i = u.onRuntimeInitialized) == null || i.call(u), u.postRun) for (typeof u.postRun == "function" && (u.postRun = [u.postRun]); u.postRun.length; ) {
              var n = u.postRun.shift();
              Ie.push(n);
            }
            Le(Ie);
          }
        }
        if (0 < K) wt = ge;
        else {
          if (u.preRun) for (typeof u.preRun == "function" && (u.preRun = [u.preRun]); u.preRun.length; ) Ur();
          Le(ke), 0 < K ? wt = ge : u.setStatus ? (u.setStatus("Running..."), setTimeout(() => {
            setTimeout(() => u.setStatus(""), 1), t();
          }, 1)) : t();
        }
      }
      var Te;
      return async function() {
        var r;
        function t(n) {
          var i;
          return n = Te = n.exports, u._sqlite3_free = n.P, u._sqlite3_value_text = n.Q, u._sqlite3_prepare_v2 = n.R, u._sqlite3_step = n.S, u._sqlite3_reset = n.T, u._sqlite3_exec = n.U, u._sqlite3_finalize = n.V, u._sqlite3_column_name = n.W, u._sqlite3_column_text = n.X, u._sqlite3_column_type = n.Y, u._sqlite3_errmsg = n.Z, u._sqlite3_clear_bindings = n._, u._sqlite3_value_blob = n.$, u._sqlite3_value_bytes = n.aa, u._sqlite3_value_double = n.ba, u._sqlite3_value_int = n.ca, u._sqlite3_value_type = n.da, u._sqlite3_result_blob = n.ea, u._sqlite3_result_double = n.fa, u._sqlite3_result_error = n.ga, u._sqlite3_result_int = n.ha, u._sqlite3_result_int64 = n.ia, u._sqlite3_result_null = n.ja, u._sqlite3_result_text = n.ka, u._sqlite3_aggregate_context = n.la, u._sqlite3_column_count = n.ma, u._sqlite3_data_count = n.na, u._sqlite3_column_blob = n.oa, u._sqlite3_column_bytes = n.pa, u._sqlite3_column_double = n.qa, u._sqlite3_bind_blob = n.ra, u._sqlite3_bind_double = n.sa, u._sqlite3_bind_int = n.ta, u._sqlite3_bind_text = n.ua, u._sqlite3_bind_parameter_index = n.va, u._sqlite3_sql = n.wa, u._sqlite3_normalized_sql = n.xa, u._sqlite3_changes = n.ya, u._sqlite3_close_v2 = n.za, u._sqlite3_create_function_v2 = n.Aa, u._sqlite3_update_hook = n.Ba, u._sqlite3_open = n.Ca, Wt = u._malloc = n.Da, gt = u._free = n.Ea, u._RegisterExtensionFunctions = n.Fa, sr = n.Ga, ur = n.Ha, Xt = n.Ia, nt = n.Ja, zt = n.Ka, $t = n.M, H = n.O, De(), K--, (i = u.monitorRunDependencies) == null || i.call(u, K), K == 0 && wt && (n = wt, wt = null, n()), Te;
        }
        K++, (r = u.monitorRunDependencies) == null || r.call(u, K);
        var e = { a: Kr };
        return u.instantiateWasm ? new Promise((n) => {
          u.instantiateWasm(e, (i, s) => {
            n(t(i));
          });
        }) : (se ?? (se = u.locateFile ? u.locateFile("sql-wasm.wasm", St) : St + "sql-wasm.wasm"), t((await qr(e)).instance));
      }(), ge(), k;
    }), h);
  };
  d.exports = b, d.exports.default = b;
})(Rr);
var Un = Rr.exports;
const Pn = /* @__PURE__ */ qn(Un), Gt = new Uint8Array(256);
let Yt = Gt.length;
function xn() {
  return Yt > Gt.length - 16 && (Or.randomFillSync(Gt), Yt = 0), Gt.slice(Yt, Yt += 16);
}
const I = [];
for (let d = 0; d < 256; ++d)
  I.push((d + 256).toString(16).slice(1));
function Fn(d, f = 0) {
  return I[d[f + 0]] + I[d[f + 1]] + I[d[f + 2]] + I[d[f + 3]] + "-" + I[d[f + 4]] + I[d[f + 5]] + "-" + I[d[f + 6]] + I[d[f + 7]] + "-" + I[d[f + 8]] + I[d[f + 9]] + "-" + I[d[f + 10]] + I[d[f + 11]] + I[d[f + 12]] + I[d[f + 13]] + I[d[f + 14]] + I[d[f + 15]];
}
const gr = {
  randomUUID: Or.randomUUID
};
function Oe(d, f, h) {
  if (gr.randomUUID && !d)
    return gr.randomUUID();
  d = d || {};
  const b = d.random || (d.rng || xn)();
  return b[6] = b[6] & 15 | 64, b[8] = b[8] & 63 | 128, Fn(b);
}
const Bn = [
  {
    title: "Information Security Policy",
    content: "This policy establishes requirements for ensuring information security across the organization...",
    status: "APPROVED",
    authorName: "Alice Johnson",
    authorId: "seed-user-1"
  },
  {
    title: "Contract Approval Procedure",
    content: "This procedure defines the workflow for reviewing and approving contracts...",
    status: "PENDING",
    authorName: "Bob Smith",
    authorId: "seed-user-2"
  },
  {
    title: "Organizational Structure Order",
    content: "In order to improve the organizational structure of the company...",
    status: "DRAFT",
    authorName: "Carol Davis",
    authorId: "seed-user-3"
  }
];
function Cn(d, f) {
  var E, $;
  if (d.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'DRAFT' CHECK(status IN ('DRAFT','PENDING','APPROVED','REJECTED','ARCHIVED')),
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `), d.run(`
    CREATE TABLE IF NOT EXISTS document_versions (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
      version_number INTEGER NOT NULL,
      content TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      change_note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      UNIQUE(document_id, version_number)
    )
  `), d.run("CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status)"), d.run(
    "CREATE INDEX IF NOT EXISTS idx_versions_document_id ON document_versions(document_id)"
  ), (($ = (E = d.exec("SELECT COUNT(*) as count FROM documents")[0]) == null ? void 0 : E.values[0]) == null ? void 0 : $[0]) === 0) {
    const st = (/* @__PURE__ */ new Date()).toISOString();
    for (const k of Bn)
      d.run(
        `INSERT INTO documents (id, title, content, status, author_id, author_name, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [Oe(), k.title, k.content, k.status, k.authorId, k.authorName, st, st]
      );
    f();
  }
}
let V = null, Nt = "", Tt = null;
async function jn() {
  return V || Tt || (Tt = (async () => {
    Nt = Mn.join(dt.getPath("userData"), "sed_documents.db");
    const d = await Pn();
    let f;
    try {
      Ae.existsSync(Nt) && (f = Ae.readFileSync(Nt));
    } catch {
    }
    return V = new d.Database(f), V.run("PRAGMA foreign_keys = ON"), Cn(V, At), V;
  })(), Tt);
}
function At() {
  if (V && Nt) {
    const d = V.export(), f = Buffer.from(d);
    Ae.writeFileSync(Nt, f);
  }
}
function Vn() {
  V && (At(), V.close(), V = null, Tt = null);
}
function Tr(d, f) {
  const h = {};
  return d.forEach((b, E) => {
    h[b] = f[E];
  }), {
    id: h.id,
    title: h.title,
    content: h.content,
    status: h.status,
    authorId: h.author_id,
    authorName: h.author_name,
    createdAt: h.created_at,
    updatedAt: h.updated_at
  };
}
function Nr(d, f) {
  const h = {};
  return d.forEach((b, E) => {
    h[b] = f[E];
  }), {
    id: h.id,
    documentId: h.document_id,
    versionNumber: h.version_number,
    content: h.content,
    authorId: h.author_id,
    authorName: h.author_name,
    createdAt: h.created_at,
    changeNote: h.change_note
  };
}
class Wn {
  constructor(f) {
    this.db = f;
  }
  findAll() {
    const f = this.db.exec(
      "SELECT * FROM documents ORDER BY updated_at DESC"
    );
    if (!f.length) return [];
    const { columns: h, values: b } = f[0];
    return b.map((E) => Tr(h, E));
  }
  findById(f) {
    const h = this.db.prepare("SELECT * FROM documents WHERE id = ?");
    if (h.bind([f]), h.step()) {
      const b = h.getAsObject();
      return h.free(), Tr(
        Object.keys(b),
        Object.values(b)
      );
    }
    h.free();
  }
  create(f) {
    const h = (/* @__PURE__ */ new Date()).toISOString(), b = {
      id: Oe(),
      title: f.title,
      content: f.content,
      status: "DRAFT",
      authorId: f.authorId,
      authorName: f.authorName,
      createdAt: h,
      updatedAt: h
    };
    return this.db.run(
      `INSERT INTO documents (id, title, content, status, author_id, author_name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [b.id, b.title, b.content, b.status, b.authorId, b.authorName, b.createdAt, b.updatedAt]
    ), At(), b;
  }
  update(f, h) {
    const b = this.findById(f);
    if (!b) throw new Error(`Document not found: ${f}`);
    const E = (/* @__PURE__ */ new Date()).toISOString(), $ = this.getNextVersionNumber(f);
    try {
      this.db.run("BEGIN EXCLUSIVE"), this.db.run(
        `INSERT INTO document_versions (id, document_id, version_number, content, author_id, author_name, change_note, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [Oe(), f, $, b.content, b.authorId, b.authorName, h.changeNote, E]
      ), h.title !== void 0 && this.db.run("UPDATE documents SET title = ?, updated_at = ? WHERE id = ?", [h.title, E, f]), h.content !== void 0 && this.db.run("UPDATE documents SET content = ?, updated_at = ? WHERE id = ?", [h.content, E, f]), h.title === void 0 && h.content === void 0 && this.db.run("UPDATE documents SET updated_at = ? WHERE id = ?", [E, f]), this.db.run("COMMIT"), At();
    } catch (st) {
      throw this.db.run("ROLLBACK"), st;
    }
    return this.findById(f);
  }
  delete(f) {
    this.db.run("DELETE FROM documents WHERE id = ?", [f]), At();
  }
  findVersions(f) {
    const h = this.db.prepare(
      "SELECT * FROM document_versions WHERE document_id = ? ORDER BY version_number DESC"
    );
    h.bind([f]);
    const b = [];
    for (; h.step(); ) {
      const E = h.getAsObject();
      b.push(Nr(Object.keys(E), Object.values(E)));
    }
    return h.free(), b;
  }
  getVersionByNumber(f, h) {
    const b = this.db.prepare(
      "SELECT * FROM document_versions WHERE document_id = ? AND version_number = ?"
    );
    if (b.bind([f, h]), b.step()) {
      const E = b.getAsObject();
      return b.free(), Nr(
        Object.keys(E),
        Object.values(E)
      );
    }
    b.free();
  }
  getNextVersionNumber(f) {
    const h = this.db.prepare(
      "SELECT COALESCE(MAX(version_number), 0) + 1 AS next FROM document_versions WHERE document_id = ?"
    );
    h.bind([f]), h.step();
    const b = h.getAsObject();
    return h.free(), b.next;
  }
}
class Xn {
  constructor(f) {
    this.repository = f;
  }
  getAllDocuments() {
    return this.repository.findAll();
  }
  getDocumentById(f) {
    const h = this.repository.findById(f);
    if (!h) throw new Error(`Document not found: ${f}`);
    return h;
  }
  createDocument(f) {
    return this.validateTitle(f.title), this.repository.create(f);
  }
  updateDocument(f, h) {
    if (this.getDocumentById(f).status !== "DRAFT")
      throw new Error("Only DRAFT documents can be edited");
    if (h.title !== void 0 && this.validateTitle(h.title), !h.changeNote.trim())
      throw new Error("A change note is required when editing a document");
    return this.repository.update(f, h);
  }
  deleteDocument(f) {
    if (this.getDocumentById(f).status !== "DRAFT")
      throw new Error("Only DRAFT documents can be deleted");
    this.repository.delete(f);
  }
  getDocumentVersions(f) {
    return this.getDocumentById(f), this.repository.findVersions(f);
  }
  validateTitle(f) {
    if (!f.trim()) throw new Error("Title cannot be empty");
    if (f.length > 255) throw new Error("Title must be 255 characters or fewer");
  }
}
const Sr = ot.dirname(Ln(import.meta.url));
process.env.APP_ROOT = ot.join(Sr, "..");
const Re = process.env.VITE_DEV_SERVER_URL, ei = ot.join(process.env.APP_ROOT, "dist-electron"), Dr = ot.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Re ? ot.join(process.env.APP_ROOT, "public") : Dr;
let Ht;
function Lr() {
  Ht = new Ar({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      preload: ot.join(Sr, "preload.mjs")
    }
  }), Re ? Ht.loadURL(Re) : Ht.loadFile(ot.join(Dr, "index.html"));
}
async function zn() {
  const d = await jn(), f = new Wn(d), h = new Xn(f);
  ht.handle(ct.DOCUMENTS.GET_ALL, () => h.getAllDocuments()), ht.handle(
    ct.DOCUMENTS.GET_BY_ID,
    (b, E) => h.getDocumentById(E)
  ), ht.handle(
    ct.DOCUMENTS.CREATE,
    (b, E) => h.createDocument(E)
  ), ht.handle(
    ct.DOCUMENTS.UPDATE,
    (b, E, $) => h.updateDocument(E, $)
  ), ht.handle(
    ct.DOCUMENTS.DELETE,
    (b, E) => h.deleteDocument(E)
  ), ht.handle(
    ct.DOCUMENTS.GET_VERSIONS,
    (b, E) => h.getDocumentVersions(E)
  );
}
dt.on("window-all-closed", () => {
  process.platform !== "darwin" && (dt.quit(), Ht = null);
});
dt.on("activate", () => {
  Ar.getAllWindows().length === 0 && Lr();
});
dt.whenReady().then(async () => {
  await zn(), Lr();
});
dt.on("will-quit", () => Vn());
export {
  ei as MAIN_DIST,
  Dr as RENDERER_DIST,
  Re as VITE_DEV_SERVER_URL
};
