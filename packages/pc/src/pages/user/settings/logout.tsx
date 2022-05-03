import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from '@/components/BasicLayout';
import { Layout, Button, Result } from 'antd';
import request from 'umi-request';
import { history } from 'umi';
import Loading from '@/components/Loading';
import user from '@/models/user';
import moment from 'moment';

class Logout extends React.Component {

    //在组件已经被渲染到 DOM 中后运行
    componentDidMount() {

    }

    constructor(props: any) {
        super(props);
    };

    state = {
        loading: 0,
    }

    render() {
        return (
            <>
                <Layout style={{
                    marginTop: '0px',
                    padding: '0px 0',
                    background: '#fff',
                    minHeight: 'calc(100vh - 50px)',
                    maxHeight: 'calc(100vh - 50px)',
                    display: 'flex',
                    alignItems: 'center',
                }}
                >

                    <div style={{
                        marginTop: 180
                    }}>
                    <Result
                        status="warning"
                        title="Are you sure to log out of the account?"
                        extra={
                            <Button href="/user/logout" type="primary" key="console">
                                Log out
                            </Button>
                        }
                    />

                    </div>





                </Layout>

            </>
        );
    };
}

export default Logout;
