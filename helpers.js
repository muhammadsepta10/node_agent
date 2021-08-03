const {execSync}= require("child_process")
const {networkInterfaces} = require("os")
const os = require('os')

exports.getIp = ()=>{
const nets = networkInterfaces();

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
            if(name=="eth0"||name=="ens18"){
                return net.address
            }
        }
    }
}

}

exports.getDisk = ()=>{
    let returnValue = []
    let diskValue = Buffer.from(execSync("df -k")).toString("ascii").split("\n")
    diskValue = diskValue.map(val=>{
        return val.split(" ").filter(fil=>{
            return fil && fil!=""
        })
    })
    diskValue = diskValue.filter(val=>{
        return val.length>0
    })
    for (let index = 0; index < diskValue.length; index++) {
        if (index>0) {
            let objData = {}
            const data = diskValue[index]
            data.map((val,i)=>{
                if (diskValue[0][i]) {
                    objData[diskValue[0][i].replace(/[^a-zA-Z]+/g,"").toLocaleLowerCase()] = +val?+(val/1024/1024).toFixed(2):val
                }
            })
            returnValue.push(objData)
        }
    }
    return returnValue
}

exports.getMemory=()=>{
    const total = +(os.totalmem()/1024/1024/1024).toFixed(2)
    const free = +(os.freemem()/1024/1024/1024).toFixed(2)
    const used = +(total-free).toFixed(2)
    return {total,free,used}
    // let diskValue = Buffer.from(execSync("free -k | awk 'NR<3'")).toString("ascii").split("\n")
    // diskValue = diskValue.map(val=>{
    //     return val.split(" ").filter(fil=>{
    //         return fil && fil!=""
    //     })
    // })
    // diskValue = diskValue.filter(val=>{
    //     return val.length>0
    // })
    // for (let index = 0; index < diskValue.length; index++) {
    //    if (index>0) {
    //         let objData = {}
    //         const data = diskValue[index]
    //         data.map((val,i)=>{
    //            if (diskValue[0][i-1]&&i>0) {
    //                 objData[diskValue[0][i-1].replace(/[^a-zA-Z]+/g,"").toLocaleLowerCase()] = +val?+(val/1024/1024).toFixed(2):val
    //            }
    //         })
    //         return objData
    //    }
    // }
}


function getCPUInfo(){ 
    let cpus = os.cpus();
    let user = 0;
    let nice = 0;
    let sys = 0;
    let idle = 0;
    let irq = 0;
    let total = 0;
    for(let cpu in cpus){	
        user += cpus[cpu].times.user;
        nice += cpus[cpu].times.nice;
        sys += cpus[cpu].times.sys;
        irq += cpus[cpu].times.irq;
        idle += cpus[cpu].times.idle;
    }
    total = user + nice + sys + idle + irq;
    return {
        'idle': idle, 
        'total': total
    };
}

let stats1 = getCPUInfo();

exports.cpu = async()=>{
    const stats2 = getCPUInfo();
    const endIdle = stats2.idle;
    const endTotal = stats2.total;
    const idle 	= endIdle - stats1.idle;
    const total = endTotal - stats1.total;
    const free	= +((idle / total)*100).toFixed(2)
    const usage = +(100 - free).toFixed(2)
    stats1 = getCPUInfo()
    return {usage,free,total:100}

}
