import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Row, Col, Result } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, NumberOutlined } from '@ant-design/icons';
import user from '@/models/user';
import { Link, history, useModel } from 'umi';
import { getPageQuery } from '@/utils/utils';


const ForgotPassword: React.FC<{}> = () => {

    const [loading, setLoading] = useState(0);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState(""); 
    const [veryCodeLoading, setVeryCodeLoading] = useState(0);
    const [status, setStatus] = useState("0");

    const onFinish = async function (values: any) {
        setLoading(1);
        user.resetPassword(values, async function (response: any) {
            if (response && response.status == '1') {
                console.log(response);
                message.success('重置成功！');
                setUsername(response.username);
                setStatus("1");
            } else {
                message.error((response && response.message) || '重置失败，请重试！');
            }
            setLoading(0);
        });
    };

    const sendEmailVeryCode = async function () {
        setVeryCodeLoading(1);
        user.sendEmailVeryCode({ email: email }, async function (response: any) {
            if (response && response.status == "1") {
                message.success(response.message || "发送成功！");
            } else {
                message.error((response && response.message) || "发送失败!");
            }
            setVeryCodeLoading(0);
        });
    }

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

                {status == "0" &&

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
                            Reset Password
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
                                name="email"
                                rules={[{ required: true, message: 'Please input your Email!' }]}
                            >
                                <Input
                                    prefix={<MailOutlined className="site-form-item-icon" />}
                                    type="email"
                                    placeholder="Email"
                                    onChange={(e) => { setEmail(e.target.value); }}
                                />
                            </Form.Item>


                            <Form.Item
                                name="verycode"
                                rules={[{ required: true, message: 'Please input your Verification Code!' }]}
                            >
                                <Row gutter={[16, 0]}>

                                    <Col span={15}>
                                        <Input
                                            prefix={<NumberOutlined className="site-form-item-icon" />}
                                            placeholder="Verification Code"
                                        />
                                    </Col>

                                    <Col span={9}>
                                        <Button style={{
                                            width: '100%',
                                        }} loading={veryCodeLoading > 0} onClick={sendEmailVeryCode} type="primary" className="login-form-button">
                                            SEND
                                    </Button>
                                    </Col>

                                </Row>

                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your Password!' }]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password: 4-20, 数字、字母或下划线"
                                />
                            </Form.Item>

                            <Form.Item
                                name="rptpassword"
                                rules={[{ required: true, message: 'Please confirm your Password!' }]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Confirm Password"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button style={{
                                    width: '100%',
                                }} loading={loading > 0} type="primary" htmlType="submit" className="login-form-button">
                                    Reset Password
                            </Button>

                                <div style={{
                                    marginTop: 10,
                                }}>

                                <Row gutter={[16, 0]}>
                                    <Col style={{ textAlign: 'left' }} span={8}>
                                        <a href="/user/login">用户登录</a>
                                    </Col>
                                    <Col style={{ textAlign: 'center' }} span={8}>
                                        <a href="/">返回主页</a>
                                    </Col>
                                    <Col style={{ textAlign: 'right' }} span={8}>
                                        <a href="/user/register">用户注册</a>
                                    </Col>
                                </Row>
                                </div>

                            </Form.Item>
                        </Form>
                    </div>
                }

                {status == "1" &&
                    <Result
                        status="success"
                        title="Congratulations on your successful reset password!"
                        subTitle={"Username: " + username + " " + " Email: " + email}
                        extra={[
                            <Button type="primary" key="login" href="/user/login">
                                Go Login
                            </Button>
                        ]}
                    />
                }
            </div>
        </>
    );
}

export default ForgotPassword;

