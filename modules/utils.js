export function rq(url) {
    return fetch('https://cors-anywhere.herokuapp.com/' + url)
}

export async function renderItems(tasks) {
    console.log(tasks)
    const elInfo = document.getElementById('info')
    var count = 0
    var total = tasks.length
    if (total > 0) {
        if ('function' == typeof tasks[0].then) {
            tasks.map(x =>
                x.then(_ =>
                    $('#info').text(`${++count}/${total}`))
            )

        }
    }
}