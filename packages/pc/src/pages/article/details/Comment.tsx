import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from '@/components/BasicLayout';
import { Layout, Menu, Result, Button, Skeleton, Tooltip, Spin, Comment, List, Space, Input, Alert, message, Row, Col, Popconfirm} from 'antd';
import Sider from '@/components/Sider';
import dynamicLoad from '@/utils/dynamicLoad';
import { QuestionCircleOutlined } from '@ant-design/icons';
import comment from '@/models/comment';
import { Link, history } from 'umi';
import NotFound from '@/pages/404';
import CONFIG from "@/../../config-client";
import { HomeOutlined, BarsOutlined, FileTextOutlined } from '@ant-design/icons';
import { trim } from '@/utils/utils';
import moment from 'moment';
moment.locale('zh-cn');

const { Content } = Layout;

function scriptAction() {
    window.ScriptAction.gao();
}

async function getComment(_this: any, article_id: any) {
    let response = await comment.get(article_id);
    let commentItem = [];
    let commentJSON = {}; 
    if (response && response.status == '1') {
        commentJSON = response.content;
        for (let key in response.content) {
            let now = response.content[key];
            let quoteHTML = "";
            if (parseInt(now.fa_id) != 0) {
                quoteHTML += "<div>";
                quoteHTML += "<details class = 'info' >";
                quoteHTML += "<summary>";
                quoteHTML += "<a href='#comment-" + now.fa_id + "'>#" + now.fa_id + "</a>&nbsp;&nbsp;";
                quoteHTML += "<a target='_blank' href=''>@" + response.content[now.fa_id].username + "</a> </summary>";
                quoteHTML += "<div>" + response.content[now.fa_id].html + "</div>";
                quoteHTML += "</details>";
                quoteHTML += "</div>";
            }

            let item = {};
            item.author = (
                <>
                    <a name={"comment-" + now.comment_id} />
                    <a target={"_blank"} href={"#"}>{now.username}</a>
                </>
            );
            item.avatar = (
                <img className="lazyload"
                    src="data:image/gif;base64,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"
                    data-src={now.imgUrl + "&s=100"}
                    alt="loading..."
                >
                </img>
            );
            // item.actions = [<span key={"comment-list-reply-to-" + now.comment_id}>引用</span>];
            item.content = (
                <>
                    <div style={{
                        padding: 0,
                        marginLeft: -54,
                        marginTop: 12,
                        width: 'calc(100% + 54px)',
                    }}>
                        <div style={{
                            padding: 1,
                        }} className="markdown-body editormd-html-preview"
                            dangerouslySetInnerHTML={{ __html: quoteHTML + now.html }}
                        >
                        </div>
                    </div>
                </>
            );
            item.datetime = (
                <>
                    <Tooltip
                        title={now.date}
                    >
                        <span>
                            {moment(now.date)
                                .fromNow()}
                        </span>
                    </Tooltip>
                    <span> | </span>
                            <span><a title="Link to comment" href={"#comment-" + now.comment_id}>{"#" + now.comment_id}</a></span>
                    {/* {now.fa_id != 0 &&
                        <>
                            <span> | </span>
                            <span><a title="Parent comment" href={"#comment-" + now.fa_id}>^</a></span>
                        </>
                    } */}
                    <span> | </span>
                    <span><a onClick={
                        async () => { 
                            _this.setState({ fa_id: now.comment_id, });
                            window.location.href="#add-comment";
                    }}>回复</a></span>

                </>
            );
            commentItem.push(item);
        }
    }
    _this.setState({
        commentItem: commentItem,
        commentJSON: response.content,
        commentLoad: _this.state.commentLoad - 1,
    });
    setTimeout(
        () => { scriptAction(); },
        500
    );

}

let TimeCreateEditor:any, TimeEditorLoaded:any;

class CustomComment extends React.Component {

    async update(id: any) {
        this.setState({
            commentLoad: this.state.commentLoad + 1,
        });
        getComment(this, id);
    }

    //在组件已经被渲染到 DOM 中后运行
    async componentDidMount() {
        this.update(this.props.article_id);
        TimeCreateEditor = setTimeout(() => {
            this.createEditor(this);
        }, 10);
    }

    componentWillMount() {

    }

    //在组件被移除后运行
    async componentWillUnmount() {
        clearTimeout(TimeCreateEditor);
        // clearTimeout(TimeEditorLoaded);
    }

    //state 改变之后调用的函数
    async componentDidUpdate() {
        scriptAction();

    }

    //props中的值发生改变时执行
    async componentWillReceiveProps(nextProps) {

    }

    state = {
        commentLoad: 0,
        snipperLoaded: false,
        editorFileLoaded: false,
        editorLoaded: false,
        addCommenting: false,
        commentItem: [],
        commentJSON: {},
        fa_id: "0",
    }

    async createEditor(_this: any) {
        if (!window.editormd) {
            TimeCreateEditor = setTimeout(() => {
                _this.createEditor(_this);
            }, 10);
            return;
        }
        let id = "comment-editormd-" + _this.props.article_id;
        await _this.setState({ editorFileLoaded: true });
        window.editor = window.editormd(id, {
            width: "100%",
            height: '540',
            path: CONFIG.cdnHost + '/editor.md/lib/',
            toolbarIcons : function() {
                return [
                    "undo", "redo", "|",
                    "bold", "del", "italic", "quote", "table", "image", "|",
                    "preview", "help", "options",
                ]
            },
            imageUpload: true,
            uploadURL: CONFIG.editor.uploadURL,
            uploadToken: window.localStorage.wikiAuthToken,
            texHostUrl: CONFIG.editor.texHostUrl,
            texTargetUrl: CONFIG.editor.texTargetUrl,
            imageLazyLoad: CONFIG.editor.imageLazyLoad,
            onload: function () {
                TimeEditorLoaded = setTimeout(() => {
                    _this.setState({
                        editorLoaded: true, 
                    })
                }, 200);
            }
        });
    }

    constructor(props: any) {
        super(props);
    };

    async addComment() {
        this.setState({ addCommenting: true, });
        let article_id = this.props.article_id;
        let fa_id = this.state.fa_id;
        let markdown = window.editor.getMarkdown();
        let html = window.editor.getPreviewedHTML();
        let response = await comment.add({
            article_id: article_id,
            fa_id: fa_id,
            markdown: markdown,
            html: html,
        });
        if (!response || response.status != '1') {
            message.error(response.message || "评论失败！");
            this.setState({addCommenting: false});
        } else {
            message.success("评论成功!");
            this.setState({ commentLoad: this.state.commentLoad + 1, });
            getComment(this, this.props.article_id);
            window.editor.setMarkdown("");
            this.setState({ fa_id: 0});
            this.setState({ addCommenting: false});
        }
    }

    render() {
        return (
            <>
                <div>
                        <div style={{
                        }}>
                            <div className='m-title' style={{
                            }}>
                                <a name="add-comment"></a>
                                评论({this.state.commentItem.length}条)
							</div>
                            <hr />

                            {this.state.editorFileLoaded == false &&
                                <div style={{
                                    width: '100%',
                                    marginTop: 50,
                                    minHeight: 240,
                                    textAlign: 'center'
                                }}>
                                    <Spin size="default" tip="编辑器加载中..."></Spin>
                                </div>
                            }

                            {this.state.editorFileLoaded == true &&
                            <Spin spinning={this.state.addCommenting}>
                                <>
                                
                            {this.state.fa_id != "0" &&

                                <div style={{
                                    marginTop: 10,
                                    marginBottom: 10,
                                }}>

                                    <div style={{
                                        padding: 1,
                                    }} className="markdown-body editormd-html-preview"
                                    >
                                        <details className='note' open>
                                        <summary>
                                        <a href="_blank" href={"#comment-" + this.state.fa_id}>
                                                {"#" + this.state.fa_id}
                                                </a>
                                                &nbsp;&nbsp;
                                            <a target="_blank" href={""}>
                                            {"@" + this.state.commentJSON[this.state.fa_id].username}
                                            </a>
                                            <a style={{
                                                float: 'right',
                                            }} href="#add-comment" onClick={() => {this.setState({fa_id: 0}); }}>取消回复</a>
                                            </summary>
                                            <div dangerouslySetInnerHTML={{ __html: this.state.commentJSON[this.state.fa_id].html }}></div>
                                        </details>
                                    </div>
                                </div>

                            }
                                    
                                    <div id={"comment-editormd-" + this.props.article_id}></div>

                                    {this.state.editorLoaded == true &&
                                    
                                    <Row gutter={[16, 16]}>
                                    
                                    <Col span={6}>
                                    </Col>

                                    <Col span={6}>
                                    </Col>

                                    <Col span={9}>
                                    </Col>

                                    <Col span={3}>
                                        <div style={{
                                            textAlign: 'right'
                                        }}>
                                            <Popconfirm onConfirm={this.addComment.bind(this)} okText="确认" cancelText="取消" title="确认发表评论？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                                                <Button style={{
                                                }} type="primary" size="default" >
                                                    发表评论
                                            </Button>
                                            </Popconfirm>
                                            

                                        </div>

                                    </Col>

                                    </Row>
                                    }
                                </>
                                </Spin>
                            }


                        {(this.state.commentLoad > 0 || this.state.editorLoaded == false) &&
                            <div style={{
                                marginTop: 50,
                                width: '100%',
                                minHeight: 240,
                                textAlign: "center",
                            }}>
                                <Spin size="default" tip="评论加载中..."></Spin>
                            </div>
                        }

                            {this.state.commentLoad == 0 && this.state.commentItem.length > 0 && this.state.editorLoaded == true &&
                                <List
                                    split={true}
                                    className="comment-list"
                                    itemLayout="horizontal"
                                    dataSource={this.state.commentItem}
                                    renderItem={item => (
                                        <li>
                                            <Comment
                                                actions={item.actions}
                                                author={item.author}
                                                avatar={item.avatar}
                                                content={item.content}
                                                datetime={item.datetime}
                                            />
                                        </li>
                                    )}
                                >
                                </List>

                            }

                        </div>
                </div>
            </>

        );
    };

}

export default CustomComment;
