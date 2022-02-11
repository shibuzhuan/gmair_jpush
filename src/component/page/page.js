import JpushContent from "../jpush/jpush_content";
import { Route } from "react-router-dom";
import { Layout } from "antd";

const Page = () => (
  <div>
    <Layout>
      <Layout>
          <Route exact path="/" render={() => <JpushContent />} />
          <Route path="/jpush" render={() => <JpushContent />} />
      </Layout>
    </Layout>
  </div>
);

export default Page;
