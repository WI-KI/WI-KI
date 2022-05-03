const config = {
    title: "WI-KI",
    indexTitle: "WI-KI",
    host: "",
    cdnHost: "",
    editor: {
        uploadURL: "/api/upload/image",
        base64URL: "/api/upload/getbase64",
        texHostUrl: "",
        texTargetUrl: "",
        imageLazyLoad: true,
    },
    proxy: {
        "/api": {
            target: "http://localhost:3000",
            // pathRewrite: { '^': '' },
            changeOrigin: true,
        },
        "/attachments": {
            target: "https://wi-ki.top",
            changeOrigin: true,
        },
    },
    api: {
        url: "/api",
    },
    publicPath: "/",
};

export default config;
