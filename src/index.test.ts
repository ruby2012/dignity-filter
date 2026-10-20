import { test } from "node:test";
import assert from "node:assert/strict";
import { dignityFilter } from "./index.ts";

test("removes pet names and child-directed praise",()=>{
  assert.equal(dignityFilter("Good job, sweetie").text,"Thanks for checking.");
  for(const term of ["honey","dear","good boy","good girl"]) assert.doesNotMatch(dignityFilter(`Thanks, ${term}.`).text,new RegExp(term,"i"));
});
test("reframes bans in safer language",()=>{
  assert.match(dignityFilter("You can't send money.").text,/safer not to/);
  assert.match(dignityFilter("You're not allowed to leave.").text,/safer not to/);
});
test("complex or harmful sentences use caller-reviewed fallback",()=>{
  for(const text of ["Exercise extraordinary circumspection regarding fraudulent solicitation.","You are stupid."]) {
    const filtered=dignityFilter(text,"Pause and check.");
    assert.equal(filtered.text,"Pause and check.");assert.equal(filtered.usedFallback,true);
  }
});
