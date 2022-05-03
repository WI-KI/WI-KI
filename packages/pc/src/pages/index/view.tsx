import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from '@/components/BasicLayout';
import { Layout, Menu, Result, Button, Skeleton, Tooltip, Spin } from 'antd';
import Sider from '@/components/Sider';
import article from '@/models/article';
import archives from '@/models/archives';
import dynamicLoad from '@/utils/dynamicLoad';
import { Link } from 'umi';
import CONFIG from "@/../../config-client";
import { HomeOutlined, BarsOutlined, FileTextOutlined } from '@ant-design/icons';
import Comment from './Comment';
import Loading from '@/components/Loading';

const { Content } = Layout;

function scriptAction() {
    window.ScriptAction.gao();
}

async function getHTML(_this: any, article_id: any) {
    let response = await article.get(article_id);
    if (response && response.status == "1") {
        await _this.setState({
            loadNum: _this.state.loadNum - 1,
            content: response.content,
        });
        scriptAction();
    }
}

class Details extends React.Component {

    async update(article_id: any) {
        this.setState({
            loadNum: this.state.loadNum + 1,
        });
        getHTML(this, article_id);
    }

    //在组件已经被渲染到 DOM 中后运行
    async componentDidMount() {
        let article_id = this.props.article_id;
        dynamicLoad.loadCSS(CONFIG.cdnHost + "/editor.md/css/editormd.min.css");
        let _this = this;
        dynamicLoad.loadScript(CONFIG.cdnHost + "/editor.md/lib/../js/plugins.min.js", function () {
            _this.setState({ snipperLoaded: true });
            _this.update(article_id); 
        });
    }

    //在组件被移除后运行
    componentWillMount() {

    }

    //state 改变之后调用的函数
    async componentDidUpdate() {

    }

    //props中的值发生改变时执行
    async componentWillReceiveProps(nextProps) {
        if (this.props.article_id != nextProps.article_id) {
            this.update(nextProps.article_id);
        }
    }

    state = {
        content: {},
        loadNum: 0,
        snipperLoaded: false,
        editorLoaded: false,
    }

    constructor(props: any) {
        super(props);
    };

    render() {
        return (
            <>
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

                        {(this.state.loadNum > 0 || this.state.snipperLoaded == false) &&
                            <div style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: 'calc(100vh - 50px)'
                                }}>
                                <Loading  />
                            </div>
                        }

                        {(this.state.loadNum === 0 && this.state.snipperLoaded == true) &&
                            <>
                                <div style={{
                                    // width: '1338px',
                                    // overflow: 'auto',
							        marginLeft: -10,
                                    
                                }}>
                                    <div style={{ paddingTop: 10, }} className="markdown-body editormd-html-preview"
                                        dangerouslySetInnerHTML={{ __html: this.state.content.html }}
                                    >
                                    </div>

                                    <div style={{ height: '50vh' }}></div> 
                                </div>
                            </>
                        }
                    </Content>
                </Layout>
            </>
        );
    };

}

export default Details;
