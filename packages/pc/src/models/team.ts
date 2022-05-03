import request from '@/utils/request';

const team = {

    getAll: () => {
        return new Promise((resolve, reject) => {
            request.get("/team/getAll")
            .then((response:any) => {
                resolve(response);
            }) 
        });
    },

    getMy: () => {
        return new Promise((resolve, reject) => {
            request.get("/team/getMy")
            .then((response:any) => {
                resolve(response);
            })
        });
    },

    add: (data:any) => {
        return new Promise((resolve, reject) => {
            request.post("/team/add", {data:data})
            .then((response:any) => {
                resolve(response);
            })
        });        
    },

    update: (data:any) => {
        return new Promise((resolve, reject) => {
            request.post("/team/update", {data:data})
            .then((response:any) => {
                resolve(response);
            })
        });        
    },

    getSingle: (team_id:any) => {
        return new Promise((resolve, reject) => {
            request.get("/team/getSingle/" + team_id)
            .then((response:any) => {
                resolve(response);
            })
        })
    },

    join: (data:any) => {
        return new Promise((resolve, reject) => {
            request.post("/team/join", {data:data})
            .then((response:any) => {
                resolve(response);
            })
        })
    },

    changeTeamMemberStatus: (data:any) => {
        return new Promise((resolve, reject) => {
            request.post("/team/changeTeamMemberStatus", {data:data})
            .then((response:any) => {
                resolve(response);
            })
        })
    },

    delTeamMember: (data:any) => {
        return new Promise((resolve, reject) => {
            request.post("/team/delTeamMember", {data:data})
            .then((response:any) => {
                resolve(response);
            })
        })
    }

}

export default team;