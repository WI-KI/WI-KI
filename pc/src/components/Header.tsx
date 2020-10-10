import { Menu, Layout } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'umi';

const { SubMenu } = Menu;

async function getHeadList(_this: any, item: any, router: any, headerCurRoute: any) {
	let itemList = [];
	for (let i = 0; i < router.length; ++i) {
		// console.log(router[i].split('/').pop());
		itemList.push(
			<Menu.Item style={{float:'right', }} key={router[i]} >
				<Link to={router[i]}>
					{item[i]}
				</Link>
			</Menu.Item>
		);
	}
	await _this.setState({
		headerCurRoute: headerCurRoute.toString(),
		itemList: itemList,
	});
	// console.log(_this.state.curRoute);
}

class Header extends React.Component {

	//在组件已经被渲染到 DOM 中后运行
	componentDidMount() {
		// getHeadList(this, this.props.item, this.props.router, this.props.headerCurRoute);
	}

	//props中的值发生改变时执行
	componentWillReceiveProps(nextProps: any) {
		// if (this.props.item !== nextProps.item ||
		// 	this.props.router !== nextProps.router ||
		// 	this.props.headerCurRoute !== nextProps.headerCurRoute) {
		// 	getHeadList(this, nextProps.item, nextProps.router, nextProps.headerCurRoute);
		// }
	}

	state = {
		
	}

	constructor(props: any) {
		super(props);

	};

	handleClick = e => {
		this.setState({
			headerCurRoute: e.key,
		});
	};

	render() {
		return (
			<Menu theme='dark'
				onClick={this.handleClick}
				selectedKeys={[this.props.headerCurRoute]}
				mode="horizontal"
				style={{
					marginTop: '0px',
				}}
				>
				{this.props.headItemList}
			</Menu>
		);
	};

}

export default Header;
