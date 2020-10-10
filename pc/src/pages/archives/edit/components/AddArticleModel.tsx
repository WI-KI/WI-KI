import React, { Component } from 'react';
import FormModel from '@/components/FormModel';
import { Form, Input, Modal, Button, message } from 'antd';
import article from '@/models/article';

class AddArticleModel extends React.Component {

    constructor(props: any) {
        super(props);
    };

    state = {
        visible: false,
        confirmLoading: false,
    };

    changeVisible = async (status: any) => {
        this.setState({ visible: status });
    }

    changeConfirmLoading = async (status: any) => {
        this.setState({ confirmLoading: status });
    }

    submitMap = async (values: any) => {
        await this.changeConfirmLoading(true); 
        let { username, team_id } = this.props;
        let _this = this;
        let response = {};
        if (username) {
            response = await article.addByUser(values, username);
        } else if (team_id) {
            response = await article.addByTeam(values, team_id);
        }
        await _this.changeVisible(false);
        if (response && response.status === '1') {
            message.success("添加成功！");
        } else {
            message.error("添加失败, 请重试！");
        }
        if (_this.props.callback) {
            _this.props.callback();
        }
    }

    render() {
        return (
            <>
                <Button type="default" size="small" onClick={async () => { 
                    await this.changeConfirmLoading(false); 
                    await this.changeVisible(true) }}>
                    添加文章
                </Button>

                <FormModel
                    visible={this.state.visible}
                    confirmLoading={this.state.confirmLoading}
                    submitMap={this.submitMap}
                    onCancel={() => {
                        this.changeVisible(false);
                    }}
                    initValues={{
                        archives_id: this.props.archives_id,
                        title: "",
                    }}
                    FormName="add_article"
                    ModelTitle="添加文章"
                    FormContent={(
                        <>
                            <Form.Item label="父档案编号" name="archives_id" >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item label="文章标题" name="title">
                                <Input />
                            </Form.Item>
                        </>
                    )}
                >
                </FormModel>
            </>
        );
    };

}

export default AddArticleModel;
