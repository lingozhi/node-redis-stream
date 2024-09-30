 npm install redis 
请确保在启动 consumer.js 时，有 producer.js 生成的数据。可以按照以下顺序运行：
先启动 producer.js：
node producer.js
这样 mystream 中会有一些初始数据。
再启动 consumer.js：
node consumer.js
