# promise-pool
当你有一组异步任务tasks需要处理的时候,你会怎么做?
```typescript
//使用for循环? 如果异步任务耗时比较长,则效率实在太低了
for(let task of tasks){
    await task();
}
```
或者是
```typescript
//直接使用Promise.all,全部任务一起执行?
//这或许是一个好方法,但当你遇到占用资源多的任务是,还全部任务同时执行,则可能会出现一些意外
await Promise.all(tasks.map(task => task()))
```
现在,可以通过`promise-pool`限制你同时执行Promise数量!
```typescript
let pool = new Thread({threadCount:10});

for(let task of tasks){
    pool.run(()=>task())
}
await pool.finish();

//或者

await Promise.all(tasks.map(task => {
    return  pool.run(()=>task())
}))
```

## 安装方法
```
yarn add @meislzhua/promise-pool
```
或者
```
npm i @meislzhua/promise-pool --save
```

## 使用方法
```typescript
//引入方式,下面的方式都可以
//import Thread from "@meislzhua/promise-pool"
//import {Thread}from "@meislzhua/promise-pool"

let {Thread} = require("@meislzhua/promise-pool");

(async ()=>{
    //新建一个只可以同时运行5个任务的线程池
    let pool = new Thread({threadCount:5});
    

    //如果你有批量的任务需要处理
    for(let i = 0; i < 10; i++){
        pool.run(async ()=>{
            //你需要执行的内容
            
            //延迟1秒
            await new Promise(resolve => setTimeout(resolve,1000))
            console.log("finish!");
            return Math.random()
        }).then(data=>{
            //data是 你的任务的返回
            console.log(data) //Math.random()

        }).catch(error =>{
            //如果你的任务有可能报错,则你需要catch
        })
    }   

    //获取线程池中,剩余的任务数量(包括正在执行的和等待执行的)
    console.log(pool.count());
    
    //当你需要等待全部任务执行完毕的时候,可以调用finish函数
    await pool.finish()
})()
```
## 其他注意事项
本项目是使用`typescript`编写的,编译js版本是`esnext`

如果有需要兼容的版本,可以进入`node_modules/@meislzhua/promise-pool`目录修改`tsconifg.json`,并重新编译
