(() => {
    const canvas = document.getElementById("canvas");
    if (!canvas.getContext) {
        return;
    }
    // get the context
    let ctx = canvas.getContext('2d');


    var button = document.getElementById("submit")
    var timeLineLen = document.getElementById("duration")
    var t1_dur = document.getElementById("T1_duration")
    var t1_per = document.getElementById("T1_period")
    var t1_rel = document.getElementById("T1_release")
    var t1_en = document.getElementById("T1_checkbox")
    var t2_dur = document.getElementById("T2_duration")
    var t2_per = document.getElementById("T2_period")
    var t2_rel = document.getElementById("T2_release")
    var t2_en = document.getElementById("T2_checkbox")
    var t3_dur = document.getElementById("T3_duration")
    var t3_per = document.getElementById("T3_period")
    var t3_rel = document.getElementById("T3_release")
    var t3_en = document.getElementById("T3_checkbox")
    var t4_dur = document.getElementById("T4_duration")
    var t4_per = document.getElementById("T4_period")
    var t4_rel = document.getElementById("T4_release")
    var t4_en = document.getElementById("T4_checkbox")
    var missed_task_heading = document.getElementById("missing_task")
    var rr_toggle = document.getElementById("rr")
    var fcfs_toggle = document.getElementById("fcfs")
    var rm_toggle = document.getElementById("rm")
    var edf_toggle = document.getElementById("edf")
    var tq = document.getElementById("tq")

    if (rr_toggle.checked == true) {
        tq.style.display = "inline";
        document.getElementById("tq_label").style.display = "inline";
    }
    rr_toggle.onchange = function () {
        tq.style.display = "inline";
        document.getElementById("tq_label").style.display = "inline";
    }
    fcfs_toggle.onchange = function () {
        tq.style.display = "none";
        document.getElementById("tq_label").style.display = "none";
    }
    rm_toggle.onchange = function () {
        tq.style.display = "none";
        document.getElementById("tq_label").style.display = "none";
    }
    edf_toggle.onchange = function () {
        tq.style.display = "none";
        document.getElementById("tq_label").style.display = "none";
    }

    button.onclick = function () {
        canvas.width = document.getElementById("width").value
        var algo = document.querySelector('input[name="scheduling_algorithm"]:checked')
        if (algo == null) {
            alert("Please select scheduling alorithm")
            missed_task_heading.innerHTML = ""
            algo = ""
        } else {
            algo = algo.value
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        var num_tasks = t1_en.checked + t2_en.checked + t3_en.checked + t4_en.checked
        var duration = timeLineLen.value

        var times
        var tasks

        var t1 = { 0: t1_dur.value, 1: t1_per.value, 2: t1_en.checked, 3: t1_rel.value }
        var t2 = { 0: t2_dur.value, 1: t2_per.value, 2: t2_en.checked, 3: t2_rel.value }
        var t3 = { 0: t3_dur.value, 1: t3_per.value, 2: t3_en.checked, 3: t3_rel.value }
        var t4 = { 0: t4_dur.value, 1: t4_per.value, 2: t4_en.checked, 3: t4_rel.value }
        var t = { 0: duration, 1: t1, 2: t2, 3: t3, 4: t4 }
        createGrid(t)

        var time_tasks = {}
        console.log(algo)
        if (algo == "rm") {
            time_tasks = RM(t)
        } else if (algo == "edf") {
            time_tasks = EDF(t)
        } else if (algo == "fcfs") {
            time_tasks = FCFS(t)
        } else if (algo == "rr") {
            time_tasks = RR(t, tq.value)
        } else {
            time_tasks = { 0: [0], 1: [0], 2: { "task": -1, "time": -1 } }
        }
        var missing_task = time_tasks[2]["task"]
        var missing_task_time = time_tasks[2]["time"]
        times = time_tasks[0]
        tasks = time_tasks[1]
        console.log(times, tasks)

        var height_map = { 1: canvas.height / (num_tasks + 1), 2: 2 * canvas.height / (num_tasks + 1), 3: 3 * canvas.height / (num_tasks + 1), 4: 4 * canvas.height / (num_tasks + 1) }

        var colour_map = { 1: "green", 2: "blue", 3: "gold", 4: "pink" }

        var prev_task = new Rectangle(0, 0, 60, 0, '')
        var counter = 0
        for (var i = 0; i < times.length; i++) {
            // (timeline_len * (x-step) / (width-2*step)
            var dur = times[i] / duration * (canvas.width - 120)

            if (t1_en.checked == false) {
                if (t2_en.checked == false) {
                    if (t3_en.checked == false) {
                        height_map[4] = canvas.height / (num_tasks + 1)
                    } else {
                        height_map[3] = canvas.height / (num_tasks + 1)
                        height_map[4] = 2 * canvas.height / (num_tasks + 1)
                    }
                } else {
                    height_map[2] = canvas.height / (num_tasks + 1)
                    if (t3_en.checked == false) {
                        height_map[4] = 2 * canvas.height / (num_tasks + 1)
                    } else {
                        height_map[3] = 2 * canvas.height / (num_tasks + 1)
                        height_map[4] = 3 * canvas.height / (num_tasks + 1)
                    }
                }
            } else {
                if (t2_en.checked == false) {
                    if (t3_en.checked == false) {
                        height_map[4] = 2 * canvas.height / (num_tasks + 1)
                    } else {
                        height_map[3] = 2 * canvas.height / (num_tasks + 1)
                        height_map[4] = 3 * canvas.height / (num_tasks + 1)
                    }
                } else {
                    if (t3_en.checked == false) {
                        height_map[4] = 3 * canvas.height / (num_tasks + 1)
                    }
                }
            }
            if (counter + times[i] > duration) {
                dur = (duration - counter) / duration * (canvas.width - 120)
                console.log(duration - counter)
                const mySquare = new Rectangle(prev_task.right, height_map[tasks[i]] - 50, dur, 50, colour_map[tasks[i]])
                mySquare.draw()
                prev_task = mySquare
            } else {
                const mySquare = new Rectangle(prev_task.right, height_map[tasks[i]] - 50, dur, 50, colour_map[tasks[i]])
                mySquare.draw()
                prev_task = mySquare
            }
            counter = counter + times[i]
        }

        // createGrid(t)

        if (missing_task_time != -1 && missing_task != -1 && missing_task_time != duration) {
            missed_task_heading.innerHTML = "Task " + (missing_task) + " missed its deadline at t=" + (missing_task_time)
            missed_task_heading.style.color = "red"
            missed_task_heading.style.background = "white"

        } else {
            if (missing_task != -1) {
                missed_task_heading.innerHTML = "No Deadlines Missed"
                missed_task_heading.style.color = "black"
                missed_task_heading.style.background = "white"
            } else {
                missed_task_heading.innerHTML = ""
                missed_task_heading.style.background = "white"
                // missed_task_heading.style.background = "rgb(119, 119, 119)"
            }
        }

        var temp = {}
        for (var j = 1; j < Object.keys(t).length; j++) {
            if (t[j][2] == true) {
                temp[j] = t[j]
                if (t[j][0] == "" || t[j][1] == "" || t[j][3] == "") {
                    alert("Missing Parameters for Task T" + (j))
                    missed_task_heading.innerHTML = ""
                    return { 0: 0, 1: 0 }
                }
            }
        }
        var task_deadlines = {}
        Object.keys(temp).forEach(key => {
            var temp_per = temp[key][1]
            var temp_deadlines = []
            var scale = 0
            while (parseFloat(temp[key][3]) + scale * parseFloat(temp_per) < duration) {
                temp_deadlines.push(parseFloat(temp[key][3]) + scale * parseFloat(temp_per))
                scale += 1
            }
            task_deadlines[key] = temp_deadlines
        });
        console.log(task_deadlines)
        Object.keys(task_deadlines).forEach(key => {
            var count = 0
            task_deadlines[key].forEach(deadline => {
                var x = 60 + (deadline) / duration * (canvas.width - 120)
                var double = 1
                if (count == 0) {
                    double = 0
                    count++
                }
                if (key == missing_task && deadline == missing_task_time) {
                    var myArrow = new Arrow(x, height_map[key], double, "red")
                    myArrow.draw()
                } else {
                    var myArrow = new Arrow(x, height_map[key], double, "silver")
                    myArrow.draw()
                }
            })
        })

        var tableDiv = document.getElementById("tableDiv")
        var tableHeaders = ["Task", "Start Time", "End Time"]

        while (tableDiv.firstChild)
            tableDiv.removeChild(tableDiv.firstChild) // Remove all children from scoreboard div (if any)

        var table = document.createElement("table")
        var thead = document.createElement("thead")
        var tr = document.createElement("tr")

        tableHeaders.forEach(header => {
            var th = document.createElement("th")
            th.innerHTML = header
            tr.append(th)
        })

        thead.append(tr)
        table.append(thead)

        var tbody = document.createElement("tbody")

        var prev_time
        if( tasks[0] == 0){
            prev_time = parseFloat(times[0].toFixed(2))
        } else {
            prev_time = 0
        }
        for (var m = 0; m < tasks.length; m++) {
            var tr = document.createElement("tr")
            var td1 = document.createElement("td")
            var td2 = document.createElement("td")
            var td3 = document.createElement("td")
            if (tasks[m] != 0) {
                td1.innerHTML = "T" + tasks[m]
                td2.innerHTML = prev_time.toFixed(2)
                prev_time += parseFloat(times[m].toFixed(2))
                td3.innerHTML = prev_time.toFixed(2)
                tr.append(td1)
                tr.append(td2)
                tr.append(td3)
            } else {
                td1.innerHTML = "Idle CPU for " + parseFloat(times[m].toFixed(2)) +" time units"
                td1.colSpan = "3"
                tr.append(td1)
            }
            tr.className = "body_row"
            tbody.append(tr)
        }
        table.append(tbody)


        tableDiv.append(table)

    }

    function createGrid(tasks) {
        // draw a line every *step* pixels
        var step = 60;
        var timeline_len = tasks[0]

        var temp = {}
        for (var j = 1; j < Object.keys(tasks).length; j++) {
            if (tasks[j][2] == true)
                temp[j] = tasks[j]
        }
        var num_tasks = Object.keys(temp).length

        // our end points
        const width = canvas.width
        const height = canvas.height

        // set our styles
        ctx.save()
        ctx.strokeStyle = 'gray' // line colors
        ctx.fillStyle = 'black' // text color
        ctx.font = 'bold 14px Monospace'
        ctx.lineWidth = 0.35

        // draw vertical from X to Height
        for (let x = step; x < width; x += step) {
            // draw vertical line
            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, height)
            ctx.stroke()

            // draw text
            ctx.fillText((timeline_len * (x - step) / (width - 2 * step)).toFixed(2), x, canvas.height - 12)
            //ctx.fillText(x, x, canvas.height - 12)
            // if (x == canvas.width - canvas.width / 10) {
            //     ctx.fillText(label * (x + step) / (canvas.width / 10), x + 35, canvas.height - 12)
            // }

        }

        // draw horizontal from Y to Width
        ctx.fillStyle = 'red'
        ctx.font = 'bold 20px Monospace'
        step = canvas.height / (num_tasks + 1)
        var counter = 0;
        for (let y = 0; y < height; y += step) {
            // draw horizontal line
            ctx.beginPath()
            ctx.moveTo(60, y)
            ctx.lineTo(width - 60, y)
            ctx.stroke()

            // draw text
            ctx.fillText("T".concat(Object.keys(temp)[y / step - 1]), 20, Math.round(y - step / 2))
            ctx.fill()
            counter += 1;

        }

        // restore the styles from before this function was called
        ctx.restore()
    }

    class Arrow {
        constructor(
            x = 0, y = 0, double = 0,
            fillColor = '', strokeColor = '', strokeWidth = 2
        ) {
            // ensure the arguments passed in are numbers
            // a bit overkill for this tutorial
            this.x = Number(x)
            this.y = Number(y)
            this.double = Number(double)
            this.fillColor = fillColor
            this.strokeColor = strokeColor
            this.strokeWidth = strokeWidth
        }
        draw() {
            // destructuring
            const {
                x, y, double,
                fillColor, strokeColor, strokeWidth
            } = this

            // saves the current styles set elsewhere
            // to avoid overwriting them
            ctx.save()
            // set the styles for this shape
            ctx.fillStyle = fillColor
            ctx.lineWidth = strokeWidth

            if (double == 0) {
                ctx.beginPath()
                ctx.strokeStyle = strokeColor
                var arrowTip = 70
                var arrowHead = 20
                var baseWidth = 5
                var arrowWidth = 25
                ctx.moveTo(x - baseWidth / 2, y - arrowTip + arrowHead) // starting point
                ctx.lineTo(x - arrowWidth / 2, y - arrowTip + arrowHead)
                ctx.lineTo(x, y - arrowTip) // hypotenuse / long side
                ctx.lineTo(x + arrowWidth / 2, y - arrowTip + arrowHead) // hypotenuse / long side
                ctx.lineTo(x + baseWidth / 2, y - arrowTip + arrowHead)
                ctx.lineTo(x + baseWidth / 2, y)
                ctx.lineTo(x - baseWidth / 2, y)
                ctx.lineTo(x - baseWidth / 2, y - arrowTip + arrowHead)
                ctx.fill() // closes the bottom side & fills
                ctx.stroke()
            } else {
                ctx.beginPath()
                ctx.strokeStyle = strokeColor
                var arrowTip = 70
                var arrowHead = 15
                var baseWidth = 4
                arrowWidth = 20
                ctx.moveTo(x - baseWidth / 2, y - arrowTip + arrowHead) // starting point
                ctx.lineTo(x - arrowWidth / 2, y - arrowTip + arrowHead)
                ctx.lineTo(x, y - arrowTip) // hypotenuse / long side
                ctx.lineTo(x + arrowWidth / 2, y - arrowTip + arrowHead) // hypotenuse / long side
                ctx.lineTo(x + baseWidth / 2, y - arrowTip + arrowHead)
                ctx.lineTo(x + baseWidth / 2, y - arrowHead)
                ctx.lineTo(x + arrowWidth / 2, y - arrowHead)
                ctx.lineTo(x, y)
                ctx.lineTo(x - arrowWidth / 2, y - arrowHead)
                ctx.lineTo(x - baseWidth / 2, y - arrowHead)
                ctx.lineTo(x - baseWidth / 2, y - arrowTip + arrowHead)
                ctx.fill() // closes the bottom side & fills
                ctx.stroke()
            }

            // restores the styles from earlier
            // preventing the colors used here
            // from polluting other drawings
            ctx.restore()
        }
    }

    class Rectangle {
        // you create new Rectangles by calling this as a function
        // these are the arguments you pass in
        // add default values to avoid errors on empty arguments
        constructor(
            x = 0, y = 0,
            width = 0, height = 0,
            fillColor = '', strokeColor = '', strokeWidth = 2
        ) {
            // ensure the arguments passed in are numbers
            // a bit overkill for this tutorial
            this.x = Number(x)
            this.y = Number(y)
            this.width = Number(width)
            this.height = Number(height)
            this.fillColor = fillColor
            this.strokeColor = strokeColor
            this.strokeWidth = strokeWidth
        }

        // get keyword causes this method to be called
        // when you use myRectangle.area
        get area() {
            return this.width * this.height
        }

        // gets the X position of the left side
        get left() {
            // origin is at top left so just return x
            return this.x
        }

        // get X position of right side
        get right() {
            // x is left position + the width to get end point
            return this.x + this.width
        }

        // get the Y position of top side
        get top() {
            // origin is at top left so just return y
            return this.y
        }

        // get Y position at bottom
        get bottom() {
            return this.y + this.height
        }

        // draw rectangle to screen
        draw() {
            // destructuring
            const {
                x, y, width, height,
                fillColor, strokeColor, strokeWidth
            } = this

            // saves the current styles set elsewhere
            // to avoid overwriting them
            ctx.save()

            // set the styles for this shape
            ctx.fillStyle = fillColor
            ctx.lineWidth = strokeWidth

            // create the *path*
            ctx.beginPath()
            ctx.strokeStyle = strokeColor
            ctx.rect(x, y, width, height)

            // draw the path to screen
            ctx.fill()
            ctx.stroke()

            // restores the styles from earlier
            // preventing the colors used here
            // from polluting other drawings
            ctx.restore()
        }
    }

    function RR(t, q) {
        var time = []
        var task = []
        var missed_deadline_task
        var missed_deadline_time = -1
        var dur = t[0]

        var temp = {}
        for (var j = 1; j < Object.keys(t).length; j++) {
            if (t[j][2] == true) {
                temp[j] = t[j]
                if (t[j][0] == "" || t[j][1] == "" || t[j][3] == "") {
                    alert("Missing Parameters for Task T" + (j))
                    missed_task_heading.innerHTML = ""
                    return { 0: 0, 1: 0 }
                }
            }
        }

        var task_deadlines = {}
        var deadlines = new Set()
        deadlines.add(0)
        deadlines.add(parseFloat(dur))
        // var priorities = {}
        var has_complete = {}
        Object.keys(temp).forEach(key => {
            var temp_per = temp[key][1]
            // priorities[key] = 100000 - temp_per
            if (temp[key][3] != 0) {
                has_complete[key] = parseFloat(temp[key][0])
            } else {
                has_complete[key] = 0
            }
            var temp_deadlines = []
            var scale = 0
            while (parseFloat(temp[key][3]) + scale * parseFloat(temp_per) <= dur) {
                deadlines.add(parseFloat(temp[key][3]) + scale * parseFloat(temp_per))
                temp_deadlines.push(parseFloat(temp[key][3]) + scale * parseFloat(temp_per))
                scale += 1
            }
            task_deadlines[key] = temp_deadlines
        });
        deadlines = [...deadlines]
        deadlines.sort(function (a, b) { return a - b });

        console.log(deadlines)
        console.log(task_deadlines)
        console.log(t)

        var queue = []
        var prev_end_time = 0
        var deadlines_met = { 1: [], 2: [], 3: [], 4: [] }
        var temp_q = q
        deadlines.forEach(deadline => {
            console.log("New Deadline: " + (deadline))
            var keep_going = true
            console.log("Queue before: " + ([...queue]))
            // Object.keys(temp).forEach(key => {
            //     if (task_deadlines[key].includes(deadline)) {
            //         console.log((task_deadlines[key]) + " contains: " + (deadline))
            //         // has_complete[key] = 0
            //         console.log("Index: " + (key) + " -> " + (has_complete[key]))
            //         // if (!queue.includes(key)) {
            //         // if (has_complete[key] == parseFloat(temp[key][0])) {
            //         // has_complete[key] = 0
            //         // }
            //         if (!queue.includes(key)) {
            //             queue.push(key)
            //             has_complete[key] = 0
            //         }
            //     }
            // })
            // console.log("Queue after: " + ([...queue]))
            // var limiter = 0
            var flag = -1
            while (keep_going) {
                console.log("TEMP Q: " + temp_q)
                if (temp_q == 0) {
                    temp_q = q
                }

                // limiter++
                // if (limiter > 15) {
                //     keep_going = false
                //     console.log("ERROR OCCURED")
                // }
                console.log("DEADLINE: " + (deadline) + " PREV: " + (prev_end_time))
                if (deadline > prev_end_time) {
                    console.log("QUEUE: " + ([...queue]))
                    var max_priority_index
                    if (queue.length != 0) {
                        if (flag == -1) {
                            max_priority_index = queue.shift()
                            queue.unshift(max_priority_index)
                        } else {
                            max_priority_index = flag
                            queue.splice(queue.indexOf(max_priority_index), 1)

                        }
                        console.log("MAX PRIORITY: " + max_priority_index + " Flag: " + flag)
                        // var temp_deadline = task_deadlines[max_priority_index].shift()
                        // task_deadlines[max_priority_index].unshift(temp_deadline)
                        console.log("Time Left Before: " + (parseFloat(temp[max_priority_index][0]) - has_complete[max_priority_index]))
                        if (has_complete[max_priority_index] != parseFloat(temp[max_priority_index][0]) && (deadline > temp[max_priority_index][3])) {
                            if ((prev_end_time + (parseFloat(temp[max_priority_index][0]) - has_complete[max_priority_index]) > deadline)) {
                                console.log(parseFloat(deadline), parseFloat(prev_end_time), parseFloat(temp_q))
                                if ((parseFloat(deadline) - parseFloat(prev_end_time)) > parseFloat(temp_q)) {
                                    console.log("Queue q1: " + ([...queue]))
                                    time.push(parseFloat(temp_q))
                                    task.push(parseFloat(max_priority_index))
                                    has_complete[max_priority_index] = parseFloat(has_complete[max_priority_index]) + parseFloat(temp_q)
                                    prev_end_time = prev_end_time + parseFloat(temp_q)
                                    queue.splice(queue.indexOf(max_priority_index), 1)
                                    queue.push(max_priority_index)
                                } else {
                                    console.log("Queue q2: " + ([...queue]))
                                    time.push(parseFloat(deadline) - parseFloat(prev_end_time))
                                    task.push(parseFloat(max_priority_index))
                                    has_complete[max_priority_index] = parseFloat(has_complete[max_priority_index]) + (parseFloat(deadline) - parseFloat(prev_end_time))
                                    temp_q -= (parseFloat(deadline) - parseFloat(prev_end_time))
                                    // console.log("Intermediate temp_q: " + temp_q)
                                    // console.log(parseFloat(deadline) - parseFloat(prev_end_time))
                                    if (temp_q == 0) {
                                        queue.splice(queue.indexOf(max_priority_index), 1)
                                        queue.push(max_priority_index)
                                        temp_q = q
                                    }
                                    prev_end_time = parseFloat(deadline)
                                    // queue.splice(queue.indexOf(max_priority_index), 1)
                                    // queue.push(max_priority_index)
                                }
                            } else {
                                if (parseFloat(temp[max_priority_index][0]) - parseFloat(has_complete[max_priority_index]) > temp_q) {
                                    prev_end_time = parseFloat(prev_end_time) + parseFloat(temp_q)
                                    time.push(parseFloat(temp_q))
                                    task.push(parseFloat(max_priority_index))
                                    has_complete[max_priority_index] = parseFloat(has_complete[max_priority_index]) + parseFloat(temp_q)
                                    queue.splice(queue.indexOf(max_priority_index), 1)
                                    queue.push(max_priority_index)
                                    temp_q = q
                                    // queue.shift()
                                } else {
                                    prev_end_time = parseFloat(prev_end_time) + parseFloat(temp[max_priority_index][0]) - parseFloat(has_complete[max_priority_index])
                                    time.push(parseFloat(temp[max_priority_index][0]) - parseFloat(has_complete[max_priority_index]))
                                    task.push(parseFloat(max_priority_index))
                                    has_complete[max_priority_index] = parseFloat(temp[max_priority_index][0])
                                    queue.splice(queue.indexOf(max_priority_index), 1)
                                    deadlines_met[max_priority_index].push(task_deadlines[max_priority_index][deadlines_met[max_priority_index].length + 1])
                                    temp_q = q
                                }
                                // if (queue.includes(max_priority_index)) {
                                //     if (queue.indexOf(max_priority_index) == 0) {
                                //         time.push(deadline - prev_end_time)
                                //         task.push(0)
                                //         prev_end_time = deadline
                                //         keep_going = false
                                //         // has_complete[max_priority_index] = parseFloat(temp[max_priority_index][0])
                                //         has_complete[max_priority_index] = 0
                                //     } else {
                                //         // has_complete[max_priority_index] = 0
                                //     }
                                // } else {
                                //     has_complete[max_priority_index] = parseFloat(temp[max_priority_index][0])
                                //     // console.log("Deadlines_met length: " + (deadlines_met.length))
                                // }
                            }
                        } else {
                            flag = -1
                            queue.forEach(key => {
                                if (has_complete[key] != parseFloat(temp[key][0] && flag == -1)) {
                                    flag = key
                                }
                            })
                            if (flag == -1) {
                                time.push(deadline - prev_end_time)
                                task.push(0)
                                prev_end_time = deadline
                                keep_going = false
                            }
                        }
                        console.log("Time Left After: " + (parseFloat(temp[max_priority_index][0]) - has_complete[max_priority_index]))
                        console.log("Queue after: " + ([...queue]))

                        Object.keys(temp).forEach(key => {
                            if (task_deadlines[key].includes(prev_end_time)) {
                                console.log((task_deadlines[key]) + " contains: " + (prev_end_time))
                                // has_complete[key] = 0
                                console.log("Index: " + (key) + " -> " + (has_complete[key]))
                                // if (!queue.includes(key)) {
                                // if (has_complete[key] == parseFloat(temp[key][0])) {
                                // has_complete[key] = 0
                                // }

                                if (!queue.includes(key)) {
                                    if (queue.includes(max_priority_index) && queue.length != 1 && (temp_q == q)) {
                                        var tail = queue.pop()
                                        queue.push(key)
                                        has_complete[key] = 0
                                        queue.push(tail)
                                        console.log([...queue])
                                    } else {
                                        queue.push(key)
                                        has_complete[key] = 0
                                    }
                                }
                            }
                        })
                    } else {
                        time.push(deadline - prev_end_time)
                        task.push(0)
                        prev_end_time = deadline
                        keep_going = false
                    }

                } else if (deadline == 0) {
                    Object.keys(temp).forEach(key => {
                        if (task_deadlines[key].includes(deadline)) {
                            has_complete[key] = 0
                            if (!queue.includes(key)) {
                                if (queue.includes(max_priority_index) && queue.length != 1 && (temp_q == q)) {
                                    var tail = queue.pop()
                                    queue.push(key)
                                    has_complete[key] = 0
                                    queue.push(tail)
                                    console.log([...queue])
                                } else {
                                    queue.push(key)
                                    has_complete[key] = 0
                                }
                            }
                        }
                    })
                    keep_going = false
                } else {
                    Object.keys(temp).forEach(key => {
                        if ((deadline - parseFloat(temp[key][3])) % parseFloat(temp[key][1]) == 0 && deadline != 0) {
                            console.log("Completed time: " + (has_complete[key]) + " Time required: " + (temp[key][0]) + " In queue?: " + (queue.includes(key)))
                            console.log([...deadlines_met[key]])
                            console.log(deadline)
                            console.log("Deadlines met: " + (deadlines_met[key]))

                            if (!deadlines_met[key].includes(deadline) && deadline != parseFloat(temp[key][3])) {
                                if (missed_deadline_time == -1) {
                                    console.log("DEADLINE MISSED")
                                    console.log(deadline - parseFloat(temp[key][3])) % parseFloat(temp[key][1])
                                    missed_deadline_task = key
                                    missed_deadline_time = deadline
                                }
                            }
                            if (!queue.includes(key)) {
                                has_complete[key] = 0
                            }

                        }
                    })
                    keep_going = false
                }

            }
            Object.keys(temp).forEach(key => {
                if (task_deadlines[key].includes(deadline)) {
                    console.log((task_deadlines[key]) + " contains: " + (deadline))
                    // has_complete[key] = 0
                    console.log("Index: " + (key) + " -> " + (has_complete[key]))
                    // if (!queue.includes(key)) {
                    // if (has_complete[key] == parseFloat(temp[key][0])) {
                    // has_complete[key] = 0
                    // }
                    if (!queue.includes(key)) {
                        if (queue.includes(max_priority_index) && queue.length != 1 && (temp_q == q)) {
                            var tail = queue.pop()
                            queue.push(key)
                            has_complete[key] = 0
                            queue.push(tail)
                            console.log([...queue])
                        } else {
                            queue.push(key)
                            has_complete[key] = 0
                        }
                    }
                }
            })
            console.log("Queue at end: " + queue)
            console.log(time, task)
        })
        return { 0: time, 1: task, 2: { "task": missed_deadline_task, "time": missed_deadline_time } }
    }

    function FCFS(t) {
        var time = []
        var task = []
        var missed_deadline_task
        var missed_deadline_time = -1
        var dur = t[0]

        var temp = {}
        for (var j = 1; j < Object.keys(t).length; j++) {
            if (t[j][2] == true) {
                temp[j] = t[j]
                if (t[j][0] == "" || t[j][1] == "" || t[j][3] == "") {
                    alert("Missing Parameters for Task T" + (j))
                    missed_task_heading.innerHTML = ""
                    return { 0: 0, 1: 0 }
                }
            }
        }

        var task_deadlines = {}
        var deadlines = new Set()
        deadlines.add(0)
        deadlines.add(parseFloat(dur))
        // var priorities = {}
        var has_complete = {}
        Object.keys(temp).forEach(key => {
            var temp_per = temp[key][1]
            // priorities[key] = 100000 - temp_per
            if (temp[key][3] != 0) {
                has_complete[key] = parseFloat(temp[key][0])
            } else {
                has_complete[key] = 0
            }
            var temp_deadlines = []
            var scale = 0
            while (parseFloat(temp[key][3]) + scale * parseFloat(temp_per) <= dur) {
                deadlines.add(parseFloat(temp[key][3]) + scale * parseFloat(temp_per))
                temp_deadlines.push(parseFloat(temp[key][3]) + scale * parseFloat(temp_per))
                scale += 1
            }
            task_deadlines[key] = temp_deadlines
        });
        deadlines = [...deadlines]
        deadlines.sort(function (a, b) { return a - b });

        console.log(deadlines)
        console.log(task_deadlines)
        console.log(t)

        var queue = []
        var prev_end_time = 0
        var deadlines_met = { 1: [], 2: [], 3: [], 4: [] }
        deadlines.forEach(deadline => {
            console.log("New Deadline: " + (deadline))
            var keep_going = true
            console.log("Queue before: " + ([...queue]))
            // Object.keys(temp).forEach(key => {
            //     if (task_deadlines[key].includes(deadline)) {
            //         console.log((task_deadlines[key]) + " contains: " + (deadline))
            //         // has_complete[key] = 0
            //         console.log("Index: " + (key) + " -> " + (has_complete[key]))
            //         // if (!queue.includes(key)) {
            //         if (has_complete[key] == parseFloat(temp[key][0])) {
            //             has_complete[key] = 0
            //         }
            //         queue.push(key)
            //     }
            // })
            // console.log("Queue after: " + ([...queue]))
            // var limiter = 0
            while (keep_going) {
                // limiter++
                // if (limiter > 15) {
                //     keep_going = false
                //     console.log("ERROR OCCURED")
                // }
                console.log("DEADLINE: " + (deadline) + " PREV: " + (prev_end_time))
                if (deadline > prev_end_time) {
                    console.log("QUEUE: " + ([...queue]))

                    if (queue.length != 0) {
                        var max_priority_index = queue.shift()
                        queue.unshift(max_priority_index)
                        console.log("MAX PRIORITY: " + max_priority_index)
                        // var temp_deadline = task_deadlines[max_priority_index].shift()
                        // task_deadlines[max_priority_index].unshift(temp_deadline)
                        console.log("Time Left Before: " + (parseFloat(temp[max_priority_index][0]) - has_complete[max_priority_index]))
                        if (has_complete[max_priority_index] != parseFloat(temp[max_priority_index][0]) && (deadline > temp[max_priority_index][3])) {
                            if ((prev_end_time + (parseFloat(temp[max_priority_index][0]) - has_complete[max_priority_index]) > deadline)) {
                                time.push(parseFloat(deadline) - parseFloat(prev_end_time))
                                task.push(parseFloat(max_priority_index))
                                has_complete[max_priority_index] = parseFloat(has_complete[max_priority_index]) + (parseFloat(deadline) - parseFloat(prev_end_time))
                                prev_end_time = parseFloat(deadline)
                            } else {
                                prev_end_time = parseFloat(prev_end_time) + parseFloat(temp[max_priority_index][0]) - parseFloat(has_complete[max_priority_index])
                                time.push(parseFloat(temp[max_priority_index][0]) - parseFloat(has_complete[max_priority_index]))
                                task.push(parseFloat(max_priority_index))
                                queue.shift()
                                if (queue.includes(max_priority_index)) {
                                    if (queue.indexOf(max_priority_index) == 0) {
                                        time.push(deadline - prev_end_time)
                                        task.push(0)
                                        prev_end_time = deadline
                                        keep_going = false
                                        // has_complete[max_priority_index] = parseFloat(temp[max_priority_index][0])
                                        has_complete[max_priority_index] = 0
                                    } else {
                                        has_complete[max_priority_index] = 0
                                    }
                                } else {
                                    has_complete[max_priority_index] = parseFloat(temp[max_priority_index][0])
                                    // console.log("Deadlines_met length: " + (deadlines_met.length))
                                }
                                deadlines_met[max_priority_index].push(task_deadlines[max_priority_index][deadlines_met[max_priority_index].length + 1])
                            }
                        } else {
                            time.push(deadline - prev_end_time)
                            task.push(0)
                            prev_end_time = deadline
                            keep_going = false
                        }
                        console.log("Time Left After: " + (parseFloat(temp[max_priority_index][0]) - has_complete[max_priority_index]))
                    } else {
                        time.push(deadline - prev_end_time)
                        task.push(0)
                        prev_end_time = deadline
                        keep_going = false
                    }

                } else if (deadline == 0) {
                    Object.keys(temp).forEach(key => {
                        if (task_deadlines[key].includes(deadline)) {
                            has_complete[key] = 0
                            if (!queue.includes(key)) {
                                queue.push(key)
                            }
                        }
                    })
                    keep_going = false
                } else {
                    Object.keys(temp).forEach(key => {
                        if ((deadline - parseFloat(temp[key][3])) % parseFloat(temp[key][1]) == 0 && deadline != 0) {
                            console.log("Completed time: " + (has_complete[key]) + " Time required: " + (temp[key][0]) + " In queue?: " + (queue.includes(key)))
                            console.log([...deadlines_met[key]])
                            console.log(deadline)
                            console.log("Deadlines met: " + (deadlines_met[key]))

                            if (!deadlines_met[key].includes(deadline) && deadline != parseFloat(temp[key][3])) {
                                if (missed_deadline_time == -1) {
                                    console.log("DEADLINE MISSED")
                                    console.log(deadline - parseFloat(temp[key][3])) % parseFloat(temp[key][1])
                                    missed_deadline_task = key
                                    missed_deadline_time = deadline
                                }
                            }
                            if (!queue.includes(key)) {
                                has_complete[key] = 0
                            }

                        }
                    })
                    keep_going = false
                }

            }
            console.log("Queue intermediate: " + ([...queue]))
            Object.keys(temp).forEach(key => {
                if (task_deadlines[key].includes(deadline) && deadline != 0) {
                    console.log((task_deadlines[key]) + " contains: " + (deadline))
                    // has_complete[key] = 0
                    console.log("Index: " + (key) + " -> " + (has_complete[key]))
                    // if (!queue.includes(key)) {
                    if (has_complete[key] == parseFloat(temp[key][0])) {
                        has_complete[key] = 0
                    }
                    queue.push(key)
                }
            })
            console.log("Queue after: " + ([...queue]))

            console.log(time, task)
        })
        return { 0: time, 1: task, 2: { "task": missed_deadline_task, "time": missed_deadline_time } }
    }


    function EDF(t) {

        var time = []
        var task = []
        var missed_deadline_task
        var missed_deadline_time = -1

        var dur = t[0]

        var temp = {}
        for (var j = 1; j < Object.keys(t).length; j++) {
            if (t[j][2] == true) {
                temp[j] = t[j]
                if (t[j][0] == "" || t[j][1] == "" || t[j][3] == "") {
                    alert("Missing Parameters for Task T" + (j))
                    missed_task_heading.innerHTML = ""
                    return { 0: 0, 1: 0 }
                }
            }
        }

        var task_deadlines = {}
        var deadlines = new Set()
        deadlines.add(0)
        deadlines.add(parseFloat(dur))
        // var priorities = {}
        var has_complete = {}
        Object.keys(temp).forEach(key => {
            var temp_per = temp[key][1]
            // priorities[key] = 100000 - temp_per
            if (temp[key][3] != 0) {
                has_complete[key] = parseFloat(temp[key][0])
            } else {
                has_complete[key] = 0
            }
            var temp_deadlines = []
            var scale = 0
            while (parseFloat(temp[key][3]) + scale * parseFloat(temp_per) <= dur) {
                deadlines.add(parseFloat(temp[key][3]) + scale * parseFloat(temp_per))
                scale += 1
                temp_deadlines.push(parseFloat(temp[key][3]) + scale * parseFloat(temp_per))
            }
            task_deadlines[key] = temp_deadlines
        });
        deadlines = [...deadlines]
        deadlines.sort(function (a, b) { return a - b });

        // console.log([...task_deadlines[1]])
        console.log(deadlines)
        var prev_end_time = 0
        deadlines.forEach(deadline => {
            console.log("NEW DEADLINE " + (deadline))
            var keep_going = true
            while (keep_going) {
                var priorities = {}
                Object.keys(temp).forEach(key => {
                    var next_deadline = task_deadlines[key].shift()
                    task_deadlines[key].unshift(next_deadline)
                    priorities[key] = 10000 - next_deadline
                });
                console.log("PRIORITIES: ", (priorities))
                console.log("At Deadline: " + (deadline))
                console.log("Prev end time: " + (prev_end_time))
                console.log(has_complete)
                if (deadline > prev_end_time) {
                    var max_priority = -1
                    var max_priority_index = -1
                    Object.keys(priorities).forEach(key => {
                        var temp_per = temp[key][1]
                        if (has_complete[key] < temp[key][0]) {
                            if (priorities[key] > max_priority) {
                                max_priority = priorities[key]
                                max_priority_index = key
                            }
                        }
                    })
                    console.log("MAX PRIORITY D>prev: ".concat(max_priority_index))
                    if (max_priority != -1) {

                        var toContinue = false

                        Object.keys(priorities).forEach(key => {
                            if (priorities[key] > priorities[max_priority_index])
                                if ((deadline - temp[key][3]) % temp[key][1] == 0)
                                    toContinue = true
                        })
                        console.log(toContinue)
                        console.log(prev_end_time + parseFloat(temp[max_priority_index][0]) > deadline)

                        if (toContinue || (prev_end_time + (parseFloat(temp[max_priority_index][0]) - has_complete[max_priority_index]) > deadline)) {
                            time.push(parseFloat(deadline) - parseFloat(prev_end_time))
                            task.push(parseFloat(max_priority_index))
                            has_complete[max_priority_index] = parseFloat(has_complete[max_priority_index]) + (parseFloat(deadline) - parseFloat(prev_end_time))
                            prev_end_time = parseFloat(deadline)
                        } else {
                            // if (deadline - prev_end_time >= parseFloat(temp[max_priority_index][0]) - has_complete[max_priority_index]) {
                            prev_end_time = parseFloat(prev_end_time) + parseFloat(temp[max_priority_index][0]) - parseFloat(has_complete[max_priority_index])
                            time.push(parseFloat(temp[max_priority_index][0]) - parseFloat(has_complete[max_priority_index]))
                            task.push(parseFloat(max_priority_index))
                            has_complete[max_priority_index] = parseFloat(temp[max_priority_index][0])
                            task_deadlines[max_priority_index].shift()
                            // } else {
                            //     prev_end_time = deadline
                            //     time.push(parseFloat(temp[max_priority_index][0]) - parseFloat(has_complete[max_priority_index]))
                            //     task.push(parseFloat(max_priority_index))
                            //     has_complete[max_priority_index] = parseFloat(temp[max_priority_index][0])
                            // }
                        }
                    } else {
                        time.push(deadline - prev_end_time)
                        task.push(0)
                        prev_end_time = deadline
                        keep_going = true
                    }
                } else {
                    Object.keys(priorities).forEach(key => {
                        var temp_per = temp[key][1]
                        if ((deadline - temp[key][3]) % temp[key][1] == 0 && deadline != 0) {
                            if (has_complete[key] != temp[key][0]) {
                                task_deadlines[key].shift()
                                if (missed_deadline_time == -1) {
                                    missed_deadline_task = key
                                    missed_deadline_time = deadline//(deadline - temp[key][3])
                                }
                            }
                            has_complete[key] = 0
                        }
                    })
                    keep_going = false
                }
                console.log(time, task)
            }
        })

        console.log(time, task)
        console.log({ "task": missed_deadline_task, "time": missed_deadline_time })
        return { 0: time, 1: task, 2: { "task": missed_deadline_task, "time": missed_deadline_time } }


    }

    function RM(t) {

        var time = []
        var task = []
        var missed_deadline_task
        var missed_deadline_time = -1

        var dur = t[0]

        var temp = {}
        for (var j = 1; j < Object.keys(t).length; j++) {
            if (t[j][2] == true) {
                temp[j] = t[j]
                if (t[j][0] == "" || t[j][1] == "" || t[j][3] == "") {
                    alert("Missing Parameters for Task T" + (j))
                    missed_task_heading.innerHTML = ""
                    return { 0: 0, 1: 0 }
                }
            }
        }

        var deadlines = new Set()
        deadlines.add(0)
        deadlines.add(parseFloat(dur))
        var priorities = {}
        var has_complete = {}
        Object.keys(temp).forEach(key => {
            var temp_per = temp[key][1]
            priorities[key] = 1000 - temp_per
            if (temp[key][3] != 0) {
                has_complete[key] = parseFloat(temp[key][0])
            } else {
                has_complete[key] = 0
            }
            var scale = 0
            while (parseFloat(temp[key][3]) + scale * parseFloat(temp_per) <= dur) {
                deadlines.add(parseFloat(temp[key][3]) + scale * parseFloat(temp_per))
                scale += 1
            }
        });
        deadlines = [...deadlines]
        deadlines.sort(function (a, b) { return a - b });

        console.log(deadlines)
        var prev_end_time = 0
        deadlines.forEach(deadline => {
            console.log("NEW DEADLINE " + (deadline))
            var keep_going = true
            while (keep_going) {
                console.log("At Deadline: " + (deadline))
                console.log("Prev end time: " + (prev_end_time))
                console.log(has_complete)
                if (deadline > prev_end_time) {
                    var max_priority = -1
                    var max_priority_index = -1
                    Object.keys(priorities).forEach(key => {
                        var temp_per = temp[key][1]
                        if (has_complete[key] < temp[key][0]) {
                            if (priorities[key] > max_priority) {
                                max_priority = priorities[key]
                                max_priority_index = key
                            }
                        }
                    })
                    console.log("MAX PRIORITY D>prev: ".concat(max_priority_index))
                    if (max_priority != -1) {

                        var toContinue = false

                        Object.keys(priorities).forEach(key => {
                            if (priorities[key] > priorities[max_priority_index])
                                if ((deadline - temp[key][3]) % temp[key][1] == 0)
                                    toContinue = true
                        })
                        console.log(toContinue)
                        console.log(prev_end_time + parseFloat(temp[max_priority_index][0]) > deadline)

                        if (toContinue && (prev_end_time + (parseFloat(temp[max_priority_index][0]) - has_complete[max_priority_index]) > deadline)) {
                            time.push(parseFloat(deadline) - parseFloat(prev_end_time))
                            task.push(parseFloat(max_priority_index))
                            has_complete[max_priority_index] = parseFloat(has_complete[max_priority_index]) + (parseFloat(deadline) - parseFloat(prev_end_time))
                            prev_end_time = parseFloat(deadline)
                        } else {
                            prev_end_time = parseFloat(prev_end_time) + parseFloat(temp[max_priority_index][0]) - parseFloat(has_complete[max_priority_index])
                            time.push(parseFloat(temp[max_priority_index][0]) - parseFloat(has_complete[max_priority_index]))
                            task.push(parseFloat(max_priority_index))
                            has_complete[max_priority_index] = parseFloat(temp[max_priority_index][0])
                        }
                    } else {
                        time.push(deadline - prev_end_time)
                        task.push(0)
                        prev_end_time = deadline
                        keep_going = true
                    }
                } else {
                    Object.keys(priorities).forEach(key => {
                        var temp_per = temp[key][1]
                        if ((deadline - temp[key][3]) % temp[key][1] == 0 && deadline != 0) {
                            if (has_complete[key] != temp[key][0] && missed_deadline_time == -1) {
                                missed_deadline_task = key
                                missed_deadline_time = deadline
                            }
                            has_complete[key] = 0
                        }
                    })
                    keep_going = false
                }
                console.log(time, task)
            }
        })

        console.log(time, task)
        console.log({ "task": missed_deadline_task, "time": missed_deadline_time })
        return { 0: time, 1: task, 2: { "task": missed_deadline_task, "time": missed_deadline_time } }


    }
})();