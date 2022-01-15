import { assert } from "chai";
import tpl from "./templates/template.tpl.html";

assert.equal(typeof tpl, "string");

assert.notEqual(tpl.indexOf("Second View"), -1);
assert.notEqual(tpl.indexOf("About me"), -1);
assert.notEqual(tpl.indexOf("About you"), -1);