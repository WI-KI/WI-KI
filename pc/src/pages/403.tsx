import React from 'react';
import { Layout, Result, Button } from 'antd';
import { Link } from 'umi';
import './main.less';

const { Content } = Layout;

class NotAuth extends React.Component {

    constructor(props: any) {
        super(props);
    };

    render() {
        return (
            <>
                <Content>
                    <Result
                        status="403"
                        title="403"
                        subTitle="Sorry, you are not authorized to access this page."
                        extra={<Button href="/" type="primary">Back Home</Button>}
                    />
                </Content>
            </>
        );
    };
}

export default NotAuth;