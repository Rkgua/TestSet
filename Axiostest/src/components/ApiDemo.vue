<template>
  <div>
    <h1>API Demo</h1>
    <p>这是一个展示如何使用封装的 API 模块的示例组件。</p>

    <!-- 所有用户列表（实时展示） -->
    <div>
      <h2>所有用户</h2>
      <button @click="fetchAllUsers">刷新用户列表</button>
      <ul>
        <li v-for="u in allUsers" :key="u.id">
          ID: {{ u.id }} | 用户名: {{ u.username }} | 密码: {{ u.password }}
        </li>
      </ul>
      <p v-if="allUsers.length === 0">暂无用户数据</p>
    </div>

    <!-- get请求 - 获取单个用户 -->
    <div>
      <h2>获取单个用户</h2>
      <input v-model.number="fetchId" type="number" placeholder="输入用户ID" />
      <button @click="fetchUser">获取用户</button>
      <pre>{{ user }}</pre>
    </div>

    <!-- post请求 - 创建用户 -->
    <div>
      <h2>创建用户</h2>
      <input v-model.number="createUserId" type="number" placeholder="输入用户ID" />
      <input v-model="createUsername" placeholder="输入用户名" />
      <input v-model="createPassword" type="password" placeholder="输入密码" />
      <button @click="createUser">创建用户</button>
      <pre>{{ NewUser }}</pre>
    </div>

    <!-- put请求 - 完整更新用户 -->
    <div>
      <h2>更新用户 (PUT)</h2>
      <input v-model.number="updateId" type="number" placeholder="输入用户ID" />
      <input v-model="updateUsername" placeholder="输入新用户名" />
      <input v-model="updatePassword" type="password" placeholder="输入新密码" />
      <button @click="updateUser">更新用户</button>
      <pre>{{ upUser }}</pre>
    </div>

    <!-- patch请求 - 部分更新用户 -->
    <div>
      <h2>部分更新用户 (PATCH)</h2>
      <input v-model.number="patchId" type="number" placeholder="输入用户ID" />
      <input v-model="patchUsername" placeholder="输入新用户名" />
      <input v-model="patchPassword" type="password" placeholder="输入新密码" />
      <button @click="patchUser">部分更新</button>
      <pre>{{ patchedUser }}</pre>
    </div>

    <!-- delete请求 -->
    <div>
      <h2>删除用户</h2>
      <input v-model.number="deleteId" type="number" placeholder="输入用户ID" />
      <button @click="deleteUser">删除用户</button>
      <pre>{{ delUser }}</pre>
    </div>

    <!-- 文件上传 -->
    <input type="file" @change="uploadFile" />
    <p>{{ uploadStatus }}</p>
  </div>
</template>
<script setup>
import { ref } from "vue";
import api from "../api/index.js";

// 响应式数据
const allUsers = ref([]);
const user = ref({});
const NewUser = ref({});
const upUser = ref({});
const patchedUser = ref({});
const delUser = ref("");
const uploadStatus = ref("");

// 获取单个用户 - 输入绑定
const fetchId = ref(1);

// 创建用户 - 输入绑定
const createUserId = ref(0);
const createUsername = ref("");
const createPassword = ref("");

// 更新用户 (PUT) - 输入绑定
const updateId = ref(1);
const updateUsername = ref("");
const updatePassword = ref("");

// 部分更新 (PATCH) - 输入绑定
const patchId = ref(1);
const patchUsername = ref("");
const patchPassword = ref("");

// 删除用户 - 输入绑定
const deleteId = ref(1);

// 获取所有用户
async function fetchAllUsers() {
  try {
    const response = await api.get("/user");
    allUsers.value = response.data;
  } catch (error) {
    console.log("获取用户列表失败", error);
  }
}

// get - 获取单个用户
async function fetchUser() {
  try {
    const response = await api.get(`/user/${fetchId.value}`);
    user.value = response.data;
  } catch (error) {
    console.log("请求失败", error);
  }
}

// post - 创建用户
async function createUser() {
  try {
    const response = await api.post("/user/", {
      id: createUserId.value,
      username: createUsername.value,
      password: createPassword.value,
    });
    NewUser.value = response.data;
    // 创建成功后刷新列表
    fetchAllUsers();
  } catch (error) {
    console.log("请求失败", error);
  }
}

// put - 完整更新用户
async function updateUser() {
  try {
    const response = await api.put(`/user/${updateId.value}`, {
      id: updateId.value,
      username: updateUsername.value,
      password: updatePassword.value,
    });
    upUser.value = response.data;
    // 更新成功后刷新列表
    fetchAllUsers();
  } catch (error) {
    console.log("请求失败", error);
  }
}

// patch - 部分更新用户
async function patchUser() {
  try {
    const response = await api.patch(`/user/${patchId.value}`, {
      username: patchUsername.value,
      password: patchPassword.value,
    });
    patchedUser.value = response.data;
    // 部分更新成功后刷新列表
    fetchAllUsers();
  } catch (error) {
    console.log("请求失败", error);
  }
}

// delete - 删除用户
async function deleteUser() {
  try {
    await api.delete(`/user/${deleteId.value}`);
    delUser.value = `用户 ${deleteId.value} 已经删除`;
    // 删除成功后刷新列表
    fetchAllUsers();
  } catch (error) {
    console.log("请求失败", error);
    delUser.value = `删除用户 ${deleteId.value} 失败`;
  }
}

// 文件上传
async function uploadFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    uploadStatus.value = "上传成功";
  } catch (error) {
    console.error("文件上传失败:", error);
    uploadStatus.value = "上传失败";
  }
}
</script>
