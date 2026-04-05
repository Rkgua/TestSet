import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, //环境隔离：根据不同环境自动切换后端地址
  timeout: 20000, //配置超时时间
  headers: {
    "Content-Type": "application/json", //告诉后端：“我发的数据是 JSON 格式，请按 JSON 解析”。
    // 'Authorization': `Bearer ${getToken()}`  用户认证 如果在这里写的话可能会出现
    // 在 axios.create() 初始化时只会执行一次！
    // 这意味着：
    // 如果用户刚打开页面就登录了，getToken() 能拿到 Token，后续所有请求都带 Token ✅。
    // 但如果用户先打开页面（未登录），之后再登录，此时 getToken() 返回的是 null 或空字符串，那么之后的所有请求都不会带新 Token ❌！
  },
});
// 请求拦截器：动态添加 Token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // 响应拦截器：统一处理 401（Token 失效）
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login"; // 跳转登录页
//     }
//     return Promise.reject(error);
//   },
// );
// // 请求拦截器：统一添加 loading 动画
// api.interceptors.request.use((config) => {
//   showLoading();
//   return config;
// });

// // 响应拦截器：统一处理错误（如 401 跳转登录）
// api.interceptors.response.use(
//   (response) => {
//     hideLoading();
//     return response;
//   },
//   (error) => {
//     if (error.response.status === 401) {
//       router.push("/login");
//     }
//     return Promise.reject(error);
//   },
// );

export default api;

// 在 Vue 项目中创建 src/api/index.js 这样的统一 Axios 配置文件
// 它的核心作用是：集中管理、避免重复、提升可维护性。
// “安全漏洞”具体指什么？
// ✅ 答案：指的是 “忘记加 Token 导致未授权访问” 或 “泄露敏感操作”。
// 🛑 场景举例：
// 1.集中管理基础 URL (BaseURL)
// 2.全局配置超时、错误处理等
// 3.全局配置请求头 (headers)
//4.便于添加拦截器
//5.环境隔离
// 请求拦截器：统一添加 loading 动画
// api.interceptors.request.use(config => {
//   showLoading()
//   return config
// })
// // 响应拦截器：统一处理错误（如 401 跳转登录）
// api.interceptors.response.use(
//   response => {
//     hideLoading()
//     return response
//   },
//   error => {
//     if (error.response.status === 401) {
//       router.push('/login')
//     }
//     return Promise.reject(error)
//   }
// )
// 无需在每个组件里写重复的错误处理逻辑

//环境隔离
// 同一个前端代码，怎么在不同环境下自动连不同的后端地址？
// 1.使用环境变量：在 Vue 项目中，通常通过 .env 文件来管理环境变量。你可以在 .env.development、.env.production 等文件中定义不同的 VUE_APP_BASE_URL 变量
// ，然后在 api/index.js 中使用 process.env.VUE_APP_BASE_URL 来设置 baseURL。
// 避免手动改变代码来切换环境，减少出错风险。
// Vite 检测到是 开发模式|生产模式 就会自动加载对应的 .env 文件，确保 baseURL 根据环境正确设置。
