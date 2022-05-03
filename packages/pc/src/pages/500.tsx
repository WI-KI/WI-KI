import React from 'react';
import { Layout, Result, Button } from 'antd';
import { Link } from 'umi';
import './main.less';

const { Content } = Layout;

class NetWorkWrong extends React.Component {

    constructor(props: any) {
        super(props);
    };

    render() {
        return (
            <>
                <Content>
                    <Result
                        status="500"
                        title="500"
                        subTitle="Sorry, something went wrong."
                        extra={<Button href="/" type="primary">Back Home</Button>}
                    />
                </Content>
            </>
        );
    };
}

export default NetWorkWrong;