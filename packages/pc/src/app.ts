import request from '@/utils/request';

export async function getInitialState(): Promise<{user:any}>{
    try {
        return request.get("/user/currentUser")
        .then(function(response) { 
            if (response && response.status == '1') {
                return response.user;
            } else {
                return {};
            }
        })
    } catch (error) {
        history.push("/user/login");
    }
}
