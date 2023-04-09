function copyArrayAndMultiplyBy2(arr) {
    const output = []
    for (let i = 0; i < arr.length; i++) {
        output.push(arr[i] * 2)
    }
    return output
}
const myArray = [1, 2, 3]
const result1 = copyArrayAndMultiplyBy2(myArray)

function copyArrayAndManipulate(arr, instructions) {
    const output = []
    for (let i = 0; i < arr.length; i++) {
        output.push(instructions(arr[i]))
    }
    return output
}

const result2 = copyArrayAndManipulate(
    [1, 2, 3],
    (input) => `${input * 10} bobs`
)

console.log(result2)
