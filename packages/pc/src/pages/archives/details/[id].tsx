import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from '@/components/BasicLayout';
import { Layout, Menu, Spin, Tabs, Skeleton, Button, Tooltip } from 'antd';
import archives from '@/models/archives';
import { Link, history } from 'umi';
import Sider from '@/components/Sider';
import { SearchOutlined, HomeOutlined, BarsOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Input, Space } from 'antd';
import ArticleTable from './ArticleTable';
import Loading from '@/components/Loading';
import article from '@/models/article';

const { Content } = Layout;

async function getParent(_this: any, archives_id: any, username: any, team_id: any) {
    const getUrl = (archives_id:any) => {
        if (username) {
            return ["", "user", username, "archives", "details", archives_id].join("/");
        } else if (team_id) {
            return ["", "team", team_id, "archives", "details", archives_id].join("/");
        }
    }
    const getSiderItem = (key: any, archives_id: any, title: any) => {
        return (
            <Menu.Item key={key} style={{
                fontSize: 16,
            }}
                icon={<HomeOutlined />}
            >
                {title.length >= 14 &&
                    <Tooltip placement="bottomLeft" title={title}>
                        <Link to={getUrl(archives_id)}>
                            {title}
                        </Link>
                    </Tooltip>
                }

                {title.length < 14 &&
                    <Link to={getUrl(archives_id)}>
                        {title}
                    </Link>
                }
            </Menu.Item>               
        )
    };
    const getKey = (i: any) => {
        return ["parent", "archives", i].join("-");
    };
    let response = null;
    if (username) response = await archives.getParentByUser(username, archives_id);
    else if (team_id) response = await archives.getParentByTeam(team_id, archives_id);
    let siderItem = [];
    let siderCurRoute = getKey("0");
    if (response && response.status == "1") {
        for (let i = 0; i < response.content.length; ++i) {
            let item = response.content[i];
            let key = getKey((i + 1).toString());
            siderItem.push(getSiderItem(key, item.archives_id, item.title));
            if (i + 1 == response.content.length) {
                siderCurRoute = key;
            }
        }
    }
    _this.setState({
        siderItem: siderItem,
    });
    getChild(_this, archives_id, username, team_id, siderCurRoute);
}

async function getChild(_this: any, archives_id: any, username: any, team_id: any, siderCurRoute: any) {
    const getUrl = (archives_id:any) => {
        if (username) {
            return ["", "user", username, "archives", "details", archives_id].join("/");
        } else if (team_id) {
            return ["", "team", team_id, "archives", "details", archives_id].join("/");
        }
    }
    const getSiderItem = (key: any, archives_id: any, title: any) => {
        return (
            <Menu.Item key={key} style={{
                fontSize: 16,
            }}
                icon={<BarsOutlined />}
            >
                {title.length >= 14 &&
                    <Tooltip placement="bottomLeft" title={title}>
                        <Link to={getUrl(archives_id)}>
                            {title}
                        </Link>
                    </Tooltip>
                }

                {title.length < 14 &&
                    <Link to={getUrl(archives_id)}>
                        {title}
                    </Link>
                }
            </Menu.Item>               
        )
    };
    var getKey = (i: any) => {
        return ["child", "archives", i].join("-");
    };    
    let response = null;
    if (username) response = await archives.getChildByUser(username, archives_id);
    else if (team_id) response = await archives.getChildByTeam(team_id, archives_id);
    let siderItem = _this.state.siderItem;
    if (siderItem.length > 0 && response && response.status == "1" && response.content.length > 0) siderItem.push(( <hr key={"archives"} />));
    if (response && response.status == "1") {
        for (let i = 0; i < response.content.length; ++i) {
            let item = response.content[i];
            let key = getKey((i + 1).toString());
            siderItem.push(getSiderItem(key, item.archives_id, item.title));
        }
    }
    _this.setState({
        siderItem: siderItem,
        siderCurRoute: siderCurRoute,
    }); 
}

async function getArticle(_this: any, archives_id: any, username:any, team_id: any) {
    let response = {};
    if (username) response = await article.getChildByUser(username, archives_id);
    else if (team_id) response = await article.getChildByTeam(team_id, archives_id);
    let tableData = [];
    if (response && response.status == '1') {
        for (var i = 0; i < response.content.length; ++i) {
            let now = response.content[i];
            let item = {
                key: i,
                article_id: now.article_id,
                title: now.title,
                date: now.date,
                action: now.article_id,
            };
            tableData.push(item);
        }
    } 
    _this.setState({
        tableData: tableData,
        tableLoading: _this.state.tableLoading - 1,
    });
}

class Index extends React.Component {

    //在组件已经被渲染到 DOM 中后运行
    async componentDidMount() {
        let { archives_id, username, team_id } = this.props.match.params;
        this.setState({
            tableLoading: this.state.tableLoading + 1,
        });
        getParent(this, archives_id, username, team_id);
        getArticle(this, archives_id, username, team_id);
    }

    //props中的值发生改变时执行
    async componentWillReceiveProps(nextProps: any) {
        if (this.props.match.params != nextProps.match.params) {
            let { archives_id, username, team_id } = nextProps.match.params; 
            this.setState({
                tableLoading: this.state.tableLoading + 1,
                tableData: [],
                siderItem: [],
                siderCurRoute: "-1",
            }); 
            getParent(this, archives_id, username, team_id);
            getArticle(this, archives_id, username, team_id);            
        }
    }

    constructor(props: any) {
        super(props);
    };

    state = {
        siderItem: [],
        siderCurRoute: "-1",
        tableLoading: 0,
        tableData: [],
    }

    render() {

        return (
            <>
                <BasicLayout
                    headerCurRoute="/archives"
                >
                    <Layout style={{
                        marginTop: '0px',
                        padding: '0px 0',
                        background: '#fff',
                        minHeight: 'calc(100vh - 50px)',
                        maxHeight: 'calc(100vh)',
                    }}
                    >
                        <Sider
                            siderItem={this.state.siderItem}
                            siderCurRoute={this.state.siderCurRoute}
                        />

                            <Content style={{
                                overflow: 'auto',
                            }}
                            >

                                {this.state.tableLoading != 0 &&
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Loading />
                                    </div>
                                }

                                {this.state.tableLoading == 0 &&
                                    <div style={{
                                        margin: 12
                                    }}>
                                        <ArticleTable style={{ margin: 12 }} 
                                        tableData={this.state.tableData} 
                                        username={this.props.match.params.username}
                                        team_id={this.props.match.params.team_id}
                                        />
                                    </div>
                                }

                            </Content>
                    </Layout>
                </BasicLayout>
            </>
        );
    };
}

export default Index;
