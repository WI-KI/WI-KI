import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from '@/components/BasicLayout';
import { Layout, Menu, Spin, Input, Radio, message, Space, Form, Button } from 'antd';
import request from 'umi-request';
import { history } from 'umi';
import Loading from '@/components/Loading';
import team from '@/models/team';
import moment from 'moment';
import TeamMemberTable from './TeamMemberTable';

const { Content } = Layout;
const { Search } = Input;

async function getSingle(_this: any, team_id: any) {
	let response = await team.getSingle(team_id);
	let teamMemberTableData = [];
	if (response && response.status == "1") {
		for (var i = 0; i < response.teamMember.length; ++i) {
			let now = response.teamMember[i];
			let Pedding = (<div style={{ display: 'flex', alignItems: 'center' }}><div style={{ color: '#2f54eb' }}>Pending</div></div>);
			let Accepted = (<div style={{ display: 'flex', alignItems: 'center' }}><div style={{ color: '#5b8c00' }}>Accepted</div></div>);
			let item = {
				key: i,
				username: now.username,
				avatar: (
					<img width="32" height="32" src={now.imgUrl + "&s=32"} />
				),
				name: now.name,
				school: now.school,
				email: now.email,
				status: now.status,
				datetime: moment(now.datetime).format("YYYY-MM-DD"),
				action: now,
			};
			teamMemberTableData.push(item);
		}
	}
	let teamInfo = response.info;
	if (teamInfo && teamInfo.datetime) teamInfo.datetime = moment(teamInfo.datetime.toString()).format("YYYY-MM-DD");
	await _this.setState({
		teamInfo: teamInfo,
		teamMemberTableData: teamMemberTableData,
		loading: _this.state.loading - 1,
	});
}

class Index extends React.Component {

	update() {
		this.setState({ loading: this.state.loading + 1, });
		getSingle(this, this.props.match.params.id);
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
		teamMemberTableData: [],
		teamInfo: {},
	}

	render() {
		return (
			<>
				<BasicLayout
					headerCurRoute="/team"
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

								<Space>
									<Form
										name="basic"
										initialValues={{
											team_id: this.state.teamInfo.team_id,
											team_name: this.state.teamInfo.team_name,
											datetime: this.state.teamInfo.datetime,
											username: this.state.teamInfo.username,
										}}
										onFinish={async (values:any) => {
											values.team_id = this.props.match.params.id;
											let response = await team.update(values);
											if (response && response.status == "1") {
												message.success(response.message || "修改成功！");
											} else {
												message.error(response.message || "修改失败！");
											}
										}}
									>

										<Space>

										<Form.Item
												label="团队编号"
												name="team_id"
											>
												<Input disabled />
											</Form.Item>


											<Form.Item
												label="团队名称"
												name="team_name"
											>
												<Input />
											</Form.Item>

											<Form.Item
												label="创建日期"
												name="datetime"
											>
												<Input disabled
												/>
											</Form.Item>

											<Form.Item
												label="创建者"
												name="username"
											>
												<Input disabled
												/>
											</Form.Item>

											<Form.Item>
												<Button type="default" size="small" htmlType="submit">
													保存
                                                </Button>
											</Form.Item>
										</Space>
									</Form>
								</Space>

								<TeamMemberTable tableData={this.state.teamMemberTableData} team_id={this.props.match.params.id} update={this.update.bind(this)} />
							</div>

						</Layout>
					}
				</BasicLayout>

			</>
		);
	};
}

export default Index;
