import React from 'react';
import ReactDOM from 'react-dom';
import Header from '@/components/Header';
import BasicLayout from '@/components/BasicLayout';
import { Layout, Space, Button, Input, Skeleton } from 'antd';
import article from '@/models/article';
import Loading from '@/components/Loading';

import { diff as DiffEditor } from "react-ace";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/snippets/markdown";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-github";
import "./index.less";

const { Content } = Layout;

async function getContent(_this: any, article_id: any, md_id1: any, md_id2: any) {
    let response = await article.getHistoryCompare({ article_id, md_id1, md_id2 });
    if (response && response.status === '1') {
        // console.log(response.content);
        _this.setState({
            lcontent: response.content[md_id1],
            llength: response.content[md_id1].markdown.length,
            rcontent: response.content[md_id2],
            rlength: response.content[md_id2].markdown.length,
            value: [response.content[md_id1].markdown, response.content[md_id2].markdown],
        });
    }
    _this.setState({
        loading: 0,
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
        let { article_id, md_id1, md_id2 } = this.props.match.params;
        this.setState({ loading: this.state.loading + 1 });
        getContent(this, article_id, md_id1, md_id2);
    }

    //在组件被移除后运行
    componentWillMount() {

    }

    componentDidUpdate() {
    }

    //props中的值发生改变时执行
    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id) {

        }
    }

    constructor(props: any) {
        super(props);
        this.onChange = this.onChange.bind(this);
    };

    onChange(newValue: any) {
        this.setState({
            value: newValue
        });
    }

    state = {
        notFound: false,
        loading: 0,
        lcontent: {},
        rcontent: {},
        llength: 0,
        rlength: 0,
        lid: -1,
        rid: -1,
        value: ["", ""],
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
                            // overflow: 'auto',
                        }}>


                            {this.state.loading > 0 &&
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 'calc(100vh - 100px)',
                                }}>
                                    <Loading />
                                </div>
                            }

                            {this.state.notFound === false &&
                                this.state.loading == 0 &&
                                <>
                                    <div style={{
                                        margin: 15,
                                        textAlign: 'center'
                                    }}>
                                        <Space >

                                            <Input style={{
                                                width: 160,
                                            }}
                                                addonBefore="历史版本编号"
                                                value={this.state.lcontent.md_id}
                                                id="LmdIdInput"
                                                disabled={true}
                                            />

                                            <Input style={{
                                                width: 140,
                                            }}
                                                addonBefore="文章编号"
                                                value={this.state.lcontent.article_id}
                                                id="LarticleIdInput"
                                                disabled={true}
                                            />


                                            <Input style={{
                                                width: 120,
                                            }}
                                                addonBefore="长度"
                                                value={this.state.llength}
                                                id="LLengthInput"
                                                disabled={true}
                                            />

                                            <Input style={{
                                                width: 140,
                                            }}
                                                addonBefore="修改者"
                                                value={this.state.lcontent.username}
                                                id="LusernameInput"
                                                disabled={true}
                                            />

                                            <Button style={{ marginLeft: 25, marginRight: 25 }} type="default" size="small" href={this.getHistoryUrl()}>
                                                返回
                                        </Button>

                                            <Input style={{
                                                width: 160,
                                            }}
                                                addonBefore="历史版本编号"
                                                value={this.state.rcontent.md_id}
                                                id="RmdIdInput"
                                                disabled={true}
                                            />

                                            <Input style={{
                                                width: 140,
                                            }}
                                                addonBefore="文章编号"
                                                value={this.state.rcontent.article_id}
                                                id="RarticleIdInput"
                                                disabled={true}
                                            />


                                            <Input style={{
                                                width: 120,
                                            }}
                                                addonBefore="长度"
                                                value={this.state.rlength}
                                                id="RLengthInput"
                                                disabled={true}
                                            />

                                            <Input style={{
                                                width: 140,
                                            }}
                                                addonBefore="修改者"
                                                value={this.state.rcontent.username}
                                                id="RusernameInput"
                                                disabled={true}
                                            />


                                        </Space>

                                        <div style={{
                                            marginTop: 20
                                        }}>

                                            <DiffEditor
                                                value={this.state.value}
                                                mode="markdown"
                                                theme="github"
                                                width="100%"
                                                height="calc(100vh - 130px)"
                                                fontSize={12}
                                                name={"ace-editor-" + this.props.match.params.article_id}
                                                showPrintMargin={false}
                                                setOptions={{
                                                    useWorker: false
                                                }}
                                                onChange={this.onChange}
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

