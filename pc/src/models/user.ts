import request from '@/utils/request';

const user = {

    login: function (data: any, callback: any) {
        // console.log(id);
        request.post("/user/login", { data: data })
            .then(function (response) {
                callback(response);
            });
    },

    currentUser: function (callback: any) {
        request.get("/user/currentUser")
            .then(function (response) {
                callback(response);
            });
    },

    sendEmailVeryCode: function (data: any, callback: any) {
        request.post("/user/email/verycode", { data: data })
            .then(function (response) {
                callback(response);
            })
    },

    register: function (data: any, callback: any) {
        request.post("/user/register", { data: data })
            .then(function (response) {
                callback(response);
            })
    },

    resetPassword: function(data:any, callback:any) {
        request.post("/user/resetPassword", {data:data})
        .then(function(response) {
            callback(response);
        })
    },

    update: function(data:any, callback:any) {
        request.post("/user/update", {data:data})
        .then(function(response){
            callback(response);
        });
    },

    changePassword: function(data:any, callback:any) {
        request.post("/user/changePassword", {data:data})
        .then(function(response) {
            callback(response);
        })
    },

    getAll: function(callback:any) {
        request.get("/user/getAll")
        .then(function(response) {
            callback(response);
        })
    }


};

export default user;
