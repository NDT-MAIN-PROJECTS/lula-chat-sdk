var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/emojibase-regex/emoji-loose.js
var require_emoji_loose = __commonJS({
  "node_modules/emojibase-regex/emoji-loose.js"(exports, module) {
    "use strict";
    module.exports = /\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFE])|\uD83C\uDFFE\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C\uDFFD\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C\uDFFC\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C\uDFFB\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83E\uDDD1(?:\uD83C[\uDFFC-\uDFFF]))|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFF])|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\u2764\u200D\uD83D\uDC8B\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFE])|\uD83C\uDFFE\u200D\u2764\u200D\uD83D\uDC8B\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C\uDFFD\u200D\u2764\u200D\uD83D\uDC8B\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C\uDFFC\u200D\u2764\u200D\uD83D\uDC8B\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C\uDFFB\u200D\u2764\u200D\uD83D\uDC8B\u200D\uD83E\uDDD1(?:\uD83C[\uDFFC-\uDFFF]))|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])\u200D\u2764\u200D\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D\u2764\u200D\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC68|(?:\uD83C[\uDFFB-\uDFFF])\u200D\u2764\uFE0F\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\u2764\uFE0F\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFE])|\uD83C\uDFFE\u200D\u2764\uFE0F\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C\uDFFD\u200D\u2764\uFE0F\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C\uDFFC\u200D\u2764\uFE0F\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C\uDFFB\u200D\u2764\uFE0F\u200D\uD83E\uDDD1(?:\uD83C[\uDFFC-\uDFFF]))|\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFF])|(?:\uD83C\uDFC3|\uD83D\uDEB6|\uD83E\uDDCE)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]\uFE0F\u200D\u27A1\uFE0F|\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|\uD83E\uDDD1\u200D\uD83E\uDDD1\u200D\uD83E\uDDD2\u200D\uD83E\uDDD2|\uD83D\uDC69(?:\u200D(?:\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\u2764\u200D\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69]))|\uD83C\uDFFF\u200D(?:(?:\uD83D\uDC30|\uD83E\uDEEF)\u200D\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFE])|\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFE]))|\uD83C\uDFFE\u200D(?:(?:\uD83D\uDC30|\uD83E\uDEEF)\u200D\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFD\uDFFF]))|\uD83C\uDFFD\u200D(?:(?:\uD83D\uDC30|\uD83E\uDEEF)\u200D\uD83D\uDC69(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]))|\uD83C\uDFFC\u200D(?:(?:\uD83D\uDC30|\uD83E\uDEEF)\u200D\uD83D\uDC69(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB\uDFFD-\uDFFF]))|\uD83C\uDFFB\u200D(?:(?:\uD83D\uDC30|\uD83E\uDEEF)\u200D\uD83D\uDC69(?:\uD83C[\uDFFC-\uDFFF])|\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFC-\uDFFF])|(?:\uD83E[\uDDAF\uDDBC\uDDBD])\u200D\u27A1\uFE0F|\u2764\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFF]))|(?:\uD83C\uDFFF\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD]))\u200D\u27A1\uFE0F|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFF]))|\uD83D\uDC68\u200D\u2764\u200D\uD83D\uDC8B\u200D\uD83D\uDC68|\uD83D\uDC68\u200D(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFF\u200D(?:\u2764|\uD83D\uDC30|\uD83E\uDEEF)\u200D\uD83E\uDDD1|\uD83D\uDC68\uD83C\uDFFF\u200D(?:\uD83D\uDC30|\uD83E[\uDD1D\uDEEF])\u200D\uD83D\uDC68)(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D(?:\u2764|\uD83D\uDC30|\uD83E\uDEEF)\u200D\uD83E\uDDD1|\uD83D\uDC68\uD83C\uDFFE\u200D(?:\uD83D\uDC30|\uD83E[\uDD1D\uDEEF])\u200D\uD83D\uDC68)(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D(?:\u2764|\uD83D\uDC30|\uD83E\uDEEF)\u200D\uD83E\uDDD1|\uD83D\uDC68\uD83C\uDFFD\u200D(?:\uD83D\uDC30|\uD83E[\uDD1D\uDEEF])\u200D\uD83D\uDC68)(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D(?:\u2764|\uD83D\uDC30|\uD83E\uDEEF)\u200D\uD83E\uDDD1|\uD83D\uDC68\uD83C\uDFFC\u200D(?:\uD83D\uDC30|\uD83E[\uDD1D\uDEEF])\u200D\uD83D\uDC68)(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|(?:\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])\u200D\u2764\u200D\uD83D\uDC68)(?:\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D(?:\u2764|\uD83D\uDC30|\uD83E\uDEEF)\u200D\uD83E\uDDD1|\uD83D\uDC68\uD83C\uDFFB\u200D(?:\uD83D\uDC30|\uD83E[\uDD1D\uDEEF])\u200D\uD83D\uDC68)(?:\uD83C[\uDFFC-\uDFFF])|(?:\uD83E\uDDD1(?:\uD83C\uDFFF\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD]))|\uD83D\uDC68(?:\uD83C\uDFFF\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD]))|(?:\uD83C\uDFC3|\uD83D\uDEB6|\uD83E\uDDCE)\u200D[\u2640\u2642]\uFE0F)\u200D\u27A1\uFE0F|(?:\uD83C\uDFC3|\uD83D\uDEB6|\uD83E\uDDCE)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]\uFE0F\u200D\u27A1|(?:\uD83C\uDFC3|\uD83D\uDEB6|\uD83E\uDDCE)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]\u200D\u27A1\uFE0F|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D\uD83D\uDC68|(?:\uD83E[\uDDAF\uDDBC\uDDBD])\u200D\u27A1\uFE0F)|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])\u200D\u27A1)|\uD83D\uDC69\u200D\u2764\uFE0F\u200D(?:\uD83D[\uDC68\uDC69])|(?:\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF]))\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])\u200D\u27A1|(?:\uD83E\uDDD1\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])|\uD83D\uDC69\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD]))\u200D\u27A1\uFE0F|(?:\uD83C\uDFC3|\uD83D\uDEB6|\uD83E\uDDCE)(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642]\uFE0F)\u200D\u27A1|(?:\uD83C\uDFC3|\uD83D\uDEB6|\uD83E\uDDCE)\u200D[\u2640\u2642]\u200D\u27A1\uFE0F|\uD83E\uDDD1\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|(?:\uD83E[\uDDD1\uDDD2])\u200D\uD83E\uDDD2)|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC68(?:\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\u2764\u200D\uD83D\uDC68|(?:\uD83E[\uDDAF\uDDBC\uDDBD])\u200D\u27A1|(?:\uD83D[\uDC67-\uDC69])\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]\uFE0F)|\uD83E\uDEF1(?:\uD83C\uDFFF\u200D\uD83E\uDEF2(?:\uD83C[\uDFFB-\uDFFE])|\uD83C\uDFFE\u200D\uD83E\uDEF2(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C\uDFFD\u200D\uD83E\uDEF2(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C\uDFFC\u200D\uD83E\uDEF2(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C\uDFFB\u200D\uD83E\uDEF2(?:\uD83C[\uDFFC-\uDFFF]))|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83C\uDFF3\uFE0F\u200D\u26A7|(?:\uD83C[\uDFC4\uDFCA]|\uD83D[\uDC6E-\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3C-\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C\uDFC3|\uD83D\uDEB6|\uD83E\uDDCE)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642\u27A1])\uFE0F|\uD83D\uDC69\u200D\u2764\u200D(?:\uD83D[\uDC68\uDC69])|(?:\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF]))\u200D[\u2695\u2696\u2708]\uFE0F|(?:\uD83E\uDDD1\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])|\uD83D\uDC69\u200D(?:\uD83E[\uDDAF\uDDBC\uDDBD])|(?:\uD83C\uDFC3|\uD83D\uDEB6|\uD83E\uDDCE)\u200D[\u2640\u2642])\u200D\u27A1|\uD83D\uDC69\u200D(?:\uD83D[\uDC67\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|(?:\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83D\uDC41\u200D\uD83D\uDDE8|\uD83D\uDE42\u200D[\u2194\u2195]|\uD83D\uDC3B\u200D\u2744|\uD83C\uDFF4\u200D\u2620|\uD83C\uDFF3\u200D\u26A7|\uD83E\uDDD1\u200D[\u2695\u2696\u2708]|(?:\uD83C[\uDFC4\uDFCA]|\uD83D[\uDC6E-\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3C-\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\u200D[\u2640\u2642]|(?:\uD83D[\uDC68\uDC69])\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFF3\uFE0F\u200D(?:\u26A7|\uD83C\uDF08)|\u26D3\uFE0F\u200D\uD83D\uDCA5|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:[\u2695\u2696\u2708]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD\uDE70])|\u2764\uFE0F\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|(?:\uD83C[\uDFC4\uDFCA]|\uD83D[\uDC6E-\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3C-\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:[\u2695\u2696\u2708]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFC3|\uD83D\uDEB6|\uD83E\uDDCE)(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642\u27A1]|\u200D[\u2640\u2642\u27A1]\uFE0F)|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83D\uDE35\u200D\uD83D\uDCAB|\uD83D\uDE2E\u200D\uD83D\uDCA8|\uD83D\uDC41\u200D\uD83D\uDDE8|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83C\uDF4B\u200D\uD83D\uDFE9|\uD83C\uDF44\u200D\uD83D\uDFEB|\uD83D\uDE42\u200D[\u2194\u2195]|\uD83D\uDC3B\u200D\u2744|\uD83D\uDC26\u200D(?:\u2B1B|\uD83D\uDD25)|\uD83D\uDC08\u200D\u2B1B|\uD83C\uDFF4\u200D\u2620|\uD83C\uDFF3\u200D(?:\u26A7|\uD83C\uDF08)|\u26D3\u200D\uD83D\uDCA5|\uD83E\uDDD1\u200D(?:[\u2695\u2696\u2708]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD\uDDD2\uDE70])|\u2764\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|(?:\u26F9|\uD83C[\uDFC4\uDFCA-\uDFCC]|\uD83D[\uDC6E-\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDD75\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3C-\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDF])\u200D[\u2640\u2642]|(?:\uD83C\uDFC3|\uD83D\uDEB6|\uD83E\uDDCE)\u200D[\u2640\u2642\u27A1]|(?:\uD83D[\uDC68\uDC69])\u200D(?:[\u2695\u2696\u2708]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDC66\uDC67\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\u20E3|(?:\uD83C[\uDF85\uDFC3\uDFC7]|\uD83D[\uDC43\uDC4A-\uDC4C\uDC4F\uDC50\uDC66-\uDC69\uDC6B-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD\uDEC3-\uDEC5\uDEF0-\uDEFA])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDFC2\uDFC4\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC46-\uDC49\uDC4D\uDC4E\uDD74\uDD75\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7\u26F8\u26FA\u26FD\u2702\u2705\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE1A\uDE2F\uDE37\uDF0D-\uDF0F\uDF15\uDF1C\uDF21\uDF24-\uDF2C\uDF36\uDF78\uDF7D\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFA7\uDFAC-\uDFAE\uDFC6\uDFCD\uDFCE\uDFD4-\uDFE0\uDFED\uDFF3\uDFF5\uDFF7]|\uD83D[\uDC08\uDC15\uDC1F\uDC26\uDC3F\uDC41\uDC53\uDC6A\uDC7D\uDCA3\uDCB0\uDCB3\uDCBB\uDCBF\uDCCB\uDCDA\uDCDF\uDCE4-\uDCE6\uDCEA-\uDCED\uDCF7\uDCF9-\uDCFB\uDCFD\uDD08\uDD0D\uDD12\uDD13\uDD49\uDD4A\uDD50-\uDD67\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDE10\uDE87\uDE8D\uDE91\uDE94\uDE98\uDEAD\uDEB2\uDEB9\uDEBA\uDEBC\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED9\uDEDC-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDDFF\uDE70-\uDE7C\uDE80-\uDEC6\uDEC8\uDECC-\uDEDD\uDEDF-\uDEEB\uDEEF-\uDEFA])(?!\uFE0E)/;
  }
});

// src/index.ts
var import_emoji_loose = __toESM(require_emoji_loose(), 1);

// src/message-edit.ts
var CHAT_MESSAGE_EDIT_WINDOW_MS = 15 * 60 * 1e3;
function isMessageEditWithinWindow(originalTimestamp, editTimestamp = Date.now()) {
  return Number.isFinite(originalTimestamp) && originalTimestamp > 0 && Number.isFinite(editTimestamp) && editTimestamp >= originalTimestamp && editTimestamp - originalTimestamp < CHAT_MESSAGE_EDIT_WINDOW_MS;
}
function authorIdentity(address) {
  const trimmed = address.trim();
  const normalized = trimmed.toLowerCase();
  const bare = normalized.split("/")[0];
  if (bare.split("@")[1]?.startsWith("conference.")) {
    const separator = trimmed.indexOf("/");
    return separator < 0 ? bare : `${bare}${trimmed.slice(separator)}`;
  }
  const [local, domain] = bare.split("@");
  const account = local.startsWith("i.") ? local.replace(/\.d\..*$/, "") : local;
  return domain ? `${account}@${domain}` : account;
}
function getMessageEditError(original, editorAddress, editTimestamp = Date.now()) {
  if (!original) return "chat_edit_original_not_found";
  const author = authorIdentity(original.authorAddress);
  if (!author || author !== authorIdentity(editorAddress)) return "chat_edit_not_message_author";
  const metadata = original.metadata ?? {};
  if (!original.body.trim() || original.hasAttachments || metadata.deleted || metadata.redacted || metadata.retracted || metadata.formId || metadata.emergencyType || metadata.messageType !== void 0 && metadata.messageType !== "CHAT_MESSAGE") {
    return "chat_edit_not_allowed";
  }
  if (!isMessageEditWithinWindow(original.timestamp, editTimestamp)) return "chat_edit_expired";
  return void 0;
}

// src/index.ts
import { gcm } from "@noble/ciphers/aes.js";
import { x25519 } from "@noble/curves/ed25519.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { randomBytes as nobleRandomBytes, utf8ToBytes } from "@noble/hashes/utils.js";
import { client as createXmppClient, xml } from "@xmpp/client";
import { customAlphabet } from "nanoid/non-secure";
import saslMechanisms from "saslmechanisms";

// src/omemoDiscoveryCache.ts
var MAX_CACHE_ENTRIES = 128;
function createInMemoryOmemoDiscoveryCache() {
  const entries = /* @__PURE__ */ new Map();
  const key = (owner, peer) => JSON.stringify([owner, peer]);
  return {
    get: (owner, peer) => entries.get(key(owner, peer))?.snapshot,
    set(owner, peer, snapshot) {
      const entryKey = key(owner, peer);
      entries.delete(entryKey);
      entries.set(entryKey, { owner, peer, snapshot });
      if (entries.size > MAX_CACHE_ENTRIES) entries.delete(entries.keys().next().value);
    },
    remove: (owner, peer) => {
      entries.delete(key(owner, peer));
    },
    clear(owner) {
      if (owner === void 0) entries.clear();
      else for (const [entryKey, entry] of entries) {
        if (entry.owner === owner) entries.delete(entryKey);
      }
    },
    peers: (owner) => Array.from(entries.values()).filter((entry) => entry.owner === owner).map((entry) => entry.peer)
  };
}
function createStoredOmemoDiscoveryCache(storage, prefix, onError) {
  const memory = createInMemoryOmemoDiscoveryCache();
  const loads = /* @__PURE__ */ new Map();
  const writes = /* @__PURE__ */ new Map();
  const storageKey = (owner) => `${prefix}:discovery:${owner}`;
  const persist = (owner) => {
    const entries = memory.peers(owner).map((peer) => [peer, memory.get(owner, peer)]);
    const value = JSON.stringify({ version: 1, entries });
    const write = (writes.get(owner) ?? Promise.resolve()).then(() => storage.setItem(storageKey(owner), value)).catch(onError).finally(() => {
      if (writes.get(owner) === write) writes.delete(owner);
    });
    writes.set(owner, write);
  };
  return {
    ...memory,
    load(owner) {
      const existing = loads.get(owner);
      if (existing) return existing;
      const load = (async () => {
        const raw = await storage.getItem(storageKey(owner));
        if (!raw || raw.length > 2e6) return;
        const parsed = JSON.parse(raw);
        if (parsed?.version !== 1 || !Array.isArray(parsed.entries)) return;
        for (const entry of parsed.entries.slice(-MAX_CACHE_ENTRIES)) {
          if (!Array.isArray(entry) || entry.length !== 2) continue;
          const [peer, snapshot] = entry;
          if (typeof peer !== "string" || peer.length > 1024 || !peer.includes("@")) continue;
          if (!snapshot || !Number.isFinite(snapshot.fetchedAt) || !Array.isArray(snapshot.devices)) continue;
          if (!snapshot.devices.length || snapshot.devices.length > 128) continue;
          if (!snapshot.devices.every((device) => device && Number.isSafeInteger(device.deviceId) && device.deviceId > 0 && typeof device.identityKey === "string" && /^[A-Za-z0-9+/]{43}=$/.test(device.identityKey))) continue;
          memory.set(owner, peer, snapshot);
        }
      })().catch(onError);
      loads.set(owner, load);
      return load;
    },
    set(owner, peer, snapshot) {
      memory.set(owner, peer, snapshot);
      persist(owner);
    },
    remove(owner, peer) {
      memory.remove(owner, peer);
      persist(owner);
    },
    clear(owner) {
      const owners = owner === void 0 ? Array.from(loads.keys()) : [owner];
      memory.clear(owner);
      for (const account of owners) persist(account);
    }
  };
}
function createOmemoDiscoveryReader(store, options) {
  const flights = /* @__PURE__ */ new Map();
  const versions = /* @__PURE__ */ new Map();
  const verified = /* @__PURE__ */ new Set();
  let epoch = 0;
  const key = (owner, peer) => JSON.stringify([owner, peer]);
  const refresh = (owner, peer, fetch) => {
    const entryKey = key(owner, peer);
    const existing = flights.get(entryKey);
    if (existing) return existing;
    const startedEpoch = epoch;
    const flight = (async () => {
      await store.load?.(owner);
      for (let attempt = 0; attempt < 3; attempt += 1) {
        if (startedEpoch !== epoch) throw new Error("xmpp_omemo_cache_reset");
        const version = versions.get(entryKey) ?? 0;
        const snapshot = await fetch();
        if (startedEpoch !== epoch) throw new Error("xmpp_omemo_cache_reset");
        if (version !== (versions.get(entryKey) ?? 0)) continue;
        store.set(owner, peer, snapshot);
        verified.add(entryKey);
        versions.delete(entryKey);
        return snapshot;
      }
      throw new Error("xmpp_omemo_devices_changed_during_discovery");
    })().finally(() => {
      if (flights.get(entryKey) === flight) {
        flights.delete(entryKey);
        versions.delete(entryKey);
      }
    });
    flights.set(entryKey, flight);
    return flight;
  };
  return {
    refresh,
    async get(owner, peer, fetch, onRefreshError) {
      await store.load?.(owner);
      const snapshot = store.get(owner, peer);
      const age = snapshot ? Date.now() - snapshot.fetchedAt : Infinity;
      if (snapshot && verified.has(key(owner, peer)) && age >= 0 && age < options.maxAgeMs) {
        if (age >= options.refreshAfterMs) void refresh(owner, peer, fetch).catch(onRefreshError);
        return snapshot;
      }
      return refresh(owner, peer, fetch);
    },
    invalidate(owner, peer) {
      const entryKey = key(owner, peer);
      const cached = Boolean(store.get(owner, peer));
      verified.delete(entryKey);
      if (!cached && !flights.has(entryKey)) return false;
      if (cached) store.remove(owner, peer);
      if (flights.has(entryKey)) versions.set(entryKey, (versions.get(entryKey) ?? 0) + 1);
      return true;
    },
    reset() {
      epoch += 1;
      flights.clear();
      versions.clear();
      verified.clear();
    }
  };
}

// src/index.ts
var CHAT_CONVERSATION_STATE_MESSAGE_TYPE = "CONVERSATION_STATE";
var CHAT_EMERGENCY_MESSAGE_TYPE = "EMERGENCY";
var CHAT_EMERGENCY_TYPE_SOS = "sos";
var CHAT_VOICE_MESSAGE_TYPE = "VOICE_MESSAGE";
var CHAT_REACTION_INTERACTION_TYPE = "CHAT_REACTION";
var CHAT_REACTION_EMOJIS = ["\u{1F44D}", "\u2764\uFE0F", "\u{1F602}", "\u{1F62E}", "\u{1F622}", "\u{1F64F}"];
var CHAT_EMOJI_UNICODE_VERSION = "18.0";
var CHAT_REACTION_MAX_CODE_POINTS = 64;
var EMOJI_REGEX = import_emoji_loose.default;
var CHAT_REACTION_EMOJI_SEQUENCE_PATTERN = new RegExp(`^(?:${EMOJI_REGEX.source})$`);
var STANDALONE_EMOJI_COMPONENT = /^[\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]$/u;
function isRetractionAuthorized(event, originalAuthorAddress) {
  const retractionAuthor = normalizeBareDeviceId(
    event.fromFullAddress || event.fromDeviceId
  ).toLowerCase();
  const originalAuthor = normalizeBareDeviceId(originalAuthorAddress).toLowerCase();
  return Boolean(retractionAuthor && originalAuthor && retractionAuthor === originalAuthor);
}
var CHAT_ATTACHMENT_CAPABILITY_HEADER = "x-lula-attachment-capability";
var CHAT_ATTACHMENT_CAPABILITY_EXPIRES_HEADER = "x-lula-attachment-capability-expires";
var CHAT_ATTACHMENT_ENCRYPTION_AAD = utf8ToBytes("urn:lula:defy:attachment:1");
function encryptChatAttachmentBytes(input) {
  const plaintext = input instanceof Uint8Array ? new Uint8Array(input) : new Uint8Array(input);
  const key = nobleRandomBytes(32);
  const iv = nobleRandomBytes(12);
  const ciphertext = gcm(key, iv, CHAT_ATTACHMENT_ENCRYPTION_AAD).encrypt(plaintext);
  return {
    ciphertext,
    encryption: {
      v: 1,
      alg: "A256GCM",
      keyB64: bytesToBase64(key),
      ivB64: bytesToBase64(iv),
      plaintextSha256B64: bytesToBase64(sha256(plaintext)),
      ciphertextSha256B64: bytesToBase64(sha256(ciphertext)),
      plaintextSize: plaintext.length,
      ciphertextSize: ciphertext.length
    }
  };
}
function decryptChatAttachmentBytes(input, encryption) {
  const ciphertext = input instanceof Uint8Array ? new Uint8Array(input) : new Uint8Array(input);
  const normalized = normalizeAttachmentEncryption(encryption);
  if (!normalized) throw new Error("chat_attachment_encryption_invalid");
  if (ciphertext.length !== normalized.ciphertextSize) {
    throw new Error("chat_attachment_ciphertext_size_mismatch");
  }
  if (bytesToBase64(sha256(ciphertext)) !== normalized.ciphertextSha256B64) {
    throw new Error("chat_attachment_ciphertext_hash_mismatch");
  }
  let plaintext;
  try {
    plaintext = gcm(
      base64ToBytes(normalized.keyB64),
      base64ToBytes(normalized.ivB64),
      CHAT_ATTACHMENT_ENCRYPTION_AAD
    ).decrypt(ciphertext);
  } catch {
    throw new Error("chat_attachment_decryption_failed");
  }
  if (plaintext.length !== normalized.plaintextSize) {
    throw new Error("chat_attachment_plaintext_size_mismatch");
  }
  if (bytesToBase64(sha256(plaintext)) !== normalized.plaintextSha256B64) {
    throw new Error("chat_attachment_plaintext_hash_mismatch");
  }
  return plaintext;
}
function isEncryptedChatAttachment(attachment) {
  return Boolean(normalizeAttachmentEncryption(attachment.encryption));
}
function hasChatAttachmentDownloadCapability(attachment) {
  return Boolean(
    normalizeAttachmentDownloadCapability(attachment.downloadCapability)
  );
}
function readAttachmentResponseHeader(headers, name) {
  if (typeof headers.get === "function") {
    return headers.get(name)?.trim() || void 0;
  }
  const expected = name.toLowerCase();
  for (const [headerName, rawValue] of Object.entries(headers)) {
    if (headerName.toLowerCase() !== expected) continue;
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    return value?.trim() || void 0;
  }
  return void 0;
}
function chatAttachmentDownloadCapabilityFromHeaders(headers) {
  const authorization = readAttachmentResponseHeader(
    headers,
    CHAT_ATTACHMENT_CAPABILITY_HEADER
  );
  const expiresRaw = readAttachmentResponseHeader(
    headers,
    CHAT_ATTACHMENT_CAPABILITY_EXPIRES_HEADER
  );
  const expiresEpochSeconds = Number.parseInt(expiresRaw ?? "", 10);
  if (!authorization || !/^LulaAttachment\s+v1\.[A-Za-z0-9._-]+$/.test(authorization) || !Number.isSafeInteger(expiresEpochSeconds) || expiresEpochSeconds <= 0) {
    throw new Error("chat_attachment_download_capability_invalid");
  }
  return {
    v: 1,
    scheme: "LulaAttachment",
    authorization,
    expiresAt: new Date(expiresEpochSeconds * 1e3).toISOString()
  };
}
function buildChatAttachmentDownloadRequest(attachment) {
  const url = firstString(attachment.url, attachment.id);
  if (!url || !/^https?:\/\//i.test(url)) {
    throw new Error("chat_attachment_download_locator_invalid");
  }
  const capability = normalizeAttachmentDownloadCapability(
    attachment.downloadCapability
  );
  if (!capability) {
    throw new Error("chat_attachment_download_capability_required");
  }
  if (Date.parse(capability.expiresAt) <= Date.now()) {
    throw new Error("chat_attachment_download_capability_expired");
  }
  return {
    url,
    headers: { Authorization: capability.authorization }
  };
}
function requiredAttachmentFetch(fetchOverride) {
  const fetchImpl = fetchOverride ?? globalThis.fetch;
  if (typeof fetchImpl !== "function") {
    throw new Error("chat_attachment_fetch_unavailable");
  }
  return fetchImpl.bind(globalThis);
}
function stableChatAttachmentLocator(sourceUrl) {
  try {
    const parsed = new URL(sourceUrl);
    for (const key of [
      "v",
      "v2",
      "token",
      "size",
      "content_type",
      "expires",
      "slot",
      "username"
    ]) {
      parsed.searchParams.delete(key);
    }
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return sourceUrl;
  }
}
async function uploadChatAttachmentWithFetch(input, context, options = {}) {
  const bytes = input.data ?? await options.loadBytes?.(input);
  if (!(bytes instanceof ArrayBuffer) && !(bytes instanceof Uint8Array)) {
    throw new Error("chat_attachment_bytes_required");
  }
  const name = firstString(input.name) ?? `attachment-${Date.now()}.bin`;
  const mimeType = firstString(input.mimeType) ?? "application/octet-stream";
  const encrypted = encryptChatAttachmentBytes(bytes);
  const encryptedName = `${name.replace(/[^\w.-]/g, "_").slice(-96) || "attachment"}.lulaenc`;
  const slot = await context.requestSlot({
    name: encryptedName,
    mimeType: "application/octet-stream",
    size: encrypted.encryption.ciphertextSize
  });
  const response = await requiredAttachmentFetch(options.fetch)(slot.putUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
      ...slot.headers
    },
    body: encrypted.ciphertext
  });
  if (!response.ok) {
    throw new Error(`chat_attachment_upload_failed:${response.status}`);
  }
  const downloadCapability = chatAttachmentDownloadCapabilityFromHeaders(
    response.headers
  );
  const stableLocator = stableChatAttachmentLocator(slot.getUrl.trim());
  if (!/^https?:\/\//i.test(stableLocator)) {
    throw new Error("chat_attachment_download_locator_invalid");
  }
  return normalizeRequiredAttachment({
    id: stableLocator,
    type: mimeType.startsWith("image/") ? "image" : "file",
    name,
    mimeType,
    size: encrypted.encryption.plaintextSize,
    url: stableLocator,
    metadata: input.metadata,
    encryption: encrypted.encryption,
    downloadCapability
  });
}
async function downloadChatAttachmentWithFetch(attachment, options = {}) {
  const request = buildChatAttachmentDownloadRequest(attachment);
  const response = await requiredAttachmentFetch(options.fetch)(request.url, {
    method: "GET",
    headers: request.headers
  });
  if (!response.ok) {
    throw new Error(`chat_attachment_download_failed:${response.status}`);
  }
  const downloaded = new Uint8Array(await response.arrayBuffer());
  return attachment.encryption ? decryptChatAttachmentBytes(downloaded, attachment.encryption) : downloaded;
}
var CHAT_VOICE_SPEC = {
  /** AAC-LC in MP4, the container every platform can play. */
  mimeType: "audio/mp4",
  /** The same container with the codec spelled out, as `MediaRecorder` wants it. */
  codecMimeType: "audio/mp4;codecs=mp4a.40.2",
  extension: "m4a",
  sampleRate: 44100,
  channels: 1,
  bitsPerSecond: 128e3,
  /** Shorter than this is a mis-click, not a message. */
  minDurationMs: 700
};
function getChatVoiceRecorderWebOptions() {
  return {
    constraints: { audio: { channelCount: CHAT_VOICE_SPEC.channels } },
    recorder: {
      mimeType: CHAT_VOICE_SPEC.codecMimeType,
      audioBitsPerSecond: CHAT_VOICE_SPEC.bitsPerSecond
    }
  };
}
function getChatVoiceRecorderExpoOptions() {
  return {
    extension: `.${CHAT_VOICE_SPEC.extension}`,
    sampleRate: CHAT_VOICE_SPEC.sampleRate,
    numberOfChannels: CHAT_VOICE_SPEC.channels,
    bitRate: CHAT_VOICE_SPEC.bitsPerSecond,
    android: { outputFormat: "mpeg4", audioEncoder: "aac" },
    ios: {
      // `IOSOutputFormat.MPEG4AAC` — a FourCC, trailing space included.
      outputFormat: "aac ",
      // `AudioQuality.MAX`.
      audioQuality: 127,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false
    }
  };
}
var CHAT_AUDIO_EXTENSION_PATTERN = /\.(aac|caf|m4a|mp3|ogg|opus|wav|webm)$/i;
function isChatAudioAttachment(attachment) {
  if (attachment.mimeType?.trim().toLowerCase().startsWith("audio/")) {
    return true;
  }
  return CHAT_AUDIO_EXTENSION_PATTERN.test(String(attachment.name ?? ""));
}
function getChatVoiceDurationMs(metadata) {
  if (!metadata) {
    return void 0;
  }
  if (metadata.voiceMessage !== true && metadata.messageType !== CHAT_VOICE_MESSAGE_TYPE) {
    return void 0;
  }
  const value = metadata.voiceDurationMs;
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : void 0;
}
function normalizeVoiceMimeType(value) {
  return (value ?? "").split(";")[0].trim().toLowerCase();
}
function normalizeVoiceAttachmentName(name) {
  const suffix = `.${CHAT_VOICE_SPEC.extension}`;
  const trimmed = name?.trim();
  if (trimmed && trimmed.toLowerCase().endsWith(suffix)) {
    return trimmed;
  }
  const base = trimmed?.replace(/\.[^./\\]+$/, "").trim();
  return `${base || `voice-${Date.now()}`}${suffix}`;
}
function normalizeInteractionActorId(value) {
  const normalized = (String(value ?? "").trim().split("/")[0] ?? "").toLowerCase();
  if (!normalized) return "";
  const localpart = normalized.split("@")[0] ?? normalized;
  const appUserMatch = /^i\.([^.]+)(?:\.d\..+)?$/.exec(localpart);
  return appUserMatch?.[1] ?? normalized;
}
function isChatReactionEmoji(value) {
  if (typeof value !== "string") return false;
  const normalized = value.trim();
  return normalized.length > 0 && !/\s/u.test(normalized) && Array.from(normalized).length <= CHAT_REACTION_MAX_CODE_POINTS && !STANDALONE_EMOJI_COMPONENT.test(normalized) && CHAT_REACTION_EMOJI_SEQUENCE_PATTERN.test(normalized);
}
function getMessageInteractionId(message) {
  return firstString(message.metadata?.canonicalEventId, message.id) ?? "";
}
function parseChatReplyReference(metadata) {
  if (!metadata || !isRecord(metadata.replyTo)) return void 0;
  const messageId = firstString(metadata.replyTo.messageId);
  const body = firstString(metadata.replyTo.body);
  if (!messageId || !body) return void 0;
  const senderId = firstString(metadata.replyTo.senderId);
  const senderDisplayName = firstString(metadata.replyTo.senderDisplayName);
  return {
    messageId,
    body,
    ...senderId ? { senderId } : {},
    ...senderDisplayName ? { senderDisplayName } : {}
  };
}
function parseChatReactionEvent(message) {
  const metadata = message.metadata;
  if (!metadata || metadata.chatInteractionType !== CHAT_REACTION_INTERACTION_TYPE) {
    return void 0;
  }
  const targetMessageId = firstString(metadata.reactionToId);
  const emoji = typeof metadata.reactionEmoji === "string" ? metadata.reactionEmoji.trim() : metadata.reactionEmoji;
  const actorId = normalizeInteractionActorId(
    firstString(metadata.reactionActorId, message.senderId, message.fromUserId)
  );
  if (!targetMessageId || !isChatReactionEmoji(emoji) || !actorId) return void 0;
  return {
    targetMessageId,
    emoji,
    actorId,
    removed: metadata.reactionRemoved === true
  };
}
function isChatReactionControlMessage(message) {
  return message.metadata?.chatInteractionType === CHAT_REACTION_INTERACTION_TYPE;
}
function buildChatInteractionTimeline(messages, currentActorId) {
  const reactionActorsByMessage = /* @__PURE__ */ new Map();
  messages.forEach((message) => {
    const event = parseChatReactionEvent(message);
    if (!event) return;
    const reactions = reactionActorsByMessage.get(event.targetMessageId) ?? /* @__PURE__ */ new Map();
    const actors = reactions.get(event.emoji) ?? /* @__PURE__ */ new Set();
    if (event.removed) actors.delete(event.actorId);
    else actors.add(event.actorId);
    reactions.set(event.emoji, actors);
    reactionActorsByMessage.set(event.targetMessageId, reactions);
  });
  const normalizedCurrentActorId = normalizeInteractionActorId(currentActorId);
  const timeline = [];
  messages.forEach((message) => {
    if (isChatReactionControlMessage(message)) return;
    const interactionId = getMessageInteractionId(message);
    const reactionActors = reactionActorsByMessage.get(interactionId);
    const reactions = [];
    const quickEmojis = CHAT_REACTION_EMOJIS;
    const orderedEmojis = [
      ...CHAT_REACTION_EMOJIS.filter((emoji) => reactionActors?.has(emoji)),
      ...Array.from(reactionActors?.keys() ?? []).filter(
        (emoji) => !quickEmojis.includes(emoji)
      )
    ];
    orderedEmojis.forEach((emoji) => {
      const actorIds = Array.from(reactionActors?.get(emoji) ?? []);
      if (actorIds.length === 0) return;
      reactions.push({
        emoji,
        count: actorIds.length,
        actorIds,
        reactedByCurrentUser: Boolean(normalizedCurrentActorId) && actorIds.includes(normalizedCurrentActorId)
      });
    });
    const replyTo = parseChatReplyReference(message.metadata);
    timeline.push({
      ...message,
      interactionId,
      reactions,
      ...replyTo ? { replyTo } : {}
    });
  });
  return timeline;
}
var XMPP_CHAT_NS = "urn:lula:defy:chat:1";
var XMPP_MESSAGE_TIME_NS = "urn:lulafi:message-time:1";
var XMPP_RECEIPTS_NS = "urn:xmpp:receipts";
var XMPP_CHAT_MARKERS_NS = "urn:xmpp:chat-markers:0";
var XMPP_CHATSTATES_NS = "http://jabber.org/protocol/chatstates";
var XMPP_HTTP_UPLOAD_NS = "urn:xmpp:http:upload:0";
var XMPP_CARBONS_NS = "urn:xmpp:carbons:2";
var XMPP_FORWARD_NS = "urn:xmpp:forward:0";
var XMPP_FALLBACK_NS = "urn:xmpp:fallback:0";
var XMPP_HINTS_NS = "urn:xmpp:hints";
var XMPP_RETRACT_NS = "urn:xmpp:message-retract:1";
var XMPP_STREAM_MANAGEMENT_NS = "urn:xmpp:sm:3";
var XMPP_STABLE_ID_NS = "urn:xmpp:sid:0";
var XMPP_MUC_NS = "http://jabber.org/protocol/muc";
var XMPP_MUC_USER_NS = "http://jabber.org/protocol/muc#user";
var XMPP_PUBSUB_EVENT_NS = "http://jabber.org/protocol/pubsub#event";
var XMPP_MUCSUB_MESSAGES_NODE = "urn:xmpp:mucsub:nodes:messages";
var XMPP_MUC_SENDER_NS = "urn:lulafi:muc-sender:1";
var XMPP_DIRECT_MUC_INVITE_NS = "jabber:x:conference";
var XMPP_EMERGENCY_NS = "urn:lulafi:emergency:1";
var XMPP_SERVER_EVENT_NS = "urn:lulafi:server-event:1";
var OMEMO_NS = "eu.siacs.conversations.axolotl";
var OMEMO_DEVICELIST_NODE = "eu.siacs.conversations.axolotl.devicelist";
var OMEMO_BUNDLE_NODE_PREFIX = "eu.siacs.conversations.axolotl.bundles:";
var OMEMO_AES_KEY_BYTES = 16;
var OMEMO_KEY_WRAP_BYTES = 16;
var OMEMO_KEY_WRAP_BUNDLE_BYTES = OMEMO_KEY_WRAP_BYTES * 2;
var OMEMO_INFO = new TextEncoder().encode("lula-defy-omemo-v1");
var OMEMO_WRAP_INFO = new TextEncoder().encode("lula-defy-omemo-wrap-v1");
var PUBSUB_NS = "http://jabber.org/protocol/pubsub";
var XDATA_NS = "jabber:x:data";
var DEFAULT_CONNECT_TIMEOUT_MS = 15e3;
var DEFAULT_IQ_TIMEOUT_MS = 15e3;
var DEFAULT_MUC_JOIN_TIMEOUT_MS = 15e3;
var MUC_JOIN_RETRY_DELAYS_MS = [500, 1e3, 2e3, 4e3, 8e3, 16e3];
var OMEMO_IQ_TIMEOUT_MS = 1e4;
var OMEMO_IQ_MAX_ATTEMPTS = 3;
var OMEMO_IQ_RETRY_DELAY_MS = 250;
var DEFAULT_TYPING_AUTO_PAUSE_MS = 1e4;
var DEFAULT_OMEMO_STATE_KEY_PREFIX = "chat_sdk_omemo_state";
var DEFAULT_XMPP_WEBSOCKET_PATH = "/chat/websocket";
var MAX_RUNTIME_MESSAGE_AUTHORS_PER_ROOM = 500;
var MAX_RUNTIME_MESSAGE_AUTHOR_ROOMS = 100;
var MAX_PENDING_RETRACTIONS_PER_ROOM = 200;
var MAX_PENDING_RETRACTION_ROOMS = 100;
var CHAT_LOG_LEVEL_WEIGHT = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
};
var createRuntimeIdSuffix = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);
var createDeviceIdSuffix = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 16);
var XOauth2Mechanism = class {
  name = "X-OAUTH2";
  clientFirst = true;
  response({
    username,
    password
  }) {
    return `\0${String(username || "")}\0${String(password || "")}`;
  }
  challenge() {
    return this;
  }
};
var xOAuth2Registered = false;
function registerXOAuth2Preference() {
  if (xOAuth2Registered) return;
  const moduleValue = saslMechanisms;
  const Factory = moduleValue.Factory ?? moduleValue.default?.Factory;
  const prototype = Factory?.prototype;
  const originalUse = prototype?.use;
  if (!prototype || typeof originalUse !== "function") return;
  prototype.use = function patchedUse() {
    const result = originalUse.apply(this, arguments);
    const index = this._mechs?.findIndex(
      (entry) => String(entry?.name || "").toUpperCase() === "X-OAUTH2"
    );
    if (typeof index === "number" && index > 0) {
      const [entry] = this._mechs.splice(index, 1);
      if (entry) this._mechs.unshift(entry);
    }
    return result;
  };
  xOAuth2Registered = true;
}
function init(config) {
  return new LulaChatClient(config);
}
function createChatClient(config) {
  return init(config);
}
function createDeviceId(options = {}) {
  const prefix = normalizeDeviceIdSegment(options.prefix) ?? "";
  return `${prefix}${createDeviceIdSuffix()}`;
}
function getChatAddress(input) {
  const domain = normalizeXmppDomain(input.xmppDomain);
  if (!domain) throw new Error("chat_xmpp_domain_required");
  const userId = normalizeUserIdSegment(input.userId);
  if (!userId) throw new Error("chat_user_id_required");
  const localDeviceId = normalizeDeviceIdSegment(input.deviceId);
  if (!localDeviceId) throw new Error("chat_device_id_required");
  const resource = normalizeResourceSegment(localDeviceId);
  const localpart = buildXmppUserLocalpart(userId);
  const raw = buildXmppUserResourceAddress(userId, domain, resource);
  const address = buildXmppUserAddress(userId, domain);
  return {
    raw,
    address,
    userId,
    deviceId: localDeviceId,
    localpart,
    domain
  };
}
function getChatUserId(input) {
  const domain = normalizeXmppDomain(input.domain);
  if (!domain) throw new Error("chat_xmpp_domain_required");
  const userId = normalizeUserIdSegment(input.username);
  if (!userId) throw new Error("chat_user_id_required");
  return buildXmppUserAddress(userId, domain);
}
function getChatDeviceId(input) {
  const bareUserJid = getChatUserId(input);
  const resource = normalizeResourceSegment(input.deviceId ?? input.deviceName ?? "");
  return `${bareUserJid}/${resource}`;
}
function createRoomDirectory(options) {
  const roomCache = /* @__PURE__ */ new Map();
  const rememberRoom = (room) => {
    roomCache.set(room.roomId, room);
    if (room.id) roomCache.set(room.id, room);
    return room;
  };
  return {
    getPeerDeviceIds: async (roomId) => {
      const normalizedRoomId = roomId.trim();
      if (!normalizedRoomId) return [];
      const cached = roomCache.get(normalizedRoomId);
      const cachedDeviceIds = normalizeTransportAddressList([
        ...cached?.peerDeviceIds ?? [],
        ...cached?.ownDeviceIds ?? []
      ]);
      if (cachedDeviceIds.length) return cachedDeviceIds;
      if (!options.getRoom) return [];
      const room = normalizeChatRoomResponse(await options.getRoom(normalizedRoomId), options);
      return deriveRoomDeviceIds(room);
    },
    getOrCreateRoom: options.getOrCreateRoom ? async (input) => {
      const room = normalizeChatRoomResponse(await options.getOrCreateRoom(input), options);
      return rememberRoom(room);
    } : void 0
  };
}
var LulaChatClient = class {
  config;
  messageListeners = /* @__PURE__ */ new Set();
  groupInvitationListeners = /* @__PURE__ */ new Set();
  typingListeners = /* @__PURE__ */ new Set();
  threadGoneListeners = /* @__PURE__ */ new Set();
  serverEventListeners = /* @__PURE__ */ new Set();
  retractionListeners = /* @__PURE__ */ new Set();
  deliveryListeners = /* @__PURE__ */ new Set();
  serverAcknowledgementListeners = /* @__PURE__ */ new Set();
  serverSendFailureListeners = /* @__PURE__ */ new Set();
  streamManagementListeners = /* @__PURE__ */ new Set();
  errorListeners = /* @__PURE__ */ new Set();
  statusListeners = /* @__PURE__ */ new Set();
  xmpp = null;
  status = "idle";
  connectPromise = null;
  onlineReadinessPromise = null;
  pendingIqMap = /* @__PURE__ */ new Map();
  groupRooms = /* @__PURE__ */ new Map();
  groupRoomIdsByMucJid = /* @__PURE__ */ new Map();
  joinedGroupRooms = /* @__PURE__ */ new Set();
  mucOccupantRealJids = /* @__PURE__ */ new Map();
  pendingGroupJoins = /* @__PURE__ */ new Map();
  groupJoinRetryTimers = /* @__PURE__ */ new Map();
  groupJoinRetryAttempts = /* @__PURE__ */ new Map();
  serverAckWaiters = /* @__PURE__ */ new Map();
  serverMessageTimestamps = /* @__PURE__ */ new Map();
  onlineDeviceId;
  roomPeers = /* @__PURE__ */ new Map();
  editTargets = /* @__PURE__ */ new Map();
  pendingEdits = /* @__PURE__ */ new Map();
  messageAuthorsByRoom = /* @__PURE__ */ new Map();
  pendingRetractionsByRoom = /* @__PURE__ */ new Map();
  typingAutoPauseTimers = /* @__PURE__ */ new Map();
  constructor(config) {
    this.config = normalizeConfig(config);
  }
  async connect() {
    if (this.status === "online" && this.xmpp) return;
    if (this.connectPromise) return this.connectPromise;
    this.log("debug", "chat_connect_requested", {
      status: this.status,
      deviceId: this.config.localDeviceId,
      domain: this.config.domain
    });
    this.connectPromise = this.connectFresh();
    try {
      await this.connectPromise;
    } finally {
      this.connectPromise = null;
    }
  }
  async stop() {
    this.log("info", "chat_stop_requested", { status: this.status });
    this.config.encryption?.onDisconnect?.(this.getEncryptionContext());
    this.setStatus("stopping");
    for (const timer of this.typingAutoPauseTimers.values()) {
      clearTimeout(timer);
    }
    this.typingAutoPauseTimers.clear();
    const current = this.xmpp;
    this.xmpp = null;
    this.onlineDeviceId = void 0;
    this.onlineReadinessPromise = null;
    this.joinedGroupRooms.clear();
    this.mucOccupantRealJids.clear();
    this.clearAllGroupJoinRetries();
    this.rejectPendingGroupJoins(new Error("chat_client_stopped"));
    this.rejectPendingIq(new Error("chat_client_stopped"));
    this.rejectServerAckWaiters(new Error("chat_client_stopped"));
    if (current) {
      current.reconnect.stop();
      await current.stop();
    }
    this.setStatus("offline");
    this.log("info", "chat_stopped");
  }
  async joinGroupRoom(room) {
    const normalized = this.normalizeGroupRoom(room);
    this.rememberGroupRoom(normalized);
    try {
      await this.connect();
      await this.ensureGroupRoomJoined(normalized.roomId);
    } catch (error) {
      this.scheduleGroupJoinRetry(normalized.roomId);
      throw error;
    }
  }
  async updateGroupRoom(room) {
    const normalized = this.normalizeGroupRoom(room);
    this.rememberGroupRoom(normalized);
    if (this.status === "online") {
      try {
        await this.ensureGroupRoomJoined(normalized.roomId);
      } catch (error) {
        this.scheduleGroupJoinRetry(normalized.roomId);
        throw error;
      }
    }
  }
  async leaveGroupRoom(roomId) {
    const normalizedRoomId = roomId.trim();
    if (!normalizedRoomId) throw new Error("chat_room_id_required");
    const room = this.groupRooms.get(normalizedRoomId);
    if (!room) return;
    if (this.xmpp && this.joinedGroupRooms.has(normalizedRoomId)) {
      await this.xmpp.send(
        xml("presence", {
          to: `${room.mucJid}/${this.getGroupNickname(room)}`,
          type: "unavailable"
        })
      );
    }
    this.joinedGroupRooms.delete(normalizedRoomId);
    this.clearGroupJoinRetry(normalizedRoomId);
    this.groupRooms.delete(normalizedRoomId);
    this.groupRoomIdsByMucJid.delete(normalizeBareDeviceId(room.mucJid));
  }
  async getPeerDeviceIds(roomId) {
    const deviceIds = await this.resolveRoomDeviceIds(roomId);
    this.log("debug", "chat_peer_device_ids_resolved", {
      roomId,
      deviceCount: deviceIds.length
    });
    return deviceIds;
  }
  async getOrCreateRoom(inputOrUserId, metadata) {
    const input = typeof inputOrUserId === "string" ? { userId: inputOrUserId, metadata } : inputOrUserId;
    const room = await this.resolveRoomForUserId(input);
    this.log("debug", "chat_room_resolved_for_user", {
      userId: input.userId,
      roomId: room.roomId
    });
    return room;
  }
  async sendChatMessage(inputOrRoomId, body, options) {
    const input = typeof inputOrRoomId === "string" ? { ...options ?? {}, roomId: inputOrRoomId, body: body ?? "" } : inputOrRoomId;
    const metadata = buildChatMessageMetadata({
      ...input,
      displayName: this.config.displayName
    });
    const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata);
    return this.sendMessageInput(
      {
        ...input,
        metadata,
        targetRoomId: input.targetRoomId ?? providerDirectMessageRoomId ?? input.roomId
      },
      "user"
    );
  }
  async editMessage(input) {
    if (!input.roomId.trim() || !input.targetMessageId.trim())
      throw new Error("chat_edit_original_not_found");
    if (input.attachments?.length) throw new Error("chat_edit_not_allowed");
    if (input.serverAcceptedAt !== void 0 && (!input.id || !Number.isFinite(input.serverAcceptedAt) || input.serverAcceptedAt <= 0)) {
      throw new Error("chat_edit_acceptance_invalid");
    }
    return this.sendMessageInput(
      {
        ...input,
        metadata: buildChatMessageMetadata({
          ...input,
          displayName: this.config.displayName,
          metadata: { ...input.metadata, edited: true, replacesId: input.targetMessageId }
        })
      },
      "user",
      input.serverAcceptedAt
    );
  }
  async sendEmergency(input) {
    const alertId = input.alertId.trim();
    if (!alertId) throw new Error("chat_emergency_alert_id_required");
    const emergencyType = input.emergencyType ?? CHAT_EMERGENCY_TYPE_SOS;
    if (emergencyType !== CHAT_EMERGENCY_TYPE_SOS) {
      throw new Error("chat_emergency_type_invalid");
    }
    const triggeredAt = normalizeIsoDate(input.triggeredAt) ?? (/* @__PURE__ */ new Date()).toISOString();
    const metadata = buildChatMessageMetadata({
      ...input,
      metadata: {
        ...input.metadata ?? {},
        messageType: CHAT_EMERGENCY_MESSAGE_TYPE,
        emergencyType,
        emergencyAlertId: alertId,
        emergencyTriggeredAt: triggeredAt
      },
      displayName: this.config.displayName
    });
    const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata);
    return this.sendMessageInput(
      {
        ...input,
        metadata,
        targetRoomId: input.targetRoomId ?? providerDirectMessageRoomId ?? input.roomId
      },
      "user"
    );
  }
  sendReply(input) {
    const { replyTo, metadata, ...message } = input;
    return this.sendChatMessage({
      ...message,
      metadata: { ...metadata ?? {}, replyTo }
    });
  }
  addReaction(input) {
    return this.sendReaction(input, false);
  }
  removeReaction(input) {
    return this.sendReaction(input, true);
  }
  async retractMessage(input) {
    const targetMessageId = input.messageId.trim();
    if (!targetMessageId) throw new Error("chat_retraction_target_required");
    const roomId = input.roomId?.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    await this.connect();
    const id = input.id || `retract-${generateMessageId()}`;
    const targetRoomId = input.targetRoomId?.trim() || roomId;
    const targetScope = input.targetScope ?? "user";
    const groupRoom = this.getGroupRoomForTransport(targetRoomId) ?? this.getGroupRoomForTransport(roomId);
    if (groupRoom) {
      await this.ensureGroupRoomJoined(groupRoom.roomId);
    }
    const targetDeviceIds = groupRoom ? [groupRoom.mucJid] : await this.resolveRoomTargets({
      roomId: targetRoomId,
      explicitDeviceIds: collectTargetDeviceIds(input),
      targetScope
    });
    const fallbackBody = "/me retracted a previous message.";
    const metadata = normalizeMessageMetadata(void 0, "CHAT_MESSAGE");
    await this.sendToTargets(targetDeviceIds, async (toDeviceId) => {
      const encodedPayload = await this.encodePayload({
        toDeviceId,
        ...groupRoom ? { recipientJids: this.getGroupEncryptionRecipientJids(groupRoom) } : {},
        body: fallbackBody,
        metadata
      });
      const children = [
        xml("body", {}, encodedPayload.body ?? fallbackBody),
        ...encodedPayload.children,
        xml("thread", {}, roomId),
        xml("retract", { xmlns: XMPP_RETRACT_NS, id: targetMessageId }),
        xml("fallback", { xmlns: XMPP_FALLBACK_NS, for: XMPP_RETRACT_NS }),
        xml("store", { xmlns: XMPP_HINTS_NS })
      ];
      await this.requireXmpp().send(
        xml(
          "message",
          { to: toDeviceId, type: groupRoom ? "groupchat" : "chat", id },
          ...children
        )
      );
    });
    this.rememberRoomPeers(roomId, targetDeviceIds);
    if (targetRoomId !== roomId) {
      this.rememberRoomPeers(targetRoomId, targetDeviceIds);
    }
    this.log("info", "chat_message_retraction_sent", {
      id,
      targetMessageId,
      roomId,
      targetCount: targetDeviceIds.length
    });
    return id;
  }
  sendReaction(input, removed) {
    const { targetMessageId, emoji, actorId, metadata, ...message } = input;
    const normalizedTargetMessageId = targetMessageId.trim();
    const normalizedEmoji = emoji.trim();
    if (!normalizedTargetMessageId) throw new Error("chat_reaction_target_required");
    if (!isChatReactionEmoji(normalizedEmoji)) throw new Error("chat_reaction_emoji_invalid");
    const normalizedActorId = normalizeInteractionActorId(actorId ?? this.config.userId);
    if (!normalizedActorId) throw new Error("chat_reaction_actor_required");
    return this.sendChatMessage({
      ...message,
      body: normalizedEmoji,
      metadata: {
        ...metadata ?? {},
        chatInteractionType: CHAT_REACTION_INTERACTION_TYPE,
        reactionToId: normalizedTargetMessageId,
        reactionEmoji: normalizedEmoji,
        reactionRemoved: removed,
        reactionActorId: normalizedActorId
      }
    });
  }
  async sendFormSubmission(input) {
    const metadata = buildFormSubmissionMetadata({
      ...input,
      displayName: this.config.displayName
    });
    const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata);
    return this.sendMessageInput(
      {
        ...pickMessageTargetInput(input),
        body: JSON.stringify(input.payload, null, input.pretty ? 2 : void 0),
        metadata,
        targetRoomId: input.targetRoomId ?? providerDirectMessageRoomId ?? input.roomId
      },
      "user"
    );
  }
  async sendConversationState(input) {
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    if (input.conversationType !== "form_submission") {
      throw new Error("chat_conversation_type_invalid");
    }
    if (input.state !== "open" && input.state !== "closed") {
      throw new Error("chat_conversation_state_invalid");
    }
    const changedAt = normalizeIsoDate(input.changedAt) ?? (/* @__PURE__ */ new Date()).toISOString();
    const metadata = normalizeMessageMetadata(
      {
        ...input.metadata ?? {},
        conversationType: input.conversationType,
        conversationState: input.state,
        conversationId: trimToUndefined(input.conversationId),
        conversationChangedAt: changedAt
      },
      CHAT_CONVERSATION_STATE_MESSAGE_TYPE
    );
    const legacyId = await this.sendMessageInput(
      {
        toDeviceId: input.toDeviceId,
        toDeviceIds: input.toDeviceIds,
        peerDeviceId: input.peerDeviceId,
        peerDeviceIds: input.peerDeviceIds,
        roomId,
        targetRoomId: input.targetRoomId,
        targetScope: input.targetScope,
        id: input.id,
        requestReceipt: input.requestReceipt,
        body: input.state === "closed" ? "Conversation closed" : "Conversation reopened",
        metadata
      },
      "user"
    );
    if (input.state === "closed") {
      try {
        await this.sendThreadGone({
          toDeviceId: input.toDeviceId,
          toDeviceIds: input.toDeviceIds,
          peerDeviceId: input.peerDeviceId,
          peerDeviceIds: input.peerDeviceIds,
          roomId,
          targetRoomId: input.targetRoomId,
          targetScope: input.targetScope,
          id: input.id ? `${input.id}-gone` : void 0
        });
      } catch (error) {
        this.log("warn", "chat_thread_gone_compat_send_failed", {
          roomId,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    return legacyId;
  }
  async uploadAttachment(inputOrRoomId, attachment) {
    const input = typeof inputOrRoomId === "string" ? { roomId: inputOrRoomId, attachment } : inputOrRoomId;
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    if (!input.attachment) throw new Error("chat_attachment_required");
    await this.connect();
    const context = this.getAttachmentUploadContext(roomId);
    const uploaded = this.config.attachmentService?.upload ? await this.config.attachmentService.upload(input.attachment, context) : await uploadChatAttachmentWithFetch(input.attachment, context);
    const normalized = normalizeRequiredAttachment(uploaded);
    if (this.config.requireEncryptedAttachments && !isEncryptedChatAttachment(normalized)) {
      throw new Error("chat_attachment_encryption_required");
    }
    if (this.config.requireEncryptedAttachments && !hasChatAttachmentDownloadCapability(normalized)) {
      throw new Error("chat_attachment_download_capability_required");
    }
    return normalized;
  }
  async sendAttachment(inputOrRoomId, attachment, options) {
    const input = typeof inputOrRoomId === "string" ? { ...options ?? {}, roomId: inputOrRoomId, attachment } : inputOrRoomId;
    const { attachment: attachmentUpload, ...message } = input;
    return this.sendAttachments({
      ...message,
      attachments: [attachmentUpload]
    });
  }
  async sendAttachments(inputOrRoomId, attachments, options) {
    const input = typeof inputOrRoomId === "string" ? { ...options ?? {}, roomId: inputOrRoomId, attachments: attachments ?? [] } : inputOrRoomId;
    const roomId = input.roomId?.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    if (!Array.isArray(input.attachments) || input.attachments.length === 0) {
      throw new Error("chat_attachments_required");
    }
    const uploadedAttachments = [];
    for (const attachmentUpload of input.attachments) {
      if (!attachmentUpload) throw new Error("chat_attachment_required");
      uploadedAttachments.push(
        await this.uploadAttachment({ roomId, attachment: attachmentUpload })
      );
    }
    const firstAttachment = uploadedAttachments[0];
    const metadata = buildChatMessageMetadata({
      ...input,
      roomId,
      metadata: {
        ...input.metadata ?? {},
        attachment: true,
        attachmentCount: uploadedAttachments.length,
        ...uploadedAttachments.length === 1 && firstAttachment?.mimeType ? { mimeType: firstAttachment.mimeType } : {},
        ...uploadedAttachments.length === 1 && typeof firstAttachment?.size === "number" ? { size: firstAttachment.size } : {}
      },
      displayName: this.config.displayName
    });
    const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata);
    const { attachments: _attachmentUploads, ...message } = input;
    return this.sendMessageInput(
      {
        ...message,
        roomId,
        body: input.body ?? "",
        attachments: uploadedAttachments,
        metadata,
        targetRoomId: input.targetRoomId ?? providerDirectMessageRoomId ?? roomId
      },
      "user"
    );
  }
  /**
   * Send a recording as a voice message.
   *
   * Only container and duration are checked — they are the two things that can
   * break a message. Sample rate, channels and bit rate do not affect playback,
   * and the SDK is handed a file URI rather than bytes on React Native, so it
   * could not read them back regardless; the recorder helpers above are what
   * keep those aligned.
   */
  async sendVoiceMessage(input) {
    const { attachment, durationMs, metadata: callerMetadata, ...message } = input;
    if (!attachment) {
      throw new Error("chat_attachment_required");
    }
    if (normalizeVoiceMimeType(attachment.mimeType) !== CHAT_VOICE_SPEC.mimeType) {
      throw new Error("chat_voice_mime_type_invalid");
    }
    const roundedDurationMs = Math.round(durationMs);
    if (!Number.isFinite(roundedDurationMs) || roundedDurationMs < CHAT_VOICE_SPEC.minDurationMs) {
      throw new Error("chat_voice_duration_too_short");
    }
    const voiceMetadata = {
      voiceMessage: true,
      voiceDurationMs: roundedDurationMs,
      messageType: firstString(callerMetadata?.messageType) ?? CHAT_VOICE_MESSAGE_TYPE
    };
    return this.sendAttachments({
      ...message,
      attachments: [
        {
          ...attachment,
          name: normalizeVoiceAttachmentName(attachment.name),
          // The codec parameter belongs to the recorder, not the wire.
          mimeType: CHAT_VOICE_SPEC.mimeType,
          metadata: { ...attachment.metadata ?? {}, ...voiceMetadata }
        }
      ],
      body: "",
      metadata: { ...callerMetadata ?? {}, ...voiceMetadata }
    });
  }
  async sendMessage(inputOrRoomId, body, options) {
    const input = typeof inputOrRoomId === "string" ? { ...options ?? {}, roomId: inputOrRoomId, body: body ?? "" } : inputOrRoomId;
    return this.sendMessageInput(input, "resource");
  }
  async sendMessageInput(input, defaultTargetScope, editServerAcceptedAt) {
    const sendStartedAt = Date.now();
    const messageBody = input.body ?? "";
    const attachments = normalizeAttachmentPayload(input.attachments);
    if (!messageBody.trim() && !attachments?.length) throw new Error("chat_body_required");
    if (this.config.requireEncryptedAttachments && attachments?.some((attachment) => !isEncryptedChatAttachment(attachment))) {
      throw new Error("chat_attachment_encryption_required");
    }
    if (this.config.requireEncryptedAttachments && attachments?.some(
      (attachment) => !hasChatAttachmentDownloadCapability(attachment)
    )) {
      throw new Error("chat_attachment_download_capability_required");
    }
    const metadata = normalizeMessageMetadata(input.metadata, "CHAT_MESSAGE");
    const editTargetId = trimToUndefined(typeof metadata.replacesId === "string" ? metadata.replacesId : void 0);
    const isEdit = metadata.edited === true;
    if (!isEdit) delete metadata.replacesId;
    let originalForEdit;
    if (isEdit) {
      if (!editTargetId || metadata.edited !== true || metadata.messageType !== "CHAT_MESSAGE" || attachments?.length || !input.roomId) {
        throw new Error("chat_edit_not_allowed");
      }
      originalForEdit = await this.resolveEditTarget(input.roomId, editTargetId);
      const error = getMessageEditError(originalForEdit, this.getDeviceId() ?? "");
      if (error && !(error === "chat_edit_expired" && editServerAcceptedAt !== void 0)) throw new Error(error);
      const editTimestamp = parseMetadataTimestamp(metadata) ?? Date.now();
      const timestampError = getMessageEditError(originalForEdit, this.getDeviceId() ?? "", editTimestamp);
      if (timestampError) throw new Error(timestampError);
      metadata.sentAtMs = editTimestamp;
    } else if (!parseMetadataTimestamp(metadata)) {
      metadata.sentAtMs = Date.now();
    }
    await this.connect();
    const xmpp = this.requireXmpp();
    const id = input.id || generateMessageId();
    const roomId = input.roomId?.trim();
    const targetRoomId = input.targetRoomId?.trim() || roomId;
    const targetScope = input.targetScope ?? defaultTargetScope;
    const groupRoom = this.getGroupRoomForTransport(targetRoomId) ?? this.getGroupRoomForTransport(roomId);
    if (groupRoom) {
      await this.ensureGroupRoomJoined(groupRoom.roomId);
    }
    const targetDeviceIds = groupRoom ? [groupRoom.mucJid] : await this.resolveRoomTargets({
      roomId: targetRoomId,
      explicitDeviceIds: collectTargetDeviceIds(input),
      targetScope
    });
    this.log("debug", "chat_message_send_started", {
      id,
      roomId,
      targetRoomId,
      targetScope,
      targetCount: targetDeviceIds.length,
      targetDeviceIds,
      hasAttachments: Boolean(attachments?.length),
      messageType: metadata.messageType
    });
    if (this.config.awaitServerAcknowledgement && xmpp.streamManagement.enabled !== true) {
      throw new Error("chat_stream_management_unavailable");
    }
    const serverAckPromise = this.config.awaitServerAcknowledgement ? this.createServerAckWaiter(id, targetDeviceIds) : null;
    try {
      const sentTargets = await this.sendToTargets(targetDeviceIds, async (toDeviceId) => {
        const encodedPayload = await this.encodePayload({
          toDeviceId,
          ...groupRoom ? { recipientJids: this.getGroupEncryptionRecipientJids(groupRoom) } : {},
          body: messageBody,
          metadata,
          attachments
        });
        const children = [
          xml("body", {}, encodedPayload.body ?? messageBody),
          ...encodedPayload.children,
          // Keep the application-generated id stable when a stanza is replayed
          // by stream management or resent from a durable client outbox.
          xml("origin-id", { xmlns: XMPP_STABLE_ID_NS, id })
        ];
        if (roomId) children.push(xml("thread", {}, roomId));
        const emergency = parseEmergencyMetadata(metadata);
        if (emergency) {
          children.push(
            xml("emergency", {
              xmlns: XMPP_EMERGENCY_NS,
              type: emergency.emergencyType,
              "alert-id": emergency.alertId,
              "triggered-at": emergency.triggeredAt
            })
          );
        }
        if (metadata.messageType === CHAT_CONVERSATION_STATE_MESSAGE_TYPE) {
          children.push(xml("store", { xmlns: XMPP_HINTS_NS }));
        }
        if (!groupRoom && input.requestReceipt !== false) {
          children.push(xml("request", { xmlns: XMPP_RECEIPTS_NS }));
          children.push(xml("markable", { xmlns: XMPP_CHAT_MARKERS_NS }));
        }
        if (isEdit && editServerAcceptedAt === void 0) {
          originalForEdit = await this.resolveEditTarget(input.roomId, editTargetId);
          const error = getMessageEditError(originalForEdit, this.getDeviceId() ?? "");
          if (error) throw new Error(error);
        }
        await xmpp.send(
          xml(
            "message",
            { to: toDeviceId, type: groupRoom ? "groupchat" : "chat", id },
            ...children
          )
        );
      });
      if (serverAckPromise) {
        this.updateServerAckExpectedTargets(id, sentTargets);
        await xmpp.send(xml("r", { xmlns: XMPP_STREAM_MANAGEMENT_NS }));
        await serverAckPromise;
      }
    } catch (error) {
      this.cancelServerAckWaiter(id);
      throw error;
    }
    this.log("info", "chat_message_sent", {
      id,
      durationMs: Date.now() - sendStartedAt,
      roomId,
      targetRoomId,
      targetScope,
      targetCount: targetDeviceIds.length,
      messageType: metadata.messageType
    });
    this.rememberRoomPeers(roomId, targetDeviceIds);
    if (targetRoomId && targetRoomId !== roomId) {
      this.rememberRoomPeers(targetRoomId, targetDeviceIds);
    }
    if (roomId) {
      this.rememberMessageAuthor(roomId, id, this.getDeviceId());
      if (!isEdit) this.rememberEditTarget(roomId, id, {
        authorAddress: this.getDeviceId() ?? "",
        timestamp: this.serverMessageTimestamps.get(this.editTargetKey(roomId, id)) ?? 0,
        body: messageBody,
        hasAttachments: Boolean(attachments?.length),
        metadata
      });
    }
    return id;
  }
  async sendTyping(inputOrRoomId, options) {
    const input = typeof inputOrRoomId === "string" ? { ...options ?? {}, roomId: inputOrRoomId } : inputOrRoomId;
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    const isTyping = input.isTyping ?? true;
    const targetScope = input.targetScope ?? "user";
    const groupRoom = this.getGroupRoomForTransport(roomId);
    if (groupRoom) {
      await this.connect();
      await this.ensureGroupRoomJoined(groupRoom.roomId);
    }
    const targetDeviceIds = groupRoom ? [groupRoom.mucJid] : await this.resolveRoomTargets({
      roomId,
      explicitDeviceIds: collectTargetDeviceIds(input),
      targetScope
    });
    this.log("debug", "chat_typing_send_started", {
      roomId,
      isTyping,
      targetScope,
      targetCount: targetDeviceIds.length
    });
    this.rememberRoomPeers(roomId, targetDeviceIds);
    this.clearTypingAutoPause(roomId);
    await this.connect();
    const children = [];
    children.push(xml("thread", {}, roomId));
    children.push(xml(isTyping ? "composing" : "paused", { xmlns: XMPP_CHATSTATES_NS }));
    await this.sendToTargets(
      targetDeviceIds,
      (toDeviceId) => this.requireXmpp().send(
        xml("message", {
          to: toDeviceId,
          type: groupRoom ? "groupchat" : "chat",
          id: input.id || `typing-${Date.now()}`
        }, ...children)
      )
    );
    if (isTyping) {
      this.scheduleTypingAutoPause(roomId, input.autoPauseMs ?? DEFAULT_TYPING_AUTO_PAUSE_MS);
    }
    this.log("debug", "chat_typing_sent", {
      roomId,
      isTyping,
      targetCount: targetDeviceIds.length
    });
  }
  async sendThreadGone(inputOrRoomId, options) {
    const input = typeof inputOrRoomId === "string" ? { ...options ?? {}, roomId: inputOrRoomId } : inputOrRoomId;
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    const targetRoomId = input.targetRoomId?.trim() || roomId;
    const targetScope = input.targetScope ?? "user";
    const groupRoom = this.getGroupRoomForTransport(targetRoomId) ?? this.getGroupRoomForTransport(roomId);
    if (groupRoom) {
      await this.connect();
      await this.ensureGroupRoomJoined(groupRoom.roomId);
    }
    const targetDeviceIds = groupRoom ? [groupRoom.mucJid] : await this.resolveRoomTargets({
      roomId: targetRoomId,
      explicitDeviceIds: collectTargetDeviceIds(input),
      targetScope
    });
    const id = input.id?.trim() || `gone-${generateMessageId()}`;
    this.log("debug", "chat_thread_gone_send_started", {
      id,
      roomId,
      targetRoomId,
      targetScope,
      targetCount: targetDeviceIds.length
    });
    this.rememberRoomPeers(roomId, targetDeviceIds);
    if (targetRoomId !== roomId) {
      this.rememberRoomPeers(targetRoomId, targetDeviceIds);
    }
    this.clearTypingAutoPause(roomId);
    await this.connect();
    await this.sendToTargets(
      targetDeviceIds,
      (toDeviceId) => this.requireXmpp().send(
        xml(
          "message",
          { to: toDeviceId, type: groupRoom ? "groupchat" : "chat", id },
          xml("thread", {}, roomId),
          xml("gone", { xmlns: XMPP_CHATSTATES_NS })
        )
      )
    );
    this.log("debug", "chat_thread_gone_sent", {
      id,
      roomId,
      targetRoomId,
      targetCount: targetDeviceIds.length
    });
    return id;
  }
  async markRead(inputOrRoomId, messageId, options) {
    const input = typeof inputOrRoomId === "string" ? { ...options ?? {}, roomId: inputOrRoomId, messageId: messageId ?? "" } : inputOrRoomId;
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    if (!input.messageId.trim()) throw new Error("chat_message_id_required");
    const targetScope = input.targetScope ?? "user";
    const groupRoom = this.getGroupRoomForTransport(roomId);
    if (groupRoom) {
      await this.connect();
      await this.ensureGroupRoomJoined(groupRoom.roomId);
    }
    const targetDeviceIds = groupRoom ? [groupRoom.mucJid] : await this.resolveRoomTargets({
      roomId,
      explicitDeviceIds: collectTargetDeviceIds(input),
      targetScope
    });
    this.log("debug", "chat_read_marker_send_started", {
      roomId,
      messageId: input.messageId,
      targetScope,
      targetCount: targetDeviceIds.length
    });
    this.rememberRoomPeers(roomId, targetDeviceIds);
    await this.connect();
    const children = [
      xml("displayed", { xmlns: XMPP_CHAT_MARKERS_NS, id: input.messageId })
    ];
    children.unshift(xml("thread", {}, roomId));
    await this.sendToTargets(
      targetDeviceIds,
      (toDeviceId) => this.requireXmpp().send(
        xml("message", {
          to: toDeviceId,
          type: groupRoom ? "groupchat" : "chat",
          id: input.id || `displayed-${Date.now()}`
        }, ...children)
      )
    );
    this.log("debug", "chat_read_marker_sent", {
      roomId,
      messageId: input.messageId,
      targetCount: targetDeviceIds.length
    });
  }
  async resolveAttachment(attachment) {
    const normalized = normalizeRequiredAttachment(attachment);
    if (this.config.attachmentService?.resolve) {
      const resolved = await this.config.attachmentService.resolve(
        normalized,
        this.getAttachmentResolveContext()
      );
      if (typeof resolved === "string" && resolved.trim()) return resolved.trim();
    }
    if (isEncryptedChatAttachment(normalized)) {
      throw new Error("chat_attachment_resolver_required");
    }
    return defaultAttachmentSource(normalized);
  }
  onMessage(listener) {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }
  onChatMessage(listener) {
    return this.onMessage((message, delivery) => {
      if (isConversationStateMessage(message)) return;
      if (isFormSubmissionMessage(message)) return;
      if (isAttachmentMessage(message)) return;
      if (isEmergencyMessage(message)) return;
      listener(toChatTextMessage(message), delivery);
    });
  }
  onEmergency(listener) {
    return this.onMessage((message, delivery) => {
      const emergency = parseChatEmergencyMessage(message);
      if (emergency) listener(emergency, delivery);
    });
  }
  onAttachmentMessage(listener) {
    return this.onMessage((message, delivery) => {
      if (!isAttachmentMessage(message)) return;
      listener(toChatAttachmentMessage(message), delivery);
    });
  }
  onFormSubmission(listener) {
    return this.onMessage((message, delivery) => {
      const parsed = parseFormSubmissionMessage(message);
      if (parsed) listener(parsed, delivery);
    });
  }
  onConversationState(listener) {
    return this.onMessage((message, delivery) => {
      const event = parseConversationStateMessage(message);
      if (event) listener(event, delivery);
    });
  }
  onGroupInvitation(listener) {
    return addListener(this.groupInvitationListeners, listener);
  }
  onThreadGone(listener) {
    return addListener(this.threadGoneListeners, listener);
  }
  onServerEvent(listener) {
    return addListener(this.serverEventListeners, listener);
  }
  onRetraction(listener) {
    return addListener(this.retractionListeners, listener);
  }
  onTyping(listener) {
    return addListener(this.typingListeners, listener);
  }
  onDelivery(listener) {
    return addListener(this.deliveryListeners, listener);
  }
  onServerAcknowledged(listener) {
    return addListener(this.serverAcknowledgementListeners, listener);
  }
  onServerSendFailed(listener) {
    return addListener(this.serverSendFailureListeners, listener);
  }
  onStreamManagement(listener) {
    return addListener(this.streamManagementListeners, listener);
  }
  onError(listener) {
    return addListener(this.errorListeners, listener);
  }
  onStatus(listener) {
    const unsubscribe = addListener(this.statusListeners, listener);
    listener({
      status: this.status,
      deviceId: this.onlineDeviceId
    });
    return unsubscribe;
  }
  getStatus() {
    return this.status;
  }
  getDeviceId() {
    return this.onlineDeviceId ?? this.config.deviceId;
  }
  getBareDeviceId() {
    return normalizeBareDeviceId(this.getDeviceId());
  }
  getAddress() {
    return this.getChatAddressObject().address;
  }
  getChatAddressObject() {
    const raw = this.getDeviceId() ?? this.config.deviceId;
    return {
      raw,
      address: normalizeBareDeviceId(raw) || this.config.deviceId,
      userId: this.config.userId,
      deviceId: this.config.localDeviceId,
      localpart: this.config.username,
      domain: this.config.domain
    };
  }
  getDomain() {
    return this.config.domain;
  }
  getUserId() {
    return this.config.userId;
  }
  async connectFresh() {
    if (this.xmpp) {
      await this.stop();
    }
    this.setStatus("connecting");
    this.log("info", "chat_connect_started", {
      service: this.config.service,
      domain: this.config.domain,
      resource: this.config.resource,
      authType: this.config.authType
    });
    if (this.config.authType === "x-oauth2") {
      registerXOAuth2Preference();
    }
    const xmpp = createXmppClient({
      service: this.config.service,
      domain: this.config.domain,
      resource: this.config.resource,
      credentials: this.createCredentials()
    });
    this.xmpp = xmpp;
    if (this.config.authType === "x-oauth2") {
      registerXOAuth2OnClient(xmpp);
    }
    this.bindXmppEvents(xmpp);
    this.bindStreamManagementEvents(xmpp);
    try {
      await withTimeout(
        xmpp.start(),
        this.config.connectTimeoutMs,
        "chat_connect_timeout"
      );
      const onlineReadiness = this.onlineReadinessPromise;
      if (!onlineReadiness) {
        throw new Error("chat_online_readiness_missing");
      }
      await withTimeout(
        onlineReadiness,
        this.config.connectTimeoutMs,
        "chat_online_readiness_timeout"
      );
    } catch (error) {
      this.xmpp = null;
      this.setStatus("error", error);
      this.log("error", "chat_connect_failed", { error });
      await safeStop(xmpp);
      throw error;
    }
  }
  createCredentials() {
    const username = this.config.username;
    const secret = this.config.password;
    if (!secret) return { username };
    if (this.config.authType === "x-oauth2") {
      return async (authenticate, mechanisms) => {
        const picked = pickMechanism(mechanisms, ["X-OAUTH2"]);
        if (!picked) {
          throw new Error(`chat_no_usable_auth_mechanism:${mechanisms.join(",")}`);
        }
        await authenticate(
          { username, password: secret },
          picked,
          xml("user-agent", { id: "lulafi-chat-sdk" })
        );
      };
    }
    return async (authenticate, mechanisms, _fast, _entity) => {
      const preferred = ["SCRAM-SHA-1", "ANONYMOUS"];
      const picked = pickMechanism(mechanisms, preferred);
      if (!picked) {
        throw new Error(`chat_no_usable_auth_mechanism:${mechanisms.join(",")}`);
      }
      await authenticate(
        { username, password: secret },
        picked,
        xml("user-agent", { id: "lulafi-chat-sdk" })
      );
    };
  }
  bindXmppEvents(xmpp) {
    xmpp.on("online", (address) => {
      if (this.xmpp !== xmpp) return;
      this.onlineDeviceId = addressToString(address) ?? this.config.deviceId;
      this.onlineReadinessPromise = (async () => {
        const streamManagement = xmpp.streamManagement;
        const streamManagementRequired = this.config.requireStreamManagement || this.config.awaitServerAcknowledgement;
        const streamManagementEnabled = streamManagementRequired ? await this.waitForStreamManagementNegotiation(xmpp) : streamManagement.enabled === true;
        if (this.xmpp !== xmpp) return;
        if (streamManagementRequired && !streamManagementEnabled) {
          throw new Error("chat_stream_management_required");
        }
        if (streamManagementEnabled) {
          this.emit(this.streamManagementListeners, {
            state: "enabled",
            resumable: Boolean(streamManagement.id)
          });
        }
        await xmpp.send(xml("presence"));
        try {
          await this.enableMessageCarbons();
          this.log("debug", "chat_carbons_enabled", {
            deviceId: this.onlineDeviceId
          });
        } catch (error) {
          this.log("warn", "chat_carbons_enable_failed", { error });
          if (this.config.requireMessageCarbons) {
            throw new Error("chat_carbons_required", { cause: error });
          }
        }
        try {
          await this.config.encryption?.onConnect?.(this.getEncryptionContext());
          this.log("debug", "chat_encryption_connected", {
            deviceId: this.getBareDeviceId()
          });
        } catch (error) {
          this.log("error", "chat_encryption_connect_failed", { error });
          this.emit(this.errorListeners, { error });
        }
        if (this.xmpp !== xmpp) return;
        await this.rejoinGroupRooms();
        if (this.xmpp !== xmpp) return;
        this.setStatus("online");
        this.log("info", "chat_online", {
          deviceId: this.onlineDeviceId,
          bareDeviceId: this.getBareDeviceId()
        });
      })();
      this.onlineReadinessPromise.catch((error) => {
        if (this.xmpp !== xmpp) return;
        this.setStatus("error", error);
        this.emit(this.errorListeners, { error });
      });
    });
    xmpp.on("offline", () => {
      if (this.xmpp !== xmpp) return;
      this.config.encryption?.onDisconnect?.(this.getEncryptionContext());
      this.setStatus("offline");
      this.onlineDeviceId = void 0;
      this.onlineReadinessPromise = null;
      this.joinedGroupRooms.clear();
      this.mucOccupantRealJids.clear();
      this.clearAllGroupJoinRetries();
      this.rejectPendingGroupJoins(new Error("chat_muc_offline"));
      this.log("warn", "chat_offline");
      this.rejectPendingIq(new Error("chat_iq_offline"));
      this.rejectServerAckWaiters(new Error("chat_stream_offline"));
    });
    xmpp.on("error", (error) => {
      if (this.xmpp !== xmpp) return;
      this.log("error", "chat_xmpp_error", { error });
      this.emit(this.errorListeners, { error });
      this.setStatus("error", error);
    });
    xmpp.on("stanza", (stanza) => {
      if (this.xmpp !== xmpp) return;
      this.handleStanza(stanza).catch((error) => {
        this.emit(this.errorListeners, { error, raw: stanza });
      });
    });
  }
  async enableMessageCarbons() {
    await this.sendIq({
      type: "set",
      payload: xml("enable", { xmlns: XMPP_CARBONS_NS })
    });
  }
  async waitForStreamManagementNegotiation(xmpp) {
    const streamManagement = xmpp.streamManagement;
    if (streamManagement.enabled === true) return true;
    const timeoutMs = Math.max(250, Math.min(this.config.connectTimeoutMs, 1e4));
    this.log("debug", "chat_stream_management_negotiation_wait", {
      timeoutMs,
      enableSent: streamManagement.enableSent === true
    });
    return new Promise((resolve) => {
      let settled = false;
      let pollTimer;
      let timeoutTimer;
      const cleanup = () => {
        if (pollTimer) clearInterval(pollTimer);
        if (timeoutTimer) clearTimeout(timeoutTimer);
        xmpp.removeListener("element", onElement);
        xmpp.removeListener("offline", onOffline);
      };
      const finish = (enabled) => {
        if (settled) return;
        settled = true;
        cleanup();
        this.log(enabled ? "debug" : "warn", "chat_stream_management_negotiation_complete", {
          enabled,
          enableSent: streamManagement.enableSent === true,
          resumable: Boolean(streamManagement.id)
        });
        resolve(enabled);
      };
      const checkEnabled = () => {
        if (streamManagement.enabled === true) finish(true);
      };
      const onElement = (element) => {
        if (element.is?.("failed", XMPP_STREAM_MANAGEMENT_NS)) {
          finish(false);
          return;
        }
        if (element.is?.("enabled", XMPP_STREAM_MANAGEMENT_NS)) {
          queueMicrotask(checkEnabled);
        }
      };
      const onOffline = () => finish(false);
      xmpp.on("element", onElement);
      xmpp.on("offline", onOffline);
      pollTimer = setInterval(checkEnabled, 10);
      timeoutTimer = setTimeout(() => finish(streamManagement.enabled === true), timeoutMs);
      checkEnabled();
    });
  }
  bindStreamManagementEvents(xmpp) {
    const streamManagement = xmpp.streamManagement;
    streamManagement.on?.("ack", (stanza) => {
      if (this.xmpp !== xmpp) return;
      if (!stanza || !stanza.is?.("message") && stanza.name !== "message") return;
      const id = trimToUndefined(stanza.attrs?.id);
      if (!id) return;
      const target = normalizeTransportAddress(stanza.attrs?.to);
      const waiter = this.serverAckWaiters.get(id);
      if (waiter && target) {
        waiter.acknowledgedTargets.add(target);
        this.resolveServerAckWaiterIfComplete(id, waiter);
      }
      this.emit(this.serverAcknowledgementListeners, {
        id,
        acknowledgedAt: Date.now(),
        ...target ? { toDeviceId: target } : {},
        ...trimToUndefined(stanza.getChildText?.("thread")) ? { roomId: trimToUndefined(stanza.getChildText?.("thread")) } : {},
        raw: stanza
      });
    });
    streamManagement.on?.("fail", (stanza) => {
      if (this.xmpp !== xmpp) return;
      if (!stanza || !stanza.is?.("message") && stanza.name !== "message") return;
      const id = trimToUndefined(stanza.attrs?.id);
      if (!id) return;
      const waiter = this.serverAckWaiters.get(id);
      if (waiter) {
        this.serverAckWaiters.delete(id);
        waiter.reject(new Error(`chat_server_ack_failed:${id}`));
      }
      const target = normalizeTransportAddress(stanza.attrs?.to);
      this.emit(this.serverSendFailureListeners, {
        id,
        failedAt: Date.now(),
        ...target ? { toDeviceId: target } : {},
        ...trimToUndefined(stanza.getChildText?.("thread")) ? { roomId: trimToUndefined(stanza.getChildText?.("thread")) } : {},
        raw: stanza
      });
      this.emit(this.streamManagementListeners, {
        state: "failed",
        resumable: false
      });
    });
    streamManagement.on?.("resumed", () => {
      if (this.xmpp !== xmpp) return;
      this.setStatus("online");
      this.emit(this.streamManagementListeners, {
        state: "resumed",
        resumable: true
      });
      this.log("info", "chat_stream_resumed");
    });
  }
  createServerAckWaiter(messageId, targets) {
    this.cancelServerAckWaiter(messageId);
    let resolve;
    let reject;
    const promise = new Promise((resolvePromise, rejectPromise) => {
      resolve = resolvePromise;
      reject = rejectPromise;
    });
    promise.catch(() => {
    });
    this.serverAckWaiters.set(messageId, {
      expectedTargets: new Set(normalizeTransportAddressList(targets)),
      acknowledgedTargets: /* @__PURE__ */ new Set(),
      promise,
      resolve,
      reject
    });
    return promise;
  }
  updateServerAckExpectedTargets(messageId, targets) {
    const waiter = this.serverAckWaiters.get(messageId);
    if (!waiter) return;
    waiter.expectedTargets = new Set(normalizeTransportAddressList(targets));
    this.resolveServerAckWaiterIfComplete(messageId, waiter);
  }
  resolveServerAckWaiterIfComplete(messageId, waiter) {
    if (!waiter.expectedTargets.size) return;
    const complete = Array.from(waiter.expectedTargets).every(
      (target) => waiter.acknowledgedTargets.has(target)
    );
    if (!complete) return;
    this.serverAckWaiters.delete(messageId);
    waiter.resolve();
  }
  cancelServerAckWaiter(messageId) {
    const waiter = this.serverAckWaiters.get(messageId);
    if (!waiter) return;
    this.serverAckWaiters.delete(messageId);
    waiter.reject(new Error(`chat_server_ack_cancelled:${messageId}`));
  }
  rejectServerAckWaiters(error) {
    const waiters = Array.from(this.serverAckWaiters.values());
    this.serverAckWaiters.clear();
    waiters.forEach((waiter) => waiter.reject(error));
  }
  unwrapCarbonMessage(stanza) {
    const sent = stanza.getChild?.("sent", XMPP_CARBONS_NS);
    const received = stanza.getChild?.("received", XMPP_CARBONS_NS);
    const carbon = sent ?? received;
    if (carbon && addressToString(stanza.attrs?.from)?.toLowerCase() !== normalizeBareDeviceId(this.getDeviceId()).toLowerCase()) return null;
    const direction = sent ? "sent" : received ? "received" : void 0;
    const forwarded = carbon?.getChild?.("forwarded", XMPP_FORWARD_NS);
    const message = forwarded?.getChild?.("message", "jabber:client") ?? forwarded?.getChild?.("message");
    if (!direction || !message) return null;
    const timestamp = forwarded ? parseDelayTimestamp(forwarded) : void 0;
    return { direction, message, ...timestamp !== void 0 ? { timestamp } : {} };
  }
  normalizeGroupRoom(room) {
    const roomId = room.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    const mucJid = normalizeBareDeviceId(room.mucJid).toLowerCase();
    if (!mucJid || !mucJid.includes("@")) {
      throw new Error("chat_muc_jid_required");
    }
    const ownBareJid = normalizeBareDeviceId(this.config.deviceId).toLowerCase();
    const memberJids = Array.from(
      new Set(
        [ownBareJid, ...room.memberJids].map((jid) => normalizeBareDeviceId(jid).toLowerCase()).filter(Boolean)
      )
    );
    return {
      roomId,
      mucJid,
      memberJids,
      ...trimToUndefined(room.nickname) ? { nickname: trimToUndefined(room.nickname) } : {}
    };
  }
  rememberGroupRoom(room) {
    const previous = this.groupRooms.get(room.roomId);
    if (previous && previous.mucJid !== room.mucJid) {
      this.groupRoomIdsByMucJid.delete(previous.mucJid);
      this.joinedGroupRooms.delete(room.roomId);
    }
    this.groupRooms.set(room.roomId, room);
    this.groupRoomIdsByMucJid.set(room.mucJid, room.roomId);
  }
  getGroupNickname(room) {
    const preferred = room.nickname ?? `${this.config.userId}-${this.config.localDeviceId}`;
    return preferred.trim().replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^[._-]+|[._-]+$/g, "").slice(0, 96) || `device-${this.config.localDeviceId}`;
  }
  async ensureGroupRoomJoined(roomId) {
    if (this.joinedGroupRooms.has(roomId)) return;
    const pending = this.pendingGroupJoins.get(roomId);
    if (pending) {
      await pending.promise;
      return;
    }
    const room = this.groupRooms.get(roomId);
    if (!room) throw new Error(`chat_muc_room_unknown:${roomId}`);
    const occupantJid = `${room.mucJid}/${this.getGroupNickname(room)}`;
    let resolveJoin;
    let rejectJoin;
    const joined = new Promise((resolve, reject) => {
      resolveJoin = resolve;
      rejectJoin = reject;
    });
    const timeout = setTimeout(() => {
      this.pendingGroupJoins.delete(roomId);
      rejectJoin(new Error(`chat_muc_join_timeout:${roomId}`));
    }, DEFAULT_MUC_JOIN_TIMEOUT_MS);
    this.pendingGroupJoins.set(roomId, {
      promise: joined,
      resolve: resolveJoin,
      reject: rejectJoin,
      timeout
    });
    joined.catch(() => {
    });
    try {
      await this.requireXmpp().send(
        xml(
          "presence",
          { to: occupantJid },
          xml("x", { xmlns: XMPP_MUC_NS })
        )
      );
      await joined;
    } catch (error) {
      const waiter = this.pendingGroupJoins.get(roomId);
      if (waiter) {
        clearTimeout(waiter.timeout);
        this.pendingGroupJoins.delete(roomId);
        waiter.reject(error instanceof Error ? error : new Error(String(error)));
      }
      throw error;
    }
  }
  clearGroupJoinRetry(roomId) {
    const timer = this.groupJoinRetryTimers.get(roomId);
    if (timer) clearTimeout(timer);
    this.groupJoinRetryTimers.delete(roomId);
    this.groupJoinRetryAttempts.delete(roomId);
  }
  clearAllGroupJoinRetries() {
    for (const timer of this.groupJoinRetryTimers.values()) {
      clearTimeout(timer);
    }
    this.groupJoinRetryTimers.clear();
    this.groupJoinRetryAttempts.clear();
  }
  scheduleGroupJoinRetry(roomId) {
    if (this.joinedGroupRooms.has(roomId) || this.groupJoinRetryTimers.has(roomId) || !this.groupRooms.has(roomId)) {
      return;
    }
    const attempt = this.groupJoinRetryAttempts.get(roomId) ?? 0;
    const delayMs = MUC_JOIN_RETRY_DELAYS_MS[attempt];
    if (delayMs === void 0) {
      this.log("warn", "chat_muc_join_retry_exhausted", { roomId, attempt });
      return;
    }
    this.groupJoinRetryAttempts.set(roomId, attempt + 1);
    const timer = setTimeout(() => {
      this.groupJoinRetryTimers.delete(roomId);
      if (this.status !== "online" || !this.groupRooms.has(roomId)) return;
      this.ensureGroupRoomJoined(roomId).catch((error) => {
        this.log("warn", "chat_muc_join_retry_failed", {
          roomId,
          attempt: attempt + 1,
          error
        });
        this.scheduleGroupJoinRetry(roomId);
      });
    }, delayMs);
    this.groupJoinRetryTimers.set(roomId, timer);
    this.log("info", "chat_muc_join_retry_scheduled", {
      roomId,
      attempt: attempt + 1,
      delayMs
    });
  }
  async rejoinGroupRooms() {
    this.joinedGroupRooms.clear();
    const roomIds = Array.from(this.groupRooms.keys());
    const results = await Promise.allSettled(
      roomIds.map((roomId) => this.ensureGroupRoomJoined(roomId))
    );
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        const roomId = roomIds[index];
        this.log("warn", "chat_muc_rejoin_failed", {
          roomId,
          error: result.reason
        });
        if (roomId) this.scheduleGroupJoinRetry(roomId);
      }
    });
  }
  rejectPendingGroupJoins(error) {
    const pending = Array.from(this.pendingGroupJoins.values());
    this.pendingGroupJoins.clear();
    pending.forEach((entry) => {
      clearTimeout(entry.timeout);
      entry.reject(error);
    });
  }
  handleGroupPresence(stanza) {
    const from = addressToString(stanza.attrs?.from) ?? "";
    const mucJid = normalizeBareDeviceId(from).toLowerCase();
    const roomId = this.groupRoomIdsByMucJid.get(mucJid);
    if (!roomId) return;
    const mucUser = stanza.getChild?.("x", XMPP_MUC_USER_NS) ?? stanza.getChild?.("x");
    const realJid = trimToUndefined(mucUser?.getChild?.("item")?.attrs?.jid);
    const occupantKey = from.toLowerCase();
    if (stanza.attrs?.type === "unavailable") {
      this.mucOccupantRealJids.delete(occupantKey);
    } else if (realJid) {
      this.mucOccupantRealJids.set(occupantKey, realJid);
    }
    const room = this.groupRooms.get(roomId);
    const expectedOccupant = room ? `${room.mucJid}/${this.getGroupNickname(room)}`.toLowerCase() : "";
    const raw = toRawXmlString(stanza);
    const isSelfPresence = from.toLowerCase() === expectedOccupant || /<status\b[^>]*\bcode=["']110["']/.test(raw);
    if (!isSelfPresence) return;
    const waiter = this.pendingGroupJoins.get(roomId);
    if (stanza.attrs?.type === "error") {
      const parsed = parseStanzaError(stanza);
      const error = new Error(
        `chat_muc_join_error:${roomId}:${parsed.condition ?? "unknown"}`
      );
      if (waiter) {
        clearTimeout(waiter.timeout);
        this.pendingGroupJoins.delete(roomId);
        waiter.reject(error);
      }
      return;
    }
    if (stanza.attrs?.type === "unavailable") {
      this.joinedGroupRooms.delete(roomId);
      return;
    }
    this.joinedGroupRooms.add(roomId);
    this.clearGroupJoinRetry(roomId);
    if (waiter) {
      clearTimeout(waiter.timeout);
      this.pendingGroupJoins.delete(roomId);
      waiter.resolve();
    }
    this.log("info", "chat_muc_joined", { roomId, mucJid });
  }
  getMucRealSenderJid(stanza) {
    const roomJid = normalizeBareDeviceId(addressToString(stanza.attrs?.from));
    const sender = stanza.getChild?.("sender", XMPP_MUC_SENDER_NS);
    const senderJid = trimToUndefined(sender?.attrs?.jid);
    if (roomJid.endsWith(`@conference.${this.config.domain}`) && sender?.attrs?.by === this.config.domain && senderJid && normalizeBareDeviceId(senderJid).split("@")[1] === this.config.domain) {
      return senderJid;
    }
    const mucUser = stanza.getChild?.("x", XMPP_MUC_USER_NS) ?? stanza.getChild?.("x");
    return trimToUndefined(mucUser?.getChild?.("item")?.attrs?.jid) ?? this.mucOccupantRealJids.get(
      (addressToString(stanza.attrs?.from) ?? "").toLowerCase()
    );
  }
  unwrapMucSubMessage(stanza) {
    const items = stanza.getChild?.("event", XMPP_PUBSUB_EVENT_NS)?.getChild?.("items");
    if (items?.attrs?.node !== XMPP_MUCSUB_MESSAGES_NODE) return null;
    const from = addressToString(stanza.attrs?.from)?.toLowerCase() ?? "";
    const roomJid = normalizeBareDeviceId(from);
    if (from !== roomJid || !roomJid.endsWith(`@conference.${this.config.domain}`)) return null;
    const recipient = normalizeBareDeviceId(addressToString(stanza.attrs?.to));
    if (recipient && recipient !== this.getBareDeviceId()) return null;
    const entries = items.getChildren?.("item") ?? [];
    if (entries.length !== 1) return null;
    const message = entries[0].getChild?.("message", "jabber:client") ?? entries[0].getChild?.("message");
    if (message?.attrs?.type !== "groupchat" || normalizeBareDeviceId(addressToString(message.attrs.from)).toLowerCase() !== roomJid) return null;
    const thread = trimToUndefined(message.getChildText?.("thread"));
    const registered = thread ? this.groupRooms.get(thread) : void 0;
    if (registered && registered.mucJid !== roomJid) return null;
    return message;
  }
  parseGroupInvitation(stanza) {
    const directInvite = stanza.getChild?.("x", XMPP_DIRECT_MUC_INVITE_NS);
    const directMucJid = normalizeBareDeviceId(
      trimToUndefined(directInvite?.attrs?.jid)
    );
    if (directMucJid) {
      const fromJid2 = normalizeBareDeviceId(addressToString(stanza.attrs?.from));
      return {
        mucJid: directMucJid,
        ...fromJid2 ? { fromJid: fromJid2 } : {},
        ...trimToUndefined(directInvite?.attrs?.reason) ? { reason: trimToUndefined(directInvite?.attrs?.reason) } : {},
        ...trimToUndefined(directInvite?.attrs?.password) ? { password: trimToUndefined(directInvite?.attrs?.password) } : {},
        raw: stanza
      };
    }
    const mucUser = stanza.getChild?.("x", XMPP_MUC_USER_NS);
    const mediatedInvite = mucUser?.getChild?.("invite");
    if (!mediatedInvite) return null;
    const mucJid = normalizeBareDeviceId(addressToString(stanza.attrs?.from));
    if (!mucJid) return null;
    const fromJid = normalizeBareDeviceId(
      trimToUndefined(mediatedInvite.attrs?.from)
    );
    const reason = trimToUndefined(mediatedInvite.getChildText?.("reason"));
    const password = trimToUndefined(mucUser?.getChildText?.("password"));
    return {
      mucJid,
      ...fromJid ? { fromJid } : {},
      ...reason ? { reason } : {},
      ...password ? { password } : {},
      raw: stanza
    };
  }
  async handleStanza(stanza) {
    this.resolvePendingIq(stanza);
    if (stanza.is?.("presence")) {
      this.handleGroupPresence(stanza);
      return;
    }
    if (!stanza.is?.("message")) return;
    await this.config.encryption?.onStanza?.(stanza, this.getEncryptionContext());
    if (stanza.getChild?.("event", XMPP_SERVER_EVENT_NS)) {
      const serverEvent = parseChatServerEvent(stanza, this.config.domain);
      if (serverEvent) {
        if (serverEvent.type === "message_timestamp") {
          const { messageId, roomId: roomId2, timestamp } = serverEvent.data;
          if (typeof messageId !== "string" || typeof roomId2 !== "string" || !isServerMessageTimestamp(timestamp)) return;
          const key = this.editTargetKey(roomId2, messageId);
          this.serverMessageTimestamps.set(key, timestamp);
          const target = this.editTargets.get(key);
          if (target) target.timestamp = timestamp;
          if (this.serverMessageTimestamps.size > 2e3)
            this.serverMessageTimestamps.delete(this.serverMessageTimestamps.keys().next().value);
        }
        this.log("debug", "chat_server_event_received", {
          id: serverEvent.id,
          type: serverEvent.type
        });
        this.emit(this.serverEventListeners, serverEvent);
      } else {
        this.log("warn", "chat_server_event_rejected", {
          id: stanza.attrs?.id,
          from: addressToString(stanza.attrs?.from)
        });
      }
      return;
    }
    const carbon = this.unwrapCarbonMessage(stanza);
    if (!carbon && (stanza.getChild?.("sent", XMPP_CARBONS_NS) || stanza.getChild?.("received", XMPP_CARBONS_NS))) return;
    const envelope = carbon?.message ?? stanza;
    const subItems = envelope.getChild?.("event", XMPP_PUBSUB_EVENT_NS)?.getChild?.("items");
    const isMucSub = subItems?.attrs?.node?.startsWith("urn:xmpp:mucsub:nodes:") === true;
    const subscriptionMessage = isMucSub ? this.unwrapMucSubMessage(envelope) : null;
    if (isMucSub && !subscriptionMessage) {
      this.log("warn", "chat_mucsub_event_rejected", { from: envelope.attrs?.from });
      return;
    }
    const messageStanza = subscriptionMessage ?? envelope;
    const transportTimestamp = parseServerMessageTimestamp(messageStanza, this.config.domain) ?? carbon?.timestamp ?? parseTrustedDelayTimestamp(envelope, this.config.domain) ?? parseTrustedDelayTimestamp(messageStanza, this.config.domain);
    const attrs = messageStanza.attrs ?? {};
    const groupInvitation = this.parseGroupInvitation(messageStanza);
    if (groupInvitation) {
      this.emit(this.groupInvitationListeners, groupInvitation);
      this.log("info", "chat_muc_invitation_received", {
        mucJid: groupInvitation.mucJid,
        fromJid: groupInvitation.fromJid
      });
      return;
    }
    const isGroupMessage = attrs.type === "groupchat";
    const mucSenderJid = isGroupMessage ? this.getMucRealSenderJid(messageStanza) : void 0;
    const stanzaFromAddress = addressToString(attrs.from);
    const fromFullAddress = normalizeTransportAddress(
      mucSenderJid ?? stanzaFromAddress
    );
    const fromDeviceId = fromFullAddress || normalizeBareDeviceId(mucSenderJid ?? stanzaFromAddress);
    const fromUserId = getUserIdFromChatAddress(fromFullAddress) || "";
    const toDeviceId = isGroupMessage ? this.getDeviceId() : attrs.to ? normalizeTransportAddress(addressToString(attrs.to)) || addressToString(attrs.to) : this.getDeviceId();
    const mucRoomId = isGroupMessage ? this.groupRoomIdsByMucJid.get(normalizeBareDeviceId(stanzaFromAddress)) : void 0;
    const roomId = trimToUndefined(messageStanza.getChildText?.("thread") ?? void 0) ?? mucRoomId;
    this.rememberRoomPeer(roomId, carbon?.direction === "sent" ? toDeviceId : fromDeviceId);
    this.log("debug", "chat_message_stanza_received", {
      id: attrs.id,
      type: attrs.type,
      fromDeviceId,
      toDeviceId,
      roomId,
      carbonDirection: carbon?.direction
    });
    const receipt = messageStanza.getChild?.("received", XMPP_RECEIPTS_NS);
    const markerReceived = messageStanza.getChild?.("received", XMPP_CHAT_MARKERS_NS);
    const displayed = messageStanza.getChild?.("displayed", XMPP_CHAT_MARKERS_NS);
    const receiptId = receipt?.attrs?.id ?? markerReceived?.attrs?.id;
    if (receiptId) {
      if (roomId) {
        this.emit(this.deliveryListeners, {
          id: receiptId,
          fromUserId,
          fromFullAddress,
          fromDeviceId,
          toDeviceId,
          roomId,
          status: "delivered",
          raw: messageStanza
        });
        this.log("debug", "chat_delivery_received", {
          id: receiptId,
          roomId,
          status: "delivered",
          fromDeviceId
        });
      } else {
        this.log("debug", "chat_delivery_ignored_missing_room", {
          id: receiptId,
          fromDeviceId
        });
      }
      return;
    }
    if (displayed?.attrs?.id) {
      if (roomId) {
        this.emit(this.deliveryListeners, {
          id: displayed.attrs.id,
          fromUserId,
          fromFullAddress,
          fromDeviceId,
          toDeviceId,
          roomId,
          status: "read",
          raw: messageStanza
        });
        this.log("debug", "chat_delivery_received", {
          id: displayed.attrs.id,
          roomId,
          status: "read",
          fromDeviceId
        });
      } else {
        this.log("debug", "chat_read_marker_ignored_missing_room", {
          id: displayed.attrs.id,
          fromDeviceId
        });
      }
      return;
    }
    if (attrs.type === "error") {
      const errorEvent = parseStanzaError(messageStanza);
      this.log("warn", "chat_message_error_stanza_received", {
        id: attrs.id,
        roomId,
        condition: errorEvent.condition,
        text: errorEvent.text
      });
      this.emit(this.errorListeners, {
        ...errorEvent,
        id: attrs.id,
        fromUserId: fromUserId || void 0,
        fromFullAddress: fromFullAddress || void 0,
        fromDeviceId,
        toDeviceId,
        roomId,
        raw: messageStanza
      });
      return;
    }
    const retraction = messageStanza.getChild?.("retract", XMPP_RETRACT_NS);
    if (retraction) {
      if (transportTimestamp === void 0) return;
      const targetMessageId = trimToUndefined(retraction.attrs?.id);
      if (targetMessageId && roomId && toDeviceId) {
        const eventId = attrs.id || generateMessageId();
        await this.processRetraction({
          id: eventId,
          targetMessageId,
          fromUserId,
          fromFullAddress,
          fromDeviceId,
          toDeviceId,
          roomId,
          timestamp: transportTimestamp,
          raw: messageStanza
        });
      } else {
        this.log("warn", "chat_message_retraction_ignored_missing_context", {
          id: attrs.id,
          targetMessageId,
          roomId,
          fromDeviceId,
          hasToDeviceId: Boolean(toDeviceId)
        });
      }
      return;
    }
    const composing = messageStanza.getChild?.("composing", XMPP_CHATSTATES_NS);
    const paused = messageStanza.getChild?.("paused", XMPP_CHATSTATES_NS);
    const gone = messageStanza.getChild?.("gone", XMPP_CHATSTATES_NS);
    if ((composing || paused) && roomId) {
      this.emit(this.typingListeners, {
        fromUserId,
        fromFullAddress,
        fromDeviceId,
        toDeviceId,
        roomId,
        isTyping: Boolean(composing),
        raw: messageStanza
      });
      this.log("debug", "chat_typing_received", {
        roomId,
        fromDeviceId,
        isTyping: Boolean(composing)
      });
    }
    if (gone) {
      if (transportTimestamp === void 0) return;
      if (roomId) {
        const eventId = attrs.id || generateMessageId();
        this.emit(this.threadGoneListeners, {
          id: eventId,
          fromUserId,
          fromFullAddress,
          fromDeviceId,
          toDeviceId,
          roomId,
          timestamp: transportTimestamp,
          raw: messageStanza
        });
        this.log("debug", "chat_thread_gone_received", {
          id: eventId,
          roomId,
          fromDeviceId
        });
      } else {
        this.log("debug", "chat_thread_gone_ignored_missing_room", {
          id: attrs.id,
          fromDeviceId
        });
      }
    }
    const decoded = await this.decodePayload(messageStanza);
    const body = decoded.body;
    const attachments = normalizeAttachmentPayload(decoded.attachments);
    if (this.config.requireEncryptedAttachments && attachments?.some((attachment) => !isEncryptedChatAttachment(attachment))) {
      const error = new Error("chat_attachment_encryption_required");
      this.log("warn", "chat_attachment_rejected_unencrypted", {
        id: attrs.id,
        roomId,
        fromDeviceId
      });
      this.emit(this.errorListeners, {
        id: attrs.id,
        fromUserId: fromUserId || void 0,
        fromFullAddress: fromFullAddress || void 0,
        fromDeviceId,
        toDeviceId,
        roomId,
        error,
        raw: messageStanza
      });
      return;
    }
    if (this.config.requireEncryptedAttachments && attachments?.some(
      (attachment) => !hasChatAttachmentDownloadCapability(attachment)
    )) {
      const error = new Error("chat_attachment_download_capability_required");
      this.log("warn", "chat_attachment_rejected_without_capability", {
        id: attrs.id,
        roomId,
        fromDeviceId
      });
      this.emit(this.errorListeners, {
        id: attrs.id,
        fromUserId: fromUserId || void 0,
        fromFullAddress: fromFullAddress || void 0,
        fromDeviceId,
        toDeviceId,
        roomId,
        error,
        raw: messageStanza
      });
      return;
    }
    if (!body.trim() && !attachments?.length) {
      this.log("debug", gone ? "chat_message_ignored_chat_state" : "chat_message_ignored_empty", {
        id: attrs.id,
        fromDeviceId,
        roomId
      });
      return;
    }
    if (!roomId || !toDeviceId) {
      this.log("debug", "chat_message_ignored_missing_target_context", {
        id: attrs.id,
        fromDeviceId,
        roomId,
        hasToDeviceId: Boolean(toDeviceId)
      });
      return;
    }
    const emergencyTag = messageStanza.getChild?.("emergency", XMPP_EMERGENCY_NS);
    const emergencyTagMetadata = emergencyTag ? {
      messageType: CHAT_EMERGENCY_MESSAGE_TYPE,
      emergencyType: emergencyTag.attrs?.type,
      emergencyAlertId: emergencyTag.attrs?.["alert-id"],
      emergencyTriggeredAt: emergencyTag.attrs?.["triggered-at"]
    } : void 0;
    const originId = trimToUndefined(
      messageStanza.getChild?.("origin-id", XMPP_STABLE_ID_NS)?.attrs?.id
    );
    const decodedMetadata = emergencyTagMetadata ? { ...decoded.metadata ?? {}, ...emergencyTagMetadata } : { ...decoded.metadata ?? {} };
    if (originId) decodedMetadata.originId = originId;
    const metadata = normalizeMessageMetadata(
      decodedMetadata,
      inferMessageType(decodedMetadata, body)
    );
    const emittedMessageId = attrs.id || generateMessageId();
    if (transportTimestamp === void 0) {
      this.log("warn", "chat_message_server_timestamp_missing", { id: emittedMessageId, roomId });
      this.emit(this.errorListeners, {
        id: emittedMessageId,
        roomId,
        fromDeviceId,
        error: new Error("chat_message_server_timestamp_missing"),
        raw: messageStanza
      });
      return;
    }
    metadata.serverTimestampMs = transportTimestamp;
    const message = {
      id: emittedMessageId,
      fromUserId,
      fromFullAddress,
      fromDeviceId,
      toDeviceId,
      roomId,
      body,
      timestamp: transportTimestamp,
      metadata,
      ...attachments?.length ? { attachments } : {},
      raw: messageStanza
    };
    const originalAuthorAddress = fromFullAddress || fromDeviceId;
    const receiptRequest = messageStanza.getChild?.("request", XMPP_RECEIPTS_NS);
    const receiptRequested = Boolean(
      !carbon && !isGroupMessage && attrs.id && receiptRequest && fromDeviceId
    );
    let receiptSent = false;
    let receiptPromise = null;
    const delivery = {
      receiptRequested,
      acknowledgeDelivered: async () => {
        if (!receiptRequested || receiptSent) return;
        if (!receiptPromise) {
          receiptPromise = this.sendReceipt({
            toDeviceId: fromDeviceId,
            roomId,
            messageId: attrs.id
          }).then(() => {
            receiptSent = true;
            this.log("debug", "chat_delivery_receipt_sent", {
              id: attrs.id,
              roomId,
              toDeviceId: fromDeviceId,
              mode: this.config.deliveryReceiptMode
            });
          });
        }
        try {
          await receiptPromise;
        } catch (error) {
          receiptPromise = null;
          throw error;
        }
      }
    };
    this.rememberMessageAuthor(roomId, emittedMessageId, originalAuthorAddress);
    await this.emitValidatedMessage(message, delivery);
    this.flushPendingRetraction(roomId, emittedMessageId, originalAuthorAddress);
    this.log("debug", "chat_message_received", {
      id: emittedMessageId,
      roomId,
      fromDeviceId,
      messageType: metadata.messageType,
      hasAttachments: Boolean(attachments?.length)
    });
  }
  async sendReceipt(input) {
    const xmpp = this.requireXmpp();
    const receiptId = `rcpt-${generateMessageId()}`;
    const children = [
      xml("received", { xmlns: XMPP_RECEIPTS_NS, id: input.messageId })
    ];
    if (input.roomId) children.unshift(xml("thread", {}, input.roomId));
    if (this.config.awaitServerAcknowledgement && xmpp.streamManagement.enabled !== true) {
      throw new Error("chat_stream_management_unavailable");
    }
    const serverAckPromise = this.config.awaitServerAcknowledgement ? this.createServerAckWaiter(receiptId, [input.toDeviceId]) : null;
    try {
      await xmpp.send(
        xml("message", {
          to: input.toDeviceId,
          type: "chat",
          id: receiptId
        }, ...children)
      );
      if (serverAckPromise) {
        this.updateServerAckExpectedTargets(receiptId, [input.toDeviceId]);
        await serverAckPromise;
      }
    } catch (error) {
      this.cancelServerAckWaiter(receiptId);
      throw error;
    }
  }
  getEncryptionContext() {
    return {
      getDeviceId: () => this.getDeviceId(),
      getBareDeviceId: () => this.getBareDeviceId(),
      sendIq: (input) => this.sendIq(input),
      logger: this.config.logger
    };
  }
  getAttachmentUploadContext(roomId) {
    return {
      roomId,
      apiKey: this.config.apiKey,
      xmppDomain: this.config.domain,
      userId: this.config.userId,
      deviceId: this.config.localDeviceId,
      requestSlot: (input) => this.requestAttachmentUploadSlot(input),
      logger: this.config.logger
    };
  }
  getAttachmentResolveContext() {
    return {
      apiKey: this.config.apiKey,
      xmppDomain: this.config.domain,
      userId: this.config.userId,
      deviceId: this.config.localDeviceId,
      logger: this.config.logger
    };
  }
  rememberRoomPeer(roomId, peerDeviceId) {
    const normalizedRoomId = roomId?.trim();
    const normalizedPeerDeviceId = normalizeTransportAddress(peerDeviceId);
    if (!normalizedRoomId || !normalizedPeerDeviceId) return;
    if (isOwnTransportTarget(normalizedPeerDeviceId, this.getDeviceId(), this.getBareDeviceId())) return;
    const peers = this.roomPeers.get(normalizedRoomId) ?? /* @__PURE__ */ new Set();
    const previousSize = peers.size;
    peers.add(normalizedPeerDeviceId);
    this.roomPeers.set(normalizedRoomId, peers);
    if (peers.size !== previousSize) {
      this.log("debug", "chat_room_peer_remembered", {
        roomId: normalizedRoomId,
        peerDeviceId: normalizedPeerDeviceId,
        peerCount: peers.size
      });
    }
  }
  rememberRoomPeers(roomId, peerDeviceIds) {
    peerDeviceIds?.forEach((peerDeviceId) => this.rememberRoomPeer(roomId, peerDeviceId));
  }
  async resolveRoomForUserId(input) {
    const userId = input.userId.trim();
    if (!userId) throw new Error("chat_user_id_required");
    const provider = this.config.roomDirectory?.getOrCreateRoom;
    if (!provider) throw new Error("chat_room_directory_get_or_create_required");
    const room = await provider({ userId, metadata: input.metadata });
    const normalizedRoomId = room.roomId.trim();
    if (!normalizedRoomId) throw new Error("chat_room_id_required");
    this.rememberRoomPeers(
      normalizedRoomId,
      deriveRoomDeviceIds(room)
    );
    return { ...room, roomId: normalizedRoomId };
  }
  async resolveRoomTargets(input) {
    const explicit = normalizeTargetAddressList(
      input.explicitDeviceIds ?? [],
      input.targetScope
    );
    if (input.roomId) this.rememberRoomPeers(input.roomId, explicit);
    const resolverDeviceIds = input.roomId ? await this.getPeerDeviceIds(input.roomId) : [];
    const cachedDeviceIds = input.roomId ? this.getCachedRoomPeers(input.roomId) : [];
    const ownTransportAddress = normalizeTransportAddress(this.getDeviceId());
    const ownBareAddress = this.getBareDeviceId();
    const targets = normalizeTargetAddressList(
      [...explicit, ...resolverDeviceIds, ...cachedDeviceIds],
      input.targetScope
    ).filter((target) => !isOwnTransportTarget(target, ownTransportAddress, ownBareAddress));
    this.log("debug", "chat_room_targets_resolved", {
      roomId: input.roomId,
      targetScope: input.targetScope,
      explicitCount: explicit.length,
      resolverCount: resolverDeviceIds.length,
      cachedCount: cachedDeviceIds.length,
      targetCount: targets.length
    });
    if (!targets.length) {
      const suffix = input.roomId ? `:${input.roomId}` : "";
      throw new Error(`chat_room_peer_unknown${suffix}`);
    }
    return targets;
  }
  getGroupRoomForTransport(roomId) {
    const normalizedRoomId = roomId?.trim();
    return normalizedRoomId ? this.groupRooms.get(normalizedRoomId) : void 0;
  }
  getGroupEncryptionRecipientJids(room) {
    const occupantPrefix = `${normalizeBareDeviceId(room.mucJid).toLowerCase()}/`;
    const activeOccupants = Array.from(this.mucOccupantRealJids.entries()).filter(([occupantJid]) => occupantJid.startsWith(occupantPrefix)).map(([, realJid]) => normalizeBareDeviceId(realJid)).filter(Boolean);
    const recipients = Array.from(
      new Set(
        [...room.memberJids, ...activeOccupants].map((jid) => normalizeBareDeviceId(jid)).filter(Boolean)
      )
    );
    this.log("debug", "chat_muc_encryption_recipients_resolved", {
      roomId: room.roomId,
      configuredCount: room.memberJids.length,
      activeOccupantCount: activeOccupants.length,
      recipientCount: recipients.length
    });
    return recipients;
  }
  getCachedRoomPeers(roomId) {
    return Array.from(this.roomPeers.get(roomId.trim()) ?? []);
  }
  async resolveRoomDeviceIds(roomId) {
    const normalizedRoomId = roomId.trim();
    if (!normalizedRoomId) return [];
    if (this.config.roomDirectory?.getPeerDeviceIds) {
      const resolved = await this.config.roomDirectory.getPeerDeviceIds(normalizedRoomId);
      const normalized = normalizeTransportAddressList(resolved);
      this.log("debug", "chat_room_directory_peer_devices_resolved", {
        roomId: normalizedRoomId,
        deviceCount: normalized.length
      });
      return normalized;
    }
    if (this.config.resolveRoomDeviceIds) {
      const resolved = await this.config.resolveRoomDeviceIds(normalizedRoomId);
      const normalized = normalizeTransportAddressList(resolved);
      this.log("debug", "chat_room_fallback_peer_devices_resolved", {
        roomId: normalizedRoomId,
        deviceCount: normalized.length
      });
      return normalized;
    }
    this.log("debug", "chat_room_peer_devices_unresolved", { roomId: normalizedRoomId });
    return [];
  }
  async sendToTargets(targetDeviceIds, send) {
    const targets = normalizeTransportAddressList(targetDeviceIds);
    if (!targets.length) throw new Error("chat_targets_required");
    const results = await Promise.all(
      targets.map(async (targetDeviceId) => {
        try {
          await send(targetDeviceId);
          return { ok: true, targetDeviceId };
        } catch (error) {
          this.log("warn", "chat_target_send_failed", { targetDeviceId, error });
          return { ok: false, error };
        }
      })
    );
    const successfulTargets = results.filter((result) => result.ok).map((result) => result.targetDeviceId);
    if (successfulTargets.length) return successfulTargets;
    throw results.find((result) => !result.ok)?.error ?? new Error("chat_send_failed");
  }
  clearTypingAutoPause(roomId) {
    const timer = this.typingAutoPauseTimers.get(roomId);
    if (!timer) return;
    clearTimeout(timer);
    this.typingAutoPauseTimers.delete(roomId);
  }
  scheduleTypingAutoPause(roomId, delayMs) {
    if (!Number.isFinite(delayMs) || delayMs <= 0) return;
    const timer = setTimeout(() => {
      this.typingAutoPauseTimers.delete(roomId);
      this.sendTyping({ roomId, isTyping: false }).catch((error) => {
        this.emit(this.errorListeners, { error, roomId });
      });
    }, delayMs);
    this.typingAutoPauseTimers.set(roomId, timer);
  }
  async encodePayload(input) {
    const encrypted = await this.config.encryption?.encrypt?.(input, this.getEncryptionContext());
    if (Array.isArray(encrypted)) {
      this.log("debug", "chat_payload_encoded_encrypted_array", {
        messageType: input.metadata.messageType,
        childCount: encrypted.length
      });
      return { body: input.body, children: encrypted };
    }
    if (encrypted) {
      this.log("debug", "chat_payload_encoded_encrypted", {
        messageType: input.metadata.messageType,
        childCount: encrypted.children?.length ?? 0
      });
      return {
        body: encrypted.body ?? input.body,
        children: encrypted.children ?? []
      };
    }
    if (this.config.requireEncryptedPayloads) {
      throw new Error("chat_payload_encryption_required");
    }
    this.log("debug", "chat_payload_encoded_plain", {
      messageType: input.metadata.messageType,
      hasAttachments: Boolean(input.attachments?.length)
    });
    return {
      body: input.body,
      children: [
        xml(
          "lula",
          { xmlns: XMPP_CHAT_NS },
          encodeJsonBase64({
            metadata: input.metadata,
            ...input.attachments?.length ? { attachments: serializeAttachmentsForWire(input.attachments) } : {}
          })
        )
      ]
    };
  }
  async decodePayload(stanza) {
    const decrypted = await this.config.encryption?.decrypt?.(
      { stanza },
      this.getEncryptionContext()
    );
    if (decrypted) {
      this.log("debug", "chat_payload_decoded_encrypted", {
        hasBody: Boolean(decrypted.body?.trim()),
        hasAttachments: Boolean(decrypted.attachments?.length)
      });
      return decrypted;
    }
    if (this.config.requireEncryptedPayloads) {
      throw new Error("chat_payload_encryption_required");
    }
    const body = stanza.getChildText?.("body") ?? "";
    const encodedMetadata = stanza.getChild?.("lula", XMPP_CHAT_NS)?.getText?.();
    const metadataPayload = encodedMetadata ? decodeJsonBase64(encodedMetadata) : null;
    const metadata = metadataPayload && typeof metadataPayload === "object" && !Array.isArray(metadataPayload) && isRecord(metadataPayload.metadata) ? metadataPayload.metadata : void 0;
    const attachments = metadataPayload && typeof metadataPayload === "object" && !Array.isArray(metadataPayload) ? normalizeAttachmentPayload(metadataPayload.attachments) : void 0;
    this.log("debug", "chat_payload_decoded_plain", {
      hasBody: Boolean(body.trim()),
      hasMetadata: Boolean(metadata),
      hasAttachments: Boolean(attachments?.length)
    });
    return { body, metadata, attachments };
  }
  setStatus(status, error) {
    this.status = status;
    this.log(status === "error" ? "error" : "debug", "chat_status_changed", {
      status,
      deviceId: this.onlineDeviceId,
      ...error ? { error } : {}
    });
    this.emit(this.statusListeners, {
      status,
      deviceId: this.onlineDeviceId,
      error
    });
  }
  requireXmpp() {
    if (!this.xmpp) throw new Error("chat_client_not_connected");
    return this.xmpp;
  }
  resolvePendingIq(stanza) {
    if (!stanza.is?.("iq")) return;
    const id = stanza.attrs?.id;
    if (!id) return;
    const pending = this.pendingIqMap.get(id);
    if (!pending) return;
    this.pendingIqMap.delete(id);
    clearTimeout(pending.timeout);
    if (stanza.attrs?.type === "error") {
      pending.reject(new Error(`chat_iq_error:${toRawXmlString(stanza) || id}`));
      return;
    }
    pending.resolve(stanza);
  }
  rejectPendingIq(error) {
    const entries = Array.from(this.pendingIqMap.values());
    this.pendingIqMap.clear();
    for (const entry of entries) {
      clearTimeout(entry.timeout);
      entry.reject(error);
    }
  }
  async sendIq(input) {
    const xmpp = this.requireXmpp();
    const id = generateIqId();
    const timeoutMs = input.timeoutMs ?? DEFAULT_IQ_TIMEOUT_MS;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingIqMap.delete(id);
        reject(new Error(`chat_iq_timeout:${id}`));
      }, timeoutMs);
      this.pendingIqMap.set(id, { resolve, reject, timeout });
      const attrs = input.to ? { type: input.type, id, to: input.to } : { type: input.type, id };
      void xmpp.send(xml("iq", attrs, input.payload)).catch((error) => {
        clearTimeout(timeout);
        this.pendingIqMap.delete(id);
        reject(error instanceof Error ? error : new Error(String(error)));
      });
    });
  }
  async requestAttachmentUploadSlot(input) {
    const stanza = await this.sendIq({
      type: "get",
      to: this.config.uploadService,
      payload: xml("request", {
        xmlns: XMPP_HTTP_UPLOAD_NS,
        filename: input.name,
        size: String(Math.max(1, Math.floor(input.size))),
        "content-type": input.mimeType
      })
    });
    return parseUploadSlotResponse(stanza);
  }
  rememberMessageAuthor(roomId, messageId, authorAddress) {
    const normalizedRoomId = roomId.trim();
    const normalizedMessageId = messageId.trim();
    const normalizedAuthor = normalizeTransportAddress(authorAddress) || normalizeBareDeviceId(authorAddress);
    if (!normalizedRoomId || !normalizedMessageId || !normalizedAuthor) return;
    let roomAuthors = this.messageAuthorsByRoom.get(normalizedRoomId);
    if (!roomAuthors) {
      roomAuthors = /* @__PURE__ */ new Map();
      this.messageAuthorsByRoom.set(normalizedRoomId, roomAuthors);
      while (this.messageAuthorsByRoom.size > MAX_RUNTIME_MESSAGE_AUTHOR_ROOMS) {
        const oldestRoomId = this.messageAuthorsByRoom.keys().next().value;
        if (!oldestRoomId) break;
        this.messageAuthorsByRoom.delete(oldestRoomId);
      }
    }
    roomAuthors.delete(normalizedMessageId);
    roomAuthors.set(normalizedMessageId, normalizedAuthor);
    while (roomAuthors.size > MAX_RUNTIME_MESSAGE_AUTHORS_PER_ROOM) {
      const oldestMessageId = roomAuthors.keys().next().value;
      if (!oldestMessageId) break;
      roomAuthors.delete(oldestMessageId);
    }
  }
  queuePendingRetraction(event) {
    let pending = this.pendingRetractionsByRoom.get(event.roomId);
    if (!pending) {
      pending = /* @__PURE__ */ new Map();
      this.pendingRetractionsByRoom.set(event.roomId, pending);
      while (this.pendingRetractionsByRoom.size > MAX_PENDING_RETRACTION_ROOMS) {
        const oldestRoomId = this.pendingRetractionsByRoom.keys().next().value;
        if (!oldestRoomId) break;
        this.pendingRetractionsByRoom.delete(oldestRoomId);
      }
    }
    pending.delete(event.targetMessageId);
    pending.set(event.targetMessageId, event);
    while (pending.size > MAX_PENDING_RETRACTIONS_PER_ROOM) {
      const oldestMessageId = pending.keys().next().value;
      if (!oldestMessageId) break;
      pending.delete(oldestMessageId);
    }
  }
  emitVerifiedRetraction(event, originalAuthorAddress) {
    if (!isRetractionAuthorized(event, originalAuthorAddress)) {
      this.log("warn", "chat_message_retraction_rejected_author_mismatch", {
        id: event.id,
        targetMessageId: event.targetMessageId,
        roomId: event.roomId,
        retractionAuthor: event.fromFullAddress || event.fromDeviceId,
        originalAuthor: originalAuthorAddress
      });
      return;
    }
    const original = this.editTargets.get(this.editTargetKey(event.roomId, event.targetMessageId));
    if (original) original.metadata = { ...original.metadata, retracted: true };
    this.emit(this.retractionListeners, event);
    this.log("debug", "chat_message_retraction_received", {
      id: event.id,
      targetMessageId: event.targetMessageId,
      roomId: event.roomId,
      fromDeviceId: event.fromDeviceId
    });
  }
  async processRetraction(event) {
    let originalAuthor = this.messageAuthorsByRoom.get(event.roomId)?.get(event.targetMessageId);
    if (!originalAuthor && this.config.resolveMessageAuthor) {
      try {
        originalAuthor = trimToUndefined(
          await this.config.resolveMessageAuthor({
            roomId: event.roomId,
            messageId: event.targetMessageId
          })
        );
      } catch (error) {
        this.log("warn", "chat_message_retraction_author_lookup_failed", {
          id: event.id,
          targetMessageId: event.targetMessageId,
          roomId: event.roomId,
          error
        });
      }
    }
    if (!originalAuthor) {
      this.queuePendingRetraction(event);
      this.log("warn", "chat_message_retraction_queued_unknown_original_author", {
        id: event.id,
        targetMessageId: event.targetMessageId,
        roomId: event.roomId
      });
      return;
    }
    this.rememberMessageAuthor(event.roomId, event.targetMessageId, originalAuthor);
    this.emitVerifiedRetraction(event, originalAuthor);
  }
  flushPendingRetraction(roomId, messageId, originalAuthorAddress) {
    const pending = this.pendingRetractionsByRoom.get(roomId);
    const event = pending?.get(messageId);
    if (!event) return;
    pending?.delete(messageId);
    if (pending?.size === 0) this.pendingRetractionsByRoom.delete(roomId);
    this.emitVerifiedRetraction(event, originalAuthorAddress);
  }
  emit(listeners, event) {
    for (const listener of Array.from(listeners)) {
      try {
        listener(event);
      } catch (error) {
        this.log("error", "chat_listener_error", { error });
      }
    }
  }
  editTargetKey(roomId, messageId) {
    return JSON.stringify([roomId, messageId]);
  }
  rememberEditTarget(roomId, messageId, target) {
    const key = this.editTargetKey(roomId, messageId);
    if (!this.editTargets.has(key)) this.editTargets.set(key, target);
    else if (this.editTargets.get(key).timestamp === 0 && target.timestamp > 0)
      this.editTargets.get(key).timestamp = target.timestamp;
    while (this.editTargets.size > 2e3)
      this.editTargets.delete(this.editTargets.keys().next().value);
  }
  async resolveEditTarget(roomId, messageId) {
    const persisted = await this.config.resolveMessageForEdit?.({ roomId, messageId });
    if (this.config.resolveMessageForEdit) return persisted;
    return this.editTargets.get(this.editTargetKey(roomId, messageId));
  }
  async emitValidatedMessage(message, delivery) {
    const targetId = typeof message.metadata.replacesId === "string" ? message.metadata.replacesId.trim() : "";
    if (message.metadata.edited === true && targetId) {
      const original = await this.resolveEditTarget(message.roomId, targetId);
      if (!original) {
        this.pendingEdits.set(this.editTargetKey(message.roomId, message.id), {
          message,
          delivery
        });
        while (this.pendingEdits.size > 200)
          this.pendingEdits.delete(this.pendingEdits.keys().next().value);
        return;
      }
      const error = getMessageEditError(
        original,
        message.fromFullAddress || message.fromDeviceId,
        message.timestamp
      );
      if (error || message.metadata.messageType !== "CHAT_MESSAGE" || message.attachments?.length || !message.body.trim()) {
        this.log("warn", "chat_edit_rejected", {
          id: message.id,
          reason: error ?? "chat_edit_not_allowed"
        });
        await delivery.acknowledgeDelivered();
        return;
      }
      this.emitMessage(message, delivery);
      if (this.config.deliveryReceiptMode === "automatic") await delivery.acknowledgeDelivered();
      return;
    }
    if (message.metadata.edited === true || targetId && message.metadata.edited) {
      this.log("warn", "chat_edit_rejected", { id: message.id, reason: "chat_edit_not_allowed" });
      await delivery.acknowledgeDelivered();
      return;
    }
    delete message.metadata.replacesId;
    const target = {
      authorAddress: message.fromFullAddress || message.fromDeviceId,
      timestamp: message.timestamp,
      body: message.body,
      hasAttachments: Boolean(message.attachments?.length),
      metadata: message.metadata
    };
    this.rememberEditTarget(message.roomId, message.id, target);
    if (message.metadata.originId)
      this.rememberEditTarget(message.roomId, message.metadata.originId, target);
    this.emitMessage(message, delivery);
    if (this.config.deliveryReceiptMode === "automatic") await delivery.acknowledgeDelivered();
    for (const [key, pending] of Array.from(this.pendingEdits)) {
      if (pending.message.roomId !== message.roomId || ![message.id, message.metadata.originId].includes(
        String(pending.message.metadata.replacesId)
      ))
        continue;
      this.pendingEdits.delete(key);
      const error = getMessageEditError(
        target,
        pending.message.fromFullAddress || pending.message.fromDeviceId,
        pending.message.timestamp
      );
      if (!error && pending.message.metadata.messageType === "CHAT_MESSAGE" && !pending.message.attachments?.length && pending.message.body.trim()) {
        this.emitMessage(pending.message, pending.delivery);
        if (this.config.deliveryReceiptMode === "automatic")
          await pending.delivery.acknowledgeDelivered();
      } else {
        await pending.delivery.acknowledgeDelivered();
      }
    }
  }
  emitMessage(message, delivery) {
    for (const listener of Array.from(this.messageListeners)) {
      try {
        listener(message, delivery);
      } catch (error) {
        this.log("error", "chat_listener_error", { error });
      }
    }
  }
  log(level, message, data) {
    const logger = this.config.logger;
    if (!logger) return;
    if (CHAT_LOG_LEVEL_WEIGHT[this.config.logLevel] < CHAT_LOG_LEVEL_WEIGHT[level]) return;
    logger[level]?.(message, data);
  }
};
function createOmemoEncryption(options = {}) {
  const storage = options.storage ?? createInMemoryKeyValueStore();
  const stateKeyPrefix = options.stateKeyPrefix ?? DEFAULT_OMEMO_STATE_KEY_PREFIX;
  let cachedState = null;
  let publishedBareJid = null;
  let identityPublishPromise = null;
  const refreshAfterMs = Math.max(1e3, options.discoveryRefreshAfterMs ?? 3e4);
  let discoveryLogger;
  const discoveryStore = options.discoveryCache ?? createStoredOmemoDiscoveryCache(
    storage,
    stateKeyPrefix,
    (error) => discoveryLogger?.warn?.("chat_omemo_cache_storage_failed", { error })
  );
  const discovery = createOmemoDiscoveryReader(
    discoveryStore,
    { refreshAfterMs, maxAgeMs: Math.max(refreshAfterMs, options.discoveryMaxAgeMs ?? 12e4) }
  );
  const subscriptions = /* @__PURE__ */ new Map();
  const watchedPeers = /* @__PURE__ */ new Map();
  let connectionEpoch = 0;
  const stateKey = (bareJid) => `${stateKeyPrefix}:${bareJid}`;
  const sendOmemoIq = async (context, input, operation) => {
    const startedEpoch = connectionEpoch;
    let lastError;
    for (let attempt = 1; attempt <= OMEMO_IQ_MAX_ATTEMPTS; attempt += 1) {
      if (startedEpoch !== connectionEpoch) throw new Error("xmpp_omemo_cache_reset");
      try {
        return await context.sendIq({
          ...input,
          timeoutMs: OMEMO_IQ_TIMEOUT_MS
        });
      } catch (error) {
        if (startedEpoch !== connectionEpoch) throw new Error("xmpp_omemo_cache_reset");
        if (error instanceof Error && error.message.startsWith("chat_iq_error:")) throw error;
        lastError = error;
        if (attempt === OMEMO_IQ_MAX_ATTEMPTS) break;
        context.logger?.warn?.("chat_omemo_iq_retry", {
          operation,
          attempt,
          to: input.to,
          error
        });
        await new Promise((resolve) => {
          setTimeout(resolve, OMEMO_IQ_RETRY_DELAY_MS * attempt);
        });
      }
    }
    throw lastError instanceof Error ? lastError : new Error(`chat_omemo_iq_failed:${operation}`);
  };
  const loadOrCreateState = async (bareJid) => {
    if (cachedState?.bareJid === bareJid) return cachedState;
    const raw = await storage.getItem(stateKey(bareJid));
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (isValidOmemoState(parsed) && parsed.bareJid === bareJid) {
          cachedState = parsed;
          return parsed;
        }
      } catch {
      }
    }
    const privateKey = nobleRandomBytes(32);
    const publicKey = options.crypto ? await options.crypto.publicKey(privateKey) : x25519.getPublicKey(privateKey);
    const nextState = {
      bareJid,
      omemoDeviceId: Math.max(1, bytesToUint32(nobleRandomBytes(4))),
      identityPrivateKey: bytesToBase64(privateKey),
      identityPublicKey: bytesToBase64(publicKey)
    };
    await storage.setItem(stateKey(bareJid), JSON.stringify(nextState));
    cachedState = nextState;
    return nextState;
  };
  const fetchDeviceIds = async (context, address) => {
    const bareJid = normalizeBareDeviceId(address);
    if (!bareJid) throw new Error("xmpp_omemo_bare_jid_required");
    context.logger?.debug?.("chat_omemo_device_discovery_started", {
      bareJid,
      node: OMEMO_DEVICELIST_NODE
    });
    let stanza;
    try {
      stanza = await sendOmemoIq(
        context,
        {
          type: "get",
          to: bareJid,
          payload: xml(
            "pubsub",
            { xmlns: PUBSUB_NS },
            xml("items", { node: OMEMO_DEVICELIST_NODE, max_items: "1" })
          )
        },
        "discover-devices"
      );
    } catch (error) {
      const message = String(error instanceof Error ? error.message : error);
      if (message.includes("item-not-found") || message.includes("item_not_found")) {
        context.logger?.debug?.("chat_omemo_devices_discovered", {
          bareJid,
          deviceIds: []
        });
        return [];
      }
      context.logger?.warn?.("chat_omemo_device_discovery_failed", {
        bareJid,
        error
      });
      throw error;
    }
    const deviceIds = /* @__PURE__ */ new Set();
    const pubsub = stanza.getChild?.("pubsub", PUBSUB_NS) ?? stanza.getChild?.("pubsub");
    const items = pubsub?.getChild?.("items");
    const itemElements = items?.getChildren?.("item") ?? [];
    for (const item of itemElements) {
      const list = item.getChild?.("list", OMEMO_NS) ?? item.getChild?.("list");
      const devices = list?.getChildren?.("device") ?? [];
      for (const device of devices) {
        const parsed = Number(device.attrs?.id ?? "0");
        if (Number.isSafeInteger(parsed) && parsed > 0) {
          deviceIds.add(parsed);
        }
      }
    }
    const discovered = Array.from(deviceIds);
    context.logger?.debug?.("chat_omemo_devices_discovered", {
      bareJid,
      deviceIds: discovered
    });
    return discovered;
  };
  const fetchIdentityKey = async (context, bareJid, deviceId) => {
    const bundleNode = `${OMEMO_BUNDLE_NODE_PREFIX}${deviceId}`;
    let stanza;
    try {
      stanza = await sendOmemoIq(
        context,
        {
          type: "get",
          to: bareJid,
          payload: xml(
            "pubsub",
            { xmlns: PUBSUB_NS },
            xml("items", { node: bundleNode, max_items: "1" })
          )
        },
        "fetch-identity"
      );
    } catch (error) {
      const message = String(error instanceof Error ? error.message : error);
      if (message.includes("item-not-found") || message.includes("item_not_found")) {
        throw new Error("xmpp_omemo_peer_identity_key_missing");
      }
      throw error;
    }
    const raw = toRawXmlString(stanza);
    const match = raw.match(/<identityKey>([\s\S]*?)<\/identityKey>/);
    const identityKeyBase64 = match?.[1]?.trim() ?? "";
    if (!identityKeyBase64) {
      throw new Error("xmpp_omemo_peer_identity_key_missing");
    }
    return base64ToBytes(identityKeyBase64);
  };
  const publishIdentity = async (context) => {
    const bareJid = context.getBareDeviceId();
    if (!bareJid) return;
    const state = await loadOrCreateState(bareJid);
    const existingIds = await fetchDeviceIds(context, bareJid).catch(() => []);
    const finalDeviceIds = Array.from(/* @__PURE__ */ new Set([state.omemoDeviceId, ...existingIds])).filter(
      (value) => Number.isFinite(value) && value > 0
    );
    const publishOptions = xml(
      "publish-options",
      {},
      xml(
        "x",
        { xmlns: XDATA_NS, type: "submit" },
        xml(
          "field",
          { var: "FORM_TYPE", type: "hidden" },
          xml("value", {}, "http://jabber.org/protocol/pubsub#publish-options")
        ),
        xml("field", { var: "pubsub#access_model" }, xml("value", {}, "open")),
        xml("field", { var: "pubsub#persist_items" }, xml("value", {}, "true"))
      )
    );
    await sendOmemoIq(
      context,
      {
        type: "set",
        payload: xml(
          "pubsub",
          { xmlns: PUBSUB_NS },
          xml(
            "publish",
            { node: `${OMEMO_BUNDLE_NODE_PREFIX}${state.omemoDeviceId}` },
            xml(
              "item",
              { id: "current" },
              xml(
                "bundle",
                { xmlns: OMEMO_NS },
                xml("identityKey", {}, state.identityPublicKey)
              )
            )
          ),
          publishOptions
        )
      },
      "publish-identity"
    );
    await sendOmemoIq(
      context,
      {
        type: "set",
        payload: xml(
          "pubsub",
          { xmlns: PUBSUB_NS },
          xml(
            "publish",
            { node: OMEMO_DEVICELIST_NODE },
            xml(
              "item",
              { id: "current" },
              xml(
                "list",
                { xmlns: OMEMO_NS },
                ...finalDeviceIds.map((deviceId) => xml("device", { id: String(deviceId) }))
              )
            )
          ),
          publishOptions
        )
      },
      "publish-devices"
    );
    publishedBareJid = bareJid;
    context.logger?.debug?.("chat_omemo_identity_published", {
      bareJid,
      deviceId: state.omemoDeviceId,
      deviceIds: finalDeviceIds
    });
  };
  const startIdentityPublish = (context) => {
    const bareJid = context.getBareDeviceId();
    if (!bareJid || publishedBareJid === bareJid) return Promise.resolve();
    if (identityPublishPromise) return identityPublishPromise;
    const promise = publishIdentity(context).catch((error) => {
      context.logger?.warn?.("chat_omemo_identity_publish_failed", {
        bareJid,
        error
      });
    }).finally(() => {
      if (identityPublishPromise === promise) identityPublishPromise = null;
    });
    identityPublishPromise = promise;
    return promise;
  };
  const unsubscribe = (context, peer, node) => {
    subscriptions.delete(JSON.stringify([peer, node]));
    const subscriber = context.getDeviceId();
    if (!subscriber) return;
    void context.sendIq({
      type: "set",
      to: peer,
      timeoutMs: OMEMO_IQ_TIMEOUT_MS,
      payload: xml("pubsub", { xmlns: PUBSUB_NS }, xml("unsubscribe", { node, jid: subscriber }))
    }).catch((error) => context.logger?.warn?.("chat_omemo_unsubscribe_failed", { peer, node, error }));
  };
  const subscribe = (context, peer, node) => {
    const subscriber = context.getDeviceId();
    if (!subscriber) return;
    const subscriptionKey = JSON.stringify([peer, node]);
    if (subscriptions.has(subscriptionKey)) return;
    const promise = context.sendIq({
      type: "set",
      to: peer,
      timeoutMs: OMEMO_IQ_TIMEOUT_MS,
      payload: xml(
        "pubsub",
        { xmlns: PUBSUB_NS },
        xml("subscribe", { node, jid: subscriber })
      )
    }).then(() => void 0).catch((error) => {
      if (subscriptions.get(subscriptionKey)?.promise === promise) subscriptions.delete(subscriptionKey);
      context.logger?.warn?.("chat_omemo_subscription_failed", { peer, node, error });
    });
    subscriptions.set(subscriptionKey, { peer, node, promise });
  };
  const fetchSnapshot = async (context, peer) => {
    const startedEpoch = connectionEpoch;
    discoveryLogger = context.logger;
    watchedPeers.delete(peer);
    watchedPeers.set(peer, true);
    if (watchedPeers.size > 128) {
      const retiredPeer = watchedPeers.keys().next().value;
      watchedPeers.delete(retiredPeer);
      discovery.invalidate(context.getBareDeviceId(), retiredPeer);
      for (const subscription of subscriptions.values()) {
        if (subscription.peer === retiredPeer) unsubscribe(context, retiredPeer, subscription.node);
      }
    }
    subscribe(context, peer, OMEMO_DEVICELIST_NODE);
    const deviceIds = await fetchDeviceIds(context, peer);
    if (!deviceIds.length) throw new Error("xmpp_omemo_peer_device_not_found");
    if (deviceIds.length > 128) throw new Error("xmpp_omemo_peer_device_limit");
    const activeNodes = /* @__PURE__ */ new Set([OMEMO_DEVICELIST_NODE, ...deviceIds.map((id) => `${OMEMO_BUNDLE_NODE_PREFIX}${id}`)]);
    for (const subscription of subscriptions.values()) {
      if (subscription.peer === peer && !activeNodes.has(subscription.node)) unsubscribe(context, peer, subscription.node);
    }
    const state = await loadOrCreateState(context.getBareDeviceId());
    const devices = [];
    let nextIndex = 0;
    const results = await Promise.all(
      Array.from({ length: Math.min(4, deviceIds.length) }, async () => {
        const found = [];
        for (; ; ) {
          const index = nextIndex++;
          if (index >= deviceIds.length) return found;
          const deviceId = deviceIds[index];
          subscribe(context, peer, `${OMEMO_BUNDLE_NODE_PREFIX}${deviceId}`);
          try {
            const identityKey = peer === state.bareJid && deviceId === state.omemoDeviceId ? base64ToBytes(state.identityPublicKey) : await fetchIdentityKey(context, peer, deviceId);
            if (identityKey.length !== 32) throw new Error("xmpp_omemo_peer_identity_key_invalid");
            found.push({ deviceId, identityKey: bytesToBase64(identityKey) });
          } catch (error) {
            if (error instanceof Error && error.message === "xmpp_omemo_peer_identity_key_missing") continue;
            throw error;
          }
        }
      })
    );
    if (startedEpoch !== connectionEpoch) throw new Error("xmpp_omemo_cache_reset");
    devices.push(...results.flat());
    devices.sort((a, b) => a.deviceId - b.deviceId);
    if (!devices.length) throw new Error("xmpp_omemo_peer_identity_key_missing");
    return { fetchedAt: Date.now(), devices };
  };
  const establishPeerSessions = async (context, toDeviceId) => {
    const bareJid = context.getBareDeviceId();
    if (!bareJid) {
      throw new Error("xmpp_omemo_state_missing");
    }
    const state = await loadOrCreateState(bareJid);
    const ownPrivateKey = base64ToBytes(state.identityPrivateKey);
    const peerBareJid = normalizeBareDeviceId(toDeviceId);
    const snapshot = await discovery.get(
      bareJid,
      peerBareJid,
      () => fetchSnapshot(context, peerBareJid),
      (error) => context.logger?.warn?.("chat_omemo_background_refresh_failed", { peer: peerBareJid, error })
    );
    return await Promise.all(snapshot.devices.map(async ({ deviceId, identityKey }) => ({
      peerDeviceId: deviceId,
      sharedSecret: options.crypto ? await options.crypto.sharedSecret(ownPrivateKey, base64ToBytes(identityKey)) : x25519.getSharedSecret(ownPrivateKey, base64ToBytes(identityKey))
    })));
  };
  return {
    onConnect: async (context) => {
      const bareJid = context.getBareDeviceId();
      if (!bareJid) return;
      connectionEpoch += 1;
      discoveryLogger = context.logger;
      discovery.reset();
      subscriptions.clear();
      watchedPeers.clear();
      await startIdentityPublish(context);
      await discoveryStore.load?.(bareJid);
      const peers = discoveryStore.peers?.(bareJid).slice(-8) ?? [];
      const startedEpoch = connectionEpoch;
      let nextPeer = 0;
      void Promise.all(Array.from({ length: Math.min(2, peers.length) }, async () => {
        for (; ; ) {
          const peer = peers[nextPeer++];
          if (!peer || startedEpoch !== connectionEpoch) return;
          await discovery.refresh(bareJid, peer, () => fetchSnapshot(context, peer)).catch((error) => context.logger?.warn?.("chat_omemo_background_refresh_failed", { peer, error }));
        }
      }));
    },
    onDisconnect: () => {
      connectionEpoch += 1;
      identityPublishPromise = null;
      discovery.reset();
      subscriptions.clear();
      watchedPeers.clear();
    },
    onStanza: (stanza, context) => {
      const event = stanza.getChild?.("event", "http://jabber.org/protocol/pubsub#event");
      const peer = normalizeBareDeviceId(stanza.attrs?.from);
      const owner = context.getBareDeviceId();
      if (!event || !peer || !owner) return;
      const nodes = ["items", "delete", "purge"].flatMap((name) => event.getChildren?.(name) ?? []).map((child) => child.attrs?.node ?? "");
      if (nodes.some((node) => node === OMEMO_DEVICELIST_NODE || node.startsWith(OMEMO_BUNDLE_NODE_PREFIX))) {
        discovery.invalidate(owner, peer);
      }
    },
    encrypt: async (input, context) => {
      const bareJid = context.getBareDeviceId();
      if (!bareJid) {
        throw new Error("xmpp_omemo_state_missing");
      }
      if (publishedBareJid !== bareJid) {
        void startIdentityPublish(context);
      }
      const state = await loadOrCreateState(bareJid);
      const recipientBareJids = Array.from(
        new Set(
          (input.recipientJids?.length ? input.recipientJids : [input.toDeviceId]).map((address) => normalizeBareDeviceId(address)).filter(Boolean)
        )
      );
      if (!recipientBareJids.length) {
        throw new Error("xmpp_omemo_recipient_required");
      }
      const allRecipientJids = recipientBareJids.includes(bareJid) ? recipientBareJids : [...recipientBareJids, bareJid];
      const sessions = (await Promise.all(
        allRecipientJids.map(
          (recipientBareJid) => establishPeerSessions(context, recipientBareJid)
        )
      )).flat();
      const iv = nobleRandomBytes(12);
      const contentKey = nobleRandomBytes(OMEMO_AES_KEY_BYTES);
      const plaintext = new TextEncoder().encode(
        JSON.stringify({
          body: input.body,
          ...input.metadata ? { metadata: input.metadata } : {},
          ...input.attachments?.length ? { attachments: serializeAttachmentsForWire(input.attachments) } : {}
        })
      );
      const ciphertext = options.crypto ? await options.crypto.encrypt(contentKey, iv, plaintext) : gcm(contentKey, iv).encrypt(plaintext);
      const keyElements = await Promise.all(sessions.map(async (session) => {
        const wrapSalt = nobleRandomBytes(OMEMO_KEY_WRAP_BYTES);
        const wrapMask = options.crypto ? await options.crypto.hkdf(session.sharedSecret, wrapSalt, OMEMO_WRAP_INFO, OMEMO_AES_KEY_BYTES) : hkdf(
          sha256,
          session.sharedSecret,
          wrapSalt,
          OMEMO_WRAP_INFO,
          OMEMO_AES_KEY_BYTES
        );
        const wrappedKey = xorBytes(contentKey, wrapMask);
        const wrappedBundle = concatBytes(wrapSalt, wrappedKey);
        return xml(
          "key",
          {
            rid: String(session.peerDeviceId),
            kex: "x25519-hkdf-sha256-aesgcm"
          },
          bytesToBase64(wrappedBundle)
        );
      }));
      return {
        body: "[encrypted]",
        children: [
          xml(
            "encrypted",
            { xmlns: OMEMO_NS },
            xml(
              "header",
              { sid: String(state.omemoDeviceId) },
              ...keyElements,
              xml("iv", {}, bytesToBase64(iv)),
              xml("identity", {}, state.identityPublicKey)
            ),
            xml("payload", {}, bytesToBase64(ciphertext))
          )
        ]
      };
    },
    decrypt: async ({ stanza }, context) => {
      const encrypted = stanza.getChild?.("encrypted", OMEMO_NS);
      if (!encrypted) return null;
      const bareJid = context.getBareDeviceId();
      if (!bareJid) return { body: "", metadata: void 0 };
      const state = await loadOrCreateState(bareJid);
      const header = encrypted.getChild?.("header");
      const payloadBase64 = encrypted.getChildText?.("payload")?.trim();
      if (!header || !payloadBase64) {
        return { body: "", metadata: void 0 };
      }
      const keys = header.getChildren?.("key") ?? [];
      let selectedKeyBase64 = "";
      for (const keyElement of keys) {
        const rid = Number(keyElement.attrs?.rid ?? "0");
        if (rid !== state.omemoDeviceId) continue;
        selectedKeyBase64 = keyElement.getText?.().trim() || "";
        if (selectedKeyBase64) break;
      }
      if (!selectedKeyBase64) {
        return { body: "", metadata: void 0 };
      }
      const ivBase64 = header.getChildText?.("iv")?.trim();
      const senderIdentityBase64 = header.getChildText?.("identity")?.trim();
      if (!ivBase64 || !senderIdentityBase64) {
        return { body: "", metadata: void 0 };
      }
      try {
        const ownPrivateKey = base64ToBytes(state.identityPrivateKey);
        const senderPublicKey = base64ToBytes(senderIdentityBase64);
        const keyMaterial = base64ToBytes(selectedKeyBase64);
        const iv = base64ToBytes(ivBase64);
        const ciphertext = base64ToBytes(payloadBase64);
        const sharedSecret = options.crypto ? await options.crypto.sharedSecret(ownPrivateKey, senderPublicKey) : x25519.getSharedSecret(ownPrivateKey, senderPublicKey);
        let contentKey;
        if (keyMaterial.length === OMEMO_KEY_WRAP_BYTES) {
          contentKey = options.crypto ? await options.crypto.hkdf(sharedSecret, keyMaterial, OMEMO_INFO, OMEMO_AES_KEY_BYTES) : hkdf(
            sha256,
            sharedSecret,
            keyMaterial,
            OMEMO_INFO,
            OMEMO_AES_KEY_BYTES
          );
        } else if (keyMaterial.length === OMEMO_KEY_WRAP_BUNDLE_BYTES) {
          const wrapSalt = keyMaterial.slice(0, OMEMO_KEY_WRAP_BYTES);
          const wrappedKey = keyMaterial.slice(OMEMO_KEY_WRAP_BYTES);
          const wrapMask = options.crypto ? await options.crypto.hkdf(sharedSecret, wrapSalt, OMEMO_WRAP_INFO, OMEMO_AES_KEY_BYTES) : hkdf(
            sha256,
            sharedSecret,
            wrapSalt,
            OMEMO_WRAP_INFO,
            OMEMO_AES_KEY_BYTES
          );
          contentKey = xorBytes(wrappedKey, wrapMask);
        } else {
          return { body: "", metadata: void 0 };
        }
        const plaintext = options.crypto ? await options.crypto.decrypt(contentKey, iv, ciphertext) : gcm(contentKey, iv).decrypt(ciphertext);
        const parsed = JSON.parse(new TextDecoder().decode(plaintext));
        if (!isRecord(parsed)) {
          return { body: "", metadata: void 0 };
        }
        return {
          body: typeof parsed.body === "string" ? parsed.body : "",
          metadata: isRecord(parsed.metadata) ? parsed.metadata : void 0,
          attachments: normalizeAttachmentPayload(parsed.attachments)
        };
      } catch {
        return { body: "", metadata: void 0 };
      }
    }
  };
}
function normalizeConfig(config) {
  const domain = normalizeXmppDomain(config.xmppDomain);
  if (!domain) throw new Error("chat_xmpp_domain_required");
  const userId = normalizeUserIdSegment(config.userId);
  if (!userId) throw new Error("chat_user_id_required");
  const localDeviceId = normalizeDeviceIdSegment(config.deviceId);
  if (!localDeviceId) throw new Error("chat_device_id_required");
  const resource = normalizeResourceSegment(localDeviceId);
  const accountJid = trimToUndefined(config.accountJid)?.toLowerCase();
  if (accountJid && (!/^[^@/\s]+@[^@/\s]+$/.test(accountJid) || !accountJid.endsWith(`@${domain}`))) {
    throw new Error("chat_service_account_jid_invalid");
  }
  const username = accountJid ? accountJid.split("@")[0] : buildXmppUserLocalpart(userId);
  const deviceId = accountJid ? `${accountJid}/${resource}` : buildXmppUserResourceAddress(userId, domain, resource);
  return {
    service: buildXmppWebSocketUrl(domain, config.xmppWebSocketPath),
    uploadService: trimToUndefined(config.xmppUploadService) ?? `upload.${domain}`,
    apiKey: trimToUndefined(config.apiKey) ?? "",
    userId,
    localDeviceId,
    username,
    deviceId,
    displayName: trimToUndefined(config.displayName),
    password: config.authType === "x-oauth2" ? trimToUndefined(config.accessToken) : trimToUndefined(config.password),
    authType: config.authType ?? "password",
    domain,
    resource,
    connectTimeoutMs: config.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS,
    deliveryReceiptMode: config.deliveryReceiptMode ?? "automatic",
    requireMessageCarbons: config.requireMessageCarbons ?? false,
    requireStreamManagement: config.requireStreamManagement ?? false,
    awaitServerAcknowledgement: config.awaitServerAcknowledgement ?? false,
    requireEncryptedAttachments: config.requireEncryptedAttachments ?? false,
    requireEncryptedPayloads: config.requireEncryptedPayloads ?? false,
    roomDirectory: config.roomDirectory,
    resolveRoomDeviceIds: config.resolveRoomDeviceIds,
    resolveMessageAuthor: config.resolveMessageAuthor,
    resolveMessageForEdit: config.resolveMessageForEdit,
    logger: config.logger,
    logLevel: normalizeLogLevel(config.logLevel, config.logger),
    encryption: config.encryption,
    attachmentService: config.attachmentService
  };
}
function extractProviderDirectMessageRoomId(metadata) {
  if (!metadata) return void 0;
  const lulaPayload = isRecord(metadata.lulaPayload) ? metadata.lulaPayload : void 0;
  const lulaSubmission = isRecord(metadata.lulaSubmission) ? metadata.lulaSubmission : void 0;
  return firstString(
    metadata.providerDirectMessageRoomId,
    lulaPayload?.providerDirectMessageRoomId,
    lulaSubmission?.providerDirectMessageRoomId
  );
}
function extractSubmissionId(metadata) {
  if (!metadata) return void 0;
  const lulaPayload = isRecord(metadata.lulaPayload) ? metadata.lulaPayload : void 0;
  const lulaSubmission = isRecord(metadata.lulaSubmission) ? metadata.lulaSubmission : void 0;
  return firstString(
    metadata.correlationId,
    lulaPayload?.correlationId,
    lulaSubmission?.correlationId
  );
}
function extractSubmissionRoomId(metadata) {
  if (!metadata) return void 0;
  const lulaPayload = isRecord(metadata.lulaPayload) ? metadata.lulaPayload : void 0;
  const lulaSubmission = isRecord(metadata.lulaSubmission) ? metadata.lulaSubmission : void 0;
  return firstString(
    metadata.submissionRoomId,
    lulaPayload?.submissionRoomId,
    lulaSubmission?.submissionRoomId
  );
}
function extractDisplayName(metadata) {
  if (!metadata) return void 0;
  const lulaSubmission = isRecord(metadata.lulaSubmission) ? metadata.lulaSubmission : void 0;
  return firstString(
    metadata.displayName,
    metadata.senderDisplayName,
    lulaSubmission?.displayName,
    lulaSubmission?.senderName
  );
}
function extractMessageType(metadata) {
  const rawType = firstString(metadata?.messageType, metadata?.type);
  if (rawType === "CHAT_MESSAGE" || rawType === "FORM_SUBMISSION" || rawType === CHAT_CONVERSATION_STATE_MESSAGE_TYPE || rawType === CHAT_EMERGENCY_MESSAGE_TYPE || rawType === CHAT_VOICE_MESSAGE_TYPE) {
    return rawType;
  }
  return void 0;
}
function normalizeMessageMetadata(metadata, fallbackType) {
  return {
    ...metadata ?? {},
    messageType: extractMessageType(metadata) ?? fallbackType
  };
}
function inferMessageType(metadata, body) {
  const metadataType = extractMessageType(metadata);
  if (metadataType) return metadataType;
  if (isRecord(metadata?.lulaPayload)) return "FORM_SUBMISSION";
  const payload = parseJsonRecord(body);
  if (payload?.type === "form_submission") return "FORM_SUBMISSION";
  if (payload && (isRecord(payload.readable) || isRecord(payload.raw))) return "FORM_SUBMISSION";
  return "CHAT_MESSAGE";
}
function buildChatMessageMetadata(input) {
  const metadata = normalizeMessageMetadata(input.metadata, "CHAT_MESSAGE");
  const providerDirectMessageRoomId = firstString(
    input.context?.providerDirectMessageRoomId,
    extractProviderDirectMessageRoomId(metadata),
    input.roomId
  );
  if (providerDirectMessageRoomId) {
    metadata.providerDirectMessageRoomId = providerDirectMessageRoomId;
  }
  const submissionRoomId = firstString(
    input.context?.submissionRoomId,
    extractSubmissionRoomId(metadata)
  );
  if (submissionRoomId) {
    metadata.submissionRoomId = submissionRoomId;
  }
  const correlationId = firstString(
    input.context?.correlationId,
    extractSubmissionId(metadata)
  );
  if (correlationId) {
    metadata.correlationId = correlationId;
  }
  if (typeof metadata.sentAtMs !== "number") {
    metadata.sentAtMs = Date.now();
  }
  const context = input.context;
  const displayName = firstString(
    metadata.displayName,
    context?.displayName,
    context?.senderName,
    input.displayName
  );
  if (displayName) {
    metadata.displayName = displayName;
  }
  const shouldWriteSubmissionContext = context && (typeof context.submissionRoomId === "string" || typeof context.correlationId === "string" || typeof context.senderName === "string" || typeof context.displayName === "string");
  if (shouldWriteSubmissionContext) {
    const existing = isRecord(metadata.lulaSubmission) ? metadata.lulaSubmission : {};
    const { providerDirectMessageRoomId: _providerDirectMessageRoomId, ...rest } = context;
    metadata.lulaSubmission = removeUndefinedValues({
      ...existing,
      ...rest,
      ...submissionRoomId ? { submissionRoomId } : {},
      ...correlationId ? { correlationId } : {},
      ...displayName ? { displayName } : {},
      ...providerDirectMessageRoomId ? { providerDirectMessageRoomId } : {}
    });
  }
  return metadata;
}
function buildFormSubmissionMetadata(input) {
  const metadata = normalizeMessageMetadata(input.metadata, "FORM_SUBMISSION");
  if (input.submitter) {
    if (input.submitter.kind === "guest" && !input.submitter.guestSessionId?.trim()) {
      throw new Error("chat_guest_session_required");
    }
    metadata.submitter = input.submitter;
    if (input.submitter.kind === "guest") {
      metadata.guestSubmission = true;
      delete metadata.userPk;
      metadata.userGroups = null;
    }
  }
  const providerDirectMessageRoomId = firstString(
    input.providerDirectMessageRoomId,
    extractProviderDirectMessageRoomId(metadata)
  );
  const submissionRoomId = firstString(
    input.submissionRoomId,
    extractSubmissionRoomId(metadata),
    input.roomId
  );
  const correlationId = firstString(
    input.correlationId,
    extractSubmissionId(metadata)
  );
  const existingPayload = isRecord(metadata.lulaPayload) ? metadata.lulaPayload : {};
  if (providerDirectMessageRoomId) {
    metadata.providerDirectMessageRoomId = providerDirectMessageRoomId;
  }
  if (submissionRoomId) {
    metadata.submissionRoomId = submissionRoomId;
  }
  if (correlationId) {
    metadata.correlationId = correlationId;
  }
  if (typeof metadata.sentAtMs !== "number") {
    metadata.sentAtMs = Date.now();
  }
  const displayName = firstString(metadata.displayName, input.displayName);
  if (displayName) {
    metadata.displayName = displayName;
  }
  metadata.lulaPayload = removeUndefinedValues({
    ...existingPayload,
    submissionRoomId,
    correlationId,
    formId: input.formId,
    providerUserId: input.providerUserId,
    recordId: input.recordId,
    formVersion: input.formVersion,
    providerDirectMessageRoomId,
    submittedAt: input.submittedAt ?? (typeof existingPayload.submittedAt === "string" ? existingPayload.submittedAt : (/* @__PURE__ */ new Date()).toISOString())
  });
  return metadata;
}
function parseConversationStateMessage(message) {
  if (extractMessageType(message.metadata) !== CHAT_CONVERSATION_STATE_MESSAGE_TYPE) {
    return null;
  }
  const conversationType = firstString(message.metadata.conversationType);
  const state = firstString(message.metadata.conversationState);
  if (conversationType !== "form_submission") return null;
  if (state !== "open" && state !== "closed") return null;
  const changedAt = normalizeIsoDate(firstString(message.metadata.conversationChangedAt)) ?? new Date(message.timestamp).toISOString();
  const conversationId = firstString(message.metadata.conversationId);
  return {
    id: message.id,
    fromUserId: message.fromUserId,
    fromFullAddress: message.fromFullAddress,
    fromDeviceId: message.fromDeviceId,
    toDeviceId: message.toDeviceId,
    roomId: message.roomId,
    conversationType,
    state,
    ...conversationId ? { conversationId } : {},
    changedAt,
    timestamp: message.timestamp,
    metadata: message.metadata,
    raw: message.raw
  };
}
function isConversationStateMessage(message) {
  return Boolean(parseConversationStateMessage(message));
}
function collectTargetDeviceIds(input) {
  return normalizeTransportAddressList([
    input.toDeviceId,
    input.peerDeviceId,
    ...input.toDeviceIds ?? [],
    ...input.peerDeviceIds ?? []
  ]);
}
function normalizeTransportAddress(value) {
  return addressToString(value)?.trim() ?? "";
}
function normalizeTransportAddressList(values) {
  const normalized = values.map((value) => normalizeTransportAddress(value)).filter((value) => value.length > 0);
  return Array.from(new Set(normalized));
}
function normalizeTargetAddressList(values, targetScope) {
  return targetScope === "user" ? normalizeDeviceIdList(values) : normalizeTransportAddressList(values);
}
function isOwnTransportTarget(target, ownTransportAddress, ownBareAddress) {
  const normalized = normalizeTransportAddress(target);
  if (!normalized) return true;
  if (ownTransportAddress && normalized === ownTransportAddress) return true;
  if (ownBareAddress && normalized === ownBareAddress) return true;
  return false;
}
function normalizeDeviceIdList(values) {
  const normalized = values.map((value) => normalizeBareDeviceId(value)).filter((value) => value.length > 0);
  return Array.from(new Set(normalized));
}
function pickMessageTargetInput(input) {
  return {
    toDeviceId: input.toDeviceId,
    toDeviceIds: input.toDeviceIds,
    peerDeviceId: input.peerDeviceId,
    peerDeviceIds: input.peerDeviceIds,
    attachments: input.attachments,
    roomId: input.roomId,
    targetRoomId: input.targetRoomId,
    targetScope: input.targetScope,
    id: input.id,
    requestReceipt: input.requestReceipt
  };
}
function toChatTextMessage(message) {
  const metadata = message.metadata;
  const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata) ?? message.roomId;
  const submissionRoomId = extractSubmissionRoomId(metadata);
  const correlationId = extractSubmissionId(metadata);
  const displayName = extractDisplayName(metadata) ?? message.fromUserId;
  const lulaSubmission = isRecord(metadata?.lulaSubmission) ? metadata?.lulaSubmission : void 0;
  const context = removeUndefinedValues({
    ...lulaSubmission ?? {},
    ...providerDirectMessageRoomId ? { providerDirectMessageRoomId } : {},
    ...submissionRoomId ? { submissionRoomId } : {},
    ...correlationId ? { correlationId } : {},
    ...displayName ? { displayName } : {}
  });
  return {
    ...message,
    metadata: normalizeMessageMetadata(message.metadata, "CHAT_MESSAGE"),
    providerDirectMessageRoomId,
    ...submissionRoomId ? { submissionRoomId } : {},
    correlationId,
    displayName,
    ...Object.keys(context).length > 0 ? { context } : {}
  };
}
function parseEmergencyMetadata(metadata) {
  const emergencyType = firstString(metadata?.emergencyType);
  const alertId = firstString(metadata?.emergencyAlertId);
  const triggeredAt = normalizeIsoDate(firstString(metadata?.emergencyTriggeredAt));
  if (emergencyType !== CHAT_EMERGENCY_TYPE_SOS || !alertId || !triggeredAt) {
    return null;
  }
  return { emergencyType, alertId, triggeredAt };
}
function parseChatEmergencyMessage(message) {
  const messageType = extractMessageType(message.metadata);
  const emergency = parseEmergencyMetadata(message.metadata);
  if (messageType !== CHAT_EMERGENCY_MESSAGE_TYPE || !emergency) {
    return null;
  }
  return {
    ...toChatTextMessage(message),
    ...emergency
  };
}
function isEmergencyMessage(message) {
  return Boolean(parseChatEmergencyMessage(message));
}
function toChatAttachmentMessage(message) {
  const attachments = normalizeAttachmentPayload(message.attachments);
  if (!attachments?.length) {
    throw new Error("chat_attachment_message_missing_attachments");
  }
  const metadata = message.metadata;
  const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata) ?? message.roomId;
  const submissionRoomId = extractSubmissionRoomId(metadata);
  const correlationId = extractSubmissionId(metadata);
  const displayName = extractDisplayName(metadata);
  const lulaSubmission = isRecord(metadata?.lulaSubmission) ? metadata?.lulaSubmission : void 0;
  const context = removeUndefinedValues({
    ...lulaSubmission ?? {},
    ...providerDirectMessageRoomId ? { providerDirectMessageRoomId } : {},
    ...submissionRoomId ? { submissionRoomId } : {},
    ...correlationId ? { correlationId } : {},
    ...displayName ? { displayName } : {}
  });
  return {
    ...message,
    attachments,
    metadata: normalizeMessageMetadata(message.metadata, "CHAT_MESSAGE"),
    providerDirectMessageRoomId,
    ...submissionRoomId ? { submissionRoomId } : {},
    correlationId,
    ...displayName ? { displayName } : {},
    ...Object.keys(context).length > 0 ? { context } : {}
  };
}
function isFormSubmissionMessage(message) {
  const metadataType = extractMessageType(message.metadata);
  if (metadataType === "FORM_SUBMISSION") return true;
  return Boolean(parseFormSubmissionMessage(message));
}
function isAttachmentMessage(message) {
  if (isFormSubmissionMessage(message)) return false;
  const attachments = normalizeAttachmentPayload(message.attachments);
  if (!attachments?.length) return false;
  if (message.metadata.attachment === true) return true;
  const metadataType = extractMessageType(message.metadata);
  return metadataType === "CHAT_MESSAGE";
}
function parseFormSubmissionMessage(message) {
  const payload = parseJsonRecord(message.body);
  if (!payload) return null;
  const metadata = message.metadata;
  const metadataType = extractMessageType(metadata);
  const lulaPayload = isRecord(metadata?.lulaPayload) ? metadata?.lulaPayload : void 0;
  const isExplicitFormPayload = payload.type === "form_submission";
  const isReadableSubmissionPayload = isRecord(payload.readable) || isRecord(payload.raw);
  if (metadataType !== "FORM_SUBMISSION" && !lulaPayload && !isExplicitFormPayload && !isReadableSubmissionPayload) {
    return null;
  }
  const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata) ?? message.roomId;
  const submissionRoomId = extractSubmissionRoomId(metadata);
  const correlationId = extractSubmissionId(metadata);
  const displayName = extractDisplayName(metadata);
  const normalizedFormPayload = normalizeFormSubmissionPayload(payload);
  return {
    ...message,
    metadata: normalizeMessageMetadata(metadata, "FORM_SUBMISSION"),
    answers: normalizedFormPayload.answers,
    fields: normalizedFormPayload.fields,
    payload,
    providerDirectMessageRoomId,
    ...submissionRoomId ? { submissionRoomId } : {},
    ...correlationId ? { correlationId } : {},
    formId: firstString(lulaPayload?.formId, payload.formId),
    providerUserId: firstString(lulaPayload?.providerUserId, payload.providerUserId),
    recordId: firstString(lulaPayload?.recordId, payload.recordId),
    formVersion: typeof lulaPayload?.formVersion === "number" ? lulaPayload.formVersion : typeof payload.formVersion === "number" ? payload.formVersion : void 0,
    submittedAt: firstString(lulaPayload?.submittedAt, payload.submittedAt),
    ...displayName ? { displayName } : {}
  };
}
function normalizeFormSubmissionPayload(payload) {
  const readable = isRecord(payload.readable) ? payload.readable : {};
  const raw = isRecord(payload.raw) ? payload.raw : {};
  const keys = Array.from(/* @__PURE__ */ new Set([...Object.keys(raw), ...Object.keys(readable)]));
  const answers = {};
  const fields = keys.map((key) => {
    const readableEntry = isRecord(readable[key]) ? readable[key] : void 0;
    const rawValue = raw[key];
    const value = readableEntry && "value" in readableEntry ? readableEntry.value : rawValue;
    answers[key] = stringifyAnswerValue(value);
    return {
      id: firstString(readableEntry?.id, readableEntry?.fieldId, key) ?? key,
      label: firstString(readableEntry?.label, key) ?? key,
      type: firstString(readableEntry?.type, readableEntry?.fieldType) ?? inferFieldType(value),
      required: readableEntry?.required === true
    };
  });
  return { answers, fields };
}
function stringifyAnswerValue(value) {
  if (value === void 0 || value === null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
function inferFieldType(value) {
  if (Array.isArray(value)) return "array";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (isRecord(value)) return "object";
  return "text";
}
function parseJsonRecord(input) {
  try {
    const parsed = JSON.parse(input);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function serializeAttachmentsForWire(attachments) {
  return attachments.map((attachment) => {
    const normalized = normalizeRequiredAttachment(attachment);
    const { localUri: _localUri, ...rest } = normalized;
    return rest;
  });
}
function normalizeAttachmentPayload(value) {
  if (!Array.isArray(value)) return void 0;
  const attachments = value.map((entry) => normalizeAttachment(entry)).filter((entry) => Boolean(entry));
  return attachments.length ? attachments : void 0;
}
function normalizeRequiredAttachment(value) {
  const attachment = normalizeAttachment(value);
  if (!attachment) throw new Error("chat_attachment_invalid");
  return attachment;
}
function normalizeAttachmentEncryption(value) {
  if (!isRecord(value) || value.v !== 1 || value.alg !== "A256GCM") return null;
  const keyB64 = firstString(value.keyB64);
  const ivB64 = firstString(value.ivB64);
  const plaintextSha256B64 = firstString(value.plaintextSha256B64);
  const ciphertextSha256B64 = firstString(value.ciphertextSha256B64);
  const plaintextSize = typeof value.plaintextSize === "number" && Number.isSafeInteger(value.plaintextSize) ? value.plaintextSize : -1;
  const ciphertextSize = typeof value.ciphertextSize === "number" && Number.isSafeInteger(value.ciphertextSize) ? value.ciphertextSize : -1;
  if (!keyB64 || !ivB64 || !plaintextSha256B64 || !ciphertextSha256B64 || plaintextSize < 0 || ciphertextSize <= plaintextSize) {
    return null;
  }
  try {
    if (base64ToBytes(keyB64).length !== 32 || base64ToBytes(ivB64).length !== 12 || base64ToBytes(plaintextSha256B64).length !== 32 || base64ToBytes(ciphertextSha256B64).length !== 32) {
      return null;
    }
  } catch {
    return null;
  }
  return {
    v: 1,
    alg: "A256GCM",
    keyB64,
    ivB64,
    plaintextSha256B64,
    ciphertextSha256B64,
    plaintextSize,
    ciphertextSize
  };
}
function normalizeAttachmentDownloadCapability(value) {
  if (!isRecord(value) || value.v !== 1 || value.scheme !== "LulaAttachment") {
    return null;
  }
  const authorization = firstString(value.authorization);
  const expiresAt = firstString(value.expiresAt);
  if (!authorization || !/^LulaAttachment\s+v1\.[A-Za-z0-9._-]+$/.test(authorization) || !expiresAt || !Number.isFinite(Date.parse(expiresAt))) {
    return null;
  }
  return {
    v: 1,
    scheme: "LulaAttachment",
    authorization,
    expiresAt: new Date(Date.parse(expiresAt)).toISOString()
  };
}
function normalizeAttachment(value) {
  if (!isRecord(value)) return null;
  const id = firstString(value.id, value.url, value.localUri, value.thumbnailUrl);
  if (!id) return null;
  const type = normalizeAttachmentType(value);
  const metadata = isRecord(value.metadata) ? value.metadata : void 0;
  const encryption = normalizeAttachmentEncryption(value.encryption);
  const downloadCapability = normalizeAttachmentDownloadCapability(
    value.downloadCapability
  );
  return removeUndefinedValues({
    id,
    type,
    name: firstString(value.name),
    mimeType: firstString(value.mimeType),
    size: typeof value.size === "number" && Number.isFinite(value.size) ? Math.max(0, Math.floor(value.size)) : void 0,
    url: firstString(value.url),
    thumbnailUrl: firstString(value.thumbnailUrl),
    localUri: firstString(value.localUri),
    width: typeof value.width === "number" && Number.isFinite(value.width) ? Math.max(0, Math.floor(value.width)) : void 0,
    height: typeof value.height === "number" && Number.isFinite(value.height) ? Math.max(0, Math.floor(value.height)) : void 0,
    metadata,
    encryption: encryption ?? void 0,
    downloadCapability: downloadCapability ?? void 0
  });
}
function normalizeAttachmentType(value) {
  const explicit = firstString(value.type)?.toLowerCase();
  if (explicit === "image" || explicit === "file") return explicit;
  const mimeType = firstString(value.mimeType)?.toLowerCase();
  if (mimeType?.startsWith("image/")) return "image";
  return "file";
}
function defaultAttachmentSource(attachment) {
  const direct = firstString(attachment.localUri, attachment.url);
  if (direct) return direct;
  const id = firstString(attachment.id);
  if (id && /^(https?:|file:)/i.test(id)) return id;
  return null;
}
function removeUndefinedValues(input) {
  const output = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== void 0) {
      output[key] = value;
    }
  }
  return output;
}
function registerXOAuth2OnClient(xmpp) {
  const candidate = xmpp;
  candidate.saslFactory?.use?.("X-OAUTH2", XOauth2Mechanism);
  candidate.sasl?.use?.("X-OAUTH2", XOauth2Mechanism);
}
function pickMechanism(mechanisms, preferred) {
  const offered = new Set(mechanisms.map((mechanism) => mechanism.toUpperCase()));
  return preferred.find((mechanism) => offered.has(mechanism));
}
function addListener(listeners, listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
async function withTimeout(promise, ms, errorCode) {
  let timeout;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error(errorCode)), ms);
      })
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
async function safeStop(xmpp) {
  xmpp.reconnect.stop();
  try {
    await xmpp.stop();
  } catch {
  }
}
function parseStanzaError(stanza) {
  const error = stanza.getChild?.("error");
  if (!error) return {};
  const text = error.getChildText?.("text");
  const raw = error.toString?.() ?? "";
  const match = raw.match(/<([a-z0-9-]+)\s+xmlns=["']urn:ietf:params:xml:ns:xmpp-stanzas["']/i);
  return {
    condition: match?.[1],
    text: text ?? void 0
  };
}
var MIN_MESSAGE_TIMESTAMP_MS = Date.UTC(2e3, 0, 1);
var MESSAGE_CLOCK_SKEW_MS = 5 * 60 * 1e3;
function isServerMessageTimestamp(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= MIN_MESSAGE_TIMESTAMP_MS && value <= 864e13;
}
function parseServerMessageTimestamp(stanza, domain) {
  const time = stanza.getChild?.("time", XMPP_MESSAGE_TIME_NS);
  if (time?.attrs?.by?.toLowerCase() !== domain.toLowerCase()) return void 0;
  const raw = time.attrs?.ms;
  if (!raw || !/^\d+$/.test(raw)) return void 0;
  const timestamp = Number(raw);
  return isServerMessageTimestamp(timestamp) ? timestamp : void 0;
}
function parseTrustedDelayTimestamp(stanza, domain) {
  const delay = stanza.getChild?.("delay", "urn:xmpp:delay");
  const from = addressToString(delay?.attrs?.from)?.toLowerCase();
  const trusted = domain.toLowerCase();
  if (from !== trusted && from !== normalizeBareDeviceId(stanza.attrs?.to).toLowerCase() && !from?.endsWith(`@conference.${trusted}`)) return void 0;
  return parseDelayTimestamp(stanza);
}
function isPlausibleMessageTimestamp(value, referenceTime = Date.now()) {
  return Number.isSafeInteger(value) && value >= MIN_MESSAGE_TIMESTAMP_MS && value <= referenceTime + MESSAGE_CLOCK_SKEW_MS;
}
function parseDelayTimestamp(stanza) {
  const delay = stanza.getChild?.("delay", "urn:xmpp:delay");
  const stamp = delay?.attrs?.stamp;
  if (!stamp || !/(?:Z|[+-]\d{2}:?\d{2})$/i.test(stamp)) return void 0;
  const parsed = Date.parse(stamp);
  return isServerMessageTimestamp(parsed) ? parsed : void 0;
}
function parseChatServerEvent(stanza, xmppDomain) {
  const element = stanza.getChild?.("event", XMPP_SERVER_EVENT_NS);
  if (!element) return null;
  const from = addressToString(stanza.attrs?.from)?.trim().toLowerCase();
  const domain = normalizeXmppDomain(xmppDomain)?.toLowerCase();
  if (!from || !domain || from !== domain) return null;
  const id = trimToUndefined(stanza.attrs?.id);
  const type = trimToUndefined(element.attrs?.type);
  const encoded = trimToUndefined(element.getText?.());
  const data = encoded ? decodeJsonBase64(encoded) : null;
  if (!id || !type || !isRecord(data)) return null;
  return {
    id,
    type,
    data,
    timestamp: parseServerMessageTimestamp(stanza, domain) ?? parseDelayTimestamp(stanza) ?? Date.now(),
    raw: stanza
  };
}
function parseMetadataTimestamp(metadata, referenceTime = Date.now()) {
  const sentAtMs = metadata?.sentAtMs;
  if (typeof sentAtMs === "number" && isPlausibleMessageTimestamp(sentAtMs, referenceTime)) return sentAtMs;
  const createdAt = metadata?.createdAt;
  if (typeof createdAt !== "string" || !/(?:Z|[+-]\d{2}:?\d{2})$/i.test(createdAt)) return void 0;
  const parsed = Date.parse(createdAt);
  return isPlausibleMessageTimestamp(parsed, referenceTime) ? parsed : void 0;
}
function generateMessageId() {
  return `msg-${Date.now()}-${createRuntimeIdSuffix()}`;
}
function generateIqId() {
  return `iq-${Date.now()}-${createRuntimeIdSuffix()}`;
}
function parseUploadSlotResponse(stanza) {
  const raw = toRawXmlString(stanza);
  const putMatch = raw.match(/<put\b([^>]*)>([\s\S]*?)<\/put>/) ?? raw.match(/<put\b([^>]*)\/>/);
  const getMatch = raw.match(/<get\b([^>]*)\/>/) ?? raw.match(/<get\b([^>]*)>(?:[\s\S]*?)<\/get>/);
  if (!putMatch?.[1] || !getMatch?.[1]) {
    throw new Error("chat_attachment_upload_slot_invalid");
  }
  const putAttrs = parseXmlAttributes(putMatch[1]);
  const getAttrs = parseXmlAttributes(getMatch[1]);
  const putUrl = putAttrs.url?.trim();
  const getUrl = getAttrs.url?.trim();
  if (!putUrl || !getUrl) {
    throw new Error("chat_attachment_upload_slot_invalid");
  }
  const headers = {};
  const headerRegex = /<header\b([^>]*)>([\s\S]*?)<\/header>/g;
  let headerMatch = null;
  while ((headerMatch = headerRegex.exec(putMatch[2] ?? "")) !== null) {
    const attrs = parseXmlAttributes(headerMatch[1] ?? "");
    const name = attrs.name?.trim();
    const value = decodeXmlEntities((headerMatch[2] ?? "").trim());
    if (name && value) headers[name] = value;
  }
  return { putUrl, getUrl, headers };
}
function buildXmppUserLocalpart(userId) {
  return `i.${userId}`;
}
function buildXmppUserAddress(userId, xmppDomain) {
  return `${buildXmppUserLocalpart(userId)}@${xmppDomain}`;
}
function buildXmppUserResourceAddress(userId, xmppDomain, resource) {
  return `${buildXmppUserAddress(userId, xmppDomain)}/${resource}`;
}
function buildXmppWebSocketUrl(xmppDomain, path) {
  const fullUrl = trimToUndefined(path);
  if (fullUrl && /^wss?:\/\//i.test(fullUrl)) {
    return fullUrl;
  }
  const normalizedPath = normalizeXmppWebSocketPath(path);
  return `wss://${xmppDomain}${normalizedPath}`;
}
function normalizeXmppWebSocketPath(path) {
  const trimmed = trimToUndefined(path) ?? DEFAULT_XMPP_WEBSOCKET_PATH;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
function normalizeXmppDomain(domain) {
  const trimmed = trimToUndefined(domain);
  if (!trimmed) return void 0;
  return trimmed.replace(/^wss?:\/\//i, "").replace(/\/.*$/, "").trim();
}
function normalizeUserIdSegment(value) {
  const trimmed = trimToUndefined(value);
  if (!trimmed) return void 0;
  const localpart = normalizeBareDeviceId(trimmed).split("@")[0]?.trim();
  const withoutPrefix = localpart?.replace(/^i\./, "");
  return withoutPrefix?.replace(/\.d\..*$/, "") || void 0;
}
function getUserIdFromChatAddress(value) {
  const localpart = normalizeBareDeviceId(value).split("@")[0]?.trim();
  if (!localpart) return void 0;
  const withoutPrefix = localpart.startsWith("i.") ? localpart.slice(2) : localpart;
  const deviceMarker = withoutPrefix.indexOf(".d.");
  return (deviceMarker >= 0 ? withoutPrefix.slice(0, deviceMarker) : withoutPrefix) || void 0;
}
function normalizeDeviceIdSegment(value) {
  const trimmed = trimToUndefined(value);
  if (!trimmed) return void 0;
  const localpart = normalizeBareDeviceId(trimmed).split("@")[0]?.trim();
  const deviceMarker = localpart?.indexOf(".d.") ?? -1;
  return deviceMarker >= 0 ? localpart?.slice(deviceMarker + 3) || void 0 : localpart;
}
function normalizeBareDeviceId(deviceId) {
  return addressToString(deviceId)?.trim().split("/")[0] ?? "";
}
function trimToUndefined(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : void 0;
}
function normalizeIsoDate(value) {
  const normalized = trimToUndefined(value);
  if (!normalized) return void 0;
  const timestamp = Date.parse(normalized);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : void 0;
}
function normalizeResourceSegment(value) {
  const resource = value.trim().replace(/\s+/g, "-").replace(/\//g, "-");
  if (!resource) throw new Error("chat_resource_invalid");
  return resource;
}
function normalizeLogLevel(level, logger) {
  if (!logger) return "silent";
  if (!level) return "error";
  if (level in CHAT_LOG_LEVEL_WEIGHT) return level;
  throw new Error(`chat_log_level_invalid:${level}`);
}
function addressToString(address) {
  if (typeof address === "string") return address;
  if (address && typeof address === "object" && "toString" in address) {
    const value = String(address);
    return value === "[object Object]" ? void 0 : value;
  }
  return void 0;
}
function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function normalizeChatRoomResponse(response, options = {}) {
  const roomRecord = unwrapRoomRecord(response);
  const roomId = firstString(
    roomRecord.roomId,
    roomRecord.providerDirectMessageRoomId,
    roomRecord.id,
    roomRecord._id
  );
  if (!roomId) throw new Error("chat_room_id_required");
  const id = firstString(roomRecord.id, roomRecord._id);
  const peerDeviceIds = collectPeerDeviceIdsFromRoom(roomRecord, options);
  const ownDeviceIds = collectOwnDeviceIdsFromRoom(roomRecord, options);
  return {
    ...id ? { id } : {},
    roomId,
    ...peerDeviceIds.length ? { peerDeviceIds } : {},
    ...ownDeviceIds.length ? { ownDeviceIds } : {},
    raw: response
  };
}
function deriveRoomDeviceIds(room) {
  return normalizeTransportAddressList([...room.peerDeviceIds ?? [], ...room.ownDeviceIds ?? []]);
}
function unwrapRoomRecord(response) {
  if (!isRecord(response)) throw new Error("chat_room_response_invalid");
  if (isRecord(response.data)) return response.data;
  if (isRecord(response.room)) return response.room;
  return response;
}
function collectPeerDeviceIdsFromRoom(room, options) {
  const candidates = [];
  const domain = normalizeXmppDomain(options.xmppDomain);
  const roomUserId = firstString(
    room.peerUserId,
    room.peerAppUserId,
    room.userId,
    room.appUserId,
    room.providerUserId,
    room.peerProviderUserId
  );
  pushDeviceIdCandidates(candidates, room.peerDeviceId, domain, roomUserId);
  pushDeviceIdCandidates(candidates, room.peerDeviceIds, domain, roomUserId);
  pushDeviceIdCandidates(candidates, room.deviceId, domain, roomUserId);
  pushDeviceIdCandidates(candidates, room.deviceIds, domain, roomUserId);
  pushDeviceIdCandidates(candidates, room.chatUserId, domain, roomUserId);
  pushDeviceIdCandidates(candidates, room.chatUserIds, domain, roomUserId);
  const current = normalizeUserName(options.currentUserId);
  const userMetadata = Array.isArray(room.userMetadata) ? room.userMetadata : [];
  for (const entry of userMetadata) {
    if (!isRecord(entry)) continue;
    const entryUserId = firstString(
      entry.id,
      entry.userId,
      entry.appUserId,
      entry.providerUserId
    );
    const entryNames = collectStringValues(
      entry.id,
      entry.userId,
      entry.appUserId,
      entry.providerUserId,
      entry.deviceId,
      entry.deviceIds,
      entry.chatUserId,
      entry.chatUserIds
    ).map(normalizeUserName);
    if (current && entryNames.includes(current)) continue;
    pushDeviceIdCandidates(candidates, entry.deviceId, domain, entryUserId);
    pushDeviceIdCandidates(candidates, entry.deviceIds, domain, entryUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserId, domain, entryUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserIds, domain, entryUserId);
  }
  return normalizeTransportAddressList(candidates);
}
function collectOwnDeviceIdsFromRoom(room, options) {
  const candidates = [];
  const domain = normalizeXmppDomain(options.xmppDomain);
  const current = normalizeUserName(options.currentUserId);
  if (!current) {
    return [];
  }
  pushDeviceIdCandidates(candidates, room.selfDeviceId, domain, options.currentUserId);
  pushDeviceIdCandidates(candidates, room.selfDeviceIds, domain, options.currentUserId);
  pushDeviceIdCandidates(candidates, room.selfChatUserId, domain, options.currentUserId);
  pushDeviceIdCandidates(candidates, room.selfChatUserIds, domain, options.currentUserId);
  const userMetadata = Array.isArray(room.userMetadata) ? room.userMetadata : [];
  for (const entry of userMetadata) {
    if (!isRecord(entry)) continue;
    const entryNames = collectStringValues(
      entry.id,
      entry.userId,
      entry.appUserId,
      entry.providerUserId
    ).map(normalizeUserName);
    if (!entryNames.includes(current)) continue;
    pushDeviceIdCandidates(candidates, entry.deviceId, domain, options.currentUserId);
    pushDeviceIdCandidates(candidates, entry.deviceIds, domain, options.currentUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserId, domain, options.currentUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserIds, domain, options.currentUserId);
  }
  return normalizeTransportAddressList(candidates);
}
function collectStringValues(...values) {
  const strings = [];
  values.forEach((value) => pushStrings(strings, value));
  return strings;
}
function pushStrings(target, value) {
  if (typeof value === "string" && value.trim()) {
    target.push(value.trim());
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry) => pushStrings(target, entry));
  }
}
function pushDeviceIdCandidates(target, value, xmppDomain, userId) {
  const values = [];
  pushStrings(values, value);
  values.map((entry) => expandDeviceIdCandidate(entry, xmppDomain, userId)).filter((entry) => Boolean(entry)).forEach((entry) => target.push(entry));
}
function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return void 0;
}
function normalizeUserName(value) {
  const normalized = normalizeBareDeviceId(value);
  if (!normalized) return void 0;
  return normalizeUserIdSegment(normalized) ?? normalized.split("@")[0] ?? normalized;
}
function expandDeviceIdCandidate(value, xmppDomain, userId) {
  const trimmed = value.trim();
  if (!trimmed) return void 0;
  const domain = normalizeXmppDomain(xmppDomain);
  const targetDomain = normalizeXmppDomain(trimmed.includes("@") ? trimmed.split("@")[1]?.split("/")[0] : void 0) ?? domain;
  const normalizedUserId = normalizeUserIdSegment(userId) ?? normalizeUserIdSegment(trimmed);
  if (normalizedUserId && targetDomain) {
    return getChatUserId({ username: normalizedUserId, domain: targetDomain });
  }
  if (trimmed.includes("@")) return normalizeBareDeviceId(trimmed);
  return domain ? getChatUserId({ username: trimmed, domain }) : trimmed;
}
function isValidOmemoState(value) {
  if (!isRecord(value)) return false;
  return typeof value.bareJid === "string" && value.bareJid.length > 0 && typeof value.omemoDeviceId === "number" && Number.isFinite(value.omemoDeviceId) && value.omemoDeviceId > 0 && typeof value.identityPrivateKey === "string" && value.identityPrivateKey.length > 0 && typeof value.identityPublicKey === "string" && value.identityPublicKey.length > 0;
}
function createInMemoryKeyValueStore() {
  const map = /* @__PURE__ */ new Map();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    }
  };
}
function createMemoryStorageBackend() {
  return createInMemoryKeyValueStore();
}
function createIndexDbStorageBackend(options = {}) {
  const dbName = options.dbName ?? "lulafi-chat-sdk";
  const storeName = options.storeName ?? "keyValue";
  let dbPromise = null;
  const getDb = () => {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!globalThis.indexedDB) {
        reject(new Error("chat_indexeddb_unavailable"));
        return;
      }
      const request = globalThis.indexedDB.open(dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };
      request.onerror = () => {
        reject(request.error ?? new Error("chat_indexeddb_open_failed"));
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
    return dbPromise;
  };
  const withStore = async (mode, run) => {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const request = run(store);
      request.onerror = () => {
        reject(request.error ?? new Error("chat_indexeddb_request_failed"));
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
      transaction.onerror = () => {
        reject(transaction.error ?? new Error("chat_indexeddb_transaction_failed"));
      };
    });
  };
  return {
    getItem: async (key) => {
      const value = await withStore("readonly", (store) => store.get(key));
      return typeof value === "string" ? value : null;
    },
    setItem: async (key, value) => {
      await withStore("readwrite", (store) => store.put(value, key));
    },
    removeItem: async (key) => {
      await withStore("readwrite", (store) => store.delete(key));
    }
  };
}
function createMongoDbStorageBackend(options) {
  const { collection } = options;
  const keyField = options.keyField ?? "_id";
  const valueField = options.valueField ?? "value";
  const updatedAtField = options.updatedAtField ?? "updatedAt";
  return {
    getItem: async (key) => {
      const document = await collection.findOne({ [keyField]: key });
      const value = document?.[valueField];
      return typeof value === "string" ? value : null;
    },
    setItem: async (key, value) => {
      const setFields = {
        [valueField]: value,
        [updatedAtField]: /* @__PURE__ */ new Date()
      };
      if (keyField !== "_id") {
        setFields[keyField] = key;
      }
      await collection.updateOne(
        { [keyField]: key },
        { $set: setFields },
        { upsert: true }
      );
    },
    removeItem: async (key) => {
      await collection.deleteOne({ [keyField]: key });
    }
  };
}
var storageBackends = {
  memory: createMemoryStorageBackend(),
  indexDb: createIndexDbStorageBackend(),
  mongoDb: createMongoDbStorageBackend,
  createMemory: createMemoryStorageBackend,
  createIndexDb: createIndexDbStorageBackend,
  createMongoDb: createMongoDbStorageBackend
};
function bytesToBase64(bytes) {
  const globalWithBuffer = globalThis;
  if (globalWithBuffer.Buffer) {
    return globalWithBuffer.Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
function base64ToBytes(value) {
  const globalWithBuffer = globalThis;
  if (globalWithBuffer.Buffer) {
    return new Uint8Array(globalWithBuffer.Buffer.from(value, "base64"));
  }
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}
function bytesToUint32(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getUint32(0, false);
}
function xorBytes(left, right) {
  const output = new Uint8Array(Math.min(left.length, right.length));
  for (let i = 0; i < output.length; i += 1) {
    output[i] = left[i] ^ right[i];
  }
  return output;
}
function concatBytes(first, second) {
  const output = new Uint8Array(first.length + second.length);
  output.set(first, 0);
  output.set(second, first.length);
  return output;
}
function toRawXmlString(value) {
  if (!value) return "";
  const withToString = value;
  try {
    if (typeof withToString.toString === "function") {
      return withToString.toString();
    }
  } catch {
    return "";
  }
  return "";
}
function parseXmlAttributes(input) {
  const attributes = {};
  const pattern = /([a-zA-Z_:][\w:.-]*)\s*=\s*(['"])([\s\S]*?)\2/g;
  let match = null;
  while ((match = pattern.exec(input)) !== null) {
    const name = match[1]?.trim();
    const value = decodeXmlEntities(match[3] ?? "");
    if (name) attributes[name] = value;
  }
  return attributes;
}
function decodeXmlEntities(input) {
  return input.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
function encodeJsonBase64(value) {
  const json = JSON.stringify(value);
  const globalWithBuffer = globalThis;
  if (globalWithBuffer.Buffer) {
    return globalWithBuffer.Buffer.from(json, "utf8").toString("base64");
  }
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
function decodeJsonBase64(value) {
  try {
    const globalWithBuffer = globalThis;
    if (globalWithBuffer.Buffer) {
      return JSON.parse(globalWithBuffer.Buffer.from(value, "base64").toString("utf8"));
    }
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}
export {
  CHAT_ATTACHMENT_CAPABILITY_EXPIRES_HEADER,
  CHAT_ATTACHMENT_CAPABILITY_HEADER,
  CHAT_CONVERSATION_STATE_MESSAGE_TYPE,
  CHAT_EMERGENCY_MESSAGE_TYPE,
  CHAT_EMERGENCY_TYPE_SOS,
  CHAT_EMOJI_UNICODE_VERSION,
  CHAT_MESSAGE_EDIT_WINDOW_MS,
  CHAT_REACTION_EMOJIS,
  CHAT_REACTION_INTERACTION_TYPE,
  CHAT_VOICE_MESSAGE_TYPE,
  CHAT_VOICE_SPEC,
  XMPP_EMERGENCY_NS,
  XMPP_MESSAGE_TIME_NS,
  XMPP_SERVER_EVENT_NS,
  buildChatAttachmentDownloadRequest,
  buildChatInteractionTimeline,
  buildChatMessageMetadata,
  buildFormSubmissionMetadata,
  chatAttachmentDownloadCapabilityFromHeaders,
  createChatClient,
  createDeviceId,
  createInMemoryOmemoDiscoveryCache,
  createIndexDbStorageBackend,
  createMemoryStorageBackend,
  createMongoDbStorageBackend,
  createOmemoEncryption,
  createRoomDirectory,
  decryptChatAttachmentBytes,
  downloadChatAttachmentWithFetch,
  encryptChatAttachmentBytes,
  extractDisplayName,
  extractProviderDirectMessageRoomId,
  extractSubmissionId,
  extractSubmissionRoomId,
  getChatAddress,
  getChatDeviceId,
  getChatUserId,
  getChatVoiceDurationMs,
  getChatVoiceRecorderExpoOptions,
  getChatVoiceRecorderWebOptions,
  getMessageEditError,
  getMessageInteractionId,
  hasChatAttachmentDownloadCapability,
  init,
  isChatAudioAttachment,
  isChatReactionControlMessage,
  isChatReactionEmoji,
  isEmergencyMessage,
  isEncryptedChatAttachment,
  isMessageEditWithinWindow,
  isRetractionAuthorized,
  normalizeInteractionActorId,
  parseChatEmergencyMessage,
  parseChatReactionEvent,
  parseChatReplyReference,
  parseChatServerEvent,
  parseConversationStateMessage,
  storageBackends,
  uploadChatAttachmentWithFetch
};
//# sourceMappingURL=index.mjs.map