
import { config } from '../config';
import fetch from 'node-fetch';
import { exec } from 'child_process';
import { clipboard } from 'electron';

let last_search = null;

const DuckduckgoModule = {
    valid: (query) => {
        return query.trim().length >= 1;
    },
    search: (query) => {
        clearTimeout(last_search);
        return new Promise((resolve) => {
            last_search = setTimeout(() => {
                fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`).then((response) => {
                    response.json().then((data) => {
                        resolve([
                            {
                                type: 'icon_list_item',
                                material_icon: 'language',
                                primary: query,
                                secondary: data.Redirect,
                                executable: true,
                                quality: config.modules.duckduckgo.quality,
                                url: data.Redirect,
                                preview: config.modules.duckduckgo.url_preview && data.Redirect && {
                                    type: 'iframe',
                                    url: data.Redirect,
                                },
                            },
                            {
                                type: 'icon_text',
                                material_icon: 'assessment',
                                text: data.Answer,
                                executable: true,
                                quality: config.modules.duckduckgo.quality,
                            },
                            {
                                type: 'icon_text',
                                material_icon: 'assessment',
                                text: data.Definition,
                                executable: true,
                                quality: config.modules.duckduckgo.quality,
                                url: data.DefinitionURL,
                                preview: config.modules.duckduckgo.url_preview && data.DefinitionURL && {
                                    type: 'iframe',
                                    url: data.DefinitionURL,
                                },
                            },
                            {
                                type: 'icon_text',
                                uri_icon: (data.Image[0] === '/' ? `https://duckduckgo.com/${data.Image}` : data.Image),
                                material_icon: data.Image ? null : 'assessment',
                                text: data.AbstractText,
                                executable: true,
                                quality: config.modules.duckduckgo.quality,
                                url: data.AbstractURL,
                                preview: config.modules.duckduckgo.url_preview && data.AbstractURL && {
                                    type: 'iframe',
                                    url: data.AbstractURL,
                                },
                            },
                        ].concat(data.RelatedTopics.reduce((a, b) => b.Topics ? a.concat(b.Topics) : a.concat([b]), []).map((data) => ({
                            type: 'icon_text',
                            uri_icon: (data.Icon.URL[0] === '/' ? `https://duckduckgo.com/${data.Icon.URL}` : data.Icon.URL),
                            material_icon: data.Icon.URL ? null : 'assessment',
                            text: data.Text,
                            executable: true,
                            quality: config.modules.duckduckgo.quality,
                            url: data.FirstURL,
                            preview: config.modules.duckduckgo.url_preview && data.FirstURL && {
                                type: 'iframe',
                                url: data.FirstURL,
                            },
                        }))).concat(data.Results.reduce((a, b) => b.Topics ? a.concat(b.Topics) : a.concat([b]), []).map((data) => ({
                            type: 'icon_text',
                            uri_icon: (data.Icon.URL[0] === '/' ? `https://duckduckgo.com/${data.Icon.URL}` : data.Icon.URL),
                            material_icon: data.Icon.URL ? null : 'assessment',
                            text: data.Text,
                            executable: true,
                            quality: config.modules.duckduckgo.quality,
                            url: data.FirstURL,
                            preview: config.modules.duckduckgo.url_preview && data.FirstURL && {
                                type: 'iframe',
                                url: data.FirstURL,
                            },
                        }))).filter((el) => el.text?.length >= 1 || (el.primary?.length >= 1 && el.secondary?.length >= 1)));
                    }).catch((e) => { });
                }).catch((e) => { });
            }, config.modules.duckduckgo.debounce_time)
        });
    },
    execute: async (option) => {
        if(option.url) {
            exec(`xdg-open ${option.url}`);
        } else {
            clipboard.writeText(option.text);
        }
    },
}

export default DuckduckgoModule;