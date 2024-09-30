const { createClient } = require('redis');

async function runProducer() {
    // const client = createClient({
    //     socket: {
    //       host: 'r-bp1i3rfa12f8jgu44ypd.redis.rds.aliyuncs.com',
    //       port: 6379,
    //     },
    //     username:"test1",
    //     password: 'ChimerAI_2024',
    // });
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

  // 模拟生产数据
  const messageCount = 10;
  for (let i = 1; i <= messageCount; i++) {
    await client.xAdd(streamKey, '*', {
      id: `msg-${i}`,
      value: `This is message number ${i}`,
    });
    console.log(`Produced: msg-${i}`);
  }

  await client.quit();
}

runProducer().catch(console.error);
