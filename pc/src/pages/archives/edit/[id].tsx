import React from 'react';
import { Layout, Menu, Spin, Skeleton, Modal, Table, Input, Button, Space, Form, Tabs, Tooltip } from 'antd';
import archives from '@/models/archives';
import { Link, history } from 'umi';
import Sider from '@/components/Sider';
import { SearchOutlined, HomeOutlined, BarsOutlined, FileTextOutlined } from '@ant-design/icons';
import BasicLayout from '@/components/BasicLayout';
import AddArchivesModel from './components/AddArchivesModel';
import AddArticleModel from './components/AddArticleModel';
import ArchivesTable from './components/ArchivesTable';
import ArticleTable from './components/ArticleTable';
import Loading from '@/components/Loading';

const { Content } = Layout;
const { TabPane } = Tabs;

async function getParent(_this: any, username: any, team_id: any, archives_id: any) {

    const getItem = (key: any, title: any, archives_id: any) => {
        return (
            <Menu.Item key={key} style={{
                fontSize: 16,
            }}
                icon={<HomeOutlined />}
            >
                {title.length >= 15 &&
                    <Tooltip placement="bottomLeft" title={title}>
                        <Link to={getUrl(archives_id)}>
                            {title}
                        </Link>
                    </Tooltip>
                }

                {title.length < 15 &&
                    <Link to={getUrl(archives_id)}>
                        {title}
                    </Link>
                }
            </Menu.Item>
        );
    }

    const getUrl = (archives_id: any) => {
        if (username) {
            return ["", "user", username, "archives", "edit", archives_id].join("/");
        } else if (team_id) {
            return ["", "team", team_id, "archives", "edit", archives_id].join("/");
        } else {
            return "";
        }
    }

    const getKey = (i: any) => {
        return ["parent", "archives", i.toString()].join("-");
    }

    let response = {};
    let siderItem = [];
    let siderCurRoute = "-1";
    if (username) response = await archives.getParentByUser(username, archives_id);
    else if (team_id) response = await archives.getParentByTeam(team_id, archives_id);
    if (response && response.status == '1') {
        for (let i = 0; i < response.content.length; ++i) {
            let item = response.content[i];
            let key = getKey(i + 1);
            if (i + 1 == response.content.length) {
                siderCurRoute = key;
            }
            siderItem.push(getItem(key, item.title, item.archives_id));
        }
    }
    await _this.setState({
        loadNum: _this.state.loadNum - 1,
        siderItem: siderItem,
        siderCurRoute: siderCurRoute,
    });
}

class Archives extends React.Component {

    //在组件已经被渲染到 DOM 中后运行
    async componentDidMount() {
        let { username, team_id, archives_id } = this.props.match.params;
        this.setState({ loadNum: this.state.loadNum + 1, });
        getParent(this, username, team_id, archives_id);
    }

    //props中的值发生改变时执行 
    async componentWillReceiveProps(nextProps: any) {
        if (this.props.match.params.archives_id !== nextProps.match.params.archives_id) {
            let { username, team_id, archives_id } = nextProps.match.params;
            this.setState({ loadNum: this.state.loadNum + 1, siderCurRoute: "-1", });
            getParent(this, username, team_id, archives_id);
        }
    }

    constructor(props: any) {
        super(props);
    };

    state = {
        siderItem: [],
        siderCurRoute: "-1",
        articleItem: [],
        loadNum: 0,
        childArchive: [],
    }

    handle() {
        history.push('/admin/archives/' + this);
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
                        >
                        </Sider>

                        <Content style={{
                            overflow: 'auto',
                        }}>
                                <>
                                    <Tabs style={{ marginLeft: 20, marginRight: 20 }} defaultActiveKey="archives">
                                        <TabPane
                                            tab={<span><BarsOutlined />档案</span>}
                                            key="archives"
                                        >
                                            <AddArchivesModel
                                                fa_id={this.props.match.params.archives_id}
                                                username={this.props.match.params.username}
                                                team_id={this.props.match.params.team_id} 
                                                callback={() => {
                                                    this.archivesChild.update();
                                                }}
                                            />
                                            <ArchivesTable 
                                            onRef={(ref) => { this.archivesChild = ref; }} 
                                            archives_id={this.props.match.params.archives_id}
                                            username={this.props.match.params.username}
                                            team_id={this.props.match.params.team_id}
                                            />
                                        </TabPane>

                                        <TabPane
                                            tab={<span><FileTextOutlined />文章</span>}
                                            key="article"
                                        >
                                            <AddArticleModel
                                                archives_id={this.props.match.params.archives_id}
                                                username={this.props.match.params.username}
                                                team_id={this.props.match.params.team_id} 
                                                callback={() => {
                                                    this.articleChild.update();
                                                }}
                                            />
                                            <ArticleTable 
                                            onRef={(ref) => { this.articleChild = ref; }} 
                                            archives_id={this.props.match.params.archives_id} 
                                            username={this.props.match.params.username}
                                            team_id={this.props.match.params.team_id} 
                                            />
                                        </TabPane>
                                    </Tabs>
                                </>
                        </Content>
                    </Layout>
                </BasicLayout>
            </>
        );
    };
}

export default Archives;
