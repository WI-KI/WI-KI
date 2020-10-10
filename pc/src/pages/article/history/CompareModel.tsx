import React, { Component } from 'react';
import FormModel from '@/components/FormModel';
import { Form, Input, Modal, Button, message } from 'antd';
import archives from '@/models/archives';
import { history } from 'umi';

class CompareModel extends React.Component {

    getCompareUrl(md_id1: any, md_id2: any) {
        let { username, team_id, article_id } = this.props;
        if (username) {
            return ["", "user", username, "article", article_id, "compare", md_id1, md_id2].join("/");
        } else if (team_id) {
            return ["", "team", team_id, "article", article_id, "compare", md_id1, md_id2].join("/"); 
        } else {
            return "";
        }
    }

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
        var _this = this;
        history.push(this.getCompareUrl(values.lid, values.rid));
    }

    render() {
        return (
            <>
                <a onClick={async () => {
                    await this.changeConfirmLoading(false);
                    await this.changeVisible(true)
                }}>
                    对比
                </a>

                <FormModel
                    visible={this.state.visible}
                    confirmLoading={this.state.confirmLoading}
                    submitMap={this.submitMap}
                    onCancel={() => {
                        this.changeVisible(false);
                    }}
                    initValues={{
                        lid: this.props.lid,
                        rid: "",
                    }}
                    FormName="compare_history"
                    ModelTitle="历史版本对比"
                    FormContent={(
                        <>
                            <Form.Item label="当前版本编号" name="lid" >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item label="对比版本编号" name="rid">
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

export default CompareModel;
