"use strict";
const core = require('@actions/core');
const github = require('@actions/github');
const { request } = require("@octokit/request");
const github_token = core.getInput('MY_GITHUB_TOKEN');
const issue_number = core.getInput('ISSUE_NUMBER');
console.log("starting");
console.log("got the following token: ", github_token);
console.log("got issue number", issue_number);
if (github_token.length) {
    core.setOutput("result", "Got the following github token: ", github_token);
}
else {
    core.setOutput("result", "Was unable to validate github token");
}
const header = {
    headers: {
        'Accept': 'application/vnd.github.inertia-preview+json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + github_token
    },
};
const get_issue = () => {
    request(`https://api.github.com/repos/helloretail/addwish/issues/${issue_number}`, header)
        .then((issues) => {
        const is_devops = issues.data.labels.filter(ele => ele.url === 'https://api.github.com/repos/helloretail/addwish/labels/DevOps').length > 0;
        if (is_devops) {
            get_pipeline_cards();
        }
    });
};
const get_pipeline_cards = () => {
    request("https://api.github.com/projects/columns/15391780/cards", header)
        .then((response) => {
        const found_cards = response.data.filter((ele) => ele.content_url === `https://api.github.com/repos/helloretail/addwish/issues/${issue_number}`);
        if (found_cards.length > 0) {
            move_column_card(found_cards[0].id, 15756183);
        }
    });
};
const move_column_card = (card_id, column_id) => {
    request(`POST /projects/columns/cards/${card_id}/moves`, {
        headers: {
            'Accept': 'application/vnd.github.inertia-preview+json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + github_token
        },
        card_id: card_id,
        column_id: column_id,
        position: 'bottom',
        mediaType: {
            previews: [
                'inertia'
            ]
        }
    });
};
get_issue();
