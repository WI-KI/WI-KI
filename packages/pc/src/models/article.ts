import request from '@/utils/request';

const article = {

	getAll: async () => {
		return new Promise((resolve, reject) => {
			request.get("/article/getAll")
			.then((response:any) => {
				resolve(response);
			})
		})
	},

	getMy: async () => {
		return new Promise((resolve, reject) => {
			request.get("/article/getMy")
			.then((response:any) => {
				resolve(response);
			})
		})
	},

	getChildByUser: async (username:any, archives_id:any) => {
		return new Promise((resolve, reject) => {
			request.get("/article/user/" + username + "/getChild/" + archives_id)
			.then((response:any) => {
				resolve(response);
			})
		})
	},

	getChildByTeam: async (team_id:any, archives_id:any) => {
		return new Promise((resolve, reject) => {
			request.get("/article/team/" + team_id + "/getChild/" + archives_id)
			.then((response:any) => {
				resolve(response);
			})
		})		
	},

	get: async (article_id:any) => {
		return new Promise((resolve, reject) => {
			request.get("/article/get/" + article_id)
			.then((response:any) => {
				resolve(response);
			})
		})			
	},

	update: async (data:any) => {
		return new Promise((resolve, reject) => {
			request.post("/article/update", {data:data})
			.then((response:any) => {
				resolve(response);
			})
		})
	},

	addByUser: async (data:any, username:any) => {
		return new Promise((resolve, reject) => {
			request.post("/article/add/user/" + username, {data:data})
			.then((response:any) => {
				resolve(response);
			})
		})		
	},

	addByTeam: async (data:any, team_id:any) => {
		return new Promise((resolve, reject) => {
			request.post("/article/add/team/" + team_id, {data:data})
			.then((response:any) => {
				resolve(response);
			})
		})		
	},

	getHistoryList: async (article_id:any) => {
		return new Promise((resolve, reject) => {
			request.get("/article/history/list/" + article_id)
			.then((response:any) => {
				resolve(response);
			})
		})		
	},

	getHistorySource: async (data:any) => {
		return new Promise((resolve, reject) => {
			request.post("/article/history/source", {data:data})
			.then((response:any) => {
				resolve(response);
			})
		})
	},

	getHistoryCompare: async(data:any) => {
		return new Promise((resolve, reject) => {
			request.post("/article/history/compare", {data})
			.then((response:any) => {
				resolve(response);
			})
		})		
	},


};

export default article;
