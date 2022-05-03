import React from 'react';
import BasicLayout from '@/components/BasicLayout';
import { Layout, Menu, Spin, Input, Radio } from 'antd';

function getYear(startYear:string) {
	let CurYear:any = (new Date()).getFullYear();
	if (parseInt(CurYear) > parseInt(startYear)) {
		CurYear = [startYear, "-", CurYear];
	}
	return CurYear;
}

class Index extends React.Component {

	//在组件已经被渲染到 DOM 中后运行
	componentDidMount() {

	}

	constructor(props: any) {
		super(props);
	};

	state = {

	};

	render() {
		return (
			<>
				<BasicLayout
					noheader={this.props.location.query.noheader}
					width={"1440"}
					headerCurRoute="/"
				>
					<Layout style={{
						marginTop: '0px',
						padding: '0px 0',
						background: '#fff',
						// backgroundColor: '#e5fffb',
						minHeight: 'calc(100vh - 50px)',
						maxHeight: 'calc(100vh - 50px)',
					}}
					>
						<div className="g-sys">
							<div className="g-main">
								<div style={{width: '1440px', height: 220, backgroundColor: '#e5fffb', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<span className="noselect" style={{fontSize: 218, color: '#2c3e50', fontFamily: 'sans-serif' }}>WI-KI</span>
								</div>
								<div className="g-btnList">
								<div className="g-btn" style={{width: 122, height: 40, fontFamily: 'Georgia', fontWeight: 500,}}onClick={() => {location.href = "/user/Dup4/article/details/4";}}>GO →</div>
								</div>
							</div>
							<div className="g-footer">
								<span>Contact：<a href="mailto:admin@wi-ki.top">admin@wi-ki.top</a></span>
								<span>{getYear("2020")}@All Rights Researved
								{window.location.hostname.split(".").slice(-2).join(".") === "wi-ki.top" &&
								<>
								&nbsp;&nbsp;<a href="http://beian.miit.gov.cn/">浙ICP备20011170号</a>
								</>
								}
								</span>
							</div>
						</div>
					</Layout>
				</BasicLayout>
			</>
		);
	};
}

export default Index;
