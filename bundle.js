import fs from "fs";
import xml2js from "xml2js";

const version = JSON.parse(fs.readFileSync('package.json', 'utf-8')).version;

const file = fs.readFileSync('app.svg', 'utf-8');
const code = fs.readFileSync('app.js', 'utf-8');
const style = fs.readFileSync('app.css', 'utf-8');
new xml2js.Parser({
    explicitRoot: false
}).parseString(file, (e, svg) => {
    svg.script = `\n// <SVGS version="${version}" />\n${code}`;
    svg.style = `${style}`;
    const built = new xml2js.Builder({
        rootName: 'svg',
        headless: true,
        cdata: true
    }).buildObject(svg);
    fs.writeFileSync('app.html', built);
    fs.writeFileSync('app-bundle.svg', built);
});

