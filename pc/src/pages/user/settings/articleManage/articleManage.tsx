import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from '@/components/BasicLayout';
import { Layout, Menu, Spin, Input, Radio, message, Button, Space } from 'antd';
import Loading from '@/components/Loading';
import article from '@/models/article';
import ArticleTable from './ArticleTable';
import moment from 'moment';

const { Content } = Layout;
const { Search } = Input;

async function getMy(_this: any) {
	let response = await article.getMy();
	let tableData = [];
	if (response && response.status == "1") {
		for (var i = 0; i < response.content.length; ++i) {
			let now = response.content[i];
			let item = {
                key: i,
                article_id: now.article_id,
                title: now.title,
                date: now.date,
				username: now.username || "-",
				team: now.team_id ? (now.team_name + "(#" + now.team_id + ")") : "-",
				status: now.locked ? "私有" : "公开",
				comment_num: now.comment_num,
                action: now,
			};
			tableData.push(item);
		}
	}
	_this.setState({
        tableData: tableData,
		loading: _this.state.loading - 1,
	});
}

class TeamManage extends React.Component {

    update() {
		this.setState({ loading: this.state.loading + 1, });
		getMy(this);
    }

	//在组件已经被渲染到 DOM 中后运行
	async componentDidMount() {
        this.update();
	}

	constructor(props: any) {
		super(props);
	};

	state = {
		loading: 0,
		tableData: [],
	}

	render() {
		return (
			<>
				<Layout
					
				>

					{this.state.loading > 0 &&
						<>
							<div style={{
								height: 'calc(100vh)',
								backgroundColor: '#fff',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
								<Loading />
							</div>
						</>
					}

					{this.state.loading == 0 &&
						<Layout style={{
							marginTop: '0px',
							padding: '0px 0',
							background: '#fff',
							minHeight: 'calc(100vh - 50px)',
                            maxHeight: 'calc(100vh - 50px)',
						}}
						>

							<div style={{
                                margin: 10,
                                overflow: 'auto',
							}}>

                            <div style={{paddingTop: 10}}>

                            <ArticleTable  tableData={this.state.tableData} />
                            </div>
								
							</div>

						</Layout>
					}
				</Layout>

			</>
		);
	};
}

export default TeamManage;
