import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from '@/components/BasicLayout';
import { Layout, Menu, Spin, Input, Radio, message } from 'antd';
import request from 'umi-request';
import { history } from 'umi';
import Loading from '@/components/Loading';
import user from '@/models/user';
import UserTable from './userTable';
import moment from 'moment';

const { Content } = Layout;
const { Search } = Input;

function getAll(_this:any) {
	user.getAll(async function(response:any) {
		let tableData = [];
		if (response && response.status == "1") {
			for (var i = 0; i < response.content.length; ++i) {
				let now = response.content[i];
				let item = {
					key: i,
					username: now.username,
					avatar: (
						<img width="32" height="32" src={now.imgUrl + "&s=32"} />
					),
					name: now.name,
					school: now.school,
					email: now.email,
					datetime: moment(now.datetime).format("YYYY-MM-DD"),
					action: now,					
				};
				tableData.push(item);
			}
			_this.setState({
				tableData: tableData,
			});
		} 
		await _this.setState({
			loading: _this.state.loading - 1,
		});
	});
}

class Index extends React.Component {

	//在组件已经被渲染到 DOM 中后运行
	async componentDidMount() {
		await this.setState({ loading: this.state.loading + 1, });
		getAll(this);
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
				<BasicLayout
					headerCurRoute="/user"
				>

					{this.state.loading > 0 &&
						<>
							<div style={{
								height: 'calc(100vh)',
								backgroundColor: '#fff',
								maxHeight: 'calc(100vh - 50px)',
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
								overflow: 'auto'
							}}>

							<UserTable tableData={this.state.tableData} />
							</div>

						



						</Layout>
					}
				</BasicLayout>

			</>
		);
	};
}

export default Index;
