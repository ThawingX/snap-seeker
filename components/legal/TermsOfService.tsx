"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
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
          服务条款
        </h1>
        <p className="text-gray-400 text-lg">
          最后更新时间：{new Date().toLocaleDateString('zh-CN')}
        </p>
      </div>

      {/* 内容 */}
      <div className="prose prose-invert max-w-none">
        <div className="space-y-8">
          {/* 接受条款 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">接受条款</h2>
            <p className="text-gray-300 leading-relaxed">
              欢迎使用 SnapSeeker！通过访问或使用我们的服务，您同意受本服务条款的约束。
              如果您不同意这些条款，请不要使用我们的服务。
            </p>
          </section>

          {/* 服务描述 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">服务描述</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              SnapSeeker 是一个产品搜索和竞争对手分析平台，提供以下服务：
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>产品创意验证和市场分析</li>
              <li>竞争对手产品发现和比较</li>
              <li>市场机会识别</li>
              <li>产品功能和需求分析</li>
              <li>相关的数据分析和报告服务</li>
            </ul>
          </section>

          {/* 用户账户 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">用户账户</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">账户注册</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>您必须提供准确、完整的注册信息</li>
                  <li>您有责任维护账户信息的准确性</li>
                  <li>您必须保护账户密码的安全</li>
                  <li>您对账户下的所有活动负责</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">账户使用</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>每个用户只能注册一个账户</li>
                  <li>不得与他人共享账户凭据</li>
                  <li>如发现未经授权使用，请立即通知我们</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 使用规则 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">使用规则</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              使用我们的服务时，您同意不会：
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>违反任何适用的法律法规</li>
              <li>侵犯他人的知识产权或其他权利</li>
              <li>上传恶意软件或有害代码</li>
              <li>进行垃圾邮件或未经授权的营销活动</li>
              <li>尝试未经授权访问我们的系统</li>
              <li>干扰或破坏服务的正常运行</li>
              <li>使用自动化工具过度访问服务</li>
              <li>冒充他人或提供虚假信息</li>
            </ul>
          </section>

          {/* 付费服务 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">付费服务和订阅</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">费用和付款</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>某些功能可能需要付费订阅</li>
                  <li>费用将在购买时明确显示</li>
                  <li>付款通过安全的第三方处理器处理</li>
                  <li>所有费用均不可退还，除非法律另有规定</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">订阅管理</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>订阅将自动续费，除非您取消</li>
                  <li>您可以随时在账户设置中取消订阅</li>
                  <li>取消将在当前计费周期结束时生效</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 服务可用性 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">服务可用性</h2>
            <p className="text-gray-300 leading-relaxed">
              我们努力保持服务的可用性，但不保证服务将始终可用、不间断或无错误。
              我们可能会因维护、更新或其他原因暂时中断服务。
            </p>
          </section>

          {/* 免责声明 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">免责声明</h2>
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
              <p className="text-yellow-200 leading-relaxed">
                我们的服务按"现状"提供，不提供任何明示或暗示的保证。我们不保证服务将满足您的要求，
                或者服务将不间断、及时、安全或无错误。
              </p>
            </div>
          </section>

          {/* 责任限制 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">责任限制</h2>
            <p className="text-gray-300 leading-relaxed">
              在法律允许的最大范围内，SnapSnap 不对任何间接、偶然、特殊、后果性或惩罚性损害承担责任，
              包括但不限于利润损失、数据丢失或业务中断。
            </p>
          </section>

          {/* 赔偿 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">赔偿</h2>
            <p className="text-gray-300 leading-relaxed">
              您同意就因您使用服务或违反这些条款而产生的任何索赔、损失或损害，
              为 SnapSnap 及其关联公司、员工和代理人进行辩护、赔偿并使其免受损害。
            </p>
          </section>

          {/* 终止 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">终止</h2>
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                我们可能会因以下原因终止或暂停您的账户：
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>违反这些服务条款</li>
                <li>长期不活跃</li>
                <li>法律要求</li>
                <li>服务停止运营</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                您也可以随时删除您的账户来终止服务。
              </p>
            </div>
          </section>

       

          {/* 条款修改 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">条款修改</h2>
            <p className="text-gray-300 leading-relaxed">
              我们保留随时修改这些条款的权利。重大变更将提前通知用户。
              继续使用服务即表示您接受修改后的条款。
            </p>
          </section>

          {/* 联系信息 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">联系我们</h2>
            <p className="text-gray-300 leading-relaxed">
              如果您对这些服务条款有任何疑问，请联系我们：
            </p>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-300">xdylanlong@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;