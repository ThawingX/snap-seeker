"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首页
        </Link>
      </div>

      {/* 标题 */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          隐私政策
        </h1>
        <p className="text-gray-400 text-lg">
          最后更新时间：{new Date().toLocaleDateString('zh-CN')}
        </p>
      </div>

      {/* 内容 */}
      <div className="prose prose-invert max-w-none">
        <div className="space-y-8">
          {/* 引言 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">引言</h2>
            <p className="text-gray-300 leading-relaxed">
              欢迎使用 SnapSeeker！我们非常重视您的隐私权。本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。
              使用我们的服务即表示您同意本隐私政策中描述的做法。
            </p>
          </section>

          {/* 信息收集 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">我们收集的信息</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">个人信息</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>姓名和联系信息（电子邮件地址）</li>
                  <li>账户凭据（用户名、密码）</li>
                  <li>邀请码（如适用）</li>
                  <li>个人资料信息</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">使用信息</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>搜索查询和产品分析请求</li>
                  <li>使用模式和偏好设置</li>
                  <li>设备信息和技术数据</li>
                  <li>IP 地址和位置信息</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 信息使用 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">信息使用方式</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>提供、维护和改进我们的服务</li>
              <li>处理您的搜索请求和生成分析报告</li>
              <li>与您沟通服务更新和支持</li>
              <li>个性化您的用户体验</li>
              <li>确保平台安全和防止滥用</li>
              <li>遵守法律义务</li>
            </ul>
          </section>

          {/* 信息共享 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">信息共享</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              我们不会出售、交易或以其他方式转让您的个人信息给第三方，除非：
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>获得您的明确同意</li>
              <li>为提供服务所必需的可信第三方服务提供商</li>
              <li>法律要求或保护我们的权利</li>
              <li>业务转让或合并情况下</li>
            </ul>
          </section>

          {/* 数据安全 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">数据安全</h2>
            <p className="text-gray-300 leading-relaxed">
              我们采用行业标准的安全措施来保护您的个人信息，包括加密传输、安全存储和访问控制。
              但是，请注意没有任何互联网传输或电子存储方法是100%安全的。
            </p>
          </section>

          {/* Cookie */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Cookie 和跟踪技术</h2>
            <p className="text-gray-300 leading-relaxed">
              我们使用 Cookie 和类似技术来改善您的浏览体验、分析网站使用情况并提供个性化内容。
              您可以通过浏览器设置控制 Cookie 的使用。
            </p>
          </section>

          {/* 用户权利 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">您的权利</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              您对自己的个人信息享有以下权利：
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>访问和查看您的个人信息</li>
              <li>更正不准确的信息</li>
              <li>删除您的个人信息</li>
              <li>限制或反对信息处理</li>
              <li>数据可携带性</li>
            </ul>
          </section>

          {/* 数据保留 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">数据保留</h2>
            <p className="text-gray-300 leading-relaxed">
              我们只在必要的时间内保留您的个人信息，以实现收集目的或满足法律要求。
              当信息不再需要时，我们将安全地删除或匿名化处理。
            </p>
          </section>

          {/* 第三方链接 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">第三方链接</h2>
            <p className="text-gray-300 leading-relaxed">
              我们的服务可能包含指向第三方网站的链接。我们不对这些网站的隐私做法负责。
              我们建议您查看您访问的任何第三方网站的隐私政策。
            </p>
          </section>

          {/* 儿童隐私 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">儿童隐私</h2>
            <p className="text-gray-300 leading-relaxed">
              我们的服务不面向13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。
              如果我们发现收集了此类信息，我们将立即删除。
            </p>
          </section>

          {/* 政策更新 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">政策更新</h2>
            <p className="text-gray-300 leading-relaxed">
              我们可能会不时更新本隐私政策。重大变更将通过电子邮件或网站通知您。
              继续使用我们的服务即表示您接受更新后的政策。
            </p>
          </section>

          {/* 联系我们 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">联系我们</h2>
            <p className="text-gray-300 leading-relaxed">
              如果您对本隐私政策有任何疑问或关注，请通过以下方式联系我们：
            </p>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-300">电子邮件：xdylanlong@gmai.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;