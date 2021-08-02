// const XLSX = require("xlsx")
const {execSync}= require("child_process")
const {networkInterfaces} = require("os")
const os = require('os')
// exports.loadExcel = (file) => {
//     return new Promise((resolve, reject) => {
//         var wb = XLSX.readFile(file);
//         const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
//         let jsonData = []
//         for (let index = 0; index < data.length; index++) {
//             let obj = {}
//             for (let index2 = 0; index2 < data[index].length; index2++) {
//                 obj[data[0][index2].replace(/\s/g, '')] = data[index][index2]
//             }
//             if (index > 0) {
//                 jsonData.push(obj)
//             }
//         }
//         resolve(jsonData)
//     })
// }

exports.getIp = ()=>{
const nets = networkInterfaces();

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
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
                    objData[diskValue[0][i].replace(/[^a-zA-Z]+/g,"").toLocaleLowerCase()] = val
                }
            })
            returnValue.push(objData)
        }
    }
    return returnValue
}

exports.getMemory=()=>{
    let diskValue = Buffer.from(execSync("free -k | awk 'NR<3'")).toString("ascii").split("\n")
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
               if (diskValue[0][i-1]&&i>0) {
                    objData[diskValue[0][i-1].replace(/[^a-zA-Z]+/g,"").toLocaleLowerCase()] = val
               }
            })
            return objData
       }
    }
}


function delta() {
    const cpus = os.cpus()
  
    return cpus.map(cpu => {
      const times = cpu.times
      return {
        tick: Object.keys(times).filter(time => time !== 'idle').reduce((tick, time) => { tick+=times[time]; return tick }, 0),
        idle: times.idle,
      }
    })
  }
  
let startMeasures = delta()
exports.cpu = ()=>{
    const endMeasures = delta()
    const percentageCPU = endMeasures.map((end, i) => {
      return +((end.tick - startMeasures[i].tick) / (end.idle - startMeasures[i].idle) * 100)
    })
    startMeasures = delta()
    const usage = ((percentageCPU.reduce((a,b)=>a+b,0))/100)*percentageCPU.length
    return { usage,total:percentageCPU.length,free:percentageCPU.length-usage}
}
