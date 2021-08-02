const { getDisk,getMemory,getIp,cpu} = require('./helpers')
const axios = require("axios")
const cron = require("node-cron")
require("dotenv").config()

cron.schedule("* * * * * *",async()=>{
  try {
    const getCpu = await cpu()
    const ram = getMemory()
    const ram_usage = (+ram.used)/1024/1024
    const ram_free = (+ram.free)/1024/1024
    const ram_total = (+ram.total)/1024/1024
    const hdd = getDisk().filter(val=>{
      return val.mounted=="/"
    })[0]
    const hdd_total = (+hdd?.kblocks||0)/1024/1024
    const hdd_usage = (+hdd?.used||0)/1024/1024
    const hdd_free = (+hdd?.available||0)/1024/1024
    const cpu_total = getCpu.total
    const cpu_usage = getCpu.usage
    const cpu_free = getCpu.free
    const data = {
      "ip": getIp(),
      ram_usage,
      ram_free,
      ram_total,
      cpu_total,
      cpu_free,
      cpu_usage,
      hdd_total,
      hdd_free,
      hdd_usage
  }
  console.log(data)
    return axios.post("https://dashboard-monitoring.redbox.id/api/server/agentupdate",data).then(res=>{
      console.log("response",res.data)
    }).catch(err=>{
      console.log("ERRR",err.response.data)
    })
  } catch (error) {
    console.log("errr",error)
  }
})