import path from "path";
import fs from "fs";

import { createObject } from "./createCode";

import { MongoId, String, Int, Float, ArrayOf } from "./dataTypes";

export default function(source, destPath) {
  Promise.resolve(source).then(module => {
    let rootDir = path.join(destPath, "graphQL");
    if (!fs.existsSync(rootDir)) {
      fs.mkdirSync(rootDir);
    }
    Object.keys(module).forEach(k => (module[k].__name = k));
    let modules = Object.keys(module).map(k => module[k]);

    modules.forEach(objectToCreate => {
      let k = objectToCreate.__name,
        modulePath = path.join(rootDir, k),
        objPath = path.join(modulePath, k + ".js");

      let fields = objectToCreate.fields;

      if (!fs.existsSync(objPath)) {
        fs.mkdirSync(modulePath);
        fs.writeFileSync(
          objPath,
          createObject("export const Test = {", [
            {
              name: "fields",
              value: Object.keys(objectToCreate.fields).map(k => ({
                name: k,
                value: objectToCreate.fields[k]
              }))
            }
          ]) + ";"

          //createObject("export const Test = {", [{ name: "a", value: '"value"' }, { name: "b", value: "two" }, { name: "c", value: "three" }])
        );
      }
    });
  });
}
