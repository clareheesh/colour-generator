import "./styles.css";
import { useState } from "react";
import { getColorFromName, mix } from "./utils";
import { data } from "./data";

const getBackground = (name: string) => {
  const rgb = getColorFromName(name);
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};

const getMixedColorsBackground = (colors) => {
  const rgb = mix(colors);
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const rgbToHex = ([r, g, b]: number[]) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const useCount = () => {
  const [count, setCount] = useState(0);
  const increase = () => {
    setCount(count + 1);
  };
  const decrease = () => {
    setCount(count - 1);
  };

  return { count, increase, decrease };
};

const allowedColors = [
  "Bismuth Vanadate Yellow",
  "Titanium White",
  "Bone black",
  "Pyrrole Red",
  "Cerulean Blue, Chromium"
];

const getValues = (colors) => {
  const keys = Object.keys(colors);
  return keys
    .map((key) => {
      return { paint: key, parts: colors[key] };
    })
    .filter((item) => item.parts !== 0);
};

const allColors = Object.keys(data.ks);

export default function App() {
  const [colors, setColors] = useState<{ [key: string]: number }>({});

  const increase = (color: string) => () => {
    setColors({
      ...colors,
      [color]: (colors[color] || 0) + 1
    });
  };
  const decrease = (color: string) => () => {
    if (colors[color] === 0 || colors[color] === undefined) return;
    setColors({
      ...colors,
      [color]: (colors[color] || 0) - 1
    });
  };

  const mixedColors = mix(getValues(colors));

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>

      {/* <p>{JSON.stringify(getValues(colors))}</p> */}
      {/* <p>{JSON.stringify(getMixedColors(getValues(colors)))}</p> */}

      <button style={{ marginBottom: 30 }} onClick={() => setColors({})}>
        Clear
      </button>

      <div className="colors">
        {allColors
          .filter((color) => allowedColors.includes(color))
          .map((color: string) => (
            <div
              style={{
                backgroundColor: getBackground(color),
                color: color.includes("black") ? "white" : undefined
              }}
            >
              <span onClick={decrease(color)}>-</span>
              <span>
                {color}: {colors[color] || 0}
              </span>
              <span onClick={increase(color)}>+</span>
            </div>
          ))}
      </div>

      <div className="resultsScreenshot">
        <div
          style={{
            backgroundColor: getMixedColorsBackground(getValues(colors))
          }}
        >
          {rgbToHex(mixedColors)}
        </div>
        {getValues(colors).map((color) => (
          <span
            style={{
              backgroundColor: getBackground(color.paint),
              color: color.paint.includes("black") ? "white" : undefined
            }}
          >
            {color.parts}
          </span>
        ))}
      </div>
    </div>
  );
}
