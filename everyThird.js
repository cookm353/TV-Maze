function everyThird(nums) {
    const everyThirdNum = nums.filter((num, i) => {
        return i % 3 === 2;
    })
}

// everyThird([1, 2, 3, 4, 5, 6, 7, 8, 9]);
module.exports = everyThird;

