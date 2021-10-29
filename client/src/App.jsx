import { useState, useEffect } from "react";
import { Layout, List, Typography } from "antd";
const { Header, Footer, Sider, Content } = Layout;

const port = 5000;
const server = "http://localhost:";

function App() {
  const [count, setCount] = useState([]);
  const list = [
    "index.js",
    "node_modules",
    "package-lock.json",
    "package.json",
    "server-express.js",
    "server-node-static.js",
    "server.js",
  ];

  useEffect(() => {
    fetch(server + port + "/root")
      .then((res) => res.json())
      .then((data) => {
        // console.log("Отклик - ", data);
        const list = data.map((item) => (
          <a href={server + port + "/root/" + item.toString()}>{item}</a>
        ));
        setCount([...list]);
      });
  }, []);

  function handleListonClick(e) {
    e.preventDefault();
    const curElement = e.target.textContent;
    console.log("click at ", e.target.textContent);

    fetch(server + port + "/root/" + curElement)
      .then((res) => res.text())
      .then((data) => {
        console.log(data);
        // console.log(data.toString('UTF-8'));
        // const list = data.map((item) => (
        //   <a href={server + port + "/root/" + item.toString()}>{item}</a>
        // ));
        // setCount([...list]);
      })
      //.catch(er => console.log(er))
  }

  return (
    <>
      <Layout>
        <Sider>
          Панель управления
          <List
            // bordered
            dataSource={count}
            renderItem={(item) => (
              <List.Item onClick={handleListonClick}>{item}</List.Item>
            )}
          />
          <Content></Content>
        </Sider>
        <Layout>
          <Header>Файловый менеджер</Header>
          <Content></Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </>
  );
}

export default App;
