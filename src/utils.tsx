import { data } from "./data";

const ks = data.ks;
const d50 = data.d50.d50;
const xyzFunctions = data.xyz;

export function getColorFromName(name) {
  const xyz = RefToXyz(findRefFromKs(computeKS(name)));
  return xyzToRgb(xyz[0], xyz[1], xyz[2]);
}

/**
 * Takes an array of colours [{ paint: "Name", parts: 0 }]
 * And returns the mix
 */
export function mix(arrayOfColours) {
  return mixColors(arrayOfColours || []);
}

function computeKS(e) {
  for (var t = {}, n = 380; n <= 750; n += 10)
    t["KS-" + n] = parseFloat(ks[e]["k-" + n]) / parseFloat(ks[e]["s-" + n]);
  return t;
}

function mixColors(e) {
  for (var t = 0, n = e.length, i = 0; i < n; i++) t += e[i].parts;
  var r,
    o,
    s = {};
  for (i = 380; i <= 750; i += 10) {
    for (var a = (o = r = 0); a < n; a++)
      (r += (parseFloat(ks[e[a].paint]["k-" + i]) * parseInt(e[a].parts)) / t),
        (o +=
          (parseFloat(ks[e[a].paint]["s-" + i]) * parseInt(e[a].parts)) / t);
    s["KS-" + i] = r / o;
  }
  var l = RefToXyz(findRefFromKs(s));
  return xyzToRgb(l[0], l[1], l[2]);
}

function RefToXyz(e) {
  for (var t = 0, n = 0, i = 0, r = 0, o = 380; o <= 750; o += 10)
    t += parseFloat(d50[o]) * parseFloat(xyzFunctions.y[o]) * 10;
  for (o = 380; o <= 750; o += 10)
    n +=
      parseFloat(e[o]) *
      parseFloat(d50[o]) *
      parseFloat(xyzFunctions.x[o]) *
      10;
  n /= t;
  for (o = 380; o <= 750; o += 10)
    i +=
      parseFloat(e[o]) *
      parseFloat(d50[o]) *
      parseFloat(xyzFunctions.y[o]) *
      10;
  i /= t;
  for (o = 380; o <= 750; o += 10)
    r +=
      parseFloat(e[o]) *
      parseFloat(d50[o]) *
      parseFloat(xyzFunctions.z[o]) *
      10;
  return [n, i, (r /= t)];
}

function findRefFromKs(e) {
  for (var t = {}, n = 380; n <= 750; n += 10)
    (t[n] =
      1 +
      parseFloat(e["KS-" + n]) -
      Math.sqrt(
        Math.pow(parseFloat(e["KS-" + n]), 2) + 2 * parseFloat(e["KS-" + n])
      )),
      (t[n] = 0.03 + (0.97 * 0.35 * t[n]) / (1 - 0.65 * t[n]));
  return t;
}

function xyzToRgb(e, t, n) {
  var i = e,
    r = t,
    o = n,
    s =
      3.239886 * (i = 0.9555766 * i + -0.0230393 * r + 0.0631636 * o) +
      -1.536869 * (r = -0.0282895 * i + 1.0099416 * r + 0.0210077 * o) +
      -0.498444 * (o = 0.0122982 * i + -0.020483 * r + 1.3299098 * o),
    a = -0.967675 * i + 1.87293 * r + 0.041488 * o,
    l = 0.056595 * i + -0.207515 * r + 1.075305 * o;
  return (
    0.0031308 < s ? (s = 1.055 * Math.pow(s, 1 / 2.4) - 0.055) : (s *= 12.92),
    0.0031308 < a ? (a = 1.055 * Math.pow(a, 1 / 2.4) - 0.055) : (a *= 12.92),
    0.0031308 < l ? (l = 1.055 * Math.pow(l, 1 / 2.4) - 0.055) : (l *= 12.92),
    s < 0 && (s = 0),
    1 < s && (s = 1),
    a < 0 && (a = 0),
    1 < a && (a = 1),
    l < 0 && (l = 0),
    1 < l && (l = 1),
    [parseInt(255 * s), parseInt(255 * a), parseInt(255 * l)]
  );
}
