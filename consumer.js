const { createClient } = require('redis');

async function runConsumer() {
    const client = createClient({
        socket: {
          host: 'r-bp1i3rfa12f8jgu44ypd.redis.rds.aliyuncs.com',
          port: 6379,
        },
        username:"test1",
        password: 'ChimerAI_2024',
      });

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  const streamKey = 'mystream';
  const groupName = 'mygroup';
  const consumerName = 'consumer1';

  // 检查消费者组是否存在
  const groups = await client.xInfoGroups(streamKey);

  // 如果消费者组不存在，则创建
  const groupExists = groups.some((group) => group.name === groupName);

  if (!groupExists) {
    try {
      await client.xGroupCreate(streamKey, groupName, '0', { MKSTREAM: true });
      console.log(`Consumer group '${groupName}' created`);
    } catch (err) {
      console.error('Error creating consumer group:', err);
      return;
    }
  } else {
    console.log(`Consumer group '${groupName}' already exists`);
  }

// 消费者循环，从 Stream 中读取消息
while (true) {
    try {
      const messages = await client.xReadGroup(
        groupName,
        consumerName,
        [{ key: streamKey, id: '>' }],
        { COUNT: 5, BLOCK: 5000 }
      );

      // 检查 messages 是否为空或不是数组
      if (messages && Array.isArray(messages)) {
        // 正确读取消息，输出日志

        // 遍历 messages 数组
        for (const message of messages) {
          const stream = message.name;          // 取出 Stream 名称
          const entries = message.messages;     // 取出消息数组
          if (Array.isArray(entries)) {
            for (const entry of entries) {
              console.log(`Consumed message id: ${entry.id}, data:`, entry.message.id,entry.message.value);
            // 处理完消息后确认
            const ackResult = await client.xAck(streamKey, groupName, entry.id);
            // 输出 ackResult 信息
            console.log(`Message with id ${entry.id} has been acknowledged. Ack count: ${ackResult}`);
            }
          }
        }
      } else {
        console.log('No new messages, waiting...');
      }
    } catch (err) {
      console.error('Error reading from stream:', err);
    }
  }
}

runConsumer().catch(console.error);
