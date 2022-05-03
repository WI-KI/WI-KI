import request from '@/utils/request';

const comment = {

    get: (article_id:any) => {
        return new Promise((resolve, reject) => {
            request.get("/comment/get/" + article_id)
            .then((response:any) => {
                resolve(response);
            });
        })
    },

    add: (data:any) => {
        return new Promise((resolve, reject) => {
            request.post("/comment/add", {data:data})
            .then((response:any) => {
                resolve(response);
            })
        })
    }

};

export default comment;
