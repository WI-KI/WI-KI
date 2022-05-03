import Highlighter from 'react-highlight-words';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Layout, Table, Input, Space, Button, Skeleton, Popconfirm } from 'antd';
import article from '@/models/article';
import Loading from '@/components/Loading';

async function getArticle(_this: any, username: any, team_id: any, archives_id: any) {
    let tableData = [];
    let response = {};
    if (username) response = await article.getChildByUser(username, archives_id);
    else if (team_id) response = await article.getChildByTeam(team_id, archives_id);
    if (response && response.status == '1') {
        for (let i = 0; i < response.content.length; ++i) {
            let now = response.content[i];
            let item = {
                key: i,
                article_id: now.article_id,
                title: now.title,
                date: now.date,
                status: now.locked == 1 ? '未发布' : '已发布',
                action: now.article_id,
            };
            tableData.push(item);
        }
    }
    _this.setState({
        loadNum: _this.state.loadNum - 1,
        tableData: tableData,
    });
}

class ArticleTable extends React.Component {

    getArticleUrl(article_id: any, type: any) {
        let { username, team_id, archives_id } = this.props;
        if (username) {
            return ["", "user", username, "article", type, article_id].join("/");
        } else if (team_id) {
            return ["", "team", team_id, "article", type, article_id].join("/"); 
        } else {
            return "";
        }
    }

    async update(props: any) {
        props = props || this.props;
        let { username, team_id, archives_id } = props;
        this.setState({ loadNum: this.state.loadNum + 1, });
        await getArticle(this, username, team_id, archives_id);
    }

    //在组件已经被渲染到 DOM 中后运行
    async componentDidMount() {
        await this.props.onRef(this);
        await this.update(this.props);
    }

    //props中的值发生改变时执行 
    async componentWillReceiveProps(nextProps: any) {
        if (this.props.archives_id !== nextProps.archives_id) {
            await this.update(nextProps);
        }
    }

    constructor(props: any) {
        super(props);
    };

    state = {
        loadNum: 0,
        searchText: '',
        searchedColumn: '',
        tableData: [],
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
                sorter: (a, b) => parseInt(a.article_id) - parseInt(b.article_id),
            },
            {
                title: '文章标题',
                dataIndex: 'title',
                key: 'title',
                width: '50%',
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
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                align: 'left',
                width: '10%',
                filters: [
                    {
                        text: '已发布',
                        value: '已发布',
                    },
                    {
                        text: '未发布',
                        value: '未发布',
                    }
                ],
                onFilter: (value, record) =>  record.status == value,
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                align: 'left',
                width: '20%',
                render: (article_id:any) => (
                    <Space size='middle'>
                    <a href={this.getArticleUrl(article_id, "details")}>查看</a>
                    <a href={this.getArticleUrl(article_id, "edit")}>编辑</a>
                    {/* <Popconfirm
                            title={"确认删除文章" + article_id + "吗？"}
                            onConfirm={() => { }}
                            onCancel={() => { }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <a href="#">删除</a>
                        </Popconfirm> */}
                    </Space>
                ),
            },
        ];
        return (
            <>
                {this.state.loadNum > 0 &&
                    <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // height: 'calc(100vh - 100px)',
                    }}>
                        <Loading />
                    </div>
                }

                {this.state.loadNum == 0 &&
                    <Table
                        style={{
                            marginTop:12,
                        }}
                        size="small"
                        columns={columns}
                        dataSource={this.state.tableData}
                        pagination={{
                            hideOnSinglePage: true,
                            showQuickJumper: true,
                            showSizeChanger: true,
                            defaultPageSize: 15,
                            pageSizeOptions: ["10", "15", "30", "50", "100"],
                        }}
                    />
                }
            </>
        )
    }
}

export default ArticleTable;