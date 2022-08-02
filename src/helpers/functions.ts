import { ElNotification } from "element-plus";

export function generateHash(): string {
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  const hash = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;//random number between 0 and 16
    if (d > 0) {//Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  console.log('Hash generated ' + hash);
  return hash;
}

export function dealWithError(exc: any) {
  console.log(exc);
  ElNotification({
    message: exc,
    type: 'error'
  })
}

/**
 * Results a random number from the ginen parameter as a limit
 * @param limit the max limit to return
 * @returns A random number from the ginen parameter
 */
export function chance(limit: number){
  const chance = Math.floor(Math.random() * limit)
  console.log(chance);
  return chance;
}