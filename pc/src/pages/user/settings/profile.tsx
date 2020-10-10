import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from '@/components/BasicLayout';
import { Layout, Menu, Spin, Input, Radio, message, Form, Button, Alert, Card, Row, Col } from 'antd';
import request from 'umi-request';
import { history } from 'umi';
import Loading from '@/components/Loading';
import user from '@/models/user';
import moment from 'moment';

const { Content } = Layout;
const { Meta } = Card;

const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
};

const tailLayout = {
    wrapperCol: { offset: 10, span: 14 },
};

class Profile extends React.Component {

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
        user.update(values, function(response:any) {
            if (response && response.status == '1') {
                message.success(response.message || "更新成功!");
                setTimeout(() => {
                    // window.location.reload();
                    _this.props.update && _this.props.update();
                }, 100);
            } else {
                message.error((response && response.message) || "更新失败，请重试");
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
                        <Row style={{
                            paddingTop: 160,
                        }} gutter={[16, 0]}>

                            <Col span={12}>
                                <img style={{ width: 240, height: 240, border: '.3em solid #e0dfcc', borderRadius: '1em',}} src={this.state.user.imgUrl + "&s=240"} alt="" />
                                <Alert style={{ marginTop: 20, width: 240, }} message={"注册于 " + moment(this.state.user.datetime).format("YYYY年 MM月 DD日")} type="success" />
                                <Alert style={{ marginTop: 20, width: 240, }} message="You can change your avatar in GAVATAR." type="info" closable />
                            </Col>

                            <Col span={12}>
                                <div style={{
                                    width: 420,
                                }}>

                                    <Form
                                        {...layout}
                                        name="basic"
                                        initialValues={{ 
                                            username: this.state.user.username ,
                                            email: this.state.user.email,
                                            school: this.state.user.school,
                                            name: this.state.user.name,
                                            password: "",
                                        }}
                                        onFinish={this.onFinish}
                                    >
                                        <Form.Item
                                            label="Username"
                                            name="username"
                                        >
                                            <Input 
                                            disabled
                                            />
                                        </Form.Item>


                                        <Form.Item
                                            label="Email"
                                            name="email"
                                        >
                                            <Input disabled 
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="School"
                                            name="school"
                                        >
                                            <Input  placeholder="少于12个字符"/>
                                        </Form.Item>

                                        <Form.Item
                                            label="Name"
                                            name="name"
                                        >
                                            <Input  placeholder="少于12个字符"/>
                                        </Form.Item>

                                        <Form.Item
                                            label="Password"
                                            name="password"
                                            rules={[{ required: true, message: 'Please input your Password!' }]}
                                        >
                                            <Input type="password" />
                                        </Form.Item>


                                        <Form.Item {...tailLayout}>
                                            <Button loading={this.state.loading > 0} style={{ width: '100%', }} type="primary" htmlType="submit">
                                                CONFIRM
                                            </Button>
                                        </Form.Item>
                                    </Form>


                                </div>

                            </Col>

                        </Row>


                    </Layout>

            </>
        );
    };
}

export default Profile;
