import React, { Component } from 'react';
import FormModel from '@/components/FormModel';
import { Form, Input, Modal, Button, message, Radio } from 'antd';
import team from '@/models/team';

class AddTeamModel extends React.Component {

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
        let response = await team.add(values);
        if (response && response.status == "1") {
            message.success("团队创建成功！");
        }
        if (this.props.callback) this.props.callback();
        await this.changeConfirmLoading(false);
        await this.changeVisible(false);
    }

    render() {
        return (
            <>
                <Button type="default" size="small" onClick={async () => { 
                    await this.changeConfirmLoading(false); 
                    await this.changeVisible(true) }}>
                    创建团队
                </Button>

                <FormModel
                    visible={this.state.visible}
                    confirmLoading={this.state.confirmLoading}
                    submitMap={this.submitMap}
                    onCancel={() => {
                        this.changeVisible(false);
                    }}
                    initValues={{
                        team_name: "",
                    }}
                    FormName="add_team"
                    ModelTitle="创建团队"
                    FormContent={(
                        <>
                            <Form.Item label="团队名称" name="team_name" >
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

export default AddTeamModel;
