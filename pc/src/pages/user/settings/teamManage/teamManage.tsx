import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from '@/components/BasicLayout';
import { Layout, Menu, Spin, Input, Radio, message, Button, Space } from 'antd';
import request from 'umi-request';
import { history } from 'umi';
import Loading from '@/components/Loading';
import team from '@/models/team';
import TeamTable from './teamTable';
import AddTeamModel from './AddTeamModel';
import JoinTeamModel from './JoinTeamModel';
import moment from 'moment';

const { Content } = Layout;
const { Search } = Input;

async function getMy(_this: any) {
	let response = await team.getMy();
	let tableData = [];
	if (response && response.status == "1") {
		for (var i = 0; i < response.content.length; ++i) {
			let now = response.content[i];
			let item = {
				key: i,
				team_id: now.team_id,
				team_name: now.team_name,
				username: now.username,
                datetime: moment(now.datetime).format("YYYY-MM-DD"),
				action: now,
				hasPrivilege: now.hasPrivilege,
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

                            <Space>
                                <AddTeamModel callback={this.update.bind(this)}/>
								<JoinTeamModel />
                            </Space>

                            <div style={{paddingTop: 10}}>

                            <TeamTable  tableData={this.state.tableData} />
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
