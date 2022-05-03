import Highlighter from 'react-highlight-words';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Layout, Table, Input, Space, Button, Skeleton, Popconfirm, Tooltip } from 'antd';

class ArchivesTable extends React.Component {

    getArchivesUrl(archives_id: any, username: any, team_id: any, type: any) {
        if (username) {
            return ["", "user", username, "archives", type, archives_id].join("/");
        } else if (team_id) {
            return ["", "team", team_id, "archives", type, archives_id].join("/");
        } else {
            return "";
        }
    }

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
                title: '档案编号',
                dataIndex: 'archives_id',
                key: 'archives_id',
                width: '10%',
                align: 'left',
                sorter: (a, b) => a.archives_id - b.archives_id,
            },
            {
                title: '档案名称',
                dataIndex: 'archives_name',
                key: 'archives_name',
                width: '15%',
                align: 'left',
                ...this.getColumnSearchProps('archives_name'),
            },
            {
                title: '所属用户',
                dataIndex: 'username',
                key: 'username',
                align: 'left',
                width: '15%',
                ...this.getColumnSearchProps('username'),                
            },
            {
                title: '所属团队',
                dataIndex: 'team',
                key: 'team',
                align: 'left',
                width: '15%',
                ...this.getColumnSearchProps('team'),                
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
                    <a href={this.getArchivesUrl(item.archives_id, item.username, item.team_id, "edit")}>管理</a>
                    <a href={this.getArchivesUrl(item.archives_id, item.username, item.team_id, "details")}>查看</a>
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

export default ArchivesTable;