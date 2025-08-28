import { paper, Project, Size, Path, Layer, Point } from "paper2/paper2-core";

declare const window: any;

const isNodejs = globalThis.process?.release?.name;

// These are here because PaperJS types are incomplete
type AugmentedLayer = paper.Layer & { inner: any; outer: any; clear(): void };

type LayerCollection = paper.Layer[] & {
  export: AugmentedLayer;
};

interface LayerItem extends paper.Item {
  children: LayerCollection;
}

const mySvg = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="10cm" height="30.48cm" viewBox="0 0 10 30.48">
    <g id="export">
        <g id="foo">
          <g id="bar">
              <path stroke="red" stroke-width="33" id="blah" d="M1.13313,25.99574v0h0.38994v0v0.71488v0h-0.38994v0z" />
          </g>
        </g>     
    </g>
  </svg>
  `;

const proj = new Project(new Size(100, 100));

const layer = proj.importSVG(mySvg) as LayerItem;
const items = layer.children["export"].getItems({ recursive: true });
items.forEach((item) => {
  if (isNodejs) console.log(item.className, item.name);
});
if (typeof window !== "undefined") {
  const svgString = layer.exportSVG({ asString: true });
  window.paper2SvgString = svgString;
}

// ----------

const segments = [new Point(100, 100), new Point(100, 200)];
const path = new Path(segments);
path.name = "foo2";

const segments2 = [new Point(50, 150), new Point(150, 150)];
const path2 = new Path(segments2);
path2.name = "bar2";

const layer2 = new Layer({
  children: [path, path2],
  strokeColor: "green",
  strokeWidth: "3px",
  position: paper.view.center,
});

layer2.children.forEach((item) => {
  if (isNodejs) console.log(item.className, item.name);
});

export const paper2SvgString2 = layer2.exportSVG({ asString: true });
