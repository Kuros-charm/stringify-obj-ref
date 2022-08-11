function uuid() {
    return new Date().valueOf() * (Math.random() + 1)
}

function _stringify(obj) {
    const cleanObjs = {};
    uuidF = 'uuidF'

    if (Array.isArray(obj)) {
        if (!obj.length || obj[obj.length - 1][uuidF] === undefined) {
            const out = []
            const myuuid = uuid()
            obj.push({ [uuidF]: myuuid })

            for (var x of obj) {
                if (x[uuidF] !== myuuid) {
                    const [uid, cObjs] = _stringify(x)
                    out.push(uid);
                    Object.assign(cleanObjs, cObjs)
                }

            }

            cleanObjs[myuuid] = out

            return [myuuid, cleanObjs]
        } else {
            const myuuid = obj[obj.length - 1][uuidF]

            return [myuuid, cleanObjs]
        }

    } else

        if (typeof obj === 'object') {
            if (obj[uuidF] === undefined) {
                const out = {};
                const myuuid = uuid()
                obj[uuidF] = myuuid

                for (var k in obj) {
                    if (k !== uuidF) {
                        const [uid, cObjs] = _stringify(obj[k])
                        out[k] = uid;

                        Object.assign(cleanObjs, cObjs)
                    }

                }

                cleanObjs[myuuid] = out

                return [myuuid, cleanObjs]
            } else {
                const myuuid = obj[uuidF]

                return [myuuid, cleanObjs]
            }
        }

    return [obj, {}]
}
function stringify(obj) {
    txt = JSON.stringify(_stringify(obj));
    purify(obj);
    return txt
}
function _parse(pack) {
    const [myuuid, cleanObjs] = pack;
    return constructObjs(myuuid, cleanObjs);

}
function constructObjs(uuid, pack) {
    var isClean = true
    const obj = pack[uuid];
    if (Array.isArray(obj)) {
        const temp = [].concat(obj);
        obj.splice(0, obj.length);

        for (var x of temp) {
            if (pack[x] !== undefined) { // in pack, x is uuid
                obj.push(constructObjs(x, pack));
            } else {
                obj.push(x);
            }

        }
        return obj;

    } else if (typeof obj === 'object') {
        const temp = Object.assign({}, obj);
        Object.keys(obj).forEach(k => delete obj[k]);
        for (var k in temp) {
            if (pack[temp[k]] !== undefined) { // in pack, value is uuid
                obj[k] = constructObjs(temp[k], pack);
            } else {
                obj[k] = temp[k];
            }
        }
        return obj
    } else {
        console.log('what are u???');
        console.log(uuid);

    }

}

function parse(text) {
    return _parse(JSON.parse(text))

}
function purify(obj) {
    uuidF = 'uuidF'

    if (Array.isArray(obj) && obj.length && obj[obj.length - 1][uuidF] !== undefined) {
        obj.splice(obj.length - 1, 1);
        for (var x of obj) {
            purify(x);
        }

    } else if (typeof obj === 'object' && obj[uuidF] !== undefined) {
        delete (obj[uuidF]);
        for (var k in obj) {
            purify(obj[k]);
        }
    }

}

const a = { x: 1 }
const aa = { x: 1 }
const obj = { value: 10 };
obj['children'] = [{ parent: obj }]
//tt1 = JSON.stringify(obj);

t = stringify(obj)

//tt2 = JSON.stringify(obj);
console.log(t);

newObj = parse(t);
newObj.children[0].parent.value = 100

console.log(newObj.value);

