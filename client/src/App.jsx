import { useState, useEffect } from "react";
import { Layout, List } from "antd";
const { Header, Footer, Sider, Content } = Layout;

const port = 5000;
const server = "http://localhost:" + port;

function ListFiles(props) {
  const { isDir, link, href = "" } = props.param;
  return (
    <a data-isdir={isDir} href={href + "/" + link}>
      {isDir ? `[${link}]` : link}
    </a>
  );
}

function App() {
  const [list, setList] = useState([]);
  const [prevHref, setPrevHref] = useState("");
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    fetch(server + "/root")
      .then((res) => res.json())
      .then((data) => {
        setList([...data]);
      });
  }, []);

  function handleListOnClick(e) {
    e.preventDefault();
    let curLink = e.target.href.replace(e.target.origin, "");
    console.log("curLink - ", curLink);
    if (JSON.parse(e.target.dataset.isdir)) {
      if (curLink === "/...") {
        curLink = prevHref;
        curLink = curLink.replace(/\/[^\/]*$/gi, "");
        setPrevHref(curLink);
      } else {
        setPrevHref(curLink);
      }
      fetch(server + "/root" + curLink)
        .then((res) => res.json())
        .then((data) => {
          const newData = data.map((el) => {
            el.href = curLink;
            return el;
          });
          if (curLink === "") {
            setList([...newData]);
          } else {
            setList([{ isDir: true, link: "..." }, ...newData]);
          }
        });
    } else {
      fetch(server + "/root" + curLink)
        .then((res) => res.text())
        .then((data) => {
          const cleanContent = (data) => {
            data = data.replace(/ /gm, "\u00A0");
            let array = data.split(new RegExp(/[\r\n]/gm));

            let list = array.map((el) => {
              return <div>{el}</div>;
            });
            return list;
          };
          setFileContent([...cleanContent(data)]);
        })
        .catch((er) => console.log(er));
    }
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
            dataSource={list}
            renderItem={(item) => (
              <List.Item onClick={handleListOnClick}>
                <ListFiles param={item}></ListFiles>
              </List.Item>
            )}
          />
        </Sider>
        <Layout
          style={{
            height: "100vh",
          }}
        >
          <Header>Файловый менеджер</Header>
          <Content>{fileContent}</Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </>
  );
}

export default App;
