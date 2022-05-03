import React from 'react';
import BasicLayout from '@/components/BasicLayout';
import { Layout, Space, Button, Input, Skeleton } from 'antd';
import NotFound from '@/pages/404';
import article from '@/models/article';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools"
import Loading from '@/components/Loading';

const { Content } = Layout;

async function getHistorySource(_this: any, article_id: any, md_id: any) {
    let response = await article.getHistorySource({article_id, md_id});
    if (response && response.status === '1') {
        _this.setState({
            content: response.content,
            length: response.content.markdown.length,
        });
    }
    _this.setState({
        loading: _this.state.loading - 1,
    });
}

class Source extends React.Component {

    getHistoryUrl() {
        let { username, team_id, article_id } = this.props.match.params;
        if (username) {
            return ["", "user", username, "article", "history", article_id].join("/");
        } else if (team_id) {
            return ["", "team", team_id, "article", "history", article_id].join("/"); 
        } else {
            return "";
        }
    }

    //在组件已经被渲染到 DOM 中后运行
    async componentDidMount() {
        let { article_id, md_id } = this.props.match.params;
        this.setState({ loading: this.state.loading + 1 });
        getHistorySource(this, article_id, md_id)
    }

    //在组件被移除后运行
    componentWillMount() {

    }

    componentDidUpdate() {

    }

    //props中的值发生改变时执行
    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id) {
            let { article_id, md_id } = nextProps.match.params;
            this.setState({ loading: this.state.loading + 1 });
            getHistorySource(this, article_id, md_id);
        }
    }

    constructor(props: any) {
        super(props);
    };

    state = {
        loading: 0,
        content: {},
        length: 0,
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

                            {this.state.loading > 0 &&
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 'calc(100vh - 200px)',
                                }}>
                                    <Loading />
                                </div>
                            }

                            {this.state.loading == 0 &&
                                <>
                                    <div style={{
                                        margin: 15,
                                        height: 'calc(100vh - 100px)',
                                    }}>
                                        <Space>

                                            <Input style={{
                                                width: 360,
                                            }}
                                                addonBefore="文章标题"
                                                value={this.state.content.title}
                                                id="titleInput"
                                                disabled={true}
                                            />

                                            <Input style={{
                                                width: 160,
                                            }}
                                                addonBefore="历史版本编号"
                                                value={this.state.content.md_id}
                                                id="mdIdInput"
                                                disabled={true}
                                            />

                                            <Input style={{
                                                width: 140,
                                            }}
                                                addonBefore="文章编号"
                                                value={this.state.content.article_id}
                                                id="articleIdInput"
                                                disabled={true}
                                            />

                                            <Input style={{
                                                width: 140,
                                            }}
                                                addonBefore="长度"
                                                value={this.state.length}
                                                id="LengthInput"
                                                disabled={true}
                                            />

                                            <Input style={{
                                                width: 140,
                                            }}
                                                addonBefore="修改者"
                                                value={this.state.content.username}
                                                id="usernameInput"
                                                disabled={true}
                                            />

                                            <Button type="default" size="small" href={this.getHistoryUrl()}>
                                                返回
                                        </Button>
                                        </Space>

                                        <div style={{
                                            marginTop: 20
                                        }}>

                                            <AceEditor
                                                mode="markdown"
                                                theme="github"
                                                width="100%"
                                                height="calc(100vh - 130px)"
                                                value={this.state.content.markdown}
                                                fontSize="12px"
                                                showPrintMargin={false}
                                                // onChange={onChange}
                                                name={"ace-editor-" + this.props.match.params.id}
                                                editorProps={{ $blockScrolling: true }}
                                            />
                                        </div>
                                    </div>
                                </>
                            }
                        </Content>
                    </Layout>
                </BasicLayout>
            </>
        );
    };

}

export default Source;

