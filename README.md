![](https://io.onenov.cn/file/202407151458648.png)

# ChatBot Next

[![](https://img.shields.io/badge/Laravel-v11-ff2e21.svg)](https://laravel.com)
[![](https://img.shields.io/badge/nuxt.js-v3-04C690.svg)](https://nuxt.com)

无缝集成处理和调度 Dify & Dify on WeChat，Web 可视化多用户管理/一键启动 ChatBot，简化了令人惊叹且响应迅速的 ChatBot 应用程序的创建。

请注意：该项目仅用于学习交流使用，Dify 允许被用于商业化，例如作为其他应用的“后端即服务”使用，或者作为应用开发平台提供给企业。然而，当满足以下条件时，必须联系生产者获得商业许可：
-   多租户 SaaS 服务：除非获得 Dify 的明确书面授权，否则不得使用 Dify.AI 的源码来运营与 Dify.AI 服务版类似的多租户 SaaS 服务。
-   LOGO 及版权信息：在使用 Dify 的过程中，不得移除或修改 Dify 控制台内的 LOGO 或版权信息。

## 演示

-   [ChatBot Next](https://chatbot-dev.orence.net)

## 要求

-   PHP 8.2 / Node 20+
-   [**Throttling with Redis**](https://laravel.com/docs/11.x/routing#throttling-with-redis) **Redis**
-   [**Laravel Octane**](https://laravel.com/docs/11.x/octane) 支持 2 种运行模式：Swoole（php 扩展）或 Roadrunner

## 说明

仅作为一个框架处理和调度 [**Dify**](https://github.com/langgenius/dify) 和 [**Dify on WeChat**](https://github.com/hanfangyuan4396/dify-on-wechat) 项目，并增加了一堆附加功能，目前只开源前端部分。项目还在处于内部开发阶段，你需要根据文档调整其他项目（Dify 、Dify on WeChat）的部署方式。

获取方式：请添加微信 [AOKIEO] 了解获取后端，交流或更多。

### 目前已经实现的功能

#### 用户系统

-   用户注册、登陆、找回密码、邮箱验证
-   用户管理
-   会员管理
-   卡密兑换
-   签到
-   消耗记录

#### 工作台

-   应用广场（后台新增开放应用或一些文档）
-   我创建的（联通 Dify 创建不同类型的应用）
-   应用模板（获取 Dify 创建的部分应用作为可复制模板）
-   知识库
-   自动计算工作台创建的应用消耗的额度，与系统余额关联

#### 助手

-   一键创建或启动 Dify on WeChat 的机器人
-   通过表单弹窗创建
-   获取日志
-   个人微信二维码扫码登陆流程
-   修改配置
-   启动、停止、删除

支持一键启动下面的应用类型

-   个人微信
-   企业微信应用
-   企业服务公众号
-   个人订阅公众号
-   企业微信客服
-   飞书

---

支持联通 Dify 的应用类型

-   chatbot(对应聊天助手)
-   agent(对应 Agent)
-   workflow(对应工作流)

## 待开发的功能

-   [ ] 签到自定义延长会员有效期或增加余额
-   [ ] 支持 coze 机器人
-   [ ] 创建应用增加更多可视化部署
-   [ ] 数据清洗模块

## Links

-   [Nuxt 3](https://nuxt.com/)
-   [Nuxt UI](https://ui.nuxt.com/)
-   [Nuxt UI Pro](https://ui.nuxt.com/pro/getting-started)
-   [Arco Design VUE](https://arco.design/vue/docs/start)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Laravel 11x](https://laravel.com/docs/11.x)

## Framework Features

-   [**Laravel 11**](https://laravel.com/docs/11.x) and [**Nuxt 3**](https://nuxt.com/)
-   [**Laravel Octane**](https://laravel.com/docs/11.x/octane) supercharges your application's performance by serving your application using high-powered application servers.
-   [**Laravel Telescope**](https://laravel.com/docs/11.x/telescope) provides insight into the requests coming into your application, exceptions, log entries, database queries, queued jobs, mail, notifications, cache operations, scheduled tasks, variable dumps, and more.
-   [**Laravel Sanctum**](https://laravel.com/docs/11.x/sanctum) Token-based authorization is compatible with **SSR** and **CSR**
-   [**Laravel Socialite**](https://laravel.com/docs/11.x/socialite) OAuth providers
-   [**Laravel Sail**](https://laravel.com/docs/11.x/sail) Light-weight command-line interface for interacting with Laravel's default Docker development environment.
-   [**Spatie Laravel Permissions**](https://spatie.be/docs/laravel-permission/v6/introduction) This package allows you to manage user permissions and roles in a database.
-   UI library [**Nuxt UI**](https://ui.nuxt.com/) based on [**TailwindCSS**](https://tailwindui.com/) and [**HeadlessUI**](https://headlessui.com/).
-   [**Pinia**](https://pinia.vuejs.org/ssr/nuxt.html) The intuitive store for Vue.js
-   Integrated pages: login, registration, password recovery, email confirmation, account information update, password change.
-   Temporary uploads with cropping and optimization of images.
-   Device management
-   [**ofetch**](https://github.com/unjs/ofetch) preset for working with Laravel API, which makes it possible
    use $**fetch** without having to resort to custom $**fetch** wrappers.

### Authentication

**useAuthStore()** has everything you need to work with authorization.

Data returned by **useAuthStore**:

-   `logged`: Boolean, whether the user is authorized
-   `token`: Cookie, sanctum token
-   `user`: User object, user stored in pinia store
-   `logout`: Function, remove local data and call API to remove token
-   `fetchUser`: Function, fetch user data

### Nuxt Middleware

The following middleware is supported:

-   `guest`: unauthorized users
-   `auth`: authorized users
-   `verified`: users who have confirmed their email
-   `role-user`: users with the 'user' role
-   `role-admin`: users with the 'admin' role

### Laravel Middleware

All built-in middleware from Laravel + middleware based on roles [**Spatie Laravel Permissions Middleware**](https://spatie.be/docs/laravel-permission/v6/basic-usage/middleware)
