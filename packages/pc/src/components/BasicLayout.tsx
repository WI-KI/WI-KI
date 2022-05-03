import React from 'react';
import ReactDOM from 'react-dom';
import Header from '@/components/Header';
import archives from '@/models/archives';
import '../pages/main.less';
import CONFIG from '../../../config-client';
import Loading from '@/components/Loading';
import { Menu } from 'antd';
import { Link } from 'umi';

class BasicLayout extends React.Component {

	//在组件已经被渲染到 DOM 中后运行
	async componentDidMount() {
	}

	constructor(props: any) {
		super(props);
		let item = [CONFIG.indexTitle, "USER", "TEAM", "ARCHIVES", "ARTICLE"];
		let router = ["/", "/user", "/team", "/archives", "/article"];
		let headItemList = [];
		for (let i = 0; i < router.length; ++i) {
			headItemList.push(
				<Menu.Item key={router[i]} >
					<Link to={router[i]}>
						{item[i]}
					</Link>
				</Menu.Item>
			);
		}
		let token = window.localStorage.wikiAuthToken;
		if (token && token != "") {
			headItemList.push(
				<Menu.Item style={{float: 'right', }} key={"/user/settings"} >
					<Link to={"/user/settings"}>
						{"SETTINGS"}
					</Link>
				</Menu.Item>				
			);
		} else {
			headItemList.push(
				<Menu.Item style={{float: 'right', }} key={"/user/login"} >
					<Link to={"/user/login"}>
						{"ENTER"}
					</Link>
				</Menu.Item>				
			);		
		}
		this.state.headItemList = headItemList;
	};

	state = {
		item: [],
		router: [],
		headItemList: [],
	}

	render() {
		return (
			<>
				<div style={{
					backgroundColor: '#e6fffb',
					minHeight: 'calc(100vh)',
				}}>
					<div className="g-width-fit" style={{
						maxWidth: (this.props.width || 1440) + "px",
						margin: 'auto',
					}}
					>
						<>
							<Header
								headItemList={this.state.headItemList}
								headerCurRoute={this.props.headerCurRoute}
							>
							</Header>
							{this.props.children}
						</>
					</div>
				</div>
			</>
		);
	};

}

export default BasicLayout;

