import { assert } from "chai";
import tpl from "./templates/basic.tpl.html";

assert.notEqual(tpl.indexOf("section"), -1);
assert.notEqual(tpl.indexOf("article"), -1);