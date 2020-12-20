# promise-pool
[简体中文版说明](./doc/chinese.md)

What do you do when you have a set of async tasks to deal with?
```typescript
//use for? If async tasks take a long time, they are too inefficient
for(let task of tasks){
    await task();
}
```
or
```typescript
//use Promise.all,all tasks are executed together?
//it may be a good idea,but when you have a task that takes up a lot of resources, all the tasks are executed at the same time, there may be some surprises
await Promise.all(tasks.map(task => task()))
```
now,You can limit the amount of Promise thread count  through 'promise-pool'!
```typescript
let pool = new Thread({threadCount:10});

for(let task of tasks){
    pool.run(()=>task())
}
await pool.finish();

//or

await Promise.all(tasks.map(task => {
    return  pool.run(()=>task())
}))
```

## Install
```
yarn add @meislzhua/promise-pool
```
or
```
npm i @meislzhua/promise-pool --save
```

## Usage
```typescript
//Any of the import ways can be used
//import Thread from "@meislzhua/promise-pool"
//import {Thread}from "@meislzhua/promise-pool"

let {Thread} = require("@meislzhua/promise-pool");

(async ()=>{
    //Create a new thread pool that can only run five tasks at once
    let pool = new Thread({threadCount:5});
    

    //If you have batch tasks to deal with
    for(let i = 0; i < 10; i++){
        pool.run(async ()=>{
            //your task ,doSomeThing
            
            //delay 1 second
            await new Promise(resolve => setTimeout(resolve,1000))
            console.log("finish!");
            return Math.random()
        }).then(data=>{
            //data is your task return
            console.log(data) //Math.random()

        }).catch(error =>{
            //If your task is likely to report errors, you need to catch
        })
    }   

    //Gets the number of remaining tasks(This includes what is being executed and what is waiting to be executed)
    console.log(pool.count());
    
    //You can call the Finish function when you need to wait for all tasks to complete
    await pool.finish()
})()
```
## Other
This project is written with 'Typescript', and the compiled JS version is' esnext '

If you have a compatible version, go to the 'node_modules/@meislzhua/promise-pool' directory and modify 'tsconifg.json' and recompile
