import Highlighter from 'react-highlight-words';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Layout, Table, Input, Space, Button, Skeleton, Popconfirm, Tooltip, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import team from '@/models/team';

class TeamMemberTable extends React.Component {

    async update() {
    }

    //在组件已经被渲染到 DOM 中后运行
    async componentDidMount() {
        // await this.props.onRef(this);
    }

    //props中的值发生改变时执行 
    async componentWillReceiveProps(nextProps: any) {
    }

    constructor(props: any) {
        super(props);
        this.state.team_id = this.props.team_id;
    };

    state = {
        searchText: '',
        searchedColumn: '',
        team_id: "0",
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
              </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
              </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                    text
                ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    render() {
        const columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
                width: '10%',
                align: 'left',
                ...this.getColumnSearchProps('username'),
            },
            {
                title: '头像',
                dataIndex: 'avatar',
                key: 'avatar',
                width: '5%',
                align: 'left',
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                align: 'left',
                width: '15%',
                ...this.getColumnSearchProps('name'),                
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
                align: 'left',
                width: '15%',
                ...this.getColumnSearchProps('email'),
            },
            {
                title: '学校',
                dataIndex: 'school',
                key: 'school',
                align: 'left',
                width: '15%',
                ...this.getColumnSearchProps('school'),                
            },
            {
                title: '注册时间',
                dataIndex: 'datetime',
                key: 'datetime',
                align: 'left',
                width: '15%',
                sorter: (a, b) => new Date(a.datetime) - new Date(b.datetime),
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                align: 'left',
                width: '10%',
                render: (status: any) => (
                    <>
                    {status == "0" &&
                        <div style={{ display: 'flex', alignItems: 'center' }}><div style={{color: '#2f54eb'}}>Pending</div></div>
                    }

                    {status == "1" &&
                        <div style={{ display: 'flex', alignItems: 'center' }}><div style={{color: '#5b8c00'}}>Accepted</div></div> 
                    }
                    </>
                ),
                filters: [
                    {
                        text: 'Accepted',
                        value: '1',
                    },
                    {
                        text: 'Pending',
                        value: '0',
                    }
                ],
                onFilter: (value, record) =>  record.status == value,
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                align: 'left',
                width: '15%',
                render: (item: any) => (
                    <>
                        <Space>
                            {item.status == "0" &&
                                <Popconfirm onConfirm={async () => {
                                    let team_id = this.state.team_id;
                                    let username = item.username;
                                    let status = "1";
                                    let response = await team.changeTeamMemberStatus({team_id:team_id, username:username, status:status});
                                    if (response && response.status == "1") {
                                        message.success(response.message || "操作成功！");
                                        this.props.update && this.props.update();
                                    } else {
                                        message.error(response.message || "操作失败！");
                                    }
                                }} okText="确认" cancelText="取消" title="确认通过该队员的申请？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                                    <a href="#">通过</a>
                                </Popconfirm>
                            }
                            <Popconfirm onConfirm={async () => {
                                let team_id = this.state.team_id;
                                let username = item.username;
                                let response = await team.delTeamMember({team_id:team_id, username:username});
                                if (response && response.status == "1") {
                                    message.success(response.message || "操作成功！");
                                    this.props.update && this.props.update(); 
                                } else {
                                    message.error(response.message || "操作失败！"); 
                                }
                            }} okText="确认" cancelText="取消" title="确认请该队员离开？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                                <a href="#">请离</a>
                            </Popconfirm>
                        </Space>
                    </>
                ),
            },
        ];
        return (
            <>
                <Table
                    style={{
                        // marginTop: 20,
                    }}
                    size="small"
                    columns={columns}
                    dataSource={this.props.tableData}
                    pagination={{
                        hideOnSinglePage: true,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        defaultPageSize: 15,
                        pageSizeOptions: ["10", "15", "30", "50", "100"],
                    }}
                />
            </>
        )
    }
}

export default TeamMemberTable;