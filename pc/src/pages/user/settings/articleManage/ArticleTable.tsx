import Highlighter from 'react-highlight-words';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Layout, Table, Input, Space, Button, Skeleton, Popconfirm, Tooltip } from 'antd';


class ArticleTable extends React.Component {

    getArticleUrl(username: any, team_id: any, article_id: any, type: any) {
        if (username) {
            return ["", "user", username, "article", type, article_id].join("/");
        } else if (team_id) {
            return ["", "team", team_id, "article", type, article_id].join("/");
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
                title: '文章编号',
                dataIndex: 'article_id',
                key: 'article_id',
                width: '10%',
                align: 'left',
                sorter: (a, b) => a.article_id - b.article_id,
            },
            {
                title: '文章标题',
                dataIndex: 'title',
                key: 'title',
                width: '30%',
                align: 'left',
                ...this.getColumnSearchProps('title'),
            },
            {
                title: '日期',
                dataIndex: 'date',
                key: 'date',
                align: 'left',
                width: '10%',
                sorter: (a, b) => new Date(a.date) - new Date(b.date),
            },
            {
                title: '所属用户',
                dataIndex: 'username',
                key: 'username',
                align: 'left',
                width: '10%',
                ...this.getColumnSearchProps('username'),                
            },
            {
                title: '所属团队',
                dataIndex: 'team',
                key: 'team',
                align: 'left',
                width: '10%',
                ...this.getColumnSearchProps('team'),                
            },
            {
                title: '评论数',
                dataIndex: 'comment_num',
                key: 'comment_num',
                align: 'left',
                width: '10%',
                sorter: (a, b) => parseInt(a.comment_num) - parseInt(b.comment_num),
            },
            {
                title: "状态",
                dataIndex: 'status',
                key: 'status',
                align: 'left',
                width: '10%',
                filters: [
                    {
                        text: '公开',
                        value: '公开',
                    },
                    {
                        text: '私有',
                        value: '私有',
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
                    <Space size='middle'>
                    <a href={this.getArticleUrl(item.username, item.team_id, item.article_id, "details")}>查看</a>
                    <a href={this.getArticleUrl(item.username, item.team_id, item.article_id, "edit")}>编辑</a>
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

export default ArticleTable;