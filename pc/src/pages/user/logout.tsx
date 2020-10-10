import React from 'react';
import {history} from 'umi';
import { message } from 'antd';
import request from '@/utils/request';
import Loading from '@/components/Loading';

const LogOut = function() {
    let token = window.localStorage.wikiAuthToken;
    if (!token || token == "") {
        message.error("请先登录!");
        history.push("/user/login");
    } else {
        request.get("/user/logout")
        .then(function(response) {
            window.localStorage.wikiAuthToken = "";
            message.success("登出成功！");
            history.push("/user/login");
        })
    }
    return (
        <div style={{
            height: 'calc(100vh)',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Loading />
        </div>
    );
}

export default LogOut;
