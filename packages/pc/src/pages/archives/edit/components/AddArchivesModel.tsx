import React, { Component } from 'react';
import FormModel from '@/components/FormModel';
import { Form, Input, Modal, Button, message } from 'antd';
import archives from '@/models/archives';

class AddArchivesModel extends React.Component {

    constructor(props: any) {
        super(props);
    };

    state = {
        visible: false,
        confirmLoading: false,
    };

    changeVisible = async (status: any) => {
        await this.setState({ visible: status });
    }

    changeConfirmLoading = async (status: any) => {
        await this.setState({ confirmLoading: status });
    }

    submitMap = async (values: any) => {
        await this.changeConfirmLoading(true); 
        let { username, team_id } = this.props;
        let _this = this;
        values.username = username;
        values.team_id = team_id;
        let response = await archives.add(values);
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
                    添加档案
                </Button>

                <FormModel
                    visible={this.state.visible}
                    confirmLoading={this.state.confirmLoading}
                    submitMap={this.submitMap}
                    onCancel={() => {
                        this.changeVisible(false);
                    }}
                    initValues={{
                        fa_id: this.props.fa_id,
                        title: "",
                    }}
                    FormName="add_archives"
                    ModelTitle="添加档案"
                    FormContent={(
                        <>
                            <Form.Item label="父档案编号" name="fa_id" >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item label="档案名称" name="title">
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

export default AddArchivesModel;
