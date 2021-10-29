import { useState, useEffect } from "react";
import { Layout, List } from "antd";

const { Header, Sider, Content } = Layout;

const port = 5000;
const server = "http://localhost:";

function App() {
  const [count, setCount] = useState([]);
  const [data, setData] = useState([]);

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
        const cleanContent = (data) => {
          data = data.replace(/ /gm, "\u00A0");
          let array = data.split(new RegExp(/[\r\n]/gm));

          let list = array.map((el) => {
            return <div>{el}</div>;
          });
          // console.log(list);
          return list;
        };
        // console.log(data);
        setData([...cleanContent(data)]);
      })
      .catch((er) => console.log(er));
  }

  return (
    <>
      <Layout>
        <Sider
          style={{
            height: "100vh",
          }}
        >
          Панель управления
          <List
            // bordered
            dataSource={count}
            renderItem={(item) => (
              <List.Item onClick={handleListonClick}>{item}</List.Item>
            )}
          />
        </Sider>
        <Layout
          style={{
            height: "100vh",
          }}
        >
          <Header>Файловый менеджер</Header>
          <Content>
            <div>{data}</div>
          </Content>
          {/* <Footer>Copirights 2021</Footer> */}
        </Layout>
      </Layout>
    </>
  );
}

export default App;
