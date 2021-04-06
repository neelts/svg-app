import fs from "fs";
import xml2js from "xml2js";

const version = JSON.parse(fs.readFileSync('package.json', 'utf-8')).version;

import {Command} from 'commander/esm.mjs';
import path from "path";

new Command()
    .version(version)
    .arguments('<svg>').description('bundle', { svg: 'SVG file' })
    .option('-c, --code <file>', 'Code file for SVG (*.js)')
    .option('-s, --style <file>', 'Style file for SVG (*.css)')
    .option('-o, --output <file>', 'Output file (*.svg), default is <svg>-bundle.svg')
    .action(action)
    .parse(process.argv);

function action(svg, options, command) {
    const file = fs.readFileSync(svg, 'utf-8');
    const code = options.code ? fs.readFileSync(options.code, 'utf-8') : null;
    const style = options.style ? fs.readFileSync('app.css', 'utf-8') : null;
    const output = options.output ?? /(.+)\./g.exec(path.basename(svg))[1] + '-bundle.svg';
    new xml2js.Parser({
        explicitRoot: false
    }).parseString(file, (e, svg) => {
        if (code) svg.script = `\n// <SVGS version="${version}" />\n${code}`;
        if (style) svg.style = `${style}`;
        const built = new xml2js.Builder({
            rootName: 'svg',
            headless: true,
            cdata: true
        }).buildObject(svg);
        fs.writeFileSync(`${output}.xml`, built);
        fs.writeFileSync(output, built);
    });
}