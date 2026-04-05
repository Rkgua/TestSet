import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

let users = [
  {
    id: 1,
    username: "user1",
    password: "456",
    token: "4wew",
  },
  {
    id: 2,
    username: "user2",
    password: "123",
    token: "uee",
  },
];

//获取所有用户
app.get("/user", (req, res) => {
  res.json(users);
});

//获取用户信息
app.get("/user/:id", (req, res) => {
  const user = users.find((u) => u.id == req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

//创建新用户
app.post("/user", (req, res) => {
  const NewUser = {
    id: users.length + 1,
    username: req.body.name || "unknown",
    ...req.body,
  };
  users.push(NewUser);
  res.status(201).json(NewUser);
});

//更新用户
app.put("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);
  if (index != -1) {
    users[index] = { ...users[index], ...req.body, id: id };
    res.json(users[index]);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.patch("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (user) {
    Object.assign(user, req.body);
    res.json(user);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.delete("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);
  if (index != -1) {
    users.splice(index, 1); //指定索引处的用户对象移除，后面的元素会自动向前补位index: 起始位置。表示从数组的第几个索引开始操作。
    //1: 删除的数量。表示从起始位置开始，往后删除 1 个元素。
    res.json({ message: "Deleted" });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
// users.find：这是 JavaScript 数组原型（Array Prototype）上内置的一个方法。
// 它的作用是“遍历数组，找到第一个满足条件的元素”。
// 这个方法确实已经定义好了，你直接调用即可。
// (u) => u.id === id：这是一个回调函数（Callback Function）。
// .find() 方法本身不知道你要找什么样的数据，所以它要求你传入一个函数作为参数，
// 告诉它：“请帮我把每个元素传进这个函数里跑一下，如果返回 true，那就是我要找的元素。”
// 三种常见传参方式的区别
// 前端传数据给后端主要有三种方式，Express 将它们放在不同的地方：
// 传参方式	前端 URL / 代码示例	后端获取方式	说明
// 路径参数 (Params)	/user/1	req.params.id	用于标识资源。如获取ID为1的用户。通常用于 RESTful 风格。
// 查询参数 (Query)	/user?name=zhangsan	req.query.name	用于筛选或排序。如搜索名字为张三的用户。
// 请求体 (Body)	POST /user (JSON数据)	req.body.name	用于提交大量数据。如创建新用户时的详细信息。
