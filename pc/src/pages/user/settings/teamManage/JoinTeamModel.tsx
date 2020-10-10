import React, { Component } from 'react';
import FormModel from '@/components/FormModel';
import { Form, Input, Modal, Button, message, Radio } from 'antd';
import team from '@/models/team';

class JoinTeamModel extends React.Component {

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
        let response = await team.join(values);
        if (response && response.status == "1") {
            message.success(response.message || "发送申请成功！");
        } else {
            message.error(response.message || "操作失败，请重试！");
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
                    加入团队
                </Button>

                <FormModel
                    visible={this.state.visible}
                    confirmLoading={this.state.confirmLoading}
                    submitMap={this.submitMap}
                    onCancel={() => {
                        this.changeVisible(false);
                    }}
                    initValues={{
                        team_id: "",
                    }}
                    FormName="join_team"
                    ModelTitle="加入团队"
                    FormContent={(
                        <>
                            <Form.Item label="团队编号" name="team_id" >
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

export default JoinTeamModel;
