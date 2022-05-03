import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from '@/components/BasicLayout';
import { Layout, Menu, Spin, Input, Radio, message, Form, Button, Alert, Card, Row, Col } from 'antd';
import request from 'umi-request';
import { history } from 'umi';
import Loading from '@/components/Loading';
import user from '@/models/user';

const { Content } = Layout;

const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
};

const tailLayout = {
    wrapperCol: { offset: 10, span: 14 },
};


class ChangePassword extends React.Component {

    //在组件已经被渲染到 DOM 中后运行
    componentDidMount() {

    }

    constructor(props: any) {
        super(props);
        this.state.user = this.props.user;
    };

    state = {
        loading: 0,
        user: {},
    }

    onFinish = async (values) => {
        let _this = this;
        await _this.setState({ loading: _this.state.loading + 1});
        user.changePassword(values, function(response:any) {
            if (response && response.status == '1') {
                message.success(response.message || "密码修改成功!");
                setTimeout(() => {
                    // window.location.reload();
                    _this.props.update && _this.props.update();
                }, 100);
            } else {
                message.error((response && response.message) || "密码修改失败，请重试");
            }
            _this.setState({ loading: _this.state.loading - 1}); 
        });
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
                        // justifyContent: 'center',
                    }}
                    >

                                <div style={{
                                    paddingTop: 160,
                                    width: 420,
                                }}>

                                    <Form
                                        {...layout}
                                        name="basic"
                                        initialValues={{ 
                                            password: "",
                                            newPassword: "",
                                            rptPassword: "",
                                        }}
                                        onFinish={this.onFinish}
                                    >
                                        <Form.Item
                                            label="Old Password"
                                            name="password"
                                        >
                                            <Input 
                                            type="password"
                                            />
                                        </Form.Item>


                                        <Form.Item
                                            label="New Password"
                                            name="newPassword"
                                        >
                                            <Input type="password" placeholder="4-20, 数字、字母或下划线"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Confirm Password"
                                            name="rptPassword"
                                        >
                                            <Input  type="password" />
                                        </Form.Item>

                                        <Form.Item {...tailLayout}>
                                            <Button loading={this.state.loading > 0} style={{ width: '100%', }} type="primary" htmlType="submit">
                                                CONFIRM
                                            </Button>
                                        </Form.Item>
                                    </Form>


                                </div>

                    </Layout>

            </>
        );
    };
}

export default ChangePassword;
