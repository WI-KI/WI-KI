const config = {
    title: "WI-KI",
    host: "",
    jsonBodySizeLimit: "1024mb",
    port: "",
    mysql: {
        connectionLimit: 100,
        host: "",
        user: "root",
        password: "",
        database: "",
        port: 3306,
        useConnectionPooling: true,
    },
    jwt: {
        secretOrPrivateKey: "+Zftu0GLuneS7kf8Z1sC",
        expiresIn: "24h", //unit s
    },
    minio: {
        config: {
            endPoint: "wi-ki.top",
            port: 9000,
            useSSL: false,
            accessKey: "ADMIN",
            secretKey: "ADMIN",
        },
        bucketName: "wiki",
    },
    upload: {
        url: "/attachments",
        limitSize: "2097152", // 2MB
    },
    base64: {
        dir: "upload_tmp",
    },
    redis: {
        host: "",
        port: "",
        password: "",
        prefix: "wiki",
    },
    login: {
        wait: true,
        waitTime: "60", //unit s
    },
    register: {
        wait: true,
        waitTime: "60", //umit s
        validTime: "30", //unit min
        emailSubject: "WIKI - You have new Verification Code",
    },
    comment: {
        wait: true,
        waitTime: "60", // unit s
        emailHint: false,
        emailSubject: "WIKI - You have new reply",
    },
    email: {
        ssl: true,
        host: "smtp.exmail.qq.com",
        port: 465,

        user: "",
        pass: "",
    },
};

module.exports = config;
