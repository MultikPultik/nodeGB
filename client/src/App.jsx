import { useState, useEffect } from "react";
import { Layout, List, Typography } from "antd";
const { Header, Footer, Sider, Content } = Layout;

const port = 5000;
const server = "http://localhost:" + port;

function App() {
  const [list, setList] = useState([]);
  const [currentDir, setCurrentDir] = useState([""]);

  const getList = (data, dir = "") =>
    data.map((item) => {
      return (
        <a href={server + "/root/" + dir + item.link}>
          {item.isDir ? `[${item.link}]` : item.link}
        </a>
      );
    });

  useEffect(() => {
    fetch(server + "/root")
      .then((res) => res.json())
      .then((data) => {
        setList([...getList(data)]);
      });
  }, []);

  function handleListOnClick(e) {
    e.preventDefault();
    // console.log("href - ", e.target.href);
    const curLink = e.target.href.replace(/^.*root\//, "");
    let fullLink = currentDir[currentDir.length - 1] + curLink;
    console.log("currentLink - ", curLink);

    if (e.target.textContent[0] === "[") {
      //console.log("state - ", server + "/root/" + fullLink);
      fetch(server + "/root/" + fullLink)
        .then((res) => res.json())
        .then((data) => {
          setList([
            ...getList([{ isDir: false, link: "..." }, ...data], curLink + "/"),
          ]);
        });
      setCurrentDir([...currentDir.concat(curLink + "/")]);
    } else {
      //console.log("getFile - ", server + "/root/" + currentDir + curLink);
      fetch(server + "/root/" + fullLink)
        .then((res) => res.text())
        .then((data) => {
          // console.log(data);
        });
    }
  }

  return (
    <>
      <Layout>
        <Sider>
          Панель управления
          <List
            // bordered
            dataSource={list}
            renderItem={(item) => (
              <List.Item onClick={handleListOnClick}>{item}</List.Item>
            )}
          />
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
