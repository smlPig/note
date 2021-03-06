/**
 * @author NZQ
 * @data 2019/3/10
 * @Description :
 */
/*
 *            A
 *         B       C
 *      D     E  F  G
 *    H  I  J  K
 */
let tree = {
    "data": "A",
    "left": {
        "data": "B",
        "left": {
            "data": "D",
            "left": {
                "data": "H",
                "left": {},
                "right": {
                    "data": "K",
                    "left": {},
                    "right": {}
                }
            },
            "right": {}
        },
        "right": {
            "data": "E",
            "left": {},
            "right": {}
        }
    },
    "right": {
        "data": "C",
        "left": {
            "data": "F",
            "left": {
                "data": "I",
                "left": {},
                "right": {}
            },
            "right": {}
        },
        "right": {
            "data": "G",
            "left": {},
            "right": {
                "data": "J",
                "left": {},
                "right": {}
            }
        }
    }
}

function traverseTree(tree) {
    let buffArr = [];
    let resStr = "";
    let tempObj = null;
    if (tree.data) {
        buffArr.unshift(tree);
    }
    while (buffArr.length) {
        tempObj = buffArr.pop();
        resStr += tempObj.data;
        if (tempObj.left.data) {
            buffArr.unshift(tempObj.left);
        }
        if (tempObj.right.data) {
            buffArr.unshift(tempObj.right);
        }
    }

    return resStr;
}
/**
 * @author Nzq
 * @date 2019/3/10
 * @Description: 上面的tree 是下面数组先序遍历生成的树
 * @Param:
 */
console.log(traverseTree(tree));