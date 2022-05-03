import React from 'react';
import { Layout, Result, Button } from 'antd';
import { Link } from 'umi';
import './main.less';

const { Content } = Layout;

class NotFound extends React.Component {

  constructor(props:any) {
    super(props);
  };

  render() {
    return (
      <>
        <Content>
            <Result
              status="404"
              title="404"
              subTitle="Sorry, the page you visited does not exist."
              extra={
              <Button type="primary">
                <Link to="/">
                Back Home
                </Link>
              </Button>
              }
            />
          </Content>
       </>
    );
  };
}

export default NotFound;