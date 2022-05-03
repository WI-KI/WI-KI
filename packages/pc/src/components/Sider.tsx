import { Menu, Layout, Empty, Skeleton } from 'antd';
import React from 'react';
import { Link, history } from 'umi';
import { HomeOutlined, FileTextOutlined, BarsOutlined } from '@ant-design/icons';
import archives from '@/models/archives';

const { Sider } = Layout;

async function updateState(_this: any, props: any) {
	await _this.setState({
		siderItem: props.siderItem,
		siderCurRoute: props.siderCurRoute,
	});
}

class SiderCustom extends React.Component {

	//在组件已经被渲染到 DOM 中后运行
	async componentDidMount() {
		await updateState(this, this.props);
	}

	//props中的值发生改变时执行
	async componentWillReceiveProps(nextProps: any) {
		if (this.props.siderItem !== nextProps.siderItem ||
			this.props.siderCurRoute !== nextProps.siderCurRoute) {
			await updateState(this, nextProps);
		}
	}

	state = {
		siderItem: [],
		siderCurRoute: "-1",
	}

	constructor(props: any) {
		super(props);
	};

	// handleClick = e => {
	// 	this.setState({
	// 		curRoute: e.key,
	// 	});
	// };

	render() {
		return (
			<Sider width={this.props.width || 240} style={{
				overflow: 'auto',
				background: '#fff',
				padding: 0,
			}}>

				<Menu
					mode="inline"
					theme="light"
					// defaultSelectedKeys={['3']}
					// defaultOpenKeys={['sub1']}
					selectedKeys={[this.state.siderCurRoute]}
					style={{
						height: '100%',
						fontSize: 16,
					}}
				>

					{this.state.siderCurRoute === '-1' &&
						<div style={{ padding: '15px' }}>
							<Skeleton active />
						</div>
					}

					{this.state.siderCurRoute !== '-1' &&
						this.state.siderItem
					}

				</Menu>
			</Sider>
		);
	};

}

export default SiderCustom;



