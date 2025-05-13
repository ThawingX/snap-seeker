import { NextRequest, NextResponse } from 'next/server';

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
    
    // 创建转换器，处理流式数据
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        try {
          // 将二进制数据转为文本
          const text = decoder.decode(chunk, { stream: true });
          // 处理数据行
          const lines = text.split('\n');
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