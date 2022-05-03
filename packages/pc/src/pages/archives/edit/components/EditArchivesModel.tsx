import React, { Component } from 'react';
import FormModel from '@/components/FormModel';
import { Form, Input, Modal, Button, message, Radio } from 'antd';
import archives from '@/models/archives';

class EditArchivesModel extends React.Component {

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
        let response = await archives.update(values);
        await _this.changeVisible(false);
        if (response && response.status === '1') {
            message.success("修改成功！");
        } else {
            message.error(response.message || "修改失败, 请重试！");
        }
        if (_this.props.callback) {
            _this.props.callback();
        }
    }

    render() {
        return (
            <>
                <a onClick={async () => { 
                    await this.changeConfirmLoading(false); 
                    await this.changeVisible(true) }}>
                    编辑
                </a>

                <FormModel
                    visible={this.state.visible}
                    confirmLoading={this.state.confirmLoading}
                    submitMap={this.submitMap}
                    onCancel={() => {
                        this.changeVisible(false);
                    }}
                    initValues={{
                        archives_id: this.props.archives_id,
                        fa_id: this.props.fa_id,
                        title: this.props.title,
                    }}
                    FormName="edit_archives"
                    ModelTitle="编辑档案"
                    FormContent={(
                        <>
                            <Form.Item label="档案编号" name="archives_id" >
                                <Input disabled />
                            </Form.Item>                            
                            <Form.Item label="父档案编号" name="fa_id" >
                                <Input />
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

export default EditArchivesModel;
