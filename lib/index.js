"use strict";
const core = require('@actions/core');
const github = require('@actions/github');
const github_token = core.getInput('my_github_token');
if (github_token.length) {
    core.setOutput("result", "Got the following github token: ", github_token);
}
else {
    core.setOutput("result", "Was unable to validate github token");
}
