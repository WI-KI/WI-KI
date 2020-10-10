import request from '@/utils/request';
import { resolveConfig } from 'prettier';

const archives = {

    getMy: () => {
        return new Promise((resolve, reject) => {
            request.get("/archives/getMy")
            .then((response:any) => {
                resolve(response);
            })
        })
    },

    getAll: () => { 
        return new Promise((resolve, reject) => {
            request.get("/archives/getAll")
            .then((response:any) => {
                resolve(response);
            })
        })        
    },

    getChildByUser: (username:any, archives_id:any) => {
        return new Promise((resolve, reject) => {
            request.get("/archives/user/" + username + "/getChild/" + archives_id)
            .then((response:any) => {
                resolve(response);
            })
        })    
    },

    getChildByTeam: (team_id:any, archives_id:any) => {
        return new Promise((resolve, reject) => {
            request.get("/archives/team/" + team_id + "/getChild/" + archives_id)
            .then((response:any) => {
                resolve(response);
            })
        })        
    },

    getParentByUser: (username:any, archives_id:any) => {
        return new Promise((resolve, reject) => {
            request.get("/archives/user/" + username + "/getParent/" + archives_id)
            .then((response:any) => {
                resolve(response);
            })
        })    
    },

    getParentByTeam: (team_id:any, archives_id:any) => {
        return new Promise((resolve, reject) => {
            request.get("/archives/team/" + team_id + "/getParent/" + archives_id)
            .then((response:any) => {
                resolve(response);
            })
        })        
    },

    add: (data:any) => {
        return new Promise((resolve, reject) => {
            request.post("/archives/add", {data:data})
            .then((response:any) => {
                resolve(response);
            })
        })
    },

    update: (data:any) => {
        return new Promise((resolve, reject) => {
            request.post("/archives/update", {data:data})
            .then((response:any) => {
                resolve(response);
            })
        })
    },

};

export default archives;
