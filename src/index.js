#!/usr/bin/env node

import http from "http";
import convert from "./conversion/convert";

const url = process.argv[process.argv.length - 1]

downloadFile(url).then(data => {
  console.log(convert(data));
});

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
