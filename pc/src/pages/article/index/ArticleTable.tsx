import Highlighter from 'react-highlight-words';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Layout, Table, Input, Space, Button, Skeleton, Popconfirm, Tooltip } from 'antd';


class ArticleTable extends React.Component {

    getArticleUrl(username: any, team_id: any, article_id: any) {
        if (username) {
            return ["", "user", username, "article", "details", article_id].join("/");
        } else if (team_id) {
            return ["", "team", team_id, "article", "details", article_id].join("/");
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
                width: '15%',
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
                        <Tooltip title="查看文章">
                            <Button
                                // type="primary"
                                size="small"
                                href={this.getArticleUrl(item.username, item.team_id, item.article_id)}
                                icon={
                                    <svg t="1591981901344" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3395" width="20" height="20"><path d="M439.8 748.5c-175.1 0-317.6-142.5-317.6-317.6 0-175.1 142.5-317.6 317.6-317.6s317.6 142.5 317.6 317.6c0 175.2-142.5 317.6-317.6 317.6z m0-593.4C287.7 155.1 164 278.8 164 430.9c0 152.1 123.7 275.9 275.8 275.9 152.1 0 275.9-123.7 275.9-275.9-0.1-152.1-123.8-275.8-275.9-275.8z" fill="#515151" p-id="3396"></path><path d="M238.8 460.7c-0.3-4.8-0.4-9.6-0.4-14.4 0-92.3 54.3-176.6 138.4-214.8l17.3 38c-69.3 31.5-114 100.9-114 176.8 0 4 0.1 7.9 0.4 11.9l-41.7 2.5z" fill="#F74F4F" p-id="3397"></path><path d="M870.3 910.7L856.4 897 618.7 659.4l31.5-27.6 14 13.7 237.6 237.6z" fill="#515151" p-id="3398"></path></svg>
                                }
                            >
                            </Button>
                        </Tooltip>
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
                        defaultPageSize: 16,
                        pageSizeOptions: ["10", "16", "30", "50", "100"],
                    }}
                />
            </>
        )
    }
}

export default ArticleTable;