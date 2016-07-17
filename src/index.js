#!/usr/bin/env node

import http from "http";
import convert from "./conversion/convert";

const prefixesUrl = process.argv[process.argv.length - 2]
const metadataUrl = process.argv[process.argv.length - 1]
const urls = [prefixesUrl, metadataUrl]

Promise.all(urls.map(downloadFile), ([prefixesData, metadataData]) => {
  [convertedPrefixesData, convertedMetadataData] = convert(prefixesData, metadataData);
}

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
    })
  });
}
