import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Spin, Switch, Result, Button, Input, Space, message, Row, Col, Radio } from 'antd';
import article from '@/models/article';
import dynamicLoad from '@/utils/dynamicLoad';
import { Link } from 'umi';
import BasicLayout from '@/components/BasicLayout';
import NotFound from '@/pages/404';
import CONFIG from '@/../../config-client';
import moment from 'moment';

const { Content } = Layout;

async function getArticle(_this: any, article_id: any) {
    let response = await article.get(article_id);
    if (response && response.status === '1') {
        _this.setState({
            loaded: true,
            content: response.content,
            title: response.content.title,
            archives_id: response.content.archives_id,
            locked: response.content.locked,
        });
        dynamicLoad.loadCSS(CONFIG.cdnHost + "/editor.md/css/editormd.min.css", function () {
            dynamicLoad.loadScript(CONFIG.cdnHost + "/editor.md/js/editormd.min.js", function () {
                _this.createEditor(_this);
            });
        });
    }
    if (response === undefined || response.status === '0') {
        _this.setState({
            EditorLoading: false,
        });
    };
    _this.setState({
        loading: _this.state.loading - 1,
    });
}


class Edit extends React.Component {

    getArticleDetailsUrl() {
        let { username, team_id, article_id } = this.props.match.params;
        if (username) return ["", "user", username, "article", "details", article_id].join("/");
        else if (team_id) return ["", "team", team_id, "article", "details", article_id].join("/");
        else return "";
    }

    getHistoryUrl() {
        let { username, team_id, article_id } = this.props.match.params;
        if (username) return ["", "user", username, "article", "history", article_id].join("/");
        else if (team_id) return ["", "team", team_id, "article", "history", article_id].join("/");
        else return "";    
    }

    //在组件已经被渲染到 DOM 中后运行
    async componentDidMount() {
        this.setState({
            loading: this.state.loading + 1,
            EditorLoading: true,
            id: this.props.match.params.article_id,
        });
        getArticle(this, this.props.match.params.article_id);
    }

    componentWillUnmount() {
        // 销毁拦截判断是否离开当前页面
        window.removeEventListener('beforeunload', this.beforeunload);
    }

    beforeunload(e: any) {
        let confirmationMessage = '你确定离开此页面吗?';
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    }

    //在组件被移除后运行
    componentWillMount() {
        // clearInterval(this.editorID);
        // 拦截判断是否离开当前页面
        window.addEventListener('beforeunload', this.beforeunload);
    }

    componentDidUpdate() {

    }

    //props中的值发生改变时执行
    async componentWillReceiveProps(nextProps) {
        if (this.props.match.params.article_id !== nextProps.match.params.article_id) {
            this.setState({
                loading: this.state.loading + 1,
                EditorLoading: true,
                id: nextProps.match.params.article_id
            });
            getArticle(this, nextProps.match.params.article_id);
        }
    }

    state = {
        id: 0,
        loading: 0,
        EditorLoading: false,
        content: {},
        title: "",
        archives_id: "",
        locked: "",
    }

    constructor(props: any) {
        super(props);
        // console.log(moment().format("YYYY-MM-DD h:mm:ss"));
    };

    async createEditor(_this: any) {
        if (_this.state.notFound !== true) {
            let id = "editormd-" + _this.props.match.params.article_id;
            let obj = document.getElementById(id);
            // if (obj && obj.innerHTML != "") obj.innserHTML = "";
            // console.log("DD");
            if (obj && obj.innerHTML != "") return;
            window.editor = window.editormd(id, {
                width: "100%",
                height: 'calc(100vh - 130px)',
                path: CONFIG.cdnHost + '/editor.md/lib/',
                toolbarIcons : function() {
                    return [
                        "undo", "redo", "|",
                        "bold", "del", "italic", "quote", "table", "image", "|",
                        "watch", "preview", "extend_html", "help", "options",
                    ]
                },
                markdown: _this.state.content.markdown,
                imageUpload: true,
                uploadURL: CONFIG.editor.uploadURL,
                uploadToken: window.localStorage.wikiAuthToken,
                texHostUrl: CONFIG.editor.texHostUrl,
                texTargetUrl: CONFIG.editor.texTargetUrl,
                imageLazyLoad: CONFIG.editor.imageLazyLoad,
                onload: function () {
                    // 暂时这么做
                    setTimeout(() => {
                        _this.setState({ EditorLoading: false });
                    }, 200);
                }
            });

            //要有箭头函数才起作用
            // _this.editorID = setInterval(
            //     () => _this.loadEditor(_this),
            //     200
            // );
        }
    }

    // loadEditor(_this: any) {
    //     if (window.editor.cm === undefined) {
    //     } else {
    //         window.editor.setMarkdown(_this.state.content.markdown);
    //         clearInterval(this.editorID);
    //         _this.setState({ EditorLoading: false });
    //     }
    // }

    async articleUpdate() {
        let _this = this;
        _this.setState({ loading: true });
        let article_id = _this.state.id;
        let markdown = window.editor.getMarkdown();
        let html = window.editor.getPreviewedHTML();
        let title = this.state.title;
        let archives_id = this.state.archives_id;
        let locked = this.state.locked;
        let response = await article.update({
            article_id: article_id,
            title: title,
            archives_id: archives_id,
            html: html,
            markdown: markdown,
            locked: locked,
        });
        if (response && response.status === '1') {
            message.success('保存成功！');
        } else {
            message.error(response.message || "保存失败，请重试!");
        }
        _this.setState({ loading: false });
    }

    render() {

        return (
            <>
                <BasicLayout
                    headerCurRoute="/article"
                >
                    <Spin spinning={this.state.EditorLoading}>
                        <Layout style={{
                            marginTop: '0px',
                            padding: '0px 0',
                            background: '#fff',
                            minHeight: 'calc(100vh - 50px)',
                            maxHeight: 'calc(100vh - 50px)',
                        }}>
                            <Content style={{
                            }}>
                                    <>
                                        <div style={{
                                            margin: 15,
                                        }}>
                                            <Space >

                                                <Input style={{
                                                    width: 420,
                                                }}
                                                    addonBefore="标题"
                                                    value={this.state.title}
                                                    id="titleInput"
                                                    disabled={this.state.loading != 0}
                                                    ref={(titleInput) => (this.titleInput = titleInput)}
                                                    onBlur={this.inputOnBlur}
                                                    onChange={(event) => {
                                                        this.setState({
                                                            title: event.target.value,
                                                        });
                                                    }}
                                                />

                                                <Input style={{
                                                    width: 160,
                                                }}
                                                    addonBefore="父档案编号"
                                                    value={this.state.archives_id}
                                                    id="archivesIdInput"
                                                    disabled={this.state.loading != 0}
                                                    ref={(archivesIdInput) => (this.archivesIdInput = archivesIdInput)}
                                                    onBlur={this.inputOnBlur}
                                                    onChange={(event) => {
                                                        this.setState({
                                                            archives_id: event.target.value,
                                                        });
                                                    }}
                                                />

                                                <Radio.Group onChange={(event) => { this.setState({ locked: event.target.value, }); }} value={this.state.locked}>
                                                    <Radio value={0}>发布</Radio>
                                                    <Radio value={1}>隐藏</Radio>
                                                </Radio.Group>

                                                <Button type="default" size="small" onClick={this.articleUpdate.bind(this)}>
                                                    保存修改
                                                </Button>
                                                {/* <Button type="default" size="small" href={this.getHistoryUrl()}>
                                                    本地缓存
                                                </Button> */}
                                                <Button type="default" size="small" href={this.getArticleDetailsUrl()}>
                                                    查看文章
                                                </Button>
                                                <Button type="default" size="small" href={this.getHistoryUrl()}>
                                                    历史版本
                                                </Button>
                                                <Button type="default" size="small" onClick={() => { window.history.go(-1);}}>
                                                    返回
                                                </Button>
                                            </Space>
                                        </div>


                                        <div style={{
                                            margin: 15,
                                        }}>
                                            <Spin spinning={this.state.EditorLoading === false && this.state.loading != 0}>
                                                <div id={"editormd-" + this.state.id}></div>
                                            </Spin>
                                        </div>
                                    </>

                            </Content>
                        </Layout>
                    </Spin>
                </BasicLayout>
            </>

        );
    };

}

export default Edit;
