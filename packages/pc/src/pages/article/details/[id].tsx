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
import LazyLoad from 'react-lazyload';

const { Content } = Layout;

const MathFont = [
`@font-face /* 0 */ {
  font-family: MJXZERO;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Zero.woff") format("woff");
}`,
`@font-face /* 1 */ {
  font-family: MJXTEX;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Main-Regular.woff") format("woff");
}`,
`@font-face /* 2 */ {
  font-family: MJXTEX-B;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Main-Bold.woff") format("woff");
}`,
`@font-face /* 3 */ {
  font-family: MJXTEX-I;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Math-Italic.woff") format("woff");
}`,
`@font-face /* 4 */ {
  font-family: MJXTEX-MI;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Main-Italic.woff") format("woff");
}`,
`@font-face /* 5 */ {
  font-family: MJXTEX-BI;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Math-BoldItalic.woff") format("woff");
}`,
`@font-face /* 6 */ {
  font-family: MJXTEX-S1;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size1-Regular.woff") format("woff");
}`,
`@font-face /* 7 */ {
  font-family: MJXTEX-S2;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size2-Regular.woff") format("woff");
}`,
`@font-face /* 8 */ {
  font-family: MJXTEX-S3;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size3-Regular.woff") format("woff");
}`,
`@font-face /* 9 */ {
  font-family: MJXTEX-S4;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size4-Regular.woff") format("woff");
}`,
`@font-face /* 10 */ {
  font-family: MJXTEX-A;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_AMS-Regular.woff") format("woff");
}`,
`@font-face /* 11 */ {
  font-family: MJXTEX-C;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Calligraphic-Regular.woff") format("woff");
}`,
`@font-face /* 12 */ {
  font-family: MJXTEX-CB;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Calligraphic-Bold.woff") format("woff");
}`,
`@font-face /* 13 */ {
  font-family: MJXTEX-FR;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Fraktur-Regular.woff") format("woff");
}`,
`@font-face /* 14 */ {
  font-family: MJXTEX-FRB;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Fraktur-Bold.woff") format("woff");
}`,
`@font-face /* 15 */ {
  font-family: MJXTEX-SS;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_SansSerif-Regular.woff") format("woff");
}`,
`@font-face /* 16 */ {
  font-family: MJXTEX-SSB;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_SansSerif-Bold.woff") format("woff");
}`,
`@font-face /* 17 */ {
  font-family: MJXTEX-SSI;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_SansSerif-Italic.woff") format("woff");
}`,
`@font-face /* 18 */ {
  font-family: MJXTEX-SC;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Script-Regular.woff") format("woff");
}`,
`@font-face /* 19 */ {
  font-family: MJXTEX-T;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Typewriter-Regular.woff") format("woff");
}`,
`@font-face /* 20 */ {
  font-family: MJXTEX-V;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Vector-Regular.woff") format("woff");
}`,
`@font-face /* 21 */ {
  font-family: MJXTEX-VB;
  src: url("/editor.md/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Vector-Bold.woff") format("woff");
}`,
];
	
function processHTML(html:any) {
	MathFont.forEach(font => {
		html = html.replace(font, "");
	});
	html = html.replace(/MJXZERO/g, "_____MJXZERO");
	html = html.replace(/MJXTEX/g, "_____MJXTEX");
	return html;
}

function scriptAction() {
	window.ScriptAction.gao();
}

async function getParent(_this: any, article_id: any, archives_id: any, username: any, team_id: any) {
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
    if (response && response.status == "1") {
        for (let i = 0; i < response.content.length; ++i) {
            let item = response.content[i];
            let key = getKey((i + 1).toString());
            siderItem.push(getSiderItem(key, item.archives_id, item.title));
        }
    }
    _this.setState({
        siderItem: siderItem,
    });
    getArticle(_this, article_id, archives_id, username, team_id);
}

const getArticleKey = (i: any) => {
	return ["child", "article", i].join("-");
};

async function getArticle(_this: any, article_id: any, archives_id: any, username: any, team_id: any, ) {
	const getUrl = (article_id:any) => {
        if (username) {
            return ["", "user", username, "article", "details", article_id].join("/");
        } else if (team_id) {
            return ["", "team", team_id, "article", "details", article_id].join("/");
        }
    }
    const getSiderItem = (key: any, article_id: any, title: any) => {
        return (
			<Menu.Item key={key} style={{
				fontSize: 16,
			}}
				icon={<FileTextOutlined />}
			>
				{title.length >= 14 &&
					<Tooltip placement="bottomLeft" title={title}>
					<Link to={getUrl(article_id)}>
						{title}
					</Link>
					</Tooltip>
				}

				{title.length < 14 &&
					<Link to={getUrl(article_id)}>
						{title}
					</Link>
				}
				

			</Menu.Item>              
        )
    };
    let response = null;
    if (username) response = await article.getChildByUser(username, archives_id);
    else if (team_id) response = await article.getChildByTeam(team_id, archives_id);
	let siderItem = _this.state.siderItem;
	let siderCurRoute = "-1";
    if (siderItem.length > 0 && response && response.status == "1" && response.content.length > 0) siderItem.push(( <hr key={"archives"} />));
    if (response && response.status == "1") {
        for (let i = 0; i < response.content.length; ++i) {
            let item = response.content[i];
            let key = getArticleKey(item.article_id);
			siderItem.push(getSiderItem(key, item.article_id, item.title));
			if (article_id == item.article_id) {
				siderCurRoute = getArticleKey(item.article_id);
			}
        }
    }
    _this.setState({
		siderItem: siderItem,
		siderCurRoute: siderCurRoute,
    });
}

async function getHTML(_this: any, article_id: any, username: any, team_id: any) {
	let response:any = await article.get(article_id);
	if (response && response.status == "1") {
		if (_this.state.siderItem.length == 0) {
			getParent(_this, article_id, response.content.archives_id, username, team_id);
		}
		response.content.html = processHTML(response.content.html);
		await _this.setState({
			loadNum: _this.state.loadNum - 1,
			content: response.content,
		});
		scriptAction();
	}
}

class Details extends React.Component {

	async update(article_id:any, username: any, team_id: any) {
		this.setState({
			loadNum: this.state.loadNum + 1,
		});
		getHTML(this, article_id, username, team_id);
	}

	getUrl() {
		let { article_id, username, team_id } = this.props.match.params;
		if (username) return [CONFIG.host, "user", username, "article", "details", article_id].join("/");
		if (team_id) return [CONFIG.host, "team", team_id, "article", "details", article_id].join("/");
	}

	//在组件已经被渲染到 DOM 中后运行
	async componentDidMount() {
		let { article_id, username, team_id } = this.props.match.params;
		dynamicLoad.loadCSS(CONFIG.cdnHost + "/editor.md/css/editormd.min.css");
		let _this = this;
		dynamicLoad.loadScript(CONFIG.cdnHost + "/editor.md/lib/../js/plugins.min.js", function(){
			_this.setState({ snipperLoaded: true});
			_this.update(article_id, username, team_id);
			dynamicLoad.loadScript(CONFIG.cdnHost + "/editor.md/js/editormd.min.js", function(){
				_this.setState({ editorLoaded: true});
			})
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
		if (this.props.match.params.article_id != nextProps.match.params.article_id) {
			let { article_id, username, team_id } = nextProps.match.params;
			let siderCurRoute = getArticleKey(article_id);
			this.setState({
				siderCurRoute: siderCurRoute,
			});			
			this.update(article_id, username, team_id);
		}
	}

	state = {
		content: {},
		loadNum: 0,
		snipperLoaded: false,
		editorLoaded: false,
		siderItem: [],
		siderCurRoute: "-1",
	}

	constructor(props: any) {
		super(props);
	};

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
						// maxHeight: 'calc(100vh - 50px)',
						maxHeight: 'calc(100vh)',
					}}>

							<Sider
								siderItem={this.state.siderItem}
								siderCurRoute={this.state.siderCurRoute}
							/>

						<Content style={{
							overflow: 'auto',
						}}>


							{(this.state.loadNum > 0 || this.state.snipperLoaded == false) &&
								<div style={{ padding: '15px' }}>
									<Skeleton active />
								</div>
							}

								{(this.state.loadNum === 0 && this.state.snipperLoaded == true) &&
								<>
									<div style={{
									}}>

										<div className='m-title' style={{
											paddingLeft: 16,
											paddingRight: 16,
											paddingTop: 12,
										}}>
											<span>{this.state.content.title}</span>
										</div>

										<div className='m-asset-meta' style={{
											paddingLeft: 16,
											paddingRight: 16
										}}>
											<span>日期：{this.state.content.date}</span>
										</div>

										<div style={{ paddingTop: 10, }} className="markdown-body editormd-html-preview"
											dangerouslySetInnerHTML={{ __html: this.state.content.html }}
										>
										</div>

										<div className="m-asset-footer" style={{
										}}>
											<ul>
												<li>版权声明：本文章遵循 <a href="http://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener"> CC 4.0 BY-SA </a> 版权协议，转载请附上原文出处链接和本声明。</li>
												<li>本文链接：<a href={this.getUrl()} target="_blank" rel="noopener">{this.getUrl()}</a> </li>
												<li>发表日期： {this.state.content.date}</li>
												<li>作者: {this.state.content.username ? this.state.content.username : this.state.content.team_name + "(#" + this.state.content.team_id + ")"}</li>
											</ul>
										</div>

									{this.state.editorLoaded == true &&
									 <LazyLoad height={540} once scroll overflow>
										<div style={{
											paddingLeft: 16,
											paddingRight: 16
										}}>
											<Comment article_id={this.props.match.params.article_id} />

										</div>
										</LazyLoad>


									}

									<div style={{
										height: '100vh',
									}}>
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

export default Details;
