#!/usr/bin/env node

import * as http from "http";
import convert from "./conversion/convert";
import getArguments from "minimist";
import * as path from "path";
import {writeFile} from "fs";
import {copy, mkdirs} from "fs-extra";

const cmdArgs = getArguments(process.argv);
const defaultArgs = {
  prefixesUrl: "http://dataviz.polyno.me/dn42-netblock-visu/registry-prefixes.json",
  metadataUrl: "http://dataviz.polyno.me/dn42-netblock-visu/registry-inetnums.json",
  outputDir: "./dn42-vis"
}
const args = Object.assign(defaultArgs, cmdArgs);

const urls = [args.prefixesUrl, args.metadataUrl];

Promise.all(urls.map(downloadFile)).then(([prefixesData, metadataData]) => {

  const [convertedPrefixesData, convertedMetadataData] = convert(prefixesData, metadataData);

  mkdirs(path.resolve(process.cwd(), args.outputDir, "./data"), err => {
    if (err) return console.error(err);

    copy(path.resolve(__dirname, "./assets/"), path.resolve(process.cwd(), args.outputDir), err => {
      if (err) return console.error(err);

      writeFile(path.resolve(process.cwd(), args.outputDir, "./data/prefixes.json"), convertedPrefixesData, err => {
        if (err) return console.error(err);

        writeFile(path.resolve(process.cwd(), args.outputDir, "./data/metadata.json"), convertedMetadataData, err => {
          if (err) return console.error(err);

          console.log("Data generated");	
        })
      })
    })
  })
}).catch(reason => console.error(reason));

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    var data = "";
    var request = http.get(url, (res) => {

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      })
    }).on('error', err => reject(err));
  });
}
