const About = () => (
  <div>
    <h2>About</h2>
    <p>一个简单的TodoList由React, Hooks, Context, and React Router实现</p>
    <ul>
      <li>
        <strong>useReducer</strong> + <strong>Context</strong> — 混合状态管理
      </li>
      <li>
        <strong>useState</strong> — 你的操作决定了状态的改变
      </li>
      <li>
        <strong>Custom Hook (useTodos)</strong> 自定义Hook — 逻辑复用和抽象
      </li>
      <li>
        <strong>React Router v6</strong> — /all /active /completed /about
      </li>
    </ul>
  </div>
);

export default About;
