import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // 使用Edge Runtime以提高超时限制

export async function POST(req: NextRequest) {
  try {
    // 获取请求体
    const body = await req.json();
    
    // 转发请求到目标API，添加 Accept 头部表明接受 SSE
    const response = await fetch('http://35.209.49.134:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(body),
    });

    // 检查响应状态
    if (!response.ok) {
      return NextResponse.json(
        { error: `API responded with status: ${response.status}` },
        { status: response.status }
      );
    }

    // 获取流式响应
    const data = response.body;
    
    if (!data) {
      return NextResponse.json(
        { error: 'Failed to get response from API' },
        { status: 500 }
      );
    }

    // 创建一个简单的 TextDecoder
    const decoder = new TextDecoder();
    
    // 流处理状态跟踪
    let isStreamActive = true;
    let lastDataTime = Date.now();
    const streamTimeout = 15000; // 15秒无数据则判定流结束
    let hasCompetitorsData = false; // 跟踪是否收到过竞争对手数据
    
    // 创建转换器，处理流式数据
    const transformStream = new TransformStream({
      start(controller) {
        // 设置定时器定期检查流活跃状态
        const intervalId = setInterval(() => {
          const currentTime = Date.now();
          // 如果长时间没有新数据且已经接收了一些有效数据，认为流已完成
          if (isStreamActive && (currentTime - lastDataTime > streamTimeout) && hasCompetitorsData) {
            console.log("流处理超时，发送结束信号");
            // 发送结束信号
            try {
              controller.enqueue(new TextEncoder().encode('data: {"step": "Done"}\n\n'));
            } catch (err) {
              console.error("发送结束信号失败:", err);
            }
            
            // 清理定时器
            clearInterval(intervalId);
            isStreamActive = false;
          }
        }, 1000);
      },
      
      transform(chunk, controller) {
        try {
          // 收到新数据，更新时间戳
          lastDataTime = Date.now();
          
          // 将二进制数据转为文本
          const text = decoder.decode(chunk, { stream: true });
          // 处理数据行
          const lines = text.split('\n');
          
          // 检查是否包含竞争对手数据
          const hasCompetitorLine = lines.some(line => {
            if (line.startsWith('data:')) {
              try {
                const jsonPart = line.substring(5).trim();
                const data = JSON.parse(jsonPart.replace(/'/g, '"'));
                return data.step === 'Main Competitors';
              } catch {
                return false;
              }
            }
            return false;
          });
          
          if (hasCompetitorLine) {
            hasCompetitorsData = true;
          }
          
          const transformedLines = lines.map(line => {
            // 对每一行进行处理
            if (line.trim() === '') return line;
            
            if (line.startsWith('data:')) {
              // 提取JSON部分
              const jsonPart = line.substring(5).trim();
              try {
                // 尝试直接解析
                JSON.parse(jsonPart);
                return line; // 如果解析成功，说明是有效JSON，直接返回原行
              } catch (e) {
                // 解析失败，可能是单引号JSON，转换为标准JSON
                try {
                  // 替换单引号为双引号
                  const standardJson = jsonPart.replace(/'/g, '"');
                  // 验证转换后的JSON是否有效
                  JSON.parse(standardJson);
                  return `data: ${standardJson}`;
                } catch (jsonErr) {
                  // 如果仍然无法解析，返回原始行
                  console.error("JSON转换失败:", jsonErr);
                  return line;
                }
              }
            }
            return line; // 非data行直接返回
          });
          
          // 将处理后的文本写回流
          const transformedText = transformedLines.join('\n');
          controller.enqueue(new TextEncoder().encode(transformedText));
        } catch (err) {
          console.error('Error in transform:', err);
          // 如果处理出错，将原始数据传递下去
          controller.enqueue(chunk);
        }
      },
      
      flush(controller) {
        // 当上游流关闭时，发送明确的结束信号
        if (isStreamActive) {
          console.log("上游流已关闭，发送结束信号");
          controller.enqueue(new TextEncoder().encode('data: {"step": "Done"}\n\n'));
          isStreamActive = false;
        }
      }
    });

    // 使用更可靠的方式处理流
    return new Response(data.pipeThrough(transformStream), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // 禁用nginx缓冲
        'Transfer-Encoding': 'chunked'
      },
    });
  } catch (error) {
    console.error('Error in proxy:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}