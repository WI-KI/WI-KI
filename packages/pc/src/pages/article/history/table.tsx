import Highlighter from 'react-highlight-words';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Layout, Table, Input, Space, Button, Skeleton, Popconfirm } from 'antd';
import article from '@/models/article';
import CompareModel from './CompareModel';
import Loading from '@/components/Loading';

async function getHistoryList(_this:any, article_id: any) {
    let response = await article.getHistoryList(article_id);
    let tableData = [];
    if (response && response.status == '1') {
        for (var i = 0; i < response.content.length; ++i) {
            let now = response.content[i];
            let item = {
                key: i,
                md_id: now.md_id,
                date: now.date,
                username: now.username,
                length: now.markdown.length,
                action: now.md_id,
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

    getSourceUrl(md_id:any) {
        let { username, team_id, article_id } = this.props;
        if (username) {
            return ["", "user", username, "article", article_id, "source", md_id].join("/");
        } else if (team_id) {
            return ["", "team", team_id, "article", article_id, "source", md_id].join("/");            
        }
    }

    async update() {
        this.setState({ loadNum: this.state.loadNum + 1, });
        getHistoryList(this, this.props.article_id);
    }

    //在组件已经被渲染到 DOM 中后运行
    async componentDidMount() {
        // await this.props.onRef(this);
        this.update();
    }

    //props中的值发生改变时执行 
    async componentWillReceiveProps(nextProps: any) {
        if (this.props.article_id !== nextProps.article_id) {
            this.update();
        }
    }

    constructor(props: any) {
        super(props);
        console.log(this.props);
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
                title: '历史版本编号',
                dataIndex: 'md_id',
                key: 'md_id',
                width: '20%',
                align: 'left',
            },
            {
                title: '日期', 
                dataIndex: 'date',
                key: 'date',
                width: '20%',
                align: 'left',
            },
            {
                title: '长度',
                dataIndex: 'length',
                key: 'length',
                align: 'left',
                width: '20%',
            },
            {
                title: '修改者',
                dataIndex: 'username',
                key: 'username',
                align: 'left',
                width: '20%',
                ...this.getColumnSearchProps('username'),
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                align: 'left',
                width: '20%',
                render: (md_id:any) => (
                    <Space size='middle'>
                    <a href={this.getSourceUrl(md_id)}>查看</a>
                    <CompareModel
                            lid={md_id}
                            username={this.props.username}
                            team_id={this.props.team_id}
                            article_id={this.props.article_id}
                    />
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
                        height: 'calc(100vh - 200px)',
                     }}>
                        <Loading />
                    </div>
                }

                {this.state.loadNum == 0 &&
                    <Table
                        style={{
                            marginTop:20,
                        }}
                        size="small"
                        columns={columns}
                        dataSource={this.state.tableData}
                        pagination={{
                            hideOnSinglePage: true,
                            showQuickJumper: true,
                            showSizeChanger: true,
                            defaultPageSize: 18,
                            pageSizeOptions: ["10", "18", "30", "50", "100"],
                        }}
                    />
                }
            </>
        )
    }
}

export default ArticleTable;