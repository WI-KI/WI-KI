import Highlighter from 'react-highlight-words';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Layout, Table, Input, Space, Button, Skeleton, Popconfirm, Tooltip } from 'antd';

class TeamTable extends React.Component {

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
    };

    state = {
        searchText: '',
        searchedColumn: '',
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
                title: '团队编号',
                dataIndex: 'team_id',
                key: 'team_id',
                width: '10%',
                align: 'left',
                sorter: (a, b) => a.team_id - b.team_id,
            },
            {
                title: '团队名称',
                dataIndex: 'team_name',
                key: 'team_name',
                width: '15%',
                align: 'left',
                ...this.getColumnSearchProps('team_name'),
            },
            {
                title: '创建者',
                dataIndex: 'username',
                key: 'username',
                align: 'left',
                width: '15%',
                ...this.getColumnSearchProps('username'),                
            },
            {
                title: '创建时间',
                dataIndex: 'datetime',
                key: 'datetime',
                align: 'left',
                width: '15%',
                sorter: (a, b) => new Date(a.datetime) - new Date(b.datetime),
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                align: 'left',
                width: '15%',
                render: (item: any) => (
                    <>
                    <Space size='middle'>
                    {item.hasPrivilege &&
                    <a href={"/team/manage/" + item.team_id}>管理</a>
                    }
                    <a href={["", "team", item.team_id, "archives", "edit", "0"].join("/")}>档案管理</a>
                    <a href={["", "team", item.team_id, "archives", "details", "0"].join("/")}>档案查看</a>
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

export default TeamTable;