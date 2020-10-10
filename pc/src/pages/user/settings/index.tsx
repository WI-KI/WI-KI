import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from '@/components/BasicLayout';
import { Layout, Menu, Spin, Input, Radio, message } from 'antd';
import request from 'umi-request';
import { history } from 'umi';
import Loading from '@/components/Loading';
import user from '@/models/user';
import Profile from './profile';
import ChangePassword from './changePassword';
import Logout from './logout';
import TeamManage from './teamManage/teamManage';
import ArchivesManage from './archivesManage/archivesManage';
import ArticleManage from './articleManage/articleManage';

const { Content } = Layout;
const { Search } = Input;

const item = ["个人设置", "密码修改", "团队管理", "文章管理", "档案管理", "退出登录"];

function getUser(_this: any) {
    user.currentUser(async function (response: any) {
        if (response && response.status == "1") {
            await _this.setState({
                user: response.user,
            });
        } else {
            window.localStorage.wikiAuthToken = "";
            message.error("请先登陆！");
            history.push("/user/login?redirect=" + window.location.href);
            return null;
        }
        _this.setState({
            loading: _this.state.loading - 1,
        });
    })
}

class Index extends React.Component {
    
    update() {
        this.setState({
            loading: this.state.loading + 1,
        });
        getUser(this);
    }

    //在组件已经被渲染到 DOM 中后运行
    componentDidMount() {
        this.update();
    }

    constructor(props: any) {
        super(props);
        this.update = this.update.bind(this);
    };

    state = {
        nowRouter: "0",
        loading: 0,
        user: {},
    }

    render() {
        return (
            <>
                <BasicLayout
                    headerCurRoute="/user/settings"
                >

                    {this.state.loading > 0 &&
                        <>
                            <div style={{
                                height: 'calc(100vh - 50px)',
                                backgroundColor: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Loading />
                            </div>

                        </>
                    }

                    {this.state.loading == 0 &&

                        <Layout style={{
                            marginTop: '0px',
                            padding: '0px 0',
                            background: '#fff',
                            minHeight: 'calc(100vh - 50px)',
                            maxHeight: 'calc(100vh - 50px)',
                        }}
                        >
                            <div className="m-sys">
                                <div className="m-main">

                                {this.state.nowRouter == "0" &&
                                    <Profile user={this.state.user} update={this.update}/>
                                }

                                {this.state.nowRouter == "1" &&
                                    <ChangePassword user={this.state.user} update={this.update} />
                                }

                                {this.state.nowRouter == "2" &&
                                    <TeamManage />
                                }

                                {this.state.nowRouter == "3" &&
                                    <ArticleManage />
                                }

                                {this.state.nowRouter == "4" &&
                                    <ArchivesManage 
                                    username={this.state.user.username}
                                    />
                                }

                                {this.state.nowRouter == "5" &&
                                    <Logout />
                                }

                                </div>

                                <div className="m-menu">
                                    {
                                        item.map((item, index) => {
                                            return (
                                                <>
                                                    <div className={"m-menu-item " + (this.state.nowRouter == index.toString() ? "active" : "")} key={index.toString()} onClick={() => {
                                                        this.setState({ nowRouter: index.toString(), });
                                                    }}>
                                                        {item}
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </Layout>
                    }
                </BasicLayout>

            </>
        );
    };
}

export default Index;
