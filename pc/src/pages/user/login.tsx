import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import user from '@/models/user';
import { Link, SelectLang, history, useModel } from 'umi';
import { getPageQuery } from '@/utils/utils';

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
    const urlParams = new URL(window.location.href);
    const params = getPageQuery();
    let { redirect } = params as { redirect: string };
    if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
        } else {
            window.location.href = '/user/settings';
            return;
        }
    }
    history.replace(redirect || '/user/settings');
};

const Login: React.FC<{}> = () => {

    const { refresh } = useModel('@@initialState');
    const [loading, setLoading] = useState(0);

    let token = window.localStorage.wikiAuthToken;
    if (token && token != "") {
        history.replace("/user/settings");
        return null;
    }

    const onFinish = async function (values: any) {
        await setLoading(1);
        user.login(values, async function (response: any) {
            if (response && response.status == '1') {
                message.success('登录成功！');
                await refresh(); 
                replaceGoto();
            } else {
                message.error((response && response.message) || '账号或密码错误，请重试！');
            }
            setLoading(0);
        });
    };

    return (
        <>
            <div style={{
                width: '100%',
                backgroundColor: '#e6fffb',
                minHeight: 'calc(100vh)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                flexWrap: 'wrap',
            }}>

                <div style={{
                    marginTop: -280,
                    width: 320,
                }}>

                    <span style={{
                        // fontFamily: 'Avenir,helvetica neue,Arial,Helvetica,sans-serif',
                        fontSize: 34,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                        color: 'rgba(0,0,0,.85)',
                    }}>
                        Sign In
                    </span>

                    <Form
                        name="normal_login"
                        style={{
                            width: '100%',
                            marginTop: 20
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button style={{
                                width: '100%'
                            }} loading={loading > 0} type="primary" htmlType="submit" className="login-form-button">
                                Sign In
                            </Button>

                            <div style={{
                                marginTop: 10,
                            }}>

                                <Row gutter={[16, 0]}>
                                    <Col style={{ textAlign: 'left' }} span={8}>
                                        <a href="/user/register">用户注册</a>
                                    </Col>
                                    <Col style={{ textAlign: 'center' }} span={8}>
                                        <a href="/">返回主页</a>
                                    </Col>
                                    <Col style={{ textAlign: 'right' }} span={8}>
                                        <a href="/user/forgot-password">忘记密码</a>
                                    </Col>
                                </Row>

                            </div>

                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default Login;

