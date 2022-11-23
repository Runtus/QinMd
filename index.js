const once = () => {
    const questions = document.querySelector(".fuwenben  p")
    const question_text = questions.textContent
    const selects = document.querySelectorAll(".leftradio")
    const selectsText = Array.from(selects).map(item => {
        const tag = item.querySelector(".radio_jqq").textContent
        const anwser = item.querySelector("p").textContent
        return { tag, anwser }
    })

    let rightLength = document.querySelectorAll(".answerList > .true").length

    let rightAnswer = null
    if (rightLength === 2) {
        // 表示该题是判断题，并且答案是正确
        rightAnswer = ["正确"]
    } else if (rightLength === 1) {
        // 表示该题是判断题，并且答案是错误
        rightAnswer = ["错误"]
    } else {
        const answerLists = document.querySelectorAll(".answerList > .answerList > .radio_jqq")
        rightAnswer = Array.from(answerLists).map(item => {
            const context = item.textContent
            return context.replace(/\s+/g, "")
        })
    }

    const selectContent = selectsText.reduce((pre, cur) => { return pre + `${cur.tag + ":" + cur.anwser + "  "}` }, "");
    const rightAnswerContent = rightAnswer.reduce((pre, cur) => `${pre} **${cur}**`, "")

    const markdown = `##### ${question_text}\n${selectContent}\n答案: ${rightAnswerContent} \n`
    console.log(markdown)

    return markdown.toString()
}

const main = async () => {
    const results = []
    const number = Number(document.querySelector(".tabbar > .total").textContent.slice(1,))
    const nextBtn = document.querySelectorAll(".tabbar > i")[1]
    let count = 0
    return new Promise((res, rej) => {
        const id = setInterval(() => {
            count++;
            nextBtn.click()
            const result = once()
            results.push(result)
            if (count === number) {
                clearInterval(id)
                res(results.reduce((pre, cur) => pre + cur, ""))
            }
        }, 200)
    })
}

/**
 * 
 * @returns {HTMLButtonElement}
 */
const createButton = () => {
    const btn = document.createElement('button')
    btn.style.width = "100px"
    btn.style.height = "40px"
    btn.innerText = "开始提取"
    btn.style.borderRadius = "16px"
    btn.style.background = "linear-gradient(90deg, #BF6CDF,#624ADF)"
    btn.style.fontSize = "18px"
    btn.style.position = "fixed"
    btn.style.bottom = "100px"
    btn.style.right = "100px"
    btn.style.zIndex = 10000
    btn.style.cursor = "pointer"
    document.body.appendChild(btn)
    return btn
}


const back = async () => {
    const datika = document.querySelector(".showAllAnswer")
    datika.click()
    // 250ms的延迟，要等click事件完成后，再进行回退操作，否则click后，页面的dom变化情况跟不上代码的运行，会报错
    return new Promise((res) => setTimeout(() => res(), 250))
        .then(() => {
            const questions_number = document.querySelectorAll(".courseActionAnswerSheet .el-popover__reference-wrapper")
            for (let index = 0; index < questions_number.length; index++) {
                const order = questions_number[index].querySelector("span")
                const tabindex = order.attributes.getNamedItem("tabindex")
                console.log(order)
                if (tabindex && tabindex.value === "0") {
                    order.click()
                    return
                }
            }
        })
}

(async function () {
    'use strict';
    console.log("Hello world")
    const trigger = createButton()
    trigger.onclick = async () => {
        await back();
        const record = await main();
        console.log(record)
    }
})();