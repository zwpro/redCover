

async function login(queryStringParameters = {}) {
    const res = await uniCloud.callFunction({
        name: "api",
        data: { path: '/login', queryStringParameters },
    });
    return res
}

async function cover(queryStringParameters = {}) {
    const res = await uniCloud.callFunction({
        name: "api",
        data: { path: '/cover', queryStringParameters },
    });
    return res
}

async function coverDetail(queryStringParameters = {}) {
    const res = await uniCloud.callFunction({
        name: "api",
        data: { path: '/cover/detail', queryStringParameters },
    });
    return res
}

async function lookVideo(queryStringParameters = {}) {
    const res = await uniCloud.callFunction({
        name: "api",
        data: { path: '/look/video', queryStringParameters },
    });
    return res
}

async function inviteTrack(queryStringParameters = {}) {
    const res = await uniCloud.callFunction({
        name: "api",
        data: { path: '/invite/track', queryStringParameters },
    });
    return res
}

export {
    login, cover, coverDetail, lookVideo, inviteTrack
}