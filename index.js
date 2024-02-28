/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
    async fetch({ url }, env, ctx) {
        if ((url ?? '') === '') {
            return ok('');
        }        
        const params = getUrlParams(url);
        if (Object.keys(params).length === 0 || (params.target ?? '') === '') {
            return ok('');
        }
        const { target } = params;
        const urls = parseUrls(target)
        if (urls == null || urls.length == 0) {
            return ok('');
        }
        const firstUrl = urls[0]
        const uu = await biliUri(firstUrl)
        console.log(uu)
        return new Response(uu);
    },
};


const ok = (resp) => {
    return new Response(resp);
}

const parseUrls = (inputText) => {
    // Regular expression to match URLs
    let urlRegex = /(https?:\/\/[^\s]+)/g;

    // Array to store extracted URLs
    let urls = [];
    let match;

    // Find all URLs in the input text
    while ((match = urlRegex.exec(inputText)) !== null) {
        urls.push(match[0]);
    }

    return urls;
}

const removeParams = (uri) => {
    if ((uri ?? '') === '') {
        return ''
    }
    const split = uri.split("?");
    return split[0];
}

const getUrlParams = (url) => {
    const url2 = url.split('#').shift();
    const obj = {};
    url2.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (obj[k] = v));
    return obj;
}

const biliUri = async (url) => {
    let uri = url;
    const httpsIndex = uri.indexOf("https");
    const text = uri.substring(0, httpsIndex);
    uri = uri.substring(httpsIndex);
    if (uri.includes("b23.tv")) {
        let resp = await fetch(uri, { method: 'HEAD', timeout: 20000 });        
        let location = resp.url;
        uri = location;
    }
    return (text.length == 0 ? "" : (text + " ")) + removeParams(uri);
}
