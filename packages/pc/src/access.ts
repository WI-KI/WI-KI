import { InitialState } from 'umi';

export default function (initialState: InitialState) {
    const {user} = initialState || {};
    return {
        admin: user && user.auth && user.auth == "1",
    };
}
