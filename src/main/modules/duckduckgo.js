
import { config } from '../config';
import fetch from 'node-fetch';
import { exec } from 'child_process';

let last_search = null;

const DuckduckgoModule = {
    valid: (query) => {
        return config.modules.duckduckgo.active && query.trim().length >= 1;
    },
    search: (query) => {
        clearTimeout(last_search);
        return new Promise((resolve) => {
            last_search = setTimeout(() => {
                fetch(`https://api.duckduckgo.com/?q=${query}&format=json`).then((response) => {
                    response.json().then((data) => {
                        resolve([
                            {
                                type: 'icon_text',
                                uri_icon: data.Image,
                                material_icon: data.Image ? null : 'assessment',
                                text: data.AbstractText,
                                executable: true,
                                quality: config.modules.duckduckgo.quality,
                                url: data.AbstractURL,
                            },
                            {
                                type: 'icon_text',
                                material_icon: 'assessment',
                                text: data.Definition,
                                executable: true,
                                quality: config.modules.duckduckgo.quality,
                                url: data.DefinitionURL,
                            },
                        ].concat(data.RelatedTopics.reduce((a, b) => b.Topics ? a.concat(b.Topics) : a.concat([b]), []).map((data) => ({
                            type: 'icon_text',
                            uri_icon: data.Icon.URL,
                            material_icon: data.Icon.URL ? null : 'assessment',
                            text: data.Text,
                            executable: true,
                            quality: config.modules.duckduckgo.quality,
                            url: data.FirstURL,
                        }))).concat(data.Results.reduce((a, b) => b.Topics ? a.concat(b.Topics) : a.concat([b]), []).map((data) => ({
                            type: 'icon_text',
                            uri_icon: data.Icon.URL,
                            material_icon: data.Icon.URL ? null : 'assessment',
                            text: data.Text,
                            executable: true,
                            quality: config.modules.duckduckgo.quality,
                            url: data.FirstURL,
                        }))).filter((el) => el.text && el.text.length >= 1));
                    }).catch((e) => { });
                }).catch((e) => { });
            }, config.modules.duckduckgo.debounce_time)
        });
    },
    execute: async (option) => {
        exec(`xdg-open ${option.url}`);
    },
}

export default DuckduckgoModule;