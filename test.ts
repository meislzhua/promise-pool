import test from 'ava';
import Thread from './Thread';

test('单线程测试', async t => {
    let pool = new Thread({threadCount: 1});
    let last = Date.now();
    // console.log("开始时间", last)
    await Promise.all([5, 2, 3, 51, 2, 64].map(async v => {
        let res = await pool.run(async () => {
            //延迟1秒
            await new Promise(resolve => setTimeout(resolve, 1000))

            //时间计算,延迟不可大于100ms
            let delay = Date.now() - last;
            t.true(delay < 1100)
            t.true(delay >= 900);
            last = Date.now()
            return v;
        })
        t.is(res, v)
        return res
    }))
    t.is(pool.getRunningCount(), 0)
    t.is(pool.getHandleCount(), 0)

});
test('运行数量测试', async t => {
    let threadCount = 5;
    let runCount = threadCount + 5;
    let pool = new Thread({threadCount});
    for (let i = 0; i < runCount; i++) {
        pool.run(() => new Promise(resolve => setTimeout(resolve, 5000)))
    }
    t.is(pool.getRunningCount(), threadCount)
    t.is(pool.getHandleCount(), runCount - threadCount)

});
test('同时执行完成测试', async t => {
    let threadCount = 5;
    let delay = 1000;
    let pool = new Thread({threadCount});
    Promise.all(Array(threadCount).fill(1).map(async () => {
        await pool.run(() => new Promise(resolve => setTimeout(resolve, delay)))
    }))

    await new Promise(resolve => setTimeout(resolve, delay + 100))

    t.is(pool.getRunningCount(), 0)
    t.is(pool.getHandleCount(), 0);


});
test('执行完成测试', async t => {
    let threadCount = 5;
    let delay = 1000;
    let pool = new Thread({threadCount});
    await Promise.all(Array(threadCount).fill(1).map(async () => {
        await pool.run(() => new Promise(resolve => setTimeout(resolve, delay)))
    }))

    t.is(pool.getRunningCount(), 0)
    t.is(pool.getHandleCount(), 0);


});

test('空finish测试', async t => {
    let threadCount = 5;
    let pool = new Thread({threadCount});

    await pool.finish()
    t.is(pool.getRunningCount(), 0)
    t.is(pool.getHandleCount(), 0)
    t.true(pool.isFinish())
});
test('finish测试', async t => {
    let threadCount = 5;
    let delay = 100;
    let count = 0;
    let pool = new Thread({threadCount});
    Promise.all(Array(threadCount * 2).fill(1).map(async () => {
        await pool.run(async () => {
            await new Promise(resolve => setTimeout(resolve, delay))
            count++;
        })
    })).catch(() => null)

    await pool.finish()
    t.is(pool.getRunningCount(), 0)
    t.is(pool.getHandleCount(), 0)
    t.true(pool.isFinish())
    t.is(count, threadCount * 2)
});
