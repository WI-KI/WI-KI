import React from 'react';
import ReactDOM from 'react-dom';
import Header from '@/components/Header';
import BasicLayout from '@/components/BasicLayout';
import { Layout, Space, Button, Input } from 'antd';
import NotFound from '@/pages/404';
import article from '@/models/article';
import Table from './table';

const { Content } = Layout;

async function getArticle(_this: any, article_id: any) {
    let response = await article.get(article_id);
    if (response && response.status === '1') {
        _this.setState({
            content: response.content,
        });
    }
    _this.setState({
        loading: _this.state.loading - 1,
    });
}

class History extends React.Component {

    getArticleEditUrl() {
        var {username, team_id, article_id} = this.props.match.params;
        if (username) {
            return ["", "user", username, "article", "edit", article_id].join("/");
        } else if (team_id) {
            return ["", "team", team_id, "article", "edit", article_id].join("/");
        } else {
            return "";
        }
    }

    //在组件已经被渲染到 DOM 中后运行
    async componentDidMount() {
        let { article_id } = this.props.match.params;
        this.setState({ loading: this.state.loading + 1 });
        getArticle(this, article_id);
    }

    //在组件被移除后运行
    componentWillMount() {

    }

    componentDidUpdate() {
    }

    //props中的值发生改变时执行
    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.article_id !== nextProps.match.params.article_id) {
            let { article_id } = nextProps.match.params;
            this.setState({ loading: this.state.loading + 1 });
            getArticle(this, article_id);
        }
    }

    constructor(props: any) {
        super(props);
    };

    state = {
        loading: 0,
        content: {},
    }

    render() {
        return (
            <>
                <BasicLayout
                    headerCurRoute="/article"
                >

                    <Layout style={{
                        marginTop: '0px',
                        padding: '0px 0',
                        background: '#fff',
                        minHeight: 'calc(100vh - 50px)',
                        maxHeight: 'calc(100vh - 50px)',
                    }}>

                        <Content style={{
                            overflow: 'auto',
                        }}>

                            <>
                                <div style={{
                                    margin: 15,
                                }}>
                                    <Space>

                                        <Input style={{
                                            width: 180,
                                        }}
                                            addonBefore="文章编号"
                                            value={this.state.content.article_id}
                                            id="articleIdInput"
                                            disabled={true}
                                        />

                                        <Input style={{
                                            width: 480,
                                        }}
                                            addonBefore="文章标题"
                                            value={this.state.content.title}
                                            id="titleInput"
                                            disabled={true}
                                        />

                                        <Button type="default" size="small" href={this.getArticleEditUrl()}>
                                            返回
                                        </Button>
                                    </Space>

                                    <Table
                                        article_id={this.props.match.params.article_id}
                                        username={this.props.match.params.username}
                                        team_id={this.props.match.params.team_id}
                                    >

                                    </Table>


                                </div>




                            </>
                        </Content>
                    </Layout>
                </BasicLayout>
            </>
        );
    };

}

export default History;

