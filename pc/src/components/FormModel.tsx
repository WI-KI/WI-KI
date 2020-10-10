import React, { Component } from 'react';
import { Form, Input, Modal, Switch } from 'antd';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const FormModel = ({ okText, cancelText, visible, confirmLoading, submitMap, onCancel, initValues, FormName, ModelTitle, FormContent }) => {
    const [form] = Form.useForm();
    if (okText === undefined) okText = "确认";
    if (cancelText === undefined) cancelText = "取消";
    form.setFieldsValue(initValues)
    return (
        <Modal
            getContainer={false}
            maskClosable={false}
            okText={okText}
            cancelText={cancelText}
            visible={visible}
            confirmLoading={confirmLoading}
            title={ModelTitle}
            onCancel={onCancel}
            destroyOnClose={true}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        form.resetFields();
                        form.setFieldsValue(values)
                        submitMap(values);
                    })
                    .catch(info => {
                        console.log('添加失败:', info);
                    });
            }}
        >
            <Form
                form={form}
                {...layout}
                name={FormName}
                style={{
                    width: '80%',
                    marginTop: 10
                }}
                initialValues={initValues}
            >
                {FormContent}
            </Form>
        </Modal>
    );
};

export default FormModel;
